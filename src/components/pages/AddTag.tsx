import React, { useEffect, useState } from 'react';
import {Platform, SafeAreaView, ScrollView, StatusBar, View } from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import NfcManager, { NfcEvents } from 'react-native-nfc-manager';
import RNFetchBlob from 'rn-fetch-blob';
import { push, ref } from 'firebase/database';
import { db } from '../../../firebase-config';
import Tts from 'react-native-tts';
import { Text, Button, TextInput } from 'react-native-paper';


/**
 * @deprecated use addDescription
 */
function AddTag({navigation}: {navigation: any}): JSX.Element {
  const [hasNfc, setHasNFC] = useState(false);
  const [nfcId, setNFCId] = useState("");

  const audioRecorderPlayer = new AudioRecorderPlayer();

  const onStartRecord = async () => {
    Tts.speak("Recording");

    // waits until the tts ends speaking, if it ends, start recording with microphone
    Tts.addEventListener('tts-finish', async (event) => {
      createDescription(nfcId, "desc_"+nfcId, audioRecorderPlayer);
    });
  };
  
  const onStopRecord = async () => {
    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();

    console.log("stopp", result);
  };

  const onStartPlay = async () => {
    console.log('onStartPlay');
    const msg = await audioRecorderPlayer.startPlayer();
    console.log(msg);
    audioRecorderPlayer.addPlayBackListener((e) => {
      
      return;
    });
  };


  useEffect(() => {
    // checks if the target device supports NFC
    const checkIsSupported = async () => {
      const deviceIsSupported : boolean = await NfcManager.isSupported()
      
      if (deviceIsSupported) {
        setHasNFC(true);
        console.log("DEBUG: Device supports NFC.");
        await NfcManager.start()
        readTag();
      }
    }
    checkIsSupported()
  }, [])

  // reads the tag
  const readTag = async () => {
    await NfcManager.registerTagEvent();
  }

  // if tag is read, do smth
  useEffect(() => {
    NfcManager.setEventListener(NfcEvents.DiscoverTag, (tag: any) => {
      setNFCId(tag.id);
      speakLabel("Patch detected with the id: " + tag.id);
      console.log("DEBUG: Tag found with the id: " + tag.id);
    })

    // unmountig after destroying of the component
    return () => {
      NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
    }
  }, [])

  const [text, setText] = React.useState("");

  return (
    <SafeAreaView>
      <StatusBar/>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic">
        <View>
          <Text variant="headlineLarge">PatchBuddy</Text>
          <Text variant="headlineMedium">Name Tag via Speech</Text>
          <Button mode="contained" onTouchStart={() => onStartRecord()} onTouchEnd={() => onStopRecord()}>
            Record
          </Button>
          <Button mode="contained" onPress={() => onStartPlay()}>
            Play
          </Button>

          <Text variant="headlineMedium">Name Tag via TTS</Text>
          <TextInput
            label="Objects Description"
            value={text}
            onChangeText={text => setText(text)}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  ) ;
};

function speakLabel(label : string) {
  Tts.speak(label);
}

async function createDescription(tagId : string, filePath : string, audioRecorderPlayer : AudioRecorderPlayer) {
  const dirs = RNFetchBlob.fs.dirs;
  const path = Platform.select({
    ios: tagId+'.m4a',
    android: `${dirs.DownloadDir}/${tagId}.mp3`,
  });

  const uri = await audioRecorderPlayer.startRecorder(path)
  addPatch(tagId, filePath);
  console.log("uri", uri);
}


/**
 * 
 * @param tagId the UID of the tag
 * @param path The path, in which the voice 
 */
function addPatch(tagId : string, path : string) {
  try {
    push(ref(db, '/tag'+tagId), {
      id: tagId,
      title: path,
    });
  } catch(e) {
    console.warn("Error writing to DB.");
  }
}

export default AddTag;