import React from 'react';

interface AuthContextType {
  name: string;
  key: string;
}

const AuthContext = React.createContext<AuthContextType | null>(null);

export default AuthContext;
