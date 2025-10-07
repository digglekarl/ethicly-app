import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { COLORS } from '../styles/colors';
import movementsData from '../data/01_Movements.json';

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

export default function MovementDetailsScreen() {
  const navigation = useNavigation<NativeStackScreenProps<RootStackParamList, 'MovementDetails'>['navigation']>();
  const route = useRoute<NativeStackScreenProps<RootStackParamList, 'MovementDetails'>['route']>();
  const { movementName } = route.params;
  
  // Find the movement by name
  const movement = movementsData.find(m => {
    const campaignName = m['Movement / Boycott Campaign'];
    return campaignName && movementName && 
           campaignName.toLowerCase() === movementName.toLowerCase();
  });
  
  // If movement not found, show error
  if (!movement) {
    return (
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color="#222" />
          </TouchableOpacity>
          <Text style={styles.header}>Movement Not Found</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Movement "{movementName}" not found</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const openUrl = async (url: string) => {
    if (!url) return;
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.log(`Don't know how to open this URL: ${url}`);
    }
  };

  const getTargetBrandsList = (targetBrands: string): string[] => {
    if (!targetBrands || targetBrands.trim() === '') return [];
    return targetBrands.split(',').map(brand => brand.trim()).filter(brand => brand.length > 0);
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#222" />
        </TouchableOpacity>
        <Text style={styles.header}>{movement['Movement / Boycott Campaign']}</Text>
      </View>
      
      <View style={styles.detailsContainer}>
        <View style={styles.categoryContainer}>
          {(movement.Categories || '').split(', ').filter(cat => cat.trim()).map((category, index) => (
            <View key={index} style={styles.categoryChip}>
              <Text style={styles.categoryText}>{category.trim()}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>overview</Text>
        <View style={styles.overviewCard}>
          <View style={styles.overviewHeader}>
            <Ionicons name="information-circle" size={16} color={COLORS.resedaGreen} />
            <Text style={styles.overviewLabel}>Campaign Overview</Text>
          </View>
          <Text style={styles.overviewText}>{movement.Overview || 'No overview available'}</Text>
        </View>

        <Text style={styles.sectionTitle}>target brands & companies</Text>
        <View style={styles.brandsContainer}>
          {getTargetBrandsList(movement['Target Brands / Companies'] || '').map((brand, index) => (
            <View key={index} style={styles.brandChip}>
              <Text style={styles.brandText}>{brand}</Text>
            </View>
          ))}
        </View>

        {movement['Read More'] && (
          <View style={styles.sourceContainer}>
            <Text style={styles.sectionTitle}>Learn More</Text>
            <TouchableOpacity onPress={() => openUrl(movement['Read More']!)}>
              <View style={styles.sourceButton}>
                <Ionicons name="link" size={20} color={COLORS.sage} />
                <Text style={styles.sourceLink}>Read More</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.lavenderBlush },
  scrollContent: {
    paddingTop: 40,
    paddingBottom: 100, // Extra padding at bottom to ensure content is fully scrollable
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, marginTop: 16, paddingHorizontal: 16 },
  header: { fontSize: 24, fontWeight: 'bold', color: COLORS.darkText, flex: 1, textAlign: 'center', marginRight: 28 },
  detailsContainer: { paddingHorizontal: 16 },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  categoryChip: {
    backgroundColor: COLORS.sage,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 14,
    color: COLORS.white,
    fontWeight: '500',
  },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.darkText, marginTop: 16, marginBottom: 8 },
  overviewCard: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  overviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  overviewLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.resedaGreen,
    marginLeft: 8,
  },
  overviewText: {
    fontSize: 15,
    color: COLORS.darkText,
    lineHeight: 22,
  },
  description: { fontSize: 16, color: COLORS.darkText, marginBottom: 12, lineHeight: 24 },
  brandsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  brandChip: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.lightCoral,
  },
  brandText: {
    fontSize: 14,
    color: COLORS.lightCoral,
    fontWeight: '500',
  },
  sourceContainer: {
    marginTop: 16,
  },
  sourceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.sage,
  },
  sourceLink: { 
    fontSize: 16, 
    color: COLORS.sage, 
    marginLeft: 8,
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  errorText: {
    fontSize: 18,
    color: COLORS.lightCoral,
    textAlign: 'center',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: COLORS.sage,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '500',
  },
});
