import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  TextInputSelectionChangeEventData,
  Keyboard,
} from 'react-native';

type BlockType = 'paragraph' | 'heading' | 'bullet-list';

interface Block {
  id: string;
  type: BlockType;
  content: string;
}

const createEmptyBlock = (type: BlockType = 'paragraph'): Block => ({
  id: Math.random().toString(36).substring(2, 9),
  type,
  content: '',
});

export default function NoteEditor() {
  const [blocks, setBlocks] = useState<Block[]>([createEmptyBlock()]);
  const [focusedBlockId, setFocusedBlockId] = useState<string | null>(null);
  const inputsRef = useRef<Record<string, TextInput | null>>({});
  const processingEnter = useRef(false);
  const selectionRef = useRef<Record<string, { start: number; end: number }>>({});

  useEffect(() => {
    console.log('Blocks:', blocks);
  }, [blocks]);

  const handleSelectionChange = (
    event: NativeSyntheticEvent<TextInputSelectionChangeEventData>,
    blockId: string
  ) => {
    const { selection } = event.nativeEvent;
    selectionRef.current[blockId] = selection;
  };

  // Create a new block after the given index
  const createNewBlockAfter = (index: number, initialContent: string = '') => {
    const newBlock = {
      ...createEmptyBlock(),
      content: initialContent
    };
    
    const newBlockId = newBlock.id;
    
    // Insert the new block
    setBlocks(prev => {
      const updated = [...prev];
      updated.splice(index + 1, 0, newBlock);
      return updated;
    });
    
    // Focus the new block after a very short delay
    setFocusedBlockId(newBlockId);
    
    setTimeout(() => {
      const input = inputsRef.current[newBlockId];
      if (input) {
        input.focus();
      }
    }, 10);
    
    return newBlockId;
  };

  const handleTextChange = (text: string, id: string) => {
    // If we're actively processing an Enter key, don't update text
    if (processingEnter.current) {
      return;
    }
    
    // If the text somehow contains a newline (fallback for different platforms)
    if (text.includes('\n')) {
      processingEnter.current = true;
      
      // Get the newline position
      const newlineIndex = text.indexOf('\n');
      
      // Split the text
      const beforeNewline = text.substring(0, newlineIndex);
      const afterNewline = text.substring(newlineIndex + 1);
      
      // Update the current block with text before the newline
      setBlocks(prev => 
        prev.map(block => 
          block.id === id ? { ...block, content: beforeNewline } : block
        )
      );
      
      // Find the index of the current block
      const blockIndex = blocks.findIndex(block => block.id === id);
      if (blockIndex !== -1) {
        // Create new block with text after the newline
        createNewBlockAfter(blockIndex, afterNewline);
      }
      
      // Reset processing flag after a short delay
      setTimeout(() => {
        processingEnter.current = false;
      }, 50);
      
      return;
    }
    
    // Normal text update
    setBlocks((prev) =>
      prev.map((block) => (block.id === id ? { ...block, content: text } : block))
    );
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number,
    block: Block
  ) => {
    const key = e.nativeEvent.key;
    
    // Intercept Enter key
    if (key === 'Enter') {
      // Prevent default Enter behavior
      e.preventDefault?.();
      
      // Set flag to prevent handleTextChange from processing any newline
      processingEnter.current = true;
      
      // Get current selection
      const selection = selectionRef.current[block.id] || { start: block.content.length, end: block.content.length };
      
      // Split text at cursor position
      const beforeCursor = block.content.substring(0, selection.start);
      const afterCursor = block.content.substring(selection.end);
      
      // Update current block to contain only text before cursor
      setBlocks(prev => 
        prev.map(item => 
          item.id === block.id ? { ...item, content: beforeCursor } : item
        )
      );
      
      // Create new block with text after cursor
      createNewBlockAfter(index, afterCursor);
      
      // Reset processing flag after a delay
      setTimeout(() => {
        processingEnter.current = false;
      }, 50);
      
      return true;
    }

    // BACKSPACE on empty -> delete block
    if (key === 'Backspace' && block.content === '' && blocks.length > 1) {
      // Prevent default behavior
      e.preventDefault?.();
      
      // Get the previous block info before removing current block
      const previousBlock = blocks[index - 1];
      const previousBlockContent = previousBlock?.content || '';
      
      setBlocks((prev) => {
        const updated = [...prev];
        updated.splice(index, 1);
        return updated;
      });

      // Focus the previous block
      if (previousBlock) {
        setTimeout(() => {
          const input = inputsRef.current[previousBlock.id];
          if (input) {
            input.focus();
          }
        }, 10);
      }
    }
  };

  const renderBlock = ({ item, index }: { item: Block; index: number }) => (
    <View style={{ borderBottomWidth: 1, borderBottomColor: 'red'}}>
      <TextInput
        key={item.id}
        ref={(ref) => (inputsRef.current[item.id] = ref)}
        value={item.content}
        onChangeText={(text) => handleTextChange(text, item.id)}
        onKeyPress={(e) => handleKeyPress(e, index, item)}
        onSelectionChange={(e) => handleSelectionChange(e, item.id)}
        placeholder={item.type === 'heading' ? 'Heading' : 'Type something...'}
        style={[
          styles.input,
          item.type === 'heading' && styles.heading,
          item.type === 'bullet-list' && styles.bulletItem,
        ]}
        scrollEnabled={false}
        multiline
        autoFocus={focusedBlockId === item.id}
        onFocus={() => setFocusedBlockId(item.id)}
        returnKeyType="next"
        blurOnSubmit={false}
      />
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <FlatList
        data={blocks}
        keyExtractor={(item) => item.id}
        renderItem={renderBlock}
        contentContainerStyle={styles.list}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    paddingBottom: 50,
  },
  input: {
    fontSize: 16,
    color: '#222',
    lineHeight: 20,
    padding:0,
    paddingVertical: 0,
    marginVertical: 0,
    borderBottomWidth: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  bulletItem: {
    paddingLeft: 20,
  },
});
