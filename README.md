# prueba-desempe-o-BD MegaStore Global

"MegaStore Global", enfrenta
una crisis operativa. Durante años, han manejado todo su inventario, ventas, proveedores
y clientes en un único archivo maestro de Excel.
El volumen de datos ha crecido tanto que el archivo es inmanejable: hay inconsistencias
en los precios, direcciones de clientes duplicadas con errores ortográficos y es imposible
saber el stock real en tiempo real.

Solución con base de datos postgresql para base de datos relacional y poder solucionar redundancia de datos
Junto con una base de datos no relacional (MongoDB) para el manejo de log de auditorias

Agregar un archivo .env con la sigieunte configuracion
PORT=3000
POSTGRES_URI="postgresql://<USER>:<PASSWORD>@localhost:<PORT>/<DB_NAME>"
MONGO_URI="mongodb://localhost:<PORT>/<DB_NAME>"
FILE_DATA_CSV=<RUTA_DEL_DATA_CSV>
Reemplazando:
<USER> -> por tu usuario de postgres
<PASSWORD> -> por tu contraseña de postgres
<PORT> ->por tu puerto de servidor
<DB_NAME> -> por el nombre de la base de datos
<RUTA_DEL_DATA_CSV> -> por la ruta del archivo .CSV