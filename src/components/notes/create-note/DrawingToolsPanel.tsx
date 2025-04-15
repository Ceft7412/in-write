import React from 'react';
import { View, Text, StyleSheet, Pressable, useColorScheme } from 'react-native';
import { COLORS } from '@/src/constants/COLORS';
import { Feather, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

// Drawing brush options
const drawingColors = ['#000000', '#FF0000', '#0000FF', '#00FF00', '#FFFF00', '#FF00FF'];
const brushSizes = [2, 4, 6, 8, 10];

interface DrawingToolsPanelProps {
  selectedDrawingColor: string;
  selectedBrushSize: number;
  onSelectDrawingColor: (color: string) => void;
  onSelectBrushSize: (size: number) => void;
  onClearDrawing: () => void;
  onToggleDrawingMode: () => void;
}

type IconConfig = {
  type: 'Feather' | 'MaterialIcons' | 'FontAwesome5';
  name: string;
};

export default function DrawingToolsPanel({
  selectedDrawingColor,
  selectedBrushSize,
  onSelectDrawingColor,
  onSelectBrushSize,
  onClearDrawing,
  onToggleDrawingMode,
}: DrawingToolsPanelProps) {
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
      marginBottom: 15,
    },
    label: {
      color: colorScheme === "dark" ? COLORS.dark.text : COLORS.light.text,
      marginBottom: 5,
    },
    toolsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 15,
    },
    colorOption: {
      width: 30,
      height: 30,
      borderRadius: 15,
      marginHorizontal: 5,
      borderWidth: 1,
      borderColor: colorScheme === "dark" ? COLORS.dark.border : COLORS.light.border,
    },
    colorSelected: {
      borderWidth: 2,
      borderColor: colorScheme === "dark" ? COLORS.dark.accent : COLORS.light.accent,
    },
    brushSizeContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-around",
      marginTop: 10,
    },
    brushSizeOption: {
      height: 30,
      justifyContent: "center",
      alignItems: "center",
      marginHorizontal: 5,
    },
    brushSizeDot: {
      backgroundColor: colorScheme === "dark" ? COLORS.dark.text : COLORS.light.text,
      borderRadius: 50,
    },
    brushSizeSelected: {
      backgroundColor: colorScheme === "dark" ? COLORS.dark.accent : COLORS.light.accent,
    },
    actionsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 10,
    },
    actionButton: {
      padding: 10,
      borderRadius: 5,
      backgroundColor: colorScheme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
      flexDirection: "row",
      alignItems: "center",
    },
    actionText: {
      color: colorScheme === "dark" ? COLORS.dark.text : COLORS.light.text,
      marginLeft: 5,
    }
  });

  const renderIcon = (icon: IconConfig, size: number = 16) => {
    const color = colorScheme === "dark" ? COLORS.dark.text : COLORS.light.text;
    
    switch (icon.type) {
      case 'MaterialIcons':
        return <MaterialIcons name={icon.name as any} size={size} color={color} />;
      case 'FontAwesome5':
        return <FontAwesome5 name={icon.name as any} size={size} color={color} />;
      case 'Feather':
      default:
        return <Feather name={icon.name as any} size={size} color={color} />;
    }
  };

  const clearIcon: IconConfig = { type: 'MaterialIcons', name: 'delete-sweep' };
  const doneIcon: IconConfig = { type: 'FontAwesome5', name: 'check-circle' };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Drawing Tools</Text>
      
      <Text style={styles.label}>Colors:</Text>
      <View style={styles.toolsRow}>
        {drawingColors.map((color) => (
          <Pressable
            key={color}
            style={[
              styles.colorOption,
              { backgroundColor: color },
              selectedDrawingColor === color && styles.colorSelected,
            ]}
            onPress={() => onSelectDrawingColor(color)}
          />
        ))}
      </View>
      
      <Text style={styles.label}>Brush Size:</Text>
      <View style={styles.brushSizeContainer}>
        {brushSizes.map((size) => (
          <Pressable
            key={size}
            style={[
              styles.brushSizeOption,
              { width: size * 2 + 20 }
            ]}
            onPress={() => onSelectBrushSize(size)}
          >
            <View
              style={[
                styles.brushSizeDot,
                { width: size, height: size },
                selectedBrushSize === size && styles.brushSizeSelected,
              ]}
            />
          </Pressable>
        ))}
      </View>
      
      <View style={styles.actionsRow}>
        <Pressable style={styles.actionButton} onPress={onClearDrawing}>
          {renderIcon(clearIcon)}
          <Text style={styles.actionText}>Clear</Text>
        </Pressable>
        
        <Pressable style={styles.actionButton} onPress={onToggleDrawingMode}>
          {renderIcon(doneIcon)}
          <Text style={styles.actionText}>Done</Text>
        </Pressable>
      </View>
    </View>
  );
} 