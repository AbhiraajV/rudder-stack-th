
import { Router } from 'express';
import {
  addTrackingPlanEventProperty,
//   getAllTrackingPlanEventProperties,
//   getTrackingPlanEventPropertyById,
  updateTrackingPlanEventProperty,
  deleteTrackingPlanEventProperty,
} from '../controllers/tracking-plan-property.controller';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: TrackingPlanEventProperties
 *   description: Manage properties associated with tracking plan events
 */

/**
 * @swagger
 * /api/tracking-plan-event-property:
 *   post:
 *     summary: Create a new tracking plan event property
 *     tags: [TrackingPlanEventProperties]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - propertyId
 *               - trackingPlanEventId
 *             properties:
 *               propertyId:
 *                 type: string
 *               trackingPlanEventId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tracking plan event property created
 *       400:
 *         description: Validation error
 */
router.post('/', addTrackingPlanEventProperty);

// /**
//  * @swagger
//  * /api/tracking-plan-event-property:
//  *   get:
//  *     summary: Get all tracking plan event properties
//  *     tags: [TrackingPlanEventProperties]
//  *     security:
//  *       - ApiKeyAuth: []
//  *     responses:
//  *       200:
//  *         description: A list of tracking plan event properties
//  */
// router.get('/', getAllTrackingPlanEventProperties);

// /**
//  * @swagger
//  * /api/tracking-plan-event-property/{id}:
//  *   get:
//  *     summary: Get a tracking plan event property by ID
//  *     tags: [TrackingPlanEventProperties]
//  *     security:
//  *       - ApiKeyAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: ID of the tracking plan event property
//  *     responses:
//  *       200:
//  *         description: The requested tracking plan event property
//  *       404:
//  *         description: Not found
//  */
// router.get('/:id', getTrackingPlanEventPropertyById);

/**
 * @swagger
 * /api/tracking-plan-event-property/{id}:
 *   put:
 *     summary: Update a tracking plan event property
 *     tags: [TrackingPlanEventProperties]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the tracking plan event property
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               propertyId:
 *                 type: string
 *               trackingPlanEventId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated successfully
 *       404:
 *         description: Not found
 */
router.put('/:id', updateTrackingPlanEventProperty);

/**
 * @swagger
 * /api/tracking-plan-event-property/{id}:
 *   delete:
 *     summary: Delete a tracking plan event property
 *     tags: [TrackingPlanEventProperties]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the tracking plan event property
 *     responses:
 *       204:
 *         description: Deleted successfully
 *       404:
 *         description: Not found
 */
router.delete('/:id', deleteTrackingPlanEventProperty);

export default router;
