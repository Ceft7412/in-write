
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from "react-native";
import { COLORS } from "@/src/constants/COLORS";
import SearchBar from "./SearchBar";
import Feather from '@expo/vector-icons/Feather';
import { useTabs } from "../contexts/TabsContext";
interface HeaderProps {
    title: string;
    onPress: () => void;
}
export default function Header({ title, onPress }: HeaderProps) {
    const { setIsMoreMenuOpen } = useTabs();
    const colorScheme = useColorScheme();

    const HeaderStyle = StyleSheet.create({
        container: {
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "column",
            gap:20,
        },
        titleContainer: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 10,
            width: "100%",
        },
        title: {
            fontSize: 20,
            fontWeight: "bold",
            color: colorScheme === "dark" ? COLORS.dark.text : COLORS.light.text,
        },
        moreContainer: {
            padding:10
        }
     
    })
    return (
        <View style={HeaderStyle.container}>
            <View style={HeaderStyle.titleContainer}>
                <Text style={HeaderStyle.title}>{title}</Text>
                <TouchableOpacity onPress={() => setIsMoreMenuOpen(true)} style={HeaderStyle.moreContainer}>
                    
                    <Feather name="more-vertical" size={20} color={colorScheme === "dark" ? COLORS.dark.text : COLORS.light.text}  />
                </TouchableOpacity>
            </View>
            <SearchBar/>
        </View>
    )
}