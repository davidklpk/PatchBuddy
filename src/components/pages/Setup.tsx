import React, { useState } from 'react';
import { Appbar, Text, TouchableRipple } from 'react-native-paper';
import Tts from 'react-native-tts';
import { useFocusEffect } from '@react-navigation/native';
import { ScrollView, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import {GLOBAL} from "./../../global/global"
import { navigateToScreen } from '../../global/ttsTools';
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { STRINGS } from '../../global/strings';

function Setup({ navigation }: { navigation: any }) : JSX.Element {
  const { colors } = useTheme();
  const [tts, setTTS] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      speakDialog(STRINGS.SETUP_DESC_TTS);

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
    navigateToScreen("Start", navigation);

    if(ttsActive) {
      GLOBAL.isTtsActivated = true;
      speakDialog(STRINGS.SETUP_TTS_TRUE);
      
    } else {
      GLOBAL.isTtsActivated = false;
      speakDialog(STRINGS.SETUP_TTS_FALSE);
    }
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
        <View style={{ gap: 16}}>
          <View style={{borderRadius: 16, overflow: 'hidden', height: '49%', width: '100%'}}>
            <TouchableRipple
              onPress={() => toggleTTS(true)}
              style={{
                padding: 16,
                height: '100%',
                width: '100%',
                backgroundColor: colors.primaryContainer,
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              rippleColor="rgba(255, 255, 255, .18)">
                <>
                  <Icon style={{color: colors.onPrimaryContainer, paddingBottom: 16}} name="text-to-speech" size={72} />
                  <Text style={{fontSize: 28, color: colors.onPrimaryContainer, textAlign: "center"}}>Activate Text-To-Speech</Text>
                </>
            </TouchableRipple>
          </View>

          <View style={{borderRadius: 16, overflow: 'hidden', height: '49%', width: '100%'}}>
            <TouchableRipple
              onPress={() => toggleTTS(false)}
              style={{
                padding: 16,
                height: '100%',
                width: '100%',
                backgroundColor: colors.primaryContainer,
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              rippleColor="rgba(255, 255, 255, .18)">
              <>
                <Icon style={{color: colors.onPrimaryContainer, paddingBottom: 16}} name="text-to-speech-off" size={72} />
                <Text style={{fontSize: 28, color: colors.onPrimaryContainer, textAlign: "center"}}>Deactivate Text-To-Speech</Text>
              </>
            </TouchableRipple>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

export default Setup;