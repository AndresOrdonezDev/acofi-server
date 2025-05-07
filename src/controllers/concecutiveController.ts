import { Request, Response } from "express";
import ConsecutiveRequested from "../models/ConsecutiveModel";
import User from "../models/UsersModel";

export class consecutiveRequestController {

  static newConsecutiveRequest = async (req: Request, res: Response) => {
    try {
      const currentYear = new Date().getFullYear();
      const { acronym, addressee, requestedBy, topic } = req.body;
  
      // 1️⃣ Obtener el consecutivo más reciente
      const lastConsecutive = await ConsecutiveRequested.findOne({
        order: [["createdAt", "DESC"]],
      });
  
      let newConsecutiveCode: string;
      let nextNumber = 1; // por defecto si no hay registros
  
      if (lastConsecutive) {
        const lastCode = lastConsecutive.consecutive; // Ej: 'SHD-2025-00001' o 'SHD-TGD-2025-00001'
        const parts = lastCode.split("-");
  
        let numberPart: string;
  
        if (parts.length === 3) {
          // formato SHD-2025-00001
          numberPart = parts[2]; // '00001'
        } else if (parts.length === 4) {
          // formato SHD-TGD-2025-00001
          numberPart = parts[3]; // '00001'
        } else {
          throw new Error("Formato de consecutivo inválido en la base de datos");
        }
  
        nextNumber = parseInt(numberPart, 10) + 1;
      }
  
      // 2️⃣ Formatear el nuevo código (con ceros a la izquierda)
      const nextNumberPadded = String(nextNumber).padStart(5, "0");
  
      if (acronym === "SHD") {
        newConsecutiveCode = `${acronym}-${currentYear}-${nextNumberPadded}`;
      } else {
        newConsecutiveCode = `SHD-${acronym}-${currentYear}-${nextNumberPadded}`;
      }
  
      // 3️⃣ Crear la solicitud de consecutivo
      await ConsecutiveRequested.create({
        consecutive: newConsecutiveCode,
        addressee,
        topic,
        requestedBy,
        userId: req.user.id || 1,
      });
  
      res.send(newConsecutiveCode);
    } catch (error) {
      console.error(error);
      res.status(500).send("Algo salió mal");
    }
  };
  
  
  static getAllConsecutive = async (req: Request, res: Response) => {
    try {
      const consecutive = await ConsecutiveRequested.findAll({
        include: [{
          model: User,
          attributes: ['id', 'username', 'email'] // solo las columnas que quieres traer
        }]
      });
      res.json(consecutive);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error al obtener los consecutivos");
    }
  };

  static getUserConsecutive = async (req: Request, res: Response) => {
    try {
      const userId = req.user.id;  // 👈 obtener el id del usuario autenticado
  
      const consecutive = await ConsecutiveRequested.findAll({
        where: { userId },  // 👈 filtrar por userId
        include: [{
          model: User,
          attributes: ['id', 'username', 'email']
        }]
      });
  
      res.json(consecutive);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error al obtener los consecutivos del usuario");
    }
  };
}
