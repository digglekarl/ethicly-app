import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
// ...existing code...

// Helper to fetch and cache merchant logo
export async function getMerchantLogo(merchantName: string): Promise<string | null> {
  const cacheKey = `merchant_logo_${merchantName.replace(/\s+/g, '').toLowerCase()}`;
  try {
    // Try to get from cache
    const cached = await AsyncStorage.getItem(cacheKey);
    if (cached) return cached;

    // Try Clearbit Logo API
    const domain = merchantName.replace(/\s+/g, '').toLowerCase() + '.com';
    const logoUrl = `https://logo.clearbit.com/${domain}`;
    // Optionally, check if the logo exists (HEAD request)
    const res = await fetch(logoUrl, { method: 'HEAD' });
    if (res.ok) {
      await AsyncStorage.setItem(cacheKey, logoUrl);
      return logoUrl;
    }
    return null;
  } catch {
    return null;
  }
}
import { persist, createJSONStorage } from 'zustand/middleware';

export interface EthicalScoreResponse {
  company_name: string;
  logo_url: string;
  overall_score: number;
  category_scores: { [key: string]: number };
  summary: string;
  positives: { category: string; point: string }[];
  negatives: { category: string; point: string }[];
  details?: { [key: string]: string };
  ethical_alternative?: {
    name: string;
    reason: string;
  };
}

interface SearchCache {
  [searchTerm: string]: EthicalScoreResponse;
}

interface SearchState {
  recentSearches: string[];
  favorites: string[];
  searchCache: SearchCache;
  addSearch: (searchTerm: string, response: EthicalScoreResponse) => void;
  toggleFavorite: (merchantName: string) => void;
  clearAll: () => void;
}

const useSearchStore = create<SearchState>()(
  persist(
    (set, get) => ({
      recentSearches: [],
      favorites: [],
      searchCache: {},
      addSearch: (searchTerm: string, response: EthicalScoreResponse) => {
        const { recentSearches, searchCache } = get();

        // Add new search to cache
        const updatedCache = { ...searchCache, [searchTerm]: response };

        // Add search term to recent searches list (avoiding duplicates)
        const updatedSearches = [
          searchTerm,
          ...recentSearches.filter(s => s !== searchTerm),
        ].slice(0, 10); // Keep only the 10 most recent searches

        set({
          recentSearches: updatedSearches,
          searchCache: updatedCache,
        });
      },
      toggleFavorite: (merchantName: string) => {
        const { favorites } = get();
        const isFavorite = favorites.includes(merchantName);
        const updatedFavorites = isFavorite
          ? favorites.filter(fav => fav !== merchantName)
          : [...favorites, merchantName];
        
        set({ favorites: updatedFavorites });
      },
      clearAll: () => {
        set({
          recentSearches: [],
          favorites: [],
          searchCache: {},
        });
      }
    }),
    {
      name: 'search-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useSearchStore;

