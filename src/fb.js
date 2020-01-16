import * as firebase from "firebase";
import store from "./store";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD4h1cO2Opg58pqjkhDr9Qnw5u_R2JbrjU",
  authDomain: "vue-todo-app-b315e.firebaseapp.com",
  databaseURL: "https://vue-todo-app-b315e.firebaseio.com",
  projectId: "vue-todo-app-b315e",
  storageBucket: "vue-todo-app-b315e.appspot.com",
  messagingSenderId: "99852172280",
  appId: "1:99852172280:web:9a00841070f1f1c305740d",
  measurementId: "G-SDV9K7JJHJ"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

firebase.auth().onAuthStateChanged(user => {
  store.dispatch("fetchUser", user);
});

export default firebase;
