import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../styles/colors';
import useSearchStore, { EthicalScoreResponse, getMerchantLogo } from '../store/searchStore';
import { ethicalScoreUserPrompt } from '../api/ethicalScoreUserPrompt';
import { ethicalScoreSystemPrompt } from '../api/ethicalScoreSystemPrompt';
import { getEthicalScore } from '../api/groqSystemPrompt';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import boycottedBrandsData from '../data/02_Boycotted_brands.json';
import movementsData from '../data/01_Movements.json';

type SearchStackParamList = {
    Search: undefined;
    MerchantDetails: { merchant: { name: string; ethicalScore: EthicalScoreResponse; logo?: string } };
    Categories: undefined;
    MovementDetails: { movementName: string };
};

type Props = NativeStackScreenProps<SearchStackParamList, 'MerchantDetails'>;

const categoryDisplayNames = {
    environment: 'Environment',
    labor_and_human_rights: 'Labor & Human Rights',
    animal_welfare: 'Animal Welfare',
    social_responsibility: 'Social Responsibility',
    corporate_governance: 'Corporate Governance',
};

interface BoycottedBrand {
  'Brand / Company': string;
  'Boycott / Campaign': string;
  Sector: string;
  Reason: string;
}

interface Movement {
  'Movement / Boycott Campaign': string;
  'Target Brands / Companies': string;
  Categories: string;
  Overview: string;
  'Read More': string | null;
}

const getScoreColor = (score: number): string => {
  if (score >= 81) return COLORS.resedaGreen;
  if (score >= 61) return COLORS.sage;
  if (score >= 41) return COLORS.teaRose;
  return COLORS.lightCoral;
};

const findBoycottsForBrand = (brandName: string): BoycottedBrand[] => {
  console.log('Looking for boycotts for brand:', brandName);
  const boycotts = boycottedBrandsData.filter(boycott => 
    boycott['Brand / Company'].toLowerCase().includes(brandName.toLowerCase()) ||
    brandName.toLowerCase().includes(boycott['Brand / Company'].toLowerCase())
  );
  console.log('Found boycotts:', boycotts.length);
  boycotts.forEach(boycott => {
    console.log('- Campaign:', boycott['Boycott / Campaign'], 'for brand:', boycott['Brand / Company']);
  });
  return boycotts;
};

const findMovementForBoycott = (boycottCampaign: string): Movement | undefined => {
  console.log('Looking for movement for boycott campaign:', boycottCampaign);
  const movement = movementsData.find(movement => 
    movement['Movement / Boycott Campaign'].toLowerCase() === boycottCampaign.toLowerCase()
  );
  console.log('Found movement:', movement ? movement['Movement / Boycott Campaign'] : 'No movement found');
  return movement;
};

const ScoreBar = ({ score }: { score: number }) => (
    <View style={styles.scoreBarContainer}>
        <View style={[styles.scoreBar, { width: `${score}%`, backgroundColor: getScoreColor(score) }]} />
    </View>
);

export default function MerchantDetailsScreen({ route, navigation }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const { merchant } = route.params;
  const { favorites, toggleFavorite, clearAll } = useSearchStore();
  const isFavorite = favorites.includes(merchant.name);

  const { overall_score, positives, negatives, category_scores, logo_url } = merchant.ethicalScore;
  const [logo, setLogo] = useState<string | null>(logo_url || merchant.logo || null);

  useEffect(() => {
    let cancelled = false;
    async function fetchLogo() {
      if (!logo_url && !merchant.logo) {
        const fetchedLogo = await getMerchantLogo(merchant.name);
        if (!cancelled && fetchedLogo) setLogo(fetchedLogo);
      }
    }
    fetchLogo();
    return () => { cancelled = true; };
  }, [merchant.name]);

  const handleClearCache = () => {
    clearAll();
    // Optionally, provide feedback
    Alert.alert('Cache cleared!');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 80 }}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#222" />
        </TouchableOpacity>
        {/* <TouchableOpacity onPress={() => toggleFavorite(merchant.name)} style={styles.favoriteIcon}>
          <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={28} color={isFavorite ? "#d9534f" : "#222"} />
        </TouchableOpacity>*/}
        <TouchableOpacity onPress={handleClearCache} style={styles.favoriteIcon}>
          <Ionicons name="trash-outline" size={28} color="#222" />
        </TouchableOpacity> 
      </View>
      <View style={styles.merchantHeader}>
        <Text style={styles.merchantName}>{merchant.name}</Text>
      </View>
      <View style={{ alignItems: 'center', marginBottom: 24 }}>
        {overall_score && (
          <View style={{ position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
            <View style={[styles.scoreCircle, { backgroundColor: getScoreColor(overall_score) }]}> 
              <Text style={styles.scoreValue}>{overall_score}</Text>
              <Text style={styles.scoreOutOf}>/ 100</Text>
            </View>
            {logo && (
              <Image
                source={{ uri: logo, cache: 'force-cache', width: 60, height: 60 }}
                style={styles.logoOverlap}
                resizeMode="cover"
              />
            )}
          </View>
        )}
      </View>
      {category_scores && (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>ethical score breakdown</Text>
          <View style={styles.scoresContainer}>
            {Object.entries(category_scores).map(([key, value]) => (
              <View key={key} style={styles.scoreItem}>
                <TouchableOpacity
                  style={styles.scoreTextContainer}
                  onPress={() => setExpanded(expanded === key ? null : key)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.categoryName}>{categoryDisplayNames[key as keyof typeof categoryDisplayNames]}</Text>
                  <Text style={styles.scoreValueText}>{value as number}</Text>
                  <Ionicons name={expanded === key ? 'chevron-up' : 'chevron-down'} size={20} color={COLORS.sage} style={{ marginLeft: 8 }} />
                </TouchableOpacity>
                <ScoreBar score={value as number} />
                {expanded === key && merchant.ethicalScore.details && merchant.ethicalScore.details[key] && (
                  <View style={styles.factorDetails}>
                    <Text style={styles.factorDetailsText}>{merchant.ethicalScore.details[key]}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Boycotts Section */}
      {(() => {
        const boycotts = findBoycottsForBrand(merchant.name);
        return boycotts.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>boycotts & campaigns</Text>
            <View style={styles.boycottContainer}>
              {boycotts.map((boycott, index) => {
                const movement = findMovementForBoycott(boycott['Boycott / Campaign']);
                return (
                  <TouchableOpacity
                    key={index}
                    style={styles.boycottCard}
                    activeOpacity={0.8}
                    onPress={() => {
                      console.log('Boycott pressed:', boycott['Boycott / Campaign']);
                      console.log('Movement found:', movement);
                      if (movement) {
                        console.log('Navigating to MovementDetails with movementName:', movement['Movement / Boycott Campaign']);
                        navigation.navigate('MovementDetails', {
                          movementName: movement['Movement / Boycott Campaign']
                        });
                      } else {
                        Alert.alert('Movement Not Found', `No movement details available for "${boycott['Boycott / Campaign']}"`);
                      }
                    }}
                  >
                    <View style={styles.boycottHeader}>
                      <View style={styles.boycottIconContainer}>
                        <Ionicons name="warning" size={20} color={COLORS.lightCoral} />
                      </View>
                      <View style={styles.boycottContent}>
                        <Text style={styles.boycottCampaign}>{boycott['Boycott / Campaign']}</Text>
                        <Text style={styles.boycottSector}>{boycott.Sector}</Text>
                      </View>
                      {movement && (
                        <Ionicons name="chevron-forward" size={20} color={COLORS.sage} />
                      )}
                    </View>
                    <Text style={styles.boycottReason}>{boycott.Reason}</Text>
                    {movement && (
                      <Text style={styles.boycottLink}>Tap to learn more about this movement</Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        );
      })()}

      {positives && positives.length > 0 && (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>positives</Text>
          {positives.map((item, index) => (
            <View key={index} style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.bulletText}>{item.point}</Text>
                <Text style={styles.categoryText}>Category: {item.category}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
      {negatives && negatives.length > 0 && (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>negatives</Text>
          {negatives.map((item, index) => (
            <View key={index} style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.bulletText}>{item.point}</Text>
                <Text style={styles.categoryText}>Category: {item.category}</Text>
              </View>
            </View>
          ))}
          {/* Ethical Alternative Section */}
          {merchant.ethicalScore.ethical_alternative && merchant.ethicalScore.ethical_alternative.name && (
            <View style={styles.alternativeContainer}>
              <Text style={styles.sectionTitle}>ethical alternative</Text>
              <TouchableOpacity
                style={styles.alternativeCard}
                activeOpacity={0.8}
                onPress={async () => {
                  try {
                    let scoreResponse: EthicalScoreResponse;
                    if (merchant.ethicalScore.ethical_alternative?.name === merchant.name) return;
                    if (useSearchStore.getState().searchCache[merchant.ethicalScore.ethical_alternative?.name ?? '']) {
                      scoreResponse = useSearchStore.getState().searchCache[merchant.ethicalScore.ethical_alternative?.name ?? ''];
                    } else {
                      const userPrompt = ethicalScoreUserPrompt.replace('{searchTerm}', merchant.ethicalScore.ethical_alternative?.name ?? '');
                      const prompt = `${ethicalScoreSystemPrompt}\n${userPrompt}`;
                      const rawResponse = await getEthicalScore(prompt);
                      const jsonMatch = rawResponse.match(/```json\s*([\s\S]*?)\s*```/);
                      const jsonString = jsonMatch ? jsonMatch[1] : rawResponse.substring(rawResponse.indexOf('{'), rawResponse.lastIndexOf('}') + 1);
                      scoreResponse = JSON.parse(jsonString);
                      useSearchStore.getState().addSearch(merchant.ethicalScore.ethical_alternative?.name ?? '', scoreResponse);
                    }
                    navigation.replace('MerchantDetails', {
                      merchant: {
                        name: merchant.ethicalScore.ethical_alternative?.name ?? '',
                        ethicalScore: scoreResponse,
                        logo: '',
                      },
                    });
                  } catch (error) {
                    Alert.alert('Error', 'Failed to fetch ethical score for alternative.');
                  }
                }}
              >
                <Text style={styles.alternativeName}>{merchant.ethicalScore.ethical_alternative.name}</Text>
                <Text style={styles.alternativeReason}>{merchant.ethicalScore.ethical_alternative.reason}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  alternativeContainer: {
    marginTop: 24,
    marginBottom: 16,
  },
  alternativeCard: {
    backgroundColor: COLORS.sage,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  alternativeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.darkText,
    marginBottom: 4,
  },
  alternativeReason: {
    fontSize: 15,
    color: COLORS.darkText,
  },
  container: { flex: 1, backgroundColor: COLORS.lavenderBlush, paddingTop: 40 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, paddingHorizontal: 16 },
  favoriteIcon: { padding: 4 },
  merchantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    marginTop: 16,
  },
  merchantLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  logoOverlap: {
    position: 'absolute',
    bottom: 160,
    left: '50%',
    transform: [{ translateX: -100 }],
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#fff',
    backgroundColor: '#fff',
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  merchantName: { fontSize: 28, fontWeight: 'bold', color: COLORS.darkText, textAlign: 'center' },
  scoreCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  scoreValue: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#fff',
  },
  scoreOutOf: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: -8,
  },
  sectionContainer: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.darkText,
    marginBottom: 12,
  },
  bulletPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bullet: {
    fontSize: 18,
    marginRight: 8,
    color: COLORS.sage,
  },
  bulletText: {
    fontSize: 16,
    color: COLORS.darkText,
    flex: 1,
  },
  categoryText: {
    fontSize: 14,
    color: COLORS.sage,
    marginTop: 4,
  },
  scoresContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scoreItem: {
      marginBottom: 20,
  },
  scoreTextContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.darkText,
    flex: 1,
    textAlign: 'right',
    marginRight: 8,
  },
  scoreValueText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.darkText,
    minWidth: 32,
    textAlign: 'right',
  },
  scoreBarContainer: {
      height: 10,
      backgroundColor: '#e0e0e0',
      borderRadius: 5,
      overflow: 'hidden',
  },
  scoreBar: {
      height: '100%',
      borderRadius: 5,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.lightCoral,
    textAlign: 'center',
  },
  errorSubText: {
    fontSize: 16,
    color: COLORS.darkText,
    textAlign: 'center',
    marginTop: 8,
  },
  factorDetails: {
    backgroundColor: COLORS.lavenderBlush,
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  factorDetailsText: {
    fontSize: 15,
    color: COLORS.darkText,
  },
  boycottContainer: {
    gap: 12,
  },
  boycottCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.lightCoral,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  boycottHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  boycottIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  boycottContent: {
    flex: 1,
  },
  boycottCampaign: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.darkText,
    marginBottom: 2,
  },
  boycottSector: {
    fontSize: 14,
    color: COLORS.sage,
  },
  boycottReason: {
    fontSize: 15,
    color: COLORS.darkText,
    lineHeight: 22,
    marginBottom: 8,
  },
  boycottLink: {
    fontSize: 14,
    color: COLORS.sage,
    fontStyle: 'italic',
  },
});
