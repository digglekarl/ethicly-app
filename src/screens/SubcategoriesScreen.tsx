import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { COLORS } from '../styles/colors';
import { categories, getSubcategories } from '../data/categories';
import useSearchStore, { EthicalScoreResponse } from '../store/searchStore';
import { getEthicalScore } from '../api/groqSystemPrompt';
import { ethicalScoreUserPrompt } from '../api/ethicalScoreUserPrompt';

// Function to get brand logo URL
const getBrandLogo = (brandName: string): string => {
    // Clean brand name for URL
    const cleanName = brandName
        .toLowerCase()
        .replace(/['\(\)]/g, '') // Remove quotes and parentheses
        .replace(/\s+/g, '') // Remove spaces
        .replace(/&/g, 'and') // Replace & with 'and'
        .split('(')[0] // Take only the part before parentheses
        .trim();
    
    // Brand-specific mappings for better logo results
    const brandMappings: Record<string, string> = {
        'coca-cola': 'coca-cola.com',
        'nestle': 'nestle.com',
        'pepsico': 'pepsi.com',
        'unilever': 'unilever.com',
        'mondelez': 'mondelezinternational.com',
        'ikea': 'ikea.com',
        'bandq': 'diy.com',
        'homebase': 'homebase.co.uk',
        'wilko': 'wilko.com',
        'habitat': 'habitat.co.uk',
        'loreal': 'loreal.com',
        'proctergamble': 'pg.com',
        'colgate-palmolive': 'colgate.com',
        'gillette': 'gillette.com',
        'handm': 'hm.com',
        'zara': 'zara.com',
        'primark': 'primark.com',
        'boohoo': 'boohoo.com',
        'topshop': 'topshop.com',
        'apple': 'apple.com',
        'samsung': 'samsung.com',
        'microsoft': 'microsoft.com',
        'google': 'google.com',
        'amazon': 'amazon.com',
        'tesco': 'tesco.com',
        'sainsburys': 'sainsburys.co.uk',
        'asda': 'asda.com',
        'morrisons': 'morrisons.com',
        'lidl': 'lidl.com',
        'mcdonalds': 'mcdonalds.com',
        'kfc': 'kfc.com',
        'burgerking': 'burgerking.com',
        'subway': 'subway.com',
        'dominos': 'dominos.com',
        'volkswagen': 'volkswagen.com',
        'bmw': 'bmw.com',
        'mercedes-benz': 'mercedes-benz.com',
        'ford': 'ford.com',
        'tesla': 'tesla.com',
        // Ethical alternatives
        'fentimans': 'fentimans.com',
        'piporganic': 'pip-organic.com',
        'karmacola': 'karma-cola.com',
        'belvoirfruitfarms': 'belvoirfruitfarms.co.uk',
        'tonyschocolonely': 'tonyschocolonely.com',
        'peopletree': 'peopletree.co.uk',
        'thought': 'thought.com',
        'patagonia': 'patagonia.com',
        'armedangels': 'armedangels.com',
        'frugi': 'frugi.com',
        'fairphone': 'fairphone.com',
        'frameworklaptop': 'frame.work',
        'triodosbank': 'triodos.com',
        'charitybank': 'charitybank.org',
        'ecotricity': 'ecotricity.co.uk',
        'goodenergy': 'goodenergy.co.uk',
        'octopusenergy': 'octopus.energy',
        'waitrose': 'waitrose.com',
        'coop': 'coop.co.uk',
        'planetorganic': 'planetorganic.com',
        'marksandspencer': 'marksandspencer.com',
        'leon': 'leon.co',
        'honestburgers': 'honestburgers.co.uk',
        'byronburger': 'byron.com',
        'pretamanger': 'pret.co.uk',
        'nissanleaf': 'nissan.com',
        'polestar': 'polestar.com',
        'toyota': 'toyota.com',
        'rivian': 'rivian.com',
        'hyundaiioniq': 'hyundai.com'
    };
    
    const domain = brandMappings[cleanName] || `${cleanName}.com`;
    return `https://logo.clearbit.com/${domain}`;
};

// Category data with brands to avoid and ethical alternatives
const categoryBrandsData: Record<string, { brandsToAvoid: string[]; ethicalAlternatives: string[] }> = {
    'Food & Drink': {
        brandsToAvoid: ['Coca-Cola', 'Nestlé', 'PepsiCo', 'Unilever', 'Mondelez'],
        ethicalAlternatives: ['Fentimans', 'Pip Organic', 'Karma Cola', 'Belvoir Fruit Farms', 'Tony\'s Chocolonely']
    },
    'Household': {
        brandsToAvoid: ['IKEA', 'B&Q', 'Homebase', 'Wilko', 'Habitat'],
        ethicalAlternatives: ['Loaf', 'Made.com (ethical range)', 'West Elm (sustainable range)', 'The White Company (eco range)', 'Heal\'s']
    },
    'Personal Care & Beauty': {
        brandsToAvoid: ['L\'Oréal', 'Unilever (Dove/Vaseline)', 'Procter & Gamble', 'Colgate-Palmolive', 'Gillette (P&G)'],
        ethicalAlternatives: ['Neal\'s Yard Remedies', 'Weleda', 'Faith in Nature', 'The Ordinary', 'Bulldog (ethical range)']
    },
    'Fashion & Apparel': {
        brandsToAvoid: ['H&M', 'Zara', 'Primark', 'Boohoo', 'Topshop'],
        ethicalAlternatives: ['People Tree', 'Thought', 'Patagonia', 'Armedangels', 'Frugi']
    },
    'Electronics & Tech': {
        brandsToAvoid: ['Apple', 'Samsung', 'Microsoft', 'Google', 'Amazon'],
        ethicalAlternatives: ['Fairphone', 'Framework Laptop', 'Nextcloud', 'Hugging Face', 'Ethical Superstore Electronics']
    },
    'Supermarkets & Retail': {
        brandsToAvoid: ['Tesco', 'Sainsbury\'s', 'ASDA', 'Morrisons', 'Lidl'],
        ethicalAlternatives: ['Waitrose & Partners', 'Co-op', 'Planet Organic', 'Marks & Spencer (ethical range)', 'Booths']
    },
    'Travel & Transport': {
        brandsToAvoid: ['Hilton', 'Marriott', 'TUI', 'easyJet', 'Airbnb'],
        ethicalAlternatives: ['YHA England & Wales', 'Good Hotel', 'Intrepid Travel', 'Exodus Travels', 'Green Key Certified Hotels']
    },
    'Finance & Insurance': {
        brandsToAvoid: ['HSBC', 'Barclays', 'Lloyds', 'NatWest', 'Santander'],
        ethicalAlternatives: ['Triodos Bank', 'Charity Bank', 'Ecology Building Society', 'Unity Trust Bank', 'Rathbone Greenbank Investments']
    },
    'Energy & Utilities': {
        brandsToAvoid: ['BP', 'Shell', 'ExxonMobil', 'Chevron', 'TotalEnergies'],
        ethicalAlternatives: ['Ecotricity', 'Good Energy', 'Octopus Energy', 'Ovo Energy Green Tariffs', 'Solarcentury']
    },
    'Raw Materials & Industrial': {
        brandsToAvoid: ['Glencore', 'Rio Tinto', 'BHP', 'Cargill', 'Monsanto/Bayer'],
        ethicalAlternatives: ['Fairmined Certified Metals', 'Ethical Metalsmiths', 'Soil Association Certified Farms', 'Riverford Organic', 'Bio-bean']
    },
    'Property & Facilities': {
        brandsToAvoid: ['Serco', 'Mitie', 'Compass Group', 'Interserve', 'Sodexo'],
        ethicalAlternatives: ['OCS Group', 'ISS UK Sustainable Services', 'Cofely UK', 'Engie UK Sustainable FM', 'Bouygues Energies & Services UK']
    },
    'Arts, Culture & Leisure': {
        brandsToAvoid: ['Disney', 'Netflix', 'ViacomCBS', 'Warner Bros', 'Universal Studios'],
        ethicalAlternatives: ['BBC', 'Channel 4', 'Curzon Cinemas', 'BFI', 'Indie Cinemas UK']
    },
    'E-commerce & Retail': {
        brandsToAvoid: ['Amazon', 'eBay (non-certified sellers)', 'Alibaba', 'Groupon', 'Wish'],
        ethicalAlternatives: ['Etsy (ethical sellers)', 'Folksy', 'Trouva', 'Notonthehighstreet', 'Ethical Superstore Deals']
    },
    'Foodservice & Hospitality': {
        brandsToAvoid: ['McDonald\'s', 'KFC', 'Burger King', 'Subway', 'Domino\'s'],
        ethicalAlternatives: ['LEON', 'Honest Burgers', 'Byron Burger (ethical sourcing)', 'Pret a Manger (sustainable lines)', 'The Good Food Chain']
    },
    'Automotive': {
        brandsToAvoid: ['Volkswagen', 'BMW', 'Mercedes-Benz', 'Ford', 'Tesla'],
        ethicalAlternatives: ['Nissan Leaf', 'Polestar', 'Toyota (hybrid/eco range)', 'Rivian', 'Hyundai Ioniq']
    }
};

type CategoryStackParamList = {
    CategoriesList: undefined;
    Subcategories: { categoryName: string };
    CategoryDetails: { categoryName: string; subcategoryName: string };
    MerchantDetails: { merchant: { name: string; ethicalScore: EthicalScoreResponse; logo?: string } };
};

type Props = NativeStackScreenProps<CategoryStackParamList, 'Subcategories'>;

export default function SubcategoriesScreen({ route, navigation }: Props) {
    const { categoryName } = route.params;
    const [subcategories, setSubcategories] = useState<string[]>([]);
    const [categoryBrands, setCategoryBrands] = useState<{ brandsToAvoid: string[]; ethicalAlternatives: string[] } | null>(null);
    const [brandScores, setBrandScores] = useState<Record<string, EthicalScoreResponse | null>>({});
    const [loadingScores, setLoadingScores] = useState<Record<string, boolean>>({});
    const [retryCount, setRetryCount] = useState<Record<string, number>>({});
    const { searchCache, addSearch } = useSearchStore();

    useEffect(() => {
        const subcats = getSubcategories(categoryName);
        setSubcategories(subcats);
        
        // Get brands data for this category
        const brandsData = categoryBrandsData[categoryName];
        setCategoryBrands(brandsData || null);

        // Load cached scores for brands to avoid AND ethical alternatives
        const scores: Record<string, EthicalScoreResponse | null> = {};
        if (brandsData?.brandsToAvoid) {
            brandsData.brandsToAvoid.forEach(brand => {
                if (searchCache[brand]) {
                    console.log(`Loading cached score for ${brand}:`, searchCache[brand].overall_score);
                    scores[brand] = searchCache[brand];
                } else {
                    console.log(`No cached score found for ${brand}`);
                    scores[brand] = null;
                }
            });
        }

        if (brandsData?.ethicalAlternatives) {
            brandsData.ethicalAlternatives.forEach(brand => {
                if (searchCache[brand]) {
                    console.log(`Loading cached score for alt ${brand}:`, searchCache[brand].overall_score);
                    scores[brand] = searchCache[brand];
                } else {
                    console.log(`No cached score found for alt ${brand}`);
                    scores[brand] = null;
                }
            });
        }

        setBrandScores(scores);
    }, [categoryName]); // Remove searchCache from dependencies to prevent infinite loop

    // Separate useEffect to update scores when cache changes
    useEffect(() => {
        if (!categoryBrands) return;
        const updated: Record<string, EthicalScoreResponse | null> = { ...brandScores };
        let hasUpdates = false;

        [...(categoryBrands.brandsToAvoid || []), ...(categoryBrands.ethicalAlternatives || [])].forEach(brand => {
            const cachedScore = searchCache[brand];
            const currentScore = brandScores[brand];

            if (cachedScore && (!currentScore || currentScore.overall_score === -1)) {
                console.log(`Updating ${brand} from cache: score ${cachedScore.overall_score}`);
                updated[brand] = cachedScore;
                hasUpdates = true;
            }
        });

        if (hasUpdates) setBrandScores(updated);
    }, [searchCache, categoryBrands]); // Watch cache and category changes

    // Prefetch missing scores (both avoid + alternatives) when categoryBrands is set
    useEffect(() => {
        if (!categoryBrands) return;

        const allBrands = [ ...(categoryBrands.brandsToAvoid || []), ...(categoryBrands.ethicalAlternatives || []) ];
        allBrands.forEach((brand, idx) => {
            const cached = searchCache[brand];
            const local = brandScores[brand];
            if (cached || (local && local.overall_score >= 0)) return;

            const delay = Math.min(300 * idx, 3000);
            setTimeout(() => {
                if (!useSearchStore.getState().searchCache[brand] && !(brandScores[brand] && brandScores[brand]!.overall_score >= 0)) {
                    fetchEthicalScore(brand);
                }
            }, delay);
        });
    }, [categoryBrands]);

    const clearBrandCache = (brandName: string) => {
        console.log(`Clearing cache for ${brandName}`);
        // Remove from cache
        const currentCache = useSearchStore.getState().searchCache;
        const { [brandName]: removed, ...remainingCache } = currentCache;
        useSearchStore.setState({ searchCache: remainingCache });
        
        // Reset local state
        setBrandScores(prev => ({ ...prev, [brandName]: null }));
        setRetryCount(prev => ({ ...prev, [brandName]: 0 }));
    };

    const fetchEthicalScore = async (brandName: string) => {
        // Check if already loading or already have a valid score
        if (loadingScores[brandName]) {
            console.log(`Already loading score for ${brandName}`);
            return;
        }

        if (brandScores[brandName] && brandScores[brandName]?.overall_score >= 0) {
            console.log(`Already have valid score for ${brandName}`);
            return;
        }

        // Check cache first
        if (searchCache[brandName]) {
            console.log(`Found in cache for ${brandName}:`, searchCache[brandName].overall_score);
            setBrandScores(prev => ({ ...prev, [brandName]: searchCache[brandName] }));
            return;
        }

        // Check retry limit
        const currentRetries = retryCount[brandName] || 0;
        if (currentRetries >= 2) { // Reduced to 2 retries
            console.log(`Max retries reached for ${brandName}`);
            return;
        }

        console.log(`Fetching ethical score for: ${brandName} (attempt ${currentRetries + 1})`);
        setLoadingScores(prev => ({ ...prev, [brandName]: true }));
        
        try {
            const userPrompt = ethicalScoreUserPrompt.replace('{searchTerm}', brandName);
            console.log('Making API request for:', brandName);
            
            const rawResponse = await getEthicalScore(userPrompt);
            console.log(`Raw response for ${brandName}:`, rawResponse?.substring(0, 100) + '...');
            
            // Check if the response indicates an error
            if (!rawResponse || 
                rawResponse.includes('Error:') || 
                rawResponse.includes('Network Error') || 
                rawResponse.trim() === '') {
                throw new Error(`Invalid API response: ${rawResponse?.substring(0, 50)}`);
            }
            
            let scoreResponse: EthicalScoreResponse;
            
            // Try multiple parsing strategies
            try {
                // First try direct JSON parse
                scoreResponse = JSON.parse(rawResponse);
                console.log(`Direct JSON parse successful for ${brandName}`);
            } catch (jsonError) {
                console.log(`Direct JSON parse failed for ${brandName}, trying alternatives...`);
                
                // Try markdown extraction
                const jsonMatch = rawResponse.match(/```json\s*([\s\S]*?)\s*```/);
                if (jsonMatch && jsonMatch[1]) {
                    scoreResponse = JSON.parse(jsonMatch[1]);
                    console.log(`Markdown JSON extraction successful for ${brandName}`);
                } else {
                    // Try finding JSON object
                    const jsonStart = rawResponse.indexOf('{');
                    const jsonEnd = rawResponse.lastIndexOf('}');
                    
                    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
                        const jsonString = rawResponse.substring(jsonStart, jsonEnd + 1);
                        scoreResponse = JSON.parse(jsonString);
                        console.log(`JSON object extraction successful for ${brandName}`);
                    } else {
                        // Fallback: try to extract a numeric score from free text (e.g., "57 / 100" or "Overall score: 57")
                        const scoreMatch = rawResponse.match(/([0-9]{1,3})\s*\/\s*100/);
                        const scoreMatch2 = rawResponse.match(/overall\s*score[:\s]*([0-9]{1,3})/i) || rawResponse.match(/score[:\s]*([0-9]{1,3})/i);
                        const numeric = scoreMatch ? scoreMatch[1] : (scoreMatch2 ? scoreMatch2[1] : null);
                        if (numeric) {
                            const parsedNum = Math.max(0, Math.min(100, parseInt(numeric, 10)));
                            console.warn(`Non-JSON response but found numeric score ${parsedNum} for ${brandName}, synthesizing minimal response`);
                            scoreResponse = {
                                company_name: brandName,
                                overall_score: parsedNum,
                                category_scores: {
                                    environment: parsedNum,
                                    labor_and_human_rights: parsedNum,
                                    animal_welfare: parsedNum,
                                    social_responsibility: parsedNum,
                                    corporate_governance: parsedNum,
                                },
                                details: {},
                                positives: [],
                                negatives: [],
                                ethical_alternative: { name: '', reason: '' },
                                logo_url: getBrandLogo(brandName),
                                summary: `Synthesized score from model text: ${parsedNum}`,
                            } as unknown as EthicalScoreResponse;
                        } else {
                            throw new Error('No valid JSON found in response');
                        }
                    }
                }
            }
            
            // Validate response
            if (typeof scoreResponse.overall_score !== 'number' || 
                scoreResponse.overall_score < 0 || 
                scoreResponse.overall_score > 100) {
                throw new Error(`Invalid score value: ${scoreResponse.overall_score}`);
            }
            
            // Ensure required fields
            scoreResponse.logo_url = scoreResponse.logo_url || getBrandLogo(brandName);
            scoreResponse.company_name = scoreResponse.company_name || brandName;
            
            console.log(`Successfully processed score for ${brandName}: ${scoreResponse.overall_score}`);
            
            // Cache the result - this is crucial for persistence
            addSearch(brandName, scoreResponse);
            console.log(`Cached score for ${brandName}`);
            
            // Update local state
            setBrandScores(prev => ({ ...prev, [brandName]: scoreResponse }));
            
            // Reset retry count on success
            setRetryCount(prev => ({ ...prev, [brandName]: 0 }));
            
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            console.error(`Error fetching score for ${brandName} (attempt ${currentRetries + 1}):`, errorMessage);
            
            // Increment retry count
            setRetryCount(prev => ({ ...prev, [brandName]: currentRetries + 1 }));
            
            // Set error state
            setBrandScores(prev => ({ 
                ...prev, 
                [brandName]: {
                    company_name: brandName,
                    logo_url: getBrandLogo(brandName),
                    overall_score: -1,
                    category_scores: {},
                    summary: `Error: ${errorMessage}`,
                    positives: [],
                    negatives: [],
                    details: {},
                } as EthicalScoreResponse
            }));
        } finally {
            setLoadingScores(prev => ({ ...prev, [brandName]: false }));
        }
    };

    const getScoreColor = (score: number): string => {
        if (score >= 81) return COLORS.resedaGreen;
        if (score >= 61) return COLORS.sage;
        if (score >= 41) return COLORS.teaRose;
        return COLORS.lightCoral;
    };

    const getScoreBackgroundColor = (score: number): string => {
        return getScoreColor(score); // Use solid color like MerchantDetailsScreen
    };

    const getScoreTextColor = (score: number): string => {
        return '#fff'; // Always white text on colored background
    };

    const renderBrandToAvoidItem = ({ item }: { item: string }) => {
        const score = brandScores[item];
        const isLoading = loadingScores[item];
        
        return (
            <TouchableOpacity 
                style={styles.brandToAvoidCard}
                onPress={() => {
                    if (score && score.overall_score >= 0) {
                        // Navigate to merchant details if valid score is available
                        navigation.navigate('MerchantDetails', {
                            merchant: {
                                name: item,
                                ethicalScore: score,
                            },
                        });
                    } else if (!isLoading && (!score || score.overall_score === -1)) {
                        // Check if we've reached the retry limit
                        const currentRetries = retryCount[item] || 0;
                        if (currentRetries < 3) {
                            // Fetch score if not available or if there was an error and under retry limit
                            fetchEthicalScore(item);
                        }
                    }
                }}
                onLongPress={() => {
                    console.log(`Long press on ${item} - clearing cache`);
                    clearBrandCache(item);
                }}
                activeOpacity={0.7}
            >
                {/* Brand Name at Top */}
                <Text style={styles.brandText} numberOfLines={2}>{item}</Text>
                
                {/* Center stack: big score circle with brand logo overlapping its top-right */}
                <View style={styles.centerStack}>
                    <View style={styles.bigCircleWrap}>
                        {isLoading ? (
                            <View style={styles.bigScoreLoading}>
                                <ActivityIndicator size="large" color={COLORS.white} />
                            </View>
                        ) : score ? (
                            score.overall_score >= 0 ? (
                                <View style={[styles.bigScoreCircle, { backgroundColor: getScoreBackgroundColor(score.overall_score) }]}>
                                    <Text style={styles.bigScoreValue}>{score.overall_score}</Text>
                                    <Text style={styles.bigScoreOutOf}>/ 100</Text>
                                </View>
                            ) : (
                                <TouchableOpacity
                                    style={[styles.bigScoreCircle, styles.bigScoreError]}
                                    onPress={() => {
                                        const currentRetries = retryCount[item] || 0;
                                        if (currentRetries < 3) fetchEthicalScore(item);
                                    }}
                                >
                                    <Ionicons name="refresh" size={18} color={COLORS.white} />
                                </TouchableOpacity>
                            )
                        ) : (
                            <TouchableOpacity
                                style={[styles.bigScoreCircle, styles.bigScoreEmpty]}
                                onPress={() => fetchEthicalScore(item)}
                            >
                                <Text style={styles.bigQuestion}>?</Text>
                            </TouchableOpacity>
                        )}

                        {/* Brand logo overlapping top-right of the big circle */}
                        <View style={styles.brandLogoOverlay}>
                            <Image
                                source={{ uri: getBrandLogo(item) }}
                                style={styles.brandLogoOverlayImage}
                                defaultSource={{ uri: 'https://via.placeholder.com/48x48/ffffff/cccccc?text=' + item.charAt(0) }}
                            />
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const renderEthicalAlternativeItem = ({ item }: { item: string }) => {
        const score = brandScores[item];
        const isLoading = loadingScores[item];

        return (
            <TouchableOpacity
                style={styles.ethicalAlternativeCard}
                onPress={() => {
                    if (score && score.overall_score >= 0) {
                        navigation.navigate('MerchantDetails', {
                            merchant: {
                                name: item,
                                ethicalScore: score,
                            },
                        });
                    } else if (!isLoading && (!score || score.overall_score === -1)) {
                        const currentRetries = retryCount[item] || 0;
                        if (currentRetries < 3) fetchEthicalScore(item);
                    }
                }}
                activeOpacity={0.8}
            >
                <Text style={styles.brandText} numberOfLines={2}>{item}</Text>

                <View style={styles.centerStack}>
                    <View style={styles.bigCircleWrap}>
                        {isLoading ? (
                            <View style={styles.bigScoreLoading}>
                                <ActivityIndicator size="large" color={COLORS.white} />
                            </View>
                        ) : score ? (
                            score.overall_score >= 0 ? (
                                <View style={[styles.bigScoreCircle, { backgroundColor: getScoreBackgroundColor(score.overall_score) }]}>
                                    <Text style={styles.bigScoreValue}>{score.overall_score}</Text>
                                    <Text style={styles.bigScoreOutOf}>/ 100</Text>
                                </View>
                            ) : (
                                <TouchableOpacity
                                    style={[styles.bigScoreCircle, styles.bigScoreError]}
                                    onPress={() => {
                                        const currentRetries = retryCount[item] || 0;
                                        if (currentRetries < 3) fetchEthicalScore(item);
                                    }}
                                >
                                    <Ionicons name="refresh" size={18} color={COLORS.white} />
                                </TouchableOpacity>
                            )
                        ) : (
                            <TouchableOpacity
                                style={[styles.bigScoreCircle, styles.bigScoreEmpty]}
                                onPress={() => fetchEthicalScore(item)}
                            >
                                <Text style={styles.bigQuestion}>?</Text>
                            </TouchableOpacity>
                        )}

                        <View style={styles.brandLogoOverlay}>
                            <Image
                                source={{ uri: getBrandLogo(item) }}
                                style={styles.brandLogoOverlayImage}
                                defaultSource={{ uri: 'https://via.placeholder.com/48x48/ffffff/cccccc?text=' + item.charAt(0) }}
                            />
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const renderSubcategoryItem = ({ item }: { item: string }) => (
        <TouchableOpacity 
            style={styles.subcategoryCard}
            onPress={() => navigation.navigate('CategoryDetails', { 
                categoryName, 
                subcategoryName: item 
            })}
        >
            <View style={styles.subcategoryContent}>
                <Text style={styles.subcategoryName}>{item}</Text>
                <Ionicons name="chevron-forward" size={20} color={COLORS.sage} />
            </View>
        </TouchableOpacity>
    );

    return (
        <ScrollView 
            style={styles.container} 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.headerRow}>
                <TouchableOpacity 
                    style={styles.backButton} 
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.7}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Ionicons name="arrow-back" size={24} color={COLORS.darkText} />
                </TouchableOpacity>
                <Text style={styles.header}>{categoryName}</Text>
                <View style={styles.placeholder} />
            </View>
            
            {categoryBrands && (
                <>
                    {/* Brands to Avoid Section */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="warning" size={20} color={COLORS.lightCoral} />
                            <Text style={styles.sectionTitle}>brands to avoid</Text>
                        </View>
                        <FlatList
                            data={categoryBrands.brandsToAvoid}
                            keyExtractor={(item, index) => `avoid-${index}`}
                            renderItem={renderBrandToAvoidItem}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.horizontalList}
                        />
                    </View>

                    {/* Ethical Alternatives Section */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="leaf" size={20} color={COLORS.resedaGreen} />
                            <Text style={styles.sectionTitle}>ethical alternatives</Text>
                        </View>
                        <FlatList
                            data={categoryBrands.ethicalAlternatives}
                            keyExtractor={(item, index) => `ethical-${index}`}
                            renderItem={renderEthicalAlternativeItem}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.horizontalList}
                        />
                    </View>
                </>
            )}
            
            {/* Subcategories Section */}
            <View style={styles.section}>
                <Text style={styles.subcategoriesTitle}>browse by category</Text>
                <View style={styles.subcategoriesList}>
                    {subcategories.map((subcategory, index) => (
                        <TouchableOpacity 
                            key={index}
                            style={styles.subcategoryCard}
                            onPress={() => navigation.navigate('CategoryDetails', { 
                                categoryName, 
                                subcategoryName: subcategory 
                            })}
                        >
                            <View style={styles.subcategoryContent}>
                                <Text style={styles.subcategoryName}>{subcategory}</Text>
                                <Ionicons name="chevron-forward" size={20} color={COLORS.sage} />
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.lavenderBlush,
        paddingTop: 40,
    },
    scrollContent: {
        paddingBottom: 30,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 8,
        justifyContent: 'space-between',
    },
    backButton: {
        padding: 8,
        borderRadius: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.darkText,
        textAlign: 'center',
        flex: 1,
    },
    placeholder: {
        width: 40, // Same width as back button for centering
    },
    section: {
        marginBottom: 24,
        paddingHorizontal: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.darkText,
        marginLeft: 8,
    },
    horizontalList: {
        paddingRight: 16,
    },
    brandLogo: {
        width: 50,
        height: 50,
        borderRadius: 12,
        marginBottom: 12,
        backgroundColor: COLORS.white,
    },
    brandToAvoidCard: {
        backgroundColor: 'transparent',
        borderRadius: 0,
        padding: 0,
        marginRight: 12,
        width: 160,
        height: 180,
        borderWidth: 0,
        elevation: 0,
        shadowColor: 'transparent',
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    brandText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.darkText,
        textAlign: 'center',
        lineHeight: 18,
        minHeight: 36, // Reserve space for 2 lines
    },
    scoreCircleContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scoreCircle: {
        width: 90,
        height: 90,
        borderRadius: 45,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    scoreValue: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
    },
    scoreOutOf: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.8)',
        marginTop: -4,
    },
    loadingCircle: {
        width: 90,
        height: 90,
        borderRadius: 45,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.grey + '20',
        borderWidth: 2,
        borderColor: COLORS.grey,
    },
    errorCircle: {
        backgroundColor: COLORS.lightCoral + '20',
        borderWidth: 2,
        borderColor: COLORS.lightCoral,
    },
    emptyCircle: {
        backgroundColor: COLORS.grey + '20',
        borderWidth: 2,
        borderColor: COLORS.grey,
    },
    brandLogoCorner: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: COLORS.white,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        borderWidth: 1,
        borderColor: COLORS.grey + '30',
    },
    brandLogoSmall: {
        width: 28,
        height: 28,
        borderRadius: 14,
    },
    logoScoreContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        width: '100%',
    },
    brandLogoCenter: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    brandLogoMain: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.grey + '30',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    brandLogoImage: {
        width: 80,
        height: 80,
        resizeMode: 'contain',
    },
    /* old corner score styles removed - replaced by centered big score styles */
    /* New centered big score + overlay styles */
    centerStack: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    bigCircleWrap: {
        width: 120,
        height: 120,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bigScoreCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 6,
    },
    bigScoreValue: {
        fontSize: 40,
        fontWeight: '700',
        color: COLORS.white,
    },
    bigScoreOutOf: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.9)',
        marginTop: -6,
    },
    bigScoreLoading: {
        width: 120,
        height: 120,
        borderRadius: 60,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.grey + '10',
    },
    bigScoreError: {
        backgroundColor: COLORS.lightCoral,
    },
    bigScoreEmpty: {
        backgroundColor: COLORS.grey,
    },
    bigQuestion: {
        fontSize: 36,
        fontWeight: '700',
        color: COLORS.white,
    },
    brandLogoOverlay: {
        position: 'absolute',
        top: -12,
        right: -12,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: COLORS.white,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: COLORS.grey + '20',
    },
    brandLogoOverlayImage: {
        width: 48,
        height: 48,
        borderRadius: 24,
        resizeMode: 'cover',
    },
    scoreContainer: {
        marginTop: 8,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 40,
    },
    scoreDisplay: {
        alignItems: 'center',
    },
    scoreText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    scoreLabel: {
        fontSize: 10,
        color: COLORS.darkText,
        opacity: 0.7,
        textAlign: 'center',
        marginTop: 2,
    },
    tapToScore: {
        fontSize: 10,
        color: COLORS.lightCoral,
        textAlign: 'center',
        textDecorationLine: 'underline',
        marginTop: 4,
    },
    brandLogoContainer: {
        position: 'relative',
        alignItems: 'center',
        marginBottom: 12,
    },
    ethicalAlternativeCard: {

        backgroundColor: 'transparent',
        borderRadius: 0,
        padding: 0,
        marginRight: 12,
        width: 160,
        height: 180,
        borderWidth: 0,
        elevation: 0,
        shadowColor: 'transparent',
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    subcategoriesTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.darkText,
        marginBottom: 12,
    },
    subcategoriesList: {
        // Container for subcategories
    },
    subcategoryCard: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
    },
    subcategoryContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    subcategoryName: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.darkText,
        flex: 1,
    },
});