"use client";
import Title from "@/components/Title";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { generations } from "./utils/constants";
import LogoutButton from "../../components/LogoutButton";
import { supabase } from "@/lib/supabase";
import SearchBar from "./components/SearchBar";
import FilterBar from "./components/FilterBar";
import PaginationControls from "./components/PaginationControls";
import PokemonGrid from "./components/PokemonGrid";
import InfoModal from "./components/InfoModal";

import { Pokemon, PokemonAPIResponse, PokemonSummary } from "./utils/types";

const RESULTS_PER_PAGE = 20;

export default function MainPage() {
  const router = useRouter();

  const [allPokemons, setAllPokemons] = useState<PokemonSummary[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [results, setResults] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const [selectedType, setSelectedType] = useState<string | "all">("all");
  const [selectedGen, setSelectedGen] = useState<string | "all">("all");

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);

  // Check Supabase authentication on mount
  useEffect(() => {
    async function checkAuth() {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        router.push("/login");
      }
      setIsAuthChecked(true);
    }
    checkAuth();
  }, [router]);

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
          id: data.id,
          height: data.height,
          weight: data.weight,
          abilities: data.abilities.map((a) => a.ability.name),
          stats: data.stats.map((s) => ({
            name: s.stat.name,
            value: s.base_stat,
          })),
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

  // Show loading while checking authentication
  if (!isAuthChecked) {
    return (
      <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        <p className="text-gray-700 text-lg font-semibold">
          Checking authentication...
        </p>
      </main>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Pagination control handlers
  const goToFirst = () => setCurrentPage(1);
  const goToLast = () => setCurrentPage(totalPages);
  const goToPrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const goToNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handlePokemonClick = (pokemon: Pokemon) => {
    setSelectedPokemon(pokemon);
  };

  const handleCloseModal = () => {
    setSelectedPokemon(null);
  };

  return (
    <>
      <LogoutButton onLogout={handleLogout} />
      <main className="min-h-screen bg-gray-100 px-6 py-8 flex flex-col items-center">
        <Title />

        {/* Wrapper for search + filters */}
        <div className="flex w-full max-w-5xl items-center gap-4 mt-8 mb-6">
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          <FilterBar
            selectedType={selectedType}
            selectedGen={selectedGen}
            onTypeChange={setSelectedType}
            onGenChange={setSelectedGen}
          />
        </div>

        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onFirst={goToFirst}
          onPrev={goToPrev}
          onNext={goToNext}
          onLast={goToLast}
          hasResults={results.length > 0}
        />

        <PokemonGrid
          results={results}
          loading={loading}
          error={error}
          onPokemonClick={handlePokemonClick}
        />

        <InfoModal pokemon={selectedPokemon} onClose={handleCloseModal} />
      </main>
    </>
  );
}
