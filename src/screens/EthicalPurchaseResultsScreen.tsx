import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

type SearchStackParamList = {
  EthicalPurchaseResults: { results: any[], searchTerm: string };
};

type EthicalPurchaseResultsScreenRouteProp = RouteProp<SearchStackParamList, 'EthicalPurchaseResults'>;

type EthicalPurchaseResultsScreenNavigationProp = NativeStackNavigationProp<SearchStackParamList, 'EthicalPurchaseResults'>;

type Props = {
  route: EthicalPurchaseResultsScreenRouteProp;
  navigation: EthicalPurchaseResultsScreenNavigationProp;
};

export default function EthicalPurchaseResultsScreen({ route, navigation }: Props) {
  const { results, searchTerm } = route.params;

  const handleLinkPress = async (url: string) => {
    if (!url) return;
    const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
    try {
      const supported = await Linking.canOpenURL(formattedUrl);
      if (supported) {
        await Linking.openURL(formattedUrl);
      } else {
        console.error("Don't know how to open this URL: " + formattedUrl);
      }
    } catch (e) {
      console.error('Failed to open the URL: ', e);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.resultCard}>
      <Text style={styles.brandName}>{item.brand}</Text>
      {item.rating && <Text style={styles.rating}>Rating: {item.rating}</Text>}
      
      <Text style={styles.subHeader}>Strengths:</Text>
      {item.strengths?.map((strength: string, index: number) => (
        <Text key={`strength-${index}`} style={styles.detailText}>- {strength}</Text>
      ))}

      {item.weaknesses && item.weaknesses.length > 0 && (
        <>
          <Text style={styles.subHeader}>Weaknesses:</Text>
          {item.weaknesses?.map((weakness: string, index: number) => (
            <Text key={`weakness-${index}`} style={styles.detailText}>- {weakness}</Text>
          ))}
        </>
      )}

      {item.example_products && item.example_products.length > 0 && (
        <>
          <Text style={styles.subHeader}>Example Products:</Text>
          {item.example_products?.map((product: string, index: number) => (
            <Text key={`product-${index}`} style={styles.detailText}>- {product}</Text>
          ))}
        </>
      )}

      {item.url && (
        <TouchableOpacity onPress={() => handleLinkPress(item.url)}>
          <Text style={styles.urlText}>More Info</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#222" />
        </TouchableOpacity>
        <Text style={styles.header}>Results for "{searchTerm}"</Text>
      </View>
      <FlatList
        data={results}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.brand + index}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={styles.emptyText}>No ethical recommendations found.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9f3', paddingTop: 40 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, paddingHorizontal: 16 },
  header: { fontSize: 24, fontWeight: 'bold', color: '#222', flex: 1, textAlign: 'center', marginRight: 28 },
  listContainer: { paddingHorizontal: 16, paddingBottom: 24 },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  brandName: { fontSize: 22, fontWeight: 'bold', color: '#222', marginBottom: 8 },
  rating: { fontSize: 16, fontWeight: '600', color: '#7a8b5a', marginBottom: 12 },
  subHeader: { fontSize: 16, fontWeight: 'bold', color: '#444', marginTop: 8, marginBottom: 4 },
  detailText: { fontSize: 14, color: '#555', marginBottom: 2, lineHeight: 20 },
  urlText: { fontSize: 14, color: '#2a7be4', marginTop: 8, textDecorationLine: 'underline' },
  emptyText: { textAlign: 'center', marginTop: 40, fontSize: 16, color: '#7a8b5a' },
});
