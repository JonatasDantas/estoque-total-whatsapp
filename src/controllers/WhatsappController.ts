import { NextFunction, Request, Response } from "express";
import { WhatsappService } from "../services/WhatsappService";
import { UserService } from "../services/UserService";
import { User } from "../models";

class WhatsapController {
    private static whatsappService: WhatsappService;
    private static userService: UserService;

    public async setupSession(req: Request, res: Response, next: NextFunction) {
        const { userId } = req.params;
        const user: User = await WhatsapController.getUser(userId);

        const result: Object = await WhatsapController.getWhatsappService().handleSetupSession(user);

        return res.json(result);
    }

    public async sendMessage(req: Request, res: Response, next: NextFunction) {
        const { userId, destination, message } = req.body;
        const user: User = await WhatsapController.getUser(userId);

        const result = await WhatsapController.getWhatsappService().handleSendMessage(user, destination, message);
        return res.status(200).send(result);
    }

    public async getAllChats(req: Request, res: Response, next: NextFunction) {
        const { userId } = req.params;
        const user: User = await WhatsapController.getUser(userId);

        const result = await WhatsapController.getWhatsappService().handleGetAllChats(user);
        return res.status(200).json(result);
    }

    private static getWhatsappService(): WhatsappService {
        if (!this.whatsappService) {
            this.whatsappService = new WhatsappService();
        }

        return this.whatsappService;
    }

    private static getUserService(): UserService {
        if (!this.whatsappService) {
            this.userService = new UserService();
        }

        return this.userService;
    }

    private static async getUser(userId): Promise<User> {
        const user: User = await WhatsapController.getUserService().retrieveUser(userId);

        if (!user) {
            throw new Error("Usuário não encontrado");
        }

        return user;
    }
}

export { WhatsapController };