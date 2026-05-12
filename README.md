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
