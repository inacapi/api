import { fetch, CookieJar } from 'node-fetch-cookies'
import { parse } from 'node-html-parser'

const adfs = 'https://adfs.inacap.cl/adfs/ls/?wtrealm=https://siga.inacap.cl/sts/&wa=wsignin1.0&wreply=https://siga.inacap.cl/sts/&wctx=https%3a%2f%2fadfs.inacap.cl%2fadfs%2fls%2f%3fwreply%3dhttps%3a%2f%2fwww.inacap.cl%2ftportalvp%2fintranet-alumno%26wtrealm%3dhttps%3a%2f%2fwww.inacap.cl%2f'
const sts = 'https://siga.inacap.cl/sts/'

export const obtener_token = async (nombre, contraseña) => {
    const cookieJar = new CookieJar()
    const respuesta = await fetch(cookieJar, adfs, {
        method: 'POST',
        body: new URLSearchParams({
            'UserName': nombre,
            'Password': contraseña,
            'AuthMethod': 'FormsAuthentication'
        })
    })

    const data = await respuesta.text()
    if (data && !data.includes('Working...'))
        return { error: 'Usuario o contraseña incorrectos' }

    const document = parse(data)
    const wresult = document.querySelector('input[name="wresult"]')
    if (!wresult)
        return { error: 'No se pudo obtener el token' }

    await fetch(cookieJar, sts, {
        method: 'POST',
        headers: { 'Referer': 'https://adfs.inacap.cl/' },
        body: new URLSearchParams({
            'wresult': wresult.getAttribute('value'),
            'wa': 'wsignin1.0',
            'wctx': 'https://adfs.inacap.cl/adfs/ls/?wreply=https://www.inacap.cl/tportalvp/intranet-alumno&amp;wtrealm=https://www.inacap.cl/'
        })
    })

    for (const cookie of cookieJar.cookiesAll()) {
        if (cookie.name === 'HTPSESIONIC') {
            return { token: cookie.value }
        }
    }

    return { error: 'No se pudo obtener el token' }
}

export const seccion = async (token, matricula, seccion, periodo) => {
    if (!Array.isArray(matricula) && !Array.isArray(seccion))
        return await fetch_seccion(token, matricula, seccion, periodo)

    const datos = []
    if (Array.isArray(matricula)) {
        for (const m of matricula)
            datos.push(fetch_seccion(token, m, seccion, periodo))
    } else if (Array.isArray(seccion)) {
        for (const s of seccion)
            datos.push(fetch_seccion(token, matricula, s, periodo))
    }

    return await Promise.all(datos)
}

const fetch_seccion = async (token, matricula, seccion, periodo) => {
    const url = 'https://siga.inacap.cl/Inacap.Siga.ResumenAcademico/api/seccion'
    const respuesta = await fetch(null, url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': `HTPSESIONIC=${token}`
        },
        body: JSON.stringify({
            matrNcorr: matricula,
            seccCcod: seccion,
            periCcod: periodo,
            ssecNcorr: '0',
            carrCcod: '0',
        })
    })

    if (!respuesta.ok) {
        if (respuesta.status === 401)
            return { error: 'El token venció', status: 401 }
        return { error: 'Error desconocido', status: respuesta.status }
    }

    return await respuesta.json()
}