
let state = 0;

function inc() {
  state++;
  render();
}

function dec() {
  state--;
  render();
}

function wrap(tag, x) {
  return `<${tag}>${x}</${tag}>`;
}
function arrwrap(tag, arr) {
  return arr.map(x => wrap(tag, x)).join('');
}

function render() {
  const foo = Array(20).fill().map((x, i) => Array(20).fill().map((x, j) => i+j+state))
  document.body.innerHTML = `
    <span>
      <div>
        <input type='button' value='-' onclick='dec()'>
        <input value='${state}'>
        <input type='button' value='+' onclick='inc()'>
      </div>
      <div style='overflow: scroll; white-space: nowrap; width: 200px'>
        l${'o'.repeat(100)}ng text
      </div>
      ${state % 2 ? 'odd' : '<b>even</b>'}
      <table>
        ${arrwrap('tr', foo.map(x => arrwrap('td', x)))}
      </table>
      <div>${arrwrap('i', Array(Math.abs(state)).fill(`${state < 0 ? 'anti-' : ''}bottle `))}</div>
      <br>
      <div>${arrwrap('span', Array(5000).fill('unchanging text '))}</div>
    </span>
  `;
}

render();

