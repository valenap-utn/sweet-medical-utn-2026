/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autenticación y registro de usuarios
 */

/**
 * @swagger
 * /api/auth/register/paciente:
 *   post:
 *     summary: Registrar un paciente
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             nombreUsuario: rufinita
 *             password: Password123
 *             nombre: Rufina González
 *             dni: "44123456"
 *             obraSocialId: "682f1c2f7c4d2f0012345678"
 *             planId: "682f1c2f7c4d2f0012349999"
 *     responses:
 *       201:
 *         description: Paciente registrado exitosamente
 */

/**
 * @swagger
 * /api/auth/register/medico:
 *   post:
 *     summary: Registrar un médico
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             nombreUsuario: juanperez
 *             password: Password123
 *             nombre: Juan Pérez
 *             matricula: MN12345
 *     responses:
 *       201:
 *         description: Médico registrado exitosamente
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             nombreUsuario: juanperez
 *             password: Password123
 *     responses:
 *       200:
 *         description: Login exitoso
 *       401:
 *         description: Credenciales inválidas
 */

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Renovar access token utilizando refresh token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Access token renovado correctamente
 *       401:
 *         description: Refresh token inválido o expirado
 */

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Cerrar sesión
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout exitoso
 */

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Obtener información del usuario autenticado
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuario autenticado
 *       401:
 *         description: No autenticado
 */
