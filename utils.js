import { curly } from 'node-libcurl'
import querystring from 'querystring'
import { parse } from 'node-html-parser'
import fs from 'fs'

const adfs = 'https://adfs.inacap.cl/adfs/ls/?wtrealm=https://siga.inacap.cl/sts/&wa=wsignin1.0&wreply=https://siga.inacap.cl/sts/&wctx=https%3a%2f%2fadfs.inacap.cl%2fadfs%2fls%2f%3fwreply%3dhttps%3a%2f%2fwww.inacap.cl%2ftportalvp%2fintranet-alumno%26wtrealm%3dhttps%3a%2f%2fwww.inacap.cl%2f'
const sts = 'https://siga.inacap.cl/sts/'

export const obtener_token = async (nombre, contraseña) => {
    const { data } = await curly.post(adfs, {
        verbose: true,

        cookieJar: 'cookies.txt',
        followLocation: true,
        postFields: querystring.stringify({
            'UserName': nombre,
            'Password': contraseña,
            'AuthMethod': 'FormsAuthentication'
        })
    })

    if (data && !data.includes('Working...')) {
        return { error: 'Usuario o contraseña incorrectos', token: '' }
    }

    try {
        const document = parse(data)
        const wresult = document.querySelector('input[name="wresult"]').getAttribute('value')
        await curly.post(sts, {
            cookieJar: 'cookies.txt',
            followLocation: true,
            referer: 'https://adfs.inacap.cl/',
            postFields: querystring.stringify({
                'wresult': wresult,
                'wa': 'wsignin1.0',
                'wctx': 'https://adfs.inacap.cl/adfs/ls/?wreply=https://www.inacap.cl/tportalvp/intranet-alumno&amp;wtrealm=https://www.inacap.cl/'
            })
        })
        const cookies = fs.readFileSync('cookies.txt', 'utf-8')
        const pos = cookies.indexOf('HTPSESIONIC') + 12
        if (pos === 11) {
            throw Error
        }
        return { error: '', token: cookies.slice(pos, pos + 64) }
    } catch (e) {
        return { error: 'Fallo al leer respuesta', token: '' }
    }
}