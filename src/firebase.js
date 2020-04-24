import firebase from 'firebase';

const firebaseKeys = {
  apiKey: "AIzaSyA0znKrxhs4kmljRdT2feQwwkmadfGq1O8",
  authDomain: "wfchat-906e0.firebaseapp.com",
  databaseURL: "https://wfchat-906e0.firebaseio.com",
  storageBucket: 'wfchat-906e0.appspot.com'
};

firebase.initializeApp(firebaseKeys);

export const auth = firebase.auth;
export const db = firebase.database();
export const storage = firebase.storage();
