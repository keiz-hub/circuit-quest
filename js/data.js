window.CQ = {
  settings: {
    stagesPerRun: 5,
    baseSpeed: 0.34,
    touchStep: 1.5
  },
  characters: [
    {
      id: 'engineer',
      css: 'engineer',
      name: 'Wire Yuhir',
      job: 'Field Engineer',
      role: 'Balanced movement and circuit reading.',
      skill: 'Wire Scan'
    },
    {
      id: 'mechanic',
      css: 'mechanic',
      name: 'Con Fuse',
      job: 'Circuit Mechanic',
      role: 'Good at repairs and broken paths.',
      skill: 'Fuse Fix'
    },
    {
      id: 'scientist',
      css: 'scientist',
      name: 'Dr. Strange',
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
      npc: { icon: '👩‍🔬', name: 'Lab Tech Nia', line: 'The backup lights are failing. Go to the broken console and complete the circuit checks to restore this lab.' },
      gate: { x: 14, y: 72 },
      spawn: { x: 14, y: 78 },
      console: { x: 75, y: 35 },
      exit: { x: 85, y: 74 },
      props: [],
      questions: [
        { type: 'input', q: 'Backup lamp uses 12V and 2A.\nPower = ? W', a: '24', tip: 'Use P = V × I.' },
        { type: 'input', q: 'Current = V ÷ R\n20V ÷ 4Ω = ? A', a: '5', tip: 'Divide voltage by resistance.' },
        { type: 'choice', q: 'A closed switch creates a:', choices: ['complete path', 'broken path', 'short label'], a: 'complete path', tip: 'Current needs a complete loop.' },
        { type: 'choice', q: 'The unit of resistance is:', choices: ['ohm', 'ampere', 'watt'], a: 'ohm', tip: 'Resistance uses Ω.' },
        { type: 'input', q: 'A buzzer uses 6V and 3A.\nPower = ? W', a: '18', tip: 'P = V × I.' },
        { type: 'choice', q: 'In a series circuit, current is:', choices: ['same through all parts', 'always zero', 'random'], a: 'same through all parts', tip: 'There is one path in series.' },
        { type: 'input', q: 'Ohm\'s Law check:\n9V through 3Ω = ? A', a: '3', tip: 'V ÷ Ω.' },
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
      taskCount: 2,
      npc: { icon: '🧰', name: 'Mechanic Bo', line: 'The board is missing parts. Pick the correct component or wire path to repair the resistor bench.' },
      gate: { x: 33, y: 62 },
      spawn: { x: 84, y: 76 },
      console: { x: 26, y: 34 },
      exit: { x: 14, y: 74 },
      props: [],
      questions: [],
      puzzles: [
        { type: 'repair', title: 'Protect the LED', prompt: 'The LED is connected to power. Add the part that limits current.', correctPart: 'Resistor', parts: ['Resistor', 'Direct Wire'], correctPins: ['5V', 'LED+'], pinOptions: ['5V', 'LED+', 'GND', 'PIN 2'], tip: 'For Grade 9: LED + resistor + power is safer than direct wire.' },
        { type: 'repair', title: 'Complete a Series Path', prompt: 'The wire from the battery to R1 is missing. Choose the simple connector.', correctPart: 'Wire', parts: ['Wire', 'Open Gap'], correctPins: ['BAT+', 'R1'], pinOptions: ['BAT+', 'R1', 'GND', 'LED+'], tip: 'Series means one continuous path.' },
        { type: 'repair', title: 'Restore a Parallel Branch', prompt: 'A branch is disconnected. Use a branch wire to reconnect the two nodes.', correctPart: 'Branch Wire', parts: ['Branch Wire', 'Broken Wire'], correctPins: ['NODE A', 'NODE B'], pinOptions: ['NODE A', 'NODE B', '5V', 'GND'], tip: 'Parallel circuits have more than one path.' },
        { type: 'repair', title: 'Replace the Safety Fuse', prompt: 'The safety fuse is missing between IN and OUT.', correctPart: 'Fuse', parts: ['Fuse', 'Direct Short'], correctPins: ['IN', 'OUT'], pinOptions: ['IN', 'OUT', '5V', 'LED+'], tip: 'A fuse protects the circuit from too much current.' },
        { type: 'repair', title: 'Button Input Ground', prompt: 'Keep the button input stable by connecting PIN 2 to ground through a resistor.', correctPart: 'Resistor', parts: ['Resistor', 'Open Wire'], correctPins: ['PIN 2', 'GND'], pinOptions: ['PIN 2', 'GND', '5V', 'LED+'], tip: 'This is a simple input circuit: input pin + resistor to ground.' }
      ]
    },
    {
      id: 'flow',
      title: 'Current Flow Tunnel',
      theme: 'flow',
      icon: '➜',
      gateLabel: 'FLOW',
      challengeMode: 'questions',
      taskCount: 4,
      npc: { icon: '📡', name: 'Signal Scout', line: 'The tunnel sensors are confused. Use the console to decode current flow and repair the readings.' },
      gate: { x: 52, y: 50 },
      spawn: { x: 14, y: 78 },
      console: { x: 69, y: 64 },
      exit: { x: 84, y: 30 },
      props: [],
      questions: [
        { type: 'choice', q: 'Conventional current flows from:', choices: ['positive to negative', 'negative to positive', 'middle outward'], a: 'positive to negative', tip: 'This is the conventional current direction.' },
        { type: 'input', q: 'Current = V ÷ R\n24V ÷ 6Ω = ? A', a: '4', tip: 'V ÷ R.' },
        { type: 'choice', q: 'A broken branch has current of:', choices: ['0A', '10A', 'double current'], a: '0A', tip: 'No path means no current.' },
        { type: 'input', q: '15V through 5Ω gives ? A', a: '3', tip: 'V ÷ R.' },
        { type: 'choice', q: 'An ammeter measures:', choices: ['current', 'resistance', 'length'], a: 'current', tip: 'Current is measured in amperes.' },
        { type: 'input', q: '7A enters a node. Branches use 2A and 3A.\nRemaining branch = ? A', a: '2', tip: 'A - A - A.' },
        { type: 'input', q: '10A enters a junction. One branch has 4A and another has 1A. Last branch = ? A', a: '5', tip: 'A - A - A.' },
        { type: 'choice', q: 'Current is measured in:', choices: ['amperes', 'ohms', 'watts only'], a: 'amperes', tip: 'Ampere is the current unit.' },
        { type: 'input', q: 'A 12V line through 2Ω gives ? A', a: '6', tip: 'V ÷ R.' },
        { type: 'choice', q: 'A short circuit usually has:', choices: ['very low resistance', 'infinite resistance', 'no wire'], a: 'very low resistance', tip: 'Low resistance can create dangerous current.' },
        { type: 'choice', q: 'Current needs a path that is:', choices: ['closed', 'painted', 'hidden'], a: 'closed', tip: 'A closed path lets current flow.' },
        { type: 'input', q: '6A enters a junction. One branch uses 2A.\nOther branch = ? A', a: '4', tip: 'A - A = ?.' },
        { type: 'choice', q: 'The symbol A means:', choices: ['ampere', 'ohm', 'watt'], a: 'ampere', tip: 'Ampere is the unit for current.' }
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
      taskCount: 3,
      npc: { icon: '🌱', name: 'Grid Keeper', line: 'The plant route is broken. Use the console to choose the missing parts and complete the safe path.' },
      gate: { x: 70, y: 38 },
      spawn: { x: 14, y: 78 },
      console: { x: 35, y: 60 },
      exit: { x: 82, y: 30 },
      props: [],
      questions: [],
      puzzles: [
        { type: 'repair', title: 'Reconnect Ground', prompt: 'The sensor ground is broken. Connect GND to SENSOR-.', correctPart: 'Ground Wire', parts: ['Ground Wire', 'Open Gap'], correctPins: ['GND', 'SENSOR-'], pinOptions: ['GND', 'SENSOR-', '5V', 'PIN 4'], tip: 'Ground completes the return path.' },
        { type: 'repair', title: 'Switch a Load Safely', prompt: 'A controller pin must switch a load safely. Choose the module, then connect PIN 8 to LOAD.', correctPart: 'Relay Module', parts: ['Relay Module', 'Paper Clip'], correctPins: ['PIN 8', 'LOAD'], pinOptions: ['PIN 8', 'LOAD', 'GND', 'LED+'], tip: 'A relay is a safe switch for a larger load.' },
        { type: 'repair', title: 'Wire the Button', prompt: 'Connect the button to input PIN 4.', correctPart: 'Button Wire', parts: ['Button Wire', 'Short Wire'], correctPins: ['BTN', 'PIN 4'], pinOptions: ['BTN', 'PIN 4', '5V', 'MOTOR'], tip: 'The controller reads the button through an input pin.' },
        { type: 'repair', title: 'Restore Positive Supply', prompt: 'Connect 5V to BUS+ so the branch receives power.', correctPart: '5V Jumper', parts: ['5V Jumper', 'GND Jumper'], correctPins: ['5V', 'BUS+'], pinOptions: ['5V', 'BUS+', 'GND', 'PIN 8'], tip: 'Positive supply goes to the positive bus.' },
        { type: 'repair', title: 'Control a Motor Safely', prompt: 'A motor needs more current than a small pin can give. Choose the driver and connect PIN 9 to MOTOR.', correctPart: 'Motor Driver', parts: ['Motor Driver', 'Bare Wire'], correctPins: ['PIN 9', 'MOTOR'], pinOptions: ['PIN 9', 'MOTOR', 'GND', 'LED+'], tip: 'A driver protects the controller pin.' },
        { type: 'repair', title: 'Bridge the Broken Trace', prompt: 'The path between NODE A and NODE B is broken. Add a trace bridge.', correctPart: 'Trace Bridge', parts: ['Trace Bridge', 'No Connect'], correctPins: ['NODE A', 'NODE B'], pinOptions: ['NODE A', 'NODE B', '5V', 'GND'], tip: 'A complete path restores continuity.' }
      ]
    },
    {
      id: 'core',
      title: 'Smart City Core',
      theme: 'core',
      icon: '★',
      gateLabel: 'CORE',
      challengeMode: 'mixed',
      taskCount: 4,
      npc: { icon: '🛰️', name: 'Core AI', line: 'Final repair required. Complete both circuit questions and board repairs to restore the smart city.' },
      gate: { x: 88, y: 24 },
      spawn: { x: 14, y: 78 },
      console: { x: 52, y: 34 },
      exit: { x: 84, y: 74 },
      props: [],
      questions: [
        { type: 'choice', q: 'In series circuits, current is:', choices: ['same in every component', 'different everywhere', 'always zero'], a: 'same in every component', tip: 'Series has one current path.' },
        { type: 'choice', q: 'In parallel circuits, branch voltage is:', choices: ['the same', 'always added', 'always zero'], a: 'the same', tip: 'Parallel branches share source voltage.' },
        { type: 'input', q: 'Final code: (10 + 8) × 2 = ?', a: '36', tip: 'Parentheses first.' },
        { type: 'input', q: 'Launch line: 5² − 3 = ?', a: '22', tip: '?? - ?.' },
        { type: 'input', q: '18V through 3Ω gives ? A', a: '6', tip: 'V ÷ R.' },
        { type: 'choice', q: 'Source current in parallel equals:', choices: ['sum of branch currents', 'smallest branch', 'one resistor'], a: 'sum of branch currents', tip: 'Branches add at the source.' },
        { type: 'input', q: 'Equivalent series resistance of 5Ω, 6Ω, and 9Ω = ? Ω', a: '20', tip: 'Add series resistors.' },
        { type: 'input', q: 'City core load: 120V × 2A = ? W', a: '240', tip: 'Power = volts × amps.' },
        { type: 'choice', q: 'Which circuit has more than one path?', choices: ['parallel', 'series', 'open'], a: 'parallel', tip: 'Parallel circuits have branches.' },
        { type: 'input', q: 'Two series resistors: 4Ω + 6Ω = ? Ω', a: '10', tip: 'Series resistors add.' },
        { type: 'choice', q: 'A broken wire creates an:', choices: ['open circuit', 'extra battery', 'automatic repair'], a: 'open circuit', tip: 'A broken wire opens the path.' }
      ],
      puzzles: [
        { type: 'repair', title: 'Core Status LED', prompt: 'Protect the status LED. Choose the resistor and connect PIN 13 to LED+.', correctPart: 'Resistor', parts: ['Resistor', 'Direct Wire'], correctPins: ['PIN 13', 'LED+'], pinOptions: ['PIN 13', 'LED+', 'GND', 'FAN'], tip: 'LEDs need resistors to limit current.' },
        { type: 'repair', title: 'Emergency Fan Control', prompt: 'Use a driver so PIN 10 can control the fan safely.', correctPart: 'Driver', parts: ['Driver', 'Direct Pin'], correctPins: ['PIN 10', 'FAN'], pinOptions: ['PIN 10', 'FAN', '5V', 'LED+'], tip: 'A driver helps control higher current devices.' },
        { type: 'repair', title: 'Final Ground Link', prompt: 'Complete the common ground connection from GND to CORE-.', correctPart: 'Ground Link', parts: ['Ground Link', '5V Link'], correctPins: ['GND', 'CORE-'], pinOptions: ['GND', 'CORE-', '5V', 'PIN 13'], tip: 'All modules need a shared ground.' }
      ]
    }
  ]
};
