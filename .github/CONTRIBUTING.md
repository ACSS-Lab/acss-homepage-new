# Homepage Update Request — SOP

This document describes how to submit update requests for the ACSS Lab homepage.  
All requests are managed through GitHub Issues using structured templates.

> Korean version: [한국어 안내 바로가기](./CONTRIBUTING.ko.md)

---

## Table of Contents

- [Homepage Update Request — SOP](#homepage-update-request--sop)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Request Types](#request-types)
  - [How to Submit a Request](#how-to-submit-a-request)
  - [Author Markup Conventions](#author-markup-conventions)
  - [After Submission](#after-submission)
  - [Notes](#notes)

---

## Overview

To keep the homepage accurate and up to date, all content changes — including paper additions, profile updates, and bug reports — must be submitted as a GitHub Issue using one of the provided templates.

Direct edits to the repository by non-maintainers are not accepted.  
After submitting your request, notify the GM (GitHub Manager) via Slack DM for faster processing.

---

## Request Types

Choose the template that best matches your request.

| Template | Use when... |
|---|---|
| **Add Paper** | You want to register a new publication on the homepage |
| **Update Paper Info** | A paper already on the homepage has incorrect or outdated information |
| **Add / Update Member Info** | You are a new member, or your profile needs to be updated |
| **General Request** | Anything else: broken links, bugs, news posts, design issues |

---

## How to Submit a Request

1. Go to the [Issues tab](https://github.com/ACSS-Lab/homepage/issues) of this repository.
2. Click **New Issue**.
3. Select the template that matches your request. Blank issues are disabled — you must use a template.
4. Fill in the title field. The prefix (e.g. `[Paper Add]`) is pre-filled; append a short description after it.  
   Example: `[Paper Add] BitTP - CVPR 2026`
5. Complete all required fields in the form. Optional fields can be left blank, but the more detail you provide, the faster the request will be processed.
6. Click **Submit new issue**.

---

## Author Markup Conventions

When filling in the author list for paper requests, use the following symbols appended directly after the author's name.

| Symbol | Meaning | Example |
|---|---|---|
| `**Name**` | Lab member (displayed in bold) | `**Mincheol Kang**` |
| `*` | First author or equal contribution | `Mincheol Kang*` |
| `†` | Corresponding author | `Soojean Han†` |

Symbols can be combined. A lab member who is also a co-first author would be written as `**Mincheol Kang***`.

*Full example:*

```
**Mincheol Kang***, *Gildong Hong*, **Soojean Han†**
```

---

## After Submission

- The maintainer will review your issue and may follow up with questions via comments.
- Once the update is applied, the issue will be closed with a reference to the relevant commit.
- If you need to make changes to your request after submitting, add a comment to the same issue rather than opening a new one.

There is no fixed SLA, but routine requests (paper additions, profile updates) are typically processed within a few business days.

---

## Notes

- For paper additions, attaching a public link (arXiv, CVF, IEEE Xplore, etc.) significantly speeds up processing.
- For member profile photos, please provide a square-cropped image if possible.
- If your request is urgent (e.g. a typo on the front page), set the priority to **High** in the General Request template and briefly explain the reason.
- Do not open duplicate issues. If a similar request already exists, add a comment to the existing issue instead.
