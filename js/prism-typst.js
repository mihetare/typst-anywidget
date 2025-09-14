const comment = [
  {
    pattern: /\/\*[\s\S]*?\*\//,
    greedy: true,
  },
  {
    pattern: /\/\/.*/,
    greedy: true,
  },
];

const raw = [
  {
    pattern: /^```[\s\S]*?^```$/m,
    greedy: true,
  },
  {
    pattern: /`[\s\S]*?`/,
    greedy: true,
  },
];

const label = {
  pattern: /<[\w\-.:]*>/, // starting with ([^\\]) not necessary anymore when matching "escaped" before
};

const general_escapes = [/\\u{[\da-fA-F]+?\}/, /\\\S/, /\\\s/];

const Prismlanguagestypstmath = {
  comment: comment,
  raw: raw,
  escaped: general_escapes,
  operator: [
    /<=>|<==>|<-->|\[\||\|\]|\|\||:=|::=|\.\.\.|=:|!=|>>>|>=|<<<|<==|<=|\|->|=>|\|=>|==>|-->|~~>|~>|>->|->>|<--|<~~|<~|<-<|<<-|<->|->|<-|<<|>>/,
    /[_\\\^\+\-\*\/&']/,
  ],
  string: [/"(?:\\.|[^\\"])*"/, /\$/],
  function: /\b[a-zA-Z][\w-]*(?=\[|\()/,
  symbol: [/[a-zA-Z][\w]+/, /#[a-zA-Z][\w]*/],
};

const math = [
  {
    pattern: /\$(?:\\.|[^\\$])*?\$/,
    inside: Prismlanguagestypstmath,
    // greedy: true,
  },
];

const Prismlanguagestypstcode = {
  typst: {
    // pattern: /\[[\s\S]*\]/,
    pattern: /\[(?:[^\]\[]|\[(?:[^\]\[]|\[(?:[^\]\[]|\[[^\]\[]*\])*\])*\])*\]/,
    inside: Prismlanguagestypst,
    greedy: true,
  },
  comment: comment,
  math: math,
  function: [
    {
      pattern: /#?[a-zA-Z][\w\-]*?(?=\[|\()/,
      greedy: true,
    },
    /(?<=show [\w.]*)[a-zA-Z][\w-]*\s*:/,
    /(?<=show\s*:\s*)[a-zA-Z][\w-]*/,
  ],
  keyword:
    /(?:#|\b)(?:none|auto|let|return|if|else|set|show|context|for|while|not|in|continue|break|include|import|as)\b/,
  boolean: /(?:#|\b)(?:true|false)\b/,
  string: {
    pattern: /"(?:\\.|[^\\"])*"/,
    greedy: true,
  },
  label: label,
  number: [
    /0b[01]+/,
    /0o[0-7]+/,
    /0x[\da-fA-F]+/,
    /(?<![\w-])-?[\d]+\.?[\d]*(e\d+)?(?:in|mm|cm|pt|em|deg|rad|fr|%)?/,
  ],
  symbol: /#[\w\-.]+\./,
  operator: /==|=|\+|\-|\*|\/|\+=|\-=|\*=|\/=|=>|<=|\.\.|<|>/,
  punctuation: /[\{\}\(\):\,\;\.]/,
};

const Prismlanguagestypst = {
  comment: comment,
  raw: raw,
  math: math,
  "code-mode": [
    {
      // enter code mode via #my-func() or #()
      // pattern: /(?<=#[a-zA-Z][\w-.]*\()(?:[^)(]|\((?:[^)(]|\((?:[^)(]|\([^)(]*\))*\))*\))*\)/,
      // pattern: /(?<=#([a-zA-Z][\w-.]*)?\()(?:[^)(]|\((?:[^)(]|\((?:[^)(]|\((?:[^)(]|\((?:[^)(]|\([^)(]*\))*\))*\))*\))*\))*\)/,
      // between # and ( either
      // - nothing: #(
      // - Declaration: #let ... (
      // - Function call: #my-func2(
      // #
      pattern:
        /(?<!\\)#.*?\((?:[^)(]|\((?:[^)(]|\((?:[^)(]|\((?:[^)(]|\((?:[^)(]|\([^)(]*\))*\))*\))*\))*\))*\)(?![ \t]*=)/,
      // pattern: /(?:#(?:(?:let.*?)|(?:[\w\-.]+?)|(?:)))\((?:[^)(]|\((?:[^)(]|\((?:[^)(]|\((?:[^)(]|\((?:[^)(]|\([^)(]*\))*\))*\))*\))*\))*\)(?!\s*=)/,
      // lookbehind: true,
      inside: Prismlanguagestypstcode,
      greedy: true,
    },
    // {
    //   // enter code mode via #{}
    //   // pattern: /(?<=#)\{[\s\S]*\}/,
    //   // pattern: /#.*\{(?:[^}{]|\{(?:[^}{]|\{(?:[^}{]|\{[^}{]*\})*\})*\})*\}/,
    //   // pattern: /(?<=#).*\{(?:[^}{]|\{(?:[^}{]|\{(?:[^}{]|\{[^}{]*\})*\})*\})*\}/,
    //   pattern: /#.*\{(?:[^}{]|\{(?:[^}{]|\{(?:[^}{]|\{[^}{]*\})*\})*\})*\}/,
    //   inside: Prism.languages["typst-code"],
    //   greedy: true,
    // },
    {
      pattern:
        /(?<!\\)#.*?(?:\((?:[^)(]|\((?:[^)(]|\((?:[^)(]|\((?:[^)(]|\((?:[^)(]|\([^)(]*\))*\))*\))*\))*\))*\))?.*?\{(?:[^}{]|\{(?:[^}{]|\{(?:[^}{]|\{[^}{]*\})*\})*\})*\}/,
      inside: Prismlanguagestypstcode,
      greedy: true,
    },
    {
      pattern: /(?<=set .*?) if/,
      inside: Prismlanguagestypstcode,
      greedy: true,
    },
    {
      pattern: /(?<!\\)#(?:import|let|if|context|set|show|include).*/,
      inside: Prismlanguagestypstcode,
      greedy: true,
    },
  ],
  function: [
    {
      pattern: /#[a-zA-Z][\w-]*(?=\[|\()/,
      greedy: true,
    },
    /(?<=#[\w.]+)[a-zA-Z][\w-]*(?=\[|\()/,
  ],
  string: {
    pattern: /#"(?:\\.|[^\\"])*"/,
    greedy: true,
  },
  url: {
    pattern: /https?\:\/\/[\w.\/\-@:%._\+~#=]*[\w\/]/,
    greedy: true,
  },
  escaped: general_escapes.concat([/~|---|--|-\?|\.\.\.|-/]),
  label: label,
  reference: {
    pattern: /@[\w\-.:]*/,
    lookbehind: true,
  },
  boltalic: [/_\*.*?\*_/, /\*_.*?_\*/],
  bold: /\*.*?\*/,
  italic: /_.*?_/,
  heading: /^\s*=+ .*/m,
  symbol: /#[\w\-.]*[\w-]+/,
};

const Prismlanguagestypstcodetypst = {
  pattern: /\[(?:[^\]\[]|\[(?:[^\]\[]|\[(?:[^\]\[]|\[[^\]\[]*\])*\])*\])*\]/,
  inside: Prismlanguagestypst,
  greedy: true,
};

export const Prismlanguagestyp = Prismlanguagestypst;
export const Prismlanguagestypc = Prismlanguagestypstcodetypst;

export default Prismlanguagestyp;
