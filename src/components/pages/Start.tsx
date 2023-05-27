import { firebase } from '@react-native-firebase/database';
import React, { useEffect, useState } from 'react';
import {SafeAreaView, ScrollView, View } from 'react-native';
import { Text, Button } from 'react-native-paper';
import NfcManager, { NfcEvents, NfcTech } from 'react-native-nfc-manager';
import Tts from 'react-native-tts';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import { useFocusEffect } from '@react-navigation/native';
import { REACT_APP_FIREBASE_DB_URL } from "@env";

function Start({navigation}: {navigation: any}): JSX.Element {
  const [hasNfc, setHasNFC] = useState(false);
  const audioRecorderPlayer = new AudioRecorderPlayer(); 

  useFocusEffect(
    React.useCallback(() => {
      // If it is focused, search for NFC-Tags
      NfcManager.setEventListener(NfcEvents.DiscoverTag, (tag: any) => {
        searchTag(tag.id)
        console.info("Tag found with the id: " + tag.id);
        ;
      })

      return () => {
        // cleanup functions
        NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
        NfcManager.cancelTechnologyRequest();
        Tts.removeAllListeners("tts-finish");
      };
    }, [])
  );

  useEffect(() => {
    // checks if the target device supports NFC
    const checkIsSupported = async () => {
      const deviceIsSupported : boolean = await NfcManager.isSupported();
      const nfcIsTurnedOn : boolean = await NfcManager.isEnabled();
      
      if (deviceIsSupported && nfcIsTurnedOn) {
        setHasNFC(true);
        await NfcManager.start()
        readTag();
      } else {
        Tts.speak("Your NFC seems to be turned of. Please turn it on, in order to use PatchBuddy.");
      }
    }
    checkIsSupported()
  }, [])

  // reads the tag
  const readTag = async () => {
    await NfcManager.registerTagEvent();
  }

  const searchTag = (id : string) => {
    console.log(REACT_APP_FIREBASE_DB_URL)
    try {
      firebase
      .app()
      .database(REACT_APP_FIREBASE_DB_URL)
      .ref("/tags/"+id)
      .once('value')
      .then(snapshot => {
        if(snapshot.exists()) {
          speakResult(snapshot.child("hasAudio").val(), snapshot.child("description").val(), snapshot.child("path").val());
        } else {
          Tts.speak("The tag is unknown. Try to register it.");
        }
      });
    } catch(error) {
      //TODO Exception Handling
      console.log("DEBUG: Database connection failed")
    }
    Tts.removeAllListeners("tts-finish");
  }

  /**
   * Speaks the description of the tag:
   * If there is a voice message this will be prefered and played automatically
   * Otherwise, the description is read out load by TTS.
   * 
   * @param hasAudio Checks, if the entry in the database has an audio-path in order to play the audio-file
   * @param description The description provided by the user
   * @param path The path, in which the audio-file is saved
   */
  const speakResult = (hasAudio : boolean, description : string, path : string) => {
    if(hasAudio) {

      console.log("DEBUG: hasAudio: " + hasAudio + " | Path: " + path)
  
      Tts.speak("Patch detected. Voice-Description: ");
      Tts.addEventListener("tts-finish", async (event) => {
        await audioRecorderPlayer.startPlayer(path);
      })
    } else {
      Tts.speak("Patch detected. TTS-Description: " + description);
    }
  }

  // If NFC activated
  if(hasNfc) {
    return (
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic">
          <View>
            <Text variant="headlineLarge">Present Tag</Text>
            <Text variant="headlineMedium">If a Tag is recognized you will notice</Text>
            <Button mode="contained" onPress={() => navigation.navigate('Scan your Patch')}>
              Register Tag
            </Button>
          </View>
        </ScrollView>
      </SafeAreaView> 
    )
    // If NFC is deactivated not 
  } else {
    return (
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic">
          <View>
            <Text variant="headlineSmall">No NFC or its turned off</Text>
            <Text variant='headlineLarge'>There is no point in using PatchBuddy without NFC</Text> 
            <Button mode="contained" onPress={() => navigation.navigate('Looking for Patches')}>Try Again</Button>
          </View>
        </ScrollView>
      </SafeAreaView> 
    )
  }
};

export default Start;