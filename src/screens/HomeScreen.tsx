import React, { useState, useCallback, useEffect } from 'react';
import { brands } from '../data/brandData';
import { useFocusEffect } from '@react-navigation/native';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getEthicalScore } from '../api/groqSystemPrompt';
import useSearchStore, { EthicalScoreResponse } from '../store/searchStore';
import { ethicalScoreSystemPrompt } from '../api/ethicalScoreSystemPrompt';
import { ethicalScoreUserPrompt } from '../api/ethicalScoreUserPrompt';
import { MovementCard, Movement } from '../components/MovementCard';
import { COLORS } from '../styles/colors';

const getScoreColor = (score: number): string => {
  if (score >= 81) return COLORS.resedaGreen;
  if (score >= 61) return COLORS.sage;
  if (score >= 41) return COLORS.teaRose;
  if (score >= 21) return COLORS.lightCoral;
  return COLORS.lightCoral;
};

type RootStackParamList = {
  Home: undefined;
  MerchantDetails: { merchant: { name: string; ethicalScore: EthicalScoreResponse; logo?: string } };
  EthicalPurchaseResults: { results: any[], searchTerm: string };
  ProductDetail: { product: { name: string; image: string; description: string } };
  MovementDetails: { movementName: string };
  // Define other screens you navigate to from Home
};

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

interface Company {
  name: string;
  summary: string;
  logo: string;
  ethical_score: number | null;
}

const topEthicalCompanies: Company[] = [
    {
        name: 'Patagonia',
        summary: 'Outdoor apparel brand known for its environmental activism and sustainable practices.',
        logo: 'https://images.pexels.com/photos/1525041/pexels-photo-1525041.jpeg?auto=compress&cs=tinysrgb&w=400',
        ethical_score: null
    },
    {
        name: 'Lush',
        summary: 'Cosmetics retailer that uses vegetarian ingredients and campaigns against animal testing.',
        logo: 'https://images.pexels.com/photos/4202325/pexels-photo-4202325.jpeg?auto=compress&cs=tinysrgb&w=400',
        ethical_score: null
    },
    {
        name: 'TOMS',
        summary: 'Footwear and apparel company with a "one for one" model, donating a pair of shoes for every pair sold.',
        logo: 'https://images.pexels.com/photos/267202/pexels-photo-267202.jpeg?auto=compress&cs=tinysrgb&w=400',
        ethical_score: null
    }
];

const trendingProducts = [
  {
    name: 'Eco Toothbrush',
    image: 'https://images.pexels.com/photos/461382/pexels-photo-461382.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Biodegradable bamboo toothbrush.'
  },
  {
    name: 'Reusable Water Bottle',
    image: 'https://images.pexels.com/photos/416528/pexels-photo-416528.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Stainless steel, keeps drinks cold.'
  },
  {
    name: 'Organic Cotton Tote',
    image: 'https://images.pexels.com/photos/1004016/pexels-photo-1004016.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Sustainable shopping bag.'
  },
  {
    name: 'Fairphone',
    image: 'https://images.pexels.com/photos/276528/pexels-photo-276528.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Ethically sourced smartphone.'
  },
  {
    name: 'Bamboo Cutlery Set',
    image: 'https://images.pexels.com/photos/461382/pexels-photo-461382.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Reusable bamboo cutlery for travel.'
  }
];

// Static boycott movements data - moved outside component to prevent re-creation
const staticBoycottMovements: Movement[] = [
  {
    movement: "BDS Movement",
    note: "Boycott, Divestment, Sanctions movement promoting Palestinian rights through non-violent pressure on Israel",
    url: "https://bdsmovement.net"
  },
  {
    movement: "Fair Tax / Tax Justice",
    note: "Campaign for multinational corporations and wealthy individuals to pay their fair share of taxes",
    url: "https://www.taxjustice.net"
  },
  {
    movement: "Anti-Sweatshop Boycotts",
    note: "Movement against exploitative labor practices in manufacturing, promoting worker rights and fair wages",
    url: "https://www.cleanclothes.org"
  }
];

const CompanyCard = ({ item, onPress }: { item: Company, onPress: () => void }) => (
    <TouchableOpacity style={styles.companyCard} onPress={onPress}>
        <Image source={{ uri: item.logo || 'https://via.placeholder.com/160' }} style={styles.companyImage} />
        {item.ethical_score !== null && (
            <View style={[styles.scoreOverlay, { backgroundColor: getScoreColor(item.ethical_score) }]}>
                <Text style={styles.scoreOverlayText}>{item.ethical_score}</Text>
            </View>
        )}
        <Text style={styles.companyName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.companyDescription} numberOfLines={2}>{item.summary}</Text>
    </TouchableOpacity>
);

export default function HomeScreen({ navigation }: { navigation: HomeScreenNavigationProp }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const { searchCache, addSearch, clearAll } = useSearchStore();
  const [boycotts, setBoycotts] = useState<Movement[]>([]);
  const [ethicalCompanies, setEthicalCompanies] = useState<Company[]>(topEthicalCompanies);
  const [companiesLoading, setCompaniesLoading] = useState(true);
  const [boycottsLoading, setBoycottsLoading] = useState(false);


  // This hook will run every time the screen comes into focus.
  useFocusEffect(
    useCallback(() => {
      // Reset the search term to an empty string.
      setSearchTerm('');
    }, [])
  );

  const handleClearCache = () => {
    clearAll();
    // Optionally, provide some user feedback, like an alert
    // Alert.alert("Cache Cleared", "The search history and cache have been cleared.");
  };

  const fetchScoresForTopCompanies = useCallback(async () => {
    const delay = (ms: number) => new Promise<void>(res => setTimeout(res, ms));
    const companiesWithScores: Company[] = [];
    for (const company of topEthicalCompanies) {
      try {
        let scoreResponse: EthicalScoreResponse;
        if (searchCache[company.name]) {
          scoreResponse = searchCache[company.name];
        } else {
          const userPrompt = ethicalScoreUserPrompt.replace('{searchTerm}', company.name);
          const prompt = `${ethicalScoreSystemPrompt}\n${userPrompt}`;
          const rawResponse = await getEthicalScore(prompt);
          const jsonMatch = rawResponse.match(/```json\s*([\s\S]*?)\s*```/);
          const jsonString = jsonMatch ? jsonMatch[1] : rawResponse.substring(rawResponse.indexOf('{'), rawResponse.lastIndexOf('}') + 1);
          scoreResponse = JSON.parse(jsonString);
          addSearch(company.name, scoreResponse);
          await delay(2000); // 2 second delay between API calls
        }
        companiesWithScores.push({ ...company, ethical_score: scoreResponse.overall_score });
      } catch (error) {
        console.error(`Failed to fetch score for ${company.name}`, error);
        companiesWithScores.push({ ...company, ethical_score: null });
      }
    }
    setEthicalCompanies(companiesWithScores);
  }, [searchCache, addSearch]);

  useEffect(() => {
    const loadCompanies = async () => {
        setCompaniesLoading(true);
        await fetchScoresForTopCompanies();
        setCompaniesLoading(false);
    };
    // Set static boycott movements
    setBoycotts(staticBoycottMovements);
    loadCompanies();
  }, [fetchScoresForTopCompanies]);

  const handleSearch = useCallback(async (term: string, logo?: string) => {
    if (!term) return;
    setLoading(true);
    try {
        let scoreResponse: EthicalScoreResponse;
        if (searchCache[term]) {
            scoreResponse = searchCache[term];
        } else {
            const userPrompt = ethicalScoreUserPrompt.replace('{searchTerm}', term);
            const prompt = `${ethicalScoreSystemPrompt}\n${userPrompt}`;
            const rawResponse = await getEthicalScore(prompt);
            const jsonMatch = rawResponse.match(/```json\s*([\s\S]*?)\s*```/);
            const jsonString = jsonMatch ? jsonMatch[1] : rawResponse.substring(rawResponse.indexOf('{'), rawResponse.lastIndexOf('}') + 1);
            scoreResponse = JSON.parse(jsonString);
            addSearch(term, scoreResponse);
        }
        navigation.navigate('MerchantDetails', { 
            merchant: { 
                name: term, 
                ethicalScore: scoreResponse, 
                logo: logo 
            } 
        });
    } catch (error) {
        console.error("Failed to fetch home screen data", error);
        Alert.alert("Error", "Failed to fetch data. Please try again.");
    } finally {
        setLoading(false);
    }
  }, [navigation, searchCache, addSearch]);

  // Top 5 most boycotted brands (Lloyds, McDonald's, Nestlé, Nike, Shein)
  const mostBoycottedBrands = [
    brands.find(b => b.name === 'Lloyds'),
    brands.find(b => b.name === 'McDonald\'s'),
    brands.find(b => b.name === 'Nestlé'),
    brands.find(b => b.name === 'Nike'),
    brands.find(b => b.name === 'Shein'),
  ].filter(Boolean);

  const BoycottedBrandCard = ({ brand }: { brand: typeof brands[0] }) => {
    const [loading, setLoading] = useState(false);

    const handlePress = async () => {
      setLoading(true);
      try {
        let scoreResponse: EthicalScoreResponse;
        if (searchCache[brand.name]) {
          scoreResponse = searchCache[brand.name];
        } else {
          const userPrompt = ethicalScoreUserPrompt.replace('{searchTerm}', brand.name);
          const prompt = `${ethicalScoreSystemPrompt}\n${userPrompt}`;
          const rawResponse = await getEthicalScore(prompt);
          const jsonMatch = rawResponse.match(/```json\s*([\s\S]*?)\s*```/);
          const jsonString = jsonMatch ? jsonMatch[1] : rawResponse.substring(rawResponse.indexOf('{'), rawResponse.lastIndexOf('}') + 1);
          scoreResponse = JSON.parse(jsonString);
          addSearch(brand.name, scoreResponse);
        }
        navigation.navigate('MerchantDetails', {
          merchant: {
            name: brand.name,
            ethicalScore: scoreResponse,
            logo: brand.logo,
          },
        });
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch ethical score.');
      } finally {
        setLoading(false);
      }
    };

    return (
      <TouchableOpacity
        style={styles.boycottedBrandCard}
        onPress={handlePress}
        disabled={loading}
      >
        <Image source={{ uri: brand.logo }} style={styles.boycottedBrandImage} />
        <Text style={styles.boycottedBrandName} numberOfLines={1}>{brand.name}</Text>
        {loading && <ActivityIndicator size="small" color={COLORS.sage} style={{ marginTop: 4 }} />}
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 80 }}>
      {/* ...existing header code... */}
      <View style={styles.searchBox}>
        <Ionicons name="search" size={24} color="#7a8b5a" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="ethical company or product"
          placeholderTextColor="#7a8b5a"
          value={searchTerm}
          onChangeText={setSearchTerm}
          onSubmitEditing={() => handleSearch(searchTerm)}
        />
        {loading && <ActivityIndicator size="small" color="#7a8b5a" style={{ marginLeft: 8 }} />}
      </View>

      {/* Most Boycotted Brands Section */}
      <Text style={styles.sectionTitle}>most boycotted brands</Text>
      <FlatList
        data={mostBoycottedBrands}
        horizontal
        keyExtractor={(item) => item ? item.id : Math.random().toString()}
        renderItem={({ item }) => item ? <BoycottedBrandCard brand={item} /> : null}
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: 16, marginLeft: 10 }}
      />

      {/* Trending Products Section */}
      {/* <Text style={styles.sectionTitle}>top trending products</Text>
      <FlatList
        data={trendingProducts}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.trendingCard} onPress={() => navigation.navigate('ProductDetail', { product: item })}>
            <Image source={{ uri: item.image }} style={styles.trendingImage} />
            <Text style={styles.trendingName}>{item.name}</Text>
            <Text style={styles.trendingDesc}>{item.description}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.name}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalList}
      /> */}

      {/* <Text style={styles.sectionTitle}>top trending ethical companies</Text>
      {companiesLoading ? <ActivityIndicator style={styles.loader} /> : (
        <FlatList
            data={ethicalCompanies}
            renderItem={({ item }) => <CompanyCard item={item} onPress={() => handleSearch(item.name, item.logo)} />}
            keyExtractor={(item) => item.name}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
        />
      )} */}

      <Text style={styles.sectionTitle}>recent boycott movements</Text>
      {boycottsLoading ? <ActivityIndicator style={styles.loader} /> : (
        <View style={styles.movementsList}>
            {boycotts.map(item => <MovementCard key={item.movement} item={item} onPress={() => navigation.navigate('MovementDetails', { movementName: item.movement })} />)}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  boycottedBrandCard: {
    width: 100,
    alignItems: 'center',
    marginRight: 12,
  },
  boycottedBrandImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 6,
    backgroundColor: COLORS.sage,
  },
  boycottedBrandName: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.lavenderBlush,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.darkText,
  },
  loader: {
    marginTop: 20,
  },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 16, marginHorizontal: 20, marginBottom: 24, paddingHorizontal: 16, height: 48 },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 18, color: COLORS.sage },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 10,
    color: COLORS.darkText,
  },
  horizontalList: {
    paddingLeft: 20,
    paddingRight: 10,
  },
  companyCard: {
    width: 160,
    marginRight: 15,
  },
  trendingCard: {
    width: 160,
    marginRight: 15,
    //backgroundColor: COLORS.white,
    //borderRadius: 20,
    //padding: 10,
    //alignItems: 'center',
  },
  trendingImage: {
    width: 160,
    height: 160,
    borderRadius: 15,
    marginBottom: 8,
  },
  trendingName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.darkText,
    marginBottom: 4,
    //textAlign: 'center',
  },
  trendingDesc: {
    fontSize: 14,
    color: COLORS.sage,
    //textAlign: 'center',
    marginBottom: 4,
  },
  companyImage: {
    width: 160,
    height: 160,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    marginBottom: 10,
  },
  scoreOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  scoreOverlayText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.darkText,
  },
  companyDescription: {
    fontSize: 14,
    color: COLORS.sage,
  },
  movementsList: {
    paddingHorizontal: 20,
  },
});
