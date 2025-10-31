"use client";

import { X } from "lucide-react";
import { Pokemon } from "../utils/types";

interface InfoModalProps {
  pokemon: Pokemon | null;
  onClose: () => void;
}

export default function InfoModal({ pokemon, onClose }: InfoModalProps) {
  if (!pokemon) return null;

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>
        <div className="text-center">
          <h2 className="text-3xl font-bold capitalize mb-4">{pokemon.name}</h2>
          <img
            src={pokemon.image || ""}
            alt={pokemon.name}
            className="mx-auto mb-4 h-48 w-48"
          />
          <div className="flex justify-center gap-2 mb-4">
            {pokemon.type.map((t) => (
              <span
                key={t}
                className="px-3 py-1 rounded-full text-white text-sm"
                style={{ backgroundColor: `var(--color-${t})` }}
              >
                {t}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4 text-left">
            <div>
              <h3 className="font-bold">Height</h3>
              <p>{pokemon.height / 10} m</p>
            </div>
            <div>
              <h3 className="font-bold">Weight</h3>
              <p>{pokemon.weight / 10} kg</p>
            </div>
            <div>
              <h3 className="font-bold">Abilities</h3>
              <ul className="capitalize">
                {pokemon.abilities.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold">Stats</h3>
              <ul>
                {pokemon.stats.map((s) => (
                  <li key={s.name} className="capitalize">
                    {s.name}: {s.value}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
