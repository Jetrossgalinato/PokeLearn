type Pokemon = {
  name: string;
  image: string | null;
  type: string[];
};

interface PokemonGridProps {
  results: Pokemon[];
  loading: boolean;
  error: string;
}

export default function PokemonGrid({
  results,
  loading,
  error,
}: PokemonGridProps) {
  return (
    <>
      {error && <p className="text-red-600 mb-4 font-semibold">{error}</p>}
      {loading && (
        <p className="mb-4 text-gray-700 font-semibold">Loading...</p>
      )}

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
    </>
  );
}
