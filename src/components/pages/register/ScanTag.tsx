import React, { useState } from 'react';
import { Appbar, Card, Text, Button } from 'react-native-paper';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';
import Tts from 'react-native-tts';
import { useFocusEffect } from '@react-navigation/native';
import { ScrollView, View } from 'react-native';

function ScanTag({ navigation }: { navigation: any }) : JSX.Element {

  const [getId, setNFCId] = useState<string | undefined>("");

  const _goBack = () => navigation.navigate('Start');

  const TTS_DESCRIPTION = "To rewrite your patch, simply hold your device near the patch. If successful, you can edit your patch."

  useFocusEffect(
    React.useCallback(() => {
      readNdef();
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
      Tts.speak("Patch successfully scanned. Provide a description.");
      navigation.navigate('Describe', { id: tag?.id});
      
    } catch (ex) {
      console.warn('Error while reading NFC-Tag: ', ex);
    } finally {
      // Removes listener
      NfcManager.cancelTechnologyRequest();
    }
  }

  const speakDialog = (dialog : string) => {
    Tts.speak(dialog);
  }

  return (
      <>
        <Appbar.Header elevated={true}>
          <Appbar.BackAction onPress={_goBack} />
          <Appbar.Content title="Rewrite a patch" />
        </Appbar.Header>
        <ScrollView 
          contentContainerStyle={{flexGrow: 1, justifyContent: 'center', marginBottom: 48}}
          contentInsetAdjustmentBehavior="automatic">
            <View style={{padding:16}}>
              <Card>
                <Card.Content>
                  <Text variant="titleLarge" style={{paddingBottom: 8}}>Scan your patch</Text>
                  <Text variant="bodyLarge">{TTS_DESCRIPTION}</Text>
                </Card.Content>
                <Card.Actions style={{marginTop: 8}}>
                  <Button mode='text' icon="text-to-speech" onPress={() => speakDialog(TTS_DESCRIPTION)}>Read out loud</Button>
                </Card.Actions>
              </Card>
            </View>
        </ScrollView>
      </> 
  )
}

export default ScanTag;