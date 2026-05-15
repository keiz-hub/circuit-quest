(() => {
  const DATA = window.CQ;
  const UI = window.CQUI;
  const Audio = window.CQAudio;

  const state = {
    screen: 'story-start',
    selected: null,
    mode: 'world',
    stageIndex: 0,
    repairs: 0,
    activeTasks: [],
    taskIndex: 0,
    gateOpen: false,
    consoleActive: false,
    player: { x: 7, y: 82, dir: 'right', moving: false },
    worldPlayer: { x: 7, y: 82, dir: 'right', moving: false },
    stagePlayer: { x: 14, y: 78, dir: 'right', moving: false },
    lastDoor: { x: 7, y: 82, dir: 'right', moving: false },
    keys: new Set(),
    loop: null,
    currentRepair: { selectedPart: null },
    missionMinimized: false,
    joystick: { x: 0, y: 0, active: false }
  };

  const els = {};
  const controlKeys = ['arrowup','arrowdown','arrowleft','arrowright','w','a','s','d',' '];

  document.addEventListener('DOMContentLoaded', boot);

  function boot() {
    cache();
    renderCharacterSelect();
    bindEvents();
    UI.setAudioLabels(Audio.getState());
  }

  function cache() {
    Object.assign(els, {
      introNext: UI.$('#intro-next'),
      startGame: UI.$('#start-game'),
      musicMenu: UI.$('#music-toggle-menu'),
      musicGame: UI.$('#music-toggle-game'),
      sfxMenu: UI.$('#sfx-toggle-menu'),
      sfxGame: UI.$('#sfx-toggle-game'),
      palette: UI.$('#palette-select'),
      chooseCharacter: UI.$('#choose-character'),
      closeCharacter: UI.$('#close-character'),
      characterModal: UI.$('#character-modal'),
      characterBackdrop: UI.$('#character-backdrop'),
      mobileSelectedCard: UI.$('#mobile-selected-card'),
      mobileSelectedName: UI.$('#mobile-selected-name'),
      characterGrid: UI.$('#character-grid'),
      selectStatus: UI.$('#select-status'),
      hudSprite: UI.$('#hud-sprite'),
      hudPlayer: UI.$('#hud-player'),
      hudPlace: UI.$('#hud-place'),
      hudStage: UI.$('#hud-stage'),
      hudScore: UI.$('#hud-score'),
      menuButton: UI.$('#menu-button'),
      resetButton: UI.$('#reset-button'),
      worldView: UI.$('#world-view'),
      stageView: UI.$('#stage-view'),
      worldBoard: UI.$('#world-board'),
      stageBoard: UI.$('#stage-board'),
      worldAction: UI.$('#world-action'),
      stageAction: UI.$('#stage-action'),
      worldGuide: UI.$('#world-guide'),
      stageLabel: UI.$('#stage-label'),
      stageTitle: UI.$('#stage-title'),
      stageHelp: UI.$('#stage-help'),
      missionPanel: UI.$('#mission-panel'),
      missionIcon: UI.$('#mission-icon'),
      missionTitle: UI.$('#mission-title'),
      missionType: UI.$('#mission-type'),
      progressText: UI.$('#progress-text'),
      progressFill: UI.$('#progress-fill'),
      taskPanel: UI.$('#task-panel'),
      missionMinimize: UI.$('#mission-minimize'),
      missionTab: UI.$('#mission-tab'),
      playAgain: UI.$('#play-again'),
      endMenu: UI.$('#end-menu'),
      joystick: UI.$('#joystick'),
      joystickBase: UI.$('#joystick-base'),
      joystickThumb: UI.$('#joystick-thumb'),
      mobileAction: UI.$('#mobile-action')
    });
  }

  function bindEvents() {
    els.introNext.addEventListener('click', () => { Audio.unlock(); Audio.sfx('select'); UI.screen('#screen-menu'); });
    els.startGame.addEventListener('click', startGame);
    els.musicMenu.addEventListener('click', toggleMusic);
    els.musicGame.addEventListener('click', toggleMusic);
    els.sfxMenu.addEventListener('click', toggleSfx);
    els.sfxGame.addEventListener('click', toggleSfx);
    els.palette.addEventListener('change', (e) => document.body.dataset.palette = e.target.value);
    els.chooseCharacter?.addEventListener('click', openCharacterModal);
    els.closeCharacter?.addEventListener('click', closeCharacterModal);
    els.characterBackdrop?.addEventListener('click', closeCharacterModal);
    els.worldAction.addEventListener('click', interact);
    els.stageAction.addEventListener('click', interact);
    els.mobileAction?.addEventListener('click', interact);
    els.missionMinimize?.addEventListener('click', minimizeMissionPanel);
    els.missionTab?.addEventListener('click', openMissionPanel);
    els.resetButton.addEventListener('click', () => UI.confirm({
      title: 'Reset mission?',
      message: 'Your current progress will be lost and puzzles will reshuffle.',
      onConfirm: resetRunAndRender
    }));
    els.menuButton.addEventListener('click', () => UI.confirm({
      title: 'Return to menu?',
      message: 'Current mission progress will be lost.',
      onConfirm: toMenu
    }));
    els.playAgain.addEventListener('click', () => { UI.screen('#screen-menu'); });
    els.endMenu.addEventListener('click', toMenu);

    window.addEventListener('keydown', (event) => {
      const key = event.key.toLowerCase();
      if (controlKeys.includes(key)) event.preventDefault();
      if (key === ' ') interact();
      state.keys.add(key);
    });
    window.addEventListener('keyup', (event) => state.keys.delete(event.key.toLowerCase()));

    bindJoystick();
  }

  function bindJoystick() {
    if (!els.joystickBase || !els.joystickThumb) return;

    const resetJoystick = () => {
      state.joystick = { x: 0, y: 0, active: false };
      els.joystickThumb.style.transform = 'translate(-50%, -50%)';
      activePlayer().moving = false;
      renderPlayerOnly();
    };

    const updateJoystick = (event) => {
      const rect = els.joystickBase.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const max = rect.width * 0.34;
      let dx = event.clientX - centerX;
      let dy = event.clientY - centerY;
      const length = Math.hypot(dx, dy);
      if (length > max) {
        dx = (dx / length) * max;
        dy = (dy / length) * max;
      }
      state.joystick = {
        x: max ? dx / max : 0,
        y: max ? dy / max : 0,
        active: true
      };
      els.joystickThumb.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
    };

    els.joystickBase.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      if (state.mode === 'stage' && state.consoleActive && !state.gateOpen) {
        UI.toast('Finish the active task before moving.', 'bad');
        return;
      }
      Audio.unlock();
      els.joystickBase.setPointerCapture?.(event.pointerId);
      updateJoystick(event);
    });
    els.joystickBase.addEventListener('pointermove', (event) => {
      if (!state.joystick.active) return;
      event.preventDefault();
      updateJoystick(event);
    });
    els.joystickBase.addEventListener('pointerup', resetJoystick);
    els.joystickBase.addEventListener('pointercancel', resetJoystick);
    els.joystickBase.addEventListener('lostpointercapture', resetJoystick);
  }


  function openCharacterModal() {
    Audio.unlock();
    Audio.sfx('select');
    els.characterModal?.classList.add('open');
    els.characterBackdrop?.classList.add('open');
    els.characterBackdrop?.setAttribute('aria-hidden', 'false');
    setTimeout(() => els.characterGrid?.querySelector('button')?.focus(), 30);
  }

  function closeCharacterModal() {
    els.characterModal?.classList.remove('open');
    els.characterBackdrop?.classList.remove('open');
    els.characterBackdrop?.setAttribute('aria-hidden', 'true');
  }

  function openMissionPanel() {
    state.missionMinimized = false;
    updateMissionOverlayState();
  }

  function minimizeMissionPanel() {
    state.missionMinimized = true;
    updateMissionOverlayState();
  }

  function updateMissionOverlayState() {
    const panel = els.missionPanel || UI.$('#mission-panel');
    const tab = els.missionTab || UI.$('#mission-tab');
    if (!panel || !tab) return;
    const shouldOpen = state.mode === 'stage' && state.consoleActive && !state.gateOpen && !state.missionMinimized;
    panel.classList.toggle('mobile-open', shouldOpen);
    panel.classList.toggle('mobile-minimized', state.mode === 'stage' && state.consoleActive && !state.gateOpen && state.missionMinimized);
    tab.classList.toggle('show', state.mode === 'stage' && state.consoleActive && !state.gateOpen && state.missionMinimized);
    tab.classList.toggle('has-progress', state.taskIndex > 0);
  }

  function toggleMusic() {
    Audio.unlock();
    const stateAudio = Audio.toggleMusic();
    UI.setAudioLabels(stateAudio);
    Audio.unlock();
    Audio.sfx('select');
  }

  function toggleSfx() {
    Audio.unlock();
    const stateAudio = Audio.toggleSfx();
    UI.setAudioLabels(stateAudio);
    if (stateAudio.sfx) Audio.sfx('select');
  }

  function renderCharacterSelect() {
    els.characterGrid.innerHTML = '';
    DATA.characters.forEach((char) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'character-card';
      card.dataset.id = char.id;
      card.innerHTML = `
        <div class="sprite-preview ${char.css}"><span></span></div>
        <div><strong>${char.name}</strong><small>${char.job}</small><em>${char.role}<br>Skill: ${char.skill}</em></div>
      `;
      card.addEventListener('click', () => selectCharacter(char.id));
      els.characterGrid.appendChild(card);
    });
  }

  function selectCharacter(id) {
    Audio.unlock();
    state.selected = DATA.characters.find((c) => c.id === id);
    UI.$$('.character-card').forEach((card) => card.classList.toggle('selected', card.dataset.id === id));
    els.selectStatus.textContent = 'Ready';
    els.selectStatus.classList.add('ready');
    els.startGame.disabled = false;
    Audio.sfx('select');
    updateMobileSelected();
    UI.toast(`${state.selected.name} joined the team. Tap Start Mission when ready.`, 'good');
  }


  function updateMobileSelected() {
    if (!els.mobileSelectedCard || !els.mobileSelectedName || !state.selected) return;
    const sprite = els.mobileSelectedCard.querySelector('.tiny-sprite');
    if (sprite) {
      sprite.className = `tiny-sprite ${state.selected.css}`;
      sprite.innerHTML = '<span></span>';
    }
    els.mobileSelectedName.textContent = `${state.selected.name} • ${state.selected.job}`;
  }

  function startGame() {
    if (!state.selected) return UI.toast('Choose a specialist first.', 'bad');
    Audio.unlock();
    UI.setAudioLabels(Audio.getState());
    closeCharacterModal();
    resetRun();
    UI.screen('#screen-game');
    setMode('world');
    renderAll();
    startLoop();
    UI.toast('Mission started. Follow the map path.', 'good');
  }

  function toMenu() {
    stopLoop();
    state.keys.clear();
    UI.screen('#screen-menu');
  }

  function resetRunAndRender() {
    resetRun();
    setMode('world');
    renderAll();
    startLoop();
    UI.toast('Mission reset. New tasks loaded.', 'good');
  }

  function resetRun() {
    state.mode = 'world';
    state.stageIndex = 0;
    state.repairs = 0;
    state.worldPlayer = { x: 7, y: 82, dir: 'right', moving: false };
    state.player = state.worldPlayer;
    state.lastDoor = { ...state.worldPlayer };
    state.keys.clear();
    resetStageState();
  }

  function resetStageState() {
    const stage = getStage();
    const questionTasks = shuffle(stage.questions || []);
    const puzzleTasks = shuffle(stage.puzzles || []);
    if (stage.challengeMode === 'questions') state.activeTasks = questionTasks.slice(0, stage.taskCount);
    if (stage.challengeMode === 'puzzles') state.activeTasks = puzzleTasks.slice(0, stage.taskCount);
    if (stage.challengeMode === 'mixed') {
      state.activeTasks = interleave(questionTasks, puzzleTasks).slice(0, stage.taskCount);
    }
    state.taskIndex = 0;
    state.gateOpen = false;
    state.consoleActive = false;
    state.missionMinimized = false;
    state.currentRepair = { selectedPart: null };
    state.stagePlayer = { ...stage.spawn, dir: stage.spawn.x > 50 ? 'left' : 'right', moving: false };
  }

  function setMode(mode) {
    state.mode = mode;
    els.worldView.classList.toggle('active', mode === 'world');
    els.stageView.classList.toggle('active', mode === 'stage');
    updateMissionOverlayState();
  }

  function renderAll() {
    renderHud();
    renderWorld();
    renderStage();
    renderMissionPanel();
  }

  function renderHud() {
    const char = state.selected;
    els.hudPlayer.textContent = char ? `${char.name} • ${char.job}` : 'Specialist';
    els.hudPlace.textContent = state.mode === 'world' ? 'Story Map' : getStage().title;
    els.hudStage.textContent = `${Math.min(state.stageIndex + 1, DATA.settings.stagesPerRun)}/${DATA.settings.stagesPerRun}`;
    els.hudScore.textContent = state.repairs;
    els.hudSprite.className = `tiny-sprite ${char ? char.css : 'engineer'}`;
    els.hudSprite.innerHTML = '<span></span>';
  }

  function renderWorld() {
    els.worldBoard.innerHTML = '';
    renderWorldPath();
    DATA.stages.forEach((stage, i) => {
      const gate = obj('gate', stage.gate.x, stage.gate.y);
      gate.classList.toggle('active', i === state.stageIndex);
      gate.classList.toggle('cleared', i < state.stageIndex);
      gate.classList.toggle('locked', i > state.stageIndex);
      gate.innerHTML = `<span class="label">${stage.gateLabel}</span>`;
      gate.addEventListener('click', () => tryStage(i));
      els.worldBoard.appendChild(gate);

      const node = obj('node', stage.gate.x, stage.gate.y + 11);
      node.textContent = i + 1;
      node.classList.toggle('current', i === state.stageIndex);
      els.worldBoard.appendChild(node);
    });
    renderSprite(els.worldBoard, 'world-player', state.worldPlayer);
    const stage = getStage();
    els.worldGuide.textContent = `Next: Stage ${state.stageIndex + 1} — ${stage.title}`;
  }

  function renderWorldPath() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('world-path');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('preserveAspectRatio', 'none');
    const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    poly.setAttribute('points', DATA.stages.map((s) => `${s.gate.x},${s.gate.y}`).join(' '));
    poly.setAttribute('vector-effect', 'non-scaling-stroke');
    svg.appendChild(poly);
    els.worldBoard.appendChild(svg);
  }

  function renderStage() {
    const stage = getStage();
    els.stageBoard.innerHTML = '';
    els.stageBoard.className = `board stage-board ${stage.theme}`;
    els.stageLabel.textContent = `Stage ${state.stageIndex + 1} • ${labelForMode(stage.challengeMode)}`;
    els.stageTitle.textContent = stage.title;
    els.missionIcon.textContent = stage.icon;
    if (els.npcBox) {
      const guide = stage.npc || { icon: '💬', name: 'Mission Guide', line: 'Go to the broken console, interact, then complete the mission panel to unlock the exit.' };
      const modeLabel = labelForMode(stage.challengeMode);
      const guideName = guide.name || 'Mission Guide';
      const guideLine = guide.line || 'Go to the broken console, interact, then complete the mission panel to unlock the exit.';
      const icon = guide.icon || '💬';
      const initials = guideName.split(/\s+/).map((word) => word[0]).join('').slice(0, 2).toUpperCase();

      els.npcBox.className = 'npc-box has-message';
      els.npcBox.setAttribute('aria-label', `${guideName}: ${guideLine}`);
      els.npcBox.innerHTML = `
        <div class="npc-face" aria-hidden="true">
          <span class="npc-emoji">${UI.escapeHtml(icon)}</span>
          <small>${UI.escapeHtml(initials)}</small>
        </div>
        <div class="npc-message">
          <div class="npc-profile">
            <strong>${UI.escapeHtml(guideName)}</strong>
            <span>${UI.escapeHtml(modeLabel)} Guide</span>
          </div>
          <p>${UI.escapeHtml(guideLine)}</p>
        </div>
      `;
    }
    stage.props.forEach((p) => els.stageBoard.appendChild(obj(`prop ${p.type}`, p.x, p.y)));

    const consoleEl = obj('console', stage.console.x, stage.console.y);
    consoleEl.classList.toggle('broken', !state.gateOpen);
    consoleEl.classList.toggle('fixed', state.gateOpen);
    consoleEl.innerHTML = `<span class="label">${state.gateOpen ? 'FIXED' : 'BROKEN'}</span>`;
    consoleEl.addEventListener('click', () => useConsole());
    els.stageBoard.appendChild(consoleEl);

    const exit = obj('exit-gate', stage.exit.x, stage.exit.y);
    exit.classList.toggle('open', state.gateOpen);
    exit.classList.toggle('locked', !state.gateOpen);
    exit.innerHTML = `<span class="label">${state.gateOpen ? 'EXIT' : 'LOCKED'}</span>`;
    exit.addEventListener('click', () => useExit());
    els.stageBoard.appendChild(exit);

    renderSprite(els.stageBoard, 'stage-player', state.stagePlayer);
  }

  function renderMissionPanel() {
    const stage = getStage();
    const done = Math.min(state.taskIndex, state.activeTasks.length);
    const total = state.activeTasks.length || stage.taskCount;
    els.missionTitle.textContent = stage.challengeMode === 'puzzles' ? 'Circuit Board Repair' : stage.challengeMode === 'mixed' ? 'Final Mixed Mission' : 'Circuit Check';
    els.missionType.textContent = labelForMode(stage.challengeMode);
    els.progressText.textContent = `${done}/${total} complete`;
    els.progressFill.style.width = `${total ? (done / total) * 100 : 0}%`;

    if (state.gateOpen) {
      els.taskPanel.innerHTML = `<div class="feedback good">Console repaired. The exit gate is open. Walk to the exit and interact.</div>`;
      els.stageHelp.textContent = 'The exit is open. Head to the gate.';
      state.missionMinimized = true;
      updateMissionOverlayState();
      return;
    }

    const task = state.activeTasks[state.taskIndex];
    if (!task) return openGate();

    if (!state.consoleActive) {
      els.stageHelp.textContent = 'Go to the broken console and press Interact or Space to start the repair mission.';
      els.taskPanel.innerHTML = `
        <div class="task-card locked-task">
          <p class="eyebrow">Console Locked</p>
          <div class="task-text">Go to the broken console to answer or repair.</div>
          <p>Walk beside the BROKEN console and press Interact / Space. This prevents players from answering far away from the mission device.</p>
        </div>
        <div class="feedback bad">Move beside the BROKEN console, then press Interact / Space.</div>
      `;
      return;
    }

    els.stageHelp.textContent = 'Mission is active. Character movement is locked until this task is completed or the console is repaired.';
    if (task.type === 'repair') renderRepairTask(task);
    else renderQuestionTask(task);
    updateMissionOverlayState();
  }

  function renderQuestionTask(task) {
    els.taskPanel.innerHTML = '';

    if (task.type === 'choice') {
      const card = document.createElement('div');
      card.className = 'task-card choice-card';
      card.innerHTML = `
        <div class="choice-copy">
          <p class="eyebrow">Choose Answer</p>
          <div class="task-text">${UI.escapeHtml(task.q)}</div>
          <p>${UI.escapeHtml(task.tip || '')}</p>
        </div>
        <div class="choice-grid inline-choices"></div>
      `;
      const grid = card.querySelector('.choice-grid');
      shuffle(task.choices).forEach((choice) => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.type = 'button';
        btn.textContent = choice;
        btn.addEventListener('click', () => submitAnswer(choice));
        grid.appendChild(btn);
      });
      els.taskPanel.appendChild(card);
      return;
    }

    const card = document.createElement('div');
    card.className = 'task-card';
    card.innerHTML = `<p class="eyebrow">Calculate</p><div class="task-text">${UI.escapeHtml(task.q)}</div><p>${UI.escapeHtml(task.tip || '')}</p>`;
    els.taskPanel.appendChild(card);

    const row = document.createElement('div');
    row.className = 'answer-row';
    row.innerHTML = `<input id="answer-input" type="text" placeholder="Type answer..." autocomplete="off"><button class="gb-btn primary" type="button">Submit</button>`;
    row.querySelector('button').addEventListener('click', () => submitAnswer(row.querySelector('input').value));
    row.querySelector('input').addEventListener('keydown', (e) => { if (e.key === 'Enter') submitAnswer(e.target.value); });
    els.taskPanel.appendChild(row);
    setTimeout(() => row.querySelector('input')?.focus(), 60);
  }

  function renderRepairTask(task) {
    state.currentRepair = { selectedPart: null };
    const fromPin = task.correctPins?.[0] || 'FROM';
    const toPin = task.correctPins?.[1] || 'TO';

    els.taskPanel.innerHTML = `
      <div class="repair-task easy-repair">
        <div class="repair-header">
          <p class="eyebrow">Fix Circuit</p>
          <h3>${UI.escapeHtml(task.title)}</h3>
          <p>${UI.escapeHtml(task.prompt)}</p>
          <div class="repair-goal">
            <strong>Easy Goal:</strong> Pick the <b>missing part</b> that should go between <b>${UI.escapeHtml(fromPin)}</b> and <b>${UI.escapeHtml(toPin)}</b>.
          </div>
        </div>

        <div class="simple-circuit easy" aria-label="Simple circuit diagram">
          <div class="terminal start-node">${UI.escapeHtml(fromPin)}</div>
          <div class="wire-line broken-line"></div>
          <div class="missing-part">?</div>
          <div class="wire-line broken-line"></div>
          <div class="terminal end-node">${UI.escapeHtml(toPin)}</div>
        </div>

        <div class="repair-section">
          <div class="repair-section-title">Step 1: Pick the missing part</div>
          <p class="repair-note">Choose the best part to complete the broken path.</p>
          <div class="parts-grid compact-parts"></div>
        </div>

        <div class="repair-status" aria-live="polite">Selected: no part yet</div>
        <button class="gb-btn primary check-repair" type="button">Test Repair</button>
      </div>
    `;

    const parts = els.taskPanel.querySelector('.parts-grid');
    shuffle(task.parts).forEach((part) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'part-btn';
      btn.textContent = part;
      btn.addEventListener('click', () => {
        state.currentRepair.selectedPart = part;
        els.taskPanel.querySelectorAll('.part-btn').forEach((b) => b.classList.remove('selected'));
        btn.classList.add('selected');
        els.taskPanel.querySelector('.simple-circuit')?.classList.add('active');
        const slot = els.taskPanel.querySelector('.missing-part');
        if (slot) slot.textContent = part;
        updateRepairStatus();
      });
      parts.appendChild(btn);
    });

    els.taskPanel.querySelector('.check-repair').addEventListener('click', () => submitRepair(task));
    updateRepairStatus();
  }

  function updateRepairStatus() {
    const status = els.taskPanel.querySelector('.repair-status');
    if (!status) return;
    const part = state.currentRepair.selectedPart || 'no part yet';
    status.textContent = `Selected: ${part}`;
  }

  function submitAnswer(value) {
    if (!state.consoleActive) {
      UI.toast('Go to the broken console before answering.', 'bad');
      renderMissionPanel();
      return;
    }
    const task = state.activeTasks[state.taskIndex];
    if (!task) return;
    if (normalize(value) !== normalize(task.a)) return wrong();
    correct();
  }

  function submitRepair(task) {
    if (!state.consoleActive) {
      UI.toast('Go to the broken console before testing the repair.', 'bad');
      renderMissionPanel();
      return;
    }
    const partOk = state.currentRepair.selectedPart === task.correctPart;
    if (!partOk) return wrong();
    correct();
  }

  function correct() {
    Audio.sfx('correct');
    state.taskIndex += 1;
    state.repairs += 1;
    UI.toast('Correct! Repair progress increased.', 'good');
    renderHud();
    if (state.taskIndex >= state.activeTasks.length) openGate();
    else renderMissionPanel();
  }

  function wrong() {
    Audio.sfx('wrong');
    if (state.taskIndex > 0) {
      state.taskIndex -= 1;
      state.repairs = Math.max(0, state.repairs - 1);
    }
    replaceCurrentTask();
    UI.toast('Try again. Progress deducted and a new Grade 9 task loaded.', 'bad');
    renderHud();
    renderMissionPanel();
  }

  function replaceCurrentTask() {
    const stage = getStage();
    const pool = stage.challengeMode === 'questions' ? stage.questions : stage.challengeMode === 'puzzles' ? stage.puzzles : [...stage.questions, ...stage.puzzles];
    const used = new Set(state.activeTasks.map((t) => t.q || t.title));
    const next = shuffle(pool).find((t) => !used.has(t.q || t.title)) || shuffle(pool)[0];
    state.activeTasks[state.taskIndex] = next;
  }

  function openGate() {
    state.gateOpen = true;
    state.missionMinimized = true;
    Audio.sfx('unlock');
    UI.toast('Console fixed. Exit gate opened.', 'good');
    renderHud();
    renderStage();
    renderMissionPanel();
  }

  function interact() {
    if (!UI.$('#screen-game').classList.contains('active')) return;
    Audio.sfx('interact');
    if (state.mode === 'world') {
      const nearest = nearestGate();
      if (!nearest) return UI.toast('Move closer to the active gate.');
      return tryStage(nearest.index);
    }
    const stage = getStage();
    if (dist(state.stagePlayer, stage.console) < 11) return useConsole();
    if (dist(state.stagePlayer, stage.exit) < 12) return useExit();
    UI.toast(state.gateOpen ? 'Move closer to the exit gate.' : 'Move closer to the broken console.');
  }

  function tryStage(index) {
    if (index !== state.stageIndex) {
      return UI.toast(index < state.stageIndex ? 'Stage already cleared.' : 'Locked. Clear the current stage first.', index < state.stageIndex ? '' : 'bad');
    }
    const stage = DATA.stages[index];
    state.lastDoor = { ...stage.gate, dir: stage.gate.x > 50 ? 'left' : 'right', moving: false };
    resetStageState();
    setMode('stage');
    renderHud();
    renderStage();
    renderMissionPanel();
    UI.toast(`${stage.title}: Find and repair the broken console.`, 'good');
  }

  function useConsole() {
    const stage = getStage();
    if (state.gateOpen) return UI.toast('Console is already fixed. Go to the exit.');
    if (dist(state.stagePlayer, stage.console) >= 11) {
      return UI.toast('Move beside the broken console first.', 'bad');
    }
    state.consoleActive = true;
    state.missionMinimized = false;
    Audio.sfx('interact');
    renderMissionPanel();
    UI.toast('Console activated. You can now answer.', 'good');
  }

  function useExit() {
    if (!state.gateOpen) return UI.toast('Exit is locked. Fix the console first.', 'bad');
    const cleared = getStage();
    state.stageIndex += 1;
    if (state.stageIndex >= DATA.settings.stagesPerRun) return finishGame();
    state.worldPlayer = { ...state.lastDoor, moving: false };
    setMode('world');
    renderHud();
    renderWorld();
    UI.toast(`${cleared.title} cleared. Next gate updated.`, 'good');
  }

  function finishGame() {
    stopLoop();
    Audio.sfx('unlock');
    UI.screen('#screen-story-end');
  }

  function startLoop() {
    stopLoop();
    state.loop = requestAnimationFrame(tick);
  }
  function stopLoop() {
    if (state.loop) cancelAnimationFrame(state.loop);
    state.loop = null;
  }
  function tick() {
    updateMovement();
    state.loop = requestAnimationFrame(tick);
  }

  function updateMovement() {
    if (!UI.$('#screen-game').classList.contains('active')) return;
    if (state.mode === 'stage' && state.consoleActive && !state.gateOpen) {
      const player = activePlayer();
      player.moving = false;
      if (state.joystick.active) {
        state.joystick = { x: 0, y: 0, active: false };
        if (els.joystickThumb) els.joystickThumb.style.transform = 'translate(-50%, -50%)';
      }
      renderPlayerOnly();
      return;
    }
    let dx = 0, dy = 0;
    const isMobile = window.matchMedia('(max-width: 760px)').matches;
    const speed = isMobile ? DATA.settings.baseSpeed * 0.82 : DATA.settings.baseSpeed;
    if (state.keys.has('arrowup') || state.keys.has('w')) dy -= speed;
    if (state.keys.has('arrowdown') || state.keys.has('s')) dy += speed;
    if (state.keys.has('arrowleft') || state.keys.has('a')) dx -= speed;
    if (state.keys.has('arrowright') || state.keys.has('d')) dx += speed;
    if (state.joystick.active) {
      dx += state.joystick.x * speed;
      dy += state.joystick.y * speed;
    }
    if (dx !== 0 && dy !== 0) {
      dx *= 0.72;
      dy *= 0.72;
    }
    const player = activePlayer();
    player.moving = Math.abs(dx) > 0.01 || Math.abs(dy) > 0.01;
    if (dx !== 0) player.dir = dx < 0 ? 'left' : 'right';
    if (player.moving) {
      move(dx, dy);
      Audio.sfx('step');
    }
    renderPlayerOnly();
  }

  function step(dir, amount) {
    const map = { up: [0, -amount], down: [0, amount], left: [-amount, 0], right: [amount, 0] };
    const [dx, dy] = map[dir] || [0, 0];
    const player = activePlayer();
    if (dx !== 0) player.dir = dx < 0 ? 'left' : 'right';
    player.moving = true;
    move(dx, dy);
    Audio.sfx('step');
    renderPlayerOnly();
  }

  function move(dx, dy) {
    const player = activePlayer();
    const next = { x: clamp(player.x + dx, 5, 95), y: clamp(player.y + dy, 11, 89) };
    if (state.mode === 'stage' && hitsObstacle(next)) return;
    player.x = next.x;
    player.y = next.y;
  }

  function hitsObstacle(point) {
    const stage = getStage();
    return stage.props.some((p) => {
      const sizes = { table: [9, 7], barrel: [5, 7], crate: [6, 6], toolbox: [6, 5], cat: [4, 4] };
      const [w, h] = sizes[p.type] || [5, 5];
      return point.x > p.x - w && point.x < p.x + w && point.y > p.y - h && point.y < p.y + h;
    });
  }

  function renderSprite(board, id, player) {
    const sprite = document.createElement('div');
    sprite.id = id;
    sprite.className = `sprite ${state.selected?.css || 'engineer'} ${player.dir === 'left' ? 'left' : ''} ${player.moving ? 'moving' : ''}`;
    sprite.style.left = `${player.x}%`;
    sprite.style.top = `${player.y}%`;
    sprite.innerHTML = '<span></span>';
    board.appendChild(sprite);
  }

  function renderPlayerOnly() {
    const id = state.mode === 'world' ? '#world-player' : '#stage-player';
    const sprite = UI.$(id);
    const player = activePlayer();
    if (!sprite) return;
    sprite.className = `sprite ${state.selected?.css || 'engineer'} ${player.dir === 'left' ? 'left' : ''} ${player.moving ? 'moving' : ''}`;
    sprite.style.left = `${player.x}%`;
    sprite.style.top = `${player.y}%`;
  }

  function obj(className, x, y) {
    const el = document.createElement('div');
    el.className = className;
    el.style.left = `${x}%`;
    el.style.top = `${y}%`;
    return el;
  }

  function activePlayer() { return state.mode === 'world' ? state.worldPlayer : state.stagePlayer; }
  function getStage() { return DATA.stages[state.stageIndex]; }
  function nearestGate() {
    let nearest = null;
    DATA.stages.forEach((stage, index) => {
      const d = dist(state.worldPlayer, stage.gate);
      if (d < 12 && (!nearest || d < nearest.distance)) nearest = { index, distance: d };
    });
    return nearest;
  }
  function labelForMode(mode) { return mode === 'questions' ? 'Questions' : mode === 'puzzles' ? 'Board Puzzle' : 'Mixed'; }
  function normalize(v) { return String(v).trim().toLowerCase().replace(/\b(watts?|w|amps?|a|ohms?)\b|Ω/g, '').replace(/\s+/g, ' '); }
  function dist(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }
  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
  function unique(arr) { return [...new Set(arr)]; }
  function shuffle(items) {
    const arr = [...items];
    for (let i = arr.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
  function interleave(a, b) {
    const out = [];
    const max = Math.max(a.length, b.length);
    for (let i = 0; i < max; i += 1) {
      if (a[i]) out.push(a[i]);
      if (b[i]) out.push(b[i]);
    }
    return shuffle(out);
  }
})();
