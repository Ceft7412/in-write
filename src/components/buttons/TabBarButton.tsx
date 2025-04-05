
import { Pressable } from "react-native";

interface TabBarButtonProps {
  children: React.ReactNode;
  props: any;
}

export default function TabBarButton({ children, ...props }: TabBarButtonProps) {    
    return (
        <Pressable {...props} android_ripple={{ color: "transparent" }}>
            {children}
        </Pressable>
    );
}
