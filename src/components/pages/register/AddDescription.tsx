import React from 'react';
import { Appbar, Button, Card, Divider, Portal, Text, TextInput, TouchableRipple, useTheme } from 'react-native-paper';
import Tts from 'react-native-tts';
import RNFetchBlob from 'rn-fetch-blob';
import { Modal, Platform, ScrollView, View } from 'react-native';
import { ref, set } from 'firebase/database';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import { db } from '../../../../firebase-config';
import { StackActions, useFocusEffect } from '@react-navigation/native';
import { REACT_APP_FIREBASE_TAG_REF } from "@env";
import { assistantSpeak, navigateToScreen, readOutLoud } from '../../../global/ttsTools';
import { GLOBAL } from '../../../global/global';
import { STRINGS } from '../../../global/strings';
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

function AddDescription({ route, navigation }: { route : any, navigation: any }) : JSX.Element {
  const { id } = route.params;
  const [text, setText] = React.useState("");
  const [hasAudio, setHasAudio] = React.useState(false);
  const audioRecorderPlayer = new AudioRecorderPlayer();  
  const { colors } = useTheme();
  
  const _goBack = () => navigation.navigate('Rewrite');

  const dirs = RNFetchBlob.fs.dirs;   // Gets the directory-paths of the system
  const path = Platform.select({      // Selects the directory, in which the files are saved
    ios: id+'.m4a',
    android: `${dirs.DownloadDir}/desc_${id}.mp3`,
  });

  useFocusEffect(
    React.useCallback(() => {
      assistantSpeak(GLOBAL.isTtsActivated, STRINGS.ADD_PATCH_DESC_TTS);
      return () => {
        // cleanup functions: if unfocused remove all eventListeners etc.
        Tts.removeAllListeners("tts-finish");
      };
    }, [])
  );
  
  /**
   * Tells user that record is starting via TTS and starts the
   * recording itself.
   */ 
  const onStartRecord = async () => {
    Tts.stop();
    Tts.speak("Recording.");
    Tts.addListener("tts-finish", async function diesdas() {
      // waits until the tts ends speaking. If it ends, start recording with microphone
      const uri = await audioRecorderPlayer.startRecorder(path)
      console.info("Recording is saved in:  ", uri);
    })
  };
  
  // Stops the recording
  const onStopRecord = async () => {
    await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    setHasAudio(true);
    //Tts.speak(STRINGS.RECORDING_STOP);
    //console.info(STRINGS.RECORDING_STOP);
  };

  // Starts the recording
  const onStartPlay = async () => {
    console.info("Audio is playing.");
    await audioRecorderPlayer.startPlayer(path);
  };

  /**
   * Adds a NFC tag to the firebase real-time database.
   * If the tag is already existing in the DB it is overwritten.
  */
  const addPatchToDB = async () => {
    try {
      set(ref(db, REACT_APP_FIREBASE_TAG_REF+id), {
        id: id,
        hasAudio : hasAudio,
        path: path,
        description: text,
      });
  
      Tts.removeAllListeners("tts-finish");
      Tts.stop();
      Tts.speak(STRINGS.TAG_SUCCESSFULLY_REGISTERED);

      Tts.addListener("tts-finish", async () => {
        navigation.replace("Start");
        //navigateToScreen("Start", navigation);
      });
      //navigation.reset({index:0, routes:[{name: 'Start'}]})
  
    } catch(e) {
      // TODO Exception Handling
      console.warn("DB Error: ", e);
    }
  }

  // TODO: UI Design
  return (
    <>
      <Appbar.Header elevated={true}>
        <Appbar.BackAction onPress={_goBack} />
        <Appbar.Content title="Add description" />
      </Appbar.Header>
      <ScrollView 
          contentContainerStyle={{flexGrow: 1, justifyContent: 'center', marginBottom: 48}}
          contentInsetAdjustmentBehavior="automatic">

        <View style={{padding:16}}>
          <Card>
            <Card.Content>
              <Icon style={{color: colors.onSurface, paddingBottom: 16, alignSelf:"center"}} name="sticker-plus-outline" size={64} />
              <Text variant="headlineLarge" style={{paddingBottom: 4}}>{STRINGS.ADD_PATCH_TITLE_TEXT}</Text>
              <Text variant="headlineMedium">{STRINGS.ADD_PATCH_SUBTITLE_TEXT}</Text>
            </Card.Content>
          </Card>

          <Divider style={{marginTop:24, marginBottom:16}}/>
          
          <Text variant='headlineSmall' style={{marginBottom:16}}>{STRINGS.ADD_PATCH_TITLE_VIA_AUDIO}</Text> 
          <View style={{flexDirection: "row", flex: 1, height: "20%"}}>
            <Button style={{flex: 1, marginRight: 8, height: "100%" }} icon="record" mode="contained" onPressIn={() => onStartRecord()} onPressOut={() => onStopRecord()}>Record</Button>
            <Button style={{flex: 1, marginRight: 8, }} icon="play" mode="contained" disabled={!hasAudio} onPress={() => onStartPlay()}>Play</Button>
          </View>

          <Divider style={{marginTop:24, marginBottom:24}}/>

          <Text variant='headlineSmall' style={{marginBottom:8}}>{STRINGS.ADD_PATCH_TITLE_VIA_TEXT}</Text> 
          <TextInput
              label="Your textual description"
              mode="outlined"
              value={text}
              onChangeText={text => setText(text)}
          />

          <Divider style={{marginTop:24, marginBottom:24}}/>

          <View style={{borderRadius: 16, overflow: 'hidden', justifyContent: "flex-end"}}>
                <TouchableRipple
                  onPress={() => addPatchToDB()}
                  style={{
                    padding: 16,
                    width: '100%',
                    backgroundColor: colors.primary,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  rippleColor="rgba(255, 255, 255, .18)">
                  <View style={{flex: 1, flexDirection: "row", justifyContent: "flex-end"}}>
                    <Icon style={{color: colors.onPrimary, paddingRight: 8}} name="content-save" size={32} />
                    <Text variant='headlineSmall' style={{color: colors.onPrimary, textAlign: "center"}}>{STRINGS.BUTTON_SAVE_TAG}</Text>
                  </View>
                </TouchableRipple>
              </View>
        </View>
      </ScrollView>
      
      <View style={{borderRadius: 16, overflow: 'hidden', height: "20%", width: '100%', justifyContent: "flex-end"}}>
        <TouchableRipple
          onPress={() => readOutLoud(STRINGS.ADD_PATCH_DESC_TTS)}
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
            <Text variant='headlineSmall' style={{color: colors.onPrimaryContainer, textAlign: "center"}}>{STRINGS.BUTTON_READ_OUT}</Text>
          </>
        </TouchableRipple>
      </View>
    </>
  )
}

export default AddDescription;

