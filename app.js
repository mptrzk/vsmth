import {init} from './vsmth.js'

const model = {
  count: 0,
  knob: 0,
  locked: false,
  wasTyped: false,
}

function update(model, action, message) {
  model.wasTyped = false;
  switch (action) {
    case 'inc':
      model.count++;
      return model;
    case 'dec':
      model.count--;
      return model;
    case 'set':
      model.count = message;
      model.wasTyped = true;
      return model;
    case 'lock':
      model.locked = true;
      return model;
    case 'unlock':
      model.locked = false;
      return model;
    case 'move':
      model.knob -= message;
      return model;
    default:
      console.error(`invalid action - ${action}`);
  }
}

function view(model, send) {
  const foo = Array(20).fill().map((x, i) => Array(20).fill().map((x, j) => i+j+model.count));
  const ref = {};
  const lock = {};
  function processInput() {
    const val = parseInt(ref.current.value);
    if (val === undefined || isNaN(val)) return;
    send('set', parseInt(val));
  };
  function locc() {
    lock.current.requestPointerLock();
    send('lock');
  }
  function move(e) {
    if (model.locked) send('move', e.movementY);
  }
  function unlocc() {
    document.exitPointerLock();
    send('unlock');
  }
  return (
    ['span',
      ['div', {style: 'display: flex; column-gap: 0.6em; align-items: center'},
        ['div', 
          ['div',
            ['input', {type: 'button', value: '-', onclick: () => send('dec')}],
            ['input', {value: model.count, ref: ref, oninput: processInput}],
            ['input', {type: 'button', value: '+', onclick: () => send('inc')}],
          ],
          ['div', {style:'overflow-x: scroll; white-space: nowrap; width: 200px'},
            `l${'o'.repeat(100)}ng text`
          ],
        ],
        ['div', 
          ['svg', {style: 'width: 40px; height: 40px;'},
            ['g', {transform: `rotate(${model.knob}, 20, 20)`},
              ['circle', {ref: lock, cx: 20, cy: 20, r: 20, onmousedown: locc, onmouseup: unlocc, onmousemove: e => move(e)}],
              ['rect', {x: 20-1.5, y: 2, width: 3, height: `30%`, fill: 'white'}],
            ],
          ],
        ],
        `pokrętność - ${model.knob}°`,
      ],
      (model.count % 2) ? 'odd' : ['b', 'even'],
      ['table',
        ...foo.map(row =>
          ['tr',
            ...row.map(col => ['td', col])
          ]
        ), 
      ],
      ['br'],
      ['div', ...Array(Math.abs(model.count)).fill(['i', `${model.count < 0 ? 'anti-' : ''}bottle `])],
      ['div', ...Array(5000).fill(['span', 'unchanging text '])],
    ]
  );
}

init(model, update, view, document.body);

