import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyAGE2tQC0uKJEM9__c6jRwb7cX-cphRldU",
  authDomain: "sample-1-fcb7b.firebaseapp.com",
  projectId: "sample-1-fcb7b",
  storageBucket: "sample-1-fcb7b.appspot.com",
  messagingSenderId: "885333324081",
  appId: "1:885333324081:web:2e89d7ddf86c376d004010"
};

// init firebase
firebase.initializeApp(firebaseConfig)

// init services
const projectFirestore = firebase.firestore()
const projectAuth = firebase.auth()
const timestamp = firebase.firestore.Timestamp

export { projectFirestore, projectAuth,timestamp }