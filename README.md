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

# Case study

`public/case-studies/pageagent.html` holds the software engineering case studies. It is served at https://kihwan.kim/case-studies/pageagent.html, linked from the PageAgent project entry in both locales, and printed to PDF as the portfolio half of the submission files. Edit that file directly; there is no second copy to keep in sync.

Print it on its own when you only need the case study PDF:

```bash
pnpm build:case-study-pdf
```

The PDF lands in `.tmp-submission/` by default. Set `CASE_STUDY_PDF_OUT` to write it elsewhere.

# Submission PDF

Generate submission PDFs from the Korean resume and the case study. The combined file and standalone portfolio include their own cover pages.

```bash
pnpm build:submission-pdf
```

Output:

```text
submission/KihwanKim_CV_and_Portfolio.pdf
submission/KihwanKim_CV.pdf
submission/KihwanKim_Portfolio.pdf
```

Both commands render through headless Chrome, Chromium, or Edge. Set `CHROME_PATH` when the browser executable is not found automatically.

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
The site keeps its existing accent color, so `color-contrast` is ignored in the Lighthouse warning gate while remaining visible in the raw JSON report.

# License

MIT License.

You can create your own curriculum vitae or resume for free without notifying me by forking this project under the following conditions:

- Add a link to my homepage - https://kihwan.kim
- Do not use my personal information
  Check out LICENSE for more detail.
