import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";

let postRoutes: any;
try {
  // Prefer static import when available
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  postRoutes = require("./routes/post.routes").default;
} catch (err) {
  // Fallback stub router if the real module is missing (prevents compile/runtime error)
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { Router } = require("express");
  const router = Router();
  router.get("/", (_req: Request, res: Response) =>
    res.json({ success: true, posts: [] })
  );
  postRoutes = router;
}
// Other routes will be imported here as teammates push their code:
// import authRoutes from "./routes/auth.routes";          // Somraj
// import commentRoutes from "./routes/comment.routes";    // Himani
// import announcementRoutes from "./routes/announcement.routes"; // Himani
// import adminRoutes from "./routes/admin.routes";        // Neeraj

const app: Application = express();

// ─── Middleware ────────────────────────────────────────────────────────────
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Health check ─────────────────────────────────────────────────────────
app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ─── Routes ───────────────────────────────────────────────────────────────
app.use("/api/posts", postRoutes);
// app.use("/api/auth", authRoutes);
// app.use("/api/comments", commentRoutes);
// app.use("/api/announcements", announcementRoutes);
// app.use("/api/admin", adminRoutes);

// ─── 404 handler ──────────────────────────────────────────────────────────
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ─── Global error handler ─────────────────────────────────────────────────
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal server error" });
});

export default app;