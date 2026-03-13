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

export function createToken(adminId) {
  return jwt.sign({ id: adminId }, JWT_SECRET, { expiresIn: "7d" });
}
