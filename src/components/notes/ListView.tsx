import { View, Text, StyleSheet, FlatList, useColorScheme, Pressable } from "react-native";
import { COLORS } from "@/src/constants/COLORS";
import { memo, useCallback, useState, useMemo } from "react";
import { Note } from "@/src/types/Note";
import { useTabs } from "@/src/contexts/TabsContext";
import Feather from "@expo/vector-icons/Feather";

// Base styles that don't depend on theme
const baseStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  separator: {
    height: 10,
  },
  noteItem: {
    flexDirection: 'column',
    borderWidth: 0.5,
    borderRadius: 10,
    padding: 15,
    marginVertical: 5,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  circleContainer: {
    borderRadius: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    fontSize: 14,
  },
  createdAt: {
    marginTop: 10,
    fontSize: 10,
  },
});

export default function ListView() {
  const colorScheme = useColorScheme();
  const { filteredNotes, notes, setSelectedNoteId, selectedNoteIds, isSelectionMode, toggleNoteSelection } = useTabs();
  // Track which note item is currently being pressed
  const [pressedNoteId, setPressedNoteId] = useState<string | null>(null);
  
  // Memoize theme-dependent styles
  const themeStyles = useMemo(() => StyleSheet.create({
    container: {
      ...baseStyles.container,
      backgroundColor: colorScheme === "dark" ? COLORS.dark.background : COLORS.light.background,
    },
    noteItem: {
      ...baseStyles.noteItem,
      borderColor: colorScheme === "dark" ? COLORS.dark.border : COLORS.light.border,
      backgroundColor: colorScheme === "dark" ? COLORS.dark.secondaryBackground : COLORS.light.secondaryBackground,
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
      ...baseStyles.title,
      color: colorScheme === "dark" ? COLORS.dark.text : COLORS.light.text,
    },
    content: {
      ...baseStyles.content,
      color: colorScheme === "dark" ? COLORS.dark.textSecondary : COLORS.light.textSecondary,
    },
    createdAt: {
      ...baseStyles.createdAt,
      color: colorScheme === "dark" ? COLORS.dark.textSecondary : COLORS.light.textSecondary,
    },
  }), [colorScheme]);

  // Simplify the selection indicator
  const CheckIcon = memo(() => {
    return (
      <Feather 
        name="check" 
        size={15} 
        color={colorScheme === "dark" ? COLORS.dark.text : COLORS.light.text} 
      />
    );
  });

  // Non-memoized note item component that will re-render when any dependencies change
  function NoteItem({ note, isSelected }: { note: Note, isSelected: boolean }) {
    const handlePress = useCallback(() => {
      if (isSelectionMode) {
        toggleNoteSelection(note.id.toString());
      } else {
        setSelectedNoteId(note.id.toString());
      }
    }, [note.id, isSelectionMode, toggleNoteSelection, setSelectedNoteId]);

    const handleLongPress = useCallback(() => {
      // Always toggle selection on long press
      toggleNoteSelection(note.id.toString());
    }, [note.id, toggleNoteSelection]);
    
    return (
      <Pressable 
        onPress={handlePress}
        onLongPress={handleLongPress}
        onPressIn={() => setPressedNoteId(note.id.toString())}
        onPressOut={() => setPressedNoteId(null)}
        delayLongPress={200}
        style={[
          themeStyles.noteItem,
          isSelected && isSelectionMode && themeStyles.selectedNote,
          pressedNoteId === note.id.toString() && themeStyles.noteItemPressed,
          {
            backgroundColor: note.backgroundColor || (colorScheme === "dark" ? COLORS.dark.secondaryBackground : COLORS.light.secondaryBackground),
          }
        ]}
      >
        <View>
          <View style={baseStyles.titleContainer}>
            <Text style={themeStyles.title} numberOfLines={1}>
              {note.title || "Untitled"}
            </Text>
            {isSelected && isSelectionMode && (
              <View style={baseStyles.circleContainer}>
                <CheckIcon />
              </View>
            )}
          </View>

          <Text style={themeStyles.content} numberOfLines={2}>
            {note.content || "No content"}
          </Text>

          <Text style={themeStyles.createdAt}>
            {note.createdAt || "No date"}
          </Text>
        </View>
      </Pressable>
    );
  }

  // Key Extractor is used to extract the key from the item
  const KeyExtractor = useCallback((item: Note) => item.id.toString(), []);
  
  // Item Separator is used to separate the items
  const ItemSeparator = useCallback(() => <View style={baseStyles.separator} />, []);

  // Render item is used to render each item
  const renderItem = useCallback(({ item }: { item: Note }) => {
    const isSelected = selectedNoteIds.includes(item.id.toString());
    return <NoteItem note={item} isSelected={isSelected} />;
  }, [selectedNoteIds, toggleNoteSelection, isSelectionMode, setSelectedNoteId]);

  return (
    <View style={themeStyles.container}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={filteredNotes}
        renderItem={renderItem}
        keyExtractor={KeyExtractor}
        ItemSeparatorComponent={ItemSeparator}
        contentInsetAdjustmentBehavior="automatic"
        initialNumToRender={10}
        windowSize={10}
        maxToRenderPerBatch={10} 
        updateCellsBatchingPeriod={50}
        removeClippedSubviews={true}
        contentContainerStyle={{paddingBottom: 100}} // Add padding for selection bottom tab
        extraData={[isSelectionMode, selectedNoteIds, colorScheme]}
      />
    </View>
  );
}
