import importlib.metadata
import pathlib

import anywidget
import traitlets

import typst

try:
    __version__ = importlib.metadata.version("typst_anywidget")
except importlib.metadata.PackageNotFoundError:
    __version__ = "0.0.1"

class outputsvg_repr:
    def __init__(self, input):
        self.ip = input
    def setInput(self, input):
        self.ip = input
    def _repr_svg_(self):
        return self.ip.decode('ASCII')

class TypstInput(anywidget.AnyWidget):
    _esm = pathlib.Path(__file__).parent / "static" / "widget.js"
    _css = pathlib.Path(__file__).parent / "static" / "widget.css"
    value = traitlets.Unicode("").tag(sync=True)
    debounce = traitlets.Int(250).tag(sync=True)
    typstoutput = traitlets.Unicode("").tag(sync=True)
    sysinput = traitlets.Dict({}).tag(sync=True)

    def __init__(self, value: str = "", debounce: int = 250, typstoutput: str = "", sysinput: dict = {}) -> None:
        super().__init__(value=value, debounce=debounce, typstoutput=typstoutput, sysinput=sysinput)

    def setTypstInput(self, value):
        self.value = value

    def compileTypst(self):
        pythonCompilerOutput = typst.compile(self.value.encode("utf-8"), format='svg', sys_inputs=self.sysinput ) # sys_inputs=sys_inputs,
        return pythonCompilerOutput

    def getSvgRepr(self):
        self.compileTypst()
        return outputsvg_repr(self.compileTypst())
