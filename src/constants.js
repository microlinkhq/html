'use strict'

const { NODE_ENV = 'development', LAMBDA_TASK_ROOT } = process.env

const isLambda = !!LAMBDA_TASK_ROOT
const isProduction = NODE_ENV === 'production'

module.exports = { ...process.env, NODE_ENV, isProduction, isLambda }
