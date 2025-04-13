import { View, Text, useColorScheme, Pressable, Animated } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "@/src/constants/COLORS";
import { StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import Header from "@/src/components/Header";
import { useTabs } from "@/src/contexts/TabsContext";
import Feather from "@expo/vector-icons/Feather";
import { NoteView } from "@/src/mock/NotesData";
import { useEffect, useRef, useState } from "react";

export default function ViewMenu() {
    const colorScheme = useColorScheme();
    const { noteView, handleSetNoteView } = useTabs();
    const insets = useSafeAreaInsets();
    // Add state for pressed menu items
    const [pressedItem, setPressedItem] = useState<string | null>(null);
    
    // Animation value for scaling and opacity
    const scaleAnim = useRef(new Animated.Value(0.5)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    
    // Run animation when component mounts
    useEffect(() => {
        Animated.parallel([
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 150,
                useNativeDriver: true
            }),
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 150,
                useNativeDriver: true
            })
        ]).start();
    }, []);

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
            padding: 10,
            justifyContent: "space-between",
            gap: 10,
        },
        borderRadius: {
            borderRadius: 10,
        },
        itemPressed: {
            backgroundColor: colorScheme === "dark" ? COLORS.dark.accent + '20' : COLORS.light.accent + '20',
        }
    })

    return (
        <Animated.View 
            style={[
                ViewMenuStyle.container, 
                {
                    opacity: opacityAnim,
                    transform: [{ scale: scaleAnim }]
                }
            ]}
        >
            <Pressable 
                onPress={() => handleSetNoteView(NoteView.list)} 
                onPressIn={() => setPressedItem('list')}
                onPressOut={() => setPressedItem(null)}
                style={[
                    ViewMenuStyle.item, 
                    ViewMenuStyle.borderRadius,
                    pressedItem === 'list' && ViewMenuStyle.itemPressed
                ]}
            > 
                <Text style={ViewMenuStyle.title}>List View</Text>
                <Feather name="list" size={20} color={colorScheme === "dark" ? COLORS.dark.text : COLORS.light.text} />
            </Pressable>
            <Pressable 
                onPress={() => handleSetNoteView(NoteView.grid)} 
                onPressIn={() => setPressedItem('grid')}
                onPressOut={() => setPressedItem(null)}
                style={[
                    ViewMenuStyle.item, 
                    ViewMenuStyle.borderRadius,
                    pressedItem === 'grid' && ViewMenuStyle.itemPressed
                ]}
            > 
                <Text style={ViewMenuStyle.title}>Grid View</Text>
                <Feather name="grid" size={20} color={colorScheme === "dark" ? COLORS.dark.text : COLORS.light.text} />
            </Pressable>
        </Animated.View>
    )
}