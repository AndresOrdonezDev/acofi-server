import { Request, Response } from "express";
import ConsecutiveRequested from "../models/ConsecutiveModel";
import User from "../models/UsersModel";

export class consecutiveRequestController {

  static newConsecutiveRequest = async (req: Request, res: Response) => {
    try {
      const currentYear = new Date().getFullYear()
      const { acronym, addressee, topic } = req.body;
      // 1️⃣ Obtener el consecutivo más reciente
      const lastConsecutive = await ConsecutiveRequested.findOne({
        order: [["createdAt", "DESC"]], // el más reciente
      });

      let newConsecutiveCode: string;

      if (!lastConsecutive) {
        // 2️⃣ No hay consecutivos aún → empieza desde 001
        newConsecutiveCode = `SHD-${acronym}-${currentYear}-00001`;
      } else {
        // 3️⃣ Extraer el número del último consecutivo (ejemplo: 'SHD-2025-00001')
        const lastCode = lastConsecutive.consecutive; // 'SHD-2025-00001'
        const numberPart = parseInt(lastCode.split("-")[3]); // 1
        const nextNumber = numberPart + 1;

        // 4️⃣ Formatear el nuevo código (con ceros a la izquierda)
        const nextNumberPadded = String(nextNumber).padStart(5, "0");
        newConsecutiveCode = `SHD-${acronym}-${currentYear}-${nextNumberPadded}`;
      }

      // 5️⃣ Crear la solicitud de consecutivo (sin que el usuario pase el campo consecutive)
      
      await ConsecutiveRequested.create({
        consecutive: newConsecutiveCode,
        addressee,
        topic,
        userId: req.user.id || 1,
      });

      res.send(`Consecutivo solicitado 🚀 Código: ${newConsecutiveCode}`);
    } catch (error) {
      console.log(error);
      res.status(500).send("Algo salió mal");
    }
  };
  static getAllConsecutives = async (req: Request, res: Response) => {
    try {
      const consecutives = await ConsecutiveRequested.findAll({
        include: [{
          model: User,
          attributes: ['id', 'nameUser', 'emailUser'] // solo las columnas que quieres traer
        }]
      });
      res.json(consecutives);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error al obtener los consecutivos");
    }
  };
}
