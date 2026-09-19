import { FirebaseAuthManager } from "@/core/firebase/FirebaseAuthManager";
import { UserDTO } from "@/core/models/User";
import { User } from "firebase/auth";
import { AuthRepo } from "../repo/AuthRepo";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const firebaseError = error as Error & { code?: string };
    return firebaseError.code
      ? `${firebaseError.code}: ${firebaseError.message}`
      : firebaseError.message;
  }

  return typeof error === "string" ? error : "An unexpected error occurred";
}

export class AuthService{
    private authRepo : AuthRepo
    private firebaseAuthManager : FirebaseAuthManager
    constructor(authRepo : AuthRepo , firebaseAuthManager : FirebaseAuthManager){
      this.authRepo = authRepo
      this.firebaseAuthManager = firebaseAuthManager
    }
    async createAccount(name : string, userName : string , email : string , password : string , onSuccess : () => void , onFailure : (error : string)=> void){
       try{
         const isUserNameUnique = await this.authRepo.checkIfUsernameIsUnique(userName);
         if(!isUserNameUnique){
          onFailure("Username is not unique");
          return;
         }
         const fbUser : User = await this.firebaseAuthManager.createAccount(name , email , password);
         const user : UserDTO ={
             userId : fbUser.uid , userName : userName , profilePicture : fbUser.photoURL?? "" , name  :fbUser.displayName ?? name , email: fbUser.email ?? email ,about: ""
         }
         await this.authRepo.addUser(user);
         onSuccess();
       }catch(e : unknown){
          const message = getErrorMessage(e);
          console.error("Authentication error:", e);
          onFailure(message);
       }
    }
    async logIn(email : string , password : string , onSuccess : () => void , onFailure : (error : string)=> void){
       try{
          await this.firebaseAuthManager.signIn( email , password);
         onSuccess();
       }catch(e : unknown){
          const message = getErrorMessage(e);
          console.error("Authentication error:", e);
          onFailure(message);
       }
    }
}