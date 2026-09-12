import { UserDTO } from "@/core/models/User";
import {AuthRepo} from "../repo/AuthRepo";
import { User } from "firebase/auth";
import { BACKEND_URL } from "../../../../config";
export class AuthService{
    private authRepo : AuthRepo
    constructor(authRepo : AuthRepo){
      this.authRepo = authRepo
    }
    async createAccount(name : string , email : string , password : string , onSuccess : () => void , onFailure : (error : string)=> void){
       try{
         const fbUser : User = await this.authRepo.signUp(name , email , password);
         const user : UserDTO ={
             userId : fbUser.uid , name  :fbUser.displayName ?? name , email: fbUser.email ?? email ,about: ""
         }
         const res = await fetch(`${BACKEND_URL}/addUser` , {
            method : "POST" ,
             headers: {
        "Content-Type": "application/json",
    },
            body : JSON.stringify(user)
         })
         console.log(res.status);
         if(res.ok){
            onSuccess();
         }
       }catch(e : unknown){
           if (e instanceof Error) {
    console.error("Error message:", e.message);
          onFailure(e.message);
  } else {
    console.error("An unexpected error occurred:", e);
    onFailure("An unexpected error occurred");
  }
       }
    }
    async logIn(email : string , password : string , onSuccess : () => void , onFailure : (error : string)=> void){
       try{
         const fbUser : User = await this.authRepo.signIn( email , password);
         onSuccess();
       }catch(e : unknown){
           if (e instanceof Error) {
    console.error("Error message:", e.message);
          onFailure(e.message);
  } else {
    console.error("An unexpected error occurred:", e);
    onFailure("An unexpected error occurred");
  }
       }
    }
}