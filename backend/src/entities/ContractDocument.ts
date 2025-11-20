import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm"
import { Contract } from "./Contract"

@Entity("contract_documents")
export class ContractDocument {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({ name: "contract_id" })
    contractId: string

    @ManyToOne(() => Contract, (contract) => contract.documents)
    @JoinColumn({ name: "contract_id" })
    contract: Contract

    @Column({ name: "document_ref_id", nullable: true })
    documentRefId: string

    @Column()
    filename: string

    @Column({ name: "original_name" })
    originalName: string

    @Column()
    path: string

    @Column()
    size: number

    @Column({ name: "mime_type" })
    mimeType: string

    @CreateDateColumn({ name: "uploaded_at" })
    uploadedAt: Date
}