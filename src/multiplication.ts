import { Config } from "./Config";
import { getPoint } from "./math";
import { querySelector, setAttr } from "./utils";

const SVGNS = "http://www.w3.org/2000/svg";

export function init(c: Config) {
  const rangeNbrElt = querySelector("input[type=range][name=nbr]");
  rangeNbrElt.addEventListener("input", (evt) => sync(c));

  const rangeMultiElt = querySelector("input[type=range][name=multi]");
  rangeMultiElt.addEventListener("input", (evt) => sync(c));

  const checkboxElt = querySelector("input[type=checkbox][name=showText]");
  checkboxElt.addEventListener("input", (evt) => sync(c));
}

export function sync(c: Config) {
  const rangeElt = querySelector<HTMLInputElement>(
    "input[type=range][name=nbr]"
  );
  const rangeMultiElt = querySelector<HTMLInputElement>(
    "input[type=range][name=multi]"
  );
  const checkboxElt = querySelector<HTMLInputElement>(
    "input[type=checkbox][name=showText]"
  );
  const divElt = querySelector("#nbr");
  divElt.innerHTML = rangeElt.value;
  const divMultiElt = querySelector("#multi");
  divMultiElt.innerHTML = rangeMultiElt.value;

  c.nbr = +rangeElt.value;
  c.multi = +rangeMultiElt.value;
  c.showText = checkboxElt.checked;
  draw(c);
}

function draw(c: Config) {
  reset();

  addLines(c);

  if (c.showText) {
    addSmallCircles(c);
  }
}

function reset() {
  const g = querySelector("svg g.draw");
  const svg = g.parentElement;
  g.remove();
  const newG = document.createElementNS(SVGNS, "g");
  newG.setAttributeNS(null, "class", "draw");
  svg?.appendChild(newG);
}

function addSmallCircles(c: Config) {
  const g = querySelector("svg g.draw");
  for (let i = 0; i < c.nbr; i++) {
    const { x, y } = getPoint(i, c);

    const circle = document.createElementNS(SVGNS, "circle");
    setAttr(circle, "cx", x);
    setAttr(circle, "cy", y);
    setAttr(circle, "r", 5);
    g.appendChild(circle);

    const p = getPoint(i, {
      r: c.r + 30,
      cx: c.cx,
      cy: c.cy,
      nbr: c.nbr,
    });

    const text = document.createElementNS(SVGNS, "text");
    setAttr(text, "x", p.x);
    setAttr(text, "y", p.y);
    text.appendChild(document.createTextNode(i + ""));
    g.appendChild(text);
  }
}

function addLine(n1: number, n2: number, c: Config) {
  const g = querySelector("svg g.draw");
  const p1 = getPoint(n1, c);
  const p2 = getPoint(n2, c);
  const line = document.createElementNS(SVGNS, "line");
  setAttr(line, "x1", p1.x);
  setAttr(line, "y1", p1.y);
  setAttr(line, "x2", p2.x);
  setAttr(line, "y2", p2.y);
  g.appendChild(line);
}

function addLines(c: Config) {
  for (let i = 0; i < c.nbr; i++) {
    addLine(i, i * c.multi, c);
  }
}
