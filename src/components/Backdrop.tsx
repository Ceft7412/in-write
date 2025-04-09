
import React from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { useTabs } from '../contexts/TabsContext';
interface BackdropProps {
  children: React.ReactNode;
}

export default function Backdrop({ children }: BackdropProps) { 
    const { setIsMoreMenuOpen, isMoreMenuOpen, isViewMenuOpen, setIsViewMenuOpen     } = useTabs();


    const BackdropStyle = StyleSheet.create({
        backdrop: {
            zIndex: 15,
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
        }
    });

    const handlePress = () => {
        if (isMoreMenuOpen) {
            setIsMoreMenuOpen(false);
        }
        if (isViewMenuOpen) {
            setIsViewMenuOpen(false);
        }
    }

    return (
        <>
            <TouchableWithoutFeedback  onPress={handlePress}>
                <View style={BackdropStyle.backdrop}>
            {children}
            </View>
            </TouchableWithoutFeedback>
        </>
    );
}

