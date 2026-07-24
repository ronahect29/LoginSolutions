# INSTALACION

## user-service

* `npm install express cors helmet express-rate-limit jsonwebtoken bcryptjs mysql2 dotenv`
* `npm install -D typescript ts-node nodemon @types/node @types/express`

## marcajes-api

* `npm install express cors helmet express-rate-limit jsonwebtoken bcryptjs mysql2 dotenv`
* `npm install -D typescript ts-node nodemon @types/node @types/express`

## marcajes-web

* `npm create vite@latest marcajes-web -- --template react-ts`
  * `VITE` `v8.2.0`
* `npm install xlsx file-saver`
 
## PRISMA
* `npm install prisma --save-dev`
* `npm install @prisma/client`
* `npx prisma init`
* DEV
  * `npx prisma generate`
  * `npx prisma db pull`
  * `npx prisma migrate dev --name nombre_migracion`
* PROD
  * `npx prisma migrate deploy`

## INICIANDO LOS CONTENEDORES
  * Ejecutar el comando `docker compose up  --buid` para iniciar todos los contenedores.
  * Una vez iniciados contenedores, a travéz de un cliente como `DBeaver`, ejecutar los archivos ubicados en LoginSolutionQueries para poder generar las bases de datos y tablas necesarias.
  * Modificar y ejecutar initials.sql para crear los primeros usuarios, roles y aplicaciones.
  * Detener los contenedores con `docker compose down`
  * Reiniciar los contenedores con `docker compose up --build` para que se aplique la generación automática de los esquemas que necesita PRISMA.


## VARIABLES DE ENTORNO
 * Estos no se suben al repositorio, por lo tanto es indispensable crearlos MANUALMENTE para cada servidor usando `nano archivo.extension`.
 * Cada archivo .env tiene una copia de estructura subida al repositorio, las claves y secretos deben ingresarse manualmente en producción.

## APLICACIONES
  ### WEB
  * admin-web:
    * Creado con React + Vite
    * Se comunica con el backend a través de Axios
    * Se encarga de la administración de las aplicaciones, roles y usuarios
    * Estructura:
      * src:
        * api: En el archivo contenido se configura el servicio que se usara para enlazar con el backend
        * assets: Carpeta de recursos estáticos utilizados en la página
        * components: Contiene los componentes reutilizables en toda la página
        * config: Contiene la configuración de menus utilizado en el sidebar, de forma que el menu es configurable dependiendo del rol utilizado
        * context: 
          * AuthContext - versión preliminar de fuente de verdad para esta aplicacion
          * SesionContext - versión actual de contexto de Sesión, este archivo funciona como única fuente de verdad del usuario en la sesión actual
        * hooks:
          * solo se utiliza el hook useSession que accede y consume el contexto SesionContext.
        * models:
          * Contiene los modelos y dto's que se requieren en toda la aplicación.
        * pages: contiene las páginas que se requieren para cada rol
          * Auth: contiene la página de inicio de sesión
          * Dashboard: es la primera página que se muestra al usuario
        * router:
          * index: contiene el enrutado global, incluyendo la configuración de acceso por roles
          * privateRoute: actualmente en deshuso
          * publicRoute: maneja aspecto visual de carga de sesión
          * roleRouter: maneja el renderizado inicial dependiendo del rol usado, si hay un problema con el token o usuario, redirige al login como un fallback.
        * services: actualmente solo están en uso los siguientes:
          * api: contiene los interceptores que se necesitan para presentar credenciales hacia y desde el backend
          * auth: maneja el servicio del login y almacenamiento de los datos del usuario al iniciar sesión
        * styles: contiene las hojas de estilo usadas en la aplicación
        * utils: contiene constantes y herammientas varias utilizadas en la aplicación
  * marcajes-web:
    * src:
      * assets: almacena archivos como imagenes y otros estáticos para la vista del usuario
      * components: almacena compenentes y/o contenedores reutilizables en toda la aplicación.
      * context: contiene la fuente de verdad para la sesión activa en la aplicación
      * hooks: contiene el archivo que accede y consume el contexto de la sesión.
      * models: contiene los modelos y dto's que se utilizan en los intercambios de datos entre las vistas como en la comunicación con el backend.
      * pages: contiene las páginas y los componentes utilizados en ellas para mejorar la modularización.
      * router:
          * index: contiene el enrutado global, incluyendo la configuración de acceso por roles
          * privateRoute: actualmente en deshuso
          * publicRoute: maneja aspecto visual de carga de sesión
          * roleRouter: maneja el renderizado inicial dependiendo del rol usado, si hay un problema con el token o usuario, redirige al login como un fallback.
      * services: actualmente solo están en uso los siguientes:
      * api: contiene los interceptores que se necesitan para presentar credenciales hacia y desde el backend
      * auth: maneja el servicio del login y almacenamiento de los datos del usuario al iniciar sesión
      * styles: contiene las hojas de estilo usadas en la aplicación
      * utils: contiene constantes y herammientas varias utilizadas en la aplicación
  * LoginSolutionsQueries
    * Contiene los queries y datos relacionados para la carga masiva de colaboradores, la base de datos de user-service se encuentra en auth_db y para marcajes-service se encuentra en marcajes_db.
    * en la carpeta vistas se encuentra una vista que debe aplicarse para el funcionamiento del sistema pues permite la generación del reporte de marcajes
  * SERVICIOS:
    * prisma: en esta ubicación se genera automáticamente el schema que utiliza el ORM prisma para gestionar las entidades y sus relaciones. Esto se genera automáticamente al arrancar los contenedores y servidores
    * src:
      * bootstrap: contiene el generador de prisma.
      * controllers: contiene los controladores en donde se gestiona y valida la información proveniente del frontend; si alguna validación es incorrecta entonces directamente debe retornar un error y no pasar por los servicios.
      * db: se encuentra una conexión nativa con el servidor mysql, aunque esta está en desuso debido a la implementación de ORM.
      * middlewares: se encuentran los middlewares que se utilizan para el manejo de sesiones y tokens.
      * models: se encuentran los dto que se utilizan para la manipulación de datos y su transferencia hacia el backend. Los DTO de respuesta deben coincidir en estructura a los DTO que se esperan recibir en el frontend.
      * routes: para cada entidad o propósito general se creo un router, dentro de ellos se detallan los enrutamientos y controladores que requiere y el método de comunicación utilizado, en algunas rutas se implementa AuthRequest que es una herencia de Request pero que inlcuye la información del usuario que tiene iniciada la sesión.
      * services: para cada entidad o vista, existe un servicio que se comunica a través de ORM con la base de datos, para realizar una inserción multiple es preciso el uso de establecer que es una transacción.
      * types: tipos de datos que heredan y se usan para los Request y contengan la información del usuario logueado.
      * utils: contiene los archivos que establecen conexión con la base de datos tanto de la forma nativa como a través de PRISMA
  *  mysql/init:
     *  init-database.sql: contiene la configuración inicial del servidor de base de datos. Esta configuración debe realizarse antes de iniciar por primera vez el contenedor.
  * nginx:
    * contiene la configuración del proxy para el uso de certificación https y enrutamiento de servidor, este debe modificarse cuando ya se implemente un certificador adecuado para ambiente de producción y se establezca un nombre de dominio para el sitio. Los certificados actuales solo son para un ambiente local.


