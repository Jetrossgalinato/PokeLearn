"use client";
import Title from "@/components/Title";
import React, { useState, useEffect } from "react";
import { pokemonTypes, generations } from "./utils/constants";

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
  id: number;
}

type Pokemon = {
  name: string;
  image: string | null;
  type: string[];
};

const RESULTS_PER_PAGE = 20;

export default function MainPage() {
  const [allPokemons, setAllPokemons] = useState<PokemonSummary[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [results, setResults] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const [selectedType, setSelectedType] = useState<string | "all">("all");
  const [selectedGen, setSelectedGen] = useState<string | "all">("all");

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Fetch all Pokémon list on mount
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

  // Fetch detailed Pokémon info and apply filters & pagination
  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      setError("");
      setTotalPages(1);
      setCurrentPage(1);
      return;
    }
    const prefixFiltered = allPokemons.filter((p) =>
      p.name.startsWith(searchTerm.toLowerCase())
    );

    // We'll process up to 300 prefix filtered Pokémon to keep performance reasonable
    const maxToProcess = 300;
    const sliceForFiltering = prefixFiltered.slice(0, maxToProcess);

    setLoading(true);
    // Fetch all needed details for filtering first (limited to maxToProcess)
    Promise.all(
      sliceForFiltering.map(async (p) => {
        const res = await fetch(p.url);
        if (!res.ok) throw new Error("Failed to fetch Pokémon");
        return res.json() as Promise<PokemonAPIResponse>;
      })
    )
      .then((allDetails) => {
        // Apply generation and type filters
        const filtered = allDetails.filter((data) => {
          const selectedGeneration = generations.find(
            (g) => g.name === selectedGen
          );
          const genMatch =
            selectedGen === "all" ||
            (selectedGeneration &&
              data.id >= selectedGeneration.start &&
              data.id <= selectedGeneration.end);

          const typeMatch =
            selectedType === "all" ||
            data.types.some((t) => t.type.name === selectedType);

          return genMatch && typeMatch;
        });

        // Update total pages based on filtered results count
        const pages = Math.ceil(filtered.length / RESULTS_PER_PAGE) || 1;
        setTotalPages(pages);

        // Clamp currentPage if it exceeds total pages after filtering
        setCurrentPage((prev) => (prev > pages ? pages : prev));

        // Extract the results for current page
        const startIndex = (currentPage - 1) * RESULTS_PER_PAGE;
        const pageSlice = filtered.slice(
          startIndex,
          startIndex + RESULTS_PER_PAGE
        );

        // Map to Pokemon type used in UI
        const pageResults: Pokemon[] = pageSlice.map((data) => ({
          name: data.name,
          image:
            data.sprites.other?.["official-artwork"]?.front_default ?? null,
          type: data.types.map((t) => t.type.name),
        }));

        setResults(pageResults);
        setLoading(false);
      })
      .catch((err) => {
        if (err instanceof Error) setError(err.message);
        setLoading(false);
      });
  }, [searchTerm, allPokemons, selectedType, selectedGen, currentPage]);

  // Reset page to 1 when filters or searchTerm changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedType, selectedGen]);

  // Pagination control handlers
  const goToFirst = () => setCurrentPage(1);
  const goToLast = () => setCurrentPage(totalPages);
  const goToPrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const goToNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  return (
    <main className="min-h-screen bg-gray-100 px-6 py-8 flex flex-col items-center">
      <Title />

      {/* Wrapper for search + filters */}
      <div className="flex w-full max-w-5xl items-center gap-4 mt-8 mb-6">
        {/* Search Bar */}
        <div className="flex-grow border border-red-400 rounded-full overflow-hidden shadow-sm focus-within:shadow-md transition">
          <input
            type="text"
            placeholder="Search Pokémon by name prefix..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 outline-none text-gray-800 font-medium rounded-full"
            aria-label="Search Pokémon"
            autoComplete="off"
          />
        </div>

        {/* Filters on right side */}
        <div className="flex gap-4 min-w-[300px]">
          {/* Type filter */}
          <select
            className="p-2 border rounded"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="all">All Types</option>
            {pokemonTypes.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>

          {/* Generation filter */}
          <select
            className="p-2 border rounded"
            value={selectedGen}
            onChange={(e) => setSelectedGen(e.target.value)}
          >
            <option value="all">All Generations</option>
            {generations.map((gen) => (
              <option key={gen.name} value={gen.name}>
                {gen.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Pagination controls */}
      {results.length > 0 && (
        <div className="flex justify-center items-center gap-4 mb-6">
          <button
            onClick={goToFirst}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-red-500 text-white disabled:bg-red-300"
            aria-label="First page"
          >
            « First
          </button>
          <button
            onClick={goToPrev}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-red-500 text-white disabled:bg-red-300"
            aria-label="Previous page"
          >
            ‹ Prev
          </button>
          <span className="font-semibold">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={goToNext}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded bg-red-500 text-white disabled:bg-red-300"
            aria-label="Next page"
          >
            Next ›
          </button>
          <button
            onClick={goToLast}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded bg-red-500 text-white disabled:bg-red-300"
            aria-label="Last page"
          >
            Last »
          </button>
        </div>
      )}

      {error && <p className="text-red-600 mb-4 font-semibold">{error}</p>}
      {loading && (
        <p className="mb-4 text-gray-700 font-semibold">Loading...</p>
      )}

      {/* Results */}
      <section className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {results.length === 0 && !loading && !error && (
          <p className="col-span-full text-center text-gray-600">
            Use the search above to find Pokémon by name, type, and generation.
          </p>
        )}
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
