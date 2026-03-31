import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "vebx-admin-secret-change-in-production";

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const token = authHeader.slice(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.adminId = decoded.id;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

/** For SSE: EventSource cannot set Authorization; allow `?access_token=` (use HTTPS in production). */
export function authMiddlewareBearerOrQuery(req, res, next) {
  let token = null;
  const h = req.headers.authorization;
  if (h?.startsWith("Bearer ")) token = h.slice(7);
  else if (typeof req.query.access_token === "string" && req.query.access_token.length > 0) {
    token = req.query.access_token;
  }
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.adminId = decoded.id;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

export function createToken(adminId) {
  return jwt.sign({ id: adminId }, JWT_SECRET, { expiresIn: "7d" });
}
