
import { View, Text, useColorScheme, Pressable } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "@/src/constants/COLORS";
import { StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import Header from "@/src/components/Header";
import { useTabs } from "@/src/contexts/TabsContext";
import Feather from "@expo/vector-icons/Feather";
import { NoteView } from "@/src/mock/NotesData";
export default function ViewMenu() {
    const colorScheme = useColorScheme();
    const { noteView, handleSetNoteView } = useTabs();
    const insets = useSafeAreaInsets();

    const ViewMenuStyle = StyleSheet.create({
        container: {
            position: "absolute",
            top: insets.top + 10,
            right: insets.right + 20,
            borderColor: colorScheme === "dark" ? COLORS.dark.border : COLORS.light.border,
            backgroundColor: colorScheme === "dark" ? COLORS.dark.card : COLORS.light.card,
            borderRadius: 10,
            padding: 5,
            width: 170,
            zIndex: 100,
            elevation: colorScheme === "dark" ? 0 : 2,
        },
        title: {
            fontSize: 16,
            color: colorScheme === "dark" ? COLORS.dark.text : COLORS.light.text,
        },
        item: {
            flexDirection: "row",
            alignItems: "center",
 
            padding:10,
            justifyContent: "space-between",
            gap: 10,
        },
        borderRadius: {
            borderRadius: 10,
        }
    })

    return (
        <View style={ViewMenuStyle.container}>
            <Pressable onPress={() => handleSetNoteView(NoteView.list)} style={ViewMenuStyle.item}> 
                {/* List View: Text, Icon */}
                <Text style={ViewMenuStyle.title}>List View</Text>
                <Feather name="list" size={20} color={colorScheme === "dark" ? COLORS.dark.text : COLORS.light.text} />
            </Pressable>
            <Pressable onPress={() => handleSetNoteView(NoteView.grid)} style={ViewMenuStyle.item}> 
                {/* Grid View: Text, Icon */}
                <Text style={ViewMenuStyle.title}>Grid View</Text>
                <Feather name="grid" size={20} color={colorScheme === "dark" ? COLORS.dark.text : COLORS.light.text} />
            </Pressable>
        </View>
    )
}