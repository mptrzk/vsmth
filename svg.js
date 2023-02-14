const ns = 'http://www.w3.org/2000/svg'
const s = document.createElementNS(ns, 'svg');
const c = document.createElementNS(ns, 'circle');
c.setAttributeNS(null, 'cx', '40');
c.setAttributeNS(null, 'cy', '40');
c.setAttributeNS(null, 'r', '40');
s.appendChild(c);
document.body.appendChild(s);
