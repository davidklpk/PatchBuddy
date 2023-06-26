import React, { useState } from 'react';
import { Appbar, Text, Button, TouchableRipple } from 'react-native-paper';
import Tts from 'react-native-tts';
import { useFocusEffect } from '@react-navigation/native';
import { ScrollView, View } from 'react-native';
import { useTheme } from 'react-native-paper';

function Setup({ navigation }: { navigation: any }) : JSX.Element {
  const { colors } = useTheme();

  const [tts, setTTS] = useState(true);

  const TTS_DESCRIPTION = "Hi, I am your PatchBuddy. Before we get started, I need to know if you want me to read out loud constantly all relevant menu items to you. If yes, press the upper half of your screen. Otherwise, if you want me to stay quiet, press the lower half of your screen. Keep in mind: You can always activate text-to-speech, even if you turn it off.";
  const TTS_ACCESSIBILITY_TRUE = "TTS Activated. PatchBuddy will read all relevant actions out loud to you."
  const TTS_ACCESSIBILITY_FALSE = "TTS Deactivated. PatchBuddy will keep quiet. You can always turn it on again."

  useFocusEffect(
    React.useCallback(() => {
      speakDialog(TTS_DESCRIPTION);

      return () => {
        // cleanup functions
        Tts.removeAllListeners("tts-finish");
      };
    }, [])
  );

  const speakDialog = (dialog : string) => {
    Tts.speak(dialog);
  }

  const toggleTTS = (ttsActive : boolean) => {
    setTTS(ttsActive);
    navigateToStart();

    if(ttsActive) {
      speakDialog(TTS_ACCESSIBILITY_TRUE);
      
    } else {
      speakDialog(TTS_ACCESSIBILITY_FALSE);
    }
  }

  const navigateToStart = () => {
    Tts.stop();
    navigation.replace("Start");
  }

  return (
    <>
      <Appbar.Header mode="center-aligned" elevated={true}>
        <Appbar.Content title="Setup" />
      </Appbar.Header>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          marginBottom: 0,
        }}
        contentInsetAdjustmentBehavior="automatic">
        <View style={{padding: 16, gap: 16}}>
          <View style={{borderRadius: 16, overflow: 'hidden', height: '48%', width: '100%'}}>
            <TouchableRipple
              onPress={() => toggleTTS(true)}
              style={{
                padding: 16,
                height: '100%',
                width: '100%',
                backgroundColor: colors.primary,
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              rippleColor="rgba(255, 255, 255, .18)">
              <Text style={{fontSize: 28, color: colors.onPrimary, textAlign: "center"}}>Activate Text-To-Speech</Text>
            </TouchableRipple>
          </View>

          <View style={{borderRadius: 16, overflow: 'hidden', height: '48%', width: '100%'}}>
            <TouchableRipple
              onPress={() => toggleTTS(false)}
              style={{
                padding: 16,
                height: '100%',
                width: '100%',
                backgroundColor: colors.primary,
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              rippleColor="rgba(255, 255, 255, .18)">
              <Text style={{fontSize: 28, color: colors.onPrimary, textAlign: "center"}}>Deactivate Text-To-Speech</Text>
            </TouchableRipple>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

export default Setup;