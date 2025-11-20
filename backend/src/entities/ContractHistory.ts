import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm"
import { Contract } from "./Contract"

@Entity("contract_history")
export class ContractHistory {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({ name: "contract_id" })
    contractId: string

    @ManyToOne(() => Contract, (contract) => contract.history)
    @JoinColumn({ name: "contract_id" })
    contract: Contract

    @Column()
    date: Date

    @Column()
    action: string

    @Column("text")
    details: string
}