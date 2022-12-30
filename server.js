import express from 'express'
import axios from 'axios'
import { obtener_token } from './utils.js'

const app = express()
app.use(express.json())

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log('Se esta ejecutando el localhost:' + port)
})

app.post('/obtener_token', async (req, res) => {
    if (!req.body.nombre)
        return res.status(400).send('Error no se encuentra el nombre de usuario')

    if (!req.body.contraseña)
        return res.status(400).send('Error no escribio su contraseña no puede iniciar la sesión')

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

    try {
        const respuesta = await axios.request({
            method: 'POST',
            url: 'https://siga.inacap.cl/Inacap.Siga.ResumenAcademico/api/seccion',
            headers: {
                Cookie: `HTPSESIONIC=${req.headers.authorization};`
            },
            data: {
                matrNcorr: `${req.body.matricula}`,
                seccCcod: `${req.body.seccion}`,
                periCcod: `${req.body.periodo}`,
                ssecNcorr: '0',
                carrCcod: '0'
            }
        })
        res.json(respuesta.data)
    } catch (e) {
        if (e.message.includes('code 401')) {
            res.status(401).json({ error: 'El token venció' })
        } else if (e.response === undefined) {
            res.status(500).json({ error: 'Inacap no responde' })
        } else {
            res.json({})
        }
    }
})