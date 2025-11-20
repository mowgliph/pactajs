import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { User } from "./User"
import { Contract } from "./Contract"

export enum NotificationType {
    EXPIRATION_WARNING = "expiration_warning",
    EXPIRATION_DUE = "expiration_due",
    CONTRACT_CREATED = "contract_created",
    CONTRACT_UPDATED = "contract_updated",
    OTHER = "other"
}

@Entity("notifications")
export class Notification {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({ name: "user_id" })
    userId: string

    @ManyToOne(() => User, (user) => user.notifications)
    @JoinColumn({ name: "user_id" })
    user: User

    @Column({ name: "contract_id" })
    contractId: string

    @ManyToOne(() => Contract, (contract) => contract.notifications)
    @JoinColumn({ name: "contract_id" })
    contract: Contract

    @Column({
        type: "enum",
        enum: NotificationType
    })
    type: NotificationType

    @Column()
    title: string

    @Column("text")
    message: string

    @Column({ default: false })
    read: boolean

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date
}