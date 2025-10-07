import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../styles/colors';

export interface Movement {
  movement: string;
  note: string;
  url: string;
}

export const MovementCard = ({ item, onPress }: { item: Movement; onPress: () => void }) => (
  <TouchableOpacity onPress={onPress}>
    <View style={styles.movementCard}>
      <View style={styles.movementHeader}>
        <View style={styles.movementIcon}>
          <Ionicons name="megaphone" size={20} color={COLORS.resedaGreen} />
        </View>
        <View style={styles.movementInfo}>
          <Text style={styles.movementName} numberOfLines={1}>
            {item.movement}
          </Text>
          <Text style={styles.movementCategories}>Boycott Campaign</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={COLORS.sage} />
      </View>
      <View style={styles.movementDetails}>
        <Text style={styles.overviewText} numberOfLines={2}>
          {item.note}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  movementCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  movementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  movementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.lavenderBlush,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  movementInfo: {
    flex: 1,
  },
  movementName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.darkText,
    marginBottom: 2,
  },
  movementCategories: {
    fontSize: 14,
    color: COLORS.sage,
  },
  movementDetails: {
    paddingLeft: 52,
  },
  overviewText: {
    fontSize: 13,
    color: COLORS.darkText,
    lineHeight: 18,
  },
});
