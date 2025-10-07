
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { COLORS } from '../styles/colors';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { categories } from '../data/categories';

// Category images mapping for the new categories
const categoryImages: Record<string, string> = {
  'Food & Drink': 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=200',
  'Fashion & Apparel': 'https://images.pexels.com/photos/994523/pexels-photo-994523.jpeg?auto=compress&cs=tinysrgb&w=200',
  'Personal Care & Beauty': 'https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=200',
  'Electronics & Tech': 'https://images.pexels.com/photos/4005593/pexels-photo-4005593.jpeg?auto=compress&cs=tinysrgb&w=200',
  'Household': 'https://images.pexels.com/photos/1259332/pexels-photo-1259332.jpeg?auto=compress&cs=tinysrgb&w=200',
  'Supermarkets & Retail': 'https://images.pexels.com/photos/2068975/pexels-photo-2068975.jpeg?auto=compress&cs=tinysrgb&w=200',
  'Travel & Transport': 'https://images.pexels.com/photos/2294361/pexels-photo-2294361.jpeg?auto=compress&cs=tinysrgb&w=200',
  'Finance & Insurance': 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=200',
  'Energy & Utilities': 'https://images.pexels.com/photos/433308/pexels-photo-433308.jpeg?auto=compress&cs=tinysrgb&w=200',
  'Raw Materials & Industrial': 'https://images.pexels.com/photos/209230/pexels-photo-209230.jpeg?auto=compress&cs=tinysrgb&w=200',
  'Property & Facilities': 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=200',
  'Arts, Culture & Leisure': 'https://images.pexels.com/photos/3661352/pexels-photo-3661352.jpeg?auto=compress&cs=tinysrgb&w=200',
  'E-commerce & Retail': 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=200',
  'Foodservice & Hospitality': 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=200',
  'Automotive': 'https://images.pexels.com/photos/120049/pexels-photo-120049.jpeg?auto=compress&cs=tinysrgb&w=200',
};

type CategoryStackParamList = {
    CategoriesList: undefined;
    Subcategories: { categoryName: string };
    CategoryDetails: { categoryName: string; subcategoryName: string };
};

type CategoriesScreenNavigationProp = NativeStackNavigationProp<
    CategoryStackParamList,
    'CategoriesList'
>;

export default function CategoriesScreen({ navigation }: { navigation: CategoriesScreenNavigationProp }) {
  const [categoryData, setCategoryData] = useState<any[]>([]);

  useEffect(() => {
    // Load categories from categories.ts
    setCategoryData(categories);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Categories</Text>
      </View>
      <FlatList
        data={categoryData}
        keyExtractor={item => item.name}
        numColumns={2}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.categoryTile} onPress={() => navigation.navigate('Subcategories', { categoryName: item.name })}>
            <Image source={{ uri: categoryImages[item.name] || categoryImages['Food & Drink'] }} style={styles.categoryImage} />
            <View style={styles.categoryNameContainer}>
                <Text style={styles.categoryName}>{item.name}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.lavenderBlush, paddingTop: 40 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginTop: 16, marginBottom: 16, paddingHorizontal: 16, justifyContent: 'center' },
  header: { fontSize: 24, fontWeight: 'bold', color: COLORS.darkText, textAlign: 'center' },
  categoryTile: {
    flex: 1,
    margin: 8,
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: COLORS.sage,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  categoryNameContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 8,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
});
