import importlib.metadata
import pathlib

import anywidget
import traitlets

try:
    __version__ = importlib.metadata.version("typst_anywidget")
except importlib.metadata.PackageNotFoundError:
    __version__ = "0.1"


class TypstInput(anywidget.AnyWidget):
    _esm = pathlib.Path(__file__).parent / "static" / "widget.js"
    _css = pathlib.Path(__file__).parent / "static" / "widget.css"
    value = traitlets.Unicode("").tag(sync=True)
    def __init__(self, value: value) -> None:
          super().__init__(value=value)
