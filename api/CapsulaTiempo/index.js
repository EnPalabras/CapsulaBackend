import express from 'express'
import { appendData } from '../../src/connections/index.js'

const CapsulaTiempo = express.Router()

CapsulaTiempo.post('/', async (req, res) => {
  console.log(req.body)
  const { name, email, message } = req.body
  const date = new Date().toISOString()

  if (!name || !email || !message) {
    return res.status(400).json({
      message: 'Error',
      error: 'Todos los campos deben estar completos',
    })
  }

  if (name.length < 3) {
    return res.status(400).json({
      message: 'Error',
      error: 'El nombre debe tener al menos 3 caracteres',
    })
  }

  if (email.length < 3 || !email.includes('@')) {
    return res.status(400).json({
      message: 'Error',
      error: 'El email es invalido',
    })
  }

  if (message.length < 3) {
    return res.status(400).json({
      message: 'Error',
      error: 'El mensaje debe tener al menos 3 caracteres',
    })
  }

  try {
    const values = [[name, email, message, date]]

    const result = await appendData('Hoja 1', values)

    console.log(result)

    return res.status(200).json({
      message: 'Ok',
      result,
    })
  } catch (error) {
    return res.status(400).json({
      message: 'Error',
      error: 'Ocurrió un error al cargar  los datos',
    })
  }
})

export default CapsulaTiempo
