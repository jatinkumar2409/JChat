import { createUserWithEmailAndPassword, signInWithEmailAndPassword , updateProfile } from "firebase/auth";
import {auth} from "./firebaseConfig";
export class FirebaseAuthManager{
    async createAccount (name : string , email : string , password : string){
        const credential =
                    await createUserWithEmailAndPassword(
                        auth,
                        email,
                        password
                    );
                await updateProfile(credential.user, {
                    displayName: name,
                });
                return credential.user;
    }

    async signIn(email : string , password : string){
         const credential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );
        return credential.user;
    }
}