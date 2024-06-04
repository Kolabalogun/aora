import { getCurrentUser } from "@/lib/appwrite";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

// Define the shape of the context value
interface GlobalContextType {
  isLoggedIn: boolean | null;

  user: any;
  setUser: React.Dispatch<any>;
  isLoading: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean | null>>;
}

// Create the context with an undefined default value
const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

// Custom hook to use the GlobalContext
export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};

// Define the props for the GlobalProvider
interface GlobalProviderProps {
  children: ReactNode;
}

// GlobalProvider component
export const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    getCurrentUser()
      .then((user) => {
        if (user) {
          setIsLoggedIn(true);
          setUser(user);
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        isLoading,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
