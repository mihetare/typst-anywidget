import importlib.metadata
import pathlib
import anywidget
import traitlets
import typst
import threading
import queue
import time

try:
    __version__ = importlib.metadata.version("typst_anywidget")
except importlib.metadata.PackageNotFoundError:
    __version__ = "0.0.1"

fonts = typst.Fonts()


def typstThreadCompiler(inputQueue,outputQueue):
    while True:
        inputData = inputQueue.get()
        try:
            op = typst.compile(inputData[0]["new"].encode("utf-8"), format='svg', sys_inputs=inputData[1], font_paths=fonts)
            outputQueue.put([1, op])
        except Exception as e:
            outputQueue.put([-1, f"Error: {str(e)}"])
            continue
        # inputQueue.task_done()


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
    svgInput = traitlets.Unicode("").tag(sync=True)
    sysinput = traitlets.Dict({}).tag(sync=True)
    compilerError = traitlets.Unicode("").tag(sync=True)


    def __init__(self, value: str = "", debounce: int = 250, svgInput: str = "", sysinput: dict = {}, compilerError: str = "") -> None:
        super().__init__(value=value, debounce=debounce, svgInput=svgInput, sysinput=sysinput, compilerError=compilerError)
        self.observe(self.compileTypst, names='value')
        self.compilerThreads = []
        self.inputQueue = queue.Queue()
        self.outputQueue = queue.Queue()
        self.compilerWorker = threading.Thread(target=typstThreadCompiler, args=(self.inputQueue,self.outputQueue ))
        self.compilerWorker.start()
        self.op = None

    def setTypstInput(self, value):
        self.value = value

    def compileTypst(self, value):
        try:
            self.compilerError = ""
            self.inputQueue.put([value, self.sysinput])
            # oqueueout = None
            # while self.outputQueue.empty():
            #     time.sleep(0.1)
            #     continue
            # else:
            oqueueout=self.outputQueue.get(block=True)
            if oqueueout[0]==-1:
                self.compilerError = oqueueout[1]
            else:
                self.op = oqueueout[1]
                self.svgInput = self.op.decode('ASCII')
        except Exception as e:
            self.compilerError = f"Error in the result loop: {e}"
            # print(f"Error in the result loop: {e}")

    def getSvgRepr(self):
        return outputsvg_repr(self.op)

    def savePdf(self, filename=None):
        if filename is not  None:
            try:
                op = typst.compile(self.value.encode("utf-8"), format='pdf', sys_inputs=self.sysinput, font_paths=fonts)
                # print(type(op))
                with open(filename, "wb") as f:
                    f.write(op)
                return 1
            except Exception as e:
                self.compilerError = f"Error in saving PDF: {e}"
                return -1
        else:
            print("No filename provided")
            return -1
