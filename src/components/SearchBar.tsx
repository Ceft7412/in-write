
import { View, Text, TextInput, StyleSheet, useColorScheme } from "react-native";
import { COLORS } from "@/src/constants/COLORS";
import AntDesign from '@expo/vector-icons/AntDesign';

export default function SearchBar() {
    const colorScheme = useColorScheme();

    const SearchBarStyle = StyleSheet.create({
        container:{ 
            position: "relative",
            width: "100%",
            height: 40,
            justifyContent: "center",
            borderWidth: 1,
            borderRadius: 10,
            backgroundColor: colorScheme === "dark" ? COLORS.dark.card : COLORS.light.card,
            borderColor: colorScheme === "dark" ? COLORS.dark.border : COLORS.light.border,

        },
        input: {
            borderRadius: 10,
            padding: 10,
            color: colorScheme === "dark" ? COLORS.dark.text : COLORS.light.text,
            paddingLeft: 40,
        },
        icon: {
            position: "absolute",
            left: 10,
        }
    })
    return (
        <View style={SearchBarStyle.container}>
            <TextInput  
                placeholder="Search"
                placeholderTextColor={colorScheme === "dark" ? COLORS.dark.textSecondary : COLORS.light.textSecondary}    
                style={SearchBarStyle.input}
            />
            <AntDesign name="search1" size={20} color={colorScheme === "dark" ? COLORS.dark.textSecondary : COLORS.light.textSecondary} style={SearchBarStyle.icon}/>
        </View>
    )
}
