/**
 * Collection of all strings used in the app, including the text-to-speech strings.
 */

const STRINGS = {

    // BUTTONS
    BUTTON_READ_OUT: "Read out loud",
    BUTTON_SAVE_TAG: "Save patch",

    // MISC
    NO_NFC_TTS: "Your NFC seems to be turned of. Please turn it on, in order to use PatchBuddy.",
    UNKNOWN_TAG: "The tag is unknown. You can register it right now.",
    TAG_SUCCESSFULLY_REGISTERED: "Tag successfully registered. You can start using it as your PatchBuddy.",

    // RECORDING
    RECORDING_START: "Recording started",
    RECORDING_STOP: "Recording stopped",

    // SETUP PAGE
    SETUP_DESC_TTS: "Hi, I am your PatchBuddy. Before we get started, I need to know if you want me to read out loud constantly all relevant menu items to you. If yes, press the upper half of your screen. Otherwise, if you want me to stay quiet, press the lower half of your screen. Keep in mind: You can always activate text-to-speech, even if you turn it off.",
    SETUP_TTS_TRUE: "Text-to-speech is activated. You can always reread the text by tapping at the lower bottom your screen.",
    SETUP_TTS_FALSE: "Text-to-speech is deactivated. You can always reread the text by tapping at the lower bottom your screen.",

    // START PAGE
    START_TITLE_TEXT: "Scan your patch",
    START_SUBTITLE_TEXT: "Scan your patch to get started by holding your device over your patch.",
    START_DESC_TTS: "Scan your patch to get started by holding your device over your patch. You will get notified when a patch is detected.",

    // SCAN PAGE
    SCAN_DESC_TTS: "Hold your device over your patch to scan it. You will get notified when a patch is detected and are able to edit it.",
    SCAN_SUCCESS_TTS: "Patch successfully scanned. Provide a description.",

    // ADD PATCH
    ADD_PATCH_DESC_TTS: "Provide a description for your patch. You can type in a text or record an audio description by pressing the microphone button. Release the button to stop recording.",
    ADD_PATCH_TITLE_TEXT: "Add a new patch",
    ADD_PATCH_SUBTITLE_TEXT: "Provide a description for your patch by text or audio.",
    ADD_PATCH_TITLE_VIA_TEXT: "Description via text",
    ADD_PATCH_TITLE_VIA_AUDIO: "Description via audio",
};

 export { STRINGS }