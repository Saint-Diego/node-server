const { v4: uuid4 } = require("uuid");

const listaTareas = [];
const TIME = 2000;

const agregarTarea = (tarea) => {
  return new Promise((resolve) => {
    listaTareas.push({ id: uuid4(), ...tarea, estado: "pendiente" });
    setTimeout(() => {
      resolve("Tarea agregada correctamente");
    }, TIME);
  });
};

const actualizarTarea = (id, data) => {
  return new Promise((resolve) => {
    listaTareas[buscarIndiceTareaPorId(listaTareas, id)].estado = data.estado;
    setTimeout(() => {
      resolve("Buen trabajo, estado actualizado correctamente");
    }, TIME);
  });
};

const eliminarTarea = (index) => {
  return new Promise((resolve) => {
    listaTareas.splice(index, 1);
    // mostrarCargando("Eliminando");
    setTimeout(() => {
      // clearInterval(idInterval);
      resolve("Tarea eliminada correctamente");
    }, TIME);
  });
};

const buscarTareaPorId = (id) => {
  return new Promise((resolve, reject) => {
    const tareaResp = listaTareas.find((tarea) => tarea.id == id);
    setTimeout(() => {
      if (!tareaResp) reject(`Tarea con ID ${id} no existe`);
      resolve(tareaResp);
    }, TIME);
  });
};

const buscarIndiceTareaPorId = (listaTareas, id) => {
  return listaTareas.findIndex((tarea) => tarea.id == id);
};

const listarTareas = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(listaTareas);
    }, TIME);
  });
};

module.exports = {
  agregarTarea,
  actualizarTarea,
  eliminarTarea,
  listarTareas,
  buscarTareaPorId,
};
