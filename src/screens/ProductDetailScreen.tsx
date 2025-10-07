import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { getEthicalScore } from '../api/groqSystemPrompt';
import { ethicalScoreSystemPrompt } from '../api/ethicalScoreSystemPrompt';
import { ethicalScoreUserPrompt } from '../api/ethicalScoreUserPrompt';
import { COLORS } from '../styles/colors';

type ProductDetailParamList = {
  ProductDetail: { product: { name: string; image: string; description: string } };
};

type Props = NativeStackScreenProps<ProductDetailParamList, 'ProductDetail'>;

export default function ProductDetailScreen({ route, navigation }: Props) {
  const { product } = route.params;
  const [alternatives, setAlternatives] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAlternatives = async () => {
      setLoading(true);
      try {
        const userPrompt = ethicalScoreUserPrompt.replace('{searchTerm}', product.name);
        const prompt = `${ethicalScoreSystemPrompt}\n${userPrompt}`;
        const rawResponse = await getEthicalScore(prompt);
        const jsonMatch = rawResponse.match(/```json\s*([\s\S]*?)\s*```/);
        const jsonString = jsonMatch ? jsonMatch[1] : rawResponse.substring(rawResponse.indexOf('{'), rawResponse.lastIndexOf('}') + 1);
        const parsed = JSON.parse(jsonString);
        setAlternatives(parsed.positives || []);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch ethical alternatives.');
      } finally {
        setLoading(false);
      }
    };
    fetchAlternatives();
  }, [product.name]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 80 }}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={28} color="#222" />
      </TouchableOpacity>
      <View style={styles.header}>
        <Image source={{ uri: product.image }} style={styles.productImage} />
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productDesc}>{product.description}</Text>
      </View>
      <Text style={styles.sectionTitle}>Ethical Alternatives</Text>
      {loading ? <ActivityIndicator style={{ marginTop: 20 }} /> : (
        alternatives.length > 0 ? (
          alternatives.map((alt, idx) => (
            <View key={idx} style={styles.altCard}>
              <Text style={styles.altText}>{alt.point}</Text>
              <Text style={styles.altCategory}>Category: {alt.category}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noAltText}>No ethical alternatives found.</Text>
        )
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lavenderBlush,
    paddingTop: 40,
  },
  backButton: {
    marginLeft: 16,
    marginBottom: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  productImage: {
    width: 180,
    height: 180,
    borderRadius: 20,
    marginBottom: 16,
  },
  productName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.darkText,
    textAlign: 'center',
  },
  productDesc: {
    fontSize: 16,
    color: COLORS.sage,
    textAlign: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.darkText,
    marginBottom: 12,
    marginLeft: 16,
  },
  altCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  altText: {
    fontSize: 16,
    color: COLORS.darkText,
  },
  altCategory: {
    fontSize: 14,
    color: COLORS.sage,
    marginTop: 4,
  },
  noAltText: {
    fontSize: 16,
    color: COLORS.sage,
    textAlign: 'center',
    marginTop: 24,
  },
});
