
import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({
  tableName: "users",
  timestamps: true,
})
class User extends Model {

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare nameUser: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare emailUser: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare passwordUser: string;
}

export default User;
