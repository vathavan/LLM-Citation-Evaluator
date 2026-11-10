# EvidenceCheck — Enhanced AI Explanation Verification Prototype

**README prose word count:** approximately 430 (excluding commands, file tree and links).

## Project status

A working browser prototype for students evaluating plausible but incorrect academic explanations. **Implemented:** two predefined learning cases; claim-level clickable citations; author-written source summaries; a reasoning box; a rule-based verification question; optional live AI verification question; error selection; confidence rating; deterministic scoring; and explanatory feedback. The evidence inspector and marking work with no API key. **Live AI is optional** and only works if the user supplies a valid OpenAI API key. A comparative study against a standard interface has **not** been implemented. No empirical improvement in student accuracy is claimed.

## Technology and architecture

- Python 3 standard library HTTP server (`app.py`): serves static files and provides endpoints `/api/cases`, `/api/prompt`, `/api/grade`.
- HTML, CSS and vanilla JavaScript (`index.html`, `static/`): browser interface and interaction state.
- JSON (`cases.json`): predefined explanations, sources, answer keys, safe simulation rules and feedback.
- Optional OpenAI Responses API (`OPENAI_MODEL`, default `gpt-4o-mini`): generates **one** source-directed verification question from student reasoning. It is not responsible for scoring.
- Simulation: explicit keyword rules generate a relevant prompt **without AI**. The UI always labels this mode.

The server removes answer keys and feedback from `/api/cases` until submission. This is an educational prototype, not a secure examination platform.

## Run locally

Requires Python 3.10+; **no package installation** for simulation.

```bash
python app.py
```

Visit **http://localhost:8000**. To enable live AI, set a key in your terminal **without committing it**:

**macOS/Linux:**
```bash
export OPENAI_API_KEY="your-own-key"
python app.py
```

**Windows PowerShell:**
```powershell
$env:OPENAI_API_KEY="your-own-key"
python app.py
```

Keys are read server-side. Never put them in browser JavaScript or GitHub. API calls may incur provider charges. If the AI request fails, the user is shown the error and may select simulation; there is no hidden fallback.

## Inspect and test

1. Pick a case and open one or more numbered citations.
2. Write at least ten characters of reasoning; choose simulation or live AI and request a verification question.
3. Select an incorrect claim and enter a confidence value.
4. Submit to reveal the stored ground truth, explanation, and interaction summary.

Run unit tests:

```bash
python -m unittest discover -s tests -v
```

For this prototype, passages are **short paraphrased evidence summaries** with links to original sources, not verified quotations from precise source offsets. Validate sources and exact passage mappings before research deployment. Student reasoning sent in live mode is shared with the chosen AI provider; avoid personal data.

## Development record

- **Commit 1 — backend:** fixed learning cases, per-claim source links, deterministic answer checking, and a bounded AI prompt endpoint. Rationale: ensure results have a known ground truth independent of model variability.
- **Commit 2 — interface:** source-inspection panel, reasoning input, clearly labelled coach mode, confidence rating and feedback. Rationale: make the evidence and user control visible.
- **Commit 3 — tests/docs:** document project scope, caveats, setup, AI assistance and runnable tests. Rationale: support independent inspection and reproducibility.

Find hashes with `git log --oneline`. The submission commit should be the last hash after your own review and changes. Publish to a **public GitHub repository** and place its URL in your report.

## AI assistance and review

ChatGPT helped draft the application structure, UI, sample learning cases, bounded prompt instructions, README and tests. Code paths and automated tests were inspected locally. The sources are linked but the paraphrases still require independent cross-checking against the original pages; any model-generated question also requires human review before a formal user study. The project author must verify the final functionality and report claims.

## Potential future work

Add more vetted topics, precise source passage offsets, consent and anonymised usage logging, usability testing, and a controlled baseline-interface comparison. Avoid interpreting source clicks alone as proof of accurate evaluation.
