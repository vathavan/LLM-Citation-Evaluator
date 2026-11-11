# EvidenceCheck — AI Explanation Verification Prototype

**README prose word count:** Approximately 650 words, excluding commands and links.

## Project status

EvidenceCheck is an intelligent interactive prototype designed to help students critically evaluate AI-generated explanations about unfamiliar academic topics.

**Implemented:**
- Two predefined academic cases containing deliberate factual errors.
- Clickable claim-level citations and supporting source summaries.
- Four-stage interface: Read & Inspect, Reflect, Decide and Review.
- Student reasoning input and optional AI verification coaching.
- Rule-based simulation mode without an API key.
- Confidence rating and deterministic correctness feedback.
- Contextual citation reminder that encourages students to inspect evidence before making a judgement.

**Planned:** Multi-turn AI coaching, additional academic topics, usability testing and comparison with a standard interface.

The prototype has not undergone a comparative user study. No improvement in student accuracy is claimed.

## Technology and architecture

- **Python 3:** Standard library HTTP server (`app.py`) with `/api/cases`, `/api/prompt` and `/api/grade` endpoints.
- **HTML, CSS and JavaScript:** Browser interface, stage navigation and interaction tracking.
- **JSON (`cases.json`):** Predefined explanations, source summaries, answer keys and feedback.
- **Groq API:** Optional live AI verification coach using the `openai/gpt-oss-20b` model by default.
- **Rule-based simulation:** Generates verification questions without external AI requests.

The language model generates a contextual question using student reasoning and source information. It does not determine whether the student's answer is correct. Grading uses predefined ground truth.

The system currently implements a user-triggered, single-turn AI coaching cycle rather than a fully autonomous agent loop.

## Running the prototype

Requires Python 3.10 or later. No additional Python packages are required for simulation mode.

```bash
python app.py
```

Open http://localhost:8000.

To enable live AI, provide your own Groq API key as an environment variable.

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

Never commit API keys to GitHub. Live AI requests may incur provider charges.

## How to use EvidenceCheck

1. **Read & Inspect:** Select an academic topic, read the explanation and optionally inspect numbered citations.
2. **Reflect:** Write initial reasoning and optionally request a verification question from the AI coach.
3. **Decide:** Identify the incorrect claim and rate confidence from 0–100%.
4. **Review:** Receive correctness feedback and review the evidence.

If students attempt to proceed to the judgement stage without inspecting any citations, the system presents a dismissible verification reminder.

Students can navigate backwards before submitting without losing their reasoning or source-inspection history.

## Testing

Run the automated tests:

```bash
python -m unittest discover -s tests -v
```

Manual testing should verify stage navigation, citation inspection, the reminder, live AI requests and correctness feedback.

Source passages are author-written summaries rather than verbatim quotations. Original sources should be checked before formal research use.

## Development record

**1. Initial backend and predefined cases**

Created academic explanations with deliberate errors, supporting citations and deterministic grading.

*Rationale:* Maintain known ground truth independently of language-model variability.

**2. Initial verification interface**

Developed the explanation panel, source inspector, reasoning input, confidence rating and feedback.

*Rationale:* Make evidence accessible and support independent student judgement.

**3. Adaptive AI verification coach**

Integrated Groq to generate contextual Socratic questions from student reasoning.

*Rationale:* Provide guidance responsive to the student's thinking without revealing the answer.

**4. Contextual citation reminder**

Introduced a dismissible reminder when students attempt to proceed without inspecting evidence.

*Rationale:* Encourage verification while preserving human agency and avoiding compulsory interaction.

**5. Four-stage interface redesign**

Reorganised the original scrolling interface into Read & Inspect, Reflect, Decide and Review.

*Rationale:* Apply progressive disclosure to reduce cognitive load and clarify the interaction sequence.

**Latest recorded commit:** `ff59158`

[View commit](https://github.com/vathavan/LLM-Citation-Evaluator/commit/ff59158)

## AI assistance

ChatGPT was used to support application development, JavaScript debugging, interface redesign, prompt construction, documentation and report drafting.

AI-generated suggestions were reviewed and adapted to the project's requirements, particularly the separation of AI coaching from deterministic grading and the decision to preserve optional source inspection.

The application should be tested locally, and source summaries checked against their original references before formal evaluation.

## Limitations and future work

The prototype uses predefined cases rather than dynamically generated explanations. Citation inspection is recorded, but opening a source does not establish that the student understood or evaluated it correctly.

A planned multi-turn agent loop could incorporate revised reasoning and citation-inspection history to provide further guidance. However, additional safeguards would be needed to prevent repetitive or misleading interventions.

Future work also includes user testing, confidence-calibration analysis, additional verified source passages and a controlled comparison against a standard interface.