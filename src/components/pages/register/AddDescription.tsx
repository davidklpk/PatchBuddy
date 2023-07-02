import React from 'react';
import { Appbar, Button, Card, Text, TextInput } from 'react-native-paper';
import Tts from 'react-native-tts';
import RNFetchBlob from 'rn-fetch-blob';
import { Platform, ScrollView, View } from 'react-native';
import { ref, set } from 'firebase/database';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import { db } from '../../../../firebase-config';
import { useFocusEffect } from '@react-navigation/native';
import { REACT_APP_FIREBASE_TAG_REF } from "@env";
import { assistantSpeak, readOutLoud } from '../../../global/ttsTools';
import { GLOBAL } from '../../../global/global';
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

function AddDescription({ route, navigation }: { route : any, navigation: any }) : JSX.Element {
  const { id } = route.params;
  const [text, setText] = React.useState("");
  const [hasAudio, setHasAudio] = React.useState(false);
  const audioRecorderPlayer = new AudioRecorderPlayer();
  
  const TTS_INSTRUCTION = "Provide a description for your patch. You can also record an audio description by pressing the microphone button. Release the button to stop recording.";
  const _goBack = () => navigation.navigate('Rewrite');

  const dirs = RNFetchBlob.fs.dirs;   // Gets the directory-paths of the system
  const path = Platform.select({      // Selects the directory, in which the files are saved
    ios: id+'.m4a',
    android: `${dirs.DownloadDir}/desc_${id}.mp3`,
  });

  useFocusEffect(
    React.useCallback(() => {
      assistantSpeak(GLOBAL.isTtsActivated, TTS_INSTRUCTION);
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
    console.info('Recording has been stopped.');
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
      Tts.speak("Your patch is now registered.")
      //navigation.dispatch(StackActions.popToTop());
      navigation.reset({index:0, routes:[{name: 'Start'}]})
  
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
          <Card style={{marginBottom:32}}>
            <Card.Content>
              <Text variant="headlineLarge" style={{paddingBottom: 8}}>Provide a description</Text>
              <Text variant="headlineMedium">{TTS_INSTRUCTION}</Text>
            </Card.Content>
            <Card.Actions style={{marginTop: 8}}>
              <Button mode='text' icon="text-to-speech" onPress={() => readOutLoud(TTS_INSTRUCTION)}>Read out loud</Button>
            </Card.Actions>
          </Card>

          <Text variant='headlineMedium' style={{marginBottom:8}}>Description via Text</Text> 
          <TextInput
              label="Your textual description"
              mode="outlined"
              value={text}
              onChangeText={text => setText(text)}
          />

          <Text variant='headlineMedium' style={{marginTop:32, marginBottom:8}}>Description via Voice</Text> 
          <View style={{flexDirection: "row", flex: 1}}>
            <Button style={{flex: 1, marginRight: 8, }} icon="record" mode="contained" onPressIn={() => onStartRecord()} onPressOut={() => onStopRecord()}>Record</Button>
            <Button style={{flex: 1, marginRight: 8, }} icon="play" mode="contained" onPress={() => onStartPlay()}>Play</Button>
            <Button style={{flex: 1 }} icon="content-save" mode="contained" onPress={() => addPatchToDB()}>Save</Button>
          </View>

        </View>
      </ScrollView>
    </>
  )
}

export default AddDescription;

