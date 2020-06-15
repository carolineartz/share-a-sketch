import FirebaseContext, {withFirebase} from './context'
import Firebase from './firebase';

export default Firebase;

export { FirebaseContext, withFirebase };

export type WithFirebaseProps = { firebase: Firebase }
export type DatabaseStatus = "connected" | "disconnected" | "unknown";

