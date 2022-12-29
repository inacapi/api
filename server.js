import express from 'express'


const app = express()
app.use(express.json())

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log('Se esta ejecutando el localhost:' + port)
})

app.post('/obtener_token', (req, res) => {
    console.log(req.body)
    if (!req.body.nombre) {
        res.status(400).send('Error no se encuentra el nombre de usuario')
        return
    }

    if (!req.body.contraseña){
        res.status(400).send('Error no escribio su contraseña no puede iniciar la sesión')
        return
    }

    res.send("Lo lograsteeee uvu")
    return

})
