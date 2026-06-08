import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, LoginCredentials, RegisterCredentials, AuthContextType } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_USERS: User[] = [
  {
    name: 'Farhod',
    email: 'farhod@maydonuz.uz',
    password: 'password123',
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  // Load users and current user from localStorage on mount
  useEffect(() => {
    const storedUsers = localStorage.getItem('maydon_users');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      localStorage.setItem('maydon_users', JSON.stringify(DEFAULT_USERS));
      setUsers(DEFAULT_USERS);
    }

    const currentUser = localStorage.getItem('maydon_current_user');
    if (currentUser) {
      setUser(JSON.parse(currentUser));
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const foundUser = users.find(
      (u) => u.email.toLowerCase() === credentials.email.toLowerCase()
    );

    if (!foundUser) {
      return { success: false, message: 'Foydalanuvchi topilmadi!' };
    }

    if (foundUser.password !== credentials.password) {
      return { success: false, message: 'Parol noto‘g‘ri!' };
    }

    setUser(foundUser);
    localStorage.setItem('maydon_current_user', JSON.stringify(foundUser));
    return { success: true, message: 'Muvaffaqiyatli kirildi!' };
  };

  const register = async (credentials: RegisterCredentials) => {
    const emailExists = users.some(
      (u) => u.email.toLowerCase() === credentials.email.toLowerCase()
    );

    if (emailExists) {
      return { success: false, message: 'Bu email orqali allaqachon ro‘yxatdan o‘tilgan!' };
    }

    const newUser: User = {
      name: credentials.name,
      email: credentials.email,
      password: credentials.password,
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('maydon_users', JSON.stringify(updatedUsers));

    setUser(newUser);
    localStorage.setItem('maydon_current_user', JSON.stringify(newUser));
    return { success: true, message: 'Muvaffaqiyatli ro‘yxatdan o‘tildi!' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('maydon_current_user');
  };

  const updateProfile = async (name: string, email: string) => {
    if (!user) return { success: false, message: 'Tizimga kirilmagan!' };

    // Check if new email is taken by someone else
    if (email.toLowerCase() !== user.email.toLowerCase()) {
      const emailExists = users.some(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );
      if (emailExists) {
        return { success: false, message: 'Bu email boshqa foydalanuvchi tomonidan band qilingan!' };
      }
    }

    const updatedUser = { ...user, name, email };
    
    const updatedUsers = users.map((u) => 
      u.email.toLowerCase() === user.email.toLowerCase() ? { ...u, name, email } : u
    );

    setUsers(updatedUsers);
    setUser(updatedUser);
    localStorage.setItem('maydon_users', JSON.stringify(updatedUsers));
    localStorage.setItem('maydon_current_user', JSON.stringify(updatedUser));

    return { success: true, message: 'Profil muvaffaqiyatli yangilandi!' };
  };

  const changePassword = async (oldPass: string, newPass: string) => {
    if (!user) return { success: false, message: 'Tizimga kirilmagan!' };

    if (user.password !== oldPass) {
      return { success: false, message: 'Eski parol noto‘g‘ri!' };
    }

    const updatedUser = { ...user, password: newPass };
    
    const updatedUsers = users.map((u) => 
      u.email.toLowerCase() === user.email.toLowerCase() ? { ...u, password: newPass } : u
    );

    setUsers(updatedUsers);
    setUser(updatedUser);
    localStorage.setItem('maydon_users', JSON.stringify(updatedUsers));
    localStorage.setItem('maydon_current_user', JSON.stringify(updatedUser));

    return { success: true, message: 'Parol muvaffaqiyatli o‘zgartirildi!' };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
