import { UserDTO } from "@/core/models/User";
import { BACKEND_URL } from "../../../../config";
export class UserSearchRepo{
    async getUsersFromQuery(query : string , signal : AbortSignal , token : string): Promise<UserDTO[]>{
    const res = await fetch(`${BACKEND_URL}/searchUsers?query=${encodeURIComponent(query)}` , {
        signal : signal ,
        headers : {
            "Authorization" : `Bearer ${token}`
        }
    } );
     if(res.ok){
        let data : UserDTO[] = await res.json();
        return data;
     }
     else{
        let error = await res.text();
        throw Error(error);
     }
    }
}