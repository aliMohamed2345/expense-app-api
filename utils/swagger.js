import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Expense Tracker API",
            version: "1.0.0",
            description: "API documentation for Expense Tracker backend",
        },
        servers: [
            { url: "/" }
        ],
        components: {
            securitySchemes: {
                cookieAuth: {
                    type: "apiKey",
                    in: "cookie",
                    name: "token",
                },
            },
        },
        security: [{ cookieAuth: [] }],
    },
    apis:[ "./Routes/*.js",
  "./Controllers/*.js",
  "./dist/Routes/*.js",
  "./dist/Controllers/*.js"]
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };
