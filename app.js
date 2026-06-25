'use strict';

// ── Storage ───────────────────────────────────────────────────────
const LS = {
  get: k => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
  set: (k,v) => localStorage.setItem(k, JSON.stringify(v)),
};

// ── Protocols ─────────────────────────────────────────────────────
// Each step: { instruction, detail, type: 'read'|'timer'|'breathe'|'write'|'choice', duration (seconds), choices[] }

const PROTOCOLS = {

  brainfog: {
    name: 'Brain Fog',
    intro: 'Something physical is slowing your brain down. These steps fix the most common causes.',
    steps: [
      {
        instruction: 'Drink water. Right now.',
        detail: 'Not later. Dehydration reduces blood flow to the brain. Stand up, get a glass of water, and drink it before moving to the next step.',
        type: 'read',
      },
      {
        instruction: 'Three slow breaths.',
        detail: 'This increases oxygen to your brain immediately.',
        type: 'breathe',
        cycles: 3,
      },
      {
        instruction: 'Stand up and move for 2 minutes.',
        detail: 'Walk around wherever you are. Pace, stretch your neck, roll your shoulders. You don\'t need privacy for this. Just move your body.',
        type: 'timer',
        duration: 120,
      },
      {
        instruction: 'Name ONE thing to do next.',
        detail: 'Not a list. Not a plan. One thing. Write it below — even just two or three words.',
        type: 'write',
        placeholder: 'One thing only…',
      },
      {
        instruction: 'Do that one thing. Start in the next 60 seconds.',
        detail: 'The fog doesn\'t fully clear until you start moving. Start with 5 minutes. That\'s all.',
        type: 'timer',
        duration: 60,
      },
    ],
    done: 'You went through the steps. The fog may not be fully gone, but you\'ve done what you can physically. Start the one task.',
  },

  anxiety: {
    name: 'Anxiety',
    intro: 'Your nervous system is activated. These steps bring it back down in order.',
    steps: [
      {
        instruction: 'What is your body doing right now?',
        detail: 'Don\'t judge it. Just observe. Tight chest, fast heart, tense jaw, shallow breath — write what you notice.',
        type: 'write',
        placeholder: 'My body right now: …',
      },
      {
        instruction: 'Slow your breathing down.',
        detail: 'This directly signals your nervous system to calm. Follow the circle.',
        type: 'breathe',
        cycles: 5,
      },
      {
        instruction: 'Name 5 things you can see from where you are.',
        detail: 'Say them out loud or type them. This forces your brain into the present moment and away from the loop.',
        type: 'write',
        placeholder: '1.\n2.\n3.\n4.\n5.',
      },
      {
        instruction: 'What is the actual worst that happens?',
        detail: 'Write the specific fear — not a vague dread. Name it precisely. Vague anxiety is worse than a named problem.',
        type: 'write',
        placeholder: 'The actual thing I\'m afraid of is…',
      },
      {
        instruction: 'Is there anything you can do about it right now?',
        detail: 'If yes — write what. If no — write "nothing right now" and accept that the worry is noise.',
        type: 'write',
        placeholder: 'Right now I can…',
      },
    ],
    done: 'Anxiety doesn\'t switch off completely — but you\'ve interrupted the loop. Your nervous system is slower now than when you started.',
  },

  anger: {
    name: 'Anger',
    intro: 'Anger is physical first. You need to discharge it before thinking clearly.',
    steps: [
      {
        instruction: 'Cold water on your face or wrists.',
        detail: 'Splash cold water on your face or run cold water over your wrists for 30 seconds. This activates the dive reflex and immediately slows your heart rate. Go do it, then come back.',
        type: 'read',
      },
      {
        instruction: 'Breathe out longer than you breathe in.',
        detail: 'Long exhale = calmer. Short inhale, long slow exhale. Follow the circle.',
        type: 'breathe',
        cycles: 4,
      },
      {
        instruction: 'What exactly happened?',
        detail: 'Not what you felt. What literally happened — facts only. Write it in one or two sentences.',
        type: 'write',
        placeholder: 'What happened: …',
      },
      {
        instruction: 'What do you actually want to happen now?',
        detail: 'Not revenge or to vent. What actual outcome do you want from this situation?',
        type: 'write',
        placeholder: 'What I actually want is…',
      },
      {
        instruction: 'Is there one small action you can take toward that?',
        detail: 'Or — can you choose to let it go for now and return to it later when you\'re clearer? Both are valid.',
        type: 'write',
        placeholder: 'I can…',
      },
    ],
    done: 'You processed it instead of reacting. That\'s the harder thing to do. Whatever you do next — do it from this state, not from where you started.',
  },

  burnout: {
    name: 'Burnout',
    intro: 'You\'re running on empty. This isn\'t about pushing through — it\'s about stopping correctly.',
    steps: [
      {
        instruction: 'Stop. You have permission to stop.',
        detail: 'Not forever. For this window of time, right now, you are allowed to stop. Nothing is going to collapse in the next 10 minutes.',
        type: 'read',
      },
      {
        instruction: 'What does your body need most right now?',
        detail: 'Pick the most honest answer.',
        type: 'choice',
        choices: ['Sleep or rest', 'Food or water', 'To be left alone', 'To talk to someone', 'Just to sit quietly'],
      },
      {
        instruction: 'Breathe. Just breathe for two minutes.',
        detail: 'Don\'t do anything. Don\'t think about your tasks. Just follow the circle.',
        type: 'breathe',
        cycles: 6,
      },
      {
        instruction: 'What is ONE thing you can remove from today?',
        detail: 'Not forever. Just today. Something you were going to do that you can push or skip. Write it.',
        type: 'write',
        placeholder: 'I can skip or delay…',
      },
      {
        instruction: 'What is the absolute minimum you must do today?',
        detail: 'Strip everything else. Write only the things that will actually break something if they don\'t happen today.',
        type: 'write',
        placeholder: 'Must do today:\n-\n-',
      },
    ],
    done: 'You\'ve stopped and assessed. Do only what you wrote in that last step today. Everything else can wait.',
  },

  lowmood: {
    name: 'Low Mood',
    intro: 'Low mood is not a problem to solve right now. These steps are about stability, not a fix.',
    steps: [
      {
        instruction: 'You don\'t have to feel better right now.',
        detail: 'Low mood is not an emergency. It\'s not permanent. You don\'t need to fix it this moment. Just get through the next few minutes.',
        type: 'read',
      },
      {
        instruction: 'Are you physically okay right now?',
        detail: 'Have you eaten anything in the last several hours? Had any water? Check this — physical neglect amplifies low mood significantly.',
        type: 'choice',
        choices: ['Eaten and hydrated', 'Eaten but no water', 'Haven\'t eaten yet', 'Can\'t remember'],
      },
      {
        instruction: 'Slow your breathing.',
        detail: 'Not to feel better — just to slow down. Follow the circle.',
        type: 'breathe',
        cycles: 4,
      },
      {
        instruction: 'Write what\'s there.',
        detail: 'No goal. No insight needed. Just what\'s actually in your head right now, as it is.',
        type: 'write',
        placeholder: 'Right now I feel…',
      },
      {
        instruction: 'Name one thing you can do in the next hour that\'s small and neutral.',
        detail: 'Not something to make you happy. Something ordinary — make tea, wash your face, walk to another room. Small movement prevents the mood from deepening.',
        type: 'write',
        placeholder: 'One small thing…',
      },
    ],
    done: 'You didn\'t fix it — and that\'s not the goal. You stayed with it and kept moving. That\'s enough for now.',
  },

};

// Intensity → protocol mapping
function intensityToProtocol(n) {
  if (n <= 3) return 'lowmood';
  if (n <= 5) return 'brainfog';
  if (n <= 7) return 'anxiety';
  if (n <= 9) return 'anger';
  return 'burnout'; // 10 = completely overwhelmed → stop & reset
}

// ── State ─────────────────────────────────────────────────────────
let currentProtocol = null;
let currentStepIdx = 0;
let sessionIntensity = 0;
let breathInterval = null;
let timerInterval = null;
let breathCycleCount = 0;
let breathPhase = 0; // 0=inhale 1=hold 2=exhale
const BREATH_PHASES = [
  { label: 'inhale',  word: 'breathe in',  cls: 'inhale', dur: 4000 },
  { label: 'hold',    word: 'hold',         cls: 'hold',   dur: 4000 },
  { label: 'exhale',  word: 'breathe out', cls: 'exhale', dur: 6000 },
];

// ── Screen Management ─────────────────────────────────────────────
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-' + id).classList.add('active');
}

// ── Entry Screen ──────────────────────────────────────────────────
document.querySelectorAll('.intensity-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const n = parseInt(btn.dataset.val);
    sessionIntensity = n;
    startProtocol(intensityToProtocol(n));
  });
});

document.querySelectorAll('.state-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    sessionIntensity = 0;
    startProtocol(btn.dataset.protocol);
  });
});

document.getElementById('open-log-btn').addEventListener('click', () => {
  renderLog();
  showScreen('log');
});

// ── Protocol Runner ───────────────────────────────────────────────
function startProtocol(key) {
  currentProtocol = PROTOCOLS[key];
  currentProtocol._key = key;
  currentStepIdx = 0;
  stopTimer(); stopBreath();
  showScreen('protocol');
  renderStep();
}

function renderStep() {
  const steps = currentProtocol.steps;
  const step = steps[currentStepIdx];
  const total = steps.length;

  // Header
  document.getElementById('proto-name').textContent = currentProtocol.name;
  document.getElementById('step-counter').textContent = `${currentStepIdx + 1} / ${total}`;
  document.getElementById('step-number').textContent = `Step ${currentStepIdx + 1}`;
  document.getElementById('step-instruction').textContent = step.instruction;
  document.getElementById('step-detail').textContent = step.detail;

  // Hide all blocks
  ['timer-block','breath-block','write-block','choice-block'].forEach(id =>
    document.getElementById(id).classList.add('hidden')
  );

  // Show next button
  document.getElementById('next-btn').textContent = currentStepIdx < total - 1 ? 'Done — next step' : 'Finish';
  document.getElementById('next-btn').disabled = false;

  // Type-specific
  if (step.type === 'timer') {
    document.getElementById('timer-block').classList.remove('hidden');
    startTimer(step.duration);
  } else if (step.type === 'breathe') {
    document.getElementById('breath-block').classList.remove('hidden');
    resetBreathUI();
    startBreath(step.cycles || 4);
  } else if (step.type === 'write') {
    document.getElementById('write-block').classList.remove('hidden');
    document.getElementById('write-input').value = '';
    document.getElementById('write-input').placeholder = step.placeholder || 'Write here…';
    setTimeout(() => document.getElementById('write-input').focus(), 300);
  } else if (step.type === 'choice') {
    document.getElementById('choice-block').classList.remove('hidden');
    const container = document.getElementById('choice-options');
    container.innerHTML = '';
    step.choices.forEach(ch => {
      const btn = document.createElement('button');
      btn.className = 'choice-opt';
      btn.textContent = ch;
      btn.addEventListener('click', () => {
        container.querySelectorAll('.choice-opt').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
      });
      container.appendChild(btn);
    });
  }

  // Scroll top
  document.getElementById('screen-protocol').scrollTo({ top: 0, behavior: 'smooth' });
}

function nextStep() {
  stopTimer(); stopBreath();

  // Save write content if any
  const writeVal = document.getElementById('write-input').value.trim();

  currentStepIdx++;
  if (currentStepIdx >= currentProtocol.steps.length) {
    finishProtocol();
  } else {
    renderStep();
  }
}

function finishProtocol() {
  stopTimer(); stopBreath();
  // Save to log
  const log = LS.get('sessions') || [];
  log.unshift({
    protocol: currentProtocol._key,
    name: currentProtocol.name,
    intensity: sessionIntensity,
    date: new Date().toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }),
    ts: Date.now(),
  });
  LS.set('sessions', log.slice(0, 50));

  document.getElementById('done-title').textContent = currentProtocol.name + ' — done.';
  document.getElementById('done-body').textContent = currentProtocol.done;
  showScreen('done');
}

document.getElementById('next-btn').addEventListener('click', nextStep);
document.getElementById('skip-btn').addEventListener('click', () => {
  stopTimer(); stopBreath();
  currentStepIdx++;
  if (currentStepIdx >= currentProtocol.steps.length) finishProtocol();
  else renderStep();
});
document.getElementById('proto-back').addEventListener('click', () => {
  stopTimer(); stopBreath();
  showScreen('entry');
});
document.getElementById('done-again').addEventListener('click', () => startProtocol(currentProtocol._key));
document.getElementById('done-home').addEventListener('click', () => showScreen('entry'));

// ── Timer ─────────────────────────────────────────────────────────
function startTimer(seconds) {
  let remaining = seconds;
  const circumference = 2 * Math.PI * 52; // r=52
  const ring = document.getElementById('ring-fill');
  ring.style.strokeDasharray = circumference;
  ring.style.strokeDashoffset = 0;

  function update() {
    document.getElementById('timer-num').textContent = formatTime(remaining);
    const progress = (seconds - remaining) / seconds;
    ring.style.strokeDashoffset = circumference * (1 - progress);
    if (remaining <= 0) {
      stopTimer();
      document.getElementById('next-btn').textContent = currentStepIdx < currentProtocol.steps.length - 1 ? 'Done — next step' : 'Finish';
    }
    remaining--;
  }
  update();
  timerInterval = setInterval(update, 1000);
}
function stopTimer() { clearInterval(timerInterval); timerInterval = null; }
function formatTime(s) {
  return Math.floor(s/60) + ':' + String(s % 60).padStart(2,'0');
}

// ── Breath ────────────────────────────────────────────────────────
function resetBreathUI() {
  const circle = document.getElementById('breath-circle');
  circle.className = 'breath-circle';
  document.getElementById('breath-word').textContent = 'ready';
  document.getElementById('breath-phase').textContent = 'Tap to begin';
}

function startBreath(totalCycles) {
  let cycles = 0;
  let phase = 0;
  let running = false;

  const circle = document.getElementById('breath-circle');
  const word = document.getElementById('breath-word');
  const phaseEl = document.getElementById('breath-phase');

  function tick() {
    if (!running) return;
    const p = BREATH_PHASES[phase];
    circle.className = 'breath-circle ' + p.cls;
    word.textContent = p.word;
    phaseEl.textContent = '';

    phase = (phase + 1) % 3;
    if (phase === 0) {
      cycles++;
      if (cycles >= totalCycles) {
        setTimeout(() => {
          circle.className = 'breath-circle';
          word.textContent = 'done';
          phaseEl.textContent = `${totalCycles} cycles complete`;
        }, BREATH_PHASES[2].dur);
        return;
      }
    }
    const nextDur = BREATH_PHASES[(phase + 2) % 3].dur;
    breathInterval = setTimeout(tick, nextDur);
  }

  circle.addEventListener('click', () => {
    if (running) return;
    running = true;
    tick();
  }, { once: false });
}
function stopBreath() { clearTimeout(breathInterval); breathInterval = null; }

// ── Log ───────────────────────────────────────────────────────────
function renderLog() {
  const sessions = LS.get('sessions') || [];
  const list = document.getElementById('log-list');
  const empty = document.getElementById('log-empty');
  list.innerHTML = '';
  if (!sessions.length) { empty.classList.remove('hidden'); return; }
  empty.classList.add('hidden');
  sessions.forEach(s => {
    const item = document.createElement('div');
    item.className = 'log-item';
    item.innerHTML = `
      <div class="log-item-top">
        <span class="log-proto">${s.name}</span>
        <span class="log-date">${s.date}</span>
      </div>
      <div class="log-intensity">${s.intensity ? `Intensity: ${s.intensity}/10` : 'Manual selection'}</div>
    `;
    list.appendChild(item);
  });
}
document.getElementById('log-back').addEventListener('click', () => showScreen('entry'));

// ── Service Worker ─────────────────────────────────────────────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(()=>{}));
}
