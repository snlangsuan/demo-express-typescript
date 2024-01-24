import { Router, Request, Response } from 'express'

const route = Router()

route.get('/ping', (_req: Request, res: Response) => {
  res.json({ status: 'pong' })
})

export default route
