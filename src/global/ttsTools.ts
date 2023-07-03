import Tts from "react-native-tts";

// wip, but wont work lol
export interface ttsTools {
    assistantSpeak(isAssistanceActive: boolean, message : string):void;
}

/**
 * Decides if the assistance should speak or not, based on users preferences
 * 
 * @param isAssistanceActive (boolean) determining if the assistance is active
 * @param message (string) message to be spoken
 */
export const assistantSpeak = (isAssistanceActive: boolean, message : string) => {
    if(isAssistanceActive) {
        //Tts.stop();
        Tts.speak(message);
    } else {
        null;
    }
}

/**
 * Speaks a message out loud. For manual use
 * 
 * @param message (string) message to be spoken
 */
export const readOutLoud = (message : string) => {
    Tts.stop();
    Tts.speak(message);
}

/**
 * Navigate to a screen, and stop the assistance from speaking (otherwise it will keep speaking)
 * 
 * @param screenName the name of the stack screen (see: App.tsx)
 * @param navigation the navigation object
 */
export const navigateToScreen= (screenName : string, navigation : any) => {
    Tts.stop();
    navigation.replace(screenName);
  }