// Typewriter headline. The full headline is rendered in the HTML; this rewrites
// its text nodes in place (so inline markup such as italics survives) to loop:
//   type the intro -> hold -> erase -> type the headline -> hold -> erase
// Skipped entirely under prefers-reduced-motion, leaving the static headline.
//
//   <h1 data-typewriter data-typing-intro="Our Vision" data-typing-speed="42">

import { prefersReducedMotion } from './util';

const HOLD_INTRO_MS = 1100;
const HOLD_HEADLINE_MS = 3200;
const GAP_AFTER_INTRO_MS = 260;
const GAP_AFTER_HEADLINE_MS = 400;
const START_DELAY_MS = 320;
const PUNCTUATION_PAUSE = 7; // dwell this many times longer after "," and "."

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

function run(el: HTMLElement): void {
  const intro = el.dataset.typingIntro ?? '';
  const speed = Math.max(8, Number(el.dataset.typingSpeed) || 42);
  const erase = Math.max(6, Math.round(speed * 0.45));

  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const nodes: { node: Text; text: string }[] = [];
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    nodes.push({ node: node as Text, text: node.nodeValue ?? '' });
  }
  if (nodes.length === 0) return;

  const fullText = nodes.map((x) => x.text).join('');
  const caret = document.createElement('span');
  caret.setAttribute('aria-hidden', 'true');
  caret.setAttribute('data-caret', '');

  const placeCaretAfter = (node: Text) => {
    if (caret.previousSibling !== node) node.parentNode?.insertBefore(caret, node.nextSibling);
  };
  const clear = () => nodes.forEach((x) => (x.node.nodeValue = ''));

  /** Show the first `count` characters of the headline, spread across its text nodes. */
  const showHeadline = (count: number) => {
    let left = count;
    let last = nodes[0].node;
    for (const x of nodes) {
      const take = Math.max(0, Math.min(x.text.length, left));
      x.node.nodeValue = x.text.slice(0, take);
      if (take > 0) last = x.node;
      left -= take;
    }
    placeCaretAfter(last);
  };
  const showIntro = (count: number) => {
    clear();
    nodes[0].node.nodeValue = intro.slice(0, count);
    placeCaretAfter(nodes[0].node);
  };
  const pauseAt = (count: number) => (',.'.includes(fullText[count - 1]) ? speed * PUNCTUATION_PAUSE : speed);

  const step = async (show: (count: number) => void, count: number, ms: number) => {
    show(count);
    await wait(ms);
  };

  const loop = async () => {
    clear();
    await wait(START_DELAY_MS);
    while (el.isConnected) {
      for (let k = 1; k <= intro.length; k++) await step(showIntro, k, speed);
      await wait(HOLD_INTRO_MS);
      for (let k = intro.length - 1; k >= 0; k--) await step(showIntro, k, erase);
      await wait(GAP_AFTER_INTRO_MS);
      for (let k = 1; k <= fullText.length; k++) await step(showHeadline, k, pauseAt(k));
      await wait(HOLD_HEADLINE_MS);
      for (let k = fullText.length - 1; k >= 0; k--) await step(showHeadline, k, erase);
      await wait(GAP_AFTER_HEADLINE_MS);
    }
  };
  void loop();
}

export function initTypewriter(root: ParentNode = document): void {
  if (prefersReducedMotion()) return;
  root.querySelectorAll<HTMLElement>('[data-typewriter]').forEach(run);
}
