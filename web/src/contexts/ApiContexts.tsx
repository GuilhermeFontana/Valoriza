import { createContext, ReactNode } from 'react'
import { useAuth } from '../hooks/useAuth'
import api from '../services/api'


type ApiContextProviderProps = {
    children?: ReactNode
}

type ApiContextType = {
    getUsers: () => Promise<userType[]>
    getTags: () => Promise<tagType[]>
    createTag: (nome: string) => Promise<tagType>
    removeTag (tag_id: number): void
    getCompliments: (currentUser: userType) => Promise<complimentType[]>
    createCompliment: (destinatario_id: number, etiqueta_id: number, mensagem: string) => Promise<complimentType>
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
type complimentType = {
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

    async function createTag(nome: string): Promise<tagType> {
        return await api.post("/tags/create", 
            {
                nome
            }, 
            {
            headers: {
                Authorization: user.token
            }
        })
        .then(res => res.data)
    }
    
    async function removeTag(tag_id: number) {
        await api.delete(`/tags/remove/${tag_id}`,  
            {
                headers: {
                    Authorization: user.token
                }            
            })
    }

    //#endregion

    //#region Compliment
        
        async function getCompliments(currentUser: userType): Promise<complimentType[]> {
            return await api.post(`/compliment/received/${currentUser.id}`, null, {
                headers: {
                    Authorization: user.token
                }
            })
            .then(res => res.data)
        }

        async function createCompliment(destinatario_id: number, etiqueta_id: number, mensagem: string): Promise<complimentType> {
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
            createTag,
            removeTag,
            getCompliments, 
            createCompliment,
            removeCompliment
        }}>
            {props.children}
        </ApiContext.Provider>
    )
}