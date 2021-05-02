# Práctica 9 - Sistema de ficheros y creación de procesos en Node.js

## Tareas previas

Como tareas previas para el desarrollo de esta aplicación he estudiado la documentación correspondiente a la [API de callbacks proporcionada por Node.js para interactuar con el sistema de ficheros](https://nodejs.org/dist/latest/docs/api/fs.html#fs_callback_api) y también el [API asíncrona proporcionada por Node.js para crear procesos](https://nodejs.org/dist/latest/docs/api/child_process.html#child_process_asynchronous_process_creation).

## Ejercicio 1

Considerando el código proporcionado para este ejercicio:

```typescript
import { access, constants, watch } from "fs";

if (process.argv.length !== 3) {
  console.log("Please, specify a file");
} else {
  const filename = process.argv[2];

  access(filename, constants.F_OK, (err) => {
    if (err) {
      console.log(`File ${filename} does not exist`);
    } else {
      console.log(`Starting to watch file ${filename}`);

      const watcher = watch(process.argv[2]);

      watcher.on("change", () => {
        console.log(`File ${filename} has been modified somehow`);
      });

      console.log(`File ${filename} is no longer watched`);
    }
  });
}
```

He realizado una serie de diagramas que representan diferentes flujos de ejecución del programa dado.
El primer diagrama representa un flujo de ejecución donde no se especifica un fichero concreto, lo que propicia el consecuente error:

![Primera ejecucion del programa](img/first-execution.png)

El segundo diagrama representa un flujo de ejecución donde si que se especifica un fichero concreto, pero en este caso dicho fichero no existe, por lo tanto, también se mostrará un error:

![Segunda ejecucion del programa](img/second-execution.png)

El último diagrama representa un flujo de ejecución donde el fichero especificado si existe, y por lo tanto se pueden ejecutar las correspondientes funciones asociadas al mismo:

![Tercera ejecucíon del programa](img/third-execution.png)

### Respuesta a las preguntas del ejercicio 1

¿Qué hace la función access?

La función access testea los permisos de un usuario para un fichero o directorio especificado mediante una ruta, además de poder recibir también un argumento opcional que se corresponde con el modo. Por último recibe la callback invocada con un posible error como parámetro, de manera que se puede manejar así el flujo de ejecución en caso de que el valor de dicho parámetro sea distinto a `null`.

En este caso concreto, si existe un error se muestra un mensaje de que no se puedo acceder al fichero. De lo contrario, se mostrará un mensaje indicando que si se está vigilando el archivo, para posteriormente invocar al método watch sobre el fichero y también invocar un watch para cuando el evento sea de tipo `change`, de modo que si se modifica el archivo se ejecutará el código que contiene la callback de este último método.

Sin embargo, si no se realiza ningún cambio sobre el fichero a vigilar, simplemente el código sigue ejecutando el código y por lo tanto lo que muestra es el mensaje de que el fichero ya no está siendo observado, aunque esto es mentira, porque la función `watcher.on('change')` sigue corriendo y pendiente de cambios en el fichero.

¿Para qué sirve el objeto `constants`?
El objeto constants sirve para utilizar todo tipo de flags que indiquen si un fichero o directorio es visible, legible, editable o ejecutable por el proceso invocante. Hay una gran variedad de constantes, pero las usadas en el método access son precisamente las que comento: F_OK - visible flag, R_OK - read flag, W_OK - write flag, X_OK - execute flag.

## Ejercicio 2

Para este ejercicio el primer paso fue plantear el comando de terminal que me proporcionaría información sobre las líneas, palabras o caracteres de un fichero, siendo en este caso el comando `wc`.

Este comando, si se ejecuta en la terminal poniendo detrás un fichero, lo que mostrará por pantalla será tanto el número de lineas como el de palabras y caracteres, además del nombre del fichero. Pero también es de utilidad saber que el comando puede ser ejecutado con diversas opciones que permiten conseguir mostrar cada una de estos datos por separado:

- Opción `-l` - muestra el número de líneas
- Opción `-w` - muestra el número de palabras
- Opción `-m` - muestra el número de caracteres

Por lo tanto, ya sabemos que si gestionamos los comandos introducidos por la terminal, podemos seleccionar las opciones que queramos para ejecutar sobre nuestro fichero.

En este caso, como hay que plantear una solución en la que se use el método `pipe` de `Stream` y otra solución en la que no se use, lo que hize fue tener dos archivos separados, uno para cada solución.

### Ejercicio 2 - Primera solución

En la primera solución, hago `spawn` de un proceso `wc` con sus correspondientes opciones y de un proceso `cat`, con la intención de utilizar este último para mostrar el contenido del fichero, y redirigirlo por su salida estándar a la entrada estándar del comando `wc`.

![Spawn de procesos](img/spawns-a.png)

De esta manera, podemos controlar mediante los streams de entrada y salida de `wc` qué es lo que queremos hacer con los datos que le han sido enviados. En este caso, almacenamos todos los datos en una variable y luego los mostramos en el evento `close` del comando `wc` haciendo uso de la salida estándar del `process` para escribir por pantalla.

![Escritura mediante procesos](img/write-a.png)

Entre medio de estas operaciones he realizado algunas otras operaciones para formatear un poco la salida y que sea más elegante, pero no es relevante en cuestión de lo solicitado en el ejercicio.

### Ejercicio 2 - Segunda solución

En esta segunda solución hago spawn de los mismos procesos, sin embargo, como no puedo usar el métodos `pipe`, hago uso de los `Streams` para manejar los datos. Por lo tanto, la salida del comando `cat` la escribo en la entrada del comando `wc` y cuando he terminado de escribir envío también un evento de finalización de escritura para notificar a `wc` de que ya terminé de escribir. Luego simplemente voy acumulando la información recibida y al salir la escribo haciendo uso de la salida estándar del `process` para escribir por pantalla.

![Escritura mediante procesos](img/write-b.png)

Cabe destacar que ambas soluciones se comportan exactamente igual ante las mismas entradas y que para el procesado de los comandos he utilizado el paquete `yargs`.

En cuanto al manejo de errores, he tratado de controlar todas las situaciones posibles como podrían ser rutas erróneas, falta de comandos a la hora de ejecutar el programa, entre otros.

### Respuesta a las preguntas del ejercicio 2

¿Qué sucede si indica desde la línea de comandos un fichero que no existe o una opción no válida?

Pues en este caso se mostrará un error debido a que el path hacia el archivo no es el correcto.

## Ejercicio 3

Para solucionar este ejercicio he creado un directorio dentro del directorio `src` donde he añadido todo el código fuente asociado a la anterior práctica, que se corresponde con la aplicación de procesamiento de notas de texto. Además de esto, he creado un nuevo fichero donde planteo el procesamiento de los comandos mediante `yargs` como en el resto de los ejercicios y además la lógica necesaria para detectar los cambios producidos en los directorios a vigilar.

Primero que nada, hay que tener en cuenta que para este ejercicio recogeremos por terminal tanto la ruta al directorio a observar como el nombre del usuario propietario del diretorio.
Luego de recoger ambos datos compruebo que existe la ruta indicada hacia el directorio exista, puesto que en caso contrario mostraré un error.
En caso de que si exista dicha ruta lo que haré será invocar a la función `watch` sobre dicho directorio y añadiendo además como opciones una callback que recibe dos parámetros en este caso, uno corresponderá con el tipo de evento que se pueda producir sobre el directorio y también un parámetro para el nombre del fichero sobre el que se produce el evento.

Por lo tanto, sólo queda controlar los mensajes que queramos mostrar según los eventos que se sucedan, así que para ello si el evento es de tipo `rename` uso la función `readFile`
para abrir el fichero sobre el que se produce el evento y si se produce algún error al intentar abrirlo, significa que el archivo fue eliminado. De lo contrario, significará que el archivo fue añadido a dicho directorio.

Por otro lado, si el evento es de tipo `change` significará que se ha modificado un archivo, lo cual nos lleva a que si añadimos una nota de texto a un directorio, realmente estamos añadiendo un fichero y además metiéndole contenido, por lo que se emitirán dos eventos, uno de cada tipo.

![Watcher function](img/watcher-ej3.png)

### Respuesta a las preguntas del ejercicio 3

¿Qué evento emite el objeto `watcher` cuando se crea un nuevo fichero en el directorio observado? ¿Y cuando se elimina un fichero existente? ¿Y cuando se modifica?

Como ya dije previamente cuando se crea un fichero o se elimina del directorio se produce un evento de tipo `rename`, mientras que si se modifica un fichero se produce un evento de tipo `change`.

¿Cómo haría para mostrar, no solo el nombre, sino también el contenido del fichero, en el caso de que haya sido creado o modificado?

Pues en este caso haría uso de la función `readFile` para abrir el fichero y ya luego podría parsear la información para obtenerla y sacarla luego junto con el mensaje que ya tenía previamente, todo ello por la salida estandar mediante el método `write` del objeto `process`.

¿Cómo harías para que no solo se observase el directorio de un único usuario sino todos los directorios correspondientes a los diferentes usuarios de la aplicación de notas?

Pues almacenaría las rutas de todos los usuarios a observar sus directorios y me los recorrería mientras para cada uno de ellos pondría un `watch`, de esta manera podría ir controlando los cambios de todos los ficheros.

## Ejercicio 4

Para solucionar este ejercicio hize nuevamente uso de `yargs` para procesar los comandos, con la diferencia de que en este caso si se contemplan más de un comando, como son los siguientes:

![Exercise 4 commands](img/commands.png)

Aquí podemos observar qué es lo que hace cada comando, pero trataré de profundizar un poco más en como he tratado cada comando.

### `identify command`

Para este comando lo que recibimos es una ruta, a través de la cual comprobamos primero si dicha ruta existe para lanzar un error en caso de que no. Si existe la ruta, compruebo si es un directorio haciendo uso de lo siguiente:

```typescript
lstatSync(argv.path).isDirectory();
```

Por lo tanto, si la ruta lleva a un directorio, mostraremos un mensaje de que es un directorio, de lo contrario es que es un fichero.

### `create command`

Para este comando lo que recibimos es una ruta también, a través de la cual comprobamos primero si dicha ruta existe para lanzar un error en caso de que sí exista puesto que no se puede crear el directorio si ya existe. Si no existe la ruta spawneo un proceso `mkdir` pasándole la ruta para crearla y luego mostrar un mensaje de éxito.

### `list command`

Para este otro comando, también recibimos una ruta, la cuál comprobamos que existe porque si no no podremos listar sus contenidos. En caso de que exista, spawneamos un proceso `ls` pasando como parametro la ruta al directorio y escribimos la salida del comando por pantalla.

### `show command`

Para este otro comando, se recibe nuevamente una ruta y comprobamos si existe dicha ruta, en cuyo caso hacemos `spawn` de un proceso `cat` pasando como opciones el nombre del fichero del cual queremos mostrar su contenido, y simplemente redirigimos a la pantalla la salida del comando.

### `remove command`

Para este comando se recibe como en el resto de comandos una ruta a un archivo o directorio y se comprueba que exista, porque si no no lo podemos borrar.
En caso de que exista la ruta, se comprueba si es un directorio o un fichero, ya que si es un fichero se hara un `spawn` de un proceso `rm`, mientras que si es un directorio se hará un `spawn` de un proceso `rmdir`, ambos recibiendo como parámetro la ruta y mostrando un mensaje de éxito al eliminar el archivo o directorio.

### `move command`

Para este último comando, recibimos una ruta de origen y una ruta de destino, por lo tanto, es relevante que comprobemos que la de origen existe, puesto que es desde donde se van a mover o copiar los contenidos.
Si la ruta de origen es una carpeta, se copiarán todos los contenidos de la misma a la ruta de destino, sin embargo, si es un fichero, se moverá dicho fichero y sus contenidos a la ruta de destino.

Para esto, si la ruta de origen es una carpeta hacemos `spawn` de un proceso `cp -r` y si el origen es un fichero, hacemos `spawn` de un proceso `mv`, ambos obviamente recibiendo como parámetros tanto el origen como el destino.

## Decisiones generales: Diseño | Testing | Documentación

En cuanto a la documentación del código, debido a que las soluciones no han sido programadas orientadas a objetos, no he considerado oportuno comentar cada línea del código puesto que considero que son autoexplicativas.

Por otro lado, en lo relativo al diseño y testing, he utilizado `yargs` para el procesado de comandos y `execSync` como ayuda para la parte de testear los comandos sobre los ejecutables de los ficheros.
Cabe añadir, que en el ejercicio 3 de detección de cambios me fue complicado testear la función watch así que esa parte la dejé sin testear, pero el resto tiene sus tests. Como excepciones a los tests también están el ejercicio 1 puesto que no requería de código, y la aplicación de procesamiento de notas, que no creí conveniento incluir sus tests.

## Conclusiones y problemas

Nuevamente, he tenido muchos problemas al intentar integrar todo el código desarrollado con los workflows de github, puesto que muchas de las funciones utilizadas para el desarrollo de esta práctica no estaban en la mayor parte de las versione de node. En este caso, los tests y el código me funcionan perfectamente con la versión de node `v15.8.0`, sin embargo, los tests en la version 15 de node, no pasan en la Github Action y por falta de tiempo y desconocimiento respecto al testing en node, pues simplemente he tratado de enlazar los workflows correspondientes, pero no han podido pasar las acciones relativas a los tests y al coveralls.

- [Enlace al informe con la explicación de las resoluciones](https://ull-esit-inf-dsi-2021.github.io/ull-esit-inf-dsi-20-21-prct09-async-fs-process-alu0101021768/)
- [Enlace al código fuente en typescript](https://github.com/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct09-async-fs-process-alu0101021768/tree/main/src)
- [Enlace a la documentación](https://github.com/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct09-async-fs-process-alu0101021768/tree/main/docs)
- [Enlace a los tests](https://github.com/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct09-async-fs-process-alu0101021768/tree/main/tests)
