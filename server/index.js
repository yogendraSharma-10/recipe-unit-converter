require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan'); // HTTP request logger middleware
const converterRoutes = require('./routes/converter');

// --- Configuration ---
const app = express();
const PORT = process.env.PORT || 5000;
const API_PREFIX = process.env.API_PREFIX || '/api/v1';
const SERVICE_NAME = process.env.SERVICE_NAME || 'Recipe Unit Converter Service';
const NODE_ENV = process.env.NODE_ENV || 'development';

// --- Middleware Setup ---

// Security middleware: Sets various HTTP headers for security
// Helps protect against common web vulnerabilities.
app.use(helmet());

// CORS middleware: Enables Cross-Origin Resource Sharing
// Configure CORS to allow requests from your client application.
// In production, specify the exact client origin for enhanced security.
const corsOptions = {
    origin: NODE_ENV === 'production' ? process.env.CLIENT_ORIGIN : '*', // Allow all origins in dev, specific in prod
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow cookies to be sent (if applicable)
    optionsSuccessStatus: 204 // For preflight requests
};
app.use(cors(corsOptions));

// Body parsing middleware: Parses incoming request bodies
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// Request logging middleware: Logs HTTP requests to the console
// 'dev' format is concise, color-coded, and suitable for development.
// In production, consider a more robust logger like Winston or Pino.
if (NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// --- Routes ---

// Health check / Root endpoint
// Provides basic information about the service and its status.
app.get('/', (req, res) => {
    res.status(200).json({
        service: SERVICE_NAME,
        status: 'running',
        environment: NODE_ENV,
        version: API_PREFIX.split('/').pop(), // Extracts 'v1' from '/api/v1'
        message: 'Welcome to the Recipe Unit Converter API!',
        // Cross-project context: Mention potential integrations with other services
        integrations: [
            'This service can potentially integrate with the AI-Powered Content Assistant for smart recipe suggestions or ingredient analysis.',
            'Conversion analytics and usage metrics might be sent to a central logging service, possibly shared with the Personal Blog Platform\'s analytics infrastructure.',
            'Future: Could link to the Interactive E-commerce Product Catalog for ingredient sourcing or price comparisons.'
        ],
        documentation: `${req.protocol}://${req.get('host')}${API_PREFIX}/docs` // Placeholder for future Swagger/OpenAPI docs
    });
});

// Converter routes
// All conversion-related endpoints will be prefixed with /api/v1/convert
app.use(`${API_PREFIX}/convert`, converterRoutes);

// Catch-all for undefined routes (404 Not Found)
// This middleware will be hit if no other route matches the request.
app.use((req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    error.status = 404;
    next(error); // Pass the error to the error handling middleware
});

// --- Error Handling Middleware ---
// This middleware catches errors passed from routes or other middleware.
// It provides a consistent error response format.
app.use((error, req, res, next) => {
    // Set a default status code if not already set (e.g., from a 404 error)
    const statusCode = error.status || 500;
    res.status(statusCode).json({
        error: {
            message: error.message || 'An unexpected error occurred.',
            status: statusCode,
            // In production, avoid sending stack traces to clients for security reasons.
            stack: NODE_ENV === 'development' ? error.stack : undefined
        }
    });
    // Log the error for server-side debugging
    console.error(`[ERROR] ${statusCode} - ${error.message}`);
    if (NODE_ENV === 'development') {
        console.error(error.stack);
    }
});

// --- Server Start ---
app.listen(PORT, () => {
    console.log(`🚀 ${SERVICE_NAME} running on port ${PORT} in ${NODE_ENV} mode.`);
    console.log(`Access API at: http://localhost:${PORT}${API_PREFIX}`);
    if (NODE_ENV === 'production' && !process.env.CLIENT_ORIGIN) {
        console.warn('⚠️ Warning: CLIENT_ORIGIN is not set in production. CORS might be too permissive.');
    }
});

// Export the app for testing purposes (optional but good practice)
module.exports = app;