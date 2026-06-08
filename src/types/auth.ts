export interface User {
  name: string;
  email: string;
  password?: string;
}

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
}

export interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  register: (credentials: RegisterCredentials) => Promise<AuthResponse>;
  logout: () => void;
  updateProfile: (name: string, email: string) => Promise<AuthResponse>;
  changePassword: (oldPass: string, newPass: string) => Promise<AuthResponse>;
}
