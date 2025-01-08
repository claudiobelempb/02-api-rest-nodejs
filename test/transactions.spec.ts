import { execSync } from 'node:child_process'
import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'

import { app } from '../src/app'

describe('Transaction routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should be able to create a new transaction', async () => {
    const response = await request(app.server).post('/transactions').send({
      title: 'New transaction',
      amount: 5000,
      type: 'credit',
    })

    expect(response.statusCode).toBe(201)
  })

  it('should be able to list all transactions', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 5000,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie')

    const listTranscrionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies as [])

    expect(listTranscrionsResponse.statusCode).toBe(200)
    expect(listTranscrionsResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: 'New transaction',
        amount: 5000,
      }),
    ])
  })

  it('should be able to get specific transaction', async () => {
    const createTransactionResponse = await request(app.server)
      .post(`/transactions`)
      .send({
        title: 'New transaction',
        amount: 5000,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie')

    const listTranscrionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies as [])

    expect(listTranscrionsResponse.statusCode).toBe(200)

    const transactioId = listTranscrionsResponse.body.transactions[0].id

    const transcrionsFindById = await request(app.server)
      .get(`/transactions/${transactioId}`)
      .set('Cookie', cookies as [])

    expect(transcrionsFindById.statusCode).toBe(200)
    expect(transcrionsFindById.body.transaction).toEqual(
      expect.objectContaining({
        title: 'New transaction',
        amount: 5000,
      }),
    )
  })

  it('should be able to get the summary transactions', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'Credit transaction',
        amount: 5000,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie')

    await request(app.server)
      .post('/transactions')
      .set('Cookie', cookies as [])
      .send({
        title: 'Debit transaction',
        amount: 2000,
        type: 'debit',
      })

    const summaryResponse = await request(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookies as [])

    expect(summaryResponse.statusCode).toBe(200)
    expect(summaryResponse.body.summary).toEqual({
      amount: 3000,
    })
  })
})
