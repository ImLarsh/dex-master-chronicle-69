import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
  types: Array<{
    type: {
      name: string;
    };
  }>;
  height: number;
  weight: number;
}

interface PokemonCardProps {
  pokemon: Pokemon;
  onSelect: (pokemon: Pokemon) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (id: number) => void;
}

const typeColors: Record<string, string> = {
  normal: "bg-muted",
  fire: "bg-gradient-to-r from-red-500 to-orange-500",
  water: "bg-gradient-to-r from-blue-500 to-cyan-500",
  electric: "bg-gradient-to-r from-yellow-400 to-yellow-600",
  grass: "bg-gradient-to-r from-green-400 to-green-600",
  ice: "bg-gradient-to-r from-cyan-300 to-blue-300",
  fighting: "bg-gradient-to-r from-red-600 to-red-800",
  poison: "bg-gradient-to-r from-purple-500 to-purple-700",
  ground: "bg-gradient-to-r from-yellow-600 to-amber-600",
  flying: "bg-gradient-to-r from-indigo-400 to-sky-400",
  psychic: "bg-gradient-to-r from-pink-500 to-rose-500",
  bug: "bg-gradient-to-r from-lime-500 to-green-500",
  rock: "bg-gradient-to-r from-amber-600 to-yellow-700",
  ghost: "bg-gradient-to-r from-purple-600 to-indigo-600",
  dragon: "bg-gradient-to-r from-indigo-600 to-purple-600",
  dark: "bg-gradient-to-r from-gray-700 to-gray-900",
  steel: "bg-gradient-to-r from-slate-500 to-slate-700",
  fairy: "bg-gradient-to-r from-pink-400 to-rose-400",
};

export function PokemonCard({ pokemon, onSelect, isFavorite = false, onToggleFavorite }: PokemonCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite?.(pokemon.id);
  };

  const getImageUrl = () => {
    if (pokemon.sprites.other?.['official-artwork']?.front_default) {
      return pokemon.sprites.other['official-artwork'].front_default;
    }
    return pokemon.sprites.front_default;
  };

  return (
    <Card
      className={cn(
        "relative group cursor-pointer transition-all duration-200 hover:scale-[1.02]",
        "border hover:shadow-lg hover:shadow-primary/5"
      )}
      onClick={() => onSelect(pokemon)}
    >
      {/* Favorite Button */}
      {onToggleFavorite && (
        <button
          onClick={handleToggleFavorite}
          className={cn(
            "absolute top-3 right-3 z-10 p-1.5 rounded-full transition-colors bg-background/80 backdrop-blur-sm",
            "hover:bg-background",
            isFavorite ? "text-red-500" : "text-muted-foreground"
          )}
        >
          <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
        </button>
      )}

      <div className="p-4 space-y-4">
        {/* Pokémon Number */}
        <div className="text-xs font-mono text-muted-foreground font-medium">
          #{pokemon.id.toString().padStart(3, '0')}
        </div>

        {/* Pokémon Image */}
        <div className="flex justify-center">
          <div className="relative w-24 h-24 flex items-center justify-center bg-muted/30 rounded-xl">
            {!imageError ? (
              <img
                src={getImageUrl()}
                alt={pokemon.name}
                className={cn(
                  "max-w-full max-h-full object-contain transition-opacity duration-300",
                  imageLoaded ? "opacity-100" : "opacity-0"
                )}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
              />
            ) : (
              <Star className="h-8 w-8 text-muted-foreground" />
            )}
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
              </div>
            )}
          </div>
        </div>

        {/* Pokémon Name */}
        <h3 className="text-lg font-semibold text-center capitalize">
          {pokemon.name}
        </h3>

        {/* Types */}
        <div className="flex justify-center gap-1.5 flex-wrap">
          {pokemon.types.map((type) => (
            <Badge
              key={type.type.name}
              variant="secondary"
              className={cn(
                "text-xs px-2.5 py-1 capitalize font-medium",
                typeColors[type.type.name] || "bg-muted"
              )}
            >
              {type.type.name}
            </Badge>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t">
          <div className="text-center">
            <div className="text-xs text-muted-foreground font-medium">Height</div>
            <div className="text-sm font-semibold text-foreground">{(pokemon.height / 10).toFixed(1)}m</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground font-medium">Weight</div>
            <div className="text-sm font-semibold text-foreground">{(pokemon.weight / 10).toFixed(1)}kg</div>
          </div>
        </div>
      </div>
    </Card>
  );
}