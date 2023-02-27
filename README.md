# api
Api para facilitar el acceso a la api de inacap.

## Nota importante
En la nueva versión 2.0, las peticiones han sido alteradas, por lo que podrían
funcionar diferente algunas cosas. Los nuevos cambios principalmente incluyen
la opción de obtener los datos en paralelo, para que sean más rápidos. Para usar
esta función en `/seccion` hay que enviar una lista con matrículas o secciones.

## Uso
La forma más sencilla de usar la aplicación es descargar la imagen desde docker,
está guardada en github. Por ejemplo, el siguiente comando inicia el servidor en
el puerto 3000 con redirección de puertos, y apenas se cierre el contenedor se va
a eliminar:

```
docker run --rm --publish=3000:3000 ghcr.io/inacapi/api:2.0
```

## Descripción
La función principal de esta librería es actuar como una intermediara que
recibirá las peticiones y las enviará a Inacap. Esto para poder incluir lógica
que permita obtener respuestas más cómodas. Además permite obtener un token
para trabajar con la api iniciando sesión en inacap con peticiones http.
Consta de dos puntos:

### `/obtener_token`
Con esta ruta podemos obtener un token para trabajar con la api de inacap. Para
hacer eso debemos enviar el nombre de usuario y la contraseña de nuestra cuenta
de inacap en el body de la petición post. Si todo sale bien vamos a obtener el
token de acceso a la api, de lo contrario habrá un error indicando qué ocurrió.
No se pueden manejar todos los errores porque no tenemos acceso directo a
Inacap, pero la mayoría de las cosas están bajo control, salvo los casos poco
comunes.

### `/seccion`
Usar esta ruta es equivalente a enviar una petición post a la api de inacap,
excepto por el hecho que solo necesita algunas cosas. La mayoría de las cosas
que van en cada petición a la api de inacap no afectan el resultado y se pueden
ignorar. En el body de la petición debemos enviar el código de matrícula,
sección y periodo de los datos a consultar. Es importante incluir el token de
acceso en el header authorization, de lo contrario no vamos a recibir
respuestas de parte de la api de inacap.
