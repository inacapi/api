import express from 'express'
import { obtener_token } from './utils.js'

const app = express()
app.use(express.json())

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log('Se esta ejecutando el localhost:' + port)
})

app.post('/obtener_token', async (req, res) => {
    if (!req.body.nombre) {
        res.status(400).send('Error no se encuentra el nombre de usuario')
        return
    }

    if (!req.body.contraseña) {
        res.status(400).send('Error no escribio su contraseña no puede iniciar la sesión')
        return
    }

    const resultado = await obtener_token(req.body.nombre, req.body.contraseña)

    if (resultado.error) {
        res.status(400)
    }
    res.json(resultado)
})