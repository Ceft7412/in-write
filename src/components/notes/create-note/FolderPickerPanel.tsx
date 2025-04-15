import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, useColorScheme } from 'react-native';
import { Feather, MaterialIcons, FontAwesome5, Entypo } from '@expo/vector-icons';
import { COLORS } from '@/src/constants/COLORS';
import { Folder } from '@/src/types/Note';

interface FolderPickerPanelProps {
  folders: Folder[];
  selectedFolderId: number | null;
  onSelectFolder: (folderId: number | null) => void;
}

type IconLibrary = 'Feather' | 'MaterialIcons' | 'FontAwesome5' | 'Entypo';
interface IconConfig {
  type: IconLibrary;
  name: string;
  size?: number;
}

export default function FolderPickerPanel({
  folders,
  selectedFolderId,
  onSelectFolder,
}: FolderPickerPanelProps) {
  const colorScheme = useColorScheme();

  const styles = StyleSheet.create({
    container: {
      position: "absolute",
      bottom: 70,
      left: 20,
      right: 20,
      backgroundColor: colorScheme === "dark" ? COLORS.dark.card : COLORS.light.card,
      borderRadius: 10,
      padding: 15,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      maxHeight: 300,
    },
    title: {
      fontSize: 16,
      fontWeight: "bold",
      color: colorScheme === "dark" ? COLORS.dark.text : COLORS.light.text,
      marginBottom: 10,
    },
    folderItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: colorScheme === "dark" ? COLORS.dark.border : COLORS.light.border,
    },
    folderName: {
      marginLeft: 10,
      fontSize: 14,
      color: colorScheme === "dark" ? COLORS.dark.text : COLORS.light.text,
      flex: 1,
    },
    noFolders: {
      color: colorScheme === "dark" ? COLORS.dark.textSecondary : COLORS.light.textSecondary,
      textAlign: "center",
      marginTop: 10,
    },
    newFolderButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 10,
      marginTop: 5,
    },
    newFolderText: {
      marginLeft: 10,
      fontSize: 14,
      color: colorScheme === "dark" ? COLORS.dark.accent : COLORS.light.accent,
    },
    checkIcon: {
      marginLeft: 'auto',
    }
  });

  const renderIcon = (icon: IconConfig, color: string) => {
    const size = icon.size || 18;
    
    switch (icon.type) {
      case 'MaterialIcons':
        return <MaterialIcons name={icon.name as any} size={size} color={color} />;
      case 'FontAwesome5':
        return <FontAwesome5 name={icon.name as any} size={size} color={color} />;
      case 'Entypo':
        return <Entypo name={icon.name as any} size={size} color={color} />;
      case 'Feather':
      default:
        return <Feather name={icon.name as any} size={size} color={color} />;
    }
  };

  // Define icons
  const folderIcon: IconConfig = { type: 'Entypo', name: 'folder' };
  const checkIcon: IconConfig = { type: 'MaterialIcons', name: 'check-circle' };
  const addFolderIcon: IconConfig = { type: 'FontAwesome5', name: 'folder-plus' };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Move to Folder</Text>
      
      {folders.length === 0 ? (
        <Text style={styles.noFolders}>No folders available</Text>
      ) : (
        <FlatList
          data={folders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Pressable
              style={styles.folderItem}
              onPress={() => onSelectFolder(item.id)}
            >
              {renderIcon(
                folderIcon, 
                item.folderColor || (colorScheme === "dark" ? COLORS.dark.text : COLORS.light.text)
              )}
              <Text style={styles.folderName}>{item.name}</Text>
              {selectedFolderId === item.id && (
                <View style={styles.checkIcon}>
                  {renderIcon(
                    checkIcon, 
                    colorScheme === "dark" ? COLORS.dark.accent : COLORS.light.accent
                  )}
                </View>
              )}
            </Pressable>
          )}
        />
      )}
      
      <Pressable style={styles.newFolderButton}>
        {renderIcon(
          addFolderIcon, 
          colorScheme === "dark" ? COLORS.dark.accent : COLORS.light.accent
        )}
        <Text style={styles.newFolderText}>Create new folder</Text>
      </Pressable>
    </View>
  );
} 