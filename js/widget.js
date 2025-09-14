import "./widget.css";
import { minimalEditor } from "prism-code-editor/setups";

// Importing Prism grammars
import "prism-code-editor/prism/languages/markup";
import { languages } from "prism-code-editor/prism";

//prism-typst
import { Prismlanguagestyp } from "./prism-typst";

// console.log(Prismlanguagestyp);
// Typst highlighting adapted from https://github.com/Mc-Zen/prism-typst/tree/master
languages["typst"] = Prismlanguagestyp;

function debounce(callback, wait) {
  let timeoutId = null;

  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback.apply(null, args);
    }, wait);
  };
}

function render({ model, el }) {
  // let typst_code = () => model.get("value");
  // let debounce_val = () => model.get("debounce");
  // let svgInput = () => model.get("svgInput");
  let editorContainer = document.createElement("div");
  let svgContainer = document.createElement("div");
  let errorContainer = document.createElement("div");

  editorContainer.setAttribute("id", "editorContainer");
  svgContainer.setAttribute("id", "svgContainer");
  errorContainer.setAttribute("id", "errorContainer");

  let colunmContainer = document.createElement("div");
  colunmContainer.classList.add("container");
  colunmContainer.setAttribute("id", "colunmContainer");
  colunmContainer.classList.add("row");
  colunmContainer.style.height = "100vh"; //"484px"; //Math.max(484px, el.clientHeight);
  colunmContainer.style.width = "100vh";

  let leftColumn = document.createElement("div");
  leftColumn.classList.add("column");
  leftColumn.setAttribute("id", "leftColumn");
  leftColumn.appendChild(editorContainer);

  let rightColumn = document.createElement("div");
  rightColumn.classList.add("column");
  rightColumn.setAttribute("id", "rightColumn");
  rightColumn.appendChild(svgContainer);

  colunmContainer.appendChild(leftColumn);
  colunmContainer.appendChild(rightColumn);

  const editor = minimalEditor(
    editorContainer,
    {
      language: "typst",
      theme: "github-light",
    },
    () => console.log("ready"),
  );

  function onUpdate() {
    model.set("value", editor.value);
    model.save_changes();
  }
  //Set some additional options.
  editor.setOptions({
    readOnly: false,
    lineNumbers: true,
    lineWrapping: true,
    wordWrap: true,
    onUpdate: debounce(onUpdate, model.get("debounce")),
  });
  // Set the svg if svgInput parameter changes
  function on_svg_change() {
    // console.log(el.clientWidth);
    // console.log(el.clientHeight);
    // console.log(el.output_area.max_height);
    // console.log(el);

    // console.log(svgContainer.clientWidth);
    // console.log(editorContainer.clientWidth);

    svgContainer.innerHTML = model.get("svgInput");
  }
  model.on("change:svgInput", on_svg_change);
  // Add on change function to listen to changes from python
  function on_change() {
    // colunmContainer.style.height = el.clientHeight;
    let new_my_value = model.get("value");
    if (editor.value == new_my_value) {
    } else {
    }
  }
  model.on("change:value", on_change);
  //Error message handler
  function on_error_change() {
    errorContainer.innerHTML = model.get("compilerError");
  }
  model.on("change:compilerError", on_error_change);

  el.appendChild(errorContainer);
  el.appendChild(colunmContainer);
}
export default { render };
