const readlineSync = require("readline-sync");
const { v4: uuid4 } = require("uuid");

const listaTareas = [];
const TRUE_VALUE = ["s", "si", "sip", "y", "yes", "yeah", "yep"];
const FALSE_VALUE = ["n", "no", "nop", "not", "nah", "nope"];
const CARACTERES = ["|", "/", "―", "\\"];
let idInterval;
const TIME = 2000;
const DELAY = 100;
const COMPLETE = "completado";
const NOT_COMPLETE = "no completado";

const agregarTarea = (req) => {
  return new Promise((resolve) => {
    req.body = { id: uuid4(), ...req.body, estado: NOT_COMPLETE };
    listaTareas.push(req.body);
    mostrarCargando("Guardando");
    setTimeout(() => {
      clearInterval(idInterval);
      resolve(`Tarea agregada correctamente\n`);
    }, TIME);
  });
};

const actualizarTarea = (req) => {
  const { index } = req.params;
  return new Promise((resolve) => {
    listaTareas[index] = { ...listaTareas[index], ...req.body };
    mostrarCargando("Actualizando");
    setTimeout(() => {
      clearInterval(idInterval);
      resolve(`Buen trabajo, estado actualizado correctamente\n`);
    }, TIME);
  });
};

const eliminarTarea = (req) => {
  const { index } = req.params;
  return new Promise((resolve) => {
    listaTareas.splice(index, 1);
    mostrarCargando("Eliminando");
    setTimeout(() => {
      clearInterval(idInterval);
      resolve(`Tarea eliminada correctamente\n`);
    }, TIME);
  });
};

const buscarTareaPorId = (req) => {
  const { id } = req.params;
  return new Promise((resolve, reject) => {
    const tarea = listaTareas.find((tarea, index) => {
      if (tarea.id === id) {
        tarea.index = index;
        return tarea;
      }
      return false;
    });
    mostrarCargando("Consultando");
    setTimeout(() => {
      clearInterval(idInterval);
      if (!tarea) reject(`Tarea con ID ${id} no existe\n`);
      resolve(tarea);
    }, TIME);
  });
};

const listarTareas = () => {
  return new Promise((resolve, reject) => {
    mostrarCargando("Cargando tareas");
    setTimeout(() => {
      clearInterval(idInterval);
      if (listaTareas.length === 0) reject("¡Upps!, No hay tareas guardadas\n");
      resolve(listaTareas);
    }, TIME);
  });
};

/** Funciones asíncronas */
const postTask = async (tarea) => {
  try {
    console.log(await agregarTarea({ body: tarea }));
  } catch (error) {
    console.log(error);
  }
};

const putTask = async (index, data) => {
  try {
    console.log(await actualizarTarea({ params: { index }, body: data }));
  } catch (error) {
    console.log(error);
  }
};

const deleteTask = async (index) => {
  try {
    console.log(await eliminarTarea({ params: { index } }));
  } catch (error) {
    console.log(error);
  }
};

const getTasks = async () => {
  try {
    const tasks = await listarTareas();
    tasks.map((task, i) =>
      console.log(
        `${i + 1}. Id: ${task.id}, Titulo: ${task.titulo}, Descripción: ${
          task.descripcion
        }, Estado: ${task.estado}`
      )
    );
    console.log("");
  } catch (error) {
    console.log(error);
  }
};

const getTaskById = async (id) => {
  return await buscarTareaPorId({ params: { id } });
};

function mostrarCargando(text) {
  let indice = 0;

  idInterval = setInterval(() => {
    process.stdout.write(`${text}... ${CARACTERES[indice]} \r`);
    indice = (indice + 1) % CARACTERES.length;
  }, DELAY);
}

function mostrarMenu() {
  console.log(`-----------MENÚ----------
[1] Agregar tarea........
[2] Cambira estado tarea.
[3] Eliminar tarea.......
[4] Mostrar tareas.......
[5] Salir................\n`);
}

// Con then() se quita la palabra 'async' de esta función main
// async function main() {
function main() {
  let opcion;
  let id;
  let titulo;
  let descripcion;
  let estado;
  let answer;
  let tarea;
  do {
    mostrarMenu();
    opcion = readlineSync.questionInt("Elige una opcion: ");
    console.log("");
    switch (opcion) {
      case 1:
        titulo = readlineSync.question("Ingrese el titulo: ");
        while (!titulo) {
          console.log("Error, El campo título no puede ser vacío");
          titulo = readlineSync.question("Por favor ingrese un titulo: ");
        }
        descripcion = readlineSync.question("Escriba una breve descripcion: ");
        while (!descripcion) {
          console.log("Error, El campo descripción no puede ser vacío");
          descripcion = readlineSync.question(
            "Por favor escriba una breve descripcion: "
          );
        }
        /** con async-await */
        // await postTask({ titulo, descripcion });
        // break;
        /** con then() */
        agregarTarea({ body: { titulo, descripcion } })
          .then((result) => console.log(result))
          .finally(() => main());
        return;

      case 2:
        id = readlineSync.question("Digite id de la tarea a cambiar: ");
        /** con async-await */
        // try {
        //   tarea = await getTaskById(id);
        //   console.log(`Estado actual de la tarea es "${tarea.estado}"`);
        //   estado = tarea.estado === COMPLETE ? NOT_COMPLETE : COMPLETE;
        //   answer = readlineSync.question(
        //     `Quieres cambiar el estado de la tarea a "${estado}" [S o N]? `,
        //     {
        //       trueValue: TRUE_VALUE,
        //       falseValue: FALSE_VALUE,
        //     }
        //   );
        //   if (answer) await putTask(tarea.index, { estado });
        //   else console.log("");
        // } catch (error) {
        //   console.log(error);
        // }
        // break;
        /** con fetch() */
        buscarTareaPorId({ params: { id } })
          .then((tarea) => {
            console.log(`Estado actual de la tarea es "${tarea.estado}"`);
            estado = tarea.estado === COMPLETE ? NOT_COMPLETE : COMPLETE;
            answer = readlineSync.question(
              `Quieres cambiar el estado de la tarea a "${estado}" [S o N]? `,
              {
                trueValue: TRUE_VALUE,
                falseValue: FALSE_VALUE,
              }
            );
            if (answer) {
              return actualizarTarea({
                params: { index: tarea.index },
                body: { estado },
              }).then((result) => result);
            } else console.log("");
          })
          .then((result) => result && console.log(result))
          .catch((error) => console.log(error))
          .finally(() => main());
        return;

      case 3:
        id = readlineSync.question("Digite id de la tarea a eliminar: ");
        /** con async-await */
        // try {
        //   tarea = await getTaskById(id);
        //   answer = readlineSync.question(
        //     "Esta seguro de eliminar la tarea [S o N]? ",
        //     {
        //       trueValue: TRUE_VALUE,
        //       falseValue: FALSE_VALUE,
        //     }
        //   );
        //   if (answer) await deleteTask(tarea.index);
        //   else console.log("");
        // } catch (error) {
        //   console.log(error);
        // }
        // break;
        /** con fech() */
        buscarTareaPorId({ params: { id } })
          .then((tarea) => {
            answer = readlineSync.question(
              "Esta seguro de eliminar la tarea [S o N]? ",
              {
                trueValue: TRUE_VALUE,
                falseValue: FALSE_VALUE,
              }
            );
            if (answer) {
              return eliminarTarea({
                params: { index: tarea.index },
              }).then((result) => result);
            } else console.log("");
          })
          .then((result) => result && console.log(result))
          .catch((error) => console.log(error))
          .finally(() => main());
        return;

      case 4:
        /** con async-await */
        // await getTasks();
        // break;
        /** con fetch() */
        listarTareas()
          .then((tasks) => {
            tasks.map((task, i) =>
              console.log(
                `${i + 1}. Id: ${task.id}, Titulo: ${
                  task.titulo
                }, Descripción: ${task.descripcion}, Estado: ${task.estado}`
              )
            );
            console.log("");
          })
          .catch((error) => console.log(error))
          .finally(() => main());
        return;

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
