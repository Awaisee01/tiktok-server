// import express, { type Request, Response, NextFunction } from "express";
// import { registerRoutes } from "./routes.js";

// const app = express();
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

// // Simple logging middleware
// app.use((req, res, next) => {
//   const start = Date.now();
//   const path = req.path;
  
//   res.on("finish", () => {
//     const duration = Date.now() - start;
//     if (path.startsWith("/api")) {
//       let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
//       console.log(logLine);
//     }
//   });

//   next();
// });

// (async () => {
//   const server = await registerRoutes(app);

//   app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
//     const status = err.status || err.statusCode || 500;
//     const message = err.message || "Internal Server Error";

//     res.status(status).json({ message });
//     console.error(err);
//   });

//   // Static file serving for production
//   app.use(express.static("public"));
  
//   // Simple catch-all route for SPA
//   app.get("*", (req, res) => {
//     res.sendFile("index.html", { root: "public" });
//   });

//   // Default to port 5000 or use environment variable
//   const port = process.env.PORT || 5000;
//   server.listen({
//     port,
//     host: "0.0.0.0", // Use 0.0.0.0 for production to listen on all network interfaces
//   }, () => {
//     console.log(`Server running on port ${port}`);
//   });
// })();


import express, { type Request, Response, NextFunction } from "express";
import cors from "cors";
import { registerRoutes } from "./routes.js";

const app = express();

// Enable CORS for your frontend domain
app.use(cors({
  origin: 'https://downloadtiktokvideosinhd.com', // Frontend domain
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logging middleware for API requests
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      console.log(`${req.method} ${path} ${res.statusCode} in ${duration}ms`);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  // Error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error("Error details:", err); // More detailed error logging
    res.status(status).json({ message });
  });

  // Serve static frontend files from "public"
  app.use(express.static("public"));

  // Fallback route for SPA (Single Page Application)
  app.get("*", (req, res) => {
    res.sendFile("index.html", { root: "public" });
  });

  // Start server
  const port = process.env.PORT || 5000;
  server.listen(
    {
      port,
      host: "0.0.0.0", // Listen on all network interfaces
    },
    () => {
      console.log(`Server running on port ${port}`);
    }
  );
})();
