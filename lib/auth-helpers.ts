import { prisma } from './prisma';
import bcrypt from 'bcryptjs';
import type { User, UserWithPassword } from '@/types/prisma';

export async function verifyPassword(email: string, password: string): Promise<User | null> {
  try {
    // Lấy user CÓ password từ database (internal use only)
    const user: UserWithPassword | null = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    
    if (!user) {
      return null;
    }
    
    // Verify password với hash trong database
    const isValid = await bcrypt.compare(password, user.password);
    
    if (!isValid) {
      return null;
    }
    
    // ✅ Loại bỏ password trước khi return (safe for API)
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  } catch (error) {
    console.error('Error verifying password:', error);
    return null;
  }
}

export async function createUser(name: string, email: string, password: string): Promise<User | null> {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user: UserWithPassword = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
      },
    });
    
    // ✅ Loại bỏ password trước khi return
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const user: UserWithPassword | null = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    
    if (!user) {
      return null;
    }
    
    // ✅ Loại bỏ password trước khi return
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  } catch (error) {
    console.error('Error getting user by email:', error);
    return null;
  }
}
