import React, { useState } from 'react';
import { Appbar, Card, Text, Button, TouchableRipple, useTheme } from 'react-native-paper';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';
import Tts from 'react-native-tts';
import { useFocusEffect } from '@react-navigation/native';
import { ScrollView, View } from 'react-native';
import { assistantSpeak, readOutLoud } from '../../../global/ttsTools';
import { GLOBAL } from '../../../global/global';
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { STRINGS } from '../../../global/strings';

function ScanTag({ navigation }: { navigation: any }) : JSX.Element {
  const [getId, setNFCId] = useState<string | undefined>("");
  const { colors } = useTheme();
  const _goBack = () => navigation.navigate('Start');

  useFocusEffect(
    React.useCallback(() => {
      readNdef();
      assistantSpeak(GLOBAL.isTtsActivated, STRINGS.SCAN_DESC_TTS)
      return () => {
        Tts.removeAllListeners("tts-finish");
      };
    }, [])
  );

  /**
   * Waits for a single NFC-Tag presentation and reads its UID.
   * 
   */
  async function readNdef() {
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();
      console.info('Found a tag with the id #', tag?.id);
      setNFCId(tag?.id)
      Tts.speak(STRINGS.SCAN_SUCCESS_TTS);
      Tts.stop();
      navigation.navigate('Describe', { id: tag?.id});
      
    } catch (ex) {
      console.warn('Error while reading NFC-Tag: ', ex);
    } finally {
      // Removes listener
      NfcManager.cancelTechnologyRequest();
    }
  }

  return (
      <>
        <Appbar.Header elevated={true}>
          <Appbar.BackAction onPress={_goBack} />
          <Appbar.Content title="Rewrite a patch" />
        </Appbar.Header>
        <ScrollView 
          contentContainerStyle={{flexGrow: 1, justifyContent: 'center', marginBottom: 0}}
          contentInsetAdjustmentBehavior="automatic">

          <View style={{padding:16, height:"80%", justifyContent: "center", alignContent: "center"}}>
            <Card>
              <Card.Content>
                <Icon style={{color: colors.onSurface, paddingBottom: 16, alignSelf:"center"}} name="nfc-search-variant" size={64} />
                <Text variant="headlineLarge" style={{paddingBottom: 4}}>Scan your patch</Text>
                <Text variant="titleLarge">{STRINGS.SCAN_DESC_TTS}</Text>
              </Card.Content>
              {/* <Card.Actions style={{marginTop: 16}}>
                <Button mode='text' icon="text-to-speech" onPress={() => readOutLoud(STRINGS.SCAN_DESC_TTS)}>Read out loud</Button>
              </Card.Actions> */}
            </Card>
          </View>
        </ScrollView>
        
        <View style={{borderRadius: 16, overflow: 'hidden', height: "20%", width: '100%', flex: 1, justifyContent: "flex-end"}}>
            <TouchableRipple
              onPress={() => readOutLoud(STRINGS.SCAN_DESC_TTS)}
              style={{
                padding: 16,
                height: "100%",
                width: '100%',
                backgroundColor: colors.primaryContainer,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              rippleColor="rgba(255, 255, 255, .18)">
              <>
              <Icon style={{color: colors.onPrimaryContainer, paddingBottom: 16}} name="text-to-speech" size={32} />
              <Text variant='headlineMedium' style={{color: colors.onPrimaryContainer, textAlign: "center"}}>{STRINGS.BUTTON_READ_OUT}</Text>
              </>
            </TouchableRipple>
        </View>
      </> 
  )
}

export default ScanTag;