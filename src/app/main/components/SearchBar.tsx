interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export default function SearchBar({
  searchTerm,
  onSearchChange,
}: SearchBarProps) {
  return (
    <div className="flex-grow border border-red-400 rounded-full overflow-hidden shadow-sm focus-within:shadow-md transition">
      <input
        type="text"
        placeholder="Search Pokémon by name prefix..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full px-4 py-3 outline-none text-gray-800 font-medium rounded-full"
        aria-label="Search Pokémon"
        autoComplete="off"
      />
    </div>
  );
}
