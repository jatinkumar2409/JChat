import { AuthRepo } from "./repo/AuthRepo";
import { AuthService } from "./services/AuthService";

const authRepo = new AuthRepo();

export const container = {
    authService: new AuthService(authRepo),
};