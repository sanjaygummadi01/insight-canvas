import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(undefined);

const generateId = () => Math.random().toString(36).substring(2, 15);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('auth_user');
    const savedSession = localStorage.getItem('auth_session');
    
    if (savedUser && savedSession) {
      try {
        const parsedUser = JSON.parse(savedUser);
        parsedUser.profile.joinedAt = new Date(parsedUser.profile.joinedAt);
        setUser(parsedUser);
      } catch (e) {
        console.error('Failed to parse saved user', e);
        localStorage.removeItem('auth_user');
        localStorage.removeItem('auth_session');
      }
    }
    setIsLoading(false);
  }, []);

  const getUsers = () => {
    try {
      const users = localStorage.getItem('registered_users');
      if (users) {
        return JSON.parse(users);
      }
    } catch (e) {
      console.error('Failed to parse users', e);
    }
    return [];
  };

  const saveUsers = (users) => {
    localStorage.setItem('registered_users', JSON.stringify(users));
  };

  const login = async (email, password) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const users = getUsers();
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!foundUser) {
      setIsLoading(false);
      return { success: false, error: 'No account found with this email' };
    }
    
    if (foundUser.password !== password) {
      setIsLoading(false);
      return { success: false, error: 'Incorrect password' };
    }
    
    foundUser.profile.joinedAt = new Date(foundUser.profile.joinedAt);
    
    setUser(foundUser);
    localStorage.setItem('auth_user', JSON.stringify(foundUser));
    localStorage.setItem('auth_session', 'active');
    setIsLoading(false);
    
    return { success: true };
  };

  const register = async (email, password, name) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const users = getUsers();
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (existingUser) {
      setIsLoading(false);
      return { success: false, error: 'An account with this email already exists' };
    }
    
    const userId = generateId();
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    
    const newUser = {
      id: userId,
      email,
      password,
      profile: {
        id: userId,
        name,
        email,
        avatar: initials || 'U',
        role: 'Data Analyst',
        joinedAt: new Date(),
        bio: '',
        location: '',
        phone: '',
      },
    };
    
    users.push(newUser);
    saveUsers(users);
    
    setUser(newUser);
    localStorage.setItem('auth_user', JSON.stringify(newUser));
    localStorage.setItem('auth_session', 'active');
    setIsLoading(false);
    
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_session');
  };

  const updateProfile = (updates) => {
    if (!user) return;
    
    const updatedProfile = { ...user.profile, ...updates };
    const updatedUser = { ...user, profile: updatedProfile };
    
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
      saveUsers(users);
    }
    
    setUser(updatedUser);
    localStorage.setItem('auth_user', JSON.stringify(updatedUser));
  };

  const updateProfileImage = (base64Image) => {
    updateProfile({ avatarImage: base64Image });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        updateProfileImage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
