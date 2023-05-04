import express from 'express'
import CapsulaTiempo from './CapsulaTiempo/index.js'

const apiRoutes = express.Router()

apiRoutes.use('/capsula', CapsulaTiempo)

apiRoutes.get('/', async (req, res) => {})

export default apiRoutes
