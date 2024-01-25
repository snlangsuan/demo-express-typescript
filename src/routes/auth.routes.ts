import AuthControllers from '#controllers/auth.controllers'
import { authorization } from '#middlewares/auth.middlewares'
import { validateParameter } from '#middlewares/validator.middlewares'
import { refreshTokenValidator } from '#validators/auth.validators'
import { Router, Request as ExRequest, Response as ExResponse, NextFunction } from 'express'

const router = Router()

router.post('/login', async (req: ExRequest, res: ExResponse, next: NextFunction) => {
  try {
    const body = req.body
    const controller = new AuthControllers()
    const response = await controller.Login(req, body)
    res.json(response)
  } catch (error) {
    next(error)
  }
})

router.get('/me', authorization(), async (req: ExRequest, res: ExResponse) => {
  const controller = new AuthControllers()
  const response = await controller.getMe(req)
  res.json(response)
})

router.post(
  '/refresh',
  validateParameter(refreshTokenValidator),
  async (req: ExRequest, res: ExResponse, next: NextFunction) => {
    try {
      const query = req.query!
      const controller = new AuthControllers()
      const response = await controller.refresh(req, query.refresh_token as string)
      res.json(response)
    } catch (error) {
      next(error)
    }
  }
)

export default router
