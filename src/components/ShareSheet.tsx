import React, { useCallback } from 'react';
import { Share, Platform } from 'react-native';
import { Note } from '@/src/types/Note';

// No need for custom interface - use React Native's ShareContent type
import { ShareContent } from 'react-native';

/**
 * Handles sharing content using the native share functionality
 */
export const shareContent = async (note: Note): Promise<void> => {
  try {
    // Prepare the content to be shared
    const shareOptions: ShareContent = {
      title: note.title || 'My Note',
      message: `${note.title || 'My Note'}\n\n${note.content || ''}\n\nShared from In-Write App`,
    };

    // On iOS we can include a URL, but Android handles this differently
    if (Platform.OS === 'ios') {
      // If you have a web version of your notes, you could add a URL here
      // shareOptions.url = 'https://your-app-website.com/notes/' + note.id;
    }

    // Show the native share dialog
    const result = await Share.share(shareOptions);

    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
        console.log('Shared with activity type:', result.activityType);
      } else {
        // shared
        console.log('Shared successfully');
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
      console.log('Share dismissed');
    }
  } catch (error) {
    console.error('Error sharing:', error);
  }
};

/**
 * Hook for sharing note content
 */
export const useShareNote = () => {
  const handleShare = useCallback((note: Note) => {
    shareContent(note);
  }, []);

  return { handleShare };
}; 