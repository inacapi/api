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
    if (!req.body.nombre)
        return res.status(400).json({ error: 'No se encuentra el nombre' })

    if (!req.body.contraseña)
        return res.status(400).json({ error: 'No se encuentra la contraseña' })

    const resultado = await obtener_token(req.body.nombre, req.body.contraseña)

    if (resultado.error)
        res.status(400)

    res.json(resultado)
})

app.post('/seccion', async (req, res) => {
    if (!req.headers.authorization)
        return res.status(400).json({ error: 'No se encuentra el token' })

    if (!req.body.matricula)
        return res.status(400).json({ error: 'No se encuentra la matricula' })

    if (!req.body.periodo)
        return res.status(400).json({ error: 'No se encuentra el periodo' })

    if (!req.body.seccion)
        return res.status(400).json({ error: 'No se encuentra la seccion' })

    const respuesta = await seccion(req.headers.authorization, req.body.matricula, req.body.seccion, req.body.periodo)

    if (respuesta.error) {
        res.status(respuesta.status)
        delete respuesta.status
    }

    res.json(respuesta)
})