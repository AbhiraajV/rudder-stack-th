import { Router } from 'express';
import {
  createTrackingPlan,
  getAllTrackingPlans,
  getTrackingPlanById,
  updateTrackingPlan,
  deleteTrackingPlan,
  createTrackingPlanByObject,
} from '../controllers/tracking-plan.controller';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: TrackingPlans
 *   description: Manage tracking plans
 */


/**
 * @swagger
 * /api/tracking-plan/create-by-object:
 *   post:
 *     summary: Create a Tracking Plan using a nested object structure
 *     description: Creates a tracking plan with its associated events and properties. 
 *                  Ensures event (name + type) and property (name + type) uniqueness.
 *     tags: [TrackingPlans]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - events
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               events:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - name
 *                     - description
 *                     - properties
 *                     - additionalProperties
 *                   properties:
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     type:
 *                       type: string
 *                       enum: [track, identify, alias, screen, page]
 *                     additionalProperties:
 *                       type: boolean
 *                     properties:
 *                       type: array
 *                       items:
 *                         type: object
 *                         required:
 *                           - name
 *                           - type
 *                           - description
 *                           - required
 *                         properties:
 *                           name:
 *                             type: string
 *                           type:
 *                             type: string
 *                             enum: [string, number, boolean]
 *                           description:
 *                             type: string
 *                           required:
 *                             type: boolean
 *     responses:
 *       201:
 *         description: Successfully created tracking plan
 *       400:
 *         description: Invalid input
 *       409:
 *         description: Conflict with existing events or properties
 */

router.post('/create-by-object',createTrackingPlanByObject)
/**
 * @swagger
 * /api/tracking-plan:
 *   post:
 *     summary: Create a new tracking plan
 *     tags: [TrackingPlans]
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
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tracking plan created successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: Duplicate tracking plan
 */
router.post('/', createTrackingPlan);

/**
 * @swagger
 * /api/tracking-plan:
 *   get:
 *     summary: Get all tracking plans for the current user
 *     tags: [TrackingPlans]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: List of tracking plans
 */
router.get('/', getAllTrackingPlans);

/**
 * @swagger
 * /api/tracking-plan/{id}:
 *   get:
 *     summary: Get a tracking plan by ID
 *     tags: [TrackingPlans]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Tracking plan ID
 *     responses:
 *       200:
 *         description: Tracking plan found
 *       404:
 *         description: Not found
 */
router.get('/:id', getTrackingPlanById);

/**
 * @swagger
 * /api/tracking-plan/{id}:
 *   put:
 *     summary: Update a tracking plan
 *     tags: [TrackingPlans]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Tracking plan ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tracking plan updated
 *       404:
 *         description: Not found
 */
router.put('/:id', updateTrackingPlan);

/**
 * @swagger
 * /api/tracking-plan/{id}:
 *   delete:
 *     summary: Delete a tracking plan
 *     tags: [TrackingPlans]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Tracking plan ID
 *     responses:
 *       204:
 *         description: Deleted successfully
 *       404:
 *         description: Not found
 */
router.delete('/:id', deleteTrackingPlan);

export default router;
