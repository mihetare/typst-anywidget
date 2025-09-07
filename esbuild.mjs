import * as esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["js/widget.js"],
  outdir: "src/typst_anywidget/static",
  bundle: true,
  write: true,
  minify: true,
  format: "esm",
});
