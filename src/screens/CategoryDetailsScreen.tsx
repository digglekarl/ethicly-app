
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { COLORS } from '../styles/colors';

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
    MerchantDetails: { merchant: { name: string; ethicalScore: string } };
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

    useEffect(() => {
        const data = subcategoryBrandsData[subcategoryName];
        setSubcategoryData(data || null);
    }, [subcategoryName]);

    const renderBrandToAvoidItem = ({ item }: { item: string }) => (
        <View style={styles.brandCard}>
            <View style={styles.logoContainer}>
                <Image
                    source={{
                        uri: getBrandLogo(item),
                    }}
                    style={styles.brandLogo}
                    onError={() => {}}
                />
                <View style={styles.logoFallback}>
                    <Text style={styles.logoFallbackText}>{item.charAt(0).toUpperCase()}</Text>
                </View>
            </View>
            <Text style={styles.brandName} numberOfLines={2}>{item}</Text>
        </View>
    );

    const renderEthicalAlternativeItem = ({ item }: { item: string }) => (
        <View style={[styles.brandCard, styles.alternativeCard]}>
            <View style={styles.logoContainer}>
                <Image
                    source={{
                        uri: getBrandLogo(item),
                    }}
                    style={styles.brandLogo}
                    onError={() => {}}
                />
                <View style={styles.logoFallback}>
                    <Text style={styles.logoFallbackText}>{item.charAt(0).toUpperCase()}</Text>
                </View>
            </View>
            <Text style={styles.brandName} numberOfLines={2}>{item}</Text>
        </View>
    );

    return (
        <ScrollView style={styles.container}>
            <View style={styles.headerRow}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={28} color="#222" />
                </TouchableOpacity>
                <Text style={styles.header}>{subcategoryName}</Text>
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
        backgroundColor: COLORS.lavenderBlush 
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
        textAlign: 'center' 
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
    // ...existing code...
