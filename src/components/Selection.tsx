import { View, Text, useColorScheme, StyleSheet, Pressable} from "react-native";
import { COLORS } from "@/src/constants/COLORS";
import Feather from "@expo/vector-icons/Feather";
import { useTabs } from "../contexts/TabsContext";
import { useState } from "react";

interface SelectionProps {
  selectedNoteIds?: string[];
  selectedIds?: string[];
  selectionType?: 'notes' | 'folders';
}

export default function Selection({ selectedNoteIds, selectedIds, selectionType = 'notes' }: SelectionProps) {
  const colorScheme = useColorScheme();
  const { clearSelection, toggleSelectionMode, clearFolderSelection } = useTabs();
  const [pressedButton, setPressedButton] = useState<string | null>(null);
  
  // Use the appropriate selection based on props
  const items = selectedIds || selectedNoteIds || [];
  const itemType = selectionType === 'folders' ? 'Folders' : 'Notes';
  
  // Clear the appropriate selection
  const handleClearSelection = () => {
    if (selectionType === 'folders') {
      clearFolderSelection();
    } else {
      clearSelection();
    }
  };

  const SelectionStyle = StyleSheet.create({
    container: {  
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    title: {
      fontSize: 16,
      fontWeight: "bold",
      color: colorScheme === "dark" ? COLORS.dark.text : COLORS.light.text, 
    },
    deselectAll: {
      fontSize: 16,
      fontWeight: "bold",
      color: colorScheme === "dark" ? COLORS.dark.text : COLORS.light.text, 
    },
    rightContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },  
    xContainer: {
      padding: 5,
      borderRadius: 5,
      backgroundColor: colorScheme === "dark" ? COLORS.dark.background : COLORS.light.background,
    },
    buttonPressed: {
      backgroundColor: colorScheme === "dark" ? COLORS.dark.accent + '20' : COLORS.light.accent + '20',
    },
    deselectContainer: {
      padding: 5,
      borderRadius: 5,
    }
  });

  return (
    <View style={SelectionStyle.container}>
      <Text style={SelectionStyle.title}>
        Selected {itemType} ({items.length})
      </Text>    
      <View style={SelectionStyle.rightContainer}>    
        {items.length > 0 && (
          <Pressable 
            onPress={() => handleClearSelection()}
            onPressIn={() => setPressedButton('deselect')}
            onPressOut={() => setPressedButton(null)}
            style={[
              SelectionStyle.deselectContainer,
              pressedButton === 'deselect' && SelectionStyle.buttonPressed
            ]}
          >
            <Text style={SelectionStyle.deselectAll}>Deselect All</Text>
          </Pressable>
        )}

        <Pressable 
          onPress={() => toggleSelectionMode()} 
          onPressIn={() => setPressedButton('close')}
          onPressOut={() => setPressedButton(null)}
          style={[
            SelectionStyle.xContainer,
            pressedButton === 'close' && SelectionStyle.buttonPressed
          ]}
        > 
          <Feather name="x" size={24} color={colorScheme === "dark" ? COLORS.dark.text : COLORS.light.text}/>
        </Pressable>
      </View>  
    </View>
  );
}
