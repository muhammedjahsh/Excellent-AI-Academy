const VERSION = "0.27.7";
const BASE_URL = `https://cdn.jsdelivr.net/pyodide/v${VERSION}/full/`;

let runtimePromise;

async function getRuntime() {
  if (!runtimePromise) {
    runtimePromise = import(`${BASE_URL}pyodide.mjs`).then(({ loadPyodide }) =>
      loadPyodide({ indexURL: BASE_URL }),
    );
  }
  return runtimePromise;
}

self.onmessage = async (event) => {
  const { id, source } = event.data;
  try {
    const pyodide = await getRuntime();
    self.postMessage({ type: "ready", id });
    pyodide.globals.set("academy_source", source);
    const output = await pyodide.runPythonAsync(`
import contextlib
import io
import traceback

academy_output = io.StringIO()
academy_namespace = {"__name__": "__main__"}
try:
    with contextlib.redirect_stdout(academy_output), contextlib.redirect_stderr(academy_output):
        exec(academy_source, academy_namespace)
    if "result" in academy_namespace:
        academy_output.write(repr(academy_namespace["result"]) + "\\n")
except Exception:
    traceback.print_exc(file=academy_output)
academy_output.getvalue()
`);
    self.postMessage({ type: "result", id, output });
  } catch (error) {
    self.postMessage({
      type: "error",
      id,
      message: error instanceof Error ? error.message : "The Python runtime could not start.",
    });
  }
};
