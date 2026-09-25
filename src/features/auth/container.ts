import { ChatDao } from "@/core/sqlite/dao/ChatDao";
import { DirectMessageService } from "../chat/services/DirectMessageService";
import { UserSearchRepo } from "../search/repo/UserSearchRepo";
import { UserSearchService } from "../search/services/UserSearchService";
import { AuthRepo } from "./repo/AuthRepo";
import { AuthService } from "./services/AuthService";
import { FirebaseAuthManager } from "@/core/firebase/FirebaseAuthManager";
import { useDb } from "@/core/sqlite/database/db";
const authRepo = new AuthRepo();
const firebaseAuthManager = new FirebaseAuthManager();
const userSearchRepo = new UserSearchRepo();
const db = useDb();
const chatDao = new ChatDao(db);
export const container = {
    authService: new AuthService(authRepo , firebaseAuthManager),
    searchService : new UserSearchService(userSearchRepo),
    directMessageService : new DirectMessageService(chatDao)
};