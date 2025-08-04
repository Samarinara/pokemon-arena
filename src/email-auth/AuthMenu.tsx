import { invoke } from "@tauri-apps/api/core";
import "../App.css";
import "nes.css/css/nes.min.css";
import { useState } from "react";
import VerifyKeyMenu from "./VerifyKeyMenu";

function AuthMenu(){
    const [email, setEmail] = useState("");
    const [emailSent, setEmailSent] = useState(false);

    if (emailSent) {
        return <VerifyKeyMenu email={email} />;
    } else {
        return <InputEmail setEmailSent={setEmailSent} setEmail={setEmail} email={email}/>;
    }
}

function InputEmail({ setEmailSent, setEmail, email }: { setEmailSent: (sent: boolean) => void, setEmail: (email: string) => void, email: string }) {
  const [greetMsg, setGreetMsg] = useState("");

  async function sendVerificationEmail() {
    try {
        await invoke("send_verification_email", { email });
        setEmailSent(true);
    } catch (e) {
        setGreetMsg(e as string);
    }
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

export default AuthMenu;