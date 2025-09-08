import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";
import VerifyKeyMenu from "./VerifyKeyMenu";
import { Button, Card, Input } from 'pixel-retroui'

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
    <div className="flex items-center justify-center h-screen bg-white gap-8 text-center">
      <Card className="flex items-center justify-center flex-col w-[70vw] h-[70vh] p-[1vh]">
        <h2 className="text-2xl font-bold text-center mb-4">Welcome To Pokemon Arena</h2>
        <div id="center-contents">

            <label>Please enter your email to verify or create your account</label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"></Input>

          <Button onClick={sendVerificationEmail}>Submit</Button>
          <p>{greetMsg}</p>
        </div>
      </Card>
    </div>
  );
}

export default AuthMenu;