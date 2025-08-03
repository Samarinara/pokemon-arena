import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import "nes.css/css/nes.min.css";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    setGreetMsg(await invoke("greet", { name }));
  }

  return (
    <div className="container">
      <div className="nes-container with-title is-centered m-4 p-6">
        <h2 className="title">Welcome To Pokemon Arena</h2>
        <div id="center-contents"> 
          <div className="nes-field">
            <label htmlFor="name_field">Please enter your email to verify or create your account</label>
            <input type="text" id="name_field" className="nes-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Email"></input>
          </div>

          <button type="button" className="nes-btn is-success" onClick={greet}>Success</button>

          <p>{greetMsg}</p>
        </div>
      </div>
    </div>
  );
}

export default App;
