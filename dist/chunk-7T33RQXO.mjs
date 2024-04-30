import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/helpers/authChecker.ts
import jwt from "jsonwebtoken";
function authChecker(req, res, next) {
  const token = req.headers?.authorization?.split(" ")[1];
  console.log("oi", token);
  if (!token) {
    res.status(401);
    throw Error("token necess\xE1rio para proseeguir");
  }
  const data = jwt.verify(token, `${process.env.JWT_SECRET}`);
  if (!data) {
    res.status(401);
    throw Error("token inv\xE1lido");
  }
  const user = prisma.user.findUnique({
    where: {
      id: data.id
    }
  });
  if (!user) {
    res.status(401);
    throw Error("token inv\xE1lido");
  }
  next();
}

export {
  authChecker
};
