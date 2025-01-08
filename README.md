## start

- mkdir 02-api-rest-nodejs
- npm init -y

## Dependencies
- npm install fastify -S
- npm install dotenv -S
- npm install zod -S
- npm install @fastify/cookie

## Dev Dependencies
- npm i typescript -D
- npm i @types/node -D
- npm i tsx -D
- npm i eslint @rocketseat/eslint-config -D
- npm i tsup -D

## comado Typescript
- npx tsc --init

## Database
- npm install knex -S
- npm install sqlite3 -S

## Test
- npm i vitest -D
- npm i supertest -D
- npm i --save-dev @types/supertest

## comado knex
- npm run knex -- -h
- npm run knex -- migrate:make create-transactions
- npm run knex -- migrate:make add-session-id-to-transactions
- npm run knex -- migrate:latest
- npm run knex -- migrate:rollback

## comado git
- git init
- git add .
- git commit -m "initial commit"
- gh repo create
- gh repo view -w

## RF
- [x] O usuário deve poder criar uma nova transação;
- [x] O usuário deve poder obter um resumo da sua conta;
- [x] O usuário deve poder listar dodas transações que já ocorreram;
- [x] O usuário deve poder visializar uma transação única;

## RN
- [x] A trasação pode ser do tipo crédito que somará ao valor total, ou débito subtrair;
- [x] Deve ser possível indentificar o usuário entre as requisições;
- [x] O usuário só pode visializar trasações o qual ele criou;

## RNF
- [ ]
