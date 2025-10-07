import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import movementsData from '../data/01_Movements.json';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS } from '../styles/colors';

interface Movement {
    'Movement / Boycott Campaign': string;
    'Target Brands / Companies': string;
    'Categories': string;
    'Overview': string;
    'Read More': string | null;
}

type RootStackParamList = {
    MovementDetails: { movementName: string };
};

export default function MovementsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Get unique categories from the movements data
  const categories = useMemo(() => {
    const categorySet = new Set<string>();
    movementsData.forEach(movement => {
      movement.Categories.split(', ').forEach(cat => categorySet.add(cat.trim()));
    });
    return ['All', ...Array.from(categorySet).sort()];
  }, []);

  const handleMovementPress = (movement: Movement) => {
    navigation.navigate('MovementDetails', { 
      movementName: movement['Movement / Boycott Campaign'] 
    });
  };

  const getFilteredMovements = useMemo(() => {
    let filtered = movementsData;
    
    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(movement => 
        movement.Categories.split(', ').some(cat => cat.trim() === selectedCategory)
      );
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(movement => 
        movement['Movement / Boycott Campaign'].toLowerCase().includes(query) ||
        movement['Target Brands / Companies'].toLowerCase().includes(query) ||
        movement.Overview.toLowerCase().includes(query) ||
        movement.Categories.toLowerCase().includes(query)
      );
    }
    
    return filtered.sort((a, b) => a['Movement / Boycott Campaign'].localeCompare(b['Movement / Boycott Campaign']));
  }, [selectedCategory, searchQuery]);

  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <Ionicons name="search" size={20} color={COLORS.sage} style={styles.searchIcon} />
      <TextInput
        style={styles.searchInput}
        placeholder="Search movements, campaigns, or brands..."
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

  const getTargetBrandsCount = (targetBrands: string): number => {
    return targetBrands.split(',').length;
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Movements</Text>
      </View>
      {renderSearchBar()}
      {renderCategoryFilter()}
      <FlatList
        data={getFilteredMovements}
        keyExtractor={(item, index) => `${item['Movement / Boycott Campaign']}-${index}`}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleMovementPress(item)}>
            <View style={styles.movementCard}>
              <View style={styles.movementHeader}>
                <View style={styles.movementIcon}>
                  <Ionicons name="megaphone" size={20} color={COLORS.resedaGreen} />
                </View>
                <View style={styles.movementInfo}>
                  <Text style={styles.movementName}>{item['Movement / Boycott Campaign']}</Text>
                  <Text style={styles.movementCategories}>{item.Categories}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={COLORS.sage} />
              </View>
              <View style={styles.movementDetails}>
                <Text style={styles.targetCount}>
                  {getTargetBrandsCount(item['Target Brands / Companies'])} Target Brands
                </Text>
                <Text style={styles.overviewText} numberOfLines={2}>{item.Overview}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No movements found!</Text>
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
  movementCard: {
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
  movementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  movementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.lavenderBlush,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  movementInfo: {
    flex: 1,
  },
  movementName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.darkText,
    marginBottom: 2,
  },
  movementCategories: {
    fontSize: 14,
    color: COLORS.sage,
  },
  movementDetails: {
    paddingLeft: 52,
  },
  targetCount: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.resedaGreen,
    marginBottom: 4,
  },
  overviewText: {
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
