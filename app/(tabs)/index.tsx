import { View, Text, useColorScheme, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "@/src/constants/COLORS";
import { StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import Header from "@/src/components/Header";
import { useMemo } from "react";
import { useTabs } from "@/src/contexts/TabsContext";


import ListView from "@/src/components/notes/ListView";
import EvenGridView from "@/src/components/notes/EvenGridView";
import UnevenGridView from "@/src/components/notes/UnevenGridView";
import Selection from "@/src/components/Selection";

export default function Index() {
  const colorScheme = useColorScheme();
  const {noteView, isSelectionMode, selectedNoteIds} = useTabs();



  const NoteView = useMemo(() => {

    switch(noteView) {
      case "grid":
        return <EvenGridView/>    
      case "list":
        return <ListView/>
      default:
        return <UnevenGridView/>
    }
  }, [noteView])



  const  HomeStyle = StyleSheet.create({
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
  })
  return (
    <SafeAreaView style={HomeStyle.container}>
      <StatusBar translucent style={colorScheme === "dark" ? "light" : "dark"} backgroundColor={colorScheme === "dark" ? COLORS.dark.background : COLORS.light.background}/>
      <View style={HomeStyle.innerContainer}>

        {/* Header */}
        {!isSelectionMode ? (
          <Header title="My Notes" onPress={() => {}}/>
        ) : (
          <Selection selectedNoteIds={selectedNoteIds.map(String)}/>
        )}

        {/* Notes */}
        <View style={{flex:1}}>
          {NoteView}
        </View>
      </View>
    </SafeAreaView>
  );
}


