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
  TextInputSubmitEditingEventData,
} from 'react-native';

type BlockType = 'paragraph' | 'heading' | 'bullet-list';

interface Block {
  id: string;
  type: BlockType;
  content: string;
}

/**
 * Creates an empty block with a given type
 * @param type - The type of block to create
 * @returns A new block with the given type and an empty content string
 */
const createEmptyBlock = (type: BlockType = 'paragraph'): Block => ({
  id: Math.random().toString(36).substring(2, 9),
  type,
  content: '',
});

export default function NoteEditor() {
  const [blocks, setBlocks] = useState<Block[]>([createEmptyBlock()]);
  const [focusedBlockId, setFocusedBlockId] = useState<string | null>(null);
  const inputsRef = useRef<Record<string, TextInput | null>>({});
  const blockToFocus = useRef<string | null>(null);


  /**
   * When the blocks array changes, focus on the block that needs to be focused
   */
  useEffect(() => {
    console.log("Blocks", blocks);
    if (blockToFocus.current) {
      const id = blockToFocus.current;
      const input = inputsRef.current[id];
      if (input) {
        input.focus();
        setFocusedBlockId(id);
        blockToFocus.current = null;
      }
    }
  }, [blocks]);

  /**
   * Insert a new block after the current block
   * @param afterIndex - The index of the block after which the new block will be inserted
   * @returns void - Modifies state by inserting a new block
   */
  const insertNewBlock = (afterIndex: number) => {
    const newBlock = createEmptyBlock();
    setBlocks((prev) => {
      const updated = [...prev];
      updated.splice(afterIndex + 1, 0, newBlock);
      return updated;
    });
    blockToFocus.current = newBlock.id;
  };

  
  /**
   * Handles key press events for block text input with special handling for Enter and Backspace.
   * 
   * @param e - The keyboard event from React Native
   * @param index - The position of the current block in the blocks array
   * @param block - The current block being edited
   * @returns void - May modify state by inserting new blocks or handling deletions
   */
  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number,
    block: Block
  ): void => {
    const { key } = e.nativeEvent;

    switch (key) {
      case 'Enter':
        e.preventDefault?.();
        e.currentTarget.blur?.();
        insertNewBlock(index);
        break;

      case 'Backspace':
        if (block.content === '') {
          handleBackspace(index, block);
        }
        break;

      default:
        // No special handling for other keys
        break;
    }
  };

  
  /**
   * Handles backspace key press events for block text input.
   * 
   * @param index - The position of the current block in the blocks array
   * @param block - The current block being edited
   * @returns void - Modifies state by deleting the current block if it's empty and there are multiple blocks
   */
  const handleBackspace = (index: number, block: Block) => {
    // Only delete if the block is empty and not the only block
    if (block.content === '' && blocks.length > 1) {
      // Find the previous block
      const previousBlock = blocks[index - 1];
      
      if (previousBlock) {
        blockToFocus.current = previousBlock.id;
      }
      
      setBlocks((prev) => {
        const updated = [...prev];
        updated.splice(index, 1);
        return updated;
      });
    }
  };


  /**
   * Updates the content of a specific block in the blocks array.
   * 
   * @param text - The new text content to set
   * @param id - The ID of the block to update
   * @returns void - Modifies state by updating the blocks array
   */
  const handleTextChange = (text: string, id: string): void => {
    // Early return if block doesn't exist
    if (!blocks.some(block => block.id === id)) return;

    setBlocks(prevBlocks => 
      prevBlocks.map(block => 
        block.id === id 
          ? { ...block, content: text } 
          : block
      )
    );
  };

  /**
   * Determines whether to show a placeholder for a block based on its position and content.
   * 
   * @param item - The block to check
   * @param index - The position of the block in the blocks array
   * @returns True if placeholder should be shown, which occurs when:
   *          - It's the first block and empty, OR
   *          - It's the only block and empty
   */
  const shouldShowPlaceholder = (item: Block, index: number): boolean => {
    const isEmpty = item.content === '';
    return (index === 0 && isEmpty) || (blocks.length === 1 && isEmpty);
  };  

  /**
   * Renders a block with a text input.
   * 
   * @param item - The block to render
   * @param index - The position of the block in the blocks array
   * @returns A React element representing the block
   */
  const renderBlock = ({ item, index }: { item: Block; index: number }) => (
    <View>
      <TextInput
        key={item.id}
        ref={(ref) => (inputsRef.current[item.id] = ref)}
        value={item.content}
        onChangeText={(text) => handleTextChange(text, item.id)}
        placeholder={shouldShowPlaceholder(item, index) ? 'Enter your text here' : ''}
        returnKeyType="none"
        onKeyPress={(e) => handleKeyPress(e, index, item)}
        style={[
          styles.input,
          item.type === 'heading' && styles.heading,
          item.type === 'bullet-list' && styles.bulletItem,
        ]}
        submitBehavior="submit"
        multiline={true}
        scrollEnabled={false}
        autoFocus={focusedBlockId === item.id}
        onFocus={() => setFocusedBlockId(item.id)}
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
    lineHeight: 28,
    padding: 0,
    marginVertical: 0,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  bulletItem: {
    paddingLeft: 20,
  },
});
