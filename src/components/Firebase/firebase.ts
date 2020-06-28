
import * as firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/analytics';


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
    if (!firebase.apps.length) {
      firebase.initializeApp(config)
      firebase.analytics();
    } else {
      firebase.app()
    }

    this.db = firebase.database();
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
  shapes = () => this.db.ref("shapes_new").orderByKey().limitToFirst(192)
  onShapeChanged = (handleShapeChanged: (data: any) => void) => this.shapes().on("child_changed", (snapshot: firebase.database.DataSnapshot) => {
    handleShapeChanged((shapes: any) => {
      const updatingShapes = {...shapes}
      if (snapshot.key) {
        updatingShapes[snapshot.key] = { rotationIndex: snapshot.val().rotationIndex, color: snapshot.val().color}
      }

      return updatingShapes
    })
  })

  // *** Draw API ***
  drawings = () => this.db.ref("drawings")

  paths = () => this.db.ref("drawings/paths")
  path = (id: string) => this.db.ref(`drawings/paths/${id}`)

  texts = () => this.db.ref("drawings/texts/")
  text = (id: string) => this.db.ref(`drawings/texts/${id}`)

  emojis = () => this.db.ref("drawings/emojis/")
  emoji = (id: string) => this.db.ref(`drawings/emojis/${id}`)
}

export default Firebase;
