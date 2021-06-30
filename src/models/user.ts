import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("users")
export default class User {
    @PrimaryColumn()
    readonly id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    gender: string;

    @Column()
    phone: string;

    @Column({name: "email_verified"})
    emailVerified: boolean;

    @Column({name: "bling_key"})
    blingKey: string;
}