function _1(md){return(
md`# Dados Galeria PCD 2022
`
)}

function _fromSheets(){return(
function (url) {
  let dados = fetch(url).then((response) => {
    return response.json();
  });

  return dados;
}
)}

function _obrasgaleria(FileAttachment){return(
FileAttachment("Planilha Obras PCD 2022 - obrasgaleria.csv").csv()
)}

function _obrasgaleriaOld(fromSheets){return(
fromSheets(
  "https://opensheet.elk.sh/1aAG0jEgaegK0ONuDT69AJV1uNUR-Hl8BU-M_Rs3Nnx4/ObrasGaleria"
)
)}

function _tabelaGeral($0,htl,obrasgaleria,md)
{
  $0.value = [];
  let div = htl.html`
    <div>
    <style>
    table.tabela {
      table-layout: fixed;
      border-collapse: collapse;
      width: 100%;
      max-width: 1500px;
    }
    .tabela td {
      padding: 0px;
      overflow: hidden;
      white-space: nowrap;
      width: 140px;
      border: solid 1px #000;
    }
    </style>`;
  let table = htl.html`<table class=tabela >`;
  div.append(table);

  const fields = [
    "Nome",
    //"FotoPerfilDrive",
    "NomeObra",
    //"Thumbnail",
    "Link",
    "LinkFotoRaw",
    "LinkThumbnailRaw"
  ];
  let idx = 0;
  let tr = htl.html`<tr>`;
  tr.append(htl.html`<th>idx`);
  table.append(tr);
  for (let f of fields) tr.append(htl.html`<th>${f}`);
  for (let row of obrasgaleria) {
    let tr = htl.html`<tr>`;
    table.append(tr);
    tr.append(htl.html`<td>${idx++}`);
    for (let f of fields) {
      if (
        [
          //"Thumbnail",
          //"FotoPerfilDrive",
          "LinkFotoRaw",
          "LinkThumbnailRaw"
        ].indexOf(f) < 0
      )
        tr.append(htl.html`<td>${md`${row[f]}`}</td>`);
      else
        tr.append(htl.html`<td ><img src='${row[f]}' width=100 
          onerror=${() =>
            $0.value.push({
              nome: row.Nome,
              obra: row.NomeObra,
              tipoLink: f,
              linkQuebrado: row[f]
            })}
          />`);
    }
  }
  return div;
}


function _debug(){return(
[]
)}

function _7(Inputs,$0){return(
Inputs.table($0.value)
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["Planilha Obras PCD 2022 - obrasgaleria.csv", {url: new URL("./files/5aba79e00a59d44922866199bff2f5f7b76f69f20d665440c423155162ce8a6939def74d7e83f207e49889704b4a2aa8849f2bfdc714fd83764968bb1407aa58.csv", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("fromSheets")).define("fromSheets", _fromSheets);
  main.variable(observer("obrasgaleria")).define("obrasgaleria", ["FileAttachment"], _obrasgaleria);
  main.variable(observer("obrasgaleriaOld")).define("obrasgaleriaOld", ["fromSheets"], _obrasgaleriaOld);
  main.variable(observer("tabelaGeral")).define("tabelaGeral", ["mutable debug","htl","obrasgaleria","md"], _tabelaGeral);
  main.define("initial debug", _debug);
  main.variable(observer("mutable debug")).define("mutable debug", ["Mutable", "initial debug"], (M, _) => new M(_));
  main.variable(observer("debug")).define("debug", ["mutable debug"], _ => _.generator);
  main.variable(observer()).define(["Inputs","mutable debug"], _7);
  return main;
}
