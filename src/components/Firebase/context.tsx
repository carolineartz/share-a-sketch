import React from 'react';
import Firebase from './firebase';
export const firebaseApp = new Firebase()
const FirebaseContext = React.createContext<Firebase>(firebaseApp);

export const withFirebase = (Component: any) => (props: any) => (
  <FirebaseContext.Consumer>
    {firebase => <Component {...props} firebase={firebase} />}
  </FirebaseContext.Consumer>
);

export default FirebaseContext;

