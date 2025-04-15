import React from 'react';
import { View, Text, StyleSheet, Pressable, useColorScheme } from 'react-native';
import { COLORS } from '@/src/constants/COLORS';

// Color options for note background
const colorOptions = [
  '#ffffff',
  '#f28b82',
  '#fbbc04',
  '#fff475',
  '#ccff90',
  '#a7ffeb',
  '#cbf0f8',
  '#aecbfa',
  '#d7aefb',
  '#fdcfe8',
];

interface ColorPickerPanelProps {
  selectedColor: string;
  onSelectColor: (color: string) => void;
}

export default function ColorPickerPanel({
  selectedColor,
  onSelectColor,
}: ColorPickerPanelProps) {
  const colorScheme = useColorScheme();

  const styles = StyleSheet.create({
    container: {
      position: "absolute",
      bottom: 70,
      left: 20,
      right: 20,
      backgroundColor: colorScheme === "dark" ? COLORS.dark.card : COLORS.light.card,
      borderRadius: 10,
      padding: 15,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    title: {
      fontSize: 16,
      fontWeight: "bold",
      color: colorScheme === "dark" ? COLORS.dark.text : COLORS.light.text,
      marginBottom: 10,
    },
    colorOptions: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      marginBottom: 10,
    },
    colorOption: {
      width: 30,
      height: 30,
      borderRadius: 15,
      margin: 5,
      borderWidth: 1,
      borderColor: colorScheme === "dark" ? COLORS.dark.border : COLORS.light.border,
    },
    colorSelected: {
      borderWidth: 2,
      borderColor: colorScheme === "dark" ? COLORS.dark.accent : COLORS.light.accent,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Background Color</Text>
      <View style={styles.colorOptions}>
        {colorOptions.map((color) => (
          <Pressable
            key={color}
            style={[
              styles.colorOption,
              { backgroundColor: color },
              selectedColor === color && styles.colorSelected,
            ]}
            onPress={() => onSelectColor(color)}
          />
        ))}
      </View>
    </View>
  );
} 