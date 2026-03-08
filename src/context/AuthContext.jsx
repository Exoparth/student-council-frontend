import { createContext, useContext, useEffect, useState } from "react";
import { getMe } from "../api/authApi";
import { getToken, removeToken } from "../utils/token";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const data = await getMe();
      setUser(data);
    } catch (error) {
      console.log("====================================");
      console.log(error);
      console.log("====================================");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = getToken();

    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const logout = () => {
    removeToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
