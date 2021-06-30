import { RobotService } from "./RobotService";
import { User, WhatsappSession, WhatsappStatus } from "../models";
import { getRepository, Repository } from 'typeorm';

class WhatsappService {
    private whatsappRepository: Repository<WhatsappSession>;
    private robotService: RobotService;

    constructor() {
        this.whatsappRepository = getRepository(WhatsappSession);
        this.robotService = new RobotService();
    }

    public async handleSetupSession(user: User): Promise<Object> {
        let whatsappSession: WhatsappSession = await this.whatsappRepository.findOne({where: {userId: user.id}});

        if (!whatsappSession) {
            whatsappSession = new WhatsappSession(
                null,
                null,
                null,
                null,
                `${this.robotService.QR_CODE_DIR}/${user.email}`,
                user.email,
                WhatsappStatus.WAITING_QR_SCAN.toString(),
                user.id,
                new Date(),
                new Date()
            );
        } else {
            whatsappSession.status = WhatsappStatus.WAITING_QR_SCAN.toString();
        }

        if (await this.robotService.checkIsLogged(user.email)) {
            whatsappSession.status = WhatsappStatus.AUTHENTICATED.toString();
            await this.whatsappRepository.save(whatsappSession);
            return {
                status: 200,
                result: "USER_ALREADY_LOGGED"
            };
        }

        this.invokeCreateSession(user);
        await this.whatsappRepository.save(whatsappSession);

        return {
            status: 200,
            result: "WAITING_QR_CODE",
            qr_path: `${this.robotService.QR_CODE_DIR}/${user.email}`,
        }
    }

    public async handleSendMessage(user: User, destinationNumber: string, message: string): Promise<boolean> {
        if (!await this.robotService.checkIsLogged(user.email)) {
            throw new Error("Usuário não logado!");
        }

        return await this.robotService.sendMessage(user.email, destinationNumber, message);
    }

    public async handleGetAllChats(user: User) {
        if (!await this.robotService.checkIsLogged(user.email)) {
            throw new Error("Usuário não logado!");
        }

        return await this.robotService.getAllChats(user.email);
    }

    private async invokeCreateSession(user: User) {
        await this.robotService.createSession(user.email);

        console.log("authenticated!");
        const { WABrowserId, WASecretBundle, WAToken1, WAToken2 } = await this.robotService.getTokenInfo(user.email);
        const session = await this.whatsappRepository.findOne({ where: { userId: user.id } });

        session.authBrowserId = WABrowserId;
        session.authSecretBundle = WASecretBundle;
        session.authToken1 = WAToken1;
        session.authToken2 = WAToken2;
        session.status = WhatsappStatus.AUTHENTICATED.toString();

        this.whatsappRepository.save(session);
    }
}

export { WhatsappService };