import { firebase } from '@react-native-firebase/database';
import React, { useEffect, useState } from 'react';
import {SafeAreaView, ScrollView, View } from 'react-native';
import { Text, Button, Card, Appbar, TouchableRipple, useTheme } from 'react-native-paper';
import NfcManager, { NfcEvents, NfcTech } from 'react-native-nfc-manager';
import Tts from 'react-native-tts';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import { useFocusEffect } from '@react-navigation/native';
import { REACT_APP_FIREBASE_DB_URL, REACT_APP_FIREBASE_TAG_REF } from "@env";
import { GLOBAL } from "./../../global/global"
import { assistantSpeak, navigateToScreen, readOutLoud } from '../../global/ttsTools';
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { STRINGS } from '../../global/strings';

function Start({navigation}: {navigation: any}): JSX.Element {

  const [hasNfc, setHasNFC] = useState(false);
  const audioRecorderPlayer = new AudioRecorderPlayer(); 
  const { colors } = useTheme();

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
      assistantSpeak(GLOBAL.isTtsActivated, STRINGS.START_DESC_TTS)
    } else {
      assistantSpeak(GLOBAL.isTtsActivated, STRINGS.NO_NFC_TTS)
    }
    }
    checkIsSupported()
  }, [])

  // reads the tag
  const readTag = async () => {
    await NfcManager.registerTagEvent();
  }

  const searchTag = (id : string) => {
    console.log(REACT_APP_FIREBASE_DB_URL);
    Tts.stop();
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
          Tts.speak(STRINGS.UNKNOWN_TAG);
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
      readOutLoud("Patch detected. TTS-Description: " + description)
    }
  }

  // If NFC is activated
  if(hasNfc) {
    return (
      <>
        <Appbar.Header mode='center-aligned' elevated={true}>
          <Appbar.Content title="PatchBuddy" />
        </Appbar.Header>
        <ScrollView 
          contentContainerStyle={{flexGrow: 1, justifyContent: 'center', marginBottom: 0}}
          contentInsetAdjustmentBehavior="automatic">

            <View style={{padding:16, height:"80%", justifyContent: "center", alignContent: "center"}}>
              <Card>
                <Card.Content>
                  <Icon style={{color: colors.onSurface, paddingBottom: 16, alignSelf:"center"}} name="nfc-search-variant" size={64} />
                  <Text variant="headlineLarge" style={{paddingBottom: 4}}>{STRINGS.START_TITLE_TEXT}</Text>
                  <Text variant="titleLarge">{STRINGS.START_SUBTITLE_TEXT}</Text>
                </Card.Content>
              </Card>
              <View style={{borderRadius: 16, marginTop:16, overflow: 'hidden', justifyContent: "flex-end"}}>
                <TouchableRipple
                  onPress={() => navigateToScreen("Rewrite", navigation)}
                  style={{
                    padding: 16,
                    width: '100%',
                    backgroundColor: colors.primary,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  rippleColor="rgba(255, 255, 255, .18)">
                  <View style={{flex: 1, flexDirection: "row", justifyContent: "flex-end"}}>
                    <Icon style={{color: colors.onPrimary, paddingRight: 8}} name="content-save-edit" size={32} />
                    <Text variant='headlineSmall' style={{color: colors.onPrimary, textAlign: "center"}}>Rewrite existing tag</Text>
                  </View>
                </TouchableRipple>
              </View>
            </View>
        </ScrollView>
        <View style={{borderRadius: 16, overflow: 'hidden', height: "20%", width: '100%', flex: 1, justifyContent: "flex-end"}}>
            <TouchableRipple
              onPress={() => readOutLoud(STRINGS.START_DESC_TTS)}
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

    // If NFC is deactivated
  } else {
    return (
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic">
          <View>
            <Text variant="headlineSmall">No NFC or its turned off</Text>
            <Text variant='headlineLarge'>There is no point in using PatchBuddy without NFC</Text> 
            <Button mode="contained" onPress={() => navigateToScreen("Start", navigation)}>Try Again</Button>
          </View>
        </ScrollView>
      </SafeAreaView> 
    )
  }
};

export default Start;