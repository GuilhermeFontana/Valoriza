import { createContext, ReactNode } from 'react'
import { useAuth } from '../hooks/useAuth'
import api from '../services/api'


type ApiContextProviderProps = {
    children?: ReactNode
}

type ApiContextType = {
    getUsers: () => Promise<userType[]>
    getTags: () => Promise<tagType[]>
    getCompliments: (currentUser: userType) => Promise<TCompliment[]>
    createCompliment: (destinatario_id: number, etiqueta_id: number, mensagem: string) => Promise<TCompliment>
    removeCompliment(compliment_id: number): void 
}

type userType = {
    id: number,
    nome: string,
    email: string
}
type tagType = {
    id: number,
    nome: string
}
type TCompliment = {
    id: number,
    mensagem: string,
    etiqueta: tagType
}

export const ApiContext = createContext({} as ApiContextType);

export function ApiContextProvider(props: ApiContextProviderProps) {
    const { user } = useAuth();

    //#region User

    async function getUsers(): Promise<userType[]> {
        if (!user)
            return [];

        return await api.post<userType[]>("/users/search", null, {
            headers: {
                Authorization: user.token
            }
        })
            .then(res => res.data);
    }

    //#endregion
    
    //#region Tag

    async function getTags(): Promise<tagType[]> {
        return await api.post("/tags/search", null, {
            headers: {
                Authorization: user.token
            }
        })
        .then(res => res.data)
    }
    
    //#endregion

    //#region Compliment
        
        async function getCompliments(currentUser: userType): Promise<TCompliment[]> {
            return await api.post(`/compliment/received/${currentUser.id}`, null, {
                headers: {
                    Authorization: user.token
                }
            })
            .then(res => res.data)
        }

        async function createCompliment(destinatario_id: number, etiqueta_id: number, mensagem: string): Promise<TCompliment> {
            return await api.post("/compliment/send", 
                {
                    destinatario_id,
                    etiqueta_id,
                    mensagem
                },
                {
                headers: {
                    Authorization: user.token
                }            
            })
            .then(res => {
                res.data.etiqueta = res.data.etiqueta_id;

                return res.data;
            })
        }

        async function removeCompliment(compliment_id: number) {
            await api.delete(`/compliment/remove/${compliment_id}`,  
            {
                headers: {
                    Authorization: user.token
                }            
            })
        }

    //#endregion
    
    return (
        <ApiContext.Provider value={{
            getUsers, 
            getTags, 
            getCompliments, 
            createCompliment,
            removeCompliment
        }}>
            {props.children}
        </ApiContext.Provider>
    )
}