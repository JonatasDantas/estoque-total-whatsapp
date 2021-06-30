import { Whatsapp, create, Chat } from 'venom-bot';
import fs from "fs";
import path from "path";
import { tokenSession } from 'venom-bot/dist/config/tokenSession.config';

interface Session {
    name: string;
    status: string;
    client: Whatsapp;
}

class RobotService {
    public QR_CODE_DIR = "../assets/qr-codes";
    private sessions: Session[] = [];

    public getSessionByName(name): Session {
        return this.sessions.find((e) => e.name == name);
    }

    public async createSession(name: string): Promise<void> {
        try {
            const client = await create(
                name,
                (base64Qr, asciiQR, attempts, urlCode) => this.writeQrToFile(name, base64Qr),
                undefined,
                {
                    headless: false,
                    logQR: false,
                    autoClose: 0,
                    mkdirFolderToken: '/src/assets'
                }
            );

            this.sessions.push({ client, name, status: '' });
        } catch (err) {
            console.log("erro: ", err);
            throw new Error(err);
        }
    }

    public async checkIsLogged(name: string): Promise<boolean> {
        const session: Session = this.getSessionByName(name);

        if (!session || !session.client.isConnected()) {
            return false;
        }

        return true;
    }

    public async sendMessage(name: string, destination: string, message: string): Promise<boolean> {
        const { client } = await this.getSessionByName(name);

        if ((await client.checkNumberStatus(`${destination}@c.us`)).canReceiveMessage) {
            await client.sendText(`${destination}@c.us`, message);
            return true;
        }

        return false;
    }

    public async killSession(name: string) {
        console.log("killing session");
        const index = this.sessions.findIndex(e => e.name == name);

        await this.getSessionByName(name).client.close();
        this.sessions.splice(index, 1);
    }

    public async getTokenInfo(name: string): Promise<tokenSession> {
        return await this.getSessionByName(name).client.getSessionTokenBrowser();
    }

    public async getAllChats(name: string): Promise<Chat[]> {
        return await this.getSessionByName(name).client.getAllChats();
    }

    private async writeQrToFile(name: string, base64Qr: string) {
        var matches = base64Qr.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
            response: any = {};

        if (matches.length !== 3) {
            return new Error('Invalid input string');
        }

        response.type = matches[1];
        response.data = Buffer.from(matches[2], 'base64');

        const imageBuffer: any = response;
        const filePath: string = path.join(__dirname, this.QR_CODE_DIR, `${name}.png`);

        fs.writeFile(filePath, imageBuffer['data'], 'binary', (err) => console.error(err));
    }
}

export { RobotService };