import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm"
import { Contract } from "./Contract"

@Entity("contract_supplements")
export class ContractSupplement {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({ name: "contract_id" })
    contractId: string

    @ManyToOne(() => Contract, (contract) => contract.supplements)
    @JoinColumn({ name: "contract_id" })
    contract: Contract

    @Column({ name: "supplement_ref_id", nullable: true })
    supplementRefId: string

    @Column({ name: "effective_date" })
    effectiveDate: Date

    @Column("text")
    reason: string

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date

    @Column("json", { name: "modified_fields" })
    modifiedFields: any[]
}