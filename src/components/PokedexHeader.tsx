import { Search, Filter, Shuffle, Heart, Grid3X3, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "./ThemeToggle";
import { NavigationMenu } from "./NavigationMenu";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface PokedexHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedType: string;
  onTypeChange: (value: string) => void;
  selectedGeneration: string;
  onGenerationChange: (value: string) => void;
  selectedGame: string;
  onGameChange: (value: string) => void;
  onRandomPokemon: () => void;
  showFavorites: boolean;
  onToggleFavorites: () => void;
  favoritesCount: number;
}

const pokemonTypes = [
  "all", "normal", "fire", "water", "electric", "grass", "ice", "fighting",
  "poison", "ground", "flying", "psychic", "bug", "rock", "ghost", "dragon",
  "dark", "steel", "fairy"
];

const generations = [
  { value: "all", label: "All Generations" },
  { value: "1", label: "Gen I" },
  { value: "2", label: "Gen II" },
  { value: "3", label: "Gen III" },
  { value: "4", label: "Gen IV" },
  { value: "5", label: "Gen V" },
  { value: "6", label: "Gen VI" },
  { value: "7", label: "Gen VII" },
  { value: "8", label: "Gen VIII" },
  { value: "9", label: "Gen IX" },
];

const games = [
  { value: "all", label: "All Games" },
  { value: "red-blue", label: "Red & Blue" },
  { value: "yellow", label: "Yellow" },
  { value: "gold-silver", label: "Gold & Silver" },
  { value: "crystal", label: "Crystal" },
  { value: "ruby-sapphire", label: "Ruby & Sapphire" },
  { value: "emerald", label: "Emerald" },
  { value: "diamond-pearl", label: "Diamond & Pearl" },
  { value: "platinum", label: "Platinum" },
  { value: "black-white", label: "Black & White" },
  { value: "black2-white2", label: "Black 2 & White 2" },
  { value: "x-y", label: "X & Y" },
  { value: "sun-moon", label: "Sun & Moon" },
  { value: "sword-shield", label: "Sword & Shield" },
  { value: "scarlet-violet", label: "Scarlet & Violet" },
];

export function PokedexHeader({
  searchTerm,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedGeneration,
  onGenerationChange,
  selectedGame,
  onGameChange,
  onRandomPokemon,
  showFavorites,
  onToggleFavorites,
  favoritesCount
}: PokedexHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-6">
        {/* Top Bar - Logo and Actions */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Grid3X3 className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Pokédex</h1>
              <p className="text-sm text-muted-foreground">Gotta catch 'em all</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <NavigationMenu />
            <ThemeToggle />
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search Pokémon by name or number..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-12 text-base"
          />
        </div>

        {/* Filters and Actions */}
        <div className="space-y-4">
          {/* Primary Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant={showFavorites ? "default" : "outline"}
              onClick={onToggleFavorites}
              className="h-10"
            >
              <Heart className={cn("h-4 w-4 mr-2", showFavorites && "fill-current")} />
              Favorites
              {favoritesCount > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-2 text-xs">
                  {favoritesCount}
                </Badge>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={onRandomPokemon}
              className="h-10"
            >
              <Shuffle className="h-4 w-4 mr-2" />
              Random
            </Button>
          </div>

          <Separator />

          {/* Filter Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <Select value={selectedType} onValueChange={onTypeChange}>
              <SelectTrigger className="h-10">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                {pokemonTypes.map((type) => (
                  <SelectItem key={type} value={type} className="capitalize">
                    {type === "all" ? "All Types" : type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedGeneration} onValueChange={onGenerationChange}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="All Generations" />
              </SelectTrigger>
              <SelectContent>
                {generations.map((gen) => (
                  <SelectItem key={gen.value} value={gen.value}>
                    {gen.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedGame} onValueChange={onGameChange}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="All Games" />
              </SelectTrigger>
              <SelectContent>
                {games.map((game) => (
                  <SelectItem key={game.value} value={game.value}>
                    {game.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </header>
  );
}