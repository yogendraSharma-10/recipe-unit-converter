const express = require('express');
const router = express.Router();
const { convert, getSupportedUnits } = require('../utils/conversionLogic');

/**
 * @swagger
 * tags:
 *   name: Converter
 *   description: Recipe Unit Conversion API
 */

/**
 * @swagger
 * /api/convert:
 *   post:
 *     summary: Converts an amount from one unit to another.
 *     tags: [Converter]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - fromUnit
 *               - toUnit
 *             properties:
 *               amount:
 *                 type: number
 *                 description: The quantity to convert.
 *                 example: 100
 *               fromUnit:
 *                 type: string
 *                 description: The unit to convert from (e.g., "ml", "cup", "g").
 *                 example: "ml"
 *               toUnit:
 *                 type: string
 *                 description: The unit to convert to (e.g., "cup", "oz", "kg").
 *                 example: "cup"
 *     responses:
 *       200:
 *         description: Successful conversion.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 originalAmount:
 *                   type: number
 *                   example: 100
 *                 originalUnit:
 *                   type: string
 *                   example: "ml"
 *                 convertedAmount:
 *                   type: number
 *                   example: 0.422675
 *                 convertedUnit:
 *                   type: string
 *                   example: "cup"
 *       400:
 *         description: Invalid input or unsupported units.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid input: amount must be a positive number."
 *       500:
 *         description: Internal server error during conversion.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "An unexpected error occurred during conversion."
 */
router.post('/convert', (req, res) => {
    const { amount, fromUnit, toUnit } = req.body;

    // Input validation
    if (typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ error: 'Invalid input: amount must be a positive number.' });
    }
    if (typeof fromUnit !== 'string' || fromUnit.trim() === '') {
        return res.status(400).json({ error: 'Invalid input: fromUnit must be a non-empty string.' });
    }
    if (typeof toUnit !== 'string' || toUnit.trim() === '') {
        return res.status(400).json({ error: 'Invalid input: toUnit must be a non-empty string.' });
    }

    try {
        const result = convert(amount, fromUnit, toUnit);

        // Check if the conversion logic returned an error string
        if (typeof result === 'string') {
            return res.status(400).json({ error: result });
        }

        // Successfully converted
        res.status(200).json({
            originalAmount: amount,
            originalUnit: fromUnit,
            convertedAmount: result.toFixed(6), // Format to a reasonable precision
            convertedUnit: toUnit,
        });
    } catch (error) {
        console.error(`Conversion error for ${amount} ${fromUnit} to ${toUnit}:`, error.message);
        // For more detailed logging or error reporting, consider integrating with a central logging service
        // like one used by the Personal Blog Platform or Real-time Weather Dashboard.
        res.status(500).json({ error: 'An unexpected error occurred during conversion. Please try again later.' });
    }
});

/**
 * @swagger
 * /api/units:
 *   get:
 *     summary: Retrieves a list of all supported units for conversion.
 *     tags: [Converter]
 *     responses:
 *       200:
 *         description: A list of supported units.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 units:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["ml", "l", "cup", "oz", "g", "kg", "lb", "tsp", "tbsp"]
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to retrieve supported units."
 */
router.get('/units', (req, res) => {
    try {
        const units = getSupportedUnits();
        res.status(200).json({ units });
    } catch (error) {
        console.error('Error retrieving supported units:', error.message);
        res.status(500).json({ error: 'Failed to retrieve supported units.' });
    }
});

module.exports = router;