/**
 * TypeScript only, otherwise the import will fail
 */

declare module '@env' {
    export const REACT_APP_FIREBASE_API_KEY: string;
    export const REACT_APP_FIREBASE_AUTH_DOMAIN: string;
    export const REACT_APP_FIREBASE_DB_URL: string;
    export const REACT_APP_FIREBASE_PROJECT_ID: string;
    export const REACT_APP_FIREBASE_STORAGE_BUCKET: string;
    export const REACT_APP_FIREBASE_MSG_SENDER_ID: string;
    export const REACT_APP_FIREBASE_APP_ID: string;
    export const REACT_APP_FIREBASE_TAG_REF: string;
    export const REACT_APP_FIREBASE_WEB_API_KEY: string
}