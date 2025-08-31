import "./widget.css";
import {
  minimalEditor,
  basicEditor,
  readonlyEditor,
} from "prism-code-editor/setups";

// Importing Prism grammars
import "prism-code-editor/prism/languages/markup";
import { languages } from "prism-code-editor/prism";

// console.log(languages["html"]);

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

function render({ model, el }) {
  let typst_code = () => model.get("value");
  let editorContainer = document.createElement("div");
  editorContainer.className = "editorContainer";
  editorContainer.setAttribute("id", "editorContainer");
  const editor = minimalEditor(
    editorContainer,
    {
      language: "typst",
      theme: "github-light",
    },
    () => console.log("ready"),
  );

  editor.textarea.addEventListener("input", () => {
    model.set("value", editor.value);
    model.save_changes();
  });
  el.appendChild(editorContainer);
}
export default { render };
