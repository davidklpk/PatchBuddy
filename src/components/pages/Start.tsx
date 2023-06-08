import { firebase } from '@react-native-firebase/database';
import React, { useEffect, useState } from 'react';
import {SafeAreaView, ScrollView, View } from 'react-native';
import { Text, Button, Card, Appbar } from 'react-native-paper';
import NfcManager, { NfcEvents, NfcTech } from 'react-native-nfc-manager';
import Tts from 'react-native-tts';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import { useFocusEffect } from '@react-navigation/native';
import { REACT_APP_FIREBASE_DB_URL, REACT_APP_FIREBASE_TAG_REF } from "@env";

function Start({navigation}: {navigation: any}): JSX.Element {
  const [hasNfc, setHasNFC] = useState(false);
  const audioRecorderPlayer = new AudioRecorderPlayer();   
  const TTS_DESCRIPTION = "Simply hold your device near your patch. PatchBuddy will handle the rest, promise."

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
      .ref(REACT_APP_FIREBASE_TAG_REF+id)
      .once('value')
      .then(snapshot => {
        if(snapshot.exists()) {
          speakResult(snapshot.child("hasAudio").val(), snapshot.child("description").val(), snapshot.child("path").val());
        } else {
          Tts.speak("The tag is unknown. You can register it right now.");
          navigation.navigate('Rewrite');
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

  const speakDialog = (dialog : string) => {
      Tts.speak(dialog);
  }

  // If NFC activated
  if(hasNfc) {
    return (
      <>
        <Appbar.Header mode='center-aligned' elevated={true}>
          <Appbar.Content title="PatchBuddy" />
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
              <Button mode='contained' style={{marginTop: 32}} icon="content-save-edit" onPress={() => navigation.navigate('Rewrite')}>Rewrite existing tag</Button>
            </View>

            {/**
            <Card>
              <Card.Content>
                <Text variant="titleLarge">Register your tag</Text>
                <Text variant="bodyMedium">Are you using a PatchBuddy tag for the first time? Than you have to register it right here.</Text>
              </Card.Content>
              <Card.Actions>
                <Button mode="contained" onPress={() => navigation.navigate('Rewrite')}>
                  Register Tag
                </Button>
                <Button mode='contained'>Read out loud</Button>
              </Card.Actions>
            </Card> 
            **/}
        </ScrollView>
        </>
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
            <Button mode="contained" onPress={() => navigation.navigate('Start')}>Try Again</Button>
          </View>
        </ScrollView>
      </SafeAreaView> 
    )
  }
};

export default Start;