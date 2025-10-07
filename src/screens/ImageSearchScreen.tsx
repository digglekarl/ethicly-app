import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../styles/colors';
import { getEthicalScore } from '../api/groqSystemPrompt';
import { imageSystemPrompt } from '../api/imageSystemPrompt';
import { imageUserPrompt } from '../api/imageUserPrompt';

const ImageSearchScreen = () => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any | null>(null);

  const handleResponse = (response: any) => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.errorCode) {
      console.log('ImagePicker Error: ', response.errorMessage);
      Alert.alert('Error', 'An error occurred while selecting the image.');
    } else if (response.assets && response.assets[0].uri) {
      const uri = response.assets[0].uri;
      const base64 = response.assets[0].base64;
      setImage(uri);
      if (base64) {
        handleImageSearch(base64);
      }
    }
  };

  const handleTakePhoto = () => {
    launchCamera({ mediaType: 'photo', includeBase64: true }, handleResponse);
  };

  const handleChoosePhoto = () => {
    launchImageLibrary({ mediaType: 'photo', includeBase64: true }, handleResponse);
  };

  const handleImageSearch = async (base64Image: string) => {
    setLoading(true);
    setResults(null);
    try {
      const userPrompt = imageUserPrompt(base64Image);
      const prompt = `${imageSystemPrompt}\n${userPrompt}`;
      
      const rawResponse = await getEthicalScore(prompt);
      const jsonMatch = rawResponse.match(/```json\s*([\s\S]*?)\s*```/);
      const jsonString = jsonMatch ? jsonMatch[1] : rawResponse.substring(rawResponse.indexOf('{'), rawResponse.lastIndexOf('}') + 1);
      const parsedResults = JSON.parse(jsonString);
      setResults(parsedResults);

    } catch (error) {
      console.error("Failed to fetch image analysis", error);
      Alert.alert("Error", "Failed to get ethical alternatives. The AI may be having trouble analyzing this image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ethical Lens</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.instructions}>
          Take a photo or upload an image of a product to discover more ethical alternatives.
        </Text>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={handleTakePhoto}>
            <Ionicons name="camera-outline" size={24} color={COLORS.white} />
            <Text style={styles.buttonText}>Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleChoosePhoto}>
            <Ionicons name="image-outline" size={24} color={COLORS.white} />
            <Text style={styles.buttonText}>Upload Image</Text>
          </TouchableOpacity>
        </View>

        {image && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: image }} style={styles.previewImage} resizeMode="contain" />
          </View>
        )}

        {loading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={COLORS.sage} />
            <Text style={styles.loaderText}>Analyzing image for ethical alternatives...</Text>
          </View>
        )}

        {results && (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsTitle}>Ethical Alternatives</Text>
            {results.alternatives?.map((alt: any, index: number) => (
              <View key={index} style={styles.resultCard}>
                <Text style={styles.resultBrand}>{alt.brand}</Text>
                <Text style={styles.resultReason}>{alt.reason}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lavenderBlush,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.darkText,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  instructions: {
    fontSize: 16,
    color: COLORS.darkText,
    textAlign: 'center',
    marginBottom: 24,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.sage,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  previewImage: {
    width: '100%',
    height: 300,
    borderRadius: 15,
  },
  loaderContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.sage,
  },
  resultsContainer: {
    marginTop: 20,
  },
  resultsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.darkText,
    marginBottom: 16,
  },
  resultCard: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 16,
    marginBottom: 12,
  },
  resultBrand: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.darkText,
  },
  resultReason: {
    fontSize: 14,
    color: COLORS.sage,
    marginTop: 4,
  },
});

export default ImageSearchScreen;
