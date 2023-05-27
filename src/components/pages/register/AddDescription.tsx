import React from 'react';
import { Button, Text, TextInput } from 'react-native-paper';
import Tts from 'react-native-tts';
import RNFetchBlob from 'rn-fetch-blob';
import { Platform } from 'react-native';
import { ref, set } from 'firebase/database';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import { db } from '../../../../firebase-config';
import { StackActions, useFocusEffect } from '@react-navigation/native';
import { REACT_APP_FIREBASE_TAG_REF } from "@env";

function AddDescription({ route, navigation }: { route : any, navigation: any }) : JSX.Element {
  const { id } = route.params;
  const [text, setText] = React.useState("");
  const [hasAudio, setHasAudio] = React.useState(false);
  const audioRecorderPlayer = new AudioRecorderPlayer();

  const dirs = RNFetchBlob.fs.dirs;   // Gets the directory-paths of the system
  const path = Platform.select({      // Selects the directory, in which the files are saved
    ios: id+'.m4a',
    android: `${dirs.DownloadDir}/desc_${id}.mp3`,
  });

  useFocusEffect(
    React.useCallback(() => {
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
      set(ref(db, REACT_APP_FIREBASE_TAG_REF +'/'+id), {
        id: id,
        hasAudio : hasAudio,
        path: path,
        description: text,
      });
  
      Tts.removeAllListeners("tts-finish");
      Tts.speak("Your patch is now registered.")
      navigation.dispatch(StackActions.popToTop());
  
    } catch(e) {
      // TODO Exception Handling
      console.warn("DB Error: ", e);
    }
  }

  // TODO: UI Design
  return (
    <>
      <Text variant="headlineSmall">Step 2 of 2</Text>
      <Text variant='headlineLarge'>Give it a description</Text> 
      <Text variant='headlineSmall'>Description via Text</Text> 
      <TextInput
          label="Your description"
          value={text}
          onChangeText={text => setText(text)}
      />
      <Text variant='headlineSmall'>Description via Voice</Text> 
      <Button mode="contained" onPressIn={() => onStartRecord()} onPressOut={() => onStopRecord()}>Start Recording</Button>
      <Button mode="contained" onPress={() => onStartPlay()}>Play Recording</Button>
      <Button mode="contained" onPress={() => addPatchToDB()}>Save</Button>
    </>
  )
}

export default AddDescription;

