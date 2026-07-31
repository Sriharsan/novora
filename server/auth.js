import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

export const hash = (pw) => bcrypt.hashSync(pw, 10);
export const compare = (pw, h) => bcrypt.compareSync(pw, h);
export const sign = (user) =>
  jwt.sign({ id: user.id, role: user.role, email: user.email }, SECRET, { expiresIn: "7d" });

export function auth(required = true) {
  return (req, res, next) => {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) {
      if (required) return res.status(401).json({ error: "Not authenticated" });
      return next();
    }
    try {
      req.user = jwt.verify(token, SECRET);
      next();
    } catch {
      return res.status(401).json({ error: "Invalid token" });
    }
  };
}

export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role))
    return res.status(403).json({ error: "Forbidden" });
  next();
};
