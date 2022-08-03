import { useState, createContext, ReactNode, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import Cookies from 'js-cookie'

import api from '../services/api'


type AuthContextProviderProps = {
    children?: ReactNode
}
type userType = {
    token: string,
    nome: string,
    email: string,
    admin: boolean
}
type authType = {
    email: string,
    senha: string
}
type AuthContextType = {
    user: userType,
    signInWithEmail: (auth: authType) => Promise<void>
}
export const AuthContext = createContext({} as AuthContextType)

export function AuthContextProvider(props: AuthContextProviderProps) { 
    const history  = useHistory();
    const [user, setUser] = useState<userType>({
      token: "",
      nome: "",
      email: "",
      admin: false
    });

    useEffect(() => {  
      async function loadUser() {
        const user: userType = JSON.parse(Cookies.get("user") || "{}");
        
        if (!user.token && history.location.pathname !== "/login")
          history.push("/login");
      
        setUser(user);  
      }

      return () => {
        loadUser();
      }
      
      // eslint-disable-next-line
    },[])
    

    async function signInWithEmail(auth: authType) { 
      const result = await api.post("/login", auth);
      
      if(result && result.data) {
        const { token, nome, admin } = result.data
  
        if (!token || (!admin && admin !== false)) 
          throw new Error("Algumas informações não foram encontradas na sua conta Google")        

        const user = { 
          token: "Bearer " + token, 
          nome,
          email: auth.email,
          admin 
        };
          
        setUser(user)

        Cookies.set('user', JSON.stringify(user));
      }
    }
  
    return (
        <AuthContext.Provider value={{user, signInWithEmail}}>
          {props.children}
        </AuthContext.Provider>
    )
}