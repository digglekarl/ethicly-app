import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { COLORS } from '../styles/colors';
import boycottedBrandsData from '../data/02_Boycotted_brands.json';

interface BoycottedBrand {
  'Brand / Company': string;
  'Boycott / Campaign': string;
  'Sector': string;
  'Reason': string;
}

type RootStackParamList = {
  BrandDetails: { brandName: string };
};

export default function BrandDetailsScreen() {
  const navigation = useNavigation<NativeStackScreenProps<RootStackParamList, 'BrandDetails'>['navigation']>();
  const route = useRoute<NativeStackScreenProps<RootStackParamList, 'BrandDetails'>['route']>();
  const { brandName } = route.params;

  // Get all boycotts for this brand
  const brandBoycotts = useMemo(() => {
    return boycottedBrandsData.filter(item => item['Brand / Company'] === brandName);
  }, [brandName]);

  // Get unique campaigns
  const campaigns = useMemo(() => {
    const campaignSet = new Set(brandBoycotts.map(item => item['Boycott / Campaign']));
    return Array.from(campaignSet);
  }, [brandBoycotts]);

  // Get brand sector (should be consistent across all entries)
  const brandSector = brandBoycotts[0]?.Sector || 'Unknown';

  if (brandBoycotts.length === 0) {
    return (
      <ScrollView 
        style={styles.container}
        contentContainerStyle={[styles.scrollContent, { flex: 1 }]}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color="#222" />
          </TouchableOpacity>
          <Text style={styles.header}>Brand Not Found</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No information found for this brand.</Text>
        </View>
      </ScrollView>
    );
  }

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
        <Text style={styles.header}>{brandName}</Text>
      </View>
      
      <View style={styles.detailsContainer}>
        {/* Brand Info */}
        {/* <View style={styles.brandInfoContainer}>
          <View style={styles.brandIcon}>
            <Ionicons name="business" size={24} color={COLORS.lightCoral} />
          </View>
          <View style={styles.brandInfo}>
            <Text style={styles.brandName}>{brandName}</Text>
            <View style={styles.sectorChip}>
              <Text style={styles.sectorText}>{brandSector}</Text>
            </View>
          </View>
        </View> */}

        {/* Campaigns */}
        <Text style={styles.sectionTitle}>active boycott campaigns</Text>
        <View style={styles.campaignsContainer}>
          {campaigns.map((campaign, index) => (
            <View key={index} style={styles.campaignChip}>
              <Text style={styles.campaignText}>{campaign}</Text>
            </View>
          ))}
        </View>

        {/* Boycott Reasons */}
        <Text style={styles.sectionTitle}>reasons for boycott</Text>
        {brandBoycotts.map((boycott, index) => (
          <View key={index} style={styles.reasonCard}>
            <View style={styles.reasonHeader}>
              <Ionicons name="warning" size={16} color={COLORS.lightCoral} />
              <Text style={styles.reasonCampaign}>{boycott['Boycott / Campaign']}</Text>
            </View>
            <Text style={styles.reasonText}>{boycott.Reason}</Text>
          </View>
        ))}

        {/* Summary Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{brandBoycotts.length}</Text>
            <Text style={styles.statLabel}>Boycott Entries</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{campaigns.length}</Text>
            <Text style={styles.statLabel}>Active Campaigns</Text>
          </View>
        </View>

        {/* Warning Notice */}
        <View style={styles.warningContainer}>
          <Ionicons name="information-circle" size={20} color={COLORS.sage} />
          <Text style={styles.warningText}>
            This information is based on publicly available data about boycott campaigns. 
            Please research further to make informed decisions about your purchases.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.lavenderBlush,
  },
  scrollContent: {
    paddingTop: 40,
    paddingBottom: 100, // Extra padding at bottom to ensure content is fully scrollable
  },
  headerRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 16, 
    marginTop: 16, 
    paddingHorizontal: 16 
  },
  header: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: COLORS.darkText, 
    flex: 1, 
    textAlign: 'center', 
    marginRight: 28 
  },
  detailsContainer: { 
    paddingHorizontal: 16 
  },
  brandInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  brandIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.lavenderBlush,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  brandInfo: {
    flex: 1,
  },
  brandName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.darkText,
    marginBottom: 4,
  },
  sectorChip: {
    backgroundColor: COLORS.sage,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  sectorText: {
    fontSize: 14,
    color: COLORS.white,
    fontWeight: '500',
  },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: COLORS.darkText, 
    marginTop: 16, 
    marginBottom: 12 
  },
  campaignsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  campaignChip: {
    backgroundColor: COLORS.lightCoral,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  campaignText: {
    fontSize: 14,
    color: COLORS.white,
    fontWeight: '500',
  },
  reasonCard: {
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
  reasonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reasonCampaign: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.lightCoral,
    marginLeft: 8,
  },
  reasonText: {
    fontSize: 15,
    color: COLORS.darkText,
    lineHeight: 22,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.lightCoral,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.sage,
    marginTop: 4,
  },
  warningContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.sage,
  },
  warningText: {
    fontSize: 14,
    color: COLORS.darkText,
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    color: COLORS.darkText,
    textAlign: 'center',
  },
});