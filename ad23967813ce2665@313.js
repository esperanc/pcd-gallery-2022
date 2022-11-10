// https://observablehq.com/@fil/height@313
function _1(md){return(
md`# height

the viewport’s current height:
- The height of the browser viewport [in embed mode](https://visionscarto.net/obs/height/), including iPad and iPhone in portrait and landscape modes, and as a “saved to home screen” bookmark.
- The true height of the screen in the true fullscreen mode.
- *DEFAULT_HEIGHT* pixels in the usual or “observable fullscreen” modes.

*height* updates reactively with changes in the browser window on resize and orientationchange.


Usage:

~~~js
import {height} from "@fil/height"
~~~

or
~~~js
import {height} with {DEFAULT_HEIGHT} from "@fil/height"
~~~
`
)}

function _fullscreen(html)
{
  const button = html`<button>Fullscreen`;
  button.onclick = () =>
    button.parentElement.nextElementSibling.requestFullscreen();
  return button;
}


function _cell(html,embed,height,width){return(
html`<div id=map>

<style>
${
  embed
    ? `
html,body,.observablehq { padding: 0; margin: 0; }
`
    : ""
}
#map {
  height: ${height - 2 * 35}px;
  width: ${width - 2 * 35}px;
  border: 35px solid orange;
  background: white;
  color: black;
}
#map h1 {
  text-align: center;
  max-width: 100%;
}
</style>

<h1> W ${width} &times; H ${height} </h1>

</div>`
)}

function _height(Generators,embed,embedHeight,DEFAULT_HEIGHT,invalidation,DOM,html,outside){return(
Generators.observe(function (change) {
  let height;
  const getHeight = embed
    ? embedHeight
    : (() => {
        const t = document.body.appendChild(testcell(DEFAULT_HEIGHT));
        invalidation.then(() => t.remove());
        return () => t.getBoundingClientRect().height;
      })();

  update();

  function update() {
    const clientHeight = getHeight();
    if (clientHeight !== height) change((height = clientHeight));
  }

  const E = ["resize", "orientationchange"];
  E.forEach((e) => window.addEventListener(e, update));
  const remove = () => E.forEach((e) => window.removeEventListener(e, update));
  invalidation.then(remove);
  return remove;

  function testcell(height) {
    const id = DOM.uid("height-test").id;
    return html`<div style="position: fixed; width: 1px; ${
      outside ? `height: 100%;` : `min-height: ${height}px;`
    }" id="${id}">
      <style>
        ${
          !outside
            ? ""
            : `html, body {
          padding: 0 !important;
          margin: 0 !important;
          height: 100% !important;
          max-height: 100% !important;
          width: 100vw !important;
        }`
        }
        body.fullscreen #${id} { height: 100%!important; }
    `;
  }
})
)}

function _DEFAULT_HEIGHT(SCREEN_HEIGHT,width){return(
Math.min(SCREEN_HEIGHT, width * 0.7) | 0
)}

function _SCREEN_HEIGHT(screen){return(
screen.height
)}

function _embedHeight(html,invalidation)
{
  const el = document.body.appendChild(
    html`<div style="position:absolute;top:0;left:0;width:0;height:100%;visibility:hidden">`
  );
  invalidation.then(() => el.remove());
  return () => el.clientHeight;
}


function _url(){return(
new URL(document.location)
)}

function _outside(url){return(
!url.host.endsWith(".observableusercontent.com")
)}

function _embed(outside,url){return(
!outside && url.searchParams.has("cells")
)}

function _11(md){return(
md`_My thanks to [Pierre Ripoll](https://observablehq.com/@pierreleripoll) and [Fabian Iwand](https://observablehq.com/@mootari) for suggestions._`
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("fullscreen")).define("fullscreen", ["html"], _fullscreen);
  main.variable(observer("cell")).define("cell", ["html","embed","height","width"], _cell);
  main.variable(observer("height")).define("height", ["Generators","embed","embedHeight","DEFAULT_HEIGHT","invalidation","DOM","html","outside"], _height);
  main.variable(observer("DEFAULT_HEIGHT")).define("DEFAULT_HEIGHT", ["SCREEN_HEIGHT","width"], _DEFAULT_HEIGHT);
  main.variable(observer("SCREEN_HEIGHT")).define("SCREEN_HEIGHT", ["screen"], _SCREEN_HEIGHT);
  main.variable(observer("embedHeight")).define("embedHeight", ["html","invalidation"], _embedHeight);
  main.variable(observer("url")).define("url", _url);
  main.variable(observer("outside")).define("outside", ["url"], _outside);
  main.variable(observer("embed")).define("embed", ["outside","url"], _embed);
  main.variable(observer()).define(["md"], _11);
  return main;
}
