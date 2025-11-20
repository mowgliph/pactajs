import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from "typeorm"
import { User } from "./User"
import { ContractHistory } from "./ContractHistory"
import { ContractSupplement } from "./ContractSupplement"
import { ContractDocument } from "./ContractDocument"
import { Notification } from "./Notification"

export enum ContractStatus {
    ACTIVE = "active",
    EXPIRED = "expired",
    TERMINATED = "terminated"
}

export enum ContractType {
    SERVICE = "service",
    SALES = "sales",
    LEASE = "lease",
    OTHER = "other"
}

@Entity("contracts")
export class Contract {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    title: string

    @Column("text")
    object: string

    @Column({ name: "start_date" })
    startDate: Date

    @Column({ name: "end_date" })
    endDate: Date

    @Column("decimal", { precision: 10, scale: 2 })
    amount: number

    @Column({
        type: "enum",
        enum: ContractStatus,
        default: ContractStatus.ACTIVE
    })
    status: ContractStatus

    @Column({
        type: "enum",
        enum: ContractType
    })
    type: ContractType

    @Column({ name: "created_by" })
    createdById: string

    @ManyToOne(() => User, (user) => user.createdContracts)
    @JoinColumn({ name: "created_by" })
    createdBy: User

    @Column("json")
    parties: string[]

    @OneToMany(() => ContractHistory, (history) => history.contract)
    history: ContractHistory[]

    @OneToMany(() => ContractSupplement, (supplement) => supplement.contract)
    supplements: ContractSupplement[]

    @OneToMany(() => ContractDocument, (document) => document.contract)
    documents: ContractDocument[]

    @OneToMany(() => Notification, (notification) => notification.contract)
    notifications: Notification[]

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date
}