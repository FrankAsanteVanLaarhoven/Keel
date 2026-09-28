import type { OpsPack } from "./types";

export const es: OpsPack = {
  sections: {
    web: {
      title: "La web e internet",
      promise: "Distingue la red de los documentos que transporta, y sigue una petición hasta que el servidor responde.",
      objectives: [
        "Separa la web de internet en una frase.",
        "Nombra IP, TCP y HTTP por el trabajo de cada uno.",
        "Recorre una petición desde el puerto abierto hasta la respuesta, y deja los secretos fuera.",
      ],
      start: [
        "Internet es la red de ordenadores. La web son los documentos, el sonido y el vídeo que esos ordenadores intercambian. Tim Berners-Lee trazó esa línea: en internet hay ordenadores; en la web hay obras. Una página puede fallar con los cables en calma, y los cables pueden fallar mientras la página sigue siendo un archivo en un disco.",
        "Un paquete es un trozo de ese trabajo más una cabecera, para que la máquina lejana sepa para qué sirve el trozo. El mensaje se parte en paquetes, los paquetes viajan como bits, y los routers y los conmutadores los reenvían. Al otro extremo se reordenan. Si la cabecera y los datos no coinciden, el receptor no puede mostrar nada con seguridad.",
      ],
      how: [
        "Tres acuerdos hacen casi todo el transporte. IP mueve paquetes de una red a otra. TCP comprueba que llegaron y los vuelve a juntar en una conexión. HTTP es el acuerdo de una petición web: un método, una ruta, cabeceras, y después un estado, cabeceras y un cuerpo.",
        "Un cliente pide. Un servidor escucha en un puerto. Acepta la conexión TCP, lee el método, la ruta y las cabeceras, y comprueba que el método está permitido y que la ruta es conocida. Un archivo se lee del disco. Una página hecha a partir de un registro pasa a la aplicación. Una llamada de API ejecuta el código que lee o cambia datos. La respuesta lleva un estado como 200, 404 o 500, las cabeceras y el cuerpo. Antes de enviarla, el servidor comprueba que no hay un secreto en ese cuerpo y que hay una redirección cuando hace falta. La respuesta vuelve por la misma conexión, en paquetes. El HTTP antiguo, o un cliente que lo pide, cierra la conexión. Si no, puede quedarse abierta para que la siguiente petición se salte el saludo.",
      ],
      expert: [
        "La máquina del armario es hardware: una blade o una torre, pequeña para caber en un recinto, con procesador, memoria, almacenamiento y puertos de red. Una granja de servidores es un edificio lleno de ellas. El servidor que configuras es software que usa ese hardware. La gente dice servidor para las dos cosas. Cuando falla una página de estado, todavía tienes que saber a cuál te refieres.",
        "Northline Payments mantiene una línea pública de estado, abierto o retenido, para personal que no es ingeniero. La línea es un archivo. La clave del libro se queda en el entorno de la aplicación. Un 500 que imprime la clave no es una caída de internet. Es una respuesta que falló su última comprobación.",
      ],
      figure: "Una petición viaja en paquetes por internet y se convierte en una respuesta HTTP en el servidor.",
      links: [],
      narration:
        "Internet es la red de ordenadores. La web son los documentos que intercambian. Un paquete lleva un trozo del trabajo y una cabecera. IP mueve paquetes, TCP comprueba la conexión y HTTP lleva la petición y la respuesta. El servidor escucha, acepta, lee, valida, responde, y luego cierra o mantiene la conexión. La clave del libro no sale en la página de estado.",
      checkPrompt: "¿Qué frase corresponde a la diferencia entre la web e internet?",
      checkOptions: [
        "La web son los cables entre los edificios",
        "La web son los documentos y los medios; internet es la red que mueve los paquetes",
        "Son dos nombres para la misma cosa",
        "La web es solo la ventana del navegador",
      ],
      labTitle: "Ejecuta una petición de estado",
      labScene: [
        "El servicio de estado de Northline está escuchando. La petición en el cable es GET /status HTTP/1.0, host status.northline.example, Connection: close. El archivo /status contiene la línea Northline payments: open. El entorno guarda LEDGER_KEY. Esa clave no forma parte del archivo.",
        "Pon el trabajo del servidor en el orden en que ocurre. Luego elige el estado, el cuerpo y qué pasa con la conexión. Ejecútalo antes de registrarlo. El panel muestra la respuesta que enviarían tus elecciones.",
      ],
      labWarn: "Esa respuesta lleva LEDGER_KEY, o es un 500. El archivo de estado existe. La clave se queda en el entorno.",
      fields: {
        path: {
          prompt: "Pon el trabajo del servidor en orden.",
          options: [
            "Escuchar en el puerto",
            "Aceptar la conexión TCP",
            "Leer el método, la ruta y las cabeceras",
            "Comprobar el método y la ruta",
            "Construir el estado, las cabeceras y el cuerpo",
            "Enviar la respuesta y cerrar esta conexión",
          ],
        },
        status: { prompt: "¿Qué estado corresponde a esta petición?", options: ["200 OK", "404 Not Found", "500 Internal Server Error"] },
        body: { prompt: "¿Qué cuerpo se envía?", options: ["El archivo de estado", "LEDGER_KEY del entorno", "Un cuerpo vacío"] },
        connection: {
          prompt: "El cliente pidió Connection: close en HTTP/1.0. ¿Qué hace el servidor después de la respuesta?",
          options: ["Cierra la conexión", "La deja abierta para más peticiones"],
        },
      },
      caseOrg: "Northline Payments",
      caseFile: "NL-01",
      caseTitle: "La página de estado y la clave",
      caseSituation: [
        "A las 08:10 la página de estado mostró un 500 y el texto de LEDGER_KEY. El ingeniero de noche dijo que internet estaba caída. Las gráficas de red estaban quietas. El archivo /status seguía siendo la línea Northline payments: open.",
        "El personal del mostrador de pagos actualiza esa página antes de abrir las cajas. No son ingenieros. Necesitan una línea verdadera, y no deben ver nunca una clave.",
      ],
      caseTask: "Decide qué falló de verdad, qué debe contener la siguiente respuesta y qué pasa con la conexión.",
      caseSteps: [
        "Separa la red quieta de la respuesta que el servidor eligió enviar.",
        "Vuelve a leer la petición: GET /status, HTTP/1.0, Connection: close, y el archivo existe.",
        "Responde las tres decisiones.",
        "En la nota, di qué debe ver el mostrador y qué no debe aparecer nunca ahí.",
      ],
      decisions: [
        {
          prompt: "¿Qué falló a las 08:10?",
          options: ["Internet, es decir los cables", "El servidor respondió mal para un archivo que existe", "El color del navegador"],
        },
        {
          prompt: "¿Qué contiene la siguiente respuesta?",
          options: ["El mismo cuerpo, para que los ingenieros vean la clave", "La línea de estado, y la clave se queda en el servidor", "La clave en una cabecera, que es más segura"],
        },
        {
          prompt: "El cliente envió HTTP/1.0 y Connection: close. Después de una respuesta válida, ¿qué ocurre?",
          options: ["El socket se queda abierto para siempre", "El servidor cierra la conexión", "Se abre una segunda conexión para la misma respuesta"],
        },
      ],
      noteLabel: "Tu nota para el mostrador de pagos",
      noteHint: "Escribe qué debe mostrar /status y qué no debe aparecer nunca en esa página.",
    },
    git: {
      title: "Git y el historial compartido",
      promise: "Guarda un historial que un desconocido pueda seguir, y mantén los secretos fuera.",
      objectives: [
        "Di qué hace Git y qué añade un host como GitHub.",
        "Confirma un cambio pequeño en una rama, con un mensaje que diga qué cambió.",
        "Deja la rama main en verde y las credenciales fuera del árbol.",
      ],
      start: [
        "Git es el historial en la máquina: instantáneas, ramas y la diferencia entre lo que tienes y lo último que registraste. Un host como GitHub guarda ese historial donde otras personas pueden recibir acceso. Git funciona sin el host. El host no es el historial.",
        "Un repositorio se lee cuando su nombre significa algo y el README dice qué es el proyecto, de qué depende, cómo se ejecuta y cómo se prueba. Confirma en trozos pequeños que hagan una sola cosa: una función, un arreglo o una refactorización. Un solo commit al final llamado versión final es un montón, no un historial.",
      ],
      how: [
        "Escribe el mensaje en imperativo y nombra el cambio. Devolver 404 cuando la ruta de estado es desconocida es un mensaje. Update, Cambios y Versión final no le dicen a la siguiente persona qué se movió. Revisa el diff antes de confirmar. Quita impresiones, restos y archivos que no pertenecen.",
        "Haz el trabajo en una rama con el nombre del trabajo, como feature/status-404. Únela a main solo cuando construye, las pruebas pasan y las comprobaciones están en verde. Main es la línea que otra persona puede ejecutar. Contraseñas, claves, tokens, cadenas de conexión y datos personales se quedan en el entorno, o en un archivo que gitignore excluye. Si una clave viva entra en un commit, quítala y rótala. Un repositorio privado no es una caja fuerte para una clave viva.",
      ],
      expert: [
        "La disposición es parte del historial. El código, las pruebas, los documentos y la configuración viven en sitios obvios. No confirmes salida de compilación, carpetas de dependencias ni restos del editor, salvo que el proyecto tenga una razón dicha. Cuando cambia la forma de ejecutar el proyecto, cambia el README en el mismo trabajo.",
        "El servicio de estado de Northline es un repositorio pequeño. El árbol que tienes delante tiene un arreglo real, una línea del README, un .env con una clave viva, un archivo compilado y una nota. Solo dos de esos pertenecen al siguiente commit, y ese commit no cae en main por sí solo.",
      ],
      figure: "El arreglo y el README van a una rama. El secreto, la compilación y la nota se quedan fuera. Main se mueve cuando las comprobaciones están en verde.",
      links: [],
      narration:
        "Git es el historial en la máquina. Un host como GitHub es donde ese historial se puede compartir. Confirma trozos pequeños, con un mensaje que nombre el cambio, en una rama. Main se queda en verde. Los secretos se quedan fuera del árbol, y una clave filtrada se rota.",
      checkPrompt: "¿Qué es GitHub, junto a Git?",
      checkOptions: [
        "El control de versiones que corre en tu máquina",
        "Un host de repositorios Git, con acceso que puedes conceder",
        "El servidor que despliega la página de estado",
        "El monitor que te llama de noche",
      ],
      labTitle: "Elige el commit",
      labScene: [
        "El árbol de trabajo tiene cinco cambios. README.md explica cómo correr las comprobaciones. src/status.ts devuelve 404 cuando la ruta es desconocida. .env contiene API_KEY=live-secret. dist/app.js es salida de compilación. notes.tmp es una nota.",
        "Elige los archivos que pertenecen a un commit, el mensaje y la rama. Ejecútalo y lee el commit que estás a punto de hacer. Main debe seguir siendo la última línea verde.",
      ],
      labWarn: "Ese commit incluye un secreto, salida de compilación o una nota, o mueve main. Deja la clave fuera y deja main donde está.",
      fields: {
        files: {
          prompt: "¿Qué archivos entran en este commit?",
          options: [
            "README.md, cómo correr las comprobaciones",
            "src/status.ts, las rutas desconocidas devuelven 404",
            ".env, API_KEY=live-secret",
            "dist/app.js, salida de compilación",
            "notes.tmp, una nota",
          ],
        },
        message: {
          prompt: "¿Qué mensaje corresponde al commit?",
          options: ["Update", "Devolver 404 cuando la ruta de estado es desconocida", "Versión final"],
        },
        branch: {
          prompt: "¿Dónde cae este commit?",
          options: ["En main, ahora", "En feature/status-404, y main se queda como está"],
        },
      },
      caseOrg: "Northline Payments",
      caseFile: "NL-02",
      caseTitle: "La clave en main",
      caseSituation: [
        "Un contratista empujó un commit a main. El mensaje es Versión final. El diff añade el arreglo del 404 y también añade .env con una clave viva. No hay rama, y el README sigue diciendo que el proyecto no se puede ejecutar.",
        "El servicio de estado es lo que el mostrador de pagos confía por la mañana. La siguiente persona tiene que poder ejecutar main, y la clave viva tiene que dejar de funcionar.",
      ],
      caseTask: "Decide qué pasa con la clave, cómo se describe el arreglo y dónde cae el siguiente trabajo.",
      caseSteps: [
        "Trata la clave como ya expuesta, aunque el repositorio sea privado.",
        "Separa el arreglo útil de los archivos que nunca debieron confirmarse.",
        "Responde las tres decisiones.",
        "En la nota, di qué rotas y qué puede contener main mañana.",
      ],
      decisions: [
        {
          prompt: "La clave viva está en el commit. ¿Qué haces?",
          options: ["La dejas, porque el repositorio es privado", "La quitas del árbol y rotas la clave", "Envías la clave al equipo para que tengan una copia"],
        },
        {
          prompt: "¿Qué mensaje corresponde al arreglo?",
          options: ["Update", "Devolver 404 cuando la ruta de estado es desconocida", "Versión final"],
        },
        {
          prompt: "¿Dónde cae primero el siguiente cambio?",
          options: ["Directamente en main", "En una rama, y luego en main cuando las comprobaciones estén en verde", "En un zip en el chat"],
        },
      ],
      noteLabel: "Tu nota para la siguiente persona del repositorio",
      noteHint: "Escribe qué haces con la clave filtrada y qué debe contener main mañana.",
    },
    devops: {
      title: "Desarrollo y operaciones",
      promise: "Construye, prueba y publica como una práctica continua, y mídelo con cuatro números.",
      objectives: [
        "Define DevOps como desarrollo y operaciones en un solo camino hacia la publicación.",
        "Clasifica una tarea en desarrollo, operaciones o automatización.",
        "Lee la frecuencia de despliegue, el tiempo de espera, la tasa de fallos y el tiempo de restauración en un registro.",
      ],
      start: [
        "DevOps une desarrollo y operaciones para que el software se construya, se pruebe y se publique como una sola práctica, y el servicio siga en pie después. Es continuo. El objetivo es software apto para correr, no un pase por encima de un muro.",
        "Desarrollo escribe el cambio, añade la función, corrige el defecto, corre las pruebas unitarias, diseña la aplicación, guarda el historial y trabaja en un entorno de desarrollo. Operaciones corre el servicio, cuida la infraestructura, lo mantiene disponible, vigila producción, corre los servidores y la red, despliega y posee producción. A menudo te especializarás. Aun así necesitas ver dónde se encuentran los dos lados.",
      ],
      how: [
        "La automatización quita trabajo manual que no necesita a una persona: la corrida de pruebas, el despliegue, la reversión. Una persona sigue decidiendo qué significa bueno. La máquina repite los pasos que no deben variar según quién esté despierto.",
        "Puedes practicar esto en un sistema que es solo tuyo. El historial, las comprobaciones y el camino de vuelta todavía tienen que tener sentido para la siguiente persona, incluida una versión futura de ti. Cuatro números, del programa de investigación DORA, mantienen la práctica honesta. La frecuencia de despliegue es cuántas veces despliegas. El tiempo de espera es el tiempo entre aceptar un cambio y desplegarlo. La tasa de fallos es cuántas veces falla un despliegue. El tiempo de restauración es cuánto se tarda en recuperar el servicio.",
      ],
      expert: [
        "Una publicación mensual, una semana de espera, fallos que aguardan hasta el lunes y ninguna restauración escrita es una práctica que no puede verse. Los cuatro números no sustituyen el juicio. Evitan que llames éxito a una publicación rara y frágil porque la demo se veía tranquila.",
        "Northline desplegó cuatro veces en el registro del laboratorio. Uno de esos despliegues falló. El servicio volvió la misma tarde. Clasifica el trabajo y luego lee los cuatro números del registro. Un despliegue fallido sigue contando como despliegue.",
      ],
      figure: "Desarrollo cambia el software. Operaciones lo ejecuta. La automatización repite los pasos que no deben depender de quién esté despierto. Cuatro números dicen si la publicación está sana.",
      links: [{ href: "https://dora.dev/", label: "DORA" }],
      narration:
        "DevOps une desarrollo y operaciones para que un cambio se construya, se pruebe, se publique y siga corriendo. La automatización toma los pasos manuales que no deberían necesitar a una persona. Cuatro números de DORA lo mantienen honesto: cuántas veces despliegas, cuánto pasa de la aceptación al despliegue, cuántas veces falla un despliegue y cuánto tarda una restauración.",
      checkPrompt: "¿Cuántas métricas de DORA miden la entrega y la recuperación?",
      checkOptions: [
        "Una: cuántas veces despliegas",
        "Cuatro: frecuencia, tiempo de espera, tasa de fallos y tiempo de restauración",
        "Doce: una por cada mes",
        "Ninguna: DevOps es solo un ánimo",
      ],
      labTitle: "Lee la semana",
      labScene: [
        "Registro de Northline, en hora local. Lunes 09:00 aceptado, 11:00 desplegado, con éxito. Martes 10:00 aceptado, 18:00 desplegado, fallido, 20:30 servicio restaurado. Jueves 09:00 aceptado, 09:30 desplegado, con éxito. Viernes 12:00 aceptado, 13:00 desplegado, con éxito.",
        "Clasifica tres trabajos. Luego lee los cuatro números de ese registro. El tiempo de espera del martes va de las 10:00 a las 18:00. La restauración va del despliegue fallido hasta las 20:30. Cuenta el despliegue fallido en la frecuencia.",
      ],
      labWarn: "El registro es la fuente. Comprueba cada número contra las horas antes de registrarlo.",
      fields: {
        code: { prompt: "Escribir la prueba unitaria de la línea de estado es qué tipo de trabajo?", options: ["Desarrollo", "Operaciones", "Automatización"] },
        watch: { prompt: "Vigilar la tasa de error de producción es qué tipo de trabajo?", options: ["Desarrollo", "Operaciones", "Automatización"] },
        rollback: { prompt: "Un script que revierte un despliegue fallido, sin que alguien lo escriba, es qué tipo de trabajo?", options: ["Desarrollo", "Operaciones", "Automatización"] },
        frequency: { prompt: "¿Cuántos despliegues hay en este registro?", options: ["Uno esta semana", "Cuatro esta semana", "Veinte esta semana"] },
        lead: { prompt: "¿Cuánto dura el tiempo de espera del cambio del martes, de la aceptación al despliegue?", options: ["30 minutos", "8 horas", "Una semana"] },
        fail: { prompt: "¿Cuántos de esos despliegues fallaron?", options: ["Ninguno", "Uno de los cuatro", "Todos"] },
        restore: { prompt: "¿Cuánto tardó restaurar el servicio después del despliegue fallido del martes?", options: ["10 minutos", "2 horas y 30 minutos", "El fin de semana"] },
      },
      caseOrg: "Northline Payments",
      caseFile: "NL-03",
      caseTitle: "La restauración del fin de semana",
      caseSituation: [
        "El trimestre pasado Northline desplegaba una vez al mes. Un cambio aceptado el primer lunes a menudo salía tres semanas después. Cerca de un despliegue de cada tres fallaba, y el servicio a veces seguía mal hasta el lunes siguiente. No había un script para revertir.",
        "Alguien del mostrador dijo que DevOps no aplica, porque no hay un equipo separado de operaciones. El estado de los pagos sigue siendo su servicio. El registro del laboratorio es la semana más nueva, en la que un fallo se restauró la misma tarde.",
      ],
      caseTask: "Decide qué puede hacer todavía una persona, qué número es la restauración y qué debe correr sin una persona en el teclado.",
      caseSteps: [
        "Usa el registro del laboratorio como evidencia, no el recuerdo del trimestre.",
        "Nombra el intervalo de restauración aparte del tiempo de espera.",
        "Responde las tres decisiones.",
        "En la nota, escribe los cuatro números de la semana del laboratorio y nombra el paso que debe ser automático.",
      ],
      decisions: [
        {
          prompt: "No hay un equipo separado de operaciones. ¿Qué haces la noche de un fallo?",
          options: ["Esperar a un equipo que no existe", "Seguirlo, restaurarlo y escribir los cuatro números", "Tratar DevOps como algo que solo puede hacer un departamento"],
        },
        {
          prompt: "En el registro del laboratorio, ¿qué intervalo es el tiempo de restauración?",
          options: ["El jueves, de 09:00 a 09:30", "El martes, del despliegue fallido a las 18:00 hasta las 20:30", "El recuento de despliegues de la semana"],
        },
        {
          prompt: "¿Qué debe ser automático?",
          options: ["Ocultar un despliegue fallido para que el tablero siga en calma", "La reversión, para que nadie tenga que escribirla de noche", "Cada cambio de producción, sin registro"],
        },
      ],
      noteLabel: "Tu nota sobre la entrega de la semana",
      noteHint: "Escribe los cuatro números de la semana del laboratorio y nombra el paso que debe correr sin una persona.",
    },
    finops: {
      title: "Coste, confianza y valor",
      promise: "Sabes para qué es el gasto, y rechazas una factura que no compra ningún resultado.",
      objectives: [
        "Trata una cuenta de pago compartida como una confianza, no como capacidad sobrante.",
        "Atribuye un coste de nube al servicio que lo causa, y limita lo que está ocioso.",
        "Juzga el gasto de un modelo por el resultado que una persona usa de verdad.",
      ],
      start: [
        "Cuando un servicio es real, algunas herramientas se pagan: runners, bases de datos, asientos, modelos. Una cuenta de pago compartida es una confianza. El trabajo personal, y las copias quietas de datos de producción, no pertenecen a ella. La factura es parte del sistema.",
        "FinOps es la práctica de ver ese coste, atribuirlo al servicio que lo causa y decidir qué conservar. Un especialista puede profundizar después. La decisión que tienes delante ya es concreta: conservar, limitar o parar.",
      ],
      how: [
        "Los runners de CI ociosos por la noche no son velocidad gratis. Límites a las construcciones que de verdad corres, y deja esos minutos en el servicio que los necesita. Una base de datos de producción que guarda el libro es el servicio. No la paras para que la factura sea más pequeña, y no la escondes en una tarjeta personal.",
        "Los tokens de un modelo son un coste con una pregunta: ¿este uso produce un resultado que alguien usa? La economía de tokens mira la producción, el consumo y el coste de ese uso a lo largo de su vida. Un resumen nocturno que nadie ha abierto en un mes no es un resultado. Una ventana de contexto más grande no arregla una página no leída. Páralo hasta que una persona use el resultado en una decisión.",
      ],
      expert: [
        "Limitar no es parar. Limita la capacidad ociosa de algo que todavía necesitas. Para algo que no tiene usuario, o que rompe la confianza de la cuenta compartida. Conserva lo que el servicio no puede correr sin ello, y di a qué servicio pertenece.",
        "El mes de Northline son cuatro líneas en una cuenta compartida: CI, la base del libro, un resumen de modelo sin lectores y una transcodificación personal. El laboratorio es esa factura. El caso es la nota que enviarías a quien la paga.",
      ],
      figure: "Conserva lo que el servicio no puede correr sin ello. Limita lo ocioso. Para lo que nadie usa, y saca el trabajo personal de la cuenta compartida.",
      links: [
        { href: "https://www.finops.org/", label: "FinOps Foundation" },
        { href: "https://www.tokeneconomics.com/state-of-tokenomics/", label: "State of Tokenomics" },
      ],
      narration:
        "Una cuenta de pago compartida es una confianza. FinOps atribuye cada coste al servicio que lo causa. Limita los runners ociosos. Conserva la base del libro. Para el gasto de modelo que nadie usa. Saca el trabajo personal de la cuenta compartida.",
      checkPrompt: "¿Cuándo se justifica el gasto en un modelo?",
      checkOptions: [
        "Cuando la factura es lo bastante grande para parecer seria",
        "Cuando los tokens cambian un resultado que una persona usa de verdad",
        "Cuando el proveedor dice que el modelo es avanzado",
        "Cuando la clave se comparte para que todos puedan probar",
      ],
      labTitle: "Marca la factura",
      labScene: [
        "Una cuenta compartida de Northline, este mes. Runners de CI, 400 dólares, casi ociosos por la noche, y las construcciones reales necesitan una fracción. La base del libro, 220 dólares, guarda el registro de pagos. Resúmenes del modelo, 900 dólares, y la página de resúmenes no tiene lectores desde hace un mes. Transcodificación personal de vídeo, 300 dólares, de una persona en la cuenta compartida.",
        "Marca cada línea: conservar, limitar o parar. Ejecútalo y lee la factura que vas a defender. Limitar no quita una carga personal. Conservar los resúmenes no leídos deja los 900 dólares en su sitio.",
      ],
      labWarn: "Una carga personal sigue en la cuenta compartida, o los resúmenes no leídos se siguen pagando. La confianza y el resultado son la prueba.",
      fields: {
        ci: { prompt: "Runners de CI, 400 dólares, casi ociosos por la noche.", options: ["Conservar", "Limitar", "Parar"] },
        db: { prompt: "Base del libro, 220 dólares, el registro de pagos.", options: ["Conservar", "Limitar", "Parar"] },
        tokens: { prompt: "Resúmenes del modelo, 900 dólares, sin lectores desde hace un mes.", options: ["Conservar", "Limitar", "Parar"] },
        shared: { prompt: "Transcodificación personal de vídeo, 300 dólares, en la cuenta compartida.", options: ["Conservar", "Limitar", "Parar"] },
      },
      caseOrg: "Northline Payments",
      caseFile: "NL-04",
      caseTitle: "La factura y la confianza",
      caseSituation: [
        "La cuenta compartida se duplicó. La mitad del nuevo total es el resumen del modelo que nadie lee. Otra línea es la transcodificación de vídeo de una persona. Los runners de CI siguen dimensionados para un día ocupado que no tienen. La base del libro no cambió, y es el registro del que depende el mostrador.",
        "Quien paga la cuenta pidió una nota: qué se queda, qué se limita y qué se va. No pide un modelo nuevo.",
      ],
      caseTask: "Atribuye el coste, juzga el modelo por su resultado y saca el trabajo personal de la cuenta compartida.",
      caseSteps: [
        "Nombra el servicio que causa cada línea antes de cambiarla.",
        "Separa la capacidad ociosa de una línea que no tiene usuario.",
        "Responde las tres decisiones.",
        "En la nota, di qué limitas, qué paras y qué conservas porque el mostrador lo necesita.",
      ],
      decisions: [
        {
          prompt: "¿Qué haces con los runners de CI ociosos?",
          options: ["Los dejas, porque la velocidad debería sentirse gratis", "Los limitas y atribuyes los minutos al servicio de estado", "Los pasas a una tarjeta personal y escondes la línea"],
        },
        {
          prompt: "¿Qué haces con los resúmenes del modelo que nadie lee?",
          options: ["Compras una ventana de contexto más grande", "Los paras hasta que una persona use el resultado en una decisión", "Compartes la clave para que más gente quizá los lea"],
        },
        {
          prompt: "La transcodificación personal está en la cuenta compartida. ¿Qué haces?",
          options: ["La dejas, porque la persona está aprendiendo", "La quitas, y tratas la cuenta compartida como una confianza", "Renombras el proyecto para que la línea parezca de producción"],
        },
      ],
      noteLabel: "Tu nota para quien paga la cuenta",
      noteHint: "Escribe qué limitas, qué paras y qué conservas porque el mostrador lo necesita.",
    },
  },
  brief: {
    title: "Publicación de Northline",
    dek: "Publica la línea de estado una vez, con un historial, cuatro números y una factura que puedas defender.",
    situation: [
      "Mañana el mostrador de pagos actualizará /status antes de abrir las cajas. El archivo está listo. Se encontró una clave viva en un commit antiguo de main. La semana pasada un despliegue falló y la restauración se midió. La cuenta compartida todavía paga runners ociosos y un resumen sin lectores.",
      "Esta es una publicación, no cuatro proyectos. La respuesta, el historial, la medición y el gasto tienen que coincidir.",
    ],
    task: "Elige la respuesta, el historial, la medición y el gasto de esta publicación.",
    steps: [
      "Decide qué envía /status, incluida la conexión que el cliente pidió cerrar.",
      "Decide dónde vive el arreglo y qué pasa con una clave que ya se filtró.",
      "Decide qué números vas a anotar para esta publicación.",
      "En la nota, di qué ve el mostrador, dónde vive ahora la clave y qué gasto se para.",
    ],
    decisions: [
      {
        prompt: "¿Qué envía /status?",
        options: ["Un 500 que incluye la clave", "200 con el archivo de estado, sin clave, y la conexión cerrada", "Nada, y el socket se queda abierto"],
      },
      {
        prompt: "¿Dónde cae el arreglo?",
        options: ["Directo a main, con la clave todavía en el historial", "En una rama, luego a main con las comprobaciones en verde, y la clave se rota", "En un zip en el chat"],
      },
      {
        prompt: "¿Qué registras para esta publicación?",
        options: ["Nada, si la demo se veía tranquila", "Frecuencia, tiempo de espera, tasa de fallos y tiempo de restauración", "Solo que despliegas una vez al mes"],
      },
      {
        prompt: "¿Qué pasa con la factura compartida?",
        options: ["El gasto se queda como está, incluidos los resúmenes no leídos", "Limita los runners ociosos y para los resúmenes no leídos", "Comparte la cuenta para que la factura sea problema de todos"],
      },
    ],
    noteLabel: "Tu nota de publicación",
    noteHint: "Escribe qué muestra /status, dónde vive ahora la clave y qué gasto se para.",
    narration:
      "La publicación de Northline envía el archivo de estado sin la clave, llega a main solo después de comprobaciones verdes, registra los cuatro números de DORA, limita los runners ociosos y para el gasto del modelo que nadie lee.",
    figure: "Una publicación: una respuesta de estado segura, un main verde, cuatro números, y una factura con el trabajo ocioso limitado y el trabajo no leído parado.",
  },
};
