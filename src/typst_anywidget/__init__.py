import importlib.metadata
import pathlib
import anywidget
import traitlets
import typst
import threading
import queue

try:
    __version__ = importlib.metadata.version("typst_anywidget")
except importlib.metadata.PackageNotFoundError:
    __version__ = "0.0.1"


def typstThreadCompiler(inputQueue,outputQueue, opiomonitor):
    while True:
        inputData = inputQueue.get()
        try:
            op = typst.compile(inputData[0]["new"].encode("utf-8"), format='svg', sys_inputs=inputData[1])
            outputQueue.put(op)
            opiomonitor()
        except Exception as e:
            pass
            # outputQueue.put(f"Error: {str(e)}")
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

    def __init__(self, value: str = "", debounce: int = 250, svgInput: str = "", sysinput: dict = {}) -> None:
        super().__init__(value=value, debounce=debounce, svgInput=svgInput, sysinput=sysinput)
        self.observe(self.compileTypst, names='value')
        self.compilerThreads = []
        self.inputQueue = queue.Queue()
        self.outputQueue = queue.Queue()
        self.compilerWorker = threading.Thread(target=typstThreadCompiler, args=(self.inputQueue,self.outputQueue,self.opMointor, ))
        self.compilerWorker.start()
        self.op = None

    def opMointor(self):
        pass
        # self.svgInput = self.outputQueue.get().decode('ASCII')

    def setTypstInput(self, value):
        self.value = value

    def compileTypst(self, value):
        try:
            # self.op = typst.compile(value["new"].encode("utf-8"), format='svg', sys_inputs=self.sysinput ) # sys_inputs=sys_inputs,
            self.inputQueue.put([value, self.sysinput])
            # self.op = self.outputQueue.get()

            try:
                while True:
                    self.op = self.outputQueue.get(block=False)
                    done = False
                    while not done:
                        try:
                            self.svgInput = self.op.decode('ASCII')
                            done = True
                        except Exception as e:
                            pass  # just try again to do stuff
                    self.outputQueue.task_done()
            except Exception as e:
                pass  # no more items



            # self.svgInput = self.op.decode('ASCII')
        except Exception as e:
            print(f"Error compiling Typst: {e}")

    def getSvgRepr(self):
        return outputsvg_repr(self.op)
