#¿Qué sucedio al usar async y await?
Al utilizarlos, solo me enfoqué en crear funciones asíncronas que se encargaran de resolver las promesas de las funciones: agregar tarea, actualizar estado, eliminar tarea, entre otras como: mostrar tareas y buscar por id. Luego serían invocadas en el menú de opciones, que a su vez también es asícncrono, porque se implementó await en cada una de ellas, permitiendo obtener una estructura más ordenada; lo cual, me facilitó mucho el trabajo a la hora de desarrollar el programa.

#¿Qué sucedio al usar el método then()?
Con este método no tuve que crear otras funciones, si no que invoqúe cada promesa para ir resolviendolas en cada caso, lo que me costó mucho, porque no tenía idea de como implementarlas en una estructura switch-case. Al final lo resolví haciendo que retornaran ciertas promesas internamente en algunas funciones y a cada una de ellas al final les agregué el método finally para volver a cargar el menú de opciones.

#¿Qué diferencias encontraste entre async, await y el método then()?
Con async-await solo tenía que crear una función que esperara a que se cumpliera la promesa, mientras que con then tenía que crear then's condicionados para retornar las promesas y ser resueltas en la funcion invocada y volver a cargar nuevamente el menú de opciones.