export type PokemonSummary = {
  name: string;
  url: string;
};

export interface PokemonAPIResponse {
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
  height: number;
  weight: number;
  abilities: Array<{ ability: { name: string } }>;
  stats: Array<{ base_stat: number; stat: { name: string } }>;
}

export type Pokemon = {
  name: string;
  image: string | null;
  type: string[];
  id: number;
  height: number;
  weight: number;
  abilities: string[];
  stats: { name: string; value: number }[];
};
