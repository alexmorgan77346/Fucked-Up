'use strict';

/* ── Storage ── */
const LS = {
  get: k => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
  set: (k, v) => localStorage.setItem(k, JSON.stringify(v)),
};

/* ── Protocols ── */
const PROTOCOLS = {

  brainfog: {
    name: 'Brain Fog',
    steps: [
      { type: 'read',
        instruction: 'Drink water. Right now.',
        detail: 'Not later. Dehydration reduces blood flow to the brain. Stand up, get a glass of water, drink the whole glass, then come back.' },
      { type: 'breathe', cycles: 3,
        instruction: 'Three slow breaths.',
        detail: 'Tap the circle to begin. Increased oxygen to the brain helps clear fog within seconds.' },
      { type: 'timer', duration: 120,
        instruction: 'Move your body for 2 minutes.',
        detail: 'Walk around, stretch your neck, roll your shoulders. You don\'t need privacy. Start the timer, then just move.' },
      { type: 'write', placeholder: 'One thing only…',
        instruction: 'Name ONE thing to do next.',
        detail: 'Not a list. Not a plan. One thing. Write it here before moving on.' },
      { type: 'timer', duration: 60,
        instruction: 'You have 60 seconds — start that one thing.',
        detail: 'Open it, pick it up, write the first word — whatever "starting" means. The fog lifts when you move.' },
    ],
    done: 'You went through the steps. The fog may not be fully gone, but you\'ve done what you can physically. Start the one task you wrote.',
  },

  anxiety: {
    name: 'Anxiety',
    steps: [
      { type: 'write', placeholder: 'My body right now: …',
        instruction: 'What is your body doing right now?',
        detail: 'Observe without judging. Tight chest, racing heart, tense jaw, shallow breath — just name what you notice in your body.' },
      { type: 'breathe', cycles: 5,
        instruction: 'Slow your breathing for 5 cycles.',
        detail: 'Tap the circle to begin. This directly activates your parasympathetic nervous system — the biological off-switch for anxiety.' },
      { type: 'write', placeholder: '1.\n2.\n3.\n4.\n5.',
        instruction: 'Name 5 things you can see right now.',
        detail: 'Look around and type them. This grounds your brain in the present moment and breaks the anxious thought loop.' },
      { type: 'write', placeholder: 'The actual thing I\'m afraid of is…',
        instruction: 'What is the specific fear underneath this?',
        detail: 'Not vague dread — the actual scenario. Name it precisely. A named fear is always smaller than an unnamed one.' },
      { type: 'write', placeholder: 'Right now I can… / Nothing I can do right now.',
        instruction: 'Is there anything you can actually do about it right now?',
        detail: 'If yes — write the one action. If no — write "nothing right now" and let the thought sit without feeding it.' },
    ],
    done: 'Anxiety doesn\'t switch off completely — but you\'ve interrupted the loop. Your nervous system is slower now than when you started.',
  },

  anger: {
    name: 'Anger',
    steps: [
      { type: 'timer', duration: 30,
        instruction: 'Cold water on your face or wrists — 30 seconds.',
        detail: 'Splash cold water on your face or hold your wrists under cold water. Start the timer now. This activates the dive reflex and immediately drops your heart rate.' },
      { type: 'breathe', cycles: 4,
        instruction: 'Breathe out longer than you breathe in.',
        detail: 'A long exhale calms the nervous system faster than a long inhale. Tap the circle and follow it for 4 full cycles.' },
      { type: 'write', placeholder: 'What literally happened: …',
        instruction: 'What exactly happened — only the facts.',
        detail: 'Not how it made you feel. What literally occurred. One or two sentences, events only.' },
      { type: 'write', placeholder: 'What I actually want is…',
        instruction: 'What outcome do you actually want from this?',
        detail: 'Not to vent, not revenge. What would genuinely resolve this situation for you?' },
      { type: 'write', placeholder: 'I will… / I\'ll let it go for now.',
        instruction: 'One action toward that — or consciously let it go.',
        detail: 'Choosing to let it go is a real decision, not giving up. Write which one you\'re doing.' },
    ],
    done: 'You processed it instead of reacting. That\'s the harder thing to do. Whatever you do next — do it from this state, not where you started.',
  },

  burnout: {
    name: 'Burnout',
    steps: [
      { type: 'timer', duration: 600,
        instruction: 'Sit and do nothing for 10 minutes.',
        detail: 'No phone, no task, no "productive" activity. Just sit. Start the timer. This is the step — not a break before the step.' },
      { type: 'choice',
        choices: ['Sleep or proper rest', 'A real meal or water', 'Physical movement', 'Quiet and alone time', 'To talk to someone'],
        instruction: 'What does your body actually need right now?',
        detail: 'Pick the most honest answer — not what you think you should need.' },
      { type: 'breathe', cycles: 6,
        instruction: 'Breathe slowly for 6 cycles.',
        detail: 'Don\'t think about your tasks while you do this. Tap the circle and just follow the rhythm.' },
      { type: 'write', placeholder: 'I can remove or delay…',
        instruction: 'What ONE thing can you cut from today?',
        detail: 'Not forever. Just today. Something that won\'t actually break anything if it gets pushed. Write it.' },
      { type: 'write', placeholder: 'Today I must only:\n-\n-',
        instruction: 'What is the absolute minimum that must happen today?',
        detail: 'Be ruthless. Only things that genuinely break something if skipped today. Everything else is not today\'s problem.' },
    ],
    done: 'You\'ve stopped and assessed. Do only what you wrote in the last step today. Everything else can wait.',
  },

  lowmood: {
    name: 'Low Mood',
    steps: [
      { type: 'read',
        instruction: 'You don\'t have to feel better right now.',
        detail: 'Low mood is not an emergency. It\'s not permanent. You don\'t need to fix it this moment. The only goal is to get through the next few minutes.' },
      { type: 'choice',
        choices: ['Eaten and had water', 'Eaten but not enough water', 'Haven\'t eaten today', 'Not sure / can\'t remember'],
        instruction: 'Have you eaten and had water today?',
        detail: 'Low blood sugar and dehydration are direct physical causes of low mood — not side effects, actual causes.' },
      { type: 'breathe', cycles: 4,
        instruction: 'Four slow breath cycles.',
        detail: 'Not to feel better — just to slow down your body. Tap the circle.' },
      { type: 'write', placeholder: 'Right now I feel…',
        instruction: 'Write what\'s actually there.',
        detail: 'No goal, no need for insight or conclusions. Just what is in your head right now, as it is.' },
      { type: 'timer', duration: 300,
        instruction: 'Go outside or to a different room for 5 minutes.',
        detail: 'Change of environment is one of the most reliable low-mood interventions. Start the timer, then go. Come back when it ends.' },
    ],
    done: 'You didn\'t fix it — and that\'s not the goal. You stayed with it and kept moving. That\'s enough for now.',
  },
};

function intensityToProtocol(n) {
  if (n <= 3) return 'lowmood';
  if (n <= 5) return 'brainfog';
  if (n <= 7) return 'anxiety';
  if (n <= 9) return 'anger';
  return 'burnout';
}

/* ── Global state ── */
let currentProtocol  = null;
let currentStepIdx   = 0;
let sessionIntensity = 0;

/* Timer state machine: idle | running | paused | done */
let timerState     = 'idle';
let timerTick      = null;
let timerRemaining = 0;
let timerTotal     = 0;

/* Breath state */
let breathTick    = null;
let breathRunning = false;

const CIRC = 2 * Math.PI * 52; // SVG r=52 → 326.73

const BREATH_PHASES = [
  { label: 'breathe in',  cls: 'inhale', dur: 4000 },
  { label: 'hold',        cls: 'hold',   dur: 4000 },
  { label: 'breathe out', cls: 'exhale', dur: 6000 },
];

/* ── DOM helpers ── */
const $ = id => document.getElementById(id);
function show(el) { el.style.display = 'block'; }
function hide(el) { el.style.display = 'none'; }
function showFlex(el) { el.style.display = 'flex'; }

/* ── Screens ── */
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  $('screen-' + id).classList.add('active');
}

/* ── Entry ── */
document.querySelectorAll('.intensity-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    sessionIntensity = parseInt(btn.dataset.val);
    startProtocol(intensityToProtocol(sessionIntensity));
  });
});
document.querySelectorAll('.state-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    sessionIntensity = 0;
    startProtocol(btn.dataset.protocol);
  });
});
$('open-log-btn').addEventListener('click', () => { renderLog(); showScreen('log'); });

/* ── Protocol ── */
function startProtocol(key) {
  currentProtocol      = PROTOCOLS[key];
  currentProtocol._key = key;
  currentStepIdx       = 0;
  stopAll();
  showScreen('protocol');
  renderStep();
}

function renderStep() {
  stopAll();

  const step   = currentProtocol.steps[currentStepIdx];
  const total  = currentProtocol.steps.length;
  const isLast = currentStepIdx === total - 1;

  $('proto-name').textContent    = currentProtocol.name.toUpperCase();
  $('step-counter').textContent  = (currentStepIdx + 1) + ' / ' + total;
  $('step-number').textContent   = 'STEP ' + (currentStepIdx + 1);
  $('step-instruction').textContent = step.instruction;
  $('step-detail').textContent      = step.detail;

  ['timer-block','breath-block','write-block','choice-block'].forEach(id => hide($(id)));

  $('next-btn').textContent = isLast ? 'Finish' : 'Done — next step';

  if (step.type === 'timer') {
    show($('timer-block'));
    initTimer(step.duration);

  } else if (step.type === 'breathe') {
    show($('breath-block'));
    initBreath(step.cycles || 4);

  } else if (step.type === 'write') {
    show($('write-block'));
    const ta = $('write-input');
    ta.value = '';
    ta.placeholder = step.placeholder || 'Write here…';
    setTimeout(() => ta.focus(), 200);

  } else if (step.type === 'choice') {
    show($('choice-block'));
    const container = $('choice-options');
    container.innerHTML = '';
    (step.choices || []).forEach(ch => {
      const b = document.createElement('button');
      b.className   = 'choice-opt';
      b.textContent = ch;
      b.addEventListener('click', () => {
        container.querySelectorAll('.choice-opt').forEach(x => x.classList.remove('selected'));
        b.classList.add('selected');
      });
      container.appendChild(b);
    });
  }

  $('screen-protocol').scrollTo({ top: 0, behavior: 'instant' });
}

function advance() {
  stopAll();
  currentStepIdx++;
  if (currentStepIdx >= currentProtocol.steps.length) finishProtocol();
  else renderStep();
}

function finishProtocol() {
  stopAll();
  const log = LS.get('sessions') || [];
  log.unshift({
    protocol: currentProtocol._key,
    name: currentProtocol.name,
    intensity: sessionIntensity,
    date: new Date().toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }),
    ts: Date.now(),
  });
  LS.set('sessions', log.slice(0, 60));
  $('done-title').textContent = currentProtocol.name + ' — done.';
  $('done-body').textContent  = currentProtocol.done;
  showScreen('done');
}

$('next-btn').addEventListener('click', advance);
$('skip-btn').addEventListener('click', advance);
$('proto-back').addEventListener('click', () => { stopAll(); showScreen('entry'); });
$('done-again').addEventListener('click', () => startProtocol(currentProtocol._key));
$('done-home').addEventListener('click', () => showScreen('entry'));
$('log-back').addEventListener('click', () => showScreen('entry'));

/* ── Timer ── */
function initTimer(seconds) {
  timerTotal     = seconds;
  timerRemaining = seconds;
  timerState     = 'idle';
  clearTimeout(timerTick);
  timerTick = null;

  /* reset ring */
  const ring = $('ring-fill');
  ring.style.transition       = 'none';
  ring.style.strokeDasharray  = String(CIRC);
  ring.style.strokeDashoffset = '0';
  void ring.getBoundingClientRect();

  $('timer-num').textContent  = formatTime(seconds);
  $('timer-num').style.color  = '';
  $('timer-hint').textContent = '';

  /* buttons: show Play only */
  show($('timer-play'));
  hide($('timer-pause'));
  hide($('timer-resume'));
  hide($('timer-reset'));
}

function timerTick_fn() {
  if (timerState !== 'running') return;

  const ring = $('ring-fill');
  ring.style.transition       = 'stroke-dashoffset 1s linear';
  ring.style.strokeDashoffset = String(CIRC * (1 - timerRemaining / timerTotal));
  $('timer-num').textContent  = formatTime(timerRemaining);

  if (timerRemaining === 0) {
    timerState = 'done';
    $('timer-num').textContent = 'Done ✓';
    $('timer-num').style.color = 'var(--accent)';
    $('timer-hint').textContent = 'Timer complete';
    /* show only Reset */
    hide($('timer-play'));
    hide($('timer-pause'));
    hide($('timer-resume'));
    show($('timer-reset'));
    return;
  }

  timerRemaining--;
  timerTick = setTimeout(timerTick_fn, 1000);
}

/* Play */
$('timer-play').addEventListener('click', () => {
  if (timerState !== 'idle') return;
  timerState = 'running';
  hide($('timer-play'));
  show($('timer-pause'));
  show($('timer-reset'));
  timerTick_fn();
});

/* Pause */
$('timer-pause').addEventListener('click', () => {
  if (timerState !== 'running') return;
  timerState = 'paused';
  clearTimeout(timerTick);
  timerTick = null;
  $('timer-hint').textContent = 'Paused';
  hide($('timer-pause'));
  show($('timer-resume'));
});

/* Resume */
$('timer-resume').addEventListener('click', () => {
  if (timerState !== 'paused') return;
  timerState = 'running';
  $('timer-hint').textContent = '';
  hide($('timer-resume'));
  show($('timer-pause'));
  timerTick_fn();
});

/* Reset */
$('timer-reset').addEventListener('click', () => {
  clearTimeout(timerTick);
  timerTick = null;
  initTimer(timerTotal); // re-init with same duration
});

function stopTimer() {
  clearTimeout(timerTick);
  timerTick  = null;
  timerState = 'idle';
}

function formatTime(s) {
  return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
}

/* ── Breath ── */
function initBreath(totalCycles) {
  breathRunning = false;
  clearTimeout(breathTick);
  breathTick = null;

  const circle = $('breath-circle');
  const labelEl = $('breath-label');
  const status  = $('breath-status');

  circle.className     = 'breath-circle';
  labelEl.textContent  = 'tap to begin';
  status.textContent   = '';

  /* wipe old listener by replacing node */
  const fresh = circle.cloneNode(true);
  circle.replaceWith(fresh);

  const fc = $('breath-circle');
  const fl = $('breath-label');
  const fs = $('breath-status');

  let phaseIdx   = 0;
  let cyclesDone = 0;

  function runPhase() {
    if (!breathRunning) return;
    const p = BREATH_PHASES[phaseIdx];
    fc.className   = 'breath-circle ' + p.cls;
    fl.textContent = p.label;
    fs.textContent = '';

    breathTick = setTimeout(() => {
      phaseIdx++;
      if (phaseIdx >= BREATH_PHASES.length) {
        phaseIdx = 0;
        cyclesDone++;
        if (cyclesDone >= totalCycles) {
          breathRunning  = false;
          fc.className   = 'breath-circle';
          fl.textContent = 'done';
          fs.textContent = totalCycles + (totalCycles === 1 ? ' cycle' : ' cycles') + ' complete';
          return;
        }
      }
      runPhase();
    }, p.dur);
  }

  fc.addEventListener('click', () => {
    if (breathRunning) return;
    breathRunning  = true;
    fl.textContent = '';
    runPhase();
  });
}

function stopBreath() {
  breathRunning = false;
  clearTimeout(breathTick);
  breathTick = null;
}

function stopAll() {
  stopTimer();
  stopBreath();
}

/* ── Log ── */
function renderLog() {
  const sessions = LS.get('sessions') || [];
  const list  = $('log-list');
  const empty = $('log-empty');
  list.innerHTML = '';

  if (!sessions.length) { show(empty); return; }
  hide(empty);

  sessions.forEach(s => {
    const d = document.createElement('div');
    d.className = 'log-item';
    d.innerHTML =
      '<div class="log-top">' +
        '<span class="log-proto">' + s.name + '</span>' +
        '<span class="log-date">'  + s.date + '</span>' +
      '</div>' +
      '<div class="log-level">' + (s.intensity ? 'Intensity: ' + s.intensity + '/10' : 'Manual') + '</div>';
    list.appendChild(d);
  });
}

/* ── Service Worker ── */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}
