import { View, Text, StyleSheet, FlatList, useColorScheme, Pressable } from "react-native";
import { COLORS } from "@/src/constants/COLORS";
import { memo, useCallback, useState, useMemo } from "react";
import { Note } from "@/src/types/Note";
import { useTabs } from "@/src/contexts/TabsContext";
export default function ListView() {
    const colorScheme = useColorScheme();
    const { notes, setSelectedNoteId, selectedNoteIds, isSelectionMode, toggleNoteSelection, selectAllNotes, clearSelection, toggleSelectionMode } = useTabs();
    


  const ListStyle = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop:20,
      backgroundColor: colorScheme === "dark" ? COLORS.dark.background : COLORS.light.background,
    },
    separator: {
      height: 10,
    },
  });

  const NoteItemStyle = StyleSheet.create({
    noteItem: {
      flexDirection: 'column',
      borderWidth: 0.5,
      borderRadius: 10,
      borderColor: colorScheme === "dark" ? COLORS.dark.border : COLORS.light.border,
      backgroundColor: colorScheme === "dark" ? COLORS.dark.secondaryBackground : COLORS.light.secondaryBackground,
      padding: 15,
      marginVertical: 5,
    },
    noteItemPressed: {
      backgroundColor: colorScheme === "dark" ? COLORS.dark.accent + '30' : COLORS.light.accent + '30',
    },
    title: {
      fontSize: 16,
      color: colorScheme === "dark" ? COLORS.dark.text : COLORS.light.text,
      fontWeight: 'bold',
    },
    content: {
      fontSize: 14,
      color: colorScheme === "dark" ? COLORS.dark.textSecondary : COLORS.light.textSecondary,
    },
    createdAt: {
      marginTop: 10,
      fontSize: 10,
      color: colorScheme === "dark" ? COLORS.dark.textSecondary : COLORS.light.textSecondary,
    },
  });

  // Create the component without memo first
  const NoteItemComponent = ({ note}: { note: Note }) => (
    <Pressable 
      onPress={() => {}} 
      onLongPress={() => {
        setSelectedNoteId(note.id.toString());
      }}
      style={({ pressed }) => [
        NoteItemStyle.noteItem,
        pressed && NoteItemStyle.noteItemPressed
      ]}
    >
      {({ pressed }) => (
        <View>
          {/* Title */}
          <Text style={NoteItemStyle.title} numberOfLines={1}>{note.title || "Untitled"} </Text>

          {/* Content */}
          <Text style={NoteItemStyle.content} numberOfLines={2}>{note.content || "No content"}</Text>

          {/* Created At */}
          <Text style={NoteItemStyle.createdAt}>{note.createdAt || "No date"}</Text>
        </View>
      )}
    </Pressable>
  );
  
  // Then memoize it without dependencies to use our already reactive styles
  const NoteItem = memo(NoteItemComponent);

  // Key Extractor is used to extract the key from the item
  const KeyExtractor = useCallback((item: Note) => item.id.toString(), []);
  // Item Separator is used to separate the items
  const ItemSeparator = useCallback(() => <View style={ListStyle.separator} />, []);

  // Render Item is used to render the item
  // We need to include the NoteItem in dependencies to re-render when theme changes
  const RenderItem = useCallback(({ item }: { item: Note }) => (
    <NoteItem note={item}/>
  ), [NoteItem]);
  
  return (
    <View style={ListStyle.container}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={notes}
        keyExtractor={KeyExtractor}
        ItemSeparatorComponent={ItemSeparator}
        contentInsetAdjustmentBehavior="automatic"
        initialNumToRender={10}
        windowSize={10}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        removeClippedSubviews={true}
        contentContainerStyle={{paddingBottom: 60}}
        renderItem={RenderItem}
      />
    </View>
  );
}
