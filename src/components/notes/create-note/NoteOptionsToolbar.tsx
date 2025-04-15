import React from 'react';
import { View, StyleSheet, Pressable, useColorScheme, ScrollView, Platform, Keyboard } from 'react-native';
import { COLORS } from '@/src/constants/COLORS';
import { Feather, MaterialIcons, FontAwesome, AntDesign, Ionicons } from '@expo/vector-icons';
import { useCreateNote } from '@/src/contexts/CreateNoteContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlockType } from '@/src/types/Block';

interface NoteOptionsToolbarProps {
  isDrawingMode: boolean;
  onToggleDrawingMode: () => void;
  onToggleColorPicker: () => void;
  onToggleFolderPicker: () => void;
}

type IconType = 'Feather' | 'MaterialIcons' | 'FontAwesome' | 'AntDesign' | 'Ionicons';

interface ToolItem {
  id: string;
  icon: string;
  iconType?: IconType;
  onPress: () => void;
  isActive?: boolean;
}

export default function NoteOptionsToolbar({
  isDrawingMode,
  onToggleDrawingMode,
  onToggleColorPicker,
  onToggleFolderPicker,
}: NoteOptionsToolbarProps) {

  const { 
    toggleTextFormatting, 
    focusedBlockId, 
    changeBlockType, 
    addBlock,
    blocks 
  } = useCreateNote();
  
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const [keyboardVisible, setKeyboardVisible] = React.useState(false);

  // Listen for keyboard events to adjust toolbar position accordingly
  React.useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);
  
  // Change block type of the currently focused block
  const handleBlockTypeChange = (newType: BlockType) => {
    if (focusedBlockId) {
      changeBlockType(focusedBlockId, newType);
    } else {
      // If no block is focused, add a new block of the specified type
      addBlock(newType);
    }
  };
  
  // Toggle to-do list item
  const handleToDoToggle = () => {
    if (focusedBlockId) {
      // Find the current block to see its type
      const currentBlock = blocks.find(block => block.id === focusedBlockId);
      if (currentBlock) {
        // Toggle between to_do and paragraph
        changeBlockType(focusedBlockId, 
          currentBlock.type === 'to_do' ? 'paragraph' : 'to_do'
        );
      }
    } else {
      // Add a new to-do block
      addBlock('to_do');
    }
  };

  const styles = StyleSheet.create({
    toolbarContainer: {
      paddingVertical: 10,
      paddingHorizontal: 15,
      backgroundColor: colorScheme === "dark" 
        ? 'rgba(0,0,0,0.2)' 
        : 'rgba(255, 255, 255, 0.9)',    
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 99,
      borderTopWidth: 1,
      borderTopColor: colorScheme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
    },
    toolbarScrollContent: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 5,
    },
    toolbarButton: {
      padding: 10,
      borderRadius: 20,
      marginHorizontal: 8,
      alignItems: 'center',
      justifyContent: 'center',
      width: 40,
      height: 40,
    },
    toolbarButtonPressed: {
      backgroundColor: colorScheme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
    },
    toolbarButtonActive: {
      backgroundColor: colorScheme === "dark" ? COLORS.dark.accent + '30' : COLORS.light.accent + '30',
    },
    toolbarDivider: {
      width: 1,
      height: 30,
      backgroundColor: colorScheme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
      marginHorizontal: 8,
    },
    toolbarIconGroup: {
      flexDirection: "row",
      alignItems: "center",
    },
  });

  // Define our tools with their handlers
  const tools: ToolItem[] = [
    {
      id: 'text-formatting',
      icon: 'font',
      iconType: 'FontAwesome',
      onPress: toggleTextFormatting,
    },
    {
      id: 'heading',
      icon: 'heading',
      iconType: 'FontAwesome',
      onPress: () => handleBlockTypeChange('heading_1'),
    },
    {
      id: 'bulleted-list',
      icon: 'list',
      iconType: 'Feather',
      onPress: () => handleBlockTypeChange('bulleted_list_item'),
    },
    {
      id: 'todo',
      icon: 'check-square',
      iconType: 'Feather',
      onPress: handleToDoToggle,
    },
    {
      id: 'code',
      icon: 'code',
      iconType: 'FontAwesome',
      onPress: () => handleBlockTypeChange('code'),
    },
    {
      id: 'drawing',
      icon: 'edit-2',
      iconType: 'Feather',
      onPress: onToggleDrawingMode,
      isActive: isDrawingMode,
    },
    {
      id: 'color',
      icon: 'color-palette',
      iconType: 'Ionicons',
      onPress: onToggleColorPicker,
    },
  ];

  // Folder tool is separated by a divider
  const folderTool: ToolItem = {
    id: 'folder',
    icon: 'folder1',
    iconType: 'AntDesign',
    onPress: onToggleFolderPicker,
  };

  // Helper function to render the appropriate icon
  const renderIcon = (tool: ToolItem) => {
    const iconColor = colorScheme === "dark" ? COLORS.dark.text : COLORS.light.text;
    const iconSize = 20;

    switch (tool.iconType) {
      case 'MaterialIcons':
        return <MaterialIcons name={tool.icon as any} size={iconSize} color={iconColor} />;
      case 'FontAwesome':
        return <FontAwesome name={tool.icon as any} size={iconSize} color={iconColor} />;
      case 'AntDesign':
        return <AntDesign name={tool.icon as any} size={iconSize} color={iconColor} />;
      case 'Ionicons':
        return <Ionicons name={tool.icon as any} size={iconSize} color={iconColor} />;
      case 'Feather':
      default:
        return <Feather name={tool.icon as any} size={iconSize} color={iconColor} />;
    }
  };

  return (
    <View 
      style={styles.toolbarContainer} 
      pointerEvents="box-none"
    >
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.toolbarScrollContent}
        pointerEvents="box-none"
        keyboardShouldPersistTaps="always"
      >
        <View style={styles.toolbarIconGroup} pointerEvents="auto">
          {tools.map((tool) => (
            <Pressable 
              key={tool.id}
              style={({ pressed }) => [
                styles.toolbarButton,
                tool.isActive && styles.toolbarButtonActive,
                pressed && styles.toolbarButtonPressed
              ]} 
              onPress={tool.onPress}
            >
              {renderIcon(tool)}
            </Pressable>
          ))}
        </View>
        
        <View style={styles.toolbarDivider} />
        
        <View style={styles.toolbarIconGroup} pointerEvents="auto">
          <Pressable 
            style={({ pressed }) => [
              styles.toolbarButton,
              pressed && styles.toolbarButtonPressed
            ]} 
            onPress={folderTool.onPress}
          >
            {renderIcon(folderTool)}
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
} 