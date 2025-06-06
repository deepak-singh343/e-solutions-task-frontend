import React, { createContext, useContext, useState, useEffect } from "react";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase/config";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("authUser", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("authUser");
  };

  useEffect(() => {
    const restoreUser = async () => {
      const storedUser = localStorage.getItem("authUser");
      if (!storedUser) {
        setLoading(false);
        return;
      }

      const parsedUser = JSON.parse(storedUser);
      try {
        const docRef = doc(db, "users", parsedUser.email);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const fullUserData = docSnap.data();
          let userData = {};
          if (fullUserData.userType == "candidate") {
            userData = {
              token: parsedUser.token,
              email: fullUserData.email,
              userType: fullUserData.userType,
              name: fullUserData.name,
              profilePic: fullUserData.profilePic || null,
              address: fullUserData.address,
              phone: fullUserData.phone,
              gender: fullUserData.gender,
            };
          } else {
            userData = {
              organizationName: fullUserData.organizationName,
              contactPerson: fullUserData.contactPerson,
              industry: fullUserData.industry,
              logoUrl: fullUserData.logoUrl,
              userType: fullUserData.userType,
              address: fullUserData.address,
              email: fullUserData.email,
              phone: fullUserData.phone,
            };
          }

          setUser(userData);
          localStorage.setItem("authUser", JSON.stringify(userData));
        } else {
          setUser(parsedUser);
        }
      } catch (err) {
        console.error("Error restoring user: ", err);
        setUser(parsedUser);
      } finally {
        setLoading(false);
      }
    };

    restoreUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
export { AuthProvider };
