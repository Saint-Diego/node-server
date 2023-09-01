const readlineSync = require("readline-sync");
const { v4: uuid4 } = require("uuid");

const listaTareas = [];
const TRUE_VALUE = ["s", "si", "sip", "y", "yes", "yeah", "yep"];
const FALSE_VALUE = ["n", "no", "nop", "not", "nah", "nope"];
const COMPLETE = "completado";
const NOT_COMPLETE = "no completado";

const agregarTarea = (tarea) => {
  tarea = { id: uuid4(), ...tarea, estado: NOT_COMPLETE };
  listaTareas.push(tarea);
  console.log(`Tarea agregada correctamente\n`);
};

const actualizarTarea = (index, data) => {
  listaTareas[index] = { ...listaTareas[index], ...data };
  console.log(`Buen trabajo, estado actualizado correctamente\n`);
};

const eliminarTarea = (index) => {
  listaTareas.splice(index, 1);
  console.log(`Tarea eliminada correctamente\n`);
};

const buscarTareaPorId = (id) => {
  return listaTareas.find((tarea, index) => {
    if (tarea.id === id) {
      tarea.index = index;
      return tarea;
    }
    return false;
  });
};

const listarTareas = () => {
  if (listaTareas.length > 0) {
    for (let i = 0; i < listaTareas.length; i++) {
      const { id, titulo, descripcion, estado } = listaTareas[i];
      console.log(
        `${i + 1}. Id: ${tasks[i].id}, Titulo: ${
          tasks[i].titulo
        }, Descripción: ${tasks[i].descripcion}, Estado: ${tasks[i].estado}`
      );
    }
  } else console.log("¡Upps!, No hay tareas guardadas");
  console.log("");
};

function mostrarMenu() {
  console.log(`-----------MENÚ----------
[1] Agregar tarea........
[2] Cambiar estado tarea.
[3] Eliminar tarea.......
[4] Mostrar tareas.......
[5] Salir................\n`);
}

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
        titulo = readlineSync.question("Digite el titulo: ");
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
        agregarTarea({ titulo, descripcion });
        break;

      case 2:
        id = readlineSync.question("Digite id de la tarea a cambiar: ");
        tarea = buscarTareaPorId(id);
        if (tarea) {
          console.log(`Estado actual de la tarea es "${tarea.estado}"`);
          estado = tarea.estado === COMPLETE ? NOT_COMPLETE : COMPLETE;
          answer = readlineSync.question(
            `Quieres cambiar el estado de la tarea a "${estado}" [S o N]? `,
            {
              trueValue: TRUE_VALUE,
              falseValue: FALSE_VALUE,
            }
          );
          if (answer) actualizarTarea(tarea.index, { estado });
          else console.log("");
        } else console.log(`ID ${id} no existe\n`);
        break;

      case 3:
        id = readlineSync.question("Digite id de la tarea a eliminar: ");
        tarea = buscarTareaPorId(id);
        if (tarea) {
          answer = readlineSync.question("Esta seguro de eliminar la tarea [S o N]? ", {
            trueValue: TRUE_VALUE,
            falseValue: FALSE_VALUE,
          });
          if (answer) eliminarTarea(tarea.index);
          else console.log("");
        } else console.log(`ID ${id} no existe\n`);
        break;

      case 4:
        listarTareas();
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
