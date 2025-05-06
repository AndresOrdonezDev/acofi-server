import { Router } from  'express'
import { consecutiveRequestController } from '../controllers/concecutiveController'
import { authenticate } from '../middleware/auth'

const router = Router()

router.post('/',authenticate,consecutiveRequestController.newConsecutiveRequest)


router.get('/',authenticate, consecutiveRequestController.getAllConsecutive)


export default router