import express from 'express'
import { appendData } from '../../src/connections/index.js'

const CapsulaTiempo = express.Router()

const PERFIT_LIST = 61

CapsulaTiempo.post('/', async (req, res) => {
  console.log(req.body)
  const { name, email, message, date } = req.body
  const dateCreated = new Date().toLocaleString()

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
    const values = [[name, email, message, date, dateCreated]]
    const result = await appendData('Hoja 1', values)

    const perfitData = await PostContactsToPerfit(email)
    console.log(perfitData)

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

const PostContactsToPerfit = async (email) => {
  const SEARCH_CONTACT = await fetch(
    `https://api.myperfit.com/v2/enpalabras/contacts?q=${email}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.PERFIT_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  )

  const searchData = await SEARCH_CONTACT.json()

  if (!searchData.success) {
    console.log('Error al buscar el contacto')
    return { error: searchData.error }
  }

  if (searchData.data.length > 0) {
    const id = searchData.data[0].id

    const GET_CONTACT = await fetch(
      `https://api.myperfit.com/v2/enpalabras/contacts/${id}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.PERFIT_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    )

    const getData = await GET_CONTACT.json()

    if (!getData.success) {
      console.log('Error al buscar el contacto')
      return { error: getData.error }
    }

    const lists = getData.data.lists.map((list) => list.id)

    const EDIT_CONTACT = await fetch(
      `https://api.myperfit.com/v2/enpalabras/contacts/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify({
          lists: [...lists, PERFIT_LIST],
        }),
        headers: {
          Authorization: `Bearer ${process.env.PERFIT_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    )

    const editData = await EDIT_CONTACT.json()

    if (!editData.success) {
      console.log('Error al editar el contacto')
      return { error: editData.error }
    }

    return { success: true, data: editData }
  }
}
