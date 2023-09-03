const axios = require("axios").default;
const readlineSync = require("readline-sync");
const { base } = require("./routes/taskRoutes");

const CARACTERES = ["|", "/", "―", "\\"];
let idInterval;
const COMPLETE = "completado";
const PENDING = "pendiente";
const TRUE_VALUE = ["s", "si", "sip", "y", "yes", "yeah", "yep"];
const FALSE_VALUE = ["n", "no", "nop", "not", "nah", "nope"];
const DELAY = 100;
const URL_API = base;

function mostrarCargando(text) {
  let indice = 0;

  idInterval = setInterval(() => {
    process.stdout.write(`${text}... ${CARACTERES[indice]} \r`);
    indice = (indice + 1) % CARACTERES.length;
  }, DELAY);

  setTimeout(() => {
    clearInterval(idInterval);
  }, 2000);
}

function mostrarMenu() {
  console.log(`-----------MENÚ----------
[1] Agregar tarea........
[2] Cambiar estado tarea.
[3] Eliminar tarea.......
[4] Mostrar tareas.......
[5] Salir................\n`);
}

async function main() {
  let opcion;
  let id;
  let descripcion;
  let estado;
  let answer;
  do {
    mostrarMenu();
    opcion = readlineSync.questionInt("Elige una opcion: ");
    console.log("");
    switch (opcion) {
      case 1:
        descripcion = readlineSync.question("Escriba una breve descripcion: ");
        while (!descripcion) {
          console.log("Error, El campo descripción no puede ser vacío");
          descripcion = readlineSync.question(
            "Por favor escriba una breve descripcion: "
          );
        }
        mostrarCargando("Guardando");
        const { data } = await axios.post(`${URL_API}/tareas`, { descripcion });
        console.log(`${data.msg}\n`);
        break;

      case 2:
        id = readlineSync.question("Digite id de la tarea a cambiar: ");
        while (!id) {
          console.log("Error, debe ingresar un id válido");
          id = readlineSync.question("Digite id de la tarea a cambiar: ");
        }
        try {
          mostrarCargando("Consultando");
          const {
            data: { tarea },
          } = await axios(`${URL_API}/tareas/${id}`);
          console.log(`Estado actual de la tarea es "${tarea.estado}"`);
          estado = tarea.estado === PENDING ? COMPLETE : PENDING;
          answer = readlineSync.question(
            `Quieres cambiar el estado de la tarea a "${estado}" [S/N]? `,
            {
              trueValue: TRUE_VALUE,
              falseValue: FALSE_VALUE,
            }
          );
          if (answer) {
            mostrarCargando("Actualizando");
            const { data } = await axios.put(`${URL_API}/tareas/${id}`, {
              estado,
            });
            console.log(data.msg);
          }
        } catch ({ response }) {
          console.log(response?.data?.msg);
        } finally {
          console.log("");
        }
        break;

      case 3:
        id = readlineSync.question("Digite id de la tarea a eliminar: ");
        try {
          mostrarCargando("Consultando");
          await axios(`${URL_API}/tareas/${id}`);
          answer = readlineSync.question(
            "Esta seguro de eliminar la tarea [S/N]? ",
            {
              trueValue: TRUE_VALUE,
              falseValue: FALSE_VALUE,
            }
          );
          if (answer) {
            mostrarCargando("Eliminando");
            const { data } = await axios.delete(`${URL_API}/tareas/${id}`, {
              estado,
            });
            console.log(data.msg);
          }
        } catch ({ response }) {
          console.log(response?.data?.msg);
        } finally {
          console.log("");
        }
        break;

      case 4:
        mostrarCargando("Cargando tareas");
        const { data: tareas } = await axios(`${URL_API}/tareas`);
        tareas?.length
          ? tareas.forEach((task, i) => {
              console.log(
                `${i + 1}. Id: ${task.id}, Descripción: ${
                  task.descripcion
                }, Estado: ${task.estado}`
              );
            })
          : console.log("¡Upps!, No hay tareas guardadas");
        console.log("");
        break;

      case 5:
        console.log("Saliendo del programa...");
        break;

      default:
        console.log(`Opción inválida, elige nuevamente\n`);
        break;
    }
  } while (opcion !== 5);
}

main();
