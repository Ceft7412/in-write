
import { View, Text, useColorScheme , StyleSheet, Pressable} from "react-native";
import { COLORS } from "@/src/constants/COLORS";
import Feather from "@expo/vector-icons/Feather";
import { useTabs } from "../contexts/TabsContext";

export default function Selection({selectedNoteIds}: {selectedNoteIds: string[]}) {
  const colorScheme = useColorScheme();
  const {clearSelection, toggleSelectionMode} = useTabs();

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

  })
  return (
    <View style={SelectionStyle.container}>
          <Text style={SelectionStyle.title}>
              Selected Notes ({selectedNoteIds.length})</Text>    
              <View style={SelectionStyle.rightContainer}>    
                {selectedNoteIds.length > 0 && (
                  <Pressable onPress={() => clearSelection()}>
                    <Text style={SelectionStyle.deselectAll}>Deselect All</Text>
                  </Pressable>
                )}

              <Pressable onPress={() => toggleSelectionMode()} style={SelectionStyle.xContainer}> 
                <Feather name="x" size={24} color={colorScheme === "dark" ? COLORS.dark.text : COLORS.light.text}/>
              </Pressable>
              </View>  
            
          </View>
  );
}
