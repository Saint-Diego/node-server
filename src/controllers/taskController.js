const {
  agregarTarea,
  actualizarTarea,
  eliminarTarea,
  listarTareas,
  buscarTareaPorId,
} = require("../model/task");

const taskController = {
  create: async (req, res) => {
    try {
      const msg = await agregarTarea(req.body);
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ msg }));
    } catch (error) {
      res.statusCode = 400;
      res.end(JSON.stringify({ msg: error }));
    }
  },
  update: async (req, res) => {
    const { id } = req.params;
    try {
      const msg = await actualizarTarea(id, req.body);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ msg }));
    } catch (error) {
      res.statusCode = 404;
      res.end(JSON.stringify({ msg: error }));
    }
  },
  delete: async (req, res) => {
    const { index } = req.params;
    try {
      const msg = await eliminarTarea(index);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ msg }));
    } catch (error) {
      res.statusCode = 404;
      res.end(JSON.stringify({ msg: error }));
    }
  },
  getAll: async (req, res) => {
    try {
      const tareas = await listarTareas();
      res.end(JSON.stringify(tareas));
    } catch (error) {
      res.statusCode = 400;
      res.end(JSON.stringify({ msg: error }));
    }
  },
  getById: async (req, res) => {
    const { id } = req.params;
    try {
      const tarea = await buscarTareaPorId(id);
      res.end(JSON.stringify({ tarea }));
    } catch (error) {
      res.statusCode = 404;
      res.end(JSON.stringify({ msg: error }));
    }
  },
};

module.exports = taskController;
