import { useState, useEffect } from "react";
import { X, ArrowLeft, Heart, Zap, Shield, Swords, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useEvolution } from "@/hooks/useEvolution";

import axios from "axios";

interface PokemonDetail {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    front_shiny: string;
    other: {
      'official-artwork': {
        front_default: string;
        front_shiny: string;
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
  stats: Array<{
    base_stat: number;
    stat: {
      name: string;
    };
  }>;
  abilities: Array<{
    ability: {
      name: string;
    };
    is_hidden: boolean;
  }>;
  species: {
    url: string;
  };
}

interface Species {
  flavor_text_entries: Array<{
    flavor_text: string;
    language: {
      name: string;
    };
  }>;
  evolution_chain: {
    url: string;
  };
  generation: {
    name: string;
  };
}

interface PokemonDetailProps {
  pokemonId: number;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
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

const statNames: Record<string, string> = {
  hp: "HP",
  attack: "Attack",
  defense: "Defense",
  "special-attack": "Sp. Atk",
  "special-defense": "Sp. Def",
  speed: "Speed"
};

const statIcons: Record<string, any> = {
  hp: Heart,
  attack: Swords,
  defense: Shield,
  "special-attack": Zap,
  "special-defense": Shield,
  speed: Zap
};

export function PokemonDetail({ pokemonId, onClose, isFavorite, onToggleFavorite }: PokemonDetailProps) {
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [species, setSpecies] = useState<Species | null>(null);
  const [loading, setLoading] = useState(true);
  const [showShiny, setShowShiny] = useState(false);
  
  // Use evolution hook
  const { evolutionChain, loading: evolutionLoading } = useEvolution(species?.evolution_chain?.url);

  useEffect(() => {
    const fetchPokemonDetail = async () => {
      try {
        setLoading(true);
        const [pokemonResponse, speciesResponse] = await Promise.all([
          axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`),
          axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`)
        ]);
        
        setPokemon(pokemonResponse.data);
        setSpecies(speciesResponse.data);
      } catch (error) {
        console.error('Error fetching Pokemon details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemonDetail();
  }, [pokemonId]);

  if (loading || !pokemon) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <Card className="p-8 bg-gradient-metal">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
            <span className="text-lg font-display">Loading Pokémon data...</span>
          </div>
        </Card>
      </div>
    );
  }

  const getFlavorText = () => {
    if (!species) return "No description available.";
    const englishEntry = species.flavor_text_entries.find(entry => entry.language.name === 'en');
    return englishEntry?.flavor_text.replace(/\f/g, ' ').replace(/\n/g, ' ') || "No description available.";
  };

  const getImageUrl = () => {
    const artwork = showShiny 
      ? pokemon.sprites.other?.['official-artwork']?.front_shiny
      : pokemon.sprites.other?.['official-artwork']?.front_default;
    
    if (artwork) return artwork;
    
    return showShiny ? pokemon.sprites.front_shiny : pokemon.sprites.front_default;
  };

  const maxStat = Math.max(...pokemon.stats.map(stat => stat.base_stat));

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 overflow-auto">
      <div className="min-h-screen p-4 flex items-start justify-center">
        <Card className="w-full max-w-4xl bg-gradient-metal border-border/50 animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border/50">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={onClose}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-display font-bold capitalize">{pokemon.name}</h1>
                <p className="text-sm text-muted-foreground">#{pokemon.id.toString().padStart(3, '0')}</p>
              </div>
            </div>
            <Button
              variant={isFavorite ? "default" : "outline"}
              size="sm"
              onClick={() => onToggleFavorite(pokemon.id)}
              className={cn(isFavorite && "bg-gradient-primary")}
            >
              <Heart className={cn("h-4 w-4 mr-2", isFavorite && "fill-current")} />
              {isFavorite ? "Favorited" : "Add to Favorites"}
            </Button>
          </div>

          <div className="p-6">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left Column - Image & Basic Info */}
              <div className="space-y-6">
                {/* Pokemon Image */}
                <div className="flex justify-center">
                  <div className="relative w-full max-w-sm">
                    <div className="w-full h-64 rounded-xl overflow-hidden bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                      <img
                        src={getImageUrl()}
                        alt={pokemon.name}
                        className="max-w-full max-h-full object-contain transition-transform hover:scale-105"
                      />
                    </div>
                    {pokemon.sprites.front_shiny && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowShiny(!showShiny)}
                        className="absolute bottom-2 right-2 z-10"
                      >
                        {showShiny ? "Normal" : "Shiny"}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4 bg-gradient-screen border-border/50">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-foreground">{(pokemon.height / 10).toFixed(1)}m</div>
                      <div className="text-sm text-muted-foreground">Height</div>
                    </div>
                  </Card>
                  <Card className="p-4 bg-gradient-screen border-border/50">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-foreground">{(pokemon.weight / 10).toFixed(1)}kg</div>
                      <div className="text-sm text-muted-foreground">Weight</div>
                    </div>
                  </Card>
                </div>

                {/* Types */}
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-semibold">Type</h3>
                  <div className="flex justify-center gap-2">
                    {pokemon.types.map((type) => (
                      <Badge
                        key={type.type.name}
                        className={cn(
                          "px-4 py-2 text-white font-medium capitalize border-0",
                          typeColors[type.type.name] || "bg-muted"
                        )}
                      >
                        {type.type.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">{getFlavorText()}</p>
                </div>
              </div>

              {/* Right Column - Detailed Stats */}
              <div className="space-y-6">
                <Tabs defaultValue="stats" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="stats">Stats</TabsTrigger>
                    <TabsTrigger value="abilities">Abilities</TabsTrigger>
                    <TabsTrigger value="evolution">Evolution</TabsTrigger>
                  </TabsList>

                  <TabsContent value="stats" className="space-y-4">
                    <h3 className="text-lg font-semibold">Base Stats</h3>
                    <div className="space-y-4">
                      {pokemon.stats.map((stat) => {
                        const StatIcon = statIcons[stat.stat.name] || Zap;
                        const percentage = (stat.base_stat / maxStat) * 100;
                        
                        return (
                          <div key={stat.stat.name} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <StatIcon className="h-4 w-4 text-secondary" />
                                <span className="font-medium">{statNames[stat.stat.name]}</span>
                              </div>
                              <span className="font-bold text-secondary">{stat.base_stat}</span>
                            </div>
                            <Progress value={percentage} className="h-2" />
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Total Stats */}
                    <div className="pt-4 border-t border-border/50">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Total</span>
                        <span className="text-xl font-bold text-secondary">
                          {pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0)}
                        </span>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="abilities" className="space-y-4">
                    <h3 className="text-lg font-semibold">Abilities</h3>
                    <div className="space-y-3">
                      {pokemon.abilities.map((ability, index) => (
                        <Card key={index} className="p-4 bg-gradient-screen border-border/50">
                          <div className="flex items-center justify-between">
                            <span className="font-medium capitalize">
                              {ability.ability.name.replace('-', ' ')}
                            </span>
                            {ability.is_hidden && (
                              <Badge variant="secondary" className="text-xs">
                                Hidden
                              </Badge>
                            )}
                          </div>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="evolution" className="space-y-4">
                    <h3 className="text-lg font-semibold">Evolution Chain</h3>
                    {evolutionLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="w-6 h-6 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
                        <span className="ml-2 text-muted-foreground">Loading evolution data...</span>
                      </div>
                    ) : evolutionChain.length > 1 ? (
                      <div className="space-y-4">
                        <div className="flex flex-wrap items-center justify-center gap-4">
                          {evolutionChain.map((stage, index) => (
                            <div key={stage.id} className="flex items-center">
                              <div className="text-center">
                                <Card className="p-3 bg-gradient-screen border-border/50 hover:border-secondary/50 transition-colors">
                                  <div className="w-20 h-20 mx-auto mb-2 flex items-center justify-center">
                                    <img
                                      src={stage.sprite}
                                      alt={stage.name}
                                      className="max-w-full max-h-full object-contain"
                                    />
                                  </div>
                                  <p className="text-sm font-medium capitalize">{stage.name}</p>
                                  <p className="text-xs text-muted-foreground">#{stage.id.toString().padStart(3, '0')}</p>
                                   {stage.evolutionDetails && (
                                     <div className="mt-1 text-xs text-foreground font-medium">
                                       {stage.evolutionDetails.minLevel && `Lv. ${stage.evolutionDetails.minLevel}`}
                                       {stage.evolutionDetails.item && stage.evolutionDetails.item.replace('-', ' ')}
                                     </div>
                                   )}
                                </Card>
                              </div>
                              {index < evolutionChain.length - 1 && (
                                <ArrowRight className="h-5 w-5 text-muted-foreground mx-2" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">This Pokémon doesn't evolve.</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}