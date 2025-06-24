import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

export enum CouponType {
  FIXED = 'fixed',
  PERCENT = 'percent',
}

@Entity('coupons')
export class Coupon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string; // Código do cupom (ex.: DESCONTO10)

  @Column({
    type: 'enum',
    enum: CouponType,
  })
  type: CouponType; // Tipo: fixed ou percent

  @Column('decimal', { precision: 10, scale: 2 })
  value: number; // Valor fixo ou percentual (ex.: 10 ou 10%)

  @Column({ default: false })
  oneShot: boolean; // Se é uso único

  @Column({ type: 'datetime' })
  validFrom: Date; // Data de início da validade

  @Column({ type: 'datetime' })
  validUntil: Date; // Data de fim da validade

  @Column({ default: 0 })
  usageCount: number; // Contagem de usos

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
