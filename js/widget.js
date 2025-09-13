import "./widget.css";
import { minimalEditor } from "prism-code-editor/setups";

// Importing Prism grammars
import "prism-code-editor/prism/languages/markup";
import { languages } from "prism-code-editor/prism";

// Typst highlighting adapted from https://github.com/Mc-Zen/prism-typst/tree/master
const typs_math = {
  // comment: comment,
  // raw: raw,
  // escaped: general_escapes,
  operator: [
    /<=>|<==>|<-->|\[\||\|\]|\|\||:=|::=|\.\.\.|=:|!=|>>>|>=|<<<|<==|<=|\|->|=>|\|=>|==>|-->|~~>|~>|>->|->>|<--|<~~|<~|<-<|<<-|<->|->|<-|<<|>>/,
    /[_\\\^\+\-\*\/&']/,
  ],
  string: [/"(?:\\.|[^\\"])*"/, /\$/],
  function: /\b[a-zA-Z][\w-]*(?=\[|\()/,
  symbol: [/[a-zA-Z][\w]+/, /#[a-zA-Z][\w]*/],
};

languages["typst"] = {
  math: {
    pattern: /\$(?:\\.|[^\\$])*?\$/,
    inside: typs_math,
  },
  comment: {
    pattern: /\/\/.*/,
    greedy: true,
  },
  heading: {
    pattern: /^\s*=+ .*/m,
    greedy: true,
  },
  keyword: {
    pattern:
      /(?:#|\b)(?:none|auto|let|return|if|else|set|show|context|for|while|not|in|continue|break|include|import|as)\b/,
    greedy: true,
  },
  boolean: {
    pattern: /(?:#|\b)(?:true|false)\b/,
    greedy: true,
  },
  operator: {
    pattern: /==|=|\+|\-|\*|\/|\+=|\-=|\*=|\/=|=>|<=|\.\.|<|>/,
    greedy: true,
  },
  string: {
    pattern: /"(?:\\.|[^\\"])*"/,
    greedy: true,
  },
  number: [
    /0b[01]+/,
    /0o[0-7]+/,
    /0x[\da-fA-F]+/,
    /(?<![\w-])-?[\d]+\.?[\d]*(e\d+)?(?:in|mm|cm|pt|em|deg|rad|fr|%)?/,
  ],
};

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
  colunmContainer.setAttribute("id", "colunmContainer");
  colunmContainer.classList.add("row");

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
  //Set some additional options.
  editor.setOptions({
    readOnly: false,
    lineNumbers: true,
    lineWrapping: true,
    wordWrap: true,
  });
  // Set the svg if svgInput parameter changes
  function on_svg_change() {
    console.log(el.clientWidth);
    console.log(el.clientHeight);
    console.log(svgContainer.clientWidth);
    console.log(editorContainer.clientWidth);

    svgContainer.innerHTML = model.get("svgInput");
  }
  model.on("change:svgInput", on_svg_change);
  // Add on change function to listen to changes from python
  function on_change() {
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

  // A debounced event listener for saving the inputs into the widget
  editor.textarea.addEventListener(
    "input",
    debounce((ev) => {
      model.set("value", editor.value);
      model.save_changes();
    }, model.get("debounce")),
  );
  el.appendChild(errorContainer);
  el.appendChild(colunmContainer);
}
export default { render };
