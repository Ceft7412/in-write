

import TabBarButton from "@/src/components/buttons/TabBarButton";
import { Tabs } from "expo-router";
import { Image } from "react-native";


export default function TabsLayout() {

  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarStyle: {
        borderTopWidth: 0,
        height: 60,
        paddingTop: 10,
        
      }
    }}>
      <Tabs.Screen name="index" options={{
        tabBarShowLabel: false,
        
        tabBarButton: (props : any) => <TabBarButton {...props} >
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
  );
}
