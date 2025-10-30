import Image from "next/image";

export default function Title() {
  return (
    <div className="flex items-center justify-center gap-3">
      <Image
        src="/game.png"
        alt="PokeLearn Logo"
        width={40}
        height={40}
        className="object-contain"
      />
      <h1 className="text-3xl font-extrabold mb-1">
        <span className="text-red-500">Poke</span>
        <span className="text-gray-800">Learn</span>
      </h1>
    </div>
  );
}
