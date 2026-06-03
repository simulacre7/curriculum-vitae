# Curriculum Vitae - Kihwan Kim

https://kihwan.kim

# Stack

- React
- Emotion
- Vite
- pnpm
- ESlint
- Prettier

# Getting started

```bash
pnpm install
pnpm dev
```

# Submission PDF

Generate submission PDFs from the Korean resume and the portfolio PDF in the sibling `pageagent-generative-ui-case-study` repository. The combined file and standalone portfolio include their own cover pages.

```bash
pnpm build:submission-pdf
```

Output:

```text
submission/KihwanKim_CV_and_Portfolio.pdf
submission/KihwanKim_CV.pdf
submission/KihwanKim_Portfolio.pdf
```

# Performance Audit

Run the focused regression audit before deployment:

```bash
pnpm audit:performance
```

It checks prerendered CV HTML, runtime locale requests, self-hosted font requests, font subset size, FCP, and CLS.

Generate supplemental Lighthouse reports:

```bash
pnpm audit:lighthouse
```

JSON reports are written to `.tmp-audit/lighthouse`. Lighthouse warnings are non-blocking by default; set `LIGHTHOUSE_STRICT=1` to fail on warning thresholds.

# License

MIT License.

You can create your own curriculum vitae or resume for free without notifying me by forking this project under the following conditions:

- Add a link to my homepage - https://kihwan.kim
- Do not use my personal information
  Check out LICENSE for more detail.
