'use strict'

const { pbkdf2Sync } = require("crypto")
const { sign, verify } = require('jsonwebtoken')
const { buildResponse } = require('./utils')
const { getUserByCredentials, saveResultsToDatabase, getResultById } = require("./database")

async function authorize(event) {
  const { authorization } = event.headers

  if (!authorization) {
    return buildResponse(401, { error: 'Missing authorization header' })
  }

  const [type, token] = authorization.split(' ')
  if (type !== 'Bearer' || !token) {
    return buildResponse(401, { error: 'Unsupported authorization type' })
  }

  const decodedToken = verify(token, process.env.JWT_SECRET, {
    audience: 'serverless-app'
  })

  if (!decodedToken) {
    return buildResponse(401, { error: 'Invalid Token' })
  }

  return decodedToken
}

function extractBody(event) {
    if(!event?.body) {
        return {
            statusCode: 422,
            body: JSON.stringify({ error: 'Missing body'})
        }
    }

    return JSON.parse(event.body)
}

module.exports.sendResponse = async (event) => {
  const authResult = await authorize(event)

  if (authResult.statusCode === 401) return authResult

  const { name, answers } = extractBody(event)
  const correctQuestions = [3, 1, 0, 2]

  const totalCorrectAnswers = answers.reduce((acc, answer, index) => {
    if (answer === correctQuestions[index]) {
      acc++
    }
    return acc
  }, 0)

  const result = {
    name,
    answers,
    totalCorrectAnswers,
    totalAnswers: answers.length
  }

  const insertedId = await saveResultsToDatabase(result)

  return buildResponse(201, {
    resultId: insertedId,
    __hypermedia: {
      href: `/results.html`,
      query: { id: insertedId }
    }
  })
}

module.exports.getResult = async (event) => {
  const authResult = await authorize(event)

  if (authResult.statusCode === 401) return authResult

  const result = await getResultById(event.pathParameters.id)

  if (!result) {
    return buildResponse(404, { error: 'Result not found' })
  }

  return buildResponse(200, result)
}

module.exports.login = async (event) => {
  const {username, password} = extractBody(event)
  const hashedPass = pbkdf2Sync(password, process.env.SALT, 100000,64, 'sha512').toString('hex')

  const user = getUserByCredentials(username, hashedPass)

  if (!user) {
    return buildResponse(401, { error: 'Invalid Credentials' })
  }

  const token = sign({ username, id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '24h',
    audience: 'serverless-app'
  })

  return buildResponse(200, token)
}