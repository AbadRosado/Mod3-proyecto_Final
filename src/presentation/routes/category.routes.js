import { Router } from "express";
import categoryController from "../controllers/category.controller.js";
import categoryService from "../../application/use-cases/category.service.js";
import  upload  from "../middlewares/upload.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";

// Importamos el repositorio de MySQL y el servicio de Mail
import categoryMySQLRepository from "../../infrastructure/database/mysql/category.mysql.repository.js";
import MailService from "../../infrastructure/services/mail.service.js";

// inyeccion de dependencias
const mailService = new MailService();
const categoryRepository = new CategoryMySQLRepository();
const categoryService = new categoryService(categoryRepository, mailService);
const categoryController = new categoryController(categoryService);

const router = Router();
 

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Crear una nueva categoría
 *     tags: [Categorías]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [title, content]
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Mi Tarea Pendiente"
 *               content:
 *                 type: string
 *                 example: "Finalizar el módulo de backend hoy."
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Tarea creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 content:
 *                   type: string
 *                 imageUrl:
 *                   type: string
 *                 userId:
 *                   type: string
 *       400:
 *         description: Título o contenido faltante
 */
router.post("/", authMiddleware, upload.single('image'), categoryController.createCategory);
/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Obtener todas las categorías del usuario autenticado
 *     tags: [Categorías]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de categorías obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   content:
 *                     type: string
 *       401:
 *         description: No autorizado (Token faltante o inválido)
 */
router.get("/", authMiddleware, categoryController.getCategoriesByUserId);

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Obtener todas las categorías del usuario autenticado
 *     tags: [Categorías]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de categorías obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   content:
 *                     type: string
 *       401:
 *         description: No autorizado (Token faltante o inválido)
 */
router.get("/:id", authMiddleware, categoryController.getCategoriesById);

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Actualizar una categoría existente
 *     tags: [Categorías]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID único de la categoría
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Categoría actualizada exitosamente
 *       404:
 *         description: Categoría no encontrada
 */
router.put("/:id", authMiddleware, categoryController.updateCategory);

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Eliminar una categoría (Solo Admins)
 *     tags: [Categorías]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Categoría eliminada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Categoría eliminada exitosamente"
 *       403:
 *         description: Acceso denegado (Requiere rol admin)
 *       404:
 *         description: Categoría no encontrada
 */
router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), categoryController.deleteCategory);

/**
 * @swagger
 * /categories/{id}/share:
 *   post:
 *     summary: Compartir una categoría por email
 *     tags: [Categorías]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "amigo@example.com"
 *     responses:
 *       200:
 *         description: Email enviado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email sent successfully"
 *       400:
 *         description: No se pudo enviar el correo o no es dueño de la categoría
 */
router.post("/:id/share", authMiddleware, categoryController.shareCategory);

export default router;