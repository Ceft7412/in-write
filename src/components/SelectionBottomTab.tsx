import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, useColorScheme, Animated } from 'react-native';
import { COLORS } from '@/src/constants/COLORS';
import { useTabs } from '@/src/contexts/TabsContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';

export default function SelectionBottomTab() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const { selectedNoteIds, clearSelection } = useTabs();
  const [pressedAction, setPressedAction] = React.useState<string | null>(null);
  
  // Animation values
  const slideAnim = useRef(new Animated.Value(100)).current; // Start from below screen
  const opacityAnim = useRef(new Animated.Value(0)).current;

  // Run animation when selectedNoteIds changes
  useEffect(() => {
    if (selectedNoteIds.length > 0) {
      // Slide in from bottom
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Slide out to top
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -100, // Move upward off screen
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [selectedNoteIds]);

  // Don't render if no notes are selected
  if (selectedNoteIds.length === 0) {
    return null;
  }

  const handleAction = (action: string) => {
    console.log(`Action: ${action}`);
    // Here you would implement the actual actions
    // For now, just log and clear selection
    clearSelection();
  };

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: colorScheme === 'dark' ? COLORS.dark.card : COLORS.light.card,
      borderTopWidth: colorScheme === 'dark' ? 0 : 0.5,
      borderTopColor: colorScheme === 'dark' ? COLORS.dark.border : COLORS.light.border,
      flexDirection: 'row',
      justifyContent: 'space-around',
      elevation: colorScheme === 'dark' ? 0 : 3,
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
    },
    actionButton: {
      alignItems: 'center',
      paddingVertical: 10,
      flex: 1,
    },
    actionButtonPressed: {
      backgroundColor: colorScheme === 'dark' ? COLORS.dark.accent + '20' : COLORS.light.accent + '20',
    },
    actionText: {
      fontSize: 12,
      marginTop: 4,
      color: colorScheme === 'dark' ? COLORS.dark.text : COLORS.light.text,
    },
  });

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          opacity: opacityAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <Pressable
        style={[
          styles.actionButton,
          pressedAction === 'move' && styles.actionButtonPressed,
        ]}
        onPress={() => handleAction('move')}
        onPressIn={() => setPressedAction('move')}
        onPressOut={() => setPressedAction(null)}
      >
        <Feather
          name="folder"
          size={22}
          color={colorScheme === 'dark' ? COLORS.dark.text : COLORS.light.text}
        />
        <Text style={styles.actionText}>Move</Text>
      </Pressable>

      <Pressable
        style={[
          styles.actionButton,
          pressedAction === 'share' && styles.actionButtonPressed,
        ]}
        onPress={() => handleAction('share')}
        onPressIn={() => setPressedAction('share')}
        onPressOut={() => setPressedAction(null)}
      >
        <Feather
          name="share-2"
          size={22}
          color={colorScheme === 'dark' ? COLORS.dark.text : COLORS.light.text}
        />
        <Text style={styles.actionText}>Share</Text>
      </Pressable>

      <Pressable
        style={[
          styles.actionButton,
          pressedAction === 'archive' && styles.actionButtonPressed,
        ]}
        onPress={() => handleAction('archive')}
        onPressIn={() => setPressedAction('archive')}
        onPressOut={() => setPressedAction(null)}
      >
        <Feather
          name="archive"
          size={22}
          color={colorScheme === 'dark' ? COLORS.dark.text : COLORS.light.text}
        />
        <Text style={styles.actionText}>Archive</Text>
      </Pressable>

      <Pressable
        style={[
          styles.actionButton,
          pressedAction === 'delete' && styles.actionButtonPressed,
        ]}
        onPress={() => handleAction('delete')}
        onPressIn={() => setPressedAction('delete')}
        onPressOut={() => setPressedAction(null)}
      >
        <Feather
          name="trash-2"
          size={22}
          color={colorScheme === 'dark' ? COLORS.dark.text : COLORS.light.text}
        />
        <Text style={styles.actionText}>Delete</Text>
      </Pressable>
    </Animated.View>
  );
} 