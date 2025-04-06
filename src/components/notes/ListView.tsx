import { View, Text, StyleSheet, FlatList, useColorScheme, Pressable } from "react-native";
import { COLORS } from "@/src/constants/COLORS";
import { memo, useCallback, useState, useMemo } from "react";
import { Note } from "@/src/types/Note";
import { useTabs } from "@/src/contexts/TabsContext";
import Feather from "@expo/vector-icons/Feather";

export default function ListView() {
    const colorScheme = useColorScheme();
    const { notes, setSelectedNoteId, selectedNoteIds, isSelectionMode, toggleNoteSelection } = useTabs();
    
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
    selectedNote: {
      backgroundColor: colorScheme === "dark" ? COLORS.dark.accent + '20' : COLORS.light.accent + '20',
      borderColor: colorScheme === "dark" ? COLORS.dark.accent : COLORS.light.accent,
      borderWidth: 1,
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
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    circleContainer: {
      borderRadius: 5,
    },
  });

  // Simplify the selection indicator
  const CheckIcon = memo(() => {
    const colorScheme = useColorScheme();
    return (
      <Feather 
        name="check" 
        size={15} 
        color={colorScheme === "dark" ? COLORS.dark.text : COLORS.light.text} 
      />
    );
  });

  // Create a properly memoized NoteItem component
  const NoteItem = memo(({ note, isSelected }: { note: Note, isSelected: boolean }) => {
    const { isSelectionMode, toggleNoteSelection, setSelectedNoteId } = useTabs();
    
    // Handlers are created inside the component but memoized to prevent re-creation
    const handlePress = useCallback(() => {
      if (isSelectionMode) {
        toggleNoteSelection(note.id.toString());
      } else {
        setSelectedNoteId(note.id.toString());
      }
    }, [note.id, isSelectionMode]);
    
    const handleLongPress = useCallback(() => {
      if (isSelectionMode) {
        toggleNoteSelection(note.id.toString());
      } else {
        setSelectedNoteId(note.id.toString());
      }
    }, [note.id, isSelectionMode]);
    
    return (
      <Pressable 
        onPress={handlePress}
        onLongPress={handleLongPress}
        delayLongPress={200}
        style={[
          NoteItemStyle.noteItem,
          isSelected && isSelectionMode && NoteItemStyle.selectedNote
        ]}
      >
        <View>
          <View style={NoteItemStyle.titleContainer}>
            <Text style={NoteItemStyle.title} numberOfLines={1}>
              {note.title || "Untitled"}
            </Text>
            {isSelected && isSelectionMode && (
              <View style={NoteItemStyle.circleContainer}>
                <CheckIcon />
              </View>
            )}
          </View>

          <Text style={NoteItemStyle.content} numberOfLines={2}>
            {note.content || "No content"}
          </Text>

          <Text style={NoteItemStyle.createdAt}>
            {note.createdAt || "No date"}
          </Text>
        </View>
      </Pressable>
    );
  });

  // Key Extractor is used to extract the key from the item
  const KeyExtractor = useCallback((item: Note) => item.id.toString(), []);
  
  // Item Separator is used to separate the items
  const ItemSeparator = useCallback(() => <View style={ListStyle.separator} />, []);

  // Simplified render function
  const RenderItem = useCallback(({ item }: { item: Note }) => {
    const isSelected = selectedNoteIds.includes(item.id.toString());
    return <NoteItem note={item} isSelected={isSelected} />;
  }, [selectedNoteIds]);
  
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
        extraData={[isSelectionMode, selectedNoteIds]}
      />
    </View>
  );
}
