
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { COLORS } from '../styles/colors';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import allCategoriesData from '../data/all_categories.json';

// Optionally, you can add images for each category here or in the JSON
const categoryImages: Record<string, string> = {
  'Food and Drink': 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=200',
  'Fashion and Apparel': 'https://images.pexels.com/photos/994523/pexels-photo-994523.jpeg?auto=compress&cs=tinysrgb&w=200',
  'Beauty and Personal Care': 'https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=200',
  'Electronics': 'https://images.pexels.com/photos/4005593/pexels-photo-4005593.jpeg?auto=compress&cs=tinysrgb&w=200',
  'Household': 'https://images.pexels.com/photos/1259332/pexels-photo-1259332.jpeg?auto=compress&cs=tinysrgb&w=200',
  'Toys and Games': 'https://images.pexels.com/photos/3661352/pexels-photo-3661352.jpeg?auto=compress&cs=tinysrgb&w=200',
  'Sports and Fitness': 'https://images.pexels.com/photos/2294361/pexels-photo-2294361.jpeg?auto=compress&cs=tinysrgb&w=200',
  'DIY and Hardware': 'https://images.pexels.com/photos/209230/pexels-photo-209230.jpeg?auto=compress&cs=tinysrgb&w=200',
  'Baby and Child': 'https://images.pexels.com/photos/377058/pexels-photo-377058.jpeg?auto=compress&cs=tinysrgb&w=200',
  'Health': 'https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?auto=compress&cs=tinysrgb&w=200',
};

type CategoryStackParamList = {
    CategoriesList: undefined;
    CategoryDetails: { categoryName: string };
};

type CategoriesScreenNavigationProp = NativeStackNavigationProp<
    CategoryStackParamList,
    'CategoriesList'
>;

export default function CategoriesScreen({ navigation }: { navigation: CategoriesScreenNavigationProp }) {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    // Load categories from JSON
    setCategories(allCategoriesData);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Categories</Text>
      </View>
      <FlatList
        data={categories}
        keyExtractor={item => item.category}
        numColumns={2}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.categoryTile} onPress={() => navigation.navigate('CategoryDetails', { categoryName: item.category })}>
            <Image source={{ uri: categoryImages[item.category] || categoryImages['Food and Drink'] }} style={styles.categoryImage} />
            <View style={styles.categoryNameContainer}>
                <Text style={styles.categoryName}>{item.category}</Text>
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
