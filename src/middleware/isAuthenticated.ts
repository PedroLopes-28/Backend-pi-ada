import { Request, Response, NextFunction } from "express";
import { verify, JwtPayload } from "jsonwebtoken";
import prismaClient from "../prisma";

type Payload = JwtPayload & { sub: string; jti?: string };

export async function isAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const auth = request.headers.authorization;

  if (!auth?.startsWith("Bearer ")) {
    return response.status(401).end(); 
  }

  const token = auth.split(" ")[1];
  if (!token) return response.status(401).end(); 

  try {
    const { sub, jti } = verify(token, process.env.JWT_SECRET as string) as Payload;

    if (!jti) {
      return response.status(401).end(); 
    }

    const revogado = await prismaClient.tokenRevogado.findUnique({
      where: { jti },
      select: { id: true },
    });
  

    if (revogado) {
      return response.status(401).json({ error: "Token revogado" }); 
    }

    request.user_id = sub;
    return next();
  } catch {
    return response.status(401).end();          
  }
}
