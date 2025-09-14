# typst_anywidget

A simple widget to compile and render typst documents in Marimo. The widget also works on Jupyter lab, however, the use is less conventient due to Jupyter lab capuring keypresses.

## Example
from typst_anywidget import TypstInput

taw =mo.ui.anywidget(TypstInput())

taw

## Installation

Clone the repository:

```sh
git clone https://github.com/mihetare/typst_anywidget.git
```

Build and install:

```sh
npm run build && pip install .
```
