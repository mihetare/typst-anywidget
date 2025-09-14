import "./widget.css";
import { minimalEditor } from "prism-code-editor/setups";

// Importing Prism grammars
import "prism-code-editor/prism/languages/markup";
import { languages } from "prism-code-editor/prism";

//prism-typst
import { Prismlanguagestyp } from "./prism-typst";

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
  colunmContainer.style.height = "484px";

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
    value: "",
    onUpdate: debounce(onUpdate, model.get("debounce")),
  });
  // Set the svg if svgInput parameter changes
  function on_svg_change() {
    svgContainer.innerHTML = model.get("svgInput");
  }
  model.on("change:svgInput", on_svg_change);
  // Add on change function to listen to changes from python
  function on_change() {
    let new_value = model.get("value");
    if (editor.value == new_value) {
      // Do nothing
    } else {
      // Handle the change
      editor.value = new_value;
    }
  }
  model.on("change:value", on_change);
  //Error message handler
  function on_error_change() {
    errorContainer.innerHTML = model.get("compilerError");
  }
  model.on("change:compilerError", on_error_change);

  function on_width_change() {
    let new_width = model.get("widgetWidth");
    if (
      colunmContainer.style.width == new_width &&
      colunmContainer.style.width != ""
    ) {
      // Do nothing
    } else {
      // Handle the change
      colunmContainer.style.width = new_width;
    }
  }
  model.on("change:widgetWidth", on_width_change);

  function on_height_change() {
    let new_height = model.get("widgetHeight");
    if (
      colunmContainer.style.height == new_height &&
      colunmContainer.style.height != ""
    ) {
      // Do nothing
    } else {
      // Handle the change
      colunmContainer.style.height = new_height;
    }
  }
  model.on("change:widgetHeight", on_height_change);

  el.appendChild(errorContainer);
  el.appendChild(colunmContainer);
}
export default { render };
