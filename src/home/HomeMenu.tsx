import { useNavigate } from 'react-router-dom';
import "../App.css";
import { Button, Card } from 'pixel-retroui';
import { useWebSocket } from '../email-auth/WebSocketProvider';


export default function HomeMenu(){
    const navigate = useNavigate();
    const { sendMessage } = useWebSocket();

    function Nav(page: string){
        navigate(page);
    }

    const handleSendMessage = () => {
        sendMessage("Hello from the client!");
    };


    return (
        <div className="flex items-center justify-center h-screen bg-white gap-8 text-center">
            <Card className="flex items-center justify-center flex-col w-[70vw] h-[70vh] p-[1vh]" bg="#fefcd0">
                <h2 className="text-2xl font-bold text-center mb-4">Welcome To Pokemon Arena</h2>
                <p>Please select an option below</p>
                <div id="center-contents">
                    <Button onClick={() => Nav("/pokedex")}>Pokedex</Button>
                    <Button onClick={handleSendMessage}>Send WebSocket Message</Button>
                </div>
            </Card>
        </div>
    );
}

