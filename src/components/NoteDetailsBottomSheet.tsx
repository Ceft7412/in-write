// src/components/NoteDetailsBottomSheet.tsx
import React, { useCallback, useMemo, useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, useColorScheme, Pressable } from 'react-native';
import { COLORS } from '@/src/constants/COLORS';
import { useTabs } from '@/src/contexts/TabsContext';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { Note } from '@/src/types/Note';
import { Feather } from '@expo/vector-icons';
import EditBottomSheet from './EditBottomSheet';
import { shareContent } from './ShareSheet';

export default function NoteDetailsBottomSheet() {
  // Get theme and context data
  const colorScheme = useColorScheme();
  const { selectedNoteId, setSelectedNoteId, notes } = useTabs();
  
  // State for edit mode
  const [isEditMode, setIsEditMode] = useState(false);
  // Add pressed state for action buttons
  const [pressedAction, setPressedAction] = useState<string | null>(null);
  
  // Create a ref for the BottomSheet component
  const bottomSheetRef = useRef<BottomSheet>(null);
  
  // Define snap points for the bottom sheet (percentage of screen height)
  const snapPoints = useMemo(() => ['50%', '50%'], []);
  
  // Find the selected note based on ID
  const selectedNote = useMemo(() => {  
    if (!selectedNoteId) return null;
    return notes.find(note => note.id.toString() === selectedNoteId) || null;
  }, [selectedNoteId, notes]);
  
  // Open the bottom sheet when a note is selected
  useEffect(() => {
    if (selectedNoteId && bottomSheetRef.current && !isEditMode) {
      bottomSheetRef.current.expand();
    }
  }, [selectedNoteId, isEditMode]);
  
  // Handler for closing the sheet
  const handleSheetClose = useCallback(() => {
    setSelectedNoteId(null);
    setIsEditMode(false);
  }, [setSelectedNoteId]);
  
  // Function to customize the backdrop component
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        onPress={handleSheetClose}
      />
    ),
    [handleSheetClose]
  );
  
  // Handle edit button press
  const handleEditPress = useCallback(() => {
    // Immediately set edit mode to true
    setIsEditMode(true);
    setPressedAction(null);
    // No need to close the bottom sheet manually as setting isEditMode will unmount it
  }, []);

  const handleEditClose = useCallback(() => {
    setIsEditMode(false); // Close EditBottomSheet and reopen NoteDetails
  }, []);
  
  
  // Apply different styles based on the color theme
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colorScheme === 'dark' ? COLORS.dark.secondaryBackground : COLORS.light.secondaryBackground,
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
      paddingHorizontal: 20,
      paddingTop: 15
    },
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20
    },
    titleText: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colorScheme === 'dark' ? COLORS.dark.text : COLORS.light.text
    },
    contentText: {
      fontSize: 16,
      color: colorScheme === 'dark' ? COLORS.dark.text : COLORS.light.text,
      lineHeight: 24
    },
    dateText: {
      fontSize: 12,
      color: colorScheme === 'dark' ? COLORS.dark.textSecondary : COLORS.light.textSecondary,
      marginTop: 10
    },
    actionsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 20,
      paddingTop: 20,
      borderTopWidth: 0.5,
      borderTopColor: colorScheme === 'dark' ? COLORS.dark.border : COLORS.light.border
    },
    actionButton: {
      alignItems: 'center',
      padding: 10,
      paddingHorizontal: 15,
      borderRadius: 8
    },
    actionButtonPressed: {
      backgroundColor: colorScheme === 'dark' ? COLORS.dark.accent + '20' : COLORS.light.accent + '20',
    },
    actionText: {
      fontSize: 12,
      marginTop: 5,
      color: colorScheme === 'dark' ? COLORS.dark.text : COLORS.light.text
    }
  });

  // If no note is selected, don't render anything
  if (!selectedNoteId || !selectedNote) {
    return null;
  }
  
  return (
    <>
      {/* Only render the NoteDetailsBottomSheet when not in edit mode */}
      {!isEditMode && (
        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          enablePanDownToClose
          onClose={handleSheetClose}
          backdropComponent={renderBackdrop}
          backgroundStyle={{
            backgroundColor: colorScheme === 'dark' ? COLORS.dark.secondaryBackground : COLORS.light.secondaryBackground,
          }}
          handleIndicatorStyle={{
            backgroundColor: colorScheme === 'dark' ? COLORS.dark.textSecondary : COLORS.light.textSecondary,
          }}
          index={0}
          animationConfigs={{
            duration: 150, // Faster animation
            dampingRatio: 1.0, // No bounce
          }}
        >
          <BottomSheetView style={styles.container}>
            <View style={styles.headerContainer}>
              <Text style={styles.titleText}>{selectedNote.title || 'Untitled'}</Text>
              <Pressable 
                onPress={handleSheetClose}
                onPressIn={() => setPressedAction('close')}
                onPressOut={() => setPressedAction(null)}
                style={[
                  pressedAction === 'close' && styles.actionButtonPressed,
                  { padding: 5, borderRadius: 20 }
                ]}
              >
                <Feather 
                  name="x" 
                  size={24} 
                  color={colorScheme === 'dark' ? COLORS.dark.text : COLORS.light.text} 
                />
              </Pressable>
            </View>
            
            <Text style={styles.contentText}>{selectedNote.content || 'No content'}</Text>
            <Text style={styles.dateText}>Created: {selectedNote.createdAt}</Text>
            
            <View style={styles.actionsContainer}>
              <Pressable 
                style={[
                  styles.actionButton,
                  pressedAction === 'edit' && styles.actionButtonPressed
                ]} 
                onPress={handleEditPress}
                onPressIn={() => setPressedAction('edit')}
                onPressOut={() => setPressedAction(null)}
              >
                <Feather 
                  name="edit-3" 
                  size={24} 
                  color={colorScheme === 'dark' ? COLORS.dark.text : COLORS.light.text} 
                />
                <Text style={styles.actionText}>Edit</Text>
              </Pressable>
              
              <Pressable 
                style={[
                  styles.actionButton,
                  pressedAction === 'favorite' && styles.actionButtonPressed
                ]}
                onPressIn={() => setPressedAction('favorite')}
                onPressOut={() => setPressedAction(null)}
              >
                <Feather 
                  name="heart" 
                  size={24} 
                  color={selectedNote.isFavorite ? COLORS.light.accent : colorScheme === 'dark' ? COLORS.dark.text : COLORS.light.text} 
                />
                <Text style={styles.actionText}>Favorite</Text>
              </Pressable>
              
              <Pressable 
                style={[
                  styles.actionButton,
                  pressedAction === 'share' && styles.actionButtonPressed
                ]} 
                onPress={() => selectedNote && shareContent(selectedNote)}
                onPressIn={() => setPressedAction('share')}
                onPressOut={() => setPressedAction(null)}
              >
                <Feather 
                  name="share" 
                  size={24} 
                  color={colorScheme === 'dark' ? COLORS.dark.text : COLORS.light.text} 
                />
                <Text style={styles.actionText}>Share</Text>
              </Pressable>

              {/* Archive Button */}
              <Pressable 
                style={[
                  styles.actionButton,
                  pressedAction === 'archive' && styles.actionButtonPressed
                ]}
              >
                <Feather 
                  name="archive" 
                  size={24} 
                  color={colorScheme === 'dark' ? COLORS.dark.text : COLORS.light.text} 
                />
                <Text style={styles.actionText}>Archive</Text>
              </Pressable>
                <Pressable 
                style={[
                  styles.actionButton,
                  pressedAction === 'delete' && styles.actionButtonPressed
                ]}
                onPressIn={() => setPressedAction('delete')}
                onPressOut={() => setPressedAction(null)}
              >
                <Feather 
                  name="trash-2" 
                  size={24} 
                  color={colorScheme === 'dark' ? COLORS.dark.text : COLORS.light.text} 
                />
                <Text style={styles.actionText}>Delete</Text>
              </Pressable>
            </View>
          </BottomSheetView>
        </BottomSheet>
      )}
      
      {/* Only show EditBottomSheet when in edit mode */}
      {isEditMode && (
        <EditBottomSheet 
          isVisible={isEditMode} 
          onClose={handleEditClose} 
        />
      )}
    </>
  );
}