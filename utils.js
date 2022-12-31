import puppeteer from 'puppeteer'

export const obtener_token = async (nombre, contraseña, headless = true) => {
    // Crear el navegador 
    const browser = await puppeteer.launch({
        ignoreHTTPSErrors: true,
        headless: headless,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    const page = await browser.newPage()

    // Iniciar Sesión 
    await page.goto('https://adfs.inacap.cl/adfs/ls/?wtrealm=https://siga.inacap.cl/sts/&wa=wsignin1.0&wreply=https://siga.inacap.cl/sts/&wctx=https%3a%2f%2fadfs.inacap.cl%2fadfs%2fls%2f%3fwreply%3dhttps%3a%2f%2fwww.inacap.cl%2ftportalvp%2fintranet-alumno%26wtrealm%3dhttps%3a%2f%2fwww.inacap.cl%2f')
    await page.type('#userNameInput', nombre)
    await page.type('#passwordInput', `${contraseña}\n`)

    //Obtener Token
    try {
        await page.waitForResponse('https://siga.inacap.cl/sts/', { timeout: 3000 })
        const cookies = await page.cookies()
        for (let cookie of cookies) {
            if (cookie.name === 'HTPSESIONIC') {
                return { error: '', token: cookie.value }
            }
        }
    }
    catch (e) {
        return { error: 'No se pudo obtener el token', token: '' }
    }
    finally {
        await browser.close()
    }
}