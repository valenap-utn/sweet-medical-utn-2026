# 🏥 Sweet Medical

---

## ⚙️ Instalación y ejecución del proyecto

### Instalar dependencias

Una vez clonado el repositorio, instalar las dependencias con:

```bash
npm install
```

---

## 🐳 Base de datos MongoDB

El proyecto utiliza MongoDB ejecutándose mediante Docker.

### Requisitos

- Docker Desktop instalado y en ejecución

### Levantar MongoDB

Desde la raíz del proyecto ejecutar:

```bash
docker compose up -d
```

Esto iniciará una instancia local de MongoDB en el puerto `27017`.

### Verificar contenedor

```bash
docker ps
```

Debería visualizarse un contenedor llamado:

```txt
sweet-medical-mongo
```

### Variables de entorno

Crear un archivo `.env` dentro de `/backend` con el siguiente contenido:

```env
PORT=4000
HOST=localhost
MONGODB_URI=mongodb://root:secret@127.0.0.1:27017/sweet-medical?authSource=admin
```

---

## 📁 Variables de entorno

El archivo `.env` no debe versionarse.

---

### Levantar el proyecto

Una vez iniciada la base de datos MongoDB, ejecutar desde la raíz del proyecto:

```bash
npm run dev
```

## Ejecutar tests

Parado desde la carpeta `/backend`, ejecutar:

```bash
npm test
```

### Ejecutar un test específico

Desde la carpeta `/backend`:

```bash
npm test archivo.test.js
```

Donde `archivo.test.js` corresponde al archivo específico que se desea probar.

---

## 🧪 Tests E2E (Cypress)

El proyecto incluye un test End-to-End desarrollado con **Cypress**, el cual verifica el siguiente flujo de usuario:

1. Inicio de sesión como paciente.
2. Búsqueda de turnos disponibles.
3. Agregado de un turno al carrito.
4. Verificación de que el turno fue agregado correctamente.

### Requisitos

- Backend ejecutándose.
- Frontend ejecutándose.
- Base de datos inicializada con datos de prueba.

### Instalación

Desde la carpeta `frontend` instalar Cypress (solo la primera vez):

```bash
npm install --save-dev cypress
```

## Ejecutar el entorno de desarrollo

Desde la raíz del proyecto:

```bash
npm run dev
```

## Ejecutar Cypress

Desde la carpeta `frontend`:

```bash
npx cypress open
```

Se abrirá la interfaz de Cypress. Luego:

1. Seleccionar **E2E Testing**.
2. Elegir el navegador deseado.
3. Ejecutar el archivo:

```text
cypress/e2e/carrito.cy.js
```

También es posible ejecutar el test desde la terminal:

```bash
npx cypress run
```

## Usuario de prueba

El test utiliza el siguiente usuario:

- Usuario: `lisa`
- Contraseña: `Password_123`

## Escenario probado

El test valida el siguiente flujo:

- Inicio de sesión del paciente.
- Acceso a la búsqueda de turnos.
- Búsqueda de turnos disponibles.
- Agregado de un turno al carrito.
- Verificación de que el carrito contiene el turno seleccionado.

---

## 🚀 Despliegue y actualización en producción

El proyecto se encuentra desplegado utilizando:

- **Oracle Cloud VPS**
- **Docker**
- **Docker Hub**
- **Portainer**
- **Nginx Proxy Manager**
- **DuckDNS**

La aplicación está compuesta por tres contenedores:

- MongoDB
- Backend (Node.js / Express)
- Frontend (Next.js)

La base de datos se almacena en un volumen de Docker (`mongo_data`), por lo que los datos persisten aunque los contenedores sean recreados.

---

### Actualizar el Backend

Luego de realizar cambios en el backend y mergearlos a `main`:

#### 1. Obtener la última versión del repositorio

```bash
git checkout main
git pull
```

#### 2. Reconstruir la imagen

Desde la raíz del proyecto:

```bash
docker build \
-f backend/Dockerfile \
-t valenap/sweet-medical-backend:latest \
./backend
```

#### 3. Publicar la imagen en Docker Hub

```bash
docker push valenap/sweet-medical-backend:latest
```

#### 4. Actualizar el Stack

Ingresar a Portainer:

```
Stacks
→ sweet-medical
→ Update the stack
```

Marcar la opción:

```
☑ Re-pull image and redeploy
```

Luego presionar:

```
Update
```

---

### Actualizar el Frontend

Luego de realizar cambios en el frontend y mergearlos a `main`:

#### 1. Obtener la última versión

```bash
git checkout main
git pull
```

#### 2. Reconstruir la imagen

```bash
docker build \
-f frontend/Dockerfile \
--build-arg NEXT_PUBLIC_API_URL=https://api.sweet-medical.duckdns.org/api \
-t valenap/sweet-medical-frontend:latest \
./frontend
```

#### 3. Publicar la imagen

```bash
docker push valenap/sweet-medical-frontend:latest
```

#### 4. Actualizar el Stack

Ingresar a Portainer:

```
Stacks
→ sweet-medical
→ Update the stack
```

Marcar:

```
☑ Re-pull image and redeploy
```

Luego presionar:

```
Update
```

---

## Base de datos

La base de datos **no se pierde** al actualizar el Stack.

MongoDB utiliza un volumen persistente:

```
mongo_data
```

Por lo tanto:

- Actualizar el frontend no afecta la base de datos.
- Actualizar el backend no afecta la base de datos.
- Recrear los contenedores no elimina la información almacenada.

Los datos únicamente se perderían si se elimina explícitamente el volumen `mongo_data`.

---

## Actualizar únicamente el Stack

Si no hubo cambios en las imágenes Docker, únicamente es necesario:

1. Ingresar a Portainer.
2. Abrir el Stack `sweet-medical`.
3. Presionar **Update the stack**.

No es necesario volver a construir ni publicar imágenes.

---

## Migrar una base de datos local a producción

Si se desea utilizar en producción la misma base de datos utilizada durante el desarrollo:

1. Exportar la base de datos local mediante `mongodump`.
2. Copiar el dump a la VPS.
3. Restaurarlo mediante `mongorestore` dentro del contenedor MongoDB.

Este procedimiento reemplaza completamente la base de datos existente en producción.

---

## GitFlow del proyecto

Para el desarrollo del proyecto, el equipo adoptó un flujo de trabajo basado en GitHub Flow, adaptado a la organización por entregas del trabajo práctico

### Rama principal

* **main** : es la _rama principal_ del repositorio y contiene la _versión estable_ del proyecto

### Ramas de entrega

Para cada entrega se crea una rama a partir de `main`, que agrupa el desarrollo correspondiente a esa instancia:

* `entrega-1`
* `entrega-2`
* `entrega-3`

Estas ramas permiten trabajar de forma aislada sobre cada entrega sin afectar directamente la rama principal

### Ramas de features

A partir de cada rama de entrega, se crean ramas de funcionalidades específicas:

* `feature/agenda`
* `feature/plan`
* `feature/users`

Cada feature se desarrolla de forma independiente y luego se integra nuevamente en la rama de entrega correspondiente

### Flujo de trabajo

1. Se crea una rama de entrega desde `main`
2. A partir de la rama `entrega-x`, se crean ramas `feature/...`
3. Se desarrollan las funcionalidades en estas ramas
4. Una vez finalizadas, se realiza un merge hacia `entrega-x`
5. Cuando la entrega está completa y validada, se fusiona en `main`

### Objetivo del flujo

Este enfoque permite:

* Organizar el trabajo por entregas
* Desarrollar múltiples funcionalidades en paralelo
* Mantener la estabilidad de la rama `main`
* Facilitar la integración progresiva del proyecto
