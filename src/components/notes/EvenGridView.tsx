import { View, Text, StyleSheet } from "react-native";
import { useTabs } from "@/src/contexts/TabsContext";

export default function EvenGridView() {
  const { filteredNotes } = useTabs();

  const EvenGridViewStyle = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "row",
      flexWrap: "wrap",
      backgroundColor: "red",
    },
    note: {
      width: "50%",
      height: 100,
      backgroundColor: "blue",
    },
  });

  return <View style={EvenGridViewStyle.container}>
    {filteredNotes.map((note) => (
      <View style={EvenGridViewStyle.note} key={note.id}>
        <Text>{note.title}</Text>
      </View>
    ))}
  </View>;
}
