import { View, Text, StyleSheet } from "react-native";
import { useTabs } from "@/src/contexts/TabsContext";

export default function UnevenGridView() {
  const { filteredNotes } = useTabs();
  return <View></View>;
}
