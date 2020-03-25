import firebase from 'firebase';
import firebaseKeys from '../firebaseKeys.json';

firebase.initializeApp(firebaseKeys);

export const auth = firebase.auth;
export const db = firebase.database();
