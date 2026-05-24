import AsyncStorage from '@react-native-async-storage/async-storage';

export type UserRole = 'seeker' | 'employer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  company?: string;
  title?: string;
  location?: string;
  bio?: string;
  skills?: string[];
  resumeName?: string;
  createdAt: string;
}

const AUTH_KEY = 'careerbridge_auth';
const USERS_KEY = 'careerbridge_users';

const generateId = () => Math.random().toString(36).substr(2, 9);

interface StoredUser extends User {
  _password: string;
}

export async function signUp(
  name: string,
  email: string,
  password: string,
  role: UserRole,
  company?: string
): Promise<User> {
  const usersJson = await AsyncStorage.getItem(USERS_KEY);
  const users: StoredUser[] = usersJson ? JSON.parse(usersJson) : [];

  const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) throw new Error('An account with this email already exists.');

  const newUser: StoredUser = {
    id: generateId(),
    name,
    email,
    role,
    company: company || undefined,
    title: role === 'seeker' ? 'Job Seeker' : 'Recruiter',
    location: '',
    bio: '',
    skills: [],
    resumeName: undefined,
    createdAt: new Date().toISOString(),
    _password: password,
  };

  users.push(newUser);
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
  const { _password, ...publicUser } = newUser;
  await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(publicUser));
  return publicUser;
}

export async function signIn(email: string, password: string): Promise<User> {
  const usersJson = await AsyncStorage.getItem(USERS_KEY);
  const users: StoredUser[] = usersJson ? JSON.parse(usersJson) : [];

  const stored = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!stored) throw new Error('No account found with this email.');
  if (stored._password !== password) throw new Error('Incorrect password. Please try again.');

  const { _password, ...publicUser } = stored;
  await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(publicUser));
  return publicUser;
}

export async function signOut(): Promise<void> {
  await AsyncStorage.removeItem(AUTH_KEY);
}

export async function getCurrentUser(): Promise<User | null> {
  const json = await AsyncStorage.getItem(AUTH_KEY);
  return json ? JSON.parse(json) : null;
}

export async function updateUser(updates: Partial<User>): Promise<User> {
  const current = await getCurrentUser();
  if (!current) throw new Error('Not logged in');

  const updated = { ...current, ...updates };
  await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(updated));

  const usersJson = await AsyncStorage.getItem(USERS_KEY);
  const users: StoredUser[] = usersJson ? JSON.parse(usersJson) : [];
  const idx = users.findIndex((u) => u.id === current.id);
  if (idx >= 0) {
    users[idx] = { ...users[idx], ...updates };
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
  return updated;
}
