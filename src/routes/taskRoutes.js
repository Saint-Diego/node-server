const http = require("http");
const taskController = require("../controllers/taskController");

const host = "localhost";
const port = 3000;
const base = `http://${host}:${port}`;

const server = http.createServer((req, res) => {
  //setHeader
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Request-Method", "*");

  //Definicion de url
  const url = new URL(req.url, base);

  //obtener ruta
  const ruta = url.pathname;

  // Path Params
  // example url: http://localhost:8000/tareas/2
  const pathParams = url.pathname
    .split("/")
    .filter((segment) => segment !== "");

  // Query Params
  // example url: http://localhost:8000/tareas?estado="completado"
  const queryParam = url.searchParams.get("estado");

  //Tipos de solicitud o metodos
  switch (req.method) {
    case "GET":
      if (ruta == "/tareas" && !queryParam) taskController.getAll(req, res);
      else if (pathParams.length) {
        if (ruta == `/tareas/${pathParams[1]}`) {
          req.params = { id: pathParams[1] };
          taskController.getById(req, res);
        }
      }
      break;

    case "POST":
      //body params
      if (ruta == "/tareas") {
        let body = "";
        req.on("data", (data) => {
          body += data;
        });

        req.on("end", () => {
          req.body = JSON.parse(body);
          taskController.create(req, res);
        });
      }
      break;

    case "PUT":
      if (pathParams.length) {
        if (ruta == `/tareas/${pathParams[1]}`) {
          let body = "";
          req.on("data", (data) => {
            body += data;
          });

          req.on("end", () => {
            req.body = JSON.parse(body);
            req.params = { id: pathParams[1] };
            taskController.update(req, res);
          });
        }
      }

      break;
    case "DELETE":
      if (pathParams.length) {
        if (ruta == `/tareas/${pathParams[1]}`) {
          req.params = { id: pathParams[1] };
          taskController.delete(req, res);
        }
      }
      break;

    default:
      res.write(`
      <html>
        <head></head>
        <body>
          <p>Bienvenido a nuestro servidor</p>
        </body>
      </html>
    `);
      res.end();
      break;
  }
});

module.exports = {
  server,
  port,
  base,
};
