/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import * as React from 'react';
import { StatusBar, StyleSheet, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MerchantDetailsScreen from './src/screens/MerchantDetailsScreen';
import CategoriesScreen from './src/screens/CategoriesScreen';
import CategoryDetailsScreen from './src/screens/CategoryDetailsScreen';
import SubcategoriesScreen from './src/screens/SubcategoriesScreen';
import BrandDetailsScreen from './src/screens/BrandDetailsScreen';
import BrandsScreen from './src/screens/BrandsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import MovementsScreen from './src/screens/MovementsScreen';
import MovementDetailsScreen from './src/screens/MovementDetailsScreen';
import EthicalPurchaseResultsScreen from './src/screens/EthicalPurchaseResultsScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import ImageSearchScreen from './src/screens/ImageSearchScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import type { EthicalScoreResponse } from './src/store/searchStore';
import { COLORS } from './src/styles/colors';

export interface Boycott {
  Brand: string;
  Category: string;
  DateBoycottStarted: number | string;
  ReasonForBoycott: string;
  Source: string;
  Sources2?: string;
  Source3?: string;
  Source4?: string;
  [key: string]: any;
}

export type RootStackParamList = {
  Search: undefined;
  MerchantDetails: { merchant: { name: string; ethicalScore: EthicalScoreResponse | string; logo?: string; } };
  Categories: undefined;
  CategoriesList: undefined;
  Subcategories: { categoryName: string };
  CategoryDetails: { categoryName: string; subcategoryName: string };
  EthicalPurchaseResults: { results: any[]; searchTerm: string };
  Home: undefined;
  Movements: undefined;
  MovementDetails: { movementName: string };
  Brands: undefined;
  BrandDetails: { brandName: string };
  Profile: undefined;
  ImageSearch: undefined;
  ProductDetail: { product: { name: string; image: string; description: string } };
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen
        name="MerchantDetails"
        // wrap component to satisfy typing differences between stacks
        component={(props: any) => <MerchantDetailsScreen {...props} />}
      />
      <Stack.Screen name="BrandDetails" component={BrandDetailsScreen} />
      <Stack.Screen name="MovementDetails" component={MovementDetailsScreen} />
      <Stack.Screen name="EthicalPurchaseResults" component={EthicalPurchaseResultsScreen} />
    </Stack.Navigator>
  );
}

function CategoryStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CategoriesList" component={CategoriesScreen} />
      <Stack.Screen name="Subcategories" component={SubcategoriesScreen} />
      <Stack.Screen name="CategoryDetails" component={CategoryDetailsScreen} />
      <Stack.Screen
        name="MerchantDetails"
        component={(props: any) => <MerchantDetailsScreen {...props} />}
      />
      <Stack.Screen name="MovementDetails" component={MovementDetailsScreen} />
    </Stack.Navigator>
  );
}

function MovementsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Movements" component={MovementsScreen} />
      <Stack.Screen name="MovementDetails" component={MovementDetailsScreen} />
    </Stack.Navigator>
  );
}

function BrandsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Brands" component={BrandsScreen} />
      <Stack.Screen name="BrandDetails" component={BrandDetailsScreen} />
      <Stack.Screen
        name="MerchantDetails"
        component={(props: any) => <MerchantDetailsScreen {...props} />}
      />
    </Stack.Navigator>
  );
}

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="Home"
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Home') {
                iconName = focused ? 'home' : 'home-outline';
                return <Ionicons name={iconName} size={size} color={color} />;
              } else if (route.name === 'Search') {
                iconName = focused ? 'search' : 'search-outline';
                return <Ionicons name={iconName} size={size} color={color} />;
              } else if (route.name === 'Categories') {
                iconName = focused ? 'list' : 'list-outline';
                return <Ionicons name={iconName} size={size} color={color} />;
              } else if (route.name === 'Movements') {
                iconName = focused ? 'people' : 'people-outline';
                return <Ionicons name={iconName} size={size} color={color} />;
              } else if (route.name === 'ImageSearch') {
                iconName = focused ? 'camera' : 'camera-outline';
                return <Ionicons name={iconName} size={size} color={color} />;
              } else if (route.name === 'Brands') {
                iconName = focused ? 'storefront' : 'storefront-outline';
                return <Ionicons name={iconName} size={size} color={color} />;
              }

              return null;
            },
            tabBarActiveTintColor: COLORS.darkText,
            tabBarInactiveTintColor: COLORS.sage,
            tabBarLabelStyle: {
              fontSize: 12,
            },
            tabBarStyle: {
              backgroundColor: COLORS.lavenderBlush,
            }
          })}
        >
          <Tab.Screen name="Home" component={HomeStack} />
          <Tab.Screen name="Categories" component={CategoryStack} />
          {/* <Tab.Screen name="ImageSearch" component={ImageSearchScreen} options={{ tabBarLabel: 'Lens' }} /> */}
          <Tab.Screen name="Movements" component={MovementsStack} />
          <Tab.Screen name="Brands" component={BrandsStack} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
