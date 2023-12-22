import React, { useState, useEffect } from 'react';
import axios from 'axios'; // For making API requests

/**
 * Converter Component
 * Renders the UI for converting recipe units.
 * Handles user input, API calls for unit conversion, and displays results/errors.
 */
const Converter = () => {
  // State variables for user input and conversion results
  const [amount, setAmount] = useState(''); // The numerical value to convert
  const [fromUnit, setFromUnit] = useState(''); // The unit to convert from
  const [toUnit, setToUnit] = useState('');     // The unit to convert to
  const [result, setResult] = useState(null);   // The converted amount

  // State variables for UI feedback