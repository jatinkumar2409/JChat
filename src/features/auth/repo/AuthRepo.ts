import { UserDTO } from "@/core/models/User";
import { BACKEND_URL } from "../../../../config";
export class AuthRepo{
    async checkIfUsernameIsUnique(userName : string) : Promise<boolean>{
      const res = await fetch(`${BACKEND_URL}/getUserName?userName=${encodeURIComponent(userName)}`);
      if(res.status === 200){
        return false;
      }
      else if (res.status == 417){
        return true;
      }
      else{
        const body = await res.text();
        throw new Error(
          `Username check failed (${res.status}${res.statusText ? ` ${res.statusText}` : ""})${body ? `: ${body}` : ""}`
        );
      } 
    }

    async addUser(user : UserDTO){
        const res = await fetch(`${BACKEND_URL}/addUser` , {
            method : "POST" ,
             headers: {
        "Content-Type": "application/json",
    },
            body : JSON.stringify(user)
         })
         console.log(res.status);
         if(!res.ok){
            let data = await res.text();
            throw Error(data);
         }
    }

    
    
}