
let state = 0;

function inc() {
  state++;
  display();
}

function dec() {
  state--;
  display();
}

function render(x, dom) {
  if (Array.isArray(x)) {
    const el = document.createElement(x[0]);
    if (x?.[1]?.constructor?.name === 'Object') {
      Object.assign(el, x[1]);
      x.slice(2).map(y => render(y, el));
    } else {
      x.slice(1).map(y => render(y, el));
    }
    dom.appendChild(el);
  } else {
    dom.appendChild(document.createTextNode(x));
  }
}

function display() {
  const foo = Array(20).fill().map((x, i) => Array(20).fill().map((x, j) => i+j+state));
  const ret =  
    ['span',
      ['div',
        ['input', {type: 'button', value: '-', onclick: dec}],
        ['input', {value: state}],
        ['input', {type: 'button', value: '+', onclick: inc}],
      ],
      ['div', {style:'overflow-x: scroll; white-space: nowrap; width: 200px'},
        `l${'o'.repeat(100)}ng text`
      ],
      (state % 2) ? 'odd' : ['b', 'even'],
      ['table',
        ...foo.map(row =>
          ['tr',
            ...row.map(col => ['td', col])
          ]
        ), 
      ],
      ['br'],
      ['div', ...Array(Math.abs(state)).fill(['i', `${state < 0 ? 'anti-' : ''}bottle `])],
      ['div', ...Array(5000).fill(['span', 'unchanging text '])],
    ];
  document.body.replaceChildren();
  render(ret, document.body);
}


display();

