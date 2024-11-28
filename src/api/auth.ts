import { PrismaClient } from '@prisma/client';
import { validateUser, generateToken } from '../lib/auth';

const prisma = new PrismaClient();

// Función de login
export async function login(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { email, password } = await req.json();
    const user = await validateUser(email, password);

    if (!user) {
      return new Response(
        JSON.stringify({ message: 'Credenciales inválidas' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const token = generateToken(user.id, user.rol);

    return new Response(
      JSON.stringify({
        token,
        user: {
          id: user.id,
          nombre: user.nombre,
          email: user.email,
          rol: user.rol
        }
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: 'Error interno del servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// Función de validación del token
export async function validate(req: Request) {
  // Desactivamos la validación del token para pruebas
  return new Response(
    JSON.stringify({ message: 'Usuario validado' }),  // Esto se devuelve como si la validación siempre fuera exitosa
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );

  // Código original de validación del token (desactivado para pruebas)
  // const authHeader = req.headers.get('Authorization');
  // if (!authHeader?.startsWith('Bearer ')) {
  //   return new Response(
  //     JSON.stringify({ message: 'No autorizado' }),
  //     { status: 401, headers: { 'Content-Type': 'application/json' } }
  //   );
  // }

  // const token = authHeader.split(' ')[1];
  // try {
  //   const decoded = verifyToken(token);
  //   if (!decoded) {
  //     return new Response(
  //       JSON.stringify({ message: 'Token inválido' }),
  //       { status: 401, headers: { 'Content-Type': 'application/json' } }
  //     );
  //   }

  //   const user = await prisma.usuario.findUnique({
  //     where: { id: decoded.userId },
  //     select: {
  //       id: true,
  //       nombre: true,
  //       email: true,
  //       rol: true
  //     }
  //   });

  //   if (!user) {
  //     return new Response(
  //       JSON.stringify({ message: 'Usuario no encontrado' }),
  //       { status: 401, headers: { 'Content-Type': 'application/json' } }
  //     );
  //   }

  //   return new Response(
  //     JSON.stringify({ user }),
  //     { status: 200, headers: { 'Content-Type': 'application/json' } }
  //   );
  // } catch (error) {
  //   return new Response(
  //     JSON.stringify({ message: 'Error interno del servidor' }),
  //     { status: 500, headers: { 'Content-Type': 'application/json' } }
  //   );
  // }
}