import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

export interface User {
  id: number;
  name: string;
  email: string;
  password: string; 
  createdAt: string;
}

const usersFilePath = path.join(process.cwd(), 'data', 'users.json');


function ensureUsersFile() {
  try {
    if (!fs.existsSync(usersFilePath)) {
      const dir = path.dirname(usersFilePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(usersFilePath, JSON.stringify([], null, 2));
    }
  } catch (error) {
    console.error('Error ensuring users file:', error);
  }
}

export function getUsers(): User[] {
  try {
    ensureUsersFile();
    const fileContents = fs.readFileSync(usersFilePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Error reading users:', error);
    return [];
  }
}

function saveUsers(users: User[]): void {
  try {
    ensureUsersFile();
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving users:', error);
    throw new Error('Failed to save users');
  }
}

export function getUserByEmail(email: string): User | undefined {
  const users = getUsers();
  return users.find(user => user.email.toLowerCase() === email.toLowerCase());
}

export async function createUser(name: string, email: string, password: string): Promise<User | null> {
  try {
    const users = getUsers();
    
    if (getUserByEmail(email)) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const maxId = users.length > 0 ? Math.max(...users.map(u => u.id)) : 0;
    
    const newUser: User = {
      id: maxId + 1,
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };
    
    users.push(newUser);
    saveUsers(users);
    
    return newUser;
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
}

export async function verifyPassword(email: string, password: string): Promise<User | null> {
  try {
    const user = getUserByEmail(email);
    
    if (!user) {
      return null;
    }
    
    const isValid = await bcrypt.compare(password, user.password);
    
    if (!isValid) {
      return null;
    }
    
    return user;
  } catch (error) {
    console.error('Error verifying password:', error);
    return null;
  }
}
