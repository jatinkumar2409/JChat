import { AuthRepo } from "./repo/AuthRepo";
import { AuthService } from "./services/AuthService";
import { FirebaseAuthManager } from "@/core/firebase/FirebaseAuthManager";
const authRepo = new AuthRepo();
const firebaseAuthManager = new FirebaseAuthManager();
export const container = {
    authService: new AuthService(authRepo , firebaseAuthManager),
};