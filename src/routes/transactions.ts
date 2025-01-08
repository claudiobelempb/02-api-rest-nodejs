import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'

import { knex } from '../database'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

export async function transactionsRoutes(app: FastifyInstance) {
  // app.addHook('preHandler', async (req: FastifyRequest, res: FastifyReply) => {

  // })
  app.post('/', async (req: FastifyRequest, res: FastifyReply) => {
    const createTransactionRequest = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    const { title, amount, type } = createTransactionRequest.parse(req.body)

    let sessionId = req.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()

      res.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 day,
      })
    }

    await knex('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
      session_id: sessionId,
    })

    return res.status(201).send()
  })

  app.get(
    '/',
    { preHandler: [checkSessionIdExists] },
    async (req: FastifyRequest) => {
      const { sessionId } = req.cookies

      const transactions = await knex('transactions')
        .where({ session_id: sessionId })
        .select()
      return { transactions }
    },
  )

  app.get(
    '/:id',
    { preHandler: [checkSessionIdExists] },
    async (req: FastifyRequest) => {
      const { sessionId } = req.cookies

      const getParams = z.object({
        id: z.string().uuid(),
      })
      const { id } = getParams.parse(req.params)

      const transaction = await knex('transactions')
        .where({ session_id: sessionId, id })
        .first()

      return { transaction }
    },
  )

  app.get(
    '/summary',
    { preHandler: [checkSessionIdExists] },
    async (req: FastifyRequest) => {
      const { sessionId } = req.cookies

      const summary = await knex('transactions')
        .where('session_id', sessionId)
        .sum('amount', { as: 'amount' })
        .first()

      return { summary }
    },
  )
}
