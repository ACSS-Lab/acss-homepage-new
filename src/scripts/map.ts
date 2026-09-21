// Map card: provider pills switch between stacked map layers.
//
//   [data-map]
//     [data-map-tab="google|naver|kakao"]     pill; aria-pressed marks the active one
//     [data-map-layer="google|naver|kakao"]   layer; all but the active one are `hidden`
//
// The Kakao layer is built the first time it is shown. Kakao's embed snippet
// relies on document.write, which does nothing in a loaded page, so it runs
// inside a srcdoc iframe where it executes at parse time. In that context its
// script chain requests http:// URLs (blocked as mixed content), so
// document.write and script.src are patched to force https.
//
//   <div data-map-layer="kakao" data-kakao-timestamp data-kakao-key data-kakao-title>

// The srcdoc below needs script tags, but a literal closing script tag anywhere in
// this file would end the inline <script> that Astro bundles it into. Reading the
// tag name at runtime keeps the bundler from folding the pieces back together.
const SCRIPT = document.createElement('script').localName;

function renderKakao(host: HTMLElement): void {
  const { kakaoTimestamp: timestamp, kakaoKey: key, kakaoTitle: title } = host.dataset;
  if (!timestamp || !key || host.dataset.kakaoReady) return;
  host.dataset.kakaoReady = 'true';
  const width = String(Math.max(320, Math.round(host.clientWidth) || 640));
  const height = String(Math.max(240, Math.round(host.clientHeight) || 360));

  const iframe = document.createElement('iframe');
  iframe.title = title ?? '';
  iframe.srcdoc =
    '<!DOCTYPE html><html><head><meta charset="utf-8"><style>html,body{margin:0;height:100%;overflow:hidden}</style>' +
    `<${SCRIPT}>` +
    'var ow=document.write.bind(document);document.write=function(h){ow(String(h).split("http://").join("https://"));};' +
    'var oc=document.createElement.bind(document);var sd=Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype,"src");' +
    'document.createElement=function(tag){var el=oc(tag);if(String(tag).toLowerCase()==="script"){Object.defineProperty(el,"src",{get:function(){return sd.get.call(el)},set:function(v){sd.set.call(el,String(v).replace(/^http:\\/\\//,"https://"))}});}return el;};' +
    `</${SCRIPT}>` +
    '</head><body>' +
    `<div id="daumRoughmapContainer${timestamp}" class="root_daum_roughmap root_daum_roughmap_landing"></div>` +
    `<${SCRIPT} charset="UTF-8" src="https://ssl.daumcdn.net/dmaps/map_js_init/roughmapLoader.js"></${SCRIPT}>` +
    `<${SCRIPT} charset="UTF-8">` +
    'var t=setInterval(function(){' +
    'if(window.daum&&daum.roughmap&&daum.roughmap.Lander){clearInterval(t);' +
    `new daum.roughmap.Lander({timestamp:"${timestamp}",key:"${key}",mapWidth:"${width}",mapHeight:"${height}"}).render();}` +
    '},100);setTimeout(function(){clearInterval(t)},15000);' +
    `</${SCRIPT}>` +
    '</body></html>';
  host.appendChild(iframe);
}

export function initMap(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>('[data-map]').forEach((map) => {
    const tabs = map.querySelectorAll<HTMLElement>('[data-map-tab]');
    const layers = map.querySelectorAll<HTMLElement>('[data-map-layer]');

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const provider = tab.dataset.mapTab;
        tabs.forEach((t) => t.setAttribute('aria-pressed', String(t === tab)));
        layers.forEach((layer) => {
          layer.hidden = layer.dataset.mapLayer !== provider;
          if (!layer.hidden && provider === 'kakao') renderKakao(layer);
        });
      });
    });
  });
}
