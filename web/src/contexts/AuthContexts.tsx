import { useState, createContext, ReactNode, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { getCookies, setCookies } from '../services/cookies'

import api from '../services/api'


type AuthContextProviderProps = {
    children?: ReactNode
}
type userType = {
    token: string,
    id: number,
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
    updateLoggedUser: (newUser: {nome: string, email: string, admin: boolean}) => void
    signInWithEmail: (auth: authType) => Promise<void>
}
export const AuthContext = createContext({} as AuthContextType)

export function AuthContextProvider(props: AuthContextProviderProps) { 
    const history  = useHistory();
    const [user, setUser] = useState<userType>({
      token: "",
      id: 0,
      nome: "",
      email: "",
      admin: false
    });

    useEffect(() => {  
      async function loadUser() {
        const user: userType = getCookies("user");
        
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
        const { token, id, nome, admin } = result.data
  
        if (!token || (!admin && admin !== false)) 
          throw new Error("Algumas informações não foram encontradas na sua conta Google")        

        const user = { 
          token: "Bearer " + token, 
          id,
          nome,
          email: auth.email,
          admin 
        };
          
        setUser(user)

        setCookies('user', user);
      }
    }

    async function updateLoggedUser(newUser: {nome: string, email: string, admin: boolean}) { 
      setUser({...user, ...newUser})
    }
  
    return (
        <AuthContext.Provider value={{user, updateLoggedUser, signInWithEmail}}>
          {props.children}
        </AuthContext.Provider>
    )
}