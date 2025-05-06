import { Router } from  'express'
import { authController } from '../controllers/authController'
import { authenticate } from '../middleware/auth'

const router = Router()

router.post('/create-account', authController.createAccount)
router.post('/update-password', authController.updatePassword)
router.post('/login', authController.login)
router.get('/user',
    authenticate,
    authController.user
)
export default router