const SVG_NS = 'http://www.w3.org/2000/svg'

function propsEqual(a, b) {
  const ak = Object.keys(a);
  const bk = Object.keys(b);
  if (ak.length !== bk.length) return false;
  for (const k of ak) {
    if (a[k] !== b[k]) return false;
  }
  return true;
}


function propsAssign(el, vnode) { //just pass vnode
  const props = vnode.props;
  if (vnode.isSVG) {
    for (const [k, v] of Object.entries(props)) {
      if (['string', 'number'].includes(typeof(v))) el.setAttributeNS(null, k, v); //TODO check for numbers
      if (typeof(v) === 'function') el[k] = v;
    }
  } else {
    Object.assign(el, props);
  }
}

function makeDom(vnode) { //TODO split to make-tag and make-text?
  if (typeof(vnode) === 'object') { //TODO redundant condition?
    let el;
    if (vnode.isSVG) {
      el = document.createElementNS(SVG_NS, vnode.type); //ternary op instead?
    } else {
      el = document.createElement(vnode.type);
    }
    propsAssign(el, vnode);
    return el;
  } else {
    return document.createTextNode(vnode);
  }
}

//TODO ponder keys, changing append to insert n' stuff
function diff(vnew, vold, root, idx) {
  let el = root.childNodes?.[idx];
  if (typeof(vnew) === 'object') {
    if (el === undefined) {
      /**none with text**/
      el = makeDom(vnew);
      root.appendChild(el); 
    } else {
      if (typeof(vold) === 'object') {
        /**tag with tag**/
        if (vnew.type !== vold.type) el.replaceWith(makeDom(vnew));
        else if (!propsEqual(vnew.props, vold.props)) propsAssign(el, vnew); //replace above with makeTag, replace 'else if' with 'if'
      } else {
        /**text with tag**/
        el.replaceWith(makeDom(vnew));
        el = root.childNodes[idx];
      }
    }
    vnew.children.map((c, i) => diff(c, vold?.children?.[i], el, i));
    if (vnew.ref) vnew.ref.current = el;
    const lenOld = vold?.children ? vold.children.length : 0;
    for (let i=lenOld-1; i>=vnew.children.length; i--) el.childNodes[i].remove();
  } else {
    if (el === undefined) {
      /**none with text**/
      el = makeDom(vnew);
      root.appendChild(el);
    } else {
      if (typeof(vold) === 'object') {
        /**tag with text**/
        el.replaceWith(makeDom(vnew));
      } else {
        /**text with text**/
        if (vnew !== vold) el.data = vnew;
      }
    }
  }
}

function Vnode(x, isInSVG=false) {
  if (Array.isArray(x)) {
    const isSVG = isInSVG || x[0] === 'svg';
    if (x?.[1]?.constructor?.name === 'Object') {
      return {
        type: x[0],
        props: Object.fromEntries(Object.entries(x[1]).filter(([k, v]) => k !== 'ref')),
        children: x.slice(2).map(x => Vnode(x, isSVG)),
        ref: x[1].ref,
        isSVG: isSVG,
      };
    }
    return {type: x[0], props: {}, children: x.slice(1).map(x => Vnode(x, isSVG)), isSVG: isSVG};
  }
  return x;
}

let vdom_g;
function render(expr, root) {
  const vnew = Vnode(expr);
  diff(vnew, vdom_g, root, 0);
  vdom_g = vnew;
}

let model_g;
function init(model, view, root) {
  model_g = model;
  function draw() {
    render(view(model_g, draw), root);
  }
  render(view(model_g, draw), root);
}

export {init};

