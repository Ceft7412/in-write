import { View, Text, useColorScheme, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "@/src/constants/COLORS";
import { StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import Header from "@/src/components/Header";
import { useMemo } from "react";
import { useTabs } from "@/src/contexts/TabsContext";
import FavoriteListView from "@/src/components/notes/FavoriteListView";
import FavoriteGridView from "@/src/components/notes/FavoriteGridView";
import Selection from "@/src/components/Selection";

export default function Favorites() {
  const colorScheme = useColorScheme();
  const { noteView, isSelectionMode, selectedNoteIds } = useTabs();

  const FavoriteView = useMemo(() => {
    switch(noteView) {
      case "grid":
        return <FavoriteGridView />    
      case "list":
        return <FavoriteListView />
      default:
        return <FavoriteListView />
    }
  }, [noteView]);

  const FavoritesStyle = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colorScheme === "dark" ? COLORS.dark.background : COLORS.light.background  
    },
    innerContainer: {
      flex: 1,
      backgroundColor: colorScheme === "dark" ? COLORS.dark.background : COLORS.light.background,
      paddingVertical: 15,
      paddingHorizontal: 20,
    }
  });

  return (
    <SafeAreaView style={FavoritesStyle.container}>
      <StatusBar translucent style={colorScheme === "dark" ? "light" : "dark"} backgroundColor={colorScheme === "dark" ? COLORS.dark.background : COLORS.light.background}/>
      <View style={FavoritesStyle.innerContainer}>

        {/* Header */}
        {!isSelectionMode ? (
          <Header title="Favorites" onPress={() => {}}/>
        ) : (
          <Selection selectedNoteIds={selectedNoteIds.map(String)}/>
        )}

        {/* Notes */}
        <View style={{flex:1}}>
          {FavoriteView}
        </View>
      </View>
    </SafeAreaView>
  );
}
