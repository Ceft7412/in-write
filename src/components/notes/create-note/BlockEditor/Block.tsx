import React from 'react';
import { View, TextInput, StyleSheet, Text, useColorScheme } from 'react-native';
import { COLORS } from '@/src/constants/COLORS';

// Simple placeholder Block component
interface BlockProps {
  content: string;
  placeholder?: string;
  onChangeText: (text: string) => void;
  onFocus?: () => void;
  onSelectionChange?: (range: {start: number, end: number}) => void;
}

export default function Block({
  content,
  placeholder = 'Type something...',
  onChangeText,
  onFocus,
  onSelectionChange
}: BlockProps) {
  const colorScheme = useColorScheme();
  const textColor = colorScheme === 'dark' ? COLORS.dark.text : COLORS.light.text;
  const placeholderColor = colorScheme === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)';

  // Handle selection change
  const handleSelectionChange = (e: any) => {
    if (onSelectionChange) {
      onSelectionChange(e.nativeEvent.selection);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, { color: textColor }]}
        value={content}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={placeholderColor}
        multiline
        onFocus={onFocus}
        onSelectionChange={handleSelectionChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  input: {
    fontSize: 16,
    paddingVertical: 4,
  }
}); 