import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, useColorScheme, ScrollView, TouchableOpacity, Platform, Keyboard, Dimensions, StatusBar } from 'react-native';
import { COLORS } from '@/src/constants/COLORS';
import { MaterialIcons, FontAwesome, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCreateNote } from '../../../contexts/CreateNoteContext';

interface TextFormattingToolbarProps {
  onClose: () => void;
  onFormatText: (formatType: string, selectionRange?: {start: number, end: number}) => void;
  activeFormatType?: string;
  selectionRange?: {start: number, end: number};
}

type TextStyle = 'Title' | 'Heading' | 'Subheading' | 'Body' | 'Monostyled';

export default function TextFormattingToolbar({
  onClose,
  onFormatText,
  activeFormatType,
  selectionRange,
}: TextFormattingToolbarProps) {
  const colorScheme = useColorScheme();
  const [selectedStyle, setSelectedStyle] = useState<TextStyle>('Body');
  const insets = useSafeAreaInsets();
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [activeTab, setActiveTab] = React.useState<'format' | 'heading' | 'align'>('format');
  const { activeFormatType: contextActiveFormatType } = useCreateNote();

  // Use prop activeFormatType if provided, otherwise use the context value
  const currentActiveFormatType = activeFormatType || contextActiveFormatType;

  // Only monitor keyboard visibility, don't dismiss it when mounting
  useEffect(() => {
    // Set up keyboard listeners
    const keyboardShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
        // Close the formatting toolbar when keyboard appears
        onClose();
      }
    );
    
    const keyboardHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardShowListener.remove();
      keyboardHideListener.remove();
    };
  }, [onClose]);

  const isDark = colorScheme === 'dark';
  const textColor = isDark ? COLORS.dark.text : COLORS.light.text;
  const backgroundColor = isDark ? 'rgba(30, 30, 30, 0.95)' : 'rgba(245, 245, 245, 0.95)';
  const selectedBgColor = isDark ? COLORS.dark.accent : COLORS.light.accent;
  const borderColor = isDark ? "rgba(80, 80, 80, 0.5)" : "rgba(200, 200, 200, 0.8)";
  const dividerColor = isDark ? "rgba(100, 100, 100, 0.5)" : "rgba(220, 220, 220, 0.8)";
  const itemBgColor = isDark ? "rgba(50, 50, 50, 0.5)" : "rgba(235, 235, 235, 0.8)";
  const selectedTextColor = '#fff';

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      backgroundColor: backgroundColor,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.15,
      shadowRadius: 5,
      elevation: 5,
      borderTopWidth: 1,
      borderTopColor: borderColor,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: dividerColor,
    },
    title: {
      fontSize: 16,
      fontWeight: 'bold',
      color: textColor,
    },
    closeButton: {
      padding: 5,
    },
    styleTabsContainer: {
      flexDirection: 'row',
      paddingHorizontal: 8,
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: dividerColor,
    },
    styleTab: {
      paddingVertical: 8,
      paddingHorizontal: 10,
      marginHorizontal: 4,
      borderRadius: 20,
    },
    selectedStyleTab: {
      backgroundColor: selectedBgColor,
    },
    styleTabText: {
      fontSize: 14,
      fontWeight: '500',
      color: textColor,
    },
    selectedStyleTabText: {
      color: selectedTextColor,
    },
    formatOptionsContainer: {
      paddingVertical: 15,
      paddingHorizontal: 8,
    },
    formatRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 10,
    },
    formatButton: {
      width: 40,
      height: 40,
      borderRadius: 6,
      backgroundColor: itemBgColor,
      justifyContent: 'center',
      alignItems: 'center',
    },
    formatButtonPressed: {
      backgroundColor: isDark ? "rgba(70, 70, 70, 0.8)" : "rgba(210, 210, 210, 0.9)",
    },
    selectedFormatButton: {
      backgroundColor: isDark ? COLORS.dark.accent + '80' : COLORS.light.accent + '80',
    },
    boldButton: {
      backgroundColor: '#F4AF2A',
      borderTopLeftRadius: 20,
      borderBottomLeftRadius: 20,
    },
    listItem: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    colorDot: {
      width: 18,
      height: 18,
      borderRadius: 9,
      backgroundColor: '#9370DB', // Example purple color
    },
  });

  const textStyles: TextStyle[] = ['Title', 'Heading', 'Subheading', 'Body', 'Monostyled'];

  // First row of formatting options
  const basicFormatOptions = [
    { id: 'bold', icon: 'bold', type: 'FontAwesome', custom: true },
    { id: 'italic', icon: 'italic', type: 'FontAwesome' },
    { id: 'underline', icon: 'underline', type: 'FontAwesome' },
    { id: 'strikethrough', icon: 'strikethrough', type: 'FontAwesome' },
    { id: 'color', customElement: <View style={styles.colorDot} /> },
  ];

  // Second row of formatting options
  const listFormatOptions = [
    { id: 'bullet-list', icon: 'list-ul', type: 'FontAwesome' },
    { id: 'number-list', icon: 'list-ol', type: 'FontAwesome' },
    { id: 'checklist', icon: 'check-square-o', type: 'FontAwesome' },
    { id: 'indent-decrease', icon: 'outdent', type: 'FontAwesome' },
    { id: 'indent-increase', icon: 'indent', type: 'FontAwesome' },
    { id: 'code-block', icon: 'code', type: 'FontAwesome' },
  ];

  // Handle text style selection
  const handleStyleSelect = (style: TextStyle) => {
    setSelectedStyle(style);
    const styleType = `style-${style.toLowerCase()}`;
    onFormatText(styleType, selectionRange);
  };

  // Handle text formatting option selection
  const handleFormatSelect = (formatId: string) => {
    onFormatText(formatId, selectionRange);
  };

  const renderIcon = (option: any, size: number = 20) => {
    const color = option.color || textColor;
    
    if (option.customElement) {
      return option.customElement;
    }
    
    switch (option.type) {
      case 'MaterialIcons':
        return <MaterialIcons name={option.icon} size={size} color={color} />;
      case 'FontAwesome':
        return <FontAwesome name={option.icon} size={size} color={color} />;
      case 'MaterialCommunityIcons':
        return <MaterialCommunityIcons name={option.icon} size={size} color={color} />;
      case 'Feather':
        return <Feather name={option.icon} size={size} color={color} />;
      default:
        return <MaterialIcons name="format-size" size={size} color={color} />;
    }
  };

  return (
    <View style={styles.container} pointerEvents="box-none">
      {/* Header with title and close button */}
      <View style={styles.header} pointerEvents="auto">
        <Text style={styles.title}>Text Format</Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <MaterialIcons name="close" size={22} color={textColor} />
        </TouchableOpacity>
      </View>
      
      {/* Text style tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.styleTabsContainer}
        keyboardShouldPersistTaps="always"
        pointerEvents="box-none"
      >
          {textStyles.map(style => (
            <TouchableOpacity
              key={style}
              style={[
                styles.styleTab,
                selectedStyle === style && styles.selectedStyleTab
              ]}
              onPress={() => handleStyleSelect(style)}
            >
              <Text 
                style={[
                  styles.styleTabText,
                  selectedStyle === style && styles.selectedStyleTabText
                ]}
              >
                {style}
              </Text>
            </TouchableOpacity>
          ))}
      </ScrollView>
      
      {/* Text formatting options */}
      <View style={styles.formatOptionsContainer} pointerEvents="auto">
        {/* First row - basic formatting */}
        <View style={styles.formatRow}>
          {basicFormatOptions.map((option, index) => (
            <Pressable
              key={option.id}
              style={({ pressed }) => [
                styles.formatButton,
                option.id === 'bold' && styles.boldButton,
                pressed && styles.formatButtonPressed,
                currentActiveFormatType === option.id && styles.selectedFormatButton,
              ]}
              onPress={() => handleFormatSelect(option.id)}
            >
              {renderIcon(option)}
            </Pressable>
          ))}
        </View>
        
        {/* Second row - lists and indentation */}
        <View style={styles.formatRow}>
          {listFormatOptions.map((option) => (
            <Pressable
              key={option.id}
              style={({ pressed }) => [
                styles.formatButton,
                pressed && styles.formatButtonPressed,
                currentActiveFormatType === option.id && styles.selectedFormatButton,
              ]}
              onPress={() => handleFormatSelect(option.id)}
            >
              {renderIcon(option)}
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
} 