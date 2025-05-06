import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import User from './UsersModel';

@Table({
  tableName: 'consecutive',
  timestamps: true
})
class ConsecutiveRequested extends Model {
  @Column({
    type: DataType.STRING(200),
    allowNull: false
  })
  declare consecutive: string

  @Column({
    type: DataType.STRING(200),
    allowNull: false
  })
  declare addressee: string

  @Column({
    type: DataType.STRING(200),
    allowNull: false
  })
  declare topic: string

  @Column({
    type: DataType.STRING(200),
    allowNull: false
  })
  declare requestedBy: string

  // Foreign Key
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER, // el tipo debe coincidir con el tipo de ID en User (generalmente INTEGER)
    allowNull: false
  })
  declare userId: number;

  @BelongsTo(() => User)
  declare user: User;
}

export default ConsecutiveRequested;
