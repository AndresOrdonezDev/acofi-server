
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
  declare username: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare email: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare password: string;
}

export default User;
