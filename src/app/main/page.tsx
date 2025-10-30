"use client";
import Title from "@/components/Title";
import React, { useState, useEffect } from "react";

type PokemonSummary = {
  name: string;
  url: string;
};

interface PokemonAPIResponse {
  name: string;
  sprites: {
    other?: {
      "official-artwork"?: {
        front_default: string | null;
      };
    };
  };
  types: Array<{ type: { name: string } }>;
}

type Pokemon = {
  name: string;
  image: string | null;
  type: string[];
};

export default function MainPage() {
  const [allPokemons, setAllPokemons] = useState<PokemonSummary[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [results, setResults] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchAll() {
      try {
        const res = await fetch(
          "https://pokeapi.co/api/v2/pokemon?limit=10000"
        );
        if (!res.ok) throw new Error("Failed to fetch Pokémon list");
        const data = await res.json();
        setAllPokemons(data.results as PokemonSummary[]);
      } catch (err) {
        if (err instanceof Error) setError(err.message);
      }
    }
    fetchAll();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      setError("");
      return;
    }

    const filtered = allPokemons
      .filter((pokemon) => pokemon.name.startsWith(searchTerm.toLowerCase()))
      .slice(0, 20);

    if (filtered.length === 0) {
      setResults([]);
      setError("No Pokémon found.");
      return;
    }

    setLoading(true);
    setError("");

    Promise.all(
      filtered.map(async (p) => {
        const res = await fetch(p.url);
        if (!res.ok) throw new Error("Failed to fetch Pokémon details");
        const data: PokemonAPIResponse = await res.json();

        return {
          name: data.name,
          image:
            data.sprites.other?.["official-artwork"]?.front_default ?? null,
          type: data.types.map((t) => t.type.name),
        } as Pokemon;
      })
    )
      .then((pokemons) => {
        setResults(pokemons);
        setLoading(false);
      })
      .catch((err) => {
        if (err instanceof Error) setError(err.message);
        setLoading(false);
      });
  }, [searchTerm, allPokemons]);

  return (
    <main className="min-h-screen bg-gray-100 px-6 py-8 flex flex-col items-center">
      <Title />

      <div className="w-full max-w-xl mt-8 mb-8 flex border border-red-400 rounded-full overflow-hidden shadow-sm focus-within:shadow-md transition">
        <input
          type="text"
          placeholder="Search Pokémon by name prefix..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow px-4 py-3 outline-none text-gray-800 font-medium"
          aria-label="Search Pokémon"
          autoComplete="off"
        />
      </div>

      {error && <p className="text-red-600 mb-4 font-semibold">{error}</p>}

      {loading && (
        <p className="mb-4 text-gray-700 font-semibold">Loading...</p>
      )}

      <section className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {results.map((pokemon) => (
          <article
            key={pokemon.name}
            className="bg-white rounded-xl shadow-md p-5 flex flex-col items-center text-center hover:shadow-lg transition"
          >
            {pokemon.image ? (
              <img
                src={pokemon.image}
                alt={pokemon.name}
                className="w-28 h-28 object-contain mb-4"
                loading="lazy"
              />
            ) : (
              <div className="w-28 h-28 mb-4 bg-gray-200 rounded-md flex justify-center items-center">
                <span className="text-gray-400">No image</span>
              </div>
            )}
            <h2 className="text-xl font-bold text-red-600 mb-2 capitalize">
              {pokemon.name}
            </h2>
            <p className="text-gray-700 capitalize">
              {pokemon.type.join(", ")}
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}
