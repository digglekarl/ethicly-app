
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { COLORS } from '../styles/colors';
import allCategoriesData from '../data/all_categories.json';

type CategoryStackParamList = {
    CategoriesList: undefined;
    CategoryDetails: { categoryName: string };
    MerchantDetails: { merchant: { name: string; ethicalScore: string } };
};

type Props = NativeStackScreenProps<CategoryStackParamList, 'CategoryDetails'>;

interface EthicalCompany {
    brand: string;
    rating: string;
    // ...existing code...
}

export default function CategoryDetailsScreen({ route, navigation }: Props) {
    const { categoryName } = route.params;
    const [categoryData, setCategoryData] = useState<any>(null);

    useEffect(() => {
        const found = allCategoriesData.find((cat: any) => cat.category === categoryName);
        setCategoryData(found);
    }, [categoryName]);

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={28} color="#222" />
                </TouchableOpacity>
                <Text style={styles.header}>{categoryName}</Text>
            </View>

            {/* Avoid Merchants Carousel */}
            {categoryData && categoryData.avoid && categoryData.avoid.length > 0 && (
                <View style={styles.carouselSection}>
                    <FlatList
                        data={categoryData.avoid}
                        keyExtractor={(item, idx) => item.company + idx}
                        renderItem={({ item }) => (
                            <View style={styles.carouselCard}>
                                 <Text style={styles.avoidCompany}>Avoid: <Text style={styles.bold}>{item.company}</Text></Text>
                                {/* <Text style={styles.carouselReason}>{item.reason}</Text> */}
                            </View>
                        )}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 8 }}
                    />
                </View>
            )}

            {/* Subcategory List */}
            {categoryData && categoryData.subcategories && categoryData.subcategories.length > 0 && (
                <View style={styles.subcategorySection}>
                    <FlatList
                        data={categoryData.subcategories}
                        keyExtractor={(item: string) => item}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.subcategoryListItem}>
                                <Text style={styles.subcategoryListText}>{item}</Text>
                                <Ionicons name="chevron-forward" size={22} color={COLORS.darkText} style={styles.subcategoryArrow} />
                            </TouchableOpacity>
                        )}
                        ItemSeparatorComponent={() => <View style={styles.subcategorySeparator} />}
                        scrollEnabled={false}
                        contentContainerStyle={{ paddingHorizontal: 0 }}
                    />
                </View>
            )}

            {/* Full Avoid List */}
            <FlatList
                data={categoryData && categoryData.avoid ? categoryData.avoid : []}
                keyExtractor={(item, idx) => item.company + idx}
                renderItem={({ item }) => (
                    <View style={styles.avoidCard}>
                        <Text style={styles.avoidCompany}>Avoid: <Text style={styles.bold}>{item.company}</Text></Text>
                        <Text style={styles.avoidReason}>{item.reason}</Text>
                        <View style={styles.altContainer}>
                            <Text style={styles.altLabel}>Ethical Alternative:</Text>
                            <Text style={styles.altCompany}>{item.alternative.company}</Text>
                            <Text style={styles.altReason}>{item.alternative.reason}</Text>
                        </View>
                    </View>
                )}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No data found for this category.</Text>
                    </View>
                }
                contentContainerStyle={{ paddingBottom: 40 }}
            />
        </View>
    );
}

    const styles = StyleSheet.create({
    carouselSection: {
        marginBottom: 16,
        marginTop: 8,
    },
    carouselTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.lightCoral,
        marginLeft: 16,
        marginBottom: 8,
    },
    carouselCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginRight: 12,
        minWidth: 180,
        maxWidth: 220,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    carouselMerchant: {
        fontSize: 17,
        fontWeight: 'bold',
        color: COLORS.lightCoral,
        marginBottom: 4,
    },
    carouselReason: {
        fontSize: 15,
        color: COLORS.darkText,
    },
        container: { flex: 1, backgroundColor: COLORS.lavenderBlush, paddingTop: 40 },
        headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, marginTop: 16, paddingHorizontal: 16 },
        header: { fontSize: 24, fontWeight: 'bold', color: COLORS.darkText, flex: 1, textAlign: 'center' },
        subcategorySection: { marginBottom: 16 },
        subcategoryTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.darkText, marginLeft: 16, marginBottom: 16 },
        subcategoryListItem: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 18,
            paddingHorizontal: 16,
            backgroundColor: 'transparent',
        },
        subcategoryListText: {
            fontSize: 18,
            color: COLORS.darkText,
            flex: 1,
        },
        subcategoryArrow: {
            marginLeft: 8,
        },
        subcategorySeparator: {
            height: 1,
            backgroundColor: COLORS.lavenderBlush,
            marginLeft: 16,
        },
        avoidCard: {
            backgroundColor: '#fff',
            borderRadius: 12,
            padding: 16,
            marginHorizontal: 16,
            marginVertical: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 4,
            elevation: 2,
        },
        avoidCompany: {
            fontSize: 18,
            color: COLORS.lightCoral,
            marginBottom: 4,
        },
        avoidReason: {
            fontSize: 15,
            color: COLORS.darkText,
            marginBottom: 8,
        },
        altContainer: {
            backgroundColor: COLORS.lavenderBlush,
            borderRadius: 8,
            padding: 10,
            marginTop: 8,
        },
        altLabel: {
            fontSize: 15,
            color: COLORS.sage,
            fontWeight: 'bold',
            marginBottom: 2,
        },
        altCompany: {
            fontSize: 16,
            color: COLORS.resedaGreen,
            fontWeight: 'bold',
        },
        altReason: {
            fontSize: 14,
            color: COLORS.darkText,
        },
        bold: {
            fontWeight: 'bold',
        },
        emptyContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 50,
        },
        emptyText: {
            fontSize: 18,
            color: COLORS.darkText,
        },
    });
    // ...existing code...
