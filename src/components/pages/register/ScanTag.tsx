import React, { useState } from 'react';
import { Text } from 'react-native-paper';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';
import Tts from 'react-native-tts';
import { useFocusEffect } from '@react-navigation/native';

function ScanTag({ navigation }: { navigation: any }) : JSX.Element {

  const [getId, setNFCId] = useState<string | undefined>("");

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
      navigation.navigate('Add Description', { id: tag?.id});
      
    } catch (ex) {
      console.warn('Error while reading NFC-Tag: ', ex);
    } finally {
      // Removes listener
      NfcManager.cancelTechnologyRequest();
    }
  }

  return (
      <>
        <Text variant="headlineSmall">Step 1 of 2</Text>
        <Text variant='headlineLarge'>Scan your Patch by PatchBuddy</Text>
      </> 
  )
}

export default ScanTag;