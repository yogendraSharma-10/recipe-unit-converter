/**
 * @file This module provides utility functions for converting ingredient measurements
 *       between various units, including handling volume-to-weight conversions
 *       based on ingredient densities.
 */

// --- Constants for Conversion Rates ---

/**
 * Defines conversion rates for various units within different categories.
 * All rates are relative to a chosen base unit for that category (e.g., 'ml' for volume, 'g' for weight).
 *
 * Structure:
 * {
 *   categoryName: {
 *     base: 'baseUnitName',
 *     units: {
 *       'unitName': conversionFactorToBaseUnit,
 *       ...
 *     }
 *   }
 * }
 */
const CONVERSION_RATES = {
