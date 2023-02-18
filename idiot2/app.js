import {init, draw} from './vsmth.js'
//import {model, bind, draw} from './vsmth.js'


const model = {
  count: 0,
  knob: 0,
  locked: false,
}


function viewKnob(knob, model) {
  const knobRef = {};
  function locc() {
    knobRef.current.requestPointerLock();
    model.locked = true;
    //updating model without re-rendering. That's cool
  }
  function move(e) { //change to turn
    if (model.locked) {
      model.knob -= e.movementY;
      draw();
    }
  }
  function unlocc() {
    document.exitPointerLock();
    model.locked = false;
  }
  return (
    ['svg', {style: 'width: 40px; height: 40px;'},
      ['g', {transform: `rotate(${model.knob}, 20, 20)`},
        ['circle', {ref: knobRef, cx: 20, cy: 20, r: 20, onmousedown: locc, onmouseup: unlocc, onmousemove: e => move(e)}],
        ['rect', {x: 20-1.5, y: 2, width: 3, height: `30%`, fill: 'white'}],
      ],
    ]
  );
}

function view(model) {
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
      ['div', {style: 'display: flex; column-gap: 0.6em; align-items: center'},
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
        viewKnob(model.knob, model),
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

init(model, view, document.body);

