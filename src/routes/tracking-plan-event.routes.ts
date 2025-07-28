import { Router } from 'express';
import {
  createTrackingPlanEvent,
  getTrackingPlanEvents,
  getTrackingPlanEventById,
  updateTrackingPlanEvent,
  deleteTrackingPlanEvent,
} from '../controllers/tracking-plan-events.controller';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: TrackingPlanEvent
 *   description: API for managing tracking plan events
 */

/**
 * @swagger
 * /api/tracking-plan-events/{trackingPlanId}:
 *   get:
 *     summary: Get all events in a tracking plan
 *     tags: [TrackingPlanEvent]
 *     parameters:
 *       - in: path
 *         name: trackingPlanId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the tracking plan
 *     responses:
 *       200:
 *         description: List of tracking plan events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TrackingPlanEvent'
 */
router.get('/:trackingPlanId', getTrackingPlanEvents);

/**
 * @swagger
 * /api/tracking-plan-events/id/{id}:
 *   get:
 *     summary: Get a single tracking plan event by ID
 *     tags: [TrackingPlanEvent]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the tracking plan event
 *     responses:
 *       200:
 *         description: Tracking plan event details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TrackingPlanEvent'
 *       404:
 *         description: Not found
 */
router.get('/id/:id', getTrackingPlanEventById);

/**
 * @swagger
 * /api/tracking-plan-events:
 *   post:
 *     summary: Create a tracking plan event
 *     tags: [TrackingPlanEvent]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - trackingPlanId
 *               - eventId
 *             properties:
 *               trackingPlanId:
 *                 type: string
 *               eventId:
 *                 type: string
 *               additionalProperties:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Tracking plan event created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TrackingPlanEvent'
 *       400:
 *         description: Validation error
 */
router.post('/', createTrackingPlanEvent);

/**
 * @swagger
 * /api/tracking-plan-events/{id}:
 *   put:
 *     summary: Update a tracking plan event
 *     tags: [TrackingPlanEvent]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the tracking plan event to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               additionalProperties:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Tracking plan event updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TrackingPlanEvent'
 *       404:
 *         description: Not found
 */
router.put('/:id', updateTrackingPlanEvent);

/**
 * @swagger
 * /api/tracking-plan-events/{id}:
 *   delete:
 *     summary: Delete a tracking plan event
 *     tags: [TrackingPlanEvent]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the tracking plan event to delete
 *     responses:
 *       204:
 *         description: Deleted successfully
 *       404:
 *         description: Not found
 */
router.delete('/:id', deleteTrackingPlanEvent);

export default router;
