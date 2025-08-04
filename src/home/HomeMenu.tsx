import { useNavigate } from 'react-router-dom';
import "../App.css";
import { Button, Card } from 'pixel-retroui';


export default function HomeMenu(){
    const navigate = useNavigate();

    function Nav(page: string){
        navigate(page);
    }


    return (
        <div className="flex items-center justify-center h-screen bg-white gap-8 text-center">
            <Card className="flex items-center justify-center flex-col w-[70vw] h-[70vh] p-[1vh]" bg="#fefcd0">
                <h2 className="text-2xl font-bold text-center mb-4">Welcome To Pokemon Arena</h2>
                <p>Please select an option below</p>
                <div id="center-contents">
                    <Button onClick={() => navigate("/pokedex")}>Pokedex</Button>
                </div>
            </Card>
        </div>
    );
}

