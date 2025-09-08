import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";
import { useAuth } from "./authcontext";
import { Button, Card, Input } from 'pixel-retroui';

function VerifyKeyMenu({ email }: { email: string }){
    const { login } = useAuth();
    const [key, setKey] = useState("");
    const [error, setError] = useState("");

    async function verifyKey() {
        try {
            const verified = await invoke("verify_key", { email, key });
            if (verified) {
                login(email, key);
            } else {
                setError("Invalid key");
            }
        } catch (e) {
            setError(e as string);
        }
    }

    return (
        <div className="flex items-center justify-center h-screen bg-white gap-8 text-center">
            <Card className="flex items-center justify-center flex-col w-[70vw] h-[70vh] p-[1vh]" bg="#fefcd0">
                <h2 className="text-2xl font-bold text-center mb-4">Welcome To Pokemon Arena</h2>
                <div id="center-contents">

                    <label>Please enter the key sent to your email: {email}</label>
                    <Input value={key} onChange={(e) => setKey(e.target.value)} placeholder="Key"></Input>

                <Button onClick={verifyKey}>Submit</Button>
                <p>{error}</p>
                </div>
            </Card>
        </div>
    );
}

export default VerifyKeyMenu;