import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Block from './Block';

interface BlockEditorProps {
  contentContainerStyle?: any;
  onSelectionChange?: (range: {start: number, end: number}) => void;
}

export default function BlockEditor({ 
  contentContainerStyle,
  onSelectionChange
}: BlockEditorProps) {
  const [content, setContent] = useState('');
  
  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={contentContainerStyle}
      keyboardShouldPersistTaps="always"
    >
      <Block 
        content={content}
        onChangeText={setContent}
        onFocus={() => console.log('Block focused')}
        onSelectionChange={onSelectionChange}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
}); 