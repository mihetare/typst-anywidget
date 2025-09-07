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

// async function typstCompiler() {
//   const mainContent = "Hello, typst!";
//   console.log(await $typst.svg({ mainContent })); //
//   return "Hello";
// }

function render({ model, el }) {
  let typst_code = () => model.get("value");
  let debounce_val = () => model.get("debounce");
  let editorContainer = document.createElement("div");
  editorContainer.className = "editorContainer";
  editorContainer.setAttribute("id", "editorContainer");
  // Create editor
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
  //Typst compiler
  //typstCompiler();

  // Add on change function to listen to changes from python
  function on_change() {
    let new_my_value = model.get("value");
    if (editor.value == new_my_value) {
      // console.log("Editor value is equal to new my value");
    } else {
    }
    // console.log(`The 'my_value' changed to: ${new_my_value}`);
  }
  model.on("change:value", on_change);
  // A debounced event listener for saving the inputs into the widget
  editor.textarea.addEventListener(
    "input",
    debounce((ev) => {
      model.set("value", editor.value);
      model.save_changes();
    }, model.get("debounce")),
  );
  el.appendChild(editorContainer);
}
export default { render };
