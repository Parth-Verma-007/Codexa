import { useState } from "react";
import Editor from "@monaco-editor/react";

function App() {
  const [code, setCode] = useState("console.log('Hello world')");
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);

  const runCode = async () => {
    setRunning(true);
    setOutput("Running...");

    try {
      const response = await fetch("/api/v2/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: "javascript",
          version: "18.15.0",
          files: [{ content: code }],
        }),
      });

      const data = await response.json();
      console.log("Piston response:", data);

      if (data.run) {
        setOutput(data.run.output || data.run.stderr || "No output");
      } else {
        setOutput("Unexpected response: " + JSON.stringify(data));
      }
    } catch (err) {
      setOutput("Error: " + err.message);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <button
        onClick={runCode}
        disabled={running}
        style={{ padding: "10px", fontSize: "16px" }}
      >
        {running ? "Running..." : "Run"}
      </button>

      <Editor
        height="60vh"
        defaultLanguage="javascript"
        value={code}
        onChange={(value) => setCode(value)}
        theme="vs-dark"
      />

      <div
        style={{
          height: "30vh",
          background: "#1e1e1e",
          color: "#0f0",
          padding: "10px",
          fontFamily: "monospace",
          whiteSpace: "pre-wrap",
          overflowY: "auto",
        }}
      >
        {output}
      </div>
    </div>
  );
}

export default App;