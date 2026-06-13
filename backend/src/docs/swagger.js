import swaggerJSDoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJSDoc({
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Sweet Medical API",
            version: "1.0.0",
            description: "API REST de Sweet Medical"
        },
        servers: [
            {
                url: "http://localhost:4000"
            }
        ]
    },
    apis: [
        "./src/docs/paths/*.js",
        "./src/docs/schemas/*.js"
    ]
});