import { UserDTO } from "@/core/models/User";
import { UserSearchRepo } from "../repo/UserSearchRepo";


export class UserSearchService{
    constructor(private repo : UserSearchRepo){

    }
   async searchUsers(query : string , signal : AbortSignal ,token : string , onSuccess : (users : UserDTO[]) => void , onFailure : (error : string) => void){
       try{
       let users = await this.repo.getUsersFromQuery(query , signal , token);
       onSuccess(users);
       }
       catch(e : unknown){
          console.error("Authentication error:", e);
             onFailure(e instanceof Error ? e.message : String(e));
       }
   }
}