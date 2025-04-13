import React, { useCallback, useMemo, useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, useColorScheme, Pressable, TextInput } from 'react-native';
import { COLORS } from '@/src/constants/COLORS';
import { useTabs } from '@/src/contexts/TabsContext';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { Note } from '@/src/types/Note';
import { Feather } from '@expo/vector-icons';
import { shareContent } from './ShareSheet';

const colorOptions = [
  '#ffffff',
  '#f28b82',
  '#fbbc04',
  '#fff475',
  '#ccff90',
  '#a7ffeb',
  '#cbf0f8',
  '#aecbfa',
  '#d7aefb',
  '#fdcfe8',
];

interface EditBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function EditBottomSheet({ isVisible, onClose }: EditBottomSheetProps) {
  const colorScheme = useColorScheme();
  const { selectedNoteId, notes } = useTabs();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['50%'], []);
  const [pressedButton, setPressedButton] = useState<string | null>(null);

  const selectedNote = useMemo(() => {
    if (!selectedNoteId) return null;
    return notes.find(note => note.id.toString() === selectedNoteId) || null;
  }, [selectedNoteId, notes]);

  const [title, setTitle] = useState('');
  const [selectedColor, setSelectedColor] = useState('#ffffff');

  useEffect(() => {
    if (selectedNote) {
      setTitle(selectedNote.title || '');
      setSelectedColor(selectedNote.backgroundColor || '#ffffff');
    }
  }, [selectedNote]);

  useEffect(() => {
    if (isVisible && bottomSheetRef.current) {
      bottomSheetRef.current.expand();
    }
  }, [isVisible]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);
  
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    [handleClose]
  );
  
  const handleSave = useCallback(() => {
    handleClose();
  }, [handleClose]);

  const handleShare = useCallback(() => {
    if (selectedNote) {
      shareContent(selectedNote);
    }
  }, [selectedNote]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colorScheme === 'dark' ? COLORS.dark.secondaryBackground : COLORS.light.secondaryBackground,
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
      paddingHorizontal: 20,
      paddingTop: 15,
    },
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colorScheme === 'dark' ? COLORS.dark.text : COLORS.light.text,
    },
    input: {
      fontSize: 16,
      padding: 10,
      backgroundColor: colorScheme === 'dark' ? COLORS.dark.background : COLORS.light.background,
      color: colorScheme === 'dark' ? COLORS.dark.text : COLORS.light.text,
      borderRadius: 8,
      marginBottom: 20,
    },
    colorSectionTitle: {
      fontSize: 14,
      color: colorScheme === 'dark' ? COLORS.dark.textSecondary : COLORS.light.textSecondary,
      marginBottom: 10,
    },
    colorsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 20,
      gap: 12,
    },
    colorOption: {
      width: 30,
      height: 30,
      borderRadius: 15,
      borderWidth: 1,
      borderColor: colorScheme === 'dark' ? COLORS.dark.border : COLORS.light.border,
    },
    selectedColorOption: {
      borderWidth: 2,
      borderColor: colorScheme === 'dark' ? COLORS.dark.accent : COLORS.light.accent,
    },
    colorOptionPressed: {
      transform: [{ scale: 1.1 }],
    },
    buttonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
    },
    button: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonPressed: {
      opacity: 0.8,
    },
    saveButton: {
      backgroundColor: colorScheme === 'dark' ? COLORS.dark.accent : COLORS.light.accent,
    },
    shareButton: {
      backgroundColor: colorScheme === 'dark' ? COLORS.dark.secondaryBackground : COLORS.light.secondaryBackground,
      borderWidth: 1,
      borderColor: colorScheme === 'dark' ? COLORS.dark.border : COLORS.light.border,
    },
    cancelButton: {
      backgroundColor: colorScheme === 'dark' ? COLORS.dark.background : COLORS.light.background,
    },
    buttonText: {
      fontSize: 16,
      color: colorScheme === 'dark' ? COLORS.dark.text : COLORS.light.text,
    },
    closeButtonContainer: {
      borderRadius: 20,
      padding: 5,
    },
    closeButtonPressed: {
      backgroundColor: colorScheme === 'dark' ? COLORS.dark.accent + '20' : COLORS.light.accent + '20',
    },
  });

  if (!isVisible || !selectedNote) {
    return null;
  }

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      enablePanDownToClose
      onClose={handleClose}
      backdropComponent={renderBackdrop}
      backgroundStyle={{
        backgroundColor: colorScheme === 'dark' ? COLORS.dark.secondaryBackground : COLORS.light.secondaryBackground,
      }}
      handleIndicatorStyle={{
        backgroundColor: colorScheme === 'dark' ? COLORS.dark.textSecondary : COLORS.light.textSecondary,
      }}
      index={0}
      animationConfigs={{
        duration: 150,
        dampingRatio: 1.0,
      }}
    >
      <BottomSheetView style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Edit Note</Text>
          <Pressable 
            onPress={onClose}
            onPressIn={() => setPressedButton('close')}
            onPressOut={() => setPressedButton(null)}
            style={[
              styles.closeButtonContainer,
              pressedButton === 'close' && styles.closeButtonPressed
            ]}
          >
            <Feather
              name="x"
              size={24}
              color={colorScheme === 'dark' ? COLORS.dark.text : COLORS.light.text}
            />
          </Pressable>
        </View>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Note title"
          placeholderTextColor={colorScheme === 'dark' ? COLORS.dark.textSecondary : COLORS.light.textSecondary}
        />
        <Text style={styles.colorSectionTitle}>Note Color</Text>
        <View style={styles.colorsContainer}>
          {colorOptions.map((color) => (
            <Pressable
              key={color}
              style={[
                styles.colorOption,
                { backgroundColor: color },
                color === selectedColor && styles.selectedColorOption,
                pressedButton === `color-${color}` && styles.colorOptionPressed,
              ]}
              onPress={() => setSelectedColor(color)}
              onPressIn={() => setPressedButton(`color-${color}`)}
              onPressOut={() => setPressedButton(null)}
            />
          ))}
        </View>
        <View style={styles.buttonsContainer}>
          <Pressable 
            style={[
              styles.button, 
              styles.cancelButton,
              pressedButton === 'cancel' && styles.buttonPressed
            ]} 
            onPress={handleClose}
            onPressIn={() => setPressedButton('cancel')}
            onPressOut={() => setPressedButton(null)}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </Pressable>
          <Pressable 
            style={[
              styles.button, 
              styles.saveButton,
              pressedButton === 'save' && styles.buttonPressed
            ]} 
            onPress={handleSave}
            onPressIn={() => setPressedButton('save')}
            onPressOut={() => setPressedButton(null)}
          >
            <Text style={styles.buttonText}>Save</Text>
          </Pressable>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
}