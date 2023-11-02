import React, { useState } from 'react';
import Converter from './components/Converter';
import './styles/main.css'; // Import the main CSS file for global styles

/**
 * Main application component for the Recipe Unit Converter.
 * Manages the overall state, handles API calls to the backend for conversions,
 * and displays the results or errors.
 */
function App() {
  // State to store the result received from the backend API after a successful conversion.
  const [conversionResult, setConversionResult] = useState(null);
  // State to indicate if an API call is currently in progress.
  const [loading, setLoading] = useState(false);
  // State to store any error messages encountered during the conversion process.
  const [error, setError] = useState(null);

  // Determine the backend API URL.
  // In a production environment, this should be set via environment variables
  // (e.g., REACT_APP_API_URL). For development, it defaults to localhost.
  // In a microservice architecture, this URL might be dynamically discovered
  // via a service registry or a central API Gateway (e.g., for the To-Do List,
  // Blog, Weather, E-commerce, or URL Shortener services).
  const backendUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';

  /**
   * Handles the conversion request initiated by the Converter component.
   * Sends the conversion parameters to the backend API and updates the UI
   * with the result, loading status, or any errors.
   *
   * @param {object} conversionData - An object containing conversion parameters.
   * @param {number} conversionData.amount - The quantity to convert.
   * @param {string} conversionData.fromUnit - The unit to convert from (e.g., 'cups', 'grams').
   * @param {string} conversionData.toUnit - The unit to convert to (e.g., 'ml', 'oz').
   * @param {string} [conversionData.ingredient] - Optional: The ingredient name, for context-aware conversions.
   */
  const handleConvert = async ({ amount, fromUnit, toUnit, ingredient }) => {
    setLoading(true); // Start loading
    setError(null); // Clear previous errors
    setConversionResult(null); // Clear previous results

    try {
      const response = await fetch(`${backendUrl}/api/convert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // In a microservice context, you might include headers for:
          // - API keys specific to this service (e.g., 'X-Recipe-Converter-API-Key')
          // - Correlation IDs for tracing requests across multiple services
          // - Authorization tokens if the conversion requires user authentication
          // 'X-Correlation-ID': `rc-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          // 'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // Example if integrated with a user service
        },
        body: JSON.stringify({ amount, fromUnit, toUnit, ingredient }),
      });

      if (!response.ok) {
        // Attempt to parse a more specific error message from the backend response
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setConversionResult(data); // Store the successful conversion result
    } catch (err) {
      console.error('Conversion failed:', err);
      setError(`Failed to convert: ${err.message}`); // Display the error message
    } finally {
      setLoading(false); // End loading, regardless of success or failure
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">Recipe Unit Converter</h1>
        <p className="app-description">
          Effortlessly convert ingredient measurements between different units for cooking.
          This service is a component of a larger ecosystem, designed to integrate with
          other applications like the Interactive To-Do List, Personal Blog Platform,
          and E-commerce Product Catalog.
        </p>
      </header>

      <main className="app-main">
        {/* The Converter component handles user input and triggers the conversion */}
        <Converter onConvert={handleConvert} />

        {/* Display area for loading status, error messages, or conversion results */}
        <div className="conversion-output">
          {loading && <p className="message loading-message">Converting...</p>}
          {error && <p className="message error-message">Error: {error}</p>}
          {conversionResult && (
            <div className="message success-message">
              <h2>Conversion Result</h2>
              <p>
                {/* Display original amount and unit, and the converted amount and unit */}
                {conversionResult.originalAmount} {conversionResult.originalUnit} of {conversionResult.ingredient || 'item'} is approximately{' '}
                <strong>{conversionResult.convertedAmount} {conversionResult.convertedUnit}</strong>.
              </p>
              {/* Display any additional notes provided by the conversion logic */}
              {conversionResult.notes && <p className="notes">Notes: {conversionResult.notes}</p>}
            </div>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} Recipe Unit Converter. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;