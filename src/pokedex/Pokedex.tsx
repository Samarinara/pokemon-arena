import { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Button, Card, Input } from 'pixel-retroui';

interface PokemonStatBlock {
    number: string;
    hp: string;
    attack: string;
    defense: string;
    sp_attack: string;
    sp_defense: string;
    speed: string;
    type1: string;
    type2: string;
}

export default function PokedexMenu() {
    const [searchTerm, setSearchTerm] = useState('');
    const [pokemon, setPokemon] = useState<PokemonStatBlock | null>(null);
    const [error, setError] = useState('');

    const handleSearch = async () => {
        setError('');
        setPokemon(null);

        try {
            let name = searchTerm;
            if (parseInt(searchTerm)) {
                name = await invoke('get_pokemon_by_number', { number: parseInt(searchTerm) });
            }
            const stats = await invoke<PokemonStatBlock>('get_pokemon_stat_block', { name });
            setPokemon(stats);
        } catch (err) {
            setError('Pokemon not found');
        }
    };

    return (
        <div className="flex justify-center items-center w-full h-full">
            <Card>
                <div className="bg-gray-300 border-2 border-gray-800 rounded-md grow mb-5 p-2.5">
                    {pokemon ? (
                        <div className="flex flex-col items-center">
                            <div className="w-36 h-36 bg-white border-2 border-dashed border-gray-800 mb-2.5"></div>
                            <h2>{pokemon.number}: {pokemon.type1} {pokemon.type2 !== 'none' && pokemon.type2}</h2>
                            <div className="grid grid-cols-2 gap-x-4">
                                <p>HP: {pokemon.hp}</p>
                                <p>Attack: {pokemon.attack}</p>
                                <p>Defense: {pokemon.defense}</p>
                                <p>Sp. Attack: {pokemon.sp_attack}</p>
                                <p>Sp. Defense: {pokemon.sp_defense}</p>
                                <p>Speed: {pokemon.speed}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full h-full bg-white border-2 border-dashed border-gray-800"></div>
                    )}
                </div>
                <div className="flex flex-col">
                    <Input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by name or number"
                        className="mb-2.5"
                    />
                    <Button onClick={handleSearch}>Search</Button>
                    {error && <p className="text-red-500">{error}</p>}
                </div>
            </Card>
        </div>
    );
}

