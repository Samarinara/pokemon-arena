import { invoke } from "@tauri-apps/api/core";
import "../App.css";
import "nes.css/css/nes.min.css";
import { useState } from "react";
import { useAuth } from "./authcontext";

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
        <div className="container">
            <div className="nes-container with-title is-centered m-4 p-6">
                <h2 className="title">Verify Key</h2>
                <div id="center-contents">
                    <div className="nes-field">
                        <label htmlFor="key_field">Key</label>
                        <input type="text" id="key_field" className="nes-input" value={key} onChange={(e) => setKey(e.target.value)} placeholder="Key"></input>
                    </div>
                    <button type="button" className="nes-btn is-primary" onClick={verifyKey}>Verify</button>
                    {error && <p className="nes-text is-error">{error}</p>}
                </div>
            </div>
        </div>
    );
}

export default VerifyKeyMenu;