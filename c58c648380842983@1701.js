import define1 from "./9cffd5bf08a9c92c@120.js";
import define2 from "./ad23967813ce2665@313.js";
import define3 from "./a2e58f97fd5e8d7c@736.js";

function _1(md){return(
md`# PCD gallery 2022
`
)}

function _nrows(Range){return(
Range([2, 12], { label: "# rows", value: 4, step: 1 })
)}

function _ncols(Range){return(
Range([2, 12], { label: "# columns", step: 1, value: 6 })
)}

function _decimateRatio(Range){return(
Range([0.1, 1], {
  label: "Decimation ratio",
  value: 0.5,
  step: 0.1
})
)}

function _5(DOM,labyrinth){return(
DOM.download(
  new Blob([JSON.stringify(labyrinth)], { type: "application/json" }),
  "gallery.json", // optional file name
  "Download current layout" // optional button label
)
)}

function _loadLayout(html){return(
html`<input type=file>`
)}

function _test(){return(
null
)}

function _8(cameraGoal){return(
cameraGoal
)}

function _mainDisplay(renderer,scene,camera,pickPainting,closeInfoPanel,getCurrentExhibit,galleryData,labyrinth,isFlying,openInfoPanel,gotoPainting,$0,width,turnLeft,turnRight,walkAhead,html,height,navigationLayer)
{
  renderer.render(scene, camera);
  renderer.domElement.onclick = (e) => {
    let info = pickPainting(e);

    closeInfoPanel();
    if (info) {
      let curExhibit = getCurrentExhibit();
      let { row, col, dir } = info;
      let newExhibit = galleryData[labyrinth[row][col][dir]];
      //mutable test = [curExhibit, newExhibit];
      if (!isFlying && newExhibit == curExhibit) {
        if (newExhibit.link != "") openInfoPanel();
      } else gotoPainting(info);
      return;
    }

    let y = e.offsetY;

    if ($0.value) return;
    let x = e.offsetX;
    if (x < width / 3) turnLeft();
    else if (x > (width * 2) / 3) turnRight();
    else walkAhead();
  };
  let maindiv = html`<div style="width:${width}px;height:${height}px;position:relative;"></div>`;
  renderer.domElement.style.position = "absolute";
  navigationLayer.style.position = "relative";
  maindiv.append(renderer.domElement);
  maindiv.append(navigationLayer);
  renderer.render(scene, camera);
  return maindiv;
}


function _10(html,floorPlan,display){return(
html`<div>${floorPlan} ${display}</div>`
)}

function _11(md){return(
md`<hr>
## Implementation`
)}

function _galleryData(galleryData2022){return(
galleryData2022
)}

function _oldGalleryData(d3){return(
d3.csv(
  "https://esperanc.github.io/GaleriaPCD/data/galleryNew.csv"
)
)}

function _14(Inputs,galleryData){return(
Inputs.table(galleryData)
)}

function _galleryData2022(obras2022,d3,galleryImages){return(
obras2022
  .map(
    ({ Nome, Minibio, NomeObra, Link, DescricaoObra, LinkThumbnailRaw }) => ({
      link: Link,
      src: LinkThumbnailRaw,
      author: Nome,
      title: NomeObra,
      Email: "unknown@nowhere",
      Descrição: DescricaoObra,
      "Mini-bio": Minibio
    })
  )
  .concat(
    d3.range(galleryImages.length - obras2022.length).map(() => ({ link: "" }))
  )
)}

function _sampleImages(galleryImages){return(
galleryImages.map((i) => {
  let newImg = i.cloneNode(true);
  newImg.width = 100;
  return newImg;
})
)}

function _makeScaledImage(htl){return(
function (img) {
  const sz = 512;
  const canvas = htl.html`<canvas width=${sz} height=${sz} >`;
  const ctx = canvas.getContext("2d");
  const ratio = img.width / img.height;
  if (ratio < 1) {
    const dx = (sz * (1 - ratio)) / 2;
    const szx = sz * ratio;
    ctx.drawImage(img, dx, 0, szx, sz);
  } else {
    const dy = (sz * (1 - 1 / ratio)) / 2;
    const szy = sz / ratio;
    ctx.drawImage(img, 0, dy, sz, szy);
  }
  return canvas;
}
)}

function _imagens(FileAttachment){return(
FileAttachment("imagens@3.zip").zip()
)}

async function _galleryImages(Promises,imagens,FileAttachment)
{
  await Promises.delay(1000);
  let entries = imagens.filenames.map((name) => imagens.file(name).image());
  entries = entries.concat([
    FileAttachment("identidade1.png").image(),
    FileAttachment("identidade2.png").image(),
    FileAttachment("identidade3.png").image()
  ]);
  return Promise.all(entries).then((val) => val);
}


function _21(md){return(
md`## 2D elements`
)}

function _22(md){return(
md`Floor plan`
)}

function _floorPlan($0,cellSize,wallThick,markAvailableSlots,unassigned,DOM,d3,wallDirections,$1)
{
  let lab = $0.value;
  let [nrows, ncols] = [lab.length, lab[0].length];

  let boxSize = (row, col) => [
    row % 2 ? cellSize : cellSize * wallThick,
    col % 2 ? cellSize : cellSize * wallThick
  ];

  let boxPos = (row, col) => [
    (Math.floor(row / 2) * (1 + wallThick) + (row % 2) * wallThick) * cellSize,
    (Math.floor(col / 2) * (1 + wallThick) + (col % 2) * wallThick) * cellSize
  ];

  markAvailableSlots(lab, unassigned);

  let [sy, sx] = boxPos(nrows, ncols);
  let svgNode = DOM.svg(sx, sy);

  let data = [];
  for (let row of d3.range(nrows))
    for (let col of d3.range(ncols)) data.push([row, col]);

  let draw = function([row, col]) {
    let [y, x] = boxPos(row, col);
    let [h, w] = boxSize(row, col);
    let group = d3.select(this);
    group
      .select("rect")
      .attr("x", x)
      .attr("y", y)
      .attr("width", w)
      .attr("height", h)
      .attr("fill", lab[row][col] == "W" ? "darkgray" : "white")
      .attr("stroke", "lightgray");
    if (lab[row][col] instanceof Array) {
      group
        .selectAll("g")
        .data([0, 1, 2, 3])
        .join(enter => {
          let group = enter.append("g");
          group.append("circle");
          group
            .append("text")
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "middle");
          return group;
        })
        .attr("transform", function(k) {
          let [drow, dcol] = wallDirections[k].map(
            x => cellSize / 2 + (x * cellSize) / 3
          );
          return `translate (${x + dcol},${y + drow})`;
        })
        .each(function(k) {
          let d = lab[row][col][k];
          let circle = d3
            .select(this)
            .select("circle")
            .attr("r", cellSize / 6)
            .attr("fill", "#EEE")
            .attr("stroke", "black")
            .style("visibility", d != "f" ? "visible" : "hidden");
          let text = d3
            .select(this)
            .select("text")
            .text(d == "f" || d == "e" ? " " : d);
        })
        .on("click", function(event, k) {
          let g = d3.select(this);
          let d = lab[row][col][k];
          if (d == "e") {
            if (unassigned.length > 0) lab[row][col][k] = unassigned.shift();
          } else if (d != "f") {
            lab[row][col][k] = "e";
            unassigned.unshift(d);
          }
          $1.value = unassigned; // Mark mutation
          $0.value = lab;
          d = lab[row][col][k];
          g.select("text").text(d == "f" || d == "e" ? " " : d);
        });
    }
  };

  let groups = d3
    .select(svgNode)
    .selectAll("g")
    .data(data)
    .join(enter => {
      let group = enter.append("g");
      group.append("rect");
      return group;
    })
    .each(draw)
    .on("click", function(event, d) {
      let [row, col] = d;
      if (row % 2 == 0 || col % 2 == 0) {
        // wall /pillar
        if (lab[row][col] == "W") lab[row][col] = ".";
        else lab[row][col] = "W";
        markAvailableSlots(lab, unassigned);
        $0.value = lab; //
        $1.value = unassigned; // reevaluate cells referring to unassigned
        groups.each(draw);
      }
    });
  svgNode.style.verticalAlign = "top";
  return svgNode;
}


function _24(md){return(
md`Picture Display`
)}

function _display(html,sampleImages,unassigned,$0,md,width)
{
  let divUnassigned = html`<div style="display:inline-block"/>`;
  let divAssigned = html`<div style="display:inline-block"/>`;
  let captionedImage = (img, i) => html`
    <figure style="display:inline-block">${img}<figcaption>${i}</figcaption></figure>`;
  sampleImages.forEach((img, i) => {
    if (unassigned.lastIndexOf(i) < 0)
      divAssigned.append(captionedImage(img, i));
  });
  let label = x => html`<span style="font-weight:bold">${x} (next)</span>`;

  unassigned.forEach((i, j) => {
    let slot = captionedImage(sampleImages[i], label(i));
    divUnassigned.append(slot);
    slot.onclick = () => {
      $0.value.splice(j, 1);
      $0.value = [i].concat(unassigned);
    };
    label = x => x;
  });
  let panel = md`### Unassigned
  ${divUnassigned}
  ### Assigned
  ${divAssigned}
  `;
  panel.style.width = `${width / 2}px`;
  panel.style.display = "inline-block";
  return panel;
}


function _26(md){return(
md`Navigation layer `
)}

function _navigationLayer(html,width,height,buttons,title,infoPanel,closeInfoPanel)
{
  let div = html`<div style="z-index:5;width:${width}px;height:${height}px; 
    text-align:center;position:relative;pointer-events:none">`;
  let sz = 50;
  let margin = 20;
  let elements = {};
  for (let key of Object.keys(buttons)) {
    let w = +buttons[key].getAttribute("width");
    let h = +buttons[key].getAttribute("height");
    let s = sz / h;
    buttons[key].style.transform = `translate(${-(w - w * s) / 2}px,${-(
      h -
      h * s
    ) / 2}px)scale(${s})`;
    let element = html`<div style="position:absolute;width:${w *
      s}px;height:${h * s}px;">${buttons[key]}</div>`;
    switch (key) {
      case "left": {
        element.style.bottom = `${margin}px`;
        element.style.left = `${margin}px`;
        break;
      }
      case "right": {
        element.style.bottom = `${margin}px`;
        element.style.right = `${margin}px`;
        break;
      }
      case "up": {
        element.style.bottom = `${margin}px`;
        element.style.left = `${(width - w * s) / 2}px`;
        break;
      }
      case "fly":
      case "walk": {
        element.style.top = `${margin}px`;
        element.style.left = `${margin}px`;
        break;
      }
    }
    div.append(element);
  }
  div.append(title);
  div.append(infoPanel);
  closeInfoPanel();
  return div;
}


function _28(md){return(
md`Title (art tag)`
)}

function _title(html,openInfoPanel)
{
  let title = html`<div class="placa" style="display:none">
  <a href="#">
    <span class="titulo">Nome da obra nome da obra nome da obra nome da obra</span> 
    <span class="autoria">Nome da pessoa</span>
    <span class="icone-visualizar">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="8" cy="8" r="8" fill="#57D8BA"/>
        <rect x="7" y="3" width="2" height="10" fill="#483197"/>
        <rect x="3" y="9" width="2" height="10" transform="rotate(-90 3 9)" fill="#483197"/>
      </svg>                      
    </span>
  </a>
</div>`;
  title.style.position = "relative";
  title.style["z-index"] = "10";
  title.style["box-shadow"] = "4px 4px 5px 0px rgba(0,0,0,.2)";
  title.style["pointer-events"] = "auto";
  title.style["cursor"] = "pointer";
  title.style["user-select"] = "none";
  title.onclick = openInfoPanel;
  return title;
}


function _30(md){return(
md`Info Panel`
)}

function _infoPanel(html,d3)
{
  let panel = html`<div class="painel" style="display:none">
  <div class="topbar">
    <button class="fechar">
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="16" fill="#483197"/>
        <rect x="8" y="9" width="2" height="20" transform="rotate(-45 8 9)" fill="#CC36C1"/>
        <rect x="9" y="24" width="2" height="20" transform="rotate(-135 9 24)" fill="#CC36C1"/>
      </svg>              
    </button>
  </div>
  <div class="conteudo">
    <header>
      <h4 class="titulo">Nome da obra nome da obra nome da obra nome da obra</h4>
    </header>
    <div class="cta">
      <a href="#" target="_blank" class="botao">Acessar obra</a>
    </div>
    <div class="infos">
      <div class="descricao">
        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Perspiciatis non libero omnis sunt, pariatur corporis fugiat, tempore numquam enim earum optio? Vero impedit, quae molestiae incidunt animi provident sit ducimus!</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste repudiandae laborum voluptate fuga. Obcaecati nisi inventore aut aliquid ullam neque officia numquam mollitia error asperiores excepturi officiis, nulla, assumenda iusto.</p>
        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quaerat, explicabo ipsam. Earum qui ducimus ipsa voluptates pariatur unde sapiente expedita sed! Dolores enim accusamus ea, recusandae nemo mollitia labore est!</p>
      </div>
      <div class="ficha-autoria">
        <span class="autoria">Nome da pessoa </span> 
        <div class="minibio" style="display:block;">
          lorem, ipsum dolor sit amet consectetur adipisicing elit. Incidunt facere voluptates, aut sunt nostrum eligendi porro tempora eaque rerum animi? Lorem, ipsum dolor sit amet consectetur adipisicing elit. Incidunt facere voluptates, aut sunt nostrum eligendi porro tempora eaque rerum animi?
        </div>
      </div>
    </div>
  </div>
</div>`;
  panel.style["pointer-events"] = "auto";
  panel.style["user-select"] = "none";
  d3.select(panel)
    .selectAll("button.fechar, a.botao")
    .style("cursor", "pointer");
  return panel;
}


function _32(md){return(
md`Buttons`
)}

function _buttons(html,svg){return(
{
  right: html`<svg id=buttonRight width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0)">
<circle cx="50" cy="50" r="49" transform="rotate(-180 50 50)" fill="#CC36C1" stroke="#483197" stroke-width="2"/>
<rect x="29.2186" y="48" width="40.7813" height="4" fill="#FFFAF2"/>
<rect x="29.2186" y="48" width="40.7813" height="4" fill="#FFFAF2"/>
<rect x="47.1632" y="21.0737" width="40.7813" height="4.36943" transform="rotate(45 47.1632 21.0737)" fill="#FFFAF2"/>
<rect x="47.1632" y="21.0737" width="40.7813" height="4.36943" transform="rotate(45 47.1632 21.0737)" fill="#FFFAF2"/>
<rect x="43.8389" y="75.9104" width="40.7813" height="4.36943" transform="rotate(-45 43.8389 75.9104)" fill="#FFFAF2"/>
<rect x="43.8389" y="75.9104" width="40.7813" height="4.36943" transform="rotate(-45 43.8389 75.9104)" fill="#FFFAF2"/>
</g>
<defs>
<clipPath id="clip0">
<rect width="100" height="100" fill="white"/>
</clipPath>
</defs>
</svg>`,
  left: svg`<svg id=buttonLeft width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="50" cy="50" r="49" fill="#CC36C1" stroke="#483197" stroke-width="2"/>
<rect x="70.7814" y="52" width="40.7813" height="4" transform="rotate(180 70.7814 52)" fill="#FFFAF2"/>
<rect x="70.7814" y="52" width="40.7813" height="4" transform="rotate(180 70.7814 52)" fill="#FFFAF2"/>
<rect x="52.8368" y="78.9263" width="40.7813" height="4.36943" transform="rotate(-135 52.8368 78.9263)" fill="#FFFAF2"/>
<rect x="52.8368" y="78.9263" width="40.7813" height="4.36943" transform="rotate(-135 52.8368 78.9263)" fill="#FFFAF2"/>
<rect x="56.1611" y="24.0896" width="40.7813" height="4.36943" transform="rotate(135 56.1611 24.0896)" fill="#FFFAF2"/>
<rect x="56.1611" y="24.0896" width="40.7813" height="4.36943" transform="rotate(135 56.1611 24.0896)" fill="#FFFAF2"/>
</svg>`,
  up: svg`<svg id=buttonUp width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0)">
<circle cx="50" cy="50" r="49" transform="rotate(90 50 50)" fill="#CC36C1" stroke="#483197" stroke-width="2"/>
<rect x="48" y="70.7815" width="40.7813" height="4" transform="rotate(-90 48 70.7815)" fill="#FFFAF2"/>
<rect x="48" y="70.7815" width="40.7813" height="4" transform="rotate(-90 48 70.7815)" fill="#FFFAF2"/>
<rect x="21.0736" y="52.8367" width="40.7813" height="4.36943" transform="rotate(-45 21.0736 52.8367)" fill="#FFFAF2"/>
<rect x="21.0736" y="52.8367" width="40.7813" height="4.36943" transform="rotate(-45 21.0736 52.8367)" fill="#FFFAF2"/>
<rect x="75.9103" y="56.1611" width="40.7813" height="4.36943" transform="rotate(-135 75.9103 56.1611)" fill="#FFFAF2"/>
<rect x="75.9103" y="56.1611" width="40.7813" height="4.36943" transform="rotate(-135 75.9103 56.1611)" fill="#FFFAF2"/>
</g>
<defs>
<clipPath id="clip0">
<rect width="100" height="100" fill="white"/>
</clipPath>
</defs>
</svg>`,
  fly: svg`<svg width="261" height="71" viewBox="0 0 261 71" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip1)">
<circle cx="35.462" cy="35.462" r="34.7527" fill="#CC36C1" stroke="#483197" stroke-width="1.41848"/>
<path d="M45.4799 43.1927H25.0539C22.0396 43.1927 19.5927 40.7458 19.5927 37.7315C19.5927 34.7173 22.0396 32.2704 25.0539 32.2704H45.4799C48.4942 32.2704 50.9411 34.7173 50.9411 37.7315C50.9765 40.7103 48.4942 43.1927 45.4799 43.1927ZM25.0539 34.7173C23.3871 34.7173 22.075 36.0648 22.075 37.6961C22.075 39.3273 23.4226 40.6749 25.0539 40.6749H45.4799C47.1467 40.6749 48.4587 39.3273 48.4587 37.6961C48.4587 36.0648 47.1112 34.7173 45.4799 34.7173H25.0539Z" fill="#FFFAF2"/>
<path d="M20.8339 38.9372C17.8196 38.9372 15.3727 36.4903 15.3727 33.4761H17.8551C17.8551 35.1428 19.2026 36.4549 20.8339 36.4549V38.9372Z" fill="#FFFAF2"/>
<path d="M46.0828 48.4055H43.6004C43.6004 45.5686 39.806 43.1571 35.2669 43.1571C30.7632 43.1571 26.9333 45.5686 26.9333 48.4055H24.451C24.451 44.0792 29.2029 40.6748 35.2669 40.6748C41.3309 40.6748 46.0828 44.0792 46.0828 48.4055Z" fill="#FFFAF2"/>
<path d="M28.9547 47.1644H22.4297V49.6468H28.9547V47.1644Z" fill="#FFFAF2"/>
<path d="M48.1042 47.1644H41.5792V49.6468H48.1042V47.1644Z" fill="#FFFAF2"/>
<path d="M17.8196 28.1923H15.3373V33.4761H17.8196V28.1923Z" fill="#FFFAF2"/>
<path d="M28.3164 26.951H4.87604V29.4334H28.3164V26.951Z" fill="#FFFAF2"/>
<path d="M49.7354 38.9372V36.4549C51.4021 36.4549 52.7142 35.1073 52.7142 33.4761H55.1966C55.1966 36.4903 52.7497 38.9372 49.7354 38.9372Z" fill="#FFFAF2"/>
<path d="M55.1966 28.1923H52.7142V33.4761H55.1966V28.1923Z" fill="#FFFAF2"/>
<path d="M65.6933 26.951H42.2529V29.4334H65.6933V26.951Z" fill="#FFFAF2"/>
<path d="M92.876 46.4756L86.578 27.1353H90.0682L95.0016 43.3528H95.6314L100.591 27.1353H104.081L97.7833 46.4756H92.876ZM105.906 46.4756V43.484H107.874V30.1269H105.906V27.1353H113.122V30.1269H111.154V43.484H113.122V46.4756H105.906ZM116.784 46.4756V43.484L126.388 43.4578L127.543 42.3031L127.517 39.0491L126.388 37.8945H119.041L116.128 34.9817V30.0482L119.041 27.1353H129.747V30.1269L120.589 30.1532L119.408 31.2816L119.434 33.8533L120.589 35.0341L127.91 35.0079L130.823 37.9207V43.5627L127.91 46.4756H116.784ZM137.448 46.4756V30.1269H132.069V27.1353H146.108V30.1269H140.728V46.4756H137.448ZM144.751 46.4756L151.049 27.1353H155.956L162.254 46.4756H158.764L157.321 41.7783H149.684L148.241 46.4756H144.751ZM150.55 38.8917H156.428L153.804 30.2581H153.174L150.55 38.8917ZM168.994 46.4756L175.292 27.1353H180.199L186.497 46.4756H183.007L181.564 41.7783H173.927L172.484 46.4756H168.994ZM174.793 38.8917H180.671L178.047 30.2581H177.417L174.793 38.8917ZM194.069 25.6396L196.719 21.5983H200.367L196.719 25.6396H194.069ZM188.846 46.4756V27.1353H202.072V30.1269H192.127V34.8504H201.206V37.842H192.127V43.484H202.072V46.4756H188.846ZM205.478 46.4756V27.1353H216.736L219.649 30.0482V36.4512L216.998 39.1016L220.279 46.4756H216.552L213.508 39.364H208.758V46.4756H205.478ZM208.758 36.4774H215.214L216.369 35.3228V31.1766L215.214 30.0219H208.758V36.4774ZM223.699 46.4756V27.1353H236.925V30.1269H226.979V34.8504H236.059V37.842H226.979V43.484H236.925V46.4756H223.699ZM238.494 46.4756L244.792 27.1353H249.699L255.997 46.4756H252.507L251.064 41.7783H243.427L241.984 46.4756H238.494ZM244.293 38.8917H250.171L247.547 30.2581H246.917L244.293 38.8917Z" fill="#CC36C1"/>
</g>
<defs>
<clipPath id="clip1">
<rect width="261" height="70.9239" fill="white"/>
</clipPath>
</defs>
</svg>
`,
  walk: svg`<svg width="261" height="71" viewBox="0 0 261 71" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip3)">
<circle cx="35.462" cy="35.462" r="34.7527" fill="#CC36C1" stroke="#483197" stroke-width="1.41848"/>
<path d="M129.1 46.4756L122.801 27.1353H126.292L131.225 43.3528H131.855L136.815 27.1353H140.305L134.007 46.4756H129.1ZM144.888 46.4756L141.975 43.5627V30.0482L144.888 27.1353H154.362L157.274 30.0482V43.5627L154.362 46.4756H144.888ZM146.437 43.589H152.84L153.994 42.4343L153.968 31.1766L152.84 30.0219H146.41L145.256 31.1766L145.282 42.4343L146.437 43.589ZM160.952 46.4756V27.1353H164.232V43.484H173.6V46.4756H160.952ZM176.747 46.4756V30.1269H171.367V27.1353H185.407V30.1269H180.027V46.4756H176.747ZM184.05 46.4756L190.348 27.1353H195.255L201.553 46.4756H198.063L196.619 41.7783H188.983L187.54 46.4756H184.05ZM189.849 38.8917H195.727L193.103 30.2581H192.473L189.849 38.8917ZM203.902 46.4756V27.1353H215.16L218.073 30.0482V36.4512L215.422 39.1016L218.703 46.4756H214.976L211.932 39.364H207.182V46.4756H203.902ZM207.182 36.4774H213.638L214.792 35.3228V31.1766L213.638 30.0219H207.182V36.4774Z" fill="#CC36C1"/>
</g>
<rect x="37.4374" y="20" width="28.5769" height="2.89515" transform="rotate(90 37.4374 20)" fill="#FFFAF2"/>
<rect x="37.4374" y="20" width="28.5769" height="2.89515" transform="rotate(90 37.4374 20)" fill="#FFFAF2"/>
<rect width="29.0508" height="3.11258" transform="matrix(-0.718455 0.695573 -0.718455 -0.695573 56.9264 32.5744)" fill="#FFFAF2"/>
<rect width="29.0508" height="3.11258" transform="matrix(-0.718455 0.695573 -0.718455 -0.695573 56.9264 32.5744)" fill="#FFFAF2"/>
<rect width="29.0508" height="3.11258" transform="matrix(0.718455 0.695573 -0.718455 0.695573 17.2363 30.2449)" fill="#FFFAF2"/>
<rect width="29.0508" height="3.11258" transform="matrix(0.718455 0.695573 -0.718455 0.695573 17.2363 30.2449)" fill="#FFFAF2"/>
<defs>
<clipPath id="clip3">
<rect width="261" height="70.9239" fill="white"/>
</clipPath>
</defs>
</svg>`
}
)}

function _assignButtonCallbacks(buttons,fly,walk,turnLeft,turnRight,walkAhead)
{
  buttons.fly.onclick = fly;
  buttons.walk.onclick = walk;
  buttons.left.onclick = turnLeft;
  buttons.right.onclick = turnRight;
  buttons.up.onclick = walkAhead;
  for (let b in buttons) buttons[b].style["pointer-events"] = "auto";
}


function _35(md){return(
md`Styles`
)}

function _styles(html){return(
html`<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@500;800&display=swap" rel="stylesheet"> 
<style>
:root, html {
  font-size: 100%;
}

:root {
  --base-font: 'Sora', sans-serif;;
  --cor-verde: #57D8BA;
  --cor-rosa: #CC36C1;
  --cor-roxo: #483197;
  --cor-creme: #FFFAF2;
}

body {
  font-family: var(--base-font);
  color: var(--cor-roxo)
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.placa {
  padding: 5px 8px;
  text-align: center;
  background-color: var(--cor-rosa);
  width: 90%;
  max-width: 600px;
  box-shadow: 0 5px 10px rgba(3, 3, 46, 0.5);
  display: inline-block;
  font-size: 1rem;
  margin: 10px
}

.placa a {
  text-decoration: none;
  color: var(--cor-creme);
}

.placa .titulo {
  text-transform: uppercase;
  font-family: var(--base-font);
  color: var(--cor-roxo);
  font-weight: 800;
  text-decoration: none;
}

.placa .icone-visualizar {
  position: relative;
  bottom: -3px;
}

@media screen and (min-width: 600px) {
  .placa .titulo {
    display: block;
  }
}

.painel {
  background-color: var(--cor-verde);
  padding: 16px;
  width: 90%;
  max-width: 600px;
  max-height: 80%;
  overflow-y: auto;
  margin: 0 auto;
  text-align: left;
  box-shadow: 0 5px 10px rgba(3, 3, 46, 0.5);
}

.painel .topbar {
  text-align: right;
  margin-bottom: 8px;
}

.painel .fechar {
  background-color: transparent;
  border: none;
  cursor: pointer;
}

.painel header {
  margin-bottom: 8px;
}

.painel .infos {
  margin-bottom: 8px;
}

.painel .titulo {
  text-transform: uppercase;
  font-family: var(--base-font);
  font-weight: 800;
  font-size: 18px;
  color: var(--cor-creme);
  margin-bottom: 4px;
}

.painel .autoria {
  font-weight: 700;
  text-transform: uppercase;
}

.painel .cta {
  margin: 16px 0;
  padding: 0.6em 0;
}

.painel .botao {
  font-family: var(--base-font);
  line-height: 1em;
  text-decoration: none;
  text-transform: uppercase;
  font-weight: normal;
  color: var(--cor-creme);
  display: inline;
  padding: 0.6em 2em;
  background-color: var(--cor-roxo);
  border-radius: 0.2rem;
  width: 100%;
}

.painel p {
  margin-bottom: 8px;
}
</style>
`
)}

function _37(md){return(
md`## Authoring code`
)}

function _unassigned(d3,galleryImages){return(
d3.range(galleryImages.length)
)}

function _shuffle(){return(
inputArray => {
  // Make a copy
  let array = [...inputArray];
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
)}

function _makeLabyrinth(shuffle){return(
function(rows, cols) {
  let lab = [];
  let [imax, jmax] = [rows, cols].map(n => 2 * n + 1);
  // Fill the labyrinth
  for (let i = 0; i < imax; i++) {
    lab.push([]);
    for (let j = 0; j < jmax; j++) {
      lab[i][j] = (i & j & 1) == 1 ? 'U' : 'W';
    }
  }
  // Directions to walk
  let dir = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  // Make a random walk breaking walls starting from cell i,j,
  // breaking walls until all reachable neighbor cells are visited.
  // Returns the longest path found as an array of cell indices.
  let visit = (i, j) => {
    lab[i][j] = '.';
    let longest = [];
    for (let [di, dj] of shuffle(dir)) {
      let [I, J] = [i + di * 2, j + dj * 2];
      if (I < 0 || J < 0 || I >= imax || J >= jmax) continue;
      if (lab[I][J] == 'U') {
        lab[i + di][j + dj] = '.';
        let newpath = visit(I, J);
        if (newpath.length > longest.length) longest = newpath;
      }
    }
    longest.push([i, j]);
    return longest;
  };
  // Recursively visit the labyrinth grid from cell 1,1
  let path = visit(1, 1);
  return lab;
}
)}

function _wallDirections(){return(
[[+1, 0], [-1, 0], [0, +1], [0, -1]]
)}

function _markAvailableSlots(wallDirections){return(
function markAvailableSlots(lab, unassigned) {
  let available = 0,
    filled = 0,
    [nrows, ncols] = [lab.length, lab[0].length];
  lab.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (i % 2 == 0 && j % 2 == 0) {
        // Remove unnecessary / add necessary pillars
        let count = 0;
        wallDirections.forEach(([drow, dcol]) => {
          let [I, J] = [i + drow, j + dcol];
          if (I >= 0 && I < nrows && J >= 0 && J < ncols && lab[I][J] == "W")
            count++;
        });
        if (count >= 1) lab[i][j] = "W";
        else lab[i][j] = ".";
        return;
      }
      if ((i % 2 == 0) != (j % 2 == 0)) return; // walls between main cells
      // A main cell
      if (cell == ".") lab[i][j] = cell = ["e", "e", "e", "e"]; // Initially empty
      wallDirections.forEach(([di, dj], k) => {
        let neighbor = lab[i + di][j + dj];
        if (neighbor == "W") {
          if (cell[k] == "f") cell[k] = "e";
          if (cell[k] == "e") available++;
          else filled++;
        } else {
          if (cell[k] != "f") {
            if (cell[k] != "e") unassigned.unshift(cell[k]);
            cell[k] = "f";
          }
        }
      });
    });
  });
  return { available, filled };
}
)}

function _labSize(nrows,ncols){return(
[nrows, ncols]
)}

function _wallThick(){return(
0.05
)}

function _cellSize(){return(
70
)}

function _labyrinth(makeLabyrinth,labSize,decimateRatio,shuffle)
{
  let lab = makeLabyrinth(...labSize);
  let walls = [];
  for (let i = 1; i + 1 < lab.length; i++) {
    for (let j = 1; j + 1 < lab[0].length; j++) {
      if (lab[i][j] == "W" && (i % 2 == 0) != (j % 2 == 0)) {
        walls.push([i, j]);
      }
    }
  }
  let n = Math.trunc(walls.length * decimateRatio);
  walls = shuffle(walls);
  for (let [i, j] of walls.slice(0, n)) lab[i][j] = ".";
  return lab;
}


function _defaultLabyrinth(FileAttachment){return(
FileAttachment("gallery@2.json").json()
)}

function _setDefaultLabyrinth($0,defaultLabyrinth,setLabUnassigned)
{
  $0.value = defaultLabyrinth;
  setLabUnassigned(defaultLabyrinth);
}


async function _49(Files,loadLayout,$0,setLabUnassigned,$1)
{
  let lab = JSON.parse(await Files.text(loadLayout));
  $0.value = lab;
  setLabUnassigned(lab);
  $1.value = null;
}


function _setLabUnassigned(d3,sampleImages,$0){return(
function setLabUnassigned(lab) {
  let unassignedSet = new Set(d3.range(sampleImages.length));
  for (let i = 1; i + 1 < lab.length; i++) {
    for (let j = 1; j + 1 < lab[0].length; j++) {
      if (lab[i][j] instanceof Array) {
        for (let k of lab[i][j]) {
          unassignedSet.delete(k);
        }
      }
    }
  }
  $0.value = [...unassignedSet];
}
)}

function _51(md){return(
md`## 3D rendering`
)}

function _shadows(Checkbox){return(
Checkbox("y", { label: "Shadows" })
)}

function _antialising(Checkbox){return(
Checkbox("y", { label: "Antialiasing" })
)}

function _paintingSizeRatio(){return(
0.9
)}

function _cameraAngle(aspect){return(
100 + (aspect < 1 ? 10 : 0)
)}

function _aspect(width,height){return(
width / height
)}

function _cellCorner3D(wallThick){return(
function cellCorner3D(row, col) {
  return [
    Math.floor(col / 2) * (1 + wallThick) + (col % 2) * wallThick, // x
    0, // y
    Math.floor(row / 2) * (1 + wallThick) + (row % 2) * wallThick //z
  ];
}
)}

function _cellSize3D(wallThick){return(
(row, col) => [col % 2 ? 1 : wallThick, 1, row % 2 ? 1 : wallThick]
)}

function _cellCenter3D(cellSize3D,cellCorner3D){return(
function cellCenter3D(row, col) {
  let s = cellSize3D(row, col);
  return cellCorner3D(row, col).map((x, i) => x + s[i] / 2);
}
)}

function _wallBlocks(labyrinth,THREE,wallThick,cellCenter3D,shadows)
{
  let lab = labyrinth;

  let [nrows, ncols] = [lab.length, lab[0].length];

  let wallMaterial = new THREE.MeshStandardMaterial({ color: 0xfffaf2 });
  let wallGroup = new THREE.Group();

  let pillarGeom = new THREE.BoxBufferGeometry(wallThick, 1, wallThick);
  let colWallGeom = new THREE.BoxBufferGeometry(wallThick, 1, 1);
  let rowWallGeom = new THREE.BoxBufferGeometry(1, 1, wallThick);

  for (let row = 0; row < nrows; row++) {
    for (let col = 0; col < ncols; col++) {
      if (lab[row][col] == "W") {
        let geom =
          row % 2 == 0 && col % 2 == 0
            ? pillarGeom
            : row % 2 == 1
            ? colWallGeom
            : rowWallGeom;
        let wall = new THREE.Mesh(geom, wallMaterial);
        wall.position.set(...cellCenter3D(row, col));
        wall.castShadow = wall.receiveShadow = shadows.length > 0;
        wallGroup.add(wall);
      }
    }
  }

  return wallGroup;
}


async function _floor(THREE,FileAttachment,labSize,cellCorner3D,labyrinth,shadows)
{
  let texture = new THREE.CanvasTexture(
    await FileAttachment("pcdfloor.jpg").image()
  );
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(...labSize);

  let mat = new THREE.MeshStandardMaterial({
    color: 0xcccccc,
    side: THREE.DoubleSide,
    map: texture
  });
  let corner1 = cellCorner3D(0, 0);
  let corner2 = cellCorner3D(labyrinth.length, labyrinth[0].length);
  let [sx, sy] = [corner2[0] - corner1[0], corner2[2] - corner1[2]];
  let geo = new THREE.PlaneBufferGeometry(sx, sy);
  let mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.set(Math.PI / 2, 0, 0);
  mesh.position.set(sx / 2, 0.001, sy / 2);
  if (shadows.length) mesh.receiveShadow = true;
  return mesh;
}


function _floorBlocks(labyrinth,THREE,cellSize3D,wallThick,cellCenter3D)
{
  let lab = labyrinth;

  let [nrows, ncols] = [lab.length, lab[0].length];

  let floorMaterial = new THREE.MeshStandardMaterial({ color: 0x3344ee });
  let floorGroup = new THREE.Group();

  let geometries = {};
  const geometry = (row, col) => {
    let size = cellSize3D(row, col);
    if (!geometries[size])
      geometries[size] = new THREE.BoxBufferGeometry(
        size[0],
        wallThick,
        size[2]
      );
    return geometries[size];
  };

  for (let row = 0; row < nrows; row++) {
    for (let col = 0; col < ncols; col++) {
      let tile = new THREE.Mesh(geometry(row, col), floorMaterial);
      let [x, y, z] = cellCenter3D(row, col);
      tile.position.set(x, -wallThick / 2, z);
      floorGroup.add(tile);
    }
  }

  return floorGroup;
}


function _labDimensions(labyrinth,wallThick){return(
[
  Math.floor(labyrinth[0].length / 2) +
    Math.ceil(labyrinth[0].length / 2) * wallThick,
  1,
  Math.floor(labyrinth.length / 2) + Math.ceil(labyrinth.length / 2) * wallThick
]
)}

function _paintingOnWall(THREE,wallThick,paintingSizeRatio,cellCenter3D){return(
function paintingOnWall(img, row, col, dir, poster = false) {
  const direction = [
    { offset: [0, 0.499], angle: Math.PI },
    { offset: [0, -0.499], angle: 0 },
    { offset: [0.499, 0], angle: -Math.PI / 2 },
    { offset: [-0.499, 0], angle: Math.PI / 2 }
  ];

  let mat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
    map: new THREE.CanvasTexture(img)
  });
  let aspect = poster ? (1+wallThick) : img.width / img.height;
  const sz = poster ? aspect : paintingSizeRatio;
  let geo = new THREE.PlaneBufferGeometry(
    ...(aspect < 1 ? [aspect * sz, sz] : [sz, sz / aspect])
  );
  let mesh = new THREE.Mesh(geo, mat);
  let [x, y, z] = cellCenter3D(row, col);
  let [ox, oz] = direction[dir].offset;
  z += oz;
  x += ox;
  mesh.position.set(x, y, z);
  mesh.rotation.set(0, direction[dir].angle, 0);

  mesh.paintingProperties = { img, row, col, dir };

  return mesh;
}
)}

function _debug(){return(
""
)}

function _paintings(THREE,$0,labyrinth,galleryImages,galleryData,paintingOnWall)
{
  let paintingsGroup = new THREE.Group();
  $0.value = [];
  for (let row = 0; row < labyrinth.length; row++) {
    for (let col = 0; col < labyrinth[row].length; col++) {
      let cell = labyrinth[row][col];
      if (cell instanceof Array) {
        cell.forEach((imgIndex, dir) => {
          if (imgIndex != "e" && imgIndex != "f") {
            let img = galleryImages[imgIndex];
            if (!img) {
              $0.value = { imgIndex, dir };
              return;
            }
            //paintingsGroup.push({ imgIndex, row, col, dir });
            const poster = galleryData[imgIndex].link == "";
            $0.value.push({ imgIndex, row, col, dir, poster });
            paintingsGroup.add(paintingOnWall(img, row, col, dir, poster));
          }
        });
      }
    }
  }
  //invalidation.then(() => paintingsGroup.remove(...paintingsGroup.children));
  return paintingsGroup;
}


function _lights(THREE,labDimensions,shadows)
{
  let lights = new THREE.Group();
  let pointLight1 = new THREE.PointLight(0xffffff, 0.5);
  let pointLight2 = new THREE.PointLight(0xffffff, 0.5);
  let [dx, dy, dz] = labDimensions;
  pointLight1.position.set(dx * 0.2, Math.max(dx, dz) * 0.7, dz * 0.2);
  pointLight2.position.set(dx * 0.8, Math.max(dx, dz) * 0.7, dz * 0.8);
  pointLight1.castShadow = pointLight2.castShadow = shadows.length > 0;
  let lightAmb = new THREE.AmbientLight(0x505050);
  lights.add(lightAmb, pointLight1, pointLight2);
  return lights;
}


function _camera(labDimensions,THREE,cameraAngle,aspect,$0)
{
  let [dx, dy, dz] = labDimensions;
  let camera = new THREE.PerspectiveCamera(cameraAngle, aspect, 0.1, 100);
  camera.position.copy($0.value.pos);
  camera.quaternion.copy($0.value.rot);
  return camera;
}


function _rotations(THREE)
{
  let halfTurn = Math.PI / 2;
  let rot = (dx, dy) =>
    new THREE.Quaternion().setFromEuler(
      new THREE.Euler(dx * halfTurn, dy * halfTurn, 0)
    );
  return {
    left: rot(0, 1),
    right: rot(0, -1),
    up: rot(1, 0),
    down: rot(-1, 0)
  };
}


function _scene(THREE,lights,wallBlocks,floor,paintings)
{
  let scene = new THREE.Scene();
  scene.background = new THREE.Color(0x483197);
  scene.add(lights);
  scene.add(wallBlocks);
  //scene.add(floorBlocks);
  scene.add(floor);
  scene.add(paintings);
  return scene;
}


function _raycaster(THREE){return(
new THREE.Raycaster()
)}

function _renderer(DOM,width,height,THREE,shadows)
{
  const canvas = DOM.canvas(width, height);
  let renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: false, //antialising.length > 0
    powerPreference: "high-performance"
  });
  renderer.shadowMap.enabled = shadows.length > 0;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
  return renderer;
}


function _74(md){return(
md`## 3D Navigation`
)}

function _pickPainting(THREE,width,height,raycaster,camera,paintings,wallBlocks){return(
e => {
  let mouse = new THREE.Vector2(
    (e.offsetX / width) * 2 - 1,
    -(e.offsetY / height) * 2 + 1
  );
  raycaster.setFromCamera(mouse, camera);
  let pick = raycaster.intersectObjects(
    paintings.children.concat(wallBlocks.children)
  );
  if (pick.length > 0) {
    let obj = pick[0].object;
    if (obj.paintingProperties) {
      return obj.paintingProperties;
    }
  }
  return null;
}
)}

function _gotoPainting($0,getCameraDir,THREE,cellCenter3D,$1){return(
function gotoPainting(paintingInfo) {
  $0.value = false;
  let { row, col, dir } = paintingInfo;
  dir = { 1: 0, 2: -1, 0: -2, 3: 1 }[dir]; // Convert to camera dir
  let ang = ((getCameraDir() + 2) * Math.PI) / 2;
  let pos = new THREE.Vector3(...cellCenter3D(row, col));
  let rot = new THREE.Quaternion().setFromEuler(
    new THREE.Euler(0, (dir * Math.PI) / 2, 0, "YXZ")
  );
  $1.value = { pos, rot };
}
)}

function _getCameraDir(THREE,camera){return(
function getCameraDir() {
  const curCameraYRot = new THREE.Euler().setFromQuaternion(
    camera.quaternion,
    "YXZ"
  )._y;
  return Math.round(curCameraYRot / (Math.PI / 2));
}
)}

function _getCameraCell(camera,wallThick){return(
function getCameraCell() {
  let col = Math.trunc(camera.position.x / (1 + wallThick)) * 2 + 1;
  let row = Math.trunc(camera.position.z / (1 + wallThick)) * 2 + 1;
  return [row, col];
}
)}

function _getCurrentExhibit(getCameraDir,getCameraCell,labyrinth,galleryData){return(
function getCurrentExhibit() {
  let paintingDir = { 0: 1, "-2": 0, "2": 0, "-1": 2, 1: 3 }[getCameraDir()];
  let [row, col] = getCameraCell();
  let p = labyrinth[row][col];
  if (p instanceof Array) {
    let i = p[paintingDir];
    if (i != "f" && i != "e") {
      return galleryData[i];
    }
  }
  return null;
}
)}

function _cameraGoal(firstCell){return(
firstCell
)}

function _floorGoal(firstCell){return(
firstCell
)}

function _isFlying(camera){return(
camera.position.y > 1
)}

function _showArtTag(d3){return(
function showArtTag (artAuthor, artTitle) {
  let div = d3.select("div.placa");
  div.select ("span.titulo").html(artTitle);
  div.select ("span.autoria").html(artAuthor);
}
)}

function* _animateCamera($0,closeInfoPanel,buttons,camera,cameraGoal,THREE,renderer,scene,getCurrentExhibit,showArtTag,fillInfoPanel,title,$1)
{
  let flying = $0.value.pos.y > 1;
  closeInfoPanel();
  if (flying) {
    buttons.fly.style.display = buttons.left.style.display = buttons.right.style.display = buttons.up.style.display =
      "none";
    buttons.walk.style.display = "inline-block";
  } else {
    buttons.fly.style.display = buttons.left.style.display = buttons.right.style.display = buttons.up.style.display =
      "inline-block";
    buttons.walk.style.display = "none";
  }
  let oldRot = camera.quaternion.clone();
  let oldPos = camera.position.clone();
  let { rot, pos } = cameraGoal;
  for (let i = 0; i < 60; i++) {
    camera.position.lerpVectors(oldPos, pos, i / 59);
    THREE.Quaternion.slerp(oldRot, rot, camera.quaternion, i / 59);
    renderer.render(scene, camera);
    yield i;
  }
  let exhibit = null;
  if (!flying) {
    exhibit = getCurrentExhibit();
  }
  if (exhibit && exhibit.link != "") {
    showArtTag(exhibit.author, exhibit.title, exhibit.link);
    fillInfoPanel(exhibit);
    title.style.display = "inline-block";
  } else {
    title.style.display = "none";
  }
  $1.value = flying;
  yield 60;
}


function _turnLeft(animateCamera,getCameraCell,THREE,cellCenter3D,getCameraDir,$0){return(
function turnLeft() {
  if (animateCamera < 60) return;
  let cell = getCameraCell();
  let pos = new THREE.Vector3(...cellCenter3D(...cell));
  let dir = getCameraDir();
  let rot = new THREE.Quaternion().setFromEuler(
    new THREE.Euler(0, ((dir + 1) * Math.PI) / 2, 0, "YXZ")
  );
  $0.value = { pos, rot };
}
)}

function _turnRight(animateCamera,getCameraCell,THREE,cellCenter3D,getCameraDir,$0){return(
function turnRight() {
  if (animateCamera < 60) return;
  let cell = getCameraCell();
  let pos = new THREE.Vector3(...cellCenter3D(...cell));
  let dir = getCameraDir();
  let rot = new THREE.Quaternion().setFromEuler(
    new THREE.Euler(0, ((dir - 1) * Math.PI) / 2, 0, "YXZ")
  );
  $0.value = { pos, rot };
}
)}

function _walkAhead(animateCamera,getCameraCell,getCameraDir,labyrinth,THREE,cellCenter3D,$0){return(
function walkAhead() {
  if (animateCamera < 60) return;
  let [row, col] = getCameraCell();
  let dir = getCameraDir();
  let ang = ((getCameraDir() + 2) * Math.PI) / 2;
  let drow = Math.round(Math.cos(ang));
  let dcol = Math.round(Math.sin(ang));
  if (labyrinth[row + drow][col + dcol] != "W")
    [row, col] = [row + drow * 2, col + dcol * 2];
  else return;
  let pos = new THREE.Vector3(...cellCenter3D(row, col));
  let rot = new THREE.Quaternion().setFromEuler(
    new THREE.Euler(0, (dir * Math.PI) / 2, 0, "YXZ")
  );
  $0.value = { pos, rot };
}
)}

function _above(labDimensions,THREE,rotations)
{
  let [dx, dy, dz] = labDimensions;
  let pos = new THREE.Vector3(dx / 2, Math.max(dx, dz) * 0.6, dz / 2);
  let rot = rotations.down;
  return { pos, rot };
}


function _firstCell(THREE,cellCenter3D)
{
  return {
    pos: new THREE.Vector3(...cellCenter3D(7, 1)),
    rot: new THREE.Quaternion(0, -0.7071067811865475, 0, 0.7071067811865476)
  };
}


function _90(getCameraDir){return(
getCameraDir()
)}

function _fly($0,$1,$2,above){return(
function fly() {
  if ($0.value) return;
  $0.value = true;
  $1.value = $2.value;
  $2.value = above;
}
)}

function _walk($0,$1,$2){return(
function walk() {
  if (!$0.value) return;
  $0.value = false;
  $1.value = $2.value;
}
)}

function _fillInfoPanel(d3,infoPanel){return(
function fillInfoPanel(item) {
  let { link, title, author } = item,
    desc = item["Descrição"],
    bio = item["Mini-bio"];
  let panel = d3.select(infoPanel);
  panel.select("h4.titulo").html(title);
  panel.select("div.cta a").attr("href", item.link);
  panel.select("div.descricao").html(
    "<p>" +
      desc
        .split("\n")
        .filter(p => p != "")
        .join("<p>")
  );
  panel.select("div.ficha-autoria span.autoria").html(author);
  panel.select("div.minibio").text(bio);
}
)}

function _openInfoPanel(d3,infoPanel){return(
function openInfoPanel () {
  d3.select(infoPanel).style("display","block");
}
)}

function _closeInfoPanel(infoPanel,d3)
{
  function close() {
    infoPanel.style.display = "none";
  }
  d3.select(infoPanel)
    .select("button.fechar")
    .on("click", close);
  return close;
}


function _96(md){return(
md`## Libraries`
)}

function _d3(require){return(
require("d3@6")
)}

function _THREE(require){return(
require('three@0.119.1')
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["pcdfloor.jpg", {url: new URL("./files/a7a0aff063350c108871064b46f96b3f0f93d15d7ecb14c4b79e3227fd9259bf2f1a857637a55182401eccc4301375519e81c88996b01631f737ad2f106f932c.jpeg", import.meta.url), mimeType: "image/jpeg", toString}],
    ["identidade2.png", {url: new URL("./files/1d4e42306ad028a5b45634553eecb84a7d19559a5370ec6685a93693ad7f0ce31c283a7d85311d76b7c8fe668e426b180d35744aec8cf7eb012d7f924ad7b08d.png", import.meta.url), mimeType: "image/png", toString}],
    ["identidade1.png", {url: new URL("./files/738f63e943a4584139247cead72307bbc9d62d11de90a053d39862177cea27985b647c259fb585677e0b623e5136520fc6fc2f445551b2d3f7444227b3721e5a.png", import.meta.url), mimeType: "image/png", toString}],
    ["identidade3.png", {url: new URL("./files/53927c9ee830740d5f7cec15552b48c35b5334c32ae60c011b7e95ed99c22adff061f2927fd587c6c009275217ed60bcf4c616dd8c28e7c4082f0ff81dc64074.png", import.meta.url), mimeType: "image/png", toString}],
    ["imagens@3.zip", {url: new URL("./files/fcc86c4b060bff58ca98058b435e4115df7bcfc188f0b02114c705d0b8e7f5ebc29677750981391bd932c6bc79c212aa0d2922edd17e6805eb00ca9043bab192.zip", import.meta.url), mimeType: "application/zip", toString}],
    ["gallery@2.json", {url: new URL("./files/565c29826e565081c59398bec6e796caf785c6cb8b3cfcda54ab7387c7961b8d4813ebddcca09d39f577591545c7bc931ec433da7ca30bdbcdf5f2f3ada1ccba.json", import.meta.url), mimeType: "application/json", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("viewof nrows")).define("viewof nrows", ["Range"], _nrows);
  main.variable(observer("nrows")).define("nrows", ["Generators", "viewof nrows"], (G, _) => G.input(_));
  main.variable(observer("viewof ncols")).define("viewof ncols", ["Range"], _ncols);
  main.variable(observer("ncols")).define("ncols", ["Generators", "viewof ncols"], (G, _) => G.input(_));
  main.variable(observer("viewof decimateRatio")).define("viewof decimateRatio", ["Range"], _decimateRatio);
  main.variable(observer("decimateRatio")).define("decimateRatio", ["Generators", "viewof decimateRatio"], (G, _) => G.input(_));
  main.variable(observer()).define(["DOM","labyrinth"], _5);
  main.variable(observer("viewof loadLayout")).define("viewof loadLayout", ["html"], _loadLayout);
  main.variable(observer("loadLayout")).define("loadLayout", ["Generators", "viewof loadLayout"], (G, _) => G.input(_));
  main.define("initial test", _test);
  main.variable(observer("mutable test")).define("mutable test", ["Mutable", "initial test"], (M, _) => new M(_));
  main.variable(observer("test")).define("test", ["mutable test"], _ => _.generator);
  main.variable(observer()).define(["cameraGoal"], _8);
  main.variable(observer("mainDisplay")).define("mainDisplay", ["renderer","scene","camera","pickPainting","closeInfoPanel","getCurrentExhibit","galleryData","labyrinth","isFlying","openInfoPanel","gotoPainting","mutable isFlying","width","turnLeft","turnRight","walkAhead","html","height","navigationLayer"], _mainDisplay);
  main.variable(observer()).define(["html","floorPlan","display"], _10);
  main.variable(observer()).define(["md"], _11);
  main.variable(observer("galleryData")).define("galleryData", ["galleryData2022"], _galleryData);
  main.variable(observer("oldGalleryData")).define("oldGalleryData", ["d3"], _oldGalleryData);
  main.variable(observer()).define(["Inputs","galleryData"], _14);
  main.variable(observer("galleryData2022")).define("galleryData2022", ["obras2022","d3","galleryImages"], _galleryData2022);
  const child1 = runtime.module(define1);
  main.import("obrasgaleria", "obras2022", child1);
  main.variable(observer("sampleImages")).define("sampleImages", ["galleryImages"], _sampleImages);
  main.variable(observer("makeScaledImage")).define("makeScaledImage", ["htl"], _makeScaledImage);
  main.variable(observer("imagens")).define("imagens", ["FileAttachment"], _imagens);
  main.variable(observer("galleryImages")).define("galleryImages", ["Promises","imagens","FileAttachment"], _galleryImages);
  main.variable(observer()).define(["md"], _21);
  main.variable(observer()).define(["md"], _22);
  main.variable(observer("floorPlan")).define("floorPlan", ["mutable labyrinth","cellSize","wallThick","markAvailableSlots","unassigned","DOM","d3","wallDirections","mutable unassigned"], _floorPlan);
  main.variable(observer()).define(["md"], _24);
  main.variable(observer("display")).define("display", ["html","sampleImages","unassigned","mutable unassigned","md","width"], _display);
  main.variable(observer()).define(["md"], _26);
  main.variable(observer("navigationLayer")).define("navigationLayer", ["html","width","height","buttons","title","infoPanel","closeInfoPanel"], _navigationLayer);
  main.variable(observer()).define(["md"], _28);
  main.variable(observer("title")).define("title", ["html","openInfoPanel"], _title);
  main.variable(observer()).define(["md"], _30);
  main.variable(observer("infoPanel")).define("infoPanel", ["html","d3"], _infoPanel);
  main.variable(observer()).define(["md"], _32);
  main.variable(observer("buttons")).define("buttons", ["html","svg"], _buttons);
  main.variable(observer("assignButtonCallbacks")).define("assignButtonCallbacks", ["buttons","fly","walk","turnLeft","turnRight","walkAhead"], _assignButtonCallbacks);
  main.variable(observer()).define(["md"], _35);
  main.variable(observer("styles")).define("styles", ["html"], _styles);
  main.variable(observer()).define(["md"], _37);
  main.define("initial unassigned", ["d3","galleryImages"], _unassigned);
  main.variable(observer("mutable unassigned")).define("mutable unassigned", ["Mutable", "initial unassigned"], (M, _) => new M(_));
  main.variable(observer("unassigned")).define("unassigned", ["mutable unassigned"], _ => _.generator);
  main.variable(observer("shuffle")).define("shuffle", _shuffle);
  main.variable(observer("makeLabyrinth")).define("makeLabyrinth", ["shuffle"], _makeLabyrinth);
  main.variable(observer("wallDirections")).define("wallDirections", _wallDirections);
  main.variable(observer("markAvailableSlots")).define("markAvailableSlots", ["wallDirections"], _markAvailableSlots);
  main.define("initial labSize", ["nrows","ncols"], _labSize);
  main.variable(observer("mutable labSize")).define("mutable labSize", ["Mutable", "initial labSize"], (M, _) => new M(_));
  main.variable(observer("labSize")).define("labSize", ["mutable labSize"], _ => _.generator);
  main.variable(observer("wallThick")).define("wallThick", _wallThick);
  main.define("initial cellSize", _cellSize);
  main.variable(observer("mutable cellSize")).define("mutable cellSize", ["Mutable", "initial cellSize"], (M, _) => new M(_));
  main.variable(observer("cellSize")).define("cellSize", ["mutable cellSize"], _ => _.generator);
  main.define("initial labyrinth", ["makeLabyrinth","labSize","decimateRatio","shuffle"], _labyrinth);
  main.variable(observer("mutable labyrinth")).define("mutable labyrinth", ["Mutable", "initial labyrinth"], (M, _) => new M(_));
  main.variable(observer("labyrinth")).define("labyrinth", ["mutable labyrinth"], _ => _.generator);
  main.variable(observer("defaultLabyrinth")).define("defaultLabyrinth", ["FileAttachment"], _defaultLabyrinth);
  main.variable(observer("setDefaultLabyrinth")).define("setDefaultLabyrinth", ["mutable labyrinth","defaultLabyrinth","setLabUnassigned"], _setDefaultLabyrinth);
  main.variable(observer()).define(["Files","loadLayout","mutable labyrinth","setLabUnassigned","viewof loadLayout"], _49);
  main.variable(observer("setLabUnassigned")).define("setLabUnassigned", ["d3","sampleImages","mutable unassigned"], _setLabUnassigned);
  main.variable(observer()).define(["md"], _51);
  main.variable(observer("viewof shadows")).define("viewof shadows", ["Checkbox"], _shadows);
  main.variable(observer("shadows")).define("shadows", ["Generators", "viewof shadows"], (G, _) => G.input(_));
  main.variable(observer("viewof antialising")).define("viewof antialising", ["Checkbox"], _antialising);
  main.variable(observer("antialising")).define("antialising", ["Generators", "viewof antialising"], (G, _) => G.input(_));
  const child2 = runtime.module(define2);
  main.import("height", child2);
  main.variable(observer("paintingSizeRatio")).define("paintingSizeRatio", _paintingSizeRatio);
  main.variable(observer("cameraAngle")).define("cameraAngle", ["aspect"], _cameraAngle);
  main.variable(observer("aspect")).define("aspect", ["width","height"], _aspect);
  main.variable(observer("cellCorner3D")).define("cellCorner3D", ["wallThick"], _cellCorner3D);
  main.variable(observer("cellSize3D")).define("cellSize3D", ["wallThick"], _cellSize3D);
  main.variable(observer("cellCenter3D")).define("cellCenter3D", ["cellSize3D","cellCorner3D"], _cellCenter3D);
  main.variable(observer("wallBlocks")).define("wallBlocks", ["labyrinth","THREE","wallThick","cellCenter3D","shadows"], _wallBlocks);
  main.variable(observer("floor")).define("floor", ["THREE","FileAttachment","labSize","cellCorner3D","labyrinth","shadows"], _floor);
  main.variable(observer("floorBlocks")).define("floorBlocks", ["labyrinth","THREE","cellSize3D","wallThick","cellCenter3D"], _floorBlocks);
  main.variable(observer("labDimensions")).define("labDimensions", ["labyrinth","wallThick"], _labDimensions);
  main.variable(observer("paintingOnWall")).define("paintingOnWall", ["THREE","wallThick","paintingSizeRatio","cellCenter3D"], _paintingOnWall);
  main.define("initial debug", _debug);
  main.variable(observer("mutable debug")).define("mutable debug", ["Mutable", "initial debug"], (M, _) => new M(_));
  main.variable(observer("debug")).define("debug", ["mutable debug"], _ => _.generator);
  main.variable(observer("paintings")).define("paintings", ["THREE","mutable debug","labyrinth","galleryImages","galleryData","paintingOnWall"], _paintings);
  main.variable(observer("lights")).define("lights", ["THREE","labDimensions","shadows"], _lights);
  main.variable(observer("camera")).define("camera", ["labDimensions","THREE","cameraAngle","aspect","mutable cameraGoal"], _camera);
  main.variable(observer("rotations")).define("rotations", ["THREE"], _rotations);
  main.variable(observer("scene")).define("scene", ["THREE","lights","wallBlocks","floor","paintings"], _scene);
  main.variable(observer("raycaster")).define("raycaster", ["THREE"], _raycaster);
  main.variable(observer("renderer")).define("renderer", ["DOM","width","height","THREE","shadows"], _renderer);
  main.variable(observer()).define(["md"], _74);
  main.variable(observer("pickPainting")).define("pickPainting", ["THREE","width","height","raycaster","camera","paintings","wallBlocks"], _pickPainting);
  main.variable(observer("gotoPainting")).define("gotoPainting", ["mutable isFlying","getCameraDir","THREE","cellCenter3D","mutable cameraGoal"], _gotoPainting);
  main.variable(observer("getCameraDir")).define("getCameraDir", ["THREE","camera"], _getCameraDir);
  main.variable(observer("getCameraCell")).define("getCameraCell", ["camera","wallThick"], _getCameraCell);
  main.variable(observer("getCurrentExhibit")).define("getCurrentExhibit", ["getCameraDir","getCameraCell","labyrinth","galleryData"], _getCurrentExhibit);
  main.define("initial cameraGoal", ["firstCell"], _cameraGoal);
  main.variable(observer("mutable cameraGoal")).define("mutable cameraGoal", ["Mutable", "initial cameraGoal"], (M, _) => new M(_));
  main.variable(observer("cameraGoal")).define("cameraGoal", ["mutable cameraGoal"], _ => _.generator);
  main.define("initial floorGoal", ["firstCell"], _floorGoal);
  main.variable(observer("mutable floorGoal")).define("mutable floorGoal", ["Mutable", "initial floorGoal"], (M, _) => new M(_));
  main.variable(observer("floorGoal")).define("floorGoal", ["mutable floorGoal"], _ => _.generator);
  main.define("initial isFlying", ["camera"], _isFlying);
  main.variable(observer("mutable isFlying")).define("mutable isFlying", ["Mutable", "initial isFlying"], (M, _) => new M(_));
  main.variable(observer("isFlying")).define("isFlying", ["mutable isFlying"], _ => _.generator);
  main.variable(observer("showArtTag")).define("showArtTag", ["d3"], _showArtTag);
  main.variable(observer("animateCamera")).define("animateCamera", ["mutable cameraGoal","closeInfoPanel","buttons","camera","cameraGoal","THREE","renderer","scene","getCurrentExhibit","showArtTag","fillInfoPanel","title","mutable isFlying"], _animateCamera);
  main.variable(observer("turnLeft")).define("turnLeft", ["animateCamera","getCameraCell","THREE","cellCenter3D","getCameraDir","mutable cameraGoal"], _turnLeft);
  main.variable(observer("turnRight")).define("turnRight", ["animateCamera","getCameraCell","THREE","cellCenter3D","getCameraDir","mutable cameraGoal"], _turnRight);
  main.variable(observer("walkAhead")).define("walkAhead", ["animateCamera","getCameraCell","getCameraDir","labyrinth","THREE","cellCenter3D","mutable cameraGoal"], _walkAhead);
  main.variable(observer("above")).define("above", ["labDimensions","THREE","rotations"], _above);
  main.variable(observer("firstCell")).define("firstCell", ["THREE","cellCenter3D"], _firstCell);
  main.variable(observer()).define(["getCameraDir"], _90);
  main.variable(observer("fly")).define("fly", ["mutable isFlying","mutable floorGoal","mutable cameraGoal","above"], _fly);
  main.variable(observer("walk")).define("walk", ["mutable isFlying","mutable cameraGoal","mutable floorGoal"], _walk);
  main.variable(observer("fillInfoPanel")).define("fillInfoPanel", ["d3","infoPanel"], _fillInfoPanel);
  main.variable(observer("openInfoPanel")).define("openInfoPanel", ["d3","infoPanel"], _openInfoPanel);
  main.variable(observer("closeInfoPanel")).define("closeInfoPanel", ["infoPanel","d3"], _closeInfoPanel);
  main.variable(observer()).define(["md"], _96);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  main.variable(observer("THREE")).define("THREE", ["require"], _THREE);
  const child3 = runtime.module(define3);
  main.import("Range", child3);
  main.import("Checkbox", child3);
  return main;
}
