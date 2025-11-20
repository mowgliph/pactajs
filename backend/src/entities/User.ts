import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm"
import { PushSubscription } from "./PushSubscription"
import { Notification } from "./Notification"
import { Contract } from "./Contract"

export enum UserRole {
    ADMIN = "admin",
    USER = "user"
}

@Entity("users")
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({ unique: true })
    email: string

    @Column()
    password: string

    @Column()
    name: string

    @Column({
        type: "enum",
        enum: UserRole,
        default: UserRole.USER
    })
    role: UserRole

    @Column({ default: 30, name: "expiration_warning_days" })
    expirationWarningDays: number

    @Column({ default: true, name: "enable_browser_notifications" })
    enableBrowserNotifications: boolean

    @Column({ default: false, name: "enable_email_notifications" })
    enableEmailNotifications: boolean

    @OneToMany(() => PushSubscription, (subscription) => subscription.user)
    pushSubscriptions: PushSubscription[]

    @OneToMany(() => Notification, (notification) => notification.user)
    notifications: Notification[]

    @OneToMany(() => Contract, (contract) => contract.createdBy)
    createdContracts: Contract[]

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date
}