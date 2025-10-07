import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../styles/colors';

export interface Movement {
  movement: string;
  note: string;
  url: string;
}

export const MovementCard = ({ item, onPress }: { item: Movement; onPress: () => void }) => (
  <TouchableOpacity style={styles.movementCard} onPress={onPress}>
    <View style={styles.movementTextContainer}>
      <Text style={styles.movementTitle} numberOfLines={1}>
        {item.movement}
      </Text>
      <Text style={styles.movementDescription} numberOfLines={2}>
        {item.note}
      </Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  movementCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.teaRose,
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  movementTextContainer: {
    flex: 1,
  },
  movementTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: COLORS.darkText,
  },
  movementDescription: {
    fontSize: 14,
    color: COLORS.darkText,
  },
});
