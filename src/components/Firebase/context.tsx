import React from 'react';
import Firebase from './firebase';
const FirebaseContext = React.createContext<Firebase>(new Firebase());

export const withFirebase = (Component: any) => (props: any) => (
  <FirebaseContext.Consumer>
    {firebase => <Component {...props} firebase={firebase} />}
  </FirebaseContext.Consumer>
);

export default FirebaseContext;

