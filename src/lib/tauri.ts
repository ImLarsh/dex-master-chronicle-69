import { invoke } from '@tauri-apps/api/tauri';

// Check if we're running in Tauri
export const isTauri = () => {
  return typeof window !== 'undefined' && (window as any).__TAURI__;
};

// Save Pokemon data to local file system (Tauri only)
export const savePokemonDataToFile = async (data: any[]): Promise<void> => {
  if (!isTauri()) return;
  
  try {
    await invoke('save_pokemon_data', { data: JSON.stringify(data) });
    console.log('Pokemon data saved to local file');
  } catch (error) {
    console.error('Failed to save Pokemon data:', error);
  }
};

// Load Pokemon data from local file system (Tauri only)
export const loadPokemonDataFromFile = async (): Promise<any[] | null> => {
  if (!isTauri()) return null;
  
  try {
    const data = await invoke<string>('load_pokemon_data');
    if (data) {
      return JSON.parse(data);
    }
    return null;
  } catch (error) {
    console.error('Failed to load Pokemon data:', error);
    return null;
  }
};

// Save favorites to local file system (Tauri only)
export const saveFavoritesToFile = async (favorites: number[]): Promise<void> => {
  if (!isTauri()) return;
  
  try {
    await invoke('save_favorites', { favorites: JSON.stringify(favorites) });
    console.log('Favorites saved to local file');
  } catch (error) {
    console.error('Failed to save favorites:', error);
  }
};

// Load favorites from local file system (Tauri only)
export const loadFavoritesFromFile = async (): Promise<number[]> => {
  if (!isTauri()) return [];
  
  try {
    const data = await invoke<string>('load_favorites');
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to load favorites:', error);
    return [];
  }
};