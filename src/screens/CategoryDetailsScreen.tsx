
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { COLORS } from '../styles/colors';
import useSearchStore, { EthicalScoreResponse } from '../store/searchStore';
import { getEthicalScore } from '../api/groqSystemPrompt';
import { ethicalScoreUserPrompt } from '../api/ethicalScoreUserPrompt';

// Function to get brand logo URL (same as in SubcategoriesScreen)
const getBrandLogo = (brandName: string): string => {
    const cleanName = brandName
        .toLowerCase()
        .replace(/['\(\)]/g, '')
        .replace(/\s+/g, '')
        .replace(/&/g, 'and')
        .split('(')[0]
        .trim();
    
    const brandMappings: Record<string, string> = {
        'coca-cola': 'coca-cola.com',
        'nestle': 'nestle.com',
        'pepsico': 'pepsi.com',
        'unilever': 'unilever.com',
        'mondelez': 'mondelezinternational.com',
        'tropicana': 'tropicana.com',
        'minutemaid': 'minutemaid.com',
        'capri-sun': 'caprisun.com',
        'innocent': 'innocentdrinks.co.uk',
        'oceanspray': 'oceanspray.com',
        'naked': 'nakedjuice.com',
        'boost': 'boost.com',
        'piporganic': 'pip-organic.com',
        'jameswhitejuices': 'jameswhite.co.uk',
        'rudehealth': 'rudehealth.com',
        'theberrycompany': 'theberrycompany.co.uk',
        'belvoirfruitfarms': 'belvoirfruitfarms.co.uk',
        'graze': 'graze.com',
        'crussh': 'crussh.com',
        'lipton': 'lipton.com',
        'tetley': 'tetley.co.uk',
        'twinings': 'twinings.co.uk',
        'pgtips': 'pgtips.co.uk',
        'yorkshiretea': 'yorkshiretea.co.uk',
        'clipper': 'clipperteas.com',
        'pukkaherbs': 'pukkaherbs.com',
        'teapigs': 'teapigs.co.uk',
        'mcdonalds': 'mcdonalds.com',
        'starbucks': 'starbucks.com',
        'kfc': 'kfc.com',
        'unionhand-roasted': 'unionroasted.com',
        'cafedirect': 'cafedirect.co.uk',
        'pactcoffee': 'pactcoffee.com',
        'perkyblenders': 'perkyblenders.com',
        'origincoffee': 'origincoffee.co.uk',
        'zara': 'zara.com',
        'handm': 'hm.com',
        'primark': 'primark.com',
        'topshop': 'topshop.com',
        'boohoo': 'boohoo.com',
        'peopletree': 'peopletree.co.uk',
        'thought': 'thought.com',
        'patagonia': 'patagonia.com',
        'armedangels': 'armedangels.com',
        'nike': 'nike.com',
        'adidas': 'adidas.com',
        'puma': 'puma.com',
        'newbalance': 'newbalance.com',
        'converse': 'converse.com',
        'veja': 'veja-store.com',
        'allbirds': 'allbirds.com',
        'rothys': 'rothys.com',
        'apple': 'apple.com',
        'samsung': 'samsung.com',
        'huawei': 'huawei.com',
        'xiaomi': 'mi.com',
        'oneplus': 'oneplus.com',
        'fairphone': 'fairphone.com',
        'dell': 'dell.com',
        'hp': 'hp.com',
        'lenovo': 'lenovo.com',
        'asus': 'asus.com',
        'framework': 'frame.work',
        'system76': 'system76.com',
        'tesco': 'tesco.com',
        'sainsburys': 'sainsburys.co.uk',
        'asda': 'asda.com',
        'morrisons': 'morrisons.com',
        'lidl': 'lidl.co.uk',
        'waitrose': 'waitrose.com',
        'coop': 'coop.co.uk',
        'planetorganic': 'planetorganic.com',
        'marksandspencer': 'marksandspencer.com',
        'amazon': 'amazon.com',
        'ebay': 'ebay.com',
        'aliexpress': 'aliexpress.com',
        'etsy': 'etsy.com',
        'depop': 'depop.com',
        'vinted': 'vinted.com',
        'hsbc': 'hsbc.com',
        'barclays': 'barclays.co.uk',
        'jpmorgan': 'jpmorgan.com',
        'triodos': 'triodos.co.uk',
        'cooperativebank': 'co-operativebank.co.uk',
        'starlingbank': 'starlingbank.com',
        'monzo': 'monzo.com'
    };
    
    const domain = brandMappings[cleanName] || `${cleanName}.com`;
    return `https://logo.clearbit.com/${domain}`;
};

// Subcategory brand data
const subcategoryBrandsData: Record<string, { brandsToAvoid: string[]; ethicalAlternatives: string[] }> = {
    'Juice': {
        brandsToAvoid: ['Tropicana', 'Minute Maid', 'Capri-Sun', 'Innocent (Coca-Cola)', 'Ocean Spray'],
        ethicalAlternatives: ['Pip Organic', 'James White Juices', 'Rude Health', 'The Berry Company', 'Belvoir Fruit Farms']
    },
    'Smoothies': {
        brandsToAvoid: ['Innocent (Coca-Cola)', 'Naked (PepsiCo)', 'Tropicana Smoothies', 'Boost', 'Simply Smoothies'],
        ethicalAlternatives: ['Graze', 'Crussh', 'Jamba Juice (Organic)', 'Green Smoothie Co', 'Pip & Nut']
    },
    'Tea': {
        brandsToAvoid: ['Lipton (Unilever)', 'Tetley (Tata)', 'Twinings (ABF)', 'PG Tips (Unilever)', 'Yorkshire Tea (Taylors)'],
        ethicalAlternatives: ['Clipper', 'Pukka Herbs', 'Higher Living', 'Teapigs', 'The London Tea Company']
    },
    'Coffee': {
        brandsToAvoid: ['Nescafé (Nestlé)', 'Douwe Egberts (JDE)', 'Starbucks', 'Kenco (Mondelez)', 'Lavazza'],
        ethicalAlternatives: ['Union Hand-Roasted', 'Cafédirect', 'Pact Coffee', 'Perky Blenders', 'Origin Coffee']
    },
    'Fast Fashion': {
        brandsToAvoid: ['H&M', 'Zara', 'Primark', 'Topshop', 'Boohoo'],
        ethicalAlternatives: ['People Tree', 'Thought', 'Kowtow', 'Patagonia', 'Armedangels']
    },
    'Designer Clothing': {
        brandsToAvoid: ['Balenciaga', 'Gucci (Kering)', 'Louis Vuitton (LVMH)', 'Prada', 'Versace'],
        ethicalAlternatives: ['Stella McCartney', 'Eileen Fisher', 'Gabriela Hearst', 'Mother of Pearl', 'Nanushka']
    },
    'Footwear': {
        brandsToAvoid: ['Nike', 'Adidas', 'Puma', 'New Balance', 'Converse (Nike)'],
        ethicalAlternatives: ['Veja', 'Allbirds', 'Rothy\'s', 'Kotn', 'Everlane']
    },
    'Mobile Phones': {
        brandsToAvoid: ['Apple', 'Samsung', 'Huawei', 'Xiaomi', 'OnePlus'],
        ethicalAlternatives: ['Fairphone', 'Shiftphone', 'Teracube', 'Pine64', 'Gigaset']
    },
    'Laptops': {
        brandsToAvoid: ['Apple MacBook', 'Dell', 'HP', 'Lenovo', 'Asus'],
        ethicalAlternatives: ['Framework Laptop', 'System76', 'Purism', 'ThinkPenguin', 'Fairphone Laptop']
    },
    'Supermarket': {
        brandsToAvoid: ['Tesco', 'Sainsbury\'s', 'ASDA', 'Morrisons', 'Lidl'],
        ethicalAlternatives: ['Waitrose & Partners', 'Co-op', 'Planet Organic', 'Marks & Spencer (ethical range)', 'Booths']
    },
    'Fast Food': {
        brandsToAvoid: ['McDonald\'s', 'KFC', 'Burger King', 'Subway', 'Domino\'s'],
        ethicalAlternatives: ['LEON', 'Byron Burger (ethical sourcing)', 'Pret a Manger (sustainable lines)', 'Honest Burgers', 'The Good Food Chain']
    },
    'Online Retailers': {
        brandsToAvoid: ['Amazon', 'eBay', 'AliExpress', 'Wish', 'Temu'],
        ethicalAlternatives: ['Etsy', 'Depop', 'Vinted', 'ThredUp', 'The Citizenry']
    },
    'Banking': {
        brandsToAvoid: ['HSBC', 'Barclays', 'JP Morgan Chase', 'Wells Fargo', 'Bank of America'],
        ethicalAlternatives: ['Triodos Bank', 'Co-operative Bank', 'Ecology Building Society', 'Starling Bank', 'Monzo']
    },
    'Insurance': {
        brandsToAvoid: ['AIG', 'Allianz', 'AXA', 'Zurich', 'Aviva'],
        ethicalAlternatives: ['Co-op Insurance', 'NFU Mutual', 'LV=', 'John Lewis Finance', 'Ecclesiastical']
    },
    'Investment': {
        brandsToAvoid: ['BlackRock', 'Vanguard', 'State Street', 'JP Morgan Asset Management', 'Goldman Sachs'],
        ethicalAlternatives: ['Vanguard ESG', 'iShares MSCI KLD 400 Social ETF', 'Triodos Investment Management', 'Steward Partners', 'Kames Capital']
    }
    // Add more subcategories as needed...
};

type CategoryStackParamList = {
    CategoriesList: undefined;
    Subcategories: { categoryName: string };
    CategoryDetails: { categoryName: string; subcategoryName: string };
    MerchantDetails: { merchant: { name: string; ethicalScore: EthicalScoreResponse; logo?: string } };
};

type Props = NativeStackScreenProps<CategoryStackParamList, 'CategoryDetails'>;

interface EthicalCompany {
    brand: string;
    rating: string;
    // ...existing code...
}

export default function CategoryDetailsScreen({ route, navigation }: Props) {
    const { categoryName, subcategoryName } = route.params;
    const [subcategoryData, setSubcategoryData] = useState<{brandsToAvoid: string[]; ethicalAlternatives: string[]} | null>(null);

    // Score/cache state (mirrors SubcategoriesScreen behavior)
    const [brandScores, setBrandScores] = useState<Record<string, EthicalScoreResponse | null>>({});
    const [loadingScores, setLoadingScores] = useState<Record<string, boolean>>({});
    const [retryCount, setRetryCount] = useState<Record<string, number>>({});
    const { searchCache, addSearch } = useSearchStore();

    useEffect(() => {
        // Initialize brand scores from cache when subcategory data loads
        if (subcategoryData?.brandsToAvoid) {
            const scores: Record<string, EthicalScoreResponse | null> = {};
            subcategoryData.brandsToAvoid.forEach(brand => {
                if (searchCache[brand]) scores[brand] = searchCache[brand];
                else scores[brand] = null;
            });
            setBrandScores(scores);
        }

        if (subcategoryData?.ethicalAlternatives) {
            const scores2: Record<string, EthicalScoreResponse | null> = {};
            subcategoryData.ethicalAlternatives.forEach(brand => {
                if (searchCache[brand]) scores2[brand] = searchCache[brand];
                else scores2[brand] = null;
            });
            setBrandScores(prev => ({ ...prev, ...scores2 }));
        }
    }, [subcategoryData]);

    // Update local state when global cache changes
    useEffect(() => {
        if (!subcategoryData) return;
        const updated: Record<string, EthicalScoreResponse | null> = { ...brandScores };
        let hasUpdates = false;

        [...(subcategoryData.brandsToAvoid || []), ...(subcategoryData.ethicalAlternatives || [])].forEach(brand => {
            const cached = searchCache[brand];
            const current = brandScores[brand];
            if (cached && (!current || current.overall_score === -1)) {
                updated[brand] = cached;
                hasUpdates = true;
            }
        });

        if (hasUpdates) setBrandScores(updated);
    }, [searchCache, subcategoryData]);

    useEffect(() => {
        const data = subcategoryBrandsData[subcategoryName];
        setSubcategoryData(data || null);
    }, [subcategoryName]);

    // On mount / when subcategoryData becomes available, prefetch missing scores
    useEffect(() => {
        if (!subcategoryData) return;

        const allBrands = [ ...(subcategoryData.brandsToAvoid || []), ...(subcategoryData.ethicalAlternatives || []) ];
        // Stagger requests to avoid hitting the API all at once
        allBrands.forEach((brand, idx) => {
            const cached = searchCache[brand];
            const local = brandScores[brand];

            // If already cached globally or we have a valid local score, skip
            if (cached || (local && local.overall_score >= 0)) return;

            // Schedule fetch with a small stagger (300ms increments)
            const delay = Math.min(300 * idx, 3000);
            setTimeout(() => {
                // Double-check before fetching
                if (!useSearchStore.getState().searchCache[brand] && !(brandScores[brand] && brandScores[brand]!.overall_score >= 0)) {
                    fetchEthicalScore(brand);
                }
            }, delay);
        });
    }, [subcategoryData]);

    const renderBrandToAvoidItem = ({ item }: { item: string }) => (
        <TouchableOpacity
            style={styles.brandToAvoidCard}
            activeOpacity={0.8}
            onPress={() => {
                const score = brandScores[item];
                const isLoading = loadingScores[item];
                if (score && score.overall_score >= 0) {
                    navigation.navigate('MerchantDetails', { merchant: { name: item, ethicalScore: score } });
                } else if (!isLoading) {
                    const currentRetries = retryCount[item] || 0;
                    if (currentRetries < 3) fetchEthicalScore(item);
                }
            }}
            onLongPress={() => clearBrandCache(item)}
        >
            <Text style={styles.brandText} numberOfLines={2}>{item}</Text>

            <View style={styles.centerStack}>
                <View style={styles.bigCircleWrap}>
                    {loadingScores[item] ? (
                        <View style={styles.bigScoreLoading}>
                            <ActivityIndicator size="large" color={COLORS.white} />
                        </View>
                    ) : brandScores[item] ? (
                        brandScores[item]!.overall_score >= 0 ? (
                            <View style={[styles.bigScoreCircle, { backgroundColor: getScoreBackgroundColor(brandScores[item]!.overall_score) }]}>
                                <Text style={styles.bigScoreValue}>{brandScores[item]!.overall_score}</Text>
                                <Text style={styles.bigScoreOutOf}>/ 100</Text>
                            </View>
                        ) : (
                            <TouchableOpacity style={[styles.bigScoreCircle, styles.bigScoreError]} onPress={() => {
                                const currentRetries = retryCount[item] || 0;
                                if (currentRetries < 3) fetchEthicalScore(item);
                            }}>
                                <Ionicons name="refresh" size={18} color={COLORS.white} />
                            </TouchableOpacity>
                        )
                    ) : (
                        <TouchableOpacity style={[styles.bigScoreCircle, styles.bigScoreEmpty]} onPress={() => fetchEthicalScore(item)}>
                            <Text style={styles.bigQuestion}>?</Text>
                        </TouchableOpacity>
                    )}

                    <View style={styles.brandLogoOverlay}>
                        <Image source={{ uri: getBrandLogo(item) }} style={styles.brandLogoOverlayImage} />
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    const renderEthicalAlternativeItem = ({ item }: { item: string }) => (
        <TouchableOpacity
            style={styles.ethicalAlternativeCard}
            activeOpacity={0.8}
            onPress={() => {
                const score = brandScores[item];
                const isLoading = loadingScores[item];
                if (score && score.overall_score >= 0) {
                    navigation.navigate('MerchantDetails', { merchant: { name: item, ethicalScore: score } });
                } else if (!isLoading) {
                    const currentRetries = retryCount[item] || 0;
                    if (currentRetries < 3) fetchEthicalScore(item);
                }
            }}
        >
            <Text style={styles.brandText} numberOfLines={2}>{item}</Text>

            <View style={styles.centerStack}>
                <View style={styles.bigCircleWrap}>
                    {loadingScores[item] ? (
                        <View style={styles.bigScoreLoading}>
                            <ActivityIndicator size="large" color={COLORS.white} />
                        </View>
                    ) : brandScores[item] ? (
                        brandScores[item]!.overall_score >= 0 ? (
                            <View style={[styles.bigScoreCircle, { backgroundColor: getScoreBackgroundColor(brandScores[item]!.overall_score) }]}>
                                <Text style={styles.bigScoreValue}>{brandScores[item]!.overall_score}</Text>
                                <Text style={styles.bigScoreOutOf}>/ 100</Text>
                            </View>
                        ) : (
                            <TouchableOpacity style={[styles.bigScoreCircle, styles.bigScoreError]} onPress={() => {
                                const currentRetries = retryCount[item] || 0;
                                if (currentRetries < 3) fetchEthicalScore(item);
                            }}>
                                <Ionicons name="refresh" size={18} color={COLORS.white} />
                            </TouchableOpacity>
                        )
                    ) : (
                        <TouchableOpacity style={[styles.bigScoreCircle, styles.bigScoreEmpty]} onPress={() => fetchEthicalScore(item)}>
                            <Text style={styles.bigQuestion}>?</Text>
                        </TouchableOpacity>
                    )}

                    <View style={styles.brandLogoOverlay}>
                        <Image source={{ uri: getBrandLogo(item) }} style={styles.brandLogoOverlayImage} />
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    const clearBrandCache = (brandName: string) => {
        const currentCache = useSearchStore.getState().searchCache;
        const { [brandName]: removed, ...remaining } = currentCache;
        useSearchStore.setState({ searchCache: remaining });
        setBrandScores(prev => ({ ...prev, [brandName]: null }));
        setRetryCount(prev => ({ ...prev, [brandName]: 0 }));
    };

    const fetchEthicalScore = async (brandName: string) => {
        if (loadingScores[brandName]) return;
        if (brandScores[brandName] && brandScores[brandName]!.overall_score >= 0) return;
        if (searchCache[brandName]) {
            setBrandScores(prev => ({ ...prev, [brandName]: searchCache[brandName] }));
            return;
        }
        const currentRetries = retryCount[brandName] || 0;
        if (currentRetries >= 2) return;

        setLoadingScores(prev => ({ ...prev, [brandName]: true }));
        try {
            const userPrompt = ethicalScoreUserPrompt.replace('{searchTerm}', brandName);
            const raw = await getEthicalScore(userPrompt);
            if (!raw || raw.includes('Error:') || raw.includes('Network Error') || raw.trim() === '') {
                throw new Error(`Invalid API response for ${brandName}`);
            }

            let scoreResponse: EthicalScoreResponse;
            try {
                scoreResponse = JSON.parse(raw as unknown as string);
            } catch (e) {
                const jsonMatch = (raw as string).match(/```json\s*([\s\S]*?)\s*```/);
                if (jsonMatch && jsonMatch[1]) scoreResponse = JSON.parse(jsonMatch[1]);
                else {
                    const start = (raw as string).indexOf('{');
                    const end = (raw as string).lastIndexOf('}');
                    if (start !== -1 && end !== -1 && end > start) {
                        const jsonString = (raw as string).substring(start, end + 1);
                        scoreResponse = JSON.parse(jsonString);
                    } else {
                        const scoreMatch = (raw as string).match(/([0-9]{1,3})\s*\/\s*100/);
                        const scoreMatch2 = (raw as string).match(/overall\s*score[:\s]*([0-9]{1,3})/i) || (raw as string).match(/score[:\s]*([0-9]{1,3})/i);
                        const numeric = scoreMatch ? scoreMatch[1] : (scoreMatch2 ? scoreMatch2[1] : null);
                        if (numeric) {
                            const parsedNum = Math.max(0, Math.min(100, parseInt(numeric, 10)));
                            scoreResponse = {
                                company_name: brandName,
                                overall_score: parsedNum,
                                category_scores: { environment: parsedNum, labor_and_human_rights: parsedNum, animal_welfare: parsedNum, social_responsibility: parsedNum, corporate_governance: parsedNum },
                                details: {},
                                positives: [],
                                negatives: [],
                                ethical_alternative: { name: '', reason: '' },
                                logo_url: getBrandLogo(brandName),
                                summary: `Synthesized score from model text: ${parsedNum}`
                            } as EthicalScoreResponse;
                        } else {
                            throw new Error('No valid JSON found in response');
                        }
                    }
                }
            }

            if (typeof scoreResponse.overall_score !== 'number' || scoreResponse.overall_score < 0 || scoreResponse.overall_score > 100) {
                throw new Error(`Invalid score value: ${scoreResponse.overall_score}`);
            }

            scoreResponse.logo_url = scoreResponse.logo_url || getBrandLogo(brandName);
            scoreResponse.company_name = scoreResponse.company_name || brandName;

            addSearch(brandName, scoreResponse);
            setBrandScores(prev => ({ ...prev, [brandName]: scoreResponse }));
            setRetryCount(prev => ({ ...prev, [brandName]: 0 }));
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Unknown error';
            setRetryCount(prev => ({ ...prev, [brandName]: (retryCount[brandName] || 0) + 1 }));
            setBrandScores(prev => ({ ...prev, [brandName]: { company_name: brandName, logo_url: getBrandLogo(brandName), overall_score: -1, category_scores: {}, summary: `Error: ${message}`, positives: [], negatives: [], details: {} } as EthicalScoreResponse }));
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

    const getScoreBackgroundColor = (score: number): string => getScoreColor(score);

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
                    <Ionicons name="arrow-back" size={28} color="#222" />
                </TouchableOpacity>
                <Text style={styles.header}>{subcategoryName}</Text>
                <View style={styles.placeholder} />
            </View>

            {subcategoryData ? (
                <>
                    {/* Brands to Avoid Section */}
                    {subcategoryData.brandsToAvoid && subcategoryData.brandsToAvoid.length > 0 && (
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Ionicons name="warning" size={20} color={COLORS.lightCoral} />
                                <Text style={styles.sectionTitle}>brands to avoid</Text>
                            </View>
                            <FlatList
                                data={subcategoryData.brandsToAvoid.slice(0, 5)}
                                keyExtractor={(item, index) => `avoid-${index}`}
                                renderItem={renderBrandToAvoidItem}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.carouselContent}
                            />
                        </View>
                    )}

                    {/* Ethical Alternatives Section */}
                    {subcategoryData.ethicalAlternatives && subcategoryData.ethicalAlternatives.length > 0 && (
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Ionicons name="leaf" size={20} color={COLORS.resedaGreen} />
                                <Text style={styles.sectionTitle}>ethical alternatives</Text>
                            </View>
                            <FlatList
                                data={subcategoryData.ethicalAlternatives.slice(0, 5)}
                                keyExtractor={(item, index) => `alternative-${index}`}
                                renderItem={renderEthicalAlternativeItem}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.carouselContent}
                            />
                        </View>
                    )}

                    {/* Detailed Information */}
                    <View style={styles.detailSection}>
                        <Text style={styles.detailTitle}>Why Choose Ethical Alternatives?</Text>
                        <Text style={styles.detailText}>
                            Ethical alternatives in the {subcategoryName.toLowerCase()} category focus on:
                        </Text>
                        <View style={styles.bulletPoint}>
                            <Text style={styles.bullet}>• </Text>
                            <Text style={styles.bulletText}>Fair trade and worker rights</Text>
                        </View>
                        <View style={styles.bulletPoint}>
                            <Text style={styles.bullet}>• </Text>
                            <Text style={styles.bulletText}>Environmental sustainability</Text>
                        </View>
                        <View style={styles.bulletPoint}>
                            <Text style={styles.bullet}>• </Text>
                            <Text style={styles.bulletText}>Transparent supply chains</Text>
                        </View>
                        <View style={styles.bulletPoint}>
                            <Text style={styles.bullet}>• </Text>
                            <Text style={styles.bulletText}>Social responsibility</Text>
                        </View>
                    </View>
                </>
            ) : (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No brand data available for {subcategoryName}.</Text>
                    <Text style={styles.emptySubtext}>Check back soon for more ethical shopping recommendations!</Text>
                </View>
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
    scrollContent: {
        paddingBottom: 30,
    },
    headerRow: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginBottom: 16, 
        marginTop: 16, 
        paddingHorizontal: 16,
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
        flex: 1, 
        textAlign: 'center' 
    },
    placeholder: {
        width: 44, // Same width as back button for centering
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
    carouselContent: {
        paddingLeft: 0,
        paddingRight: 16,
    },
    brandCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        marginRight: 12,
        width: 120,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
    },
    alternativeCard: {
        borderColor: COLORS.sage,
        borderWidth: 1,
    },
    brandLogo: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginBottom: 8,
    },
    logoContainer: {
        position: 'relative',
        width: 60,
        height: 60,
        marginBottom: 8,
    },
    logoFallback: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 30,
        backgroundColor: COLORS.sage,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: -1,
    },
    logoFallbackText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    brandName: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.darkText,
        textAlign: 'center',
        lineHeight: 18,
    },

    /* Styles for big centered score + overlapping logo (copied from SubcategoriesScreen) */
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
        minHeight: 36,
    },
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
    detailSection: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 16,
        marginBottom: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
    },
    detailTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.darkText,
        marginBottom: 8,
    },
    detailText: {
        fontSize: 16,
        color: COLORS.darkText,
        marginBottom: 12,
        lineHeight: 22,
    },
    bulletPoint: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 6,
    },
    bullet: {
        fontSize: 16,
        color: COLORS.sage,
        fontWeight: 'bold',
        marginRight: 4,
    },
    bulletText: {
        fontSize: 16,
        color: COLORS.darkText,
        flex: 1,
        lineHeight: 22,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
        paddingHorizontal: 32,
    },
    emptyText: {
        fontSize: 18,
        color: COLORS.darkText,
        textAlign: 'center',
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 16,
        color: COLORS.darkText,
        textAlign: 'center',
        opacity: 0.7,
    },
});
