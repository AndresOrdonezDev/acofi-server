import { Router } from  'express'
import { authController } from '../controllers/authController'

const router = Router()

router.post('/create-account', authController.createAccount)
router.post('/update-password', authController.updatePassword)
router.post('/login', authController.login)

export default router