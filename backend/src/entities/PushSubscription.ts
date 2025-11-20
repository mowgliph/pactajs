import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm"
import { User } from "./User"

@Entity("push_subscriptions")
export class PushSubscription {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Column({ name: "user_id" })
    userId!: string

    @ManyToOne(() => User, (user) => user.pushSubscriptions)
    @JoinColumn({ name: "user_id" })
    user!: User

    @Column("text")
    endpoint!: string

    @Column("text")
    p256dh!: string

    @Column("text")
    auth!: string
}