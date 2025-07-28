import { Router } from 'express';
import {
  createProperty,
  updateProperty,
  deleteProperty,
  listProperties
} from '../controllers/property.controller';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Properties
 *   description: Manage event properties
 */

/**
 * @swagger
 * /api/property:
 *   post:
 *     summary: Create a new property
 *     tags: [Properties]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - type
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [string, number, boolean]
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Property created successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: Property already exists
 */
router.post('/', createProperty);

/**
 * @swagger
 * /api/property:
 *   get:
 *     summary: Get all properties
 *     tags: [Properties]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: A list of properties
 */
router.get('/', listProperties);

// /**
//  * @swagger
//  * /api/property/{id}:
//  *   get:
//  *     summary: Get a property by ID
//  *     tags: [Properties]
//  *     security:
//  *       - ApiKeyAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: Property ID
//  *     responses:
//  *       200:
//  *         description: The requested property
//  *       404:
//  *         description: Property not found
//  */
// router.get('/:id', getPropertyById);

/**
 * @swagger
 * /api/property/{id}:
 *   put:
 *     summary: Update a property
 *     tags: [Properties]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Property ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [string, number, boolean]
 * 
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Property updated
 *       404:
 *         description: Property not found
 */
router.put('/:id', updateProperty);

/**
 * @swagger
 * /api/property/{id}:
 *   delete:
 *     summary: Delete a property
 *     tags: [Properties]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Property ID
 *     responses:
 *       204:
 *         description: Property deleted
 *       404:
 *         description: Property not found
 */
router.delete('/:id', deleteProperty);

export default router;
