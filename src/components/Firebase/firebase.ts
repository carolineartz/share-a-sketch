import * as firebase from "firebase";
import app from "firebase/app";
import 'firebase/database';


export type DatabaseStatus = "connected" | "disconnected" | "unknown";

// Your web app's Firebase configuration
const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID
};

class Firebase {
  db: firebase.database.Database

  constructor() {
    !firebase.apps.length ? firebase.initializeApp(config) : firebase.app()

    this.db = app.database();
  }
  // *** Connection API ***

  connection = () => this.db.ref(".info/connected")
  onConnectionChanged = (handleChange: (status: DatabaseStatus) => any) => {
    this.connection().on("value", (snapshot: any) => {
      if (snapshot.val()) {
        handleChange("connected");
      } else {
        handleChange("disconnected");
      }
    })
  }

  // *** Shapes API ***

  shape = (id: string) =>  this.db.ref(`shapes_new/${id}`)
  shapes = () => this.db.ref("shapes_new")
  onShapeChanged = (handleChange: Function) => this.shapes().on("child_changed", (snapshot: firebase.database.DataSnapshot) => {
    handleChange(snapshot)
  })

  // *** Draw API ***

  paths = () => this.db.ref("paths_new5")
  path = (id: string) => this.db.ref(`paths_new5/${id}`)
}

export default Firebase;
