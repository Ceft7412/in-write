import { View, Text, StyleSheet, useColorScheme, useWindowDimensions, Pressable, FlatList } from "react-native";
import { useTabs } from "@/src/contexts/TabsContext";
import { COLORS } from "@/src/constants/COLORS";
import { useMemo, useCallback, memo } from "react";
import { Note } from "@/src/types/Note";
import Feather from "@expo/vector-icons/Feather";



const baseStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  itemContainer: {
  },
  separator: {
    height: 10,
  },
  noteItem: {
    flex: 1,
    borderWidth: 0.5,
    borderRadius: 10,
    padding: 15,
    height: 180,
    justifyContent: 'space-between',
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

export default function FavoriteGridView() {
  const { favoriteNotes, isSelectionMode, toggleNoteSelection, selectedNoteIds, setSelectedNoteId } = useTabs();
  const colorScheme = useColorScheme();
  const { width } = useWindowDimensions();
  
  // Determine if we're on a tablet (width > 768px)
  const isTablet = width > 768;

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
  }), [colorScheme, isTablet]);

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
      if (isSelectionMode) {
        toggleNoteSelection(note.id.toString());
      } else {
        setSelectedNoteId(note.id.toString());
      }
    }, [note.id]);

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
    
    return (
      <Pressable 
        onPress={handlePress}
        onLongPress={handleLongPress}
        delayLongPress={200}
        style={[
          themeStyles.noteItem,
          isSelected && isSelectionMode && themeStyles.selectedNote,
          {
            backgroundColor: note.backgroundColor,
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

  // Simplified render function with wrapper
  const RenderItem = useCallback(({ item }: { item: Note }) => {
    const isSelected = selectedNoteIds.includes(item.id.toString());
    return (
      <View style={[baseStyles.itemContainer, { width: isTablet ? '31%' : '48%' }]}>
        <NoteItem note={item} isSelected={isSelected} />
      </View>
    );
  }, [selectedNoteIds, themeStyles, isTablet, baseStyles.itemContainer]);

  // Calculate number of columns based on screen width
  const numColumns = isTablet ? 3 : 2;

  return (
    <View style={themeStyles.container}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={favoriteNotes}
        renderItem={RenderItem}
        ItemSeparatorComponent={ItemSeparator}
        keyExtractor={KeyExtractor}
        extraData={[isSelectionMode, selectedNoteIds, colorScheme, themeStyles, isTablet]}
        contentInsetAdjustmentBehavior="automatic"
        initialNumToRender={10}
        windowSize={5}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
      
        removeClippedSubviews={true}
        contentContainerStyle={{ 
          paddingBottom: 80,
        }}
        numColumns={numColumns}
        columnWrapperStyle={{
         
          justifyContent: 'space-between',
        }}
        
      />
    </View>
  );
} 