import { pokemonTypes, generations } from "../utils/constants";

interface FilterBarProps {
  selectedType: string | "all";
  selectedGen: string | "all";
  onTypeChange: (type: string) => void;
  onGenChange: (gen: string) => void;
}

export default function FilterBar({
  selectedType,
  selectedGen,
  onTypeChange,
  onGenChange,
}: FilterBarProps) {
  return (
    <div className="flex gap-4 min-w-[300px]">
      {/* Type filter */}
      <select
        className="p-2 border rounded"
        value={selectedType}
        onChange={(e) => onTypeChange(e.target.value)}
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
        onChange={(e) => onGenChange(e.target.value)}
      >
        <option value="all">All Generations</option>
        {generations.map((gen) => (
          <option key={gen.name} value={gen.name}>
            {gen.name}
          </option>
        ))}
      </select>
    </div>
  );
}
