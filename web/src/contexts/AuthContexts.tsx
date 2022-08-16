import { useState, createContext, ReactNode, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { getCookies, setCookies } from '../services/cookies'
import { endPromiseToast, startPromiseToast } from '../services/toast'
import api from '../services/api'
import outputCatch from "../services/outputCatch"


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
    forgotPassword: (email: string) => Promise<void>
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
          throw new Error("Algumas informações não foram encontradas")        

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

    async function forgotPassword(email: string) {
      const toastId = startPromiseToast("Enviando email")

      await api.post("/forgot-password" , {
          email
        }, 
        {
          headers: {
              Authorization: user.token
          }
      }) 
      .then(() => {
        endPromiseToast(toastId, "Verifique sua caixa de entrada que te enviamos um email com as informações para redefinir sua senha, se não encontrar certifique-se que digitou o email corretamente", { type: "success", time: 10000 });
      })
      .catch(res => {                
          outputCatch(res.response, "Ocorreu um erro ao te enviar o email", toastId);
      })
    }
  
    return (
        <AuthContext.Provider value={{user, updateLoggedUser, signInWithEmail, forgotPassword}}>
          {props.children}
        </AuthContext.Provider>
    )
}