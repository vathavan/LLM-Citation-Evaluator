# EvidenceCheck

**AI Explanation Verification Prototype**

README prose word count: [Insert final word count]

## Project status

EvidenceCheck is an intelligent interactive web application designed to help students critically evaluate AI-generated explanations about unfamiliar academic topics.

The application provides two interface conditions using identical predefined explanations and answer keys.

### Standard interface

- Predefined academic explanations containing deliberate factual errors.
- Selection of the incorrect claim.
- Confidence rating from 0–100%.
- Deterministic correctness feedback.

### Enhanced interface

- Clickable claim-level citations and supporting source summaries.
- Four stages: Read & Inspect, Reflect, Decide and Review.
- Student reasoning input and optional AI verification coaching.
- Contextual verification questions generated using a Groq-hosted LLM.
- Proactive citation reminder when students proceed without inspecting evidence.
- Confidence rating and deterministic correctness feedback.
- Reversible navigation before submission.

The Enhanced interface is the main intelligent interactive contribution. The Standard interface provides a baseline for future evaluation.

**Planned:** User-selected academic topics, dynamic evidence retrieval, multi-turn AI coaching and comparative user testing.

## Technology and architecture

- **Python 3:** Standard-library HTTP server (`app.py`).
- **HTML, CSS and JavaScript:** Interface rendering, navigation and interaction tracking.
- **JSON (`cases.json`):** Predefined explanations, supporting evidence, answer keys and feedback.
- **Groq API:** Optional AI verification coaching using the `openai/gpt-oss-20b` model.

### Backend endpoints

| Endpoint | Purpose |
| --- | --- |
| `/api/cases` | Retrieves predefined academic cases. |
| `/api/grade` | Evaluates the student's selection against predefined ground truth. |
| `/api/prompt` | Generates a contextual AI verification question. |

Both interfaces share case data and deterministic grading. Only the Enhanced interface uses AI coaching.

The model receives the student's reasoning, explanation and supporting source summaries. Its instructions request a brief, non-leading verification question without revealing the answer.

The model does not determine correctness. The current design uses single-turn, student-initiated coaching rather than an autonomous agent loop.

## Running the application

Requires Python 3.10 or later. No additional Python packages are required.

### Start the server

From the project directory, run:

```bash
python app.py
```

Open [http://localhost:8000/](http://localhost:8000/) in a web browser.

Select either the Standard or Enhanced interface.

### Configure AI coaching

Provide your own Groq API key as an environment variable.

**Windows PowerShell:**

```powershell
$env:GROQ_API_KEY="your-own-key"
python app.py
```

**macOS/Linux:**

```bash
export GROQ_API_KEY="your-own-key"
python app.py
```

Never commit API keys to GitHub.

AI coaching is optional. If the external AI service is unavailable, students can continue independently using the remaining functionality.

## How to use EvidenceCheck

### Standard interface

1. Select an academic topic.
2. Read the explanation.
3. Identify the incorrect claim.
4. Rate confidence.
5. Submit and receive feedback.

### Enhanced interface

1. **Read & Inspect:** Read the explanation and optionally inspect numbered citations.
2. **Reflect:** Enter initial reasoning and optionally request an AI-generated verification question.
3. **Decide:** Identify the incorrect claim and rate confidence.
4. **Review:** Receive correctness feedback and revisit supporting evidence.

A proactive reminder appears if students attempt to enter Decide without opening citations. Students can review the evidence or continue anyway.

Backward navigation allows students to reconsider their reasoning before submitting without losing their progress.

Source summaries are author-written paraphrases rather than verbatim quotations.

## Testing

Run the automated tests:

```bash
python -m unittest discover -s tests -v
```

Manual testing should verify:

- Standard and Enhanced interface routing.
- Consistent case content and grading.
- Citation inspection and tracking.
- Proactive reminders and dismissibility.
- Backward navigation and progress preservation.
- Live AI question generation.
- Independent task completion when AI coaching is unavailable.

## Development record

The development of EvidenceCheck was informed by my Assignment 1 literature review, module concepts and lecturer feedback emphasising human-in-the-loop interaction, visibility, reversibility and the importance of excluding unnecessary functionality.

Subsequent lecturer feedback confirmed the suitability of the proposed contribution and recommended focusing on the design of the Enhanced interface, using module concepts to justify decisions through use cases.

### 1. Predefined cases and deterministic grading

**Change:** Created predefined academic explanations containing deliberate factual errors, supporting evidence, answer keys and explanatory feedback.

**Rationale:** Maintain consistent ground truth independently of LLM variability and separate correctness assessment from generative AI guidance.

**Checks:** Verify that both correct and incorrect selections produce the expected feedback and that confidence ratings are accepted within the permitted range.

**Commit:** [Add deterministic case data, grading API, and bounded AI prompt endpoint](https://github.com/vathavan/LLM-Citation-Evaluator/commit/17e7a9b2f407af78f7905172d5fee0ccabba2e39)

### 2. Clickable citations and source inspection

**Change:** Developed claim-level clickable citations, source summaries, original source links, reasoning input and confidence ratings.

**Rationale:** Make supporting evidence accessible while encouraging students to evaluate individual claims independently. Source summaries are author-written paraphrases rather than verbatim quotations.

**Checks:** Verify that selecting a citation displays its associated source summary and that opening the same citation repeatedly does not increase the number of unique citations inspected.

**Commit:** [Build responsive student study flow, source inspector, coaching and grading UI](https://github.com/vathavan/LLM-Citation-Evaluator/commit/a77dfa76c9bd29eea75846e4615f635f9cd923e2)

### 3. Contextual AI coaching

**Change:** Replaced fixed verification prompts with contextual questions generated by a Groq-hosted language model. The model receives the student's reasoning, the explanation and curated source summaries.

**Rationale:** The original fixed prompts could not respond to individual reasoning. Context engineering allows guidance to be tailored to the student's input while maintaining human control. The model is instructed to generate one brief verification question without revealing the answer.

**Checks:** Request questions using different reasoning inputs and assess their relevance, length and whether they reveal the correct answer.

**Relevant commits:**

- [Add deterministic case data, grading API, and bounded AI prompt endpoint](https://github.com/vathavan/LLM-Citation-Evaluator/commit/17e7a9b2f407af78f7905172d5fee0ccabba2e39)
- [Update EvidenceCheck with staged interface and AI verification features](https://github.com/vathavan/LLM-Citation-Evaluator/commit/ff591582e576c224317a87d6f8eb44f54ca9c779)

### 4. Proactive citation reminder

**Change:** Introduced a rule-based reminder when students attempt to enter the Decide stage without opening any citations.

**Rationale:** The original reactive interface made evidence available but did not actively encourage its inspection. The reminder applies mixed initiative and context-sensitive timing while allowing students to dismiss the intervention and continue independently.

**Checks:** Verify that the reminder appears when no citations have been opened, does not appear after citation inspection and appears only once per activity. Check both reminder options.

**Commit:** [Update EvidenceCheck with staged interface and AI verification features](https://github.com/vathavan/LLM-Citation-Evaluator/commit/ff591582e576c224317a87d6f8eb44f54ca9c779)

### 5. Four-stage interface and reversible navigation

**Change:** Reorganised the original scrolling interface into four stages: Read & Inspect, Reflect, Decide and Review. Added visible progress indicators and backward navigation.

**Rationale:** Presenting one task at a time reduces competing information and is intended to reduce unnecessary cognitive load. Lecturer feedback emphasising visibility and reversibility informed the provision of progress indicators and opportunities to reconsider reasoning before submission.

**Checks:** Navigate between stages and verify that reasoning, citation-inspection history, claim selection and confidence are preserved appropriately before submission.

**Relevant commits:**

- [Update EvidenceCheck with staged interface and AI verification features](https://github.com/vathavan/LLM-Citation-Evaluator/commit/ff591582e576c224317a87d6f8eb44f54ca9c779)
- [Update README with staged interface and development record](https://github.com/vathavan/LLM-Citation-Evaluator/commit/406f255b3b9b64d5ce649393bab4c155a1509b51)

### 6. Addition of the Standard interface

**Change:** Introduced an interface-selection page and a Standard interface that shares the same academic cases, confidence ratings and deterministic grading as the Enhanced interface.

**Rationale:** Provide a baseline for comparison without duplicating the assessment backend. Following lecturer feedback, the Enhanced interface remains the main intelligent interactive contribution.

**Checks:** Verify that both interfaces load successfully, present identical case content and provide consistent correctness feedback for identical selections.

**Commit:** Pending final implementation commit.

### 7. Removal of rule-based coaching simulation

**Change:** Removed the simulated coaching mode and its associated interface selector. Retained optional live LLM-generated coaching and the separate rule-based citation reminder.

**Rationale:** Simulated coaching was initially included to demonstrate the guidance interaction without API access. However, it introduced an additional interface choice without directly contributing to the research problem. Removing it also reflects lecturer feedback on excluding unnecessary functionality.

**Checks:** Verify that the simulation selector is no longer displayed, live AI coaching remains functional and students can complete the activity independently when AI assistance is unavailable.

**Commit:** Pending final implementation commit.

### 8. Documentation and automated testing

**Change:** Added reproducible setup instructions, documented the intended boundaries of AI coaching and introduced automated tests.

**Rationale:** Improve reproducibility and make the implementation easier to inspect and evaluate.

**Checks:** Run the automated test suite against the final implementation and record the results. Update any tests that still depend on the removed simulation mode.

**Commit:** [Document reproducible setup, AI boundaries and development evidence; add unit tests](https://github.com/vathavan/LLM-Citation-Evaluator/commit/3ff587008d61d3d4df71bdeb99f688df55bfdb2d)

## AI assistance

ChatGPT was used to support application development, debugging, interface design, prompt construction, documentation and report drafting.

| Task | AI assistance | Application and adaptation | Verification |
| --- | --- | --- | --- |
| Backend development | Assistance with Python endpoints, case data and grading logic. | Retained deterministic grading to separate correctness assessment from AI coaching. | Check grading against predefined answer keys and run automated tests. |
| AI verification coaching | Assistance with Groq API integration. | Restricted the intended coaching role to brief contextual questions rather than providing answers. | Inspect generated questions for relevance and unintended answer disclosure. |
| Interface development | Suggestions for HTML, CSS, JavaScript, staged navigation and interaction tracking. | Adapted the interface to provide four stages, reversible navigation and optional guidance. | Check navigation, state preservation and citation tracking. |
| Documentation and storyboards | Assistance with README organisation and storyboard illustrations. | Created my own storyboards and scenarios but used AI to improve their visual presentation. | Compared illustrations against the final application and checked that README revisions preserved the intended content. |

AI-generated suggestions were treated as development assistance rather than automatically accepted solutions. Final design decisions remained my responsibility.

## Limitations and future work

EvidenceCheck currently uses two predefined academic cases, providing consistent ground truth but limiting the range of learning topics. Citation inspection is recorded, although opening a citation does not demonstrate that the student understood its evidence.

LLM-generated verification questions may vary in quality despite prompt constraints. Future development could introduce additional output validation to identify unsuitable questions before displaying them.

User-selected academic topics and dynamic evidence retrieval could extend the prototype, requiring safeguards for source reliability, provenance, factual accuracy and consistent grading. Multi-turn coaching could also support iterative reflection while preserving student control.

The Standard interface provides a comparison baseline. As the Enhanced interface incorporates several verification features, any comparison would assess their combined effect rather than isolate individual contributions.
