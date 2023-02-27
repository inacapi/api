import express from 'express'
import cors from 'cors'
import { obtener_token, seccion } from './utils.js'

const app = express()
app.use(cors())
app.use(express.json())

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log('Se esta ejecutando el localhost:' + port)
})

app.post('/obtener_token', async (req, res) => {
    console.log('\n/obtener_token:')

    let error = ''
    if (!req.body.nombre) error = 'No se encuentra el nombre'
    if (!req.body.contraseña) error = 'No se encuentra la contraseña'

    if (error) return res.status(400).json({ error })

    console.log('Enviando solicitud a Inacap...')
    const resultado = await obtener_token(req.body.nombre, req.body.contraseña)

    if (resultado.error) res.status(400)

    res.json(resultado)
})

app.post('/seccion', async (req, res) => {
    console.log('\n/seccion:')

    let error = ''
    if (!req.headers.authorization) error = 'No se encuentra el token.'
    if (!req.body.matricula) error = 'No se encuentra la matricula.'
    if (!req.body.periodo) error = 'No se encuentra el periodo.'
    if (!req.body.seccion) error = 'No se encuentra la seccion.'

    if (error) return res.status(400).json({ error })

    console.log('Enviando solicitud a Inacap...')
    const respuesta = await seccion(req.headers.authorization, req.body.matricula, req.body.seccion, req.body.periodo)

    console.dir(respuesta, { depth: null })
    res.json(respuesta)
})