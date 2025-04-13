import { View, Text, StyleSheet, TouchableWithoutFeedback, TouchableOpacity, Pressable, Animated } from "react-native";
import { COLORS } from "@/src/constants/COLORS";
import { useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import { useState, useCallback, useRef, useEffect } from "react";
import { useTabs } from "@/src/contexts/TabsContext";

// Memoize the component
export default function MoreMenu() {
    const insets = useSafeAreaInsets();
    const colorScheme = useColorScheme();
    const {handleSelection, toggleNoteView} = useTabs();
    
    // Animation values
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
                duration: 100,
                useNativeDriver: true
            })
        ]).start();
    }, []);
    
    const [isPressed, setIsPressed] = useState({
        selectAll: false,
        view: false,
        archive: false,
        trash: false,
        settings: false,
    });


    const onPressIn = useCallback((item: string) => {
        setIsPressed({...isPressed, [item]: true});
    }, [isPressed]);
    const onPressOut = useCallback((item: string) => {
        setIsPressed({...isPressed, [item]: false});
    }, [isPressed]);
    const MoreMenuStyle = StyleSheet.create({
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
        <TouchableWithoutFeedback onPress={(e) => {
            e.stopPropagation();
        }}>
            <Animated.View 
                style={[
                    MoreMenuStyle.container,
                    {
                        opacity: opacityAnim,
                        transform: [{ scale: scaleAnim }]
                    }
                ]}
            >
                {/* Item */}
                {/* Modify when onpress the background color change */}

                {/* TouchableOpacity */}
               
                <Pressable onPress={handleSelection}  style={[MoreMenuStyle.borderRadius, {backgroundColor: isPressed.selectAll ? colorScheme === "dark" ? COLORS.dark.secondaryBackground : COLORS.light.secondaryBackground : "transparent"}]}>
                    <View style={MoreMenuStyle.item}>
                        {/* Text */}
                        <Text style={MoreMenuStyle.title}>Select</Text>
                    {/* Icon */}
                        <Feather name="check" size={20} color={colorScheme === "dark" ? COLORS.dark.text : COLORS.light.text} />
                    </View>
                </Pressable>

                {/* Item */}
                <Pressable onPress={toggleNoteView} style={[MoreMenuStyle.borderRadius, {backgroundColor: isPressed.view ? colorScheme === "dark" ? COLORS.dark.secondaryBackground : COLORS.light.secondaryBackground : "transparent"}]}>
                    <View style={MoreMenuStyle.item}>
                        <Text style={MoreMenuStyle.title}>View</Text>
                        <Feather name="grid" size={20} color={colorScheme === "dark" ? COLORS.dark.text : COLORS.light.text} />
                    </View>
                </Pressable>

                {/* Item */}
                <Pressable onPressIn={() => onPressIn("archive")} onPressOut={() => onPressOut("archive")} style={[MoreMenuStyle.borderRadius, {backgroundColor: isPressed.archive ? colorScheme === "dark" ? COLORS.dark.secondaryBackground : COLORS.light.secondaryBackground : "transparent"}]}>
                    <View style={MoreMenuStyle.item}>
                        <Text style={MoreMenuStyle.title}>Archive</Text>
                        <Feather name="archive" size={20} color={colorScheme === "dark" ? COLORS.dark.text : COLORS.light.text} />
                    </View>
                </Pressable>

                {/* Item */}
                <Pressable onPressIn={() => onPressIn("trash")} onPressOut={() => onPressOut("trash")} style={[MoreMenuStyle.borderRadius, {backgroundColor: isPressed.trash ? colorScheme === "dark" ? COLORS.dark.secondaryBackground : COLORS.light.secondaryBackground : "transparent"}]}>
                    <View style={MoreMenuStyle.item}>
                        <Text style={MoreMenuStyle.title}>Trash</Text>
                        <Feather name="trash-2" size={20} color={colorScheme === "dark" ? COLORS.dark.text : COLORS.light.text} />
                    </View>
                </Pressable>
                
                {/* Item */}
                    <Pressable onPressIn={() => onPressIn("settings")} onPressOut={() => onPressOut("settings")} style={[MoreMenuStyle.borderRadius, {backgroundColor: isPressed.settings     ? colorScheme === "dark" ? COLORS.dark.secondaryBackground : COLORS.light.secondaryBackground : "transparent"}] }>
                    <View style ={MoreMenuStyle.item}>
                        <Text style={MoreMenuStyle.title}>Settings</Text>
                        <Feather name="settings" size={20} color={colorScheme === "dark" ? COLORS.dark.text : COLORS.light.text} />
                    </View>
                </Pressable>
                
                
                
            </Animated.View>
        </TouchableWithoutFeedback>
    )
}