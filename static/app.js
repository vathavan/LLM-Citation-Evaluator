
'use strict';

const $ = id => document.getElementById(id);

let cases = [];
let current = null;
let inspected = new Set();
let submitted = false;
let coached = false;
let reminderShown = false;
let activeStage = 0;
let activityVersion = 0;

const stageIds = [
  'stageRead',
  'stageReflect',
  'stageDecide',
  'stageReview'
];

const stepIds = [
  'stepA',
  'stepB',
  'stepC',
  'stepD'
];

async function request(path, body) {
  const response = await fetch(path, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(body)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
}

function node(tag, cls, text) {
  const element = document.createElement(tag);

  if (cls) element.className = cls;
  if (text !== undefined) element.textContent = text;

  return element;
}

// Show only one stage at a time.
function showStage(stage) {
  if (stage < 0 || stage > 3) return;

  // The review stage is only accessible after submission.
  if (stage === 3 && !submitted) return;

  activeStage = stage;

  stageIds.forEach((id, index) => {
    $(id).hidden = index !== stage;
  });

  stepIds.forEach((id, index) => {
    const element = $(id);

    element.classList.toggle('active', index === stage);
    element.classList.toggle('completed', index < stage);

    if (index === stage) {
      element.setAttribute('aria-current', 'step');
    } else {
      element.removeAttribute('aria-current');
    }
  });

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

// Open evidence and record the source inspected.
function showEvidence(source) {
  inspected.add(source.id);

  $('sourceEmpty').hidden = true;
  $('sourceDetail').hidden = false;

  $('sourceTitle').textContent = source.title;
  $('sourceSummary').textContent = source.summary;
  $('sourceLink').href = source.url;

  $('viewCount').textContent = `${inspected.size} checked`;

  document.querySelectorAll('.cite').forEach(element => {
    element.classList.toggle(
      'selected',
      element.dataset.source === source.id
    );
  });
}

// Reset the activity.
function loadCase() {
  if (!cases.length) return;

  activityVersion++;

  current = cases.find(c => c.id === $('caseSelect').value) || cases[0];

  inspected = new Set();
  submitted = false;
  coached = false;
  reminderShown = false;

  if ($('citationReminder').open) {
    $('citationReminder').close();
  }

  $('caseTitle').textContent = current.title;

  $('sourceEmpty').hidden = false;
  $('sourceDetail').hidden = true;
  $('viewCount').textContent = '0 checked';

  $('coachBox').hidden = true;
  $('reasoning').value = '';
  $('coachStatus').textContent = '';
  $('reflectStatus').textContent = '';
  $('submitStatus').textContent = '';

  $('result').hidden = true;
  $('result').classList.remove('incorrect');

  $('confidence').value = 50;
  $('confidenceValue').textContent = '50%';

  $('submitBtn').disabled = false;
  $('promptBtn').disabled = false;

  $('claims').replaceChildren();
  $('choices').replaceChildren();

  current.claims.forEach((claim, index) => {
    const source = current.sources.find(
      s => s.claim_id === claim.id
    );

    // Explanation claim.
    const line = node('div', 'claim');

    line.append(
      node('b', '', String(index + 1).padStart(2, '0'))
    );

    line.append(
      node('span', 'claimtext', claim.text)
    );

    if (source) {
      const citation = node('button', 'cite', `[${index + 1}]`);

      citation.type = 'button';
      citation.dataset.source = source.id;

      citation.setAttribute(
        'aria-label',
        `Inspect supporting evidence for claim ${index + 1}`
      );

      citation.addEventListener('click', () => {
        showEvidence(source);
      });

      line.append(citation);
    }

    $('claims').append(line);

    // Answer option.
    const label = node('label', 'choice');
    const radio = document.createElement('input');

    radio.type = 'radio';
    radio.name = 'claimChoice';
    radio.value = claim.id;

    label.append(
      radio,
      node('span', '', `Claim ${index + 1}: ${claim.text}`)
    );

    $('choices').append(label);
  });

  showStage(0);
}

// Step 1 -> Step 2
$('readNext').addEventListener('click', () => {
  if (submitted) {
    showStage(3);
  } else {
    showStage(1);
  }
});

// Step 2 -> Step 1
$('reflectBack').addEventListener('click', () => {
  showStage(0);
});

// Step 2 -> Step 3
$('reflectNext').addEventListener('click', () => {
  const reasoning = $('reasoning').value.trim();

  if (reasoning.length < 10) {
    $('reflectStatus').textContent =
      'Write at least 10 characters of initial reasoning before continuing.';
    $('reasoning').focus();
    return;
  }

  $('reflectStatus').textContent = '';

  // Proactive reminder when no sources have been inspected.
  if (inspected.size === 0 && !reminderShown) {
    reminderShown = true;
    $('citationReminder').showModal();
    return;
  }

  showStage(2);
});

// Reminder: return to evidence.
$('reviewCitations').addEventListener('click', () => {
  $('citationReminder').close();
  showStage(0);
});

// Reminder: student retains control.
$('continueAnyway').addEventListener('click', () => {
  $('citationReminder').close();
  showStage(2);
});

// Step 3 -> Step 2
$('decideBack').addEventListener('click', () => {
  showStage(1);
});

// Return to citations from Step 3.
$('decideReviewSources').addEventListener('click', () => {
  showStage(0);
});

// Return to citations from the AI coach.
$('coachReviewSources').addEventListener('click', () => {
  showStage(0);
});

// Confidence display.
$('confidence').addEventListener('input', () => {
  $('confidenceValue').textContent =
    $('confidence').value + '%';
});

// Generate a verification question.
$('promptBtn').addEventListener('click', async () => {
  const reasoning = $('reasoning').value.trim();

  if (reasoning.length < 10) {
    $('coachStatus').textContent =
      'Write at least 10 characters first.';
    return;
  }

  const version = activityVersion;
  const caseId = current.id;

  $('promptBtn').disabled = true;
  $('coachStatus').textContent = 'Generating question…';

  try {
    const data = await request('/api/prompt', {
      case_id: caseId,
      reasoning,
      mode: $('modeSelect').value
    });

    // Ignore responses from an activity that was restarted.
    if (version !== activityVersion) return;

    $('coachPrompt').textContent = data.prompt;
    $('coachLabel').textContent = '· ' + data.mode_label;

    $('coachBox').hidden = false;
    $('coachStatus').textContent = '';

    coached = true;
  } catch (error) {
    if (version === activityVersion) {
      $('coachStatus').textContent = error.message;
    }
  } finally {
    if (version === activityVersion) {
      $('promptBtn').disabled = false;
    }
  }
});

// Submit final judgement.
$('submitBtn').addEventListener('click', async () => {
  if (submitted) return;

  const answer = document.querySelector(
    'input[name="claimChoice"]:checked'
  );

  if (!answer) {
    $('submitStatus').textContent =
      'Select a claim before submitting.';
    return;
  }

  const version = activityVersion;
  const caseId = current.id;

  $('submitStatus').textContent = '';
  $('submitBtn').disabled = true;

  try {
    const data = await request('/api/grade', {
      case_id: caseId,
      claim_id: answer.value,
      confidence: Number($('confidence').value)
    });

    if (version !== activityVersion) return;

    submitted = true;

    $('result').hidden = false;
    $('result').classList.toggle(
      'incorrect',
      !data.correct
    );

    $('resultHeading').textContent = data.correct
      ? '✓ Correctly identified'
      : '↻ Not quite — review the evidence';

    $('resultText').textContent = data.feedback;

    const correctIndex = current.claims.findIndex(
      claim => claim.id === data.correct_claim_id
    ) + 1;

    $('resultMeta').textContent =
      `Correct answer: Claim ${correctIndex} · ` +
      `Your confidence: ${data.confidence}% · ` +
      `Sources inspected: ${inspected.size}/${current.sources.length} · ` +
      `Coach used: ${coached ? 'yes' : 'no'}`;

    showStage(3);
  } catch (error) {
    if (version === activityVersion) {
      $('submitStatus').textContent = error.message;
      $('submitBtn').disabled = false;
    }
  }
});

// Review stage actions.
$('reviewEvidence').addEventListener('click', () => {
  showStage(0);
});

$('reviewRestart').addEventListener('click', () => {
  loadCase();
});

// Restart and topic changes.
$('restart').addEventListener('click', loadCase);
$('caseSelect').addEventListener('change', loadCase);

// Initial data loading.
(async () => {
  try {
    const response = await fetch('/api/cases');

    if (!response.ok) {
      throw new Error('Could not load cases');
    }

    const data = await response.json();

    cases = data.cases;

    cases.forEach(caseItem => {
      const option = document.createElement('option');

      option.value = caseItem.id;
      option.textContent =
        `${caseItem.topic} — ${caseItem.title}`;

      $('caseSelect').append(option);
    });

    if (!data.ai_available) {
      $('modeSelect').querySelector(
        '[value="live"]'
      ).textContent =
        'Live AI (requires API key — not configured)';
    }

    loadCase();
  } catch (error) {
    $('caseTitle').textContent =
      'Unable to load activity: ' + error.message;
  }
})();
