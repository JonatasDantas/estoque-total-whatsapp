import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity("whatsapp_session")
export default class WhatsappSession {
    @PrimaryColumn({ generated: 'increment' })
    readonly id: number;

    @Column({ name: "auth_browser_id" })
    authBrowserId: string;

    @Column({ name: "auth_secret_bundle" })
    authSecretBundle: string;

    @Column({ name: "auth_token1" })
    authToken1: string;

    @Column({ name: "auth_token2" })
    authToken2: string;

    @Column({ name: "qr_code_file" })
    qrCodeFile: string;

    @Column({ name: "session_name" })
    sessionName: string;

    @Column()
    status: string;

    @Column({ name: "user_id" })
    userId: number;

    @CreateDateColumn({ name: "created_date" })
    createdDate: Date;

    @UpdateDateColumn({ name: "updated_date" })
    updatedDate: Date;

    constructor(
        authBrowserId: string,
        authSecretBundle: string,
        authToken1: string,
        authToken2: string,
        qrCodeFile: string,
        sessionName: string,
        status: string,
        userId: number,
        createdDate: Date,
        updatedDate: Date
    ) {
        this.authBrowserId = authBrowserId;
        this.authSecretBundle = authSecretBundle;
        this.authToken1 = authToken1;
        this.authToken2 = authToken2;
        this.qrCodeFile = qrCodeFile;
        this.sessionName = sessionName;
        this.status = status;
        this.userId = userId;
        this.createdDate = createdDate;
        this.updatedDate = updatedDate;
    }

}