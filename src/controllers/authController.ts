import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/UsersModel";
import { generateJWT } from "../utils/jwt";

const SALT_ROUNDS = 10;
export class authController {
  static createAccount = async (req: Request, res: Response) => {
    try {
      const { nameUser, emailUser, passwordUser } = req.body;

      // Validar campos obligatorios
      if (!nameUser || !emailUser || !passwordUser) {
        res.status(400).json({ message: "Todos los campos son obligatorios" });
        return;
      }

      // Verificar si el email ya está registrado
      const existingUser = await User.findOne({ where: { emailUser } });
      if (existingUser) {
        res.status(409).json({ message: "El correo ya está registrado" });
        return;
      }

      // Hash de la contraseña
      const hashedPassword = await bcrypt.hash(passwordUser, SALT_ROUNDS);

      // Crear nuevo usuario
      const newUser = await User.create({
        nameUser,
        emailUser,
        passwordUser: hashedPassword,
      });
      res.status(201).json({
        message: "Cuenta creada exitosamente",
        user: {
          id: newUser.id,
          nameUser: newUser.nameUser,
          emailUser: newUser.emailUser,
        },
      });

      return;
    } catch (error) {
      console.error("Error al crear la cuenta:", error);
      res.status(500).json({ message: "Error del servidor" });
      return;
    }
  };

  static login = async (req: Request, res: Response) => {
    try {
      const { emailUser, passwordUser } = req.body;

      // Validar campos obligatorios
      if (!emailUser || !passwordUser) {
        res
          .status(400)
          .json({ message: "Correo y contraseña son obligatorios" });
        return;
      }

      // Buscar el usuario por email
      const user = await User.findOne({ where: { emailUser } });
      if (!user) {
        res.status(401).json({ message: "Correo o contraseña incorrectos" });
        return;
      }

      // Comparar contraseñas
      const isPasswordValid = await bcrypt.compare(
        passwordUser,
        user.passwordUser
      );
      if (!isPasswordValid) {
        res.status(401).json({ message: "Correo o contraseña incorrectos" });
        return;
      }
      const token = generateJWT({id:user.id})
      res.status(200).send(token);
      return;
    } catch (error) {
      console.error("Error en login:", error);
      res.status(500).json({ message: "Error del servidor" });
      return;
    }
  };

  static updatePassword = async (req: Request, res: Response) => {
    try {
      const { emailUser, newPassword } = req.body;
  
      // Validar campos obligatorios
      if (!emailUser || !newPassword) {
        res.status(400).json({ message: "Correo y nueva contraseña son obligatorios" });
        return;
      }
  
      // Buscar el usuario por email
      const user = await User.findOne({ where: { emailUser } });
      if (!user) {
        res.status(404).json({ message: "Usuario no encontrado" });
        return;
      }
  
      // Hash de la nueva contraseña
      const hashedNewPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
  
      // Actualizar contraseña
      await user.update({ passwordUser: hashedNewPassword });
  
      res.status(200).json({ message: "Contraseña actualizada correctamente 👌" });
      return;
    } catch (error) {
      console.error("Error al actualizar la contraseña:", error);
      res.status(500).json({ message: "Error del servidor" });
      return;
    }
  };
}
