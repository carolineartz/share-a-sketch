import FirebaseContext, {withFirebase, firebaseApp} from './context'
import Firebase from './firebase';

export default Firebase;

export { FirebaseContext, withFirebase, firebaseApp };

export type WithFirebaseProps = { firebase: Firebase }
export type DatabaseStatus = "connected" | "disconnected" | "unknown";

