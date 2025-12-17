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
            {
                url: `http://localhost:${process.env.PORT}`,
                description: "Local server",
            },
            {
                url: "https://expense-app-api-lemon.vercel.app",
                description: "Production server",
            },
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
    apis: ["./Controllers/*.js", "./Routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };
