import { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Button, Card, Input } from 'pixel-retroui';
import { useNavigate } from 'react-router-dom';

interface PokemonData {
    number: string;
    name: string;
    HP: string;
    Attack: string;
    Defense: string;
    SpAttack: string;
    SpDefense: string;
    Speed: string;
    Type1: string;
    Type2: string;
}

export default function PokedexMenu() {
    const [searchTerm, setSearchTerm] = useState('');
    const [pokemonData, setPokemonData] = useState<PokemonData | null>(null);
    const [error, setError] = useState('');

    const navigate = useNavigate();


    const sanitizeSearchTerm = (input: string): string => {
        return input
            .trim()
            .toLowerCase()
            // Remove all types of apostrophes and quotation marks
            .replace(/['''"""]/g, '')
            // Replace spaces and dots with hyphens
            .replace(/[ .]/g, '-')
            // Handle gender symbols (♀♂) and common text representations
            .replace(/[♀]|female/gi, '-f')
            .replace(/[♂]|male/gi, '-m')
            // Handle colons (like "Type: Null")
            .replace(/:/g, '-')
            // Remove any remaining special characters except hyphens and alphanumeric
            .replace(/[^a-z0-9\-]/g, '')
            // Clean up multiple hyphens
            .replace(/-+/g, '-')
            // Remove leading/trailing hyphens
            .replace(/^-+|-+$/g, '')
            // Handle common typos and variations
            .replace(/^idoran/, 'nidoran') // "idoran" -> "nidoran"
            .replace(/^ho-oh$/, 'ho-oh') // Ensure Ho-Oh stays correct
            .replace(/^porygon-z$/, 'porygon-z') // Ensure Porygon-Z stays correct
            // Handle Flabébé specifically (the only Pokémon with an accent)
            .replace(/^flabebe$/, 'flabebe');
    };

    const formatDisplayName = (name: string): string => {
        return name
            // Handle special cases first
            .replace(/^ho-oh$/, 'Ho-Oh')
            .replace(/^porygon-z$/, 'Porygon-Z')
            .replace(/^flabebe$/, 'Flabébé')
            .replace(/^type-null$/, 'Type: Null')
            .replace(/^jangmo-o$/, 'Jangmo-o')
            .replace(/^hakamo-o$/, 'Hakamo-o')
            .replace(/^kommo-o$/, 'Kommo-o')
            .replace(/^tapu-/, 'Tapu ')
            // Handle gender suffixes
            .replace(/-f$/, ' ♀')
            .replace(/-m$/, ' ♂')
            // Handle Mr./Mrs. titles
            .replace(/^mr-/, 'Mr. ')
            .replace(/^mrs-/, 'Mrs. ')
            // Handle specific Pokémon with apostrophes
            .replace(/^farfetchd$/, "Farfetch'd")
            .replace(/^sirfetchd$/, "Sirfetch'd")
            // Replace remaining hyphens with spaces
            .replace(/-/g, ' ')
            // Capitalize each word
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const handleSearch = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setError('');
        setPokemonData(null);

        if (!searchTerm.trim()) {
            setError("Please enter a Pokémon name or number.");
            return;
        }

        try {
            let nameToSearch = sanitizeSearchTerm(searchTerm);
            
            // Check if it's a number
            const parsed = parseInt(nameToSearch, 10);

            if (!isNaN(parsed)) {
                const fetchedName: string = await invoke('get_pokemon_by_number', { number: parsed });
                if (fetchedName.startsWith('Pokemon #')) {
                    setError('Pokemon not found');
                    return;
                }
                nameToSearch = fetchedName;
            }

            // Capitalize the name for the backend call
            const capitalizedName = nameToSearch
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join('-');

            const stats = await invoke<Omit<PokemonData, 'name'>>('get_pokemon_stat_block', { name: capitalizedName });
            if (stats) {
                // Store the capitalized name that the backend expects
                setPokemonData({ ...stats, name: capitalizedName });
            } else {
                setError('Pokemon not found');
            }
        } catch {
            setError('Pokemon not found or an error occurred.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-white p-4">
            <Card className="flex flex-col w-full max-w-4xl h-auto min-h-[80vh] p-4" bg="#fefcd0">
                <div
                    className="grid gap-4 mb-4 flex-grow [grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]" id='center-contents-row'
                >
                    <h2 className="text-2xl font-bold text-center mb-4">Pokedex</h2>
                    <Button onClick={() => navigate('/home')}>Home</Button>
                </div>

                {/* AUTO-FIT: as many 320px columns as will fit */}
                <div
                  className="grid gap-4 mb-4 flex-grow [grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]"
                >
                    {/* Left Column */}
                    {pokemonData ? (
                        <Card className="flex flex-col items-center justify-center w-full h-full p-4">
                            <img
                                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonData.number}.png`}
                                alt={pokemonData.name}
                                className="w-36 h-36 md:w-48 md:h-48 mb-4 object-contain"
                            />
                            <h2 className="text-xl font-bold text-center">
                                ({pokemonData.number}) {formatDisplayName(pokemonData.name)}: {pokemonData.Type1}{pokemonData.Type2 !== 'none' && ` / ${pokemonData.Type2}`}
                            </h2>
                        </Card>
                    ) : (
                        <div className="w-full h-full bg-white border-2 border-dashed border-gray-800 flex items-center justify-center p-4 min-h-[200px]">
                            <p>No Pokémon selected</p>
                        </div>
                    )}

                    {/* Right Column */}
                    {pokemonData ? (
                        <Card className="flex flex-col items-start justify-center w-full h-full p-4">
                            <h3 className="text-lg font-bold mb-2">Base Stats:</h3>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 w-full">
                                <p>HP: {pokemonData.HP}</p>
                                <p>Attack: {pokemonData.Attack}</p>
                                <p>Defense: {pokemonData.Defense}</p>
                                <p>Sp. Attack: {pokemonData.SpAttack}</p>
                                <p>Sp. Defense: {pokemonData.SpDefense}</p>
                                <p>Speed: {pokemonData.Speed}</p>
                            </div>
                        </Card>
                    ) : (
                        <div className="w-full h-full bg-white border-2 border-dashed border-gray-800 flex items-center justify-center p-4 min-h-[200px]">
                            <p>Search for a Pokémon to see its stats</p>
                        </div>
                    )}
                </div>

                {/* Search Controls */}
                <form onSubmit={handleSearch} className="flex flex-col items-center mt-auto pt-4">
                    <div className="w-full max-w-md">
                        <Input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by name or number (e.g., pikachu, Mr Mime, nidoran female)"
                            className="mb-2.5 w-full"
                        />
                        <Button type="submit" className="w-full">Search</Button>
                        {error && <p className="text-red-500 mt-2">{error}</p>}
                    </div>
                </form>
            </Card>
        </div>
    );
}