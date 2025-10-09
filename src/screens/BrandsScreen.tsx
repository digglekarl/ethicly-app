import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, TextInput, ActivityIndicator, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../styles/colors';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import useSearchStore, { EthicalScoreResponse } from '../store/searchStore';
import { ethicalScoreUserPrompt } from '../api/ethicalScoreUserPrompt';
import { ethicalScoreSystemPrompt } from '../api/ethicalScoreSystemPrompt';
import { getEthicalScore } from '../api/groqSystemPrompt';

import boycottedBrandsData from '../data/02_Boycotted_brands.json';

interface BoycottedBrand {
    'Brand / Company': string;
    'Boycott / Campaign': string;
    'Sector': string;
    'Reason': string;
}

// It's best practice to move these types to a central file (e.g., navigation/types.ts)
type BrandsStackParamList = {
    Brands: undefined;
    BrandDetails: { brandName: string };
    MerchantDetails: { merchant: { name: string; ethicalScore: EthicalScoreResponse | string; logo?: string } };
    MovementDetails: { movementName: string };
};

type BrandsScreenNavigationProp = NativeStackNavigationProp<
    BrandsStackParamList,
    'Brands'
>;

export default function BrandsScreen({ navigation }: { navigation: BrandsScreenNavigationProp }) {
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [searchQuery, setSearchQuery] = useState<string>('');
  const [loadingBrand, setLoadingBrand] = useState<string | null>(null);
    
    // Get unique sectors from the boycotted brands data
    const categories = useMemo(() => {
        const sectors = [...new Set(boycottedBrandsData.map(brand => brand.Sector))];
        return ['All', ...sectors.sort()];
    }, []);

  const handleBrandPress = async (brand: BoycottedBrand) => {
    const brandName = brand['Brand / Company'];
    try {
      setLoadingBrand(brandName);

      // Check cache first
      const cached = useSearchStore.getState().searchCache[brandName];
      let scoreResponse: EthicalScoreResponse | null = null;

      if (cached) {
        scoreResponse = cached;
      } else {
        // Build prompt and fetch from Groq
        const userPrompt = ethicalScoreUserPrompt.replace('{searchTerm}', brandName);
        const prompt = `${ethicalScoreSystemPrompt}\n${userPrompt}`;
        const rawResponse = await getEthicalScore(prompt);

        // try to extract json block if present
        const jsonMatch = rawResponse && rawResponse.match ? rawResponse.match(/```json\s*([\s\S]*?)\s*```/) : null;
        const jsonString = jsonMatch ? jsonMatch[1] : (rawResponse && typeof rawResponse === 'string' ? rawResponse.substring(rawResponse.indexOf('{'), rawResponse.lastIndexOf('}') + 1) : null);
                if (!jsonString) throw new Error('Unable to parse ethical score response');
                const parsed = JSON.parse(jsonString) as EthicalScoreResponse;
                if (!parsed) throw new Error('Parsed ethical score is empty');
                scoreResponse = parsed;
                useSearchStore.getState().addSearch(brandName, parsed);
      }

      // Navigate to MerchantDetails with the fetched score
      navigation.navigate('MerchantDetails', {
        merchant: {
          name: brandName,
          ethicalScore: scoreResponse as EthicalScoreResponse,
          logo: '',
        }
      });
    } catch (e) {
      console.warn('Error fetching ethical score for', brand['Brand / Company'], e);
      Alert.alert('Error', `Failed to fetch ethical score for ${brand['Brand / Company']}.`);
    } finally {
      setLoadingBrand(null);
    }
  };

    const getFilteredBrands = useMemo(() => {
        let filtered = boycottedBrandsData;
        
        // Filter by category
        if (selectedCategory !== 'All') {
            filtered = filtered.filter(brand => brand.Sector === selectedCategory);
        }
        
        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(brand => 
                brand['Brand / Company'].toLowerCase().includes(query) ||
                brand['Boycott / Campaign'].toLowerCase().includes(query) ||
                brand.Reason.toLowerCase().includes(query)
            );
        }
        
        // Remove duplicates by brand name
        const uniqueBrands = filtered.reduce((acc, current) => {
            const existingBrand = acc.find(brand => brand['Brand / Company'] === current['Brand / Company']);
            if (!existingBrand) {
                acc.push(current);
            }
            return acc;
        }, [] as BoycottedBrand[]);
        
        return uniqueBrands.sort((a, b) => a['Brand / Company'].localeCompare(b['Brand / Company']));
    }, [selectedCategory, searchQuery]);

    const renderSearchBar = () => (
        <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color={COLORS.sage} style={styles.searchIcon} />
            <TextInput
                style={styles.searchInput}
                placeholder="Search brands, campaigns, or reasons..."
                placeholderTextColor={COLORS.sage}
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
                    <Ionicons name="close-circle" size={20} color={COLORS.sage} />
                </TouchableOpacity>
            )}
        </View>
    );

    const renderCategoryFilter = () => (
        <View style={styles.filterContainer}>
            <FlatList
                data={categories}
                keyExtractor={item => item}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[
                            styles.filterChip,
                            selectedCategory === item && styles.activeFilterChip
                        ]}
                        onPress={() => setSelectedCategory(item)}
                    >
                        <Text style={[
                            styles.filterText,
                            selectedCategory === item && styles.activeFilterText
                        ]}>
                            {item}
                        </Text>
                    </TouchableOpacity>
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 8 }}
            />
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.header}>Boycotted Brands</Text>
            </View>
            {renderSearchBar()}
            {renderCategoryFilter()}
            <FlatList
                data={getFilteredBrands}
                keyExtractor={(item, index) => `${item['Brand / Company']}-${index}`}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleBrandPress(item)}>
                        <View style={styles.brandCard}>
                            <View style={styles.brandHeader}>
                                <View style={styles.brandIcon}>
                                    <Ionicons name="warning" size={20} color={COLORS.lightCoral} />
                                </View>
                                <View style={styles.brandInfo}>
                                    <Text style={styles.brandName}>{item['Brand / Company']}</Text>
                                    <Text style={styles.brandSector}>{item.Sector}</Text>
                                </View>
                {loadingBrand === item['Brand / Company'] ? (
                  <ActivityIndicator size="small" color={COLORS.sage} />
                ) : (
                  <Ionicons name="chevron-forward" size={20} color={COLORS.sage} />
                )}
                            </View>
                            <View style={styles.brandDetails}>
                                <Text style={styles.campaignText}>{item['Boycott / Campaign']}</Text>
                                <Text style={styles.reasonText} numberOfLines={2}>{item.Reason}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
                contentContainerStyle={{ paddingBottom: 40 }}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No brands found!</Text>
                        <Text style={styles.emptySubText}>Try adjusting your search or category filter.</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.lavenderBlush, paddingTop: 40 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, marginTop: 16, paddingHorizontal: 16, justifyContent: 'center' },
  header: { fontSize: 24, fontWeight: 'bold', color: COLORS.darkText, textAlign: 'center' },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    paddingHorizontal: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.darkText,
  },
  clearButton: {
    padding: 4,
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterChip: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.sage,
  },
  activeFilterChip: {
    backgroundColor: COLORS.sage,
  },
  filterText: {
    fontSize: 14,
    color: COLORS.sage,
    fontWeight: '500',
  },
  activeFilterText: {
    color: COLORS.white,
  },
  brandCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  brandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  brandIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.lavenderBlush,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  brandInfo: {
    flex: 1,
  },
  brandName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.darkText,
    marginBottom: 2,
  },
  brandSector: {
    fontSize: 14,
    color: COLORS.sage,
  },
  brandDetails: {
    paddingLeft: 52,
  },
  campaignText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.lightCoral,
    marginBottom: 4,
  },
  reasonText: {
    fontSize: 13,
    color: COLORS.darkText,
    lineHeight: 18,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.darkText,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 16,
    color: COLORS.darkText,
    textAlign: 'center',
    marginTop: 8,
  },
});
