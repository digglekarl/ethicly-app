import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function ProfileScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#222" />
        </TouchableOpacity>
        <Text style={styles.header}>Settings</Text>
      </View>
      <ScrollView>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.row}>
          <Image source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }} style={styles.profileImage} />
          <View style={styles.infoBox}>
            <Text style={styles.title}>Profile</Text>
            <Text style={styles.subtitle}>View and edit your profile</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.iconBox}><Ionicons name="notifications-outline" size={28} color="#222" /></View>
          <View style={styles.infoBox}>
            <Text style={styles.title}>Notifications</Text>
            <Text style={styles.subtitle}>Manage your notification preferences</Text>
          </View>
        </View>
        <Text style={styles.sectionTitle}>Support</Text>
        <View style={styles.row}>
          <View style={styles.iconBox}><Ionicons name="help-circle-outline" size={28} color="#222" /></View>
          <View style={styles.infoBox}>
            <Text style={styles.title}>Help & Support</Text>
            <Text style={styles.subtitle}>Get help with the app</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.iconBox}><MaterialIcons name="feedback" size={28} color="#222" /></View>
          <View style={styles.infoBox}>
            <Text style={styles.title}>Feedback</Text>
            <Text style={styles.subtitle}>Share your feedback</Text>
          </View>
        </View>
        <Text style={styles.sectionTitle}>Legal</Text>
        <View style={styles.row}>
          <View style={styles.iconBox}><Ionicons name="shield-outline" size={28} color="#222" /></View>
          <View style={styles.infoBox}>
            <Text style={styles.title}>Privacy Policy</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.iconBox}><Ionicons name="document-text-outline" size={28} color="#222" /></View>
          <View style={styles.infoBox}>
            <Text style={styles.title}>Terms of Service</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9f3', paddingTop: 40 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, marginLeft: 16 },
  header: { fontSize: 24, fontWeight: 'bold', color: '#222', flex: 1, textAlign: 'center' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#222', marginLeft: 16, marginTop: 24, marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, marginLeft: 16 },
  iconBox: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#eef3e3', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  profileImage: { width: 48, height: 48, borderRadius: 24, marginRight: 16, backgroundColor: '#eef3e3' },
  infoBox: { flex: 1 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#222' },
  subtitle: { fontSize: 16, color: '#7a8b5a' },
});
