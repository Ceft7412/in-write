import TabBarButton from "@/src/components/buttons/TabBarButton";
import { Tabs } from "expo-router";
import { Image, View, Text, useColorScheme } from "react-native";
import React, { useState } from "react";
import { COLORS } from "@/src/constants/COLORS";
import Backdrop from "@/src/components/Backdrop";
import MoreMenu from "@/src/components/MoreMenu";
import { TabsProvider, useTabs } from "@/src/contexts/TabsContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import NoteDetailsBottomSheet from "@/src/components/NoteDetailsBottomSheet";
import ViewMenu from "@/src/components/ViewMenu";
import SelectionBottomTab from "@/src/components/SelectionBottomTab";
import FolderSelectionBottomTab from "@/src/components/FolderSelectionBottomTab";
import { usePathname } from "expo-router";

// Create a separate component that will use the context
function TabsLayoutContent() {
  const { isMoreMenuOpen, setIsMoreMenuOpen, isSelectionMode, isViewMenuOpen, setIsViewMenuOpen, selectedNoteIds, selectedFolderIds, isInFolderSelectionMode } = useTabs();
  const colorScheme = useColorScheme();
  const pathname = usePathname();
  const isInFoldersRoute = pathname === "/folders";
  
  return (
    <>
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tabs screenOptions={{
        headerShown: false,
        animation: "shift",
        tabBarStyle: {
          borderTopWidth: colorScheme === "dark" ? 0 : 0.5,
          height: 60,
          paddingTop: 10,
          elevation: 0,
          display: isSelectionMode ? "none" : "flex",
          backgroundColor: colorScheme === "dark" ? COLORS.dark.background : COLORS.light.background,
        }
      }}>
        <Tabs.Screen name="index" options={{
          tabBarShowLabel: false,
          tabBarButton: (props : any) => <TabBarButton {...props}>
              {props.accessibilityState.selected ? <Image source={require("@/assets/images/icons/home-filled.png")} style={{ width: 24, height: 24 }} /> : <Image source={require("@/assets/images/icons/home-outline.png")} style={{ width: 24, height: 24 }} />}
          </TabBarButton>
        }}/>
        <Tabs.Screen name="favorites" options={{
          tabBarShowLabel: false,
          tabBarButton: (props : any) => <TabBarButton {...props} >
              {props.accessibilityState.selected ? <Image source={require("@/assets/images/icons/heart-filled.png")} style={{ width: 24, height: 24 }} /> : <Image source={require("@/assets/images/icons/heart-outline.png")} style={{ width: 24, height: 24 }} />}
          </TabBarButton>
        }}/>
        <Tabs.Screen name="folders" options={{
          tabBarShowLabel: false,
          tabBarButton: (props : any) => <TabBarButton {...props} >
              {props.accessibilityState.selected ? <Image source={require("@/assets/images/icons/folder-filled.png")} style={{ width: 24, height: 24 }} /> : <Image source={require("@/assets/images/icons/folder-outline.png")} style={{ width: 24, height: 24 }} />}
          </TabBarButton>
        }}/>
        <Tabs.Screen name="create-note" options={{
          tabBarShowLabel: false,
          tabBarStyle: {
              display: "none"
          },
          tabBarButton: (props : any) => <TabBarButton {...props} >
              <Image source={require("@/assets/images/icons/create-note.png")} style={{ width: 24, height: 24 }} /> 
          </TabBarButton>
        }}/>
      </Tabs>
      
      {isMoreMenuOpen && !isSelectionMode && (
        <Backdrop >  
            <MoreMenu />
        </Backdrop>
      )}

      {isViewMenuOpen && (
        <Backdrop >  
            <ViewMenu />
        </Backdrop>
      )}
      <NoteDetailsBottomSheet />
      
      {/* Show appropriate selection bottom tab */}
      {isSelectionMode && isInFoldersRoute && selectedFolderIds.length > 0 && <FolderSelectionBottomTab />}
      {isSelectionMode && !isInFoldersRoute && selectedNoteIds.length > 0 && <SelectionBottomTab />}
      
      </GestureHandlerRootView>
    </>
  );
}

// Main component that provides the context
export default function TabsLayout() {
  return (
    <TabsProvider>
      <TabsLayoutContent />
    </TabsProvider>
  );
}
