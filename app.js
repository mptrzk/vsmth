import {init, draw} from './vsmth.js'
//import {model, bind, draw} from './vsmth.js'


const model = {
  count: 0,
  pk: {val: 0},
  gain: {val: 0},
  freq: {val: 440},
  locked: false,
}


//one global vs many
//^^model.stuff is nicer to read

function viewKnob(knob) {
  const knobRef = {};
  const param = knob.param;
  const angle = knob.p2r(param.val);
  function lock() {
    knobRef.current.requestPointerLock();
    model.locked = true;
    //updating model without re-rendering. That's cool
  }
  function turn(e) {
    if (model.locked) {
      param.val = knob.r2p(angle - e.movementY)
      //wouldn't referencing the model be nicer?
      //or even param as a key? like that: model[param]
      draw();
    }
  }
  function unlock() {
    document.exitPointerLock();
    model.locked = false;
  }
  const events = {onmousedown: lock, onmouseup: unlock, onmousemove: turn};
  return (
      ['div', {className: 'knob'},
        ['span', {style: 'margin-bottom: 0.1em'}, knob.title],
        ['svg', {style: 'width: 40px; height: 40px;'},
          ['g', {transform: `rotate(${angle}, 20, 20)`, ...events}, //using a function wouldn't be so pretty here
            ['circle', {ref: knobRef, cx: 20, cy: 20, r: 20}],
            ['rect', {x: 20-1.5, y: 2, width: 3, height: `30%`, fill: 'white'}],
          ],
        ],
        knob.show(param.val),
      ]
  );
}

//function siPrefix()

function viewFreqKnob() {
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
    const val = parseInt(ref.current.value); //is this ref avoidable? (e.target.value)
    if (val === undefined || isNaN(val)) return;
    model.count = parseInt(val);
    draw();
  };
  const lspan = Math.log(20000) / Math.log(440) - 1;
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
      ['div', {style: 'display: flex; padding: 5px; gap: 1em'},
        viewKnob({
          title: 'pokrętność',
          param: model.pk,
          r2p: angle => angle,
          p2r: pk => pk,
          show: pk => `${pk}°`,
        }),
        viewKnob({
          title: 'gain',
          param: model.gain,
          r2p: angle => angle/130*30,
          p2r: gain => gain/30*130,
          show: gain => `${Math.floor(gain)} dB`,
        }),
        viewKnob({
          title: 'cutoff',
          param: model.freq,
          ...(model.logfreq ? {
            r2p: angle => 440**(1 + angle/130*lspan), //TODO implement log freq
            p2r: freq => (Math.log(freq) / Math.log(440) - 1)/lspan*130,
          } : {
            r2p: angle => (angle + 130)/(2*130)*20000,
            p2r: freq => freq/20000*(2*130)-130,
          }),
          show: freq => `${Math.floor(freq)} Hz`,
        }),
      ],
      ['div',
        'log freq?',
        ['input', {type: 'checkbox', onchange: e => {model.logfreq = e.target.checked; draw()}}],
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

