import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import "nes.css/css/nes.min.css";
import { useState } from "react";

function AuthMenu(){
    InputEmail();
}

function InputEmail() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    setGreetMsg(await invoke("greet", { name }));
  }

  const [email, setEmail] = useState("");
  async function sendVerificationEmail() {
    setGreetMsg(await invoke("send_verification_email", { email }));
  }

  return (
    <div className="container">
      <div className="nes-container with-title is-centered m-4 p-6">
        <h2 className="title">Welcome To Pokemon Arena</h2>
        <div id="center-contents"> 
          <div className="nes-field">
            <label htmlFor="name_field">Please enter your email to verify or create your account</label>
            <input type="text" id="name_field" className="nes-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"></input>
          </div>

          <button type="button" className="nes-btn is-success" onClick={sendVerificationEmail}>Success</button>

          <p>{greetMsg}</p>
        </div>
      </div>
    </div>
  );
}

export default AuthMenu();