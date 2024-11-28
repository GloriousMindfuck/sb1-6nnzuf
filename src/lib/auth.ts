import { PrismaClient, Rol } from '@prisma/client';
import { hash, compare } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function createUser(nombre: string, email: string, password: string, rol: Rol) {
  const hashedPassword = await hash(password, 10);
  
  return prisma.usuario.create({
    data: {
      nombre,
      email,
      passwordHash: hashedPassword,
      rol
    }
  });
}

export async function validateUser(email: string, password: string) {
  const user = await prisma.usuario.findUnique({ where: { email } });
  if (!user) return null;

  const valid = await compare(password, user.passwordHash);
  if (!valid) return null;

  return user;
}

export function generateToken(userId: string, rol: Rol) {
  return sign({ userId, rol }, JWT_SECRET, { expiresIn: '24h' });
}

export function verifyToken(token: string) {
  try {
    return verify(token, JWT_SECRET) as { userId: string; rol: Rol };
  } catch {
    return null;
  }
}

export async function logAction(usuarioId: string, accion: string, expedienteId?: string, detalles?: string) {
  return prisma.log.create({
    data: {
      usuarioId,
      expedienteId,
      accion,
      detalles
    }
  });
}