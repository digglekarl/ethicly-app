import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { COLORS } from '../styles/colors';
import { categories, getSubcategories } from '../data/categories';

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
    MerchantDetails: { merchant: { name: string; ethicalScore: string } };
};

type Props = NativeStackScreenProps<CategoryStackParamList, 'Subcategories'>;

export default function SubcategoriesScreen({ route, navigation }: Props) {
    const { categoryName } = route.params;
    const [subcategories, setSubcategories] = useState<string[]>([]);
    const [categoryBrands, setCategoryBrands] = useState<{ brandsToAvoid: string[]; ethicalAlternatives: string[] } | null>(null);

    useEffect(() => {
        const subcats = getSubcategories(categoryName);
        setSubcategories(subcats);
        
        // Get brands data for this category
        const brandsData = categoryBrandsData[categoryName];
        setCategoryBrands(brandsData || null);
    }, [categoryName]);

    const renderBrandToAvoidItem = ({ item }: { item: string }) => (
        <View style={styles.brandToAvoidCard}>
            <Image 
                source={{ uri: getBrandLogo(item) }} 
                style={styles.brandLogo}
                defaultSource={{ uri: 'https://via.placeholder.com/40x40/cccccc/ffffff?text=?' }}
            />
            <Text style={styles.brandText} numberOfLines={2}>{item}</Text>
        </View>
    );

    const renderEthicalAlternativeItem = ({ item }: { item: string }) => (
        <View style={styles.ethicalAlternativeCard}>
            <Image 
                source={{ uri: getBrandLogo(item) }} 
                style={styles.brandLogo}
                defaultSource={{ uri: 'https://via.placeholder.com/40x40/cccccc/ffffff?text=?' }}
            />
            <Text style={styles.brandText} numberOfLines={2}>{item}</Text>
        </View>
    );

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
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.headerRow}>
                <TouchableOpacity 
                    style={styles.backButton} 
                    onPress={() => navigation.goBack()}
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
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 8,
        justifyContent: 'space-between',
    },
    backButton: {
        padding: 8,
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
    brandText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.darkText,
        textAlign: 'center',
        lineHeight: 18,
    },
    brandToAvoidCard: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 16,
        marginRight: 12,
        width: 120,
        minHeight: 120,
        borderWidth: 2,
        borderColor: COLORS.lightCoral,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        alignItems: 'center',
        justifyContent: 'center',
    },
    ethicalAlternativeCard: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 16,
        marginRight: 12,
        width: 120,
        minHeight: 120,
        borderWidth: 2,
        borderColor: COLORS.resedaGreen,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        alignItems: 'center',
        justifyContent: 'center',
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