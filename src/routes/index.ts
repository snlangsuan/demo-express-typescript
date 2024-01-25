import { Router, Request, Response } from 'express'
import authRouter from '#routes/auth.routes'

const router = Router()

router.get('/ping', (_req: Request, res: Response) => {
  res.json({ status: 'pong' })
})

router.use('/api/auth', authRouter)

export default router
