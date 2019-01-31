import firebase from "firebase/app";
import "firebase/database";

firebase.initializeApp({
  apiKey: "AIzaSyDXP9texxtcEj9vm__xJROfUVAf9hB_enE",
  authDomain: "fir-benkyokai.firebaseapp.com",
  databaseURL: "https://fir-benkyokai.firebaseio.com",
  projectId: "fir-benkyokai",
  storageBucket: "fir-benkyokai.appspot.com",
  messagingSenderId: "890067072721"
});

export default firebase;
