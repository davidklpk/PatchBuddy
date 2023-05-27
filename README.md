# PatchBuddy: NFC-based object tagging for visually impaired people

## About The Project
> **Warning**
> Work in progress! The project is still in its early prototype-phase.

PatchBuddy deals with the development of a NFC-based system that can be embedded in patches or adhesive stickers to help visually impaired people in their everyday life. 
The patches and stickers can be customized by the user to identify and distinguish different objects after scanning them via the PatchBuddy application. 
This repository contains the source code for the PatchBuddy cross-plattform application.

> The project is currently in progress as part of the module "Design Digital Media For People With Special Needs" at the Hochschule Bremen in the summer semester 2023. 

## Usage
The goal of the project is to improve the quality of life for visually impaired people by providing them with a tool to easily differentiate objects and identify them. 
By using NFC technology and text-to-speech technology, an intuitive and effective solution is provided that can be easily integrated into users' daily lives.

## Techstack
In order to offer a cross-plattform solution for Android and iOS, the app is built on [React Native](https://reactnative.dev/) in TypeScript.

> **Note**
> Currently only the Android version is working. The iOS version is not tested and probably needs some adjustments.

### Libraries
- [react-native-paper](https://www.npmjs.com/package/react-native-paper)
<br/>_Used for native UI elements_

- [react-navigation](https://reactnavigation.org/)
<br/>_Used for routing and navigation between pages_

- [react-native-tts](https://www.npmjs.com/package/react-native-tts)
<br/>_Used for the Text-To-Speech functionality_

- [react-native-nfc-manager](https://github.com/revtel/react-native-nfc-manager)
<br/>_Used for the NFC reader functionality_

- [rn-fetch-blob](https://www.npmjs.com/package/rn-fetch-blob)
<br/>_Used to easily read and write files on the local device_

- [react-native-dotenv](https://www.npmjs.com/package/react-native-dotenv)
<br/>_Used to safely store sensitive variables, e.g. API-keys_

### Database
- [Firebase Realtime-Database](https://firebase.google.com/docs/database)
<br/>_Used to store and sync the unique identifiers and descriptions of the tags_
