import {init, draw} from './vsmth.js'
//import {model, bind, draw} from './vsmth.js'


const model = {
  count: 0,
  pk: 0,
  gain: 0,
  knob1: {
    title: 'pokrętność',
    angle: 0,
    push: angle => model.pk = angle,
    pull: knob => knob.angle = model.pk,
    display: () => model.pk,
  },
  knob2: {
    title: 'gain',
    angle: 0, 
    push: angle => model.gain = angle/130*30,
    pull: knob => knob.angle = model.gain/30*130,
    display: () => Math.round(model.gain),
  },
  locked: false,
}

//one global vs many
//^^model.stuff is nicer to read

function viewKnob(knob) {
  const knobRef = {};
  function lock() {
    knobRef.current.requestPointerLock();
    model.locked = true;
    //updating model without re-rendering. That's cool
  }
  function turn(e) {
    if (model.locked) {
      knob.push(knob.angle - e.movementY)
      knob.pull(knob)
      draw();
    }
  }
  function unlock() {
    document.exitPointerLock();
    model.locked = false;
  }
  const events = {onmousedown: lock, onmouseup: unlock, onmousemove: turn};
  return (
    ['div',
      ['div', {className: 'knob'},
        ['span', {style: 'margin-bottom: 0.1em'}, knob.title],
        ['svg', {style: 'width: 40px; height: 40px;'},
          ['g', {transform: `rotate(${knob.angle}, 20, 20)`, ...events}, //using a function wouldn't be so pretty here
            ['circle', {ref: knobRef, cx: 20, cy: 20, r: 20}],
            ['rect', {x: 20-1.5, y: 2, width: 3, height: `30%`, fill: 'white'}],
          ],
        ],
        knob.display(),
      ]
    ]
  );
}

function view() {
  const foo = Array(20).fill().map((x, i) => Array(20).fill().map((x, j) => i+j+model.count));
  const ref = {};
  function inc() {
    model.count++;
    draw();
  }
  function dec() {
    model.count--;
    draw();
  }
  function write() {
    const val = parseInt(ref.current.value);
    if (val === undefined || isNaN(val)) return;
    model.count = parseInt(val);
    draw();
  };
  return (
    ['span',
      ['div', 
        ['div',
          ['input', {type: 'button', value: '-', onclick: dec}],
          ['input', {value: model.count, ref: ref, oninput: write}],
          ['input', {type: 'button', value: '+', onclick: inc}],
        ],
        ['div', {style:'overflow-x: scroll; white-space: nowrap; width: 200px'},
          `l${'o'.repeat(100)}ng text`
        ],
      ],
      ['div', {style: 'display: flex; padding: 5px'},
        viewKnob(model.knob1),
        viewKnob(model.knob2),
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

init(view, document.body);

