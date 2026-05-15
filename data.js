window.CQ = {
  settings: {
    stagesPerRun: 5,
    baseSpeed: 0.42,
    touchStep: 2.4
  },
  characters: [
    {
      id: 'engineer',
      css: 'engineer',
      name: 'Ari Volt',
      job: 'Field Engineer',
      role: 'Balanced movement and circuit reading.',
      skill: 'Wire Scan'
    },
    {
      id: 'mechanic',
      css: 'mechanic',
      name: 'Mika Fuse',
      job: 'Circuit Mechanic',
      role: 'Good at repairs and broken paths.',
      skill: 'Fuse Fix'
    },
    {
      id: 'scientist',
      css: 'scientist',
      name: 'Dr. Lumi',
      job: 'Lab Scientist',
      role: 'Best at calculations and analysis.',
      skill: 'Flow Decode'
    }
  ],
  stages: [
    {
      id: 'lab',
      title: 'Research Lab',
      theme: 'lab',
      icon: '⚡',
      gateLabel: 'LAB',
      challengeMode: 'questions',
      taskCount: 3,
      npc: { icon: '👩‍🔬', name: 'Lab Tech Nia', line: 'The backup lights are failing. Answer the console checks so I can reboot the lab breakers.' },
      gate: { x: 14, y: 72 },
      spawn: { x: 14, y: 78 },
      console: { x: 75, y: 35 },
      exit: { x: 85, y: 74 },
      npcPos: { x: 34, y: 54 },
      props: [],
      questions: [
        { type: 'input', q: 'Backup lamp uses 12V and 2A.\nPower = ? W', a: '24', tip: 'Use P = V × I.' },
        { type: 'input', q: 'Current = V ÷ R\n20V ÷ 4Ω = ? A', a: '5', tip: 'Divide voltage by resistance.' },
        { type: 'choice', q: 'A closed switch creates a:', choices: ['complete path', 'broken path', 'short label'], a: 'complete path', tip: 'Current needs a complete loop.' },
        { type: 'choice', q: 'The unit of resistance is:', choices: ['ohm', 'ampere', 'watt'], a: 'ohm', tip: 'Resistance uses Ω.' },
        { type: 'input', q: 'A buzzer uses 6V and 3A.\nPower = ? W', a: '18', tip: 'P = 6 × 3.' },
        { type: 'choice', q: 'In a series circuit, current is:', choices: ['same through all parts', 'always zero', 'random'], a: 'same through all parts', tip: 'There is one path in series.' },
        { type: 'input', q: 'Ohm\'s Law check:\n9V through 3Ω = ? A', a: '3', tip: '9 ÷ 3.' },
        { type: 'choice', q: 'A battery supplies:', choices: ['voltage', 'resistance only', 'wire color'], a: 'voltage', tip: 'A battery creates potential difference.' },
        { type: 'input', q: 'Power check:\n5V × 4A = ? W', a: '20', tip: 'Multiply volts and amps.' },
        { type: 'choice', q: 'An open switch means:', choices: ['no complete path', 'maximum current', 'parallel only'], a: 'no complete path', tip: 'Open means disconnected.' }
      ],
      puzzles: []
    },
    {
      id: 'resistors',
      title: 'Resistor Bench',
      theme: 'resistors',
      icon: '▣',
      gateLabel: 'RES',
      challengeMode: 'puzzles',
      taskCount: 4,
      npc: { icon: '🧰', name: 'Mechanic Bo', line: 'The board is missing parts. Pick the correct component or wire path to repair the resistor bench.' },
      gate: { x: 33, y: 62 },
      spawn: { x: 84, y: 76 },
      console: { x: 26, y: 34 },
      exit: { x: 14, y: 74 },
      npcPos: { x: 58, y: 48 },
      props: [],
      questions: [],
      puzzles: [
        { type: 'repair', title: 'LED Current Limiter', prompt: 'Choose the part that safely limits LED current.', correctPart: '220Ω Resistor', parts: ['220Ω Resistor', 'Direct Wire', 'Capacitor', 'Buzzer'], correctPins: ['5V', 'LED+'], tip: 'A resistor protects an LED from too much current.' },
        { type: 'repair', title: 'Series Resistor Path', prompt: 'Complete the path from source to R1 for a series circuit.', correctPart: 'Jumper Wire', parts: ['Jumper Wire', 'Open Switch', '9V Battery', 'Sensor'], correctPins: ['BAT+', 'R1'], tip: 'Series paths must stay connected end-to-end.' },
        { type: 'repair', title: 'Parallel Branch Restore', prompt: 'Pick the component needed to restore the second branch.', correctPart: 'Branch Wire', parts: ['Branch Wire', 'Broken Wire', 'Motor', 'LED only'], correctPins: ['NODE A', 'NODE B'], tip: 'Parallel circuits need branch connections.' },
        { type: 'repair', title: 'Fuse Replacement', prompt: 'Choose the safety part that protects the circuit.', correctPart: 'Fuse', parts: ['Fuse', 'Nail', 'Direct Short', 'Speaker'], correctPins: ['IN', 'OUT'], tip: 'A fuse opens the circuit during dangerous current.' },
        { type: 'repair', title: 'Pull-down Input', prompt: 'Choose the part that keeps an input stable when not pressed.', correctPart: '10kΩ Resistor', parts: ['10kΩ Resistor', 'LED', 'Open Wire', 'Piezo'], correctPins: ['PIN 2', 'GND'], tip: 'Pull-down resistors connect input to ground.' }
      ]
    },
    {
      id: 'flow',
      title: 'Current Flow Tunnel',
      theme: 'flow',
      icon: '➜',
      gateLabel: 'FLOW',
      challengeMode: 'questions',
      taskCount: 5,
      npc: { icon: '📡', name: 'Signal Scout', line: 'Current is flowing the wrong way through the tunnel sensors. Decode the readings before the gate overloads.' },
      gate: { x: 52, y: 50 },
      spawn: { x: 14, y: 78 },
      console: { x: 69, y: 64 },
      exit: { x: 84, y: 30 },
      npcPos: { x: 38, y: 40 },
      props: [],
      questions: [
        { type: 'choice', q: 'Conventional current flows from:', choices: ['positive to negative', 'negative to positive', 'middle outward'], a: 'positive to negative', tip: 'This is the conventional current direction.' },
        { type: 'input', q: 'Current = V ÷ R\n24V ÷ 6Ω = ? A', a: '4', tip: '24 ÷ 6.' },
        { type: 'choice', q: 'A broken branch has current of:', choices: ['0A', '10A', 'double current'], a: '0A', tip: 'No path means no current.' },
        { type: 'input', q: '15V through 5Ω gives ? A', a: '3', tip: '15 ÷ 5.' },
        { type: 'choice', q: 'An ammeter measures:', choices: ['current', 'resistance', 'length'], a: 'current', tip: 'Current is measured in amperes.' },
        { type: 'input', q: '7A enters a node. Branches use 2A and 3A.\nRemaining branch = ? A', a: '2', tip: '7 - 2 - 3.' },
        { type: 'input', q: '10A enters a junction. One branch has 4A and another has 1A. Last branch = ? A', a: '5', tip: '10 - 4 - 1.' },
        { type: 'choice', q: 'Current is measured in:', choices: ['amperes', 'ohms', 'watts only'], a: 'amperes', tip: 'Ampere is the current unit.' },
        { type: 'input', q: 'A 12V line through 2Ω gives ? A', a: '6', tip: '12 ÷ 2.' },
        { type: 'choice', q: 'A short circuit usually has:', choices: ['very low resistance', 'infinite resistance', 'no wire'], a: 'very low resistance', tip: 'Low resistance can create dangerous current.' }
      ],
      puzzles: []
    },
    {
      id: 'pathway',
      title: 'Broken Pathway Plant',
      theme: 'pathway',
      icon: '🔧',
      gateLabel: 'FIX',
      challengeMode: 'puzzles',
      taskCount: 6,
      npc: { icon: '🌱', name: 'Grid Keeper', line: 'The plant routes city power. Fix the broken pathways on the controller board to revive the grid.' },
      gate: { x: 70, y: 38 },
      spawn: { x: 14, y: 78 },
      console: { x: 35, y: 60 },
      exit: { x: 82, y: 30 },
      npcPos: { x: 55, y: 50 },
      props: [],
      questions: [],
      puzzles: [
        { type: 'repair', title: 'Broken Ground Path', prompt: 'Connect the sensor ground path.', correctPart: 'Ground Wire', parts: ['Ground Wire', 'LED', 'Open Switch', 'Motor'], correctPins: ['GND', 'SENSOR-'], tip: 'Sensors need a ground reference.' },
        { type: 'repair', title: 'Relay Control', prompt: 'Choose the part used to switch a higher-power load.', correctPart: 'Relay Module', parts: ['Relay Module', 'Loose Screw', 'Battery Label', 'Paper Clip'], correctPins: ['PIN 8', 'LOAD'], tip: 'A relay lets a low-power pin switch bigger loads.' },
        { type: 'repair', title: 'Input Button Path', prompt: 'Wire the button to the microcontroller input.', correctPart: 'Button Wire', parts: ['Button Wire', 'Short Wire', 'Buzzer', 'No Part'], correctPins: ['BTN', 'PIN 4'], tip: 'The controller reads a button through an input pin.' },
        { type: 'repair', title: 'Power Bus Restore', prompt: 'Connect the positive bus to feed the branch.', correctPart: '5V Jumper', parts: ['5V Jumper', 'GND Jumper', 'Capacitor only', 'Open Circuit'], correctPins: ['5V', 'BUS+'], tip: 'Positive supply must go to the positive bus.' },
        { type: 'repair', title: 'Motor Driver Enable', prompt: 'Choose the module needed to control a motor safely.', correctPart: 'Motor Driver', parts: ['Motor Driver', 'LED', 'Bare Wire', 'Resistor only'], correctPins: ['PIN 9', 'MOTOR'], tip: 'A motor driver protects the controller pin.' },
        { type: 'repair', title: 'Continuity Fix', prompt: 'Complete the broken trace between node A and B.', correctPart: 'Trace Bridge', parts: ['Trace Bridge', 'Wrong Jumper', 'Capacitor', 'No Connect'], correctPins: ['NODE A', 'NODE B'], tip: 'A trace bridge restores continuity.' }
      ]
    },
    {
      id: 'core',
      title: 'Smart City Core',
      theme: 'core',
      icon: '★',
      gateLabel: 'CORE',
      challengeMode: 'mixed',
      taskCount: 7,
      npc: { icon: '🛰️', name: 'Core AI', line: 'Final repair required. Solve calculations and complete the controller board to restore the smart city.' },
      gate: { x: 88, y: 24 },
      spawn: { x: 14, y: 78 },
      console: { x: 52, y: 34 },
      exit: { x: 84, y: 74 },
      npcPos: { x: 28, y: 50 },
      props: [],
      questions: [
        { type: 'choice', q: 'In series circuits, current is:', choices: ['same in every component', 'different everywhere', 'always zero'], a: 'same in every component', tip: 'Series has one current path.' },
        { type: 'choice', q: 'In parallel circuits, branch voltage is:', choices: ['the same', 'always added', 'always zero'], a: 'the same', tip: 'Parallel branches share source voltage.' },
        { type: 'input', q: 'Final code: (10 + 8) × 2 = ?', a: '36', tip: 'Parentheses first.' },
        { type: 'input', q: 'Launch line: 5² − 3 = ?', a: '22', tip: '25 - 3.' },
        { type: 'input', q: '18V through 3Ω gives ? A', a: '6', tip: '18 ÷ 3.' },
        { type: 'choice', q: 'Source current in parallel equals:', choices: ['sum of branch currents', 'smallest branch', 'one resistor'], a: 'sum of branch currents', tip: 'Branches add at the source.' },
        { type: 'input', q: 'Equivalent series resistance of 5Ω, 6Ω, and 9Ω = ? Ω', a: '20', tip: 'Add series resistors.' },
        { type: 'input', q: 'City core load: 120V × 2A = ? W', a: '240', tip: 'Power = volts × amps.' }
      ],
      puzzles: [
        { type: 'repair', title: 'Core LED Status', prompt: 'Protect the status LED with the correct component.', correctPart: '330Ω Resistor', parts: ['330Ω Resistor', 'Direct Wire', 'Relay', 'Open Gap'], correctPins: ['PIN 13', 'LED+'], tip: 'Controller LEDs need a resistor.' },
        { type: 'repair', title: 'Emergency Fan Control', prompt: 'Choose the safe control module for the fan.', correctPart: 'Transistor Driver', parts: ['Transistor Driver', 'Direct Pin', 'Loose Wire', 'Button'], correctPins: ['PIN 10', 'FAN'], tip: 'A driver lets a pin control higher current.' },
        { type: 'repair', title: 'Final Ground Link', prompt: 'Complete the common ground connection.', correctPart: 'Ground Link', parts: ['Ground Link', '5V Link', 'LED', 'No Part'], correctPins: ['GND', 'CORE-'], tip: 'All modules need a shared ground.' }
      ]
    }
  ]
};
