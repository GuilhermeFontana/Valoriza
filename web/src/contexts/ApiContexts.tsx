import { createContext, ReactNode } from 'react'
import { useAuth } from '../hooks/useAuth'
import api from '../services/api'
import toast from "../services/toast"
import outputCatch from "../services/outputCatch"

type ApiContextProviderProps = {
    children?: ReactNode
}

type ApiContextType = {
    getUsers: () => Promise<userType[]>
    createUser: (name: string, email: string, password: string, confPassword: string, admin: boolean) => Promise<userType>
    updateUser: (userId: number, name: string, email: string, admin: boolean) => Promise<userType>
    removeUser (userId: number): Promise<boolean>
    getTags: () => Promise<tagType[]>
    createTag: (nome: string) => Promise<tagType>
    removeTag (tagId: number): Promise<boolean>
    getCompliments: (currentUser: userType) => Promise<complimentType[]>
    createCompliment: (destinatario_id: number, etiqueta_id: number, mensagem: string) => Promise<complimentType>
    removeCompliment(compliment_id: number): Promise<boolean>
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

        return await api.post("/users/search", null, {
            headers: {
                Authorization: user.token
            }
        })
        .then(res => res.data)
        .catch(res => {                
            outputCatch(res.response, "Ocorreu um erro ao buscar o usuario", "none");
            return undefined;
        });
    }

    async function createUser(name: string, email: string, password: string, confPassword: string, admin: boolean): Promise<userType> {
        return await api.post("/users/create", 
            {
                nome: name,
                email,
                senha: password,
                confSenha: confPassword,
                admin
            }, 
            {
                headers: {
                    Authorization: user.token
                }
            }
        )
        .then(res => {
            toast("success", "Usuário cadastrado")
            return res.data
        })
        .catch(res => {
            outputCatch(res.response, "Ocorreu um erro ao cadastrar o usuário");
        })
    }

    async function updateUser(userId: number, name: string, email: string, admin: boolean): Promise<userType> {
        
        return await api.put(`/users/update/${userId}`,
            {
                nome: name,
                email,
                admin
            },
            {
                headers: {
                    Authorization: user.token
                } 
            }
        )
        .then(res => {
            toast("success", "Usuário atualizado")
            return res.data
        })
        .catch(res => {
            outputCatch(res.response, "Ocorreu um erro ao atualizar o usuário");
            return undefined;
        })
    }

    async function removeUser(userId: number): Promise<boolean> {
        if (!user)
            return false;

        return await api.delete(`/users/remove/${userId}`,  
        {
            headers: {
                Authorization: user.token
            }            
        })
        .then(() => {
            toast("success", "Usuário removido");
            return true
        })
        .catch(res => {                
            outputCatch(res.response, "Ocorreu um erro ao remover o usuário");
            return false;
        })
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
        .catch(res => {                
            outputCatch(res.response, "Ocorreu um erro ao buscar as etiquetas");
            return false;
        })
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
        .catch(res => {                
            outputCatch(res.response, "Ocorreu um erro ao criar a etiqueta");
            return false;
        })
    }
    
    async function removeTag(tagId: number): Promise<boolean> {
        return await api.delete(`/tags/remove/${tagId}`,  
            {
                headers: {
                    Authorization: user.token
                }            
            })
            .then(() => {
                    toast("success", "Etiqueta removida");
                    return true;
            })
            .catch(res => {                
                outputCatch(res.response, "Ocorreu um erro ao remover a etiqueta");
                return false;
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
            .catch(res => {                
                outputCatch(res.response, "Ocorreu um erro ao buscar os elogios");
                return false;
            })
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
            .catch(res => {                
                outputCatch(res.response, "Ocorreu um erro ao elogia-lo");
                return false;
            })
        }

        async function removeCompliment(compliment_id: number): Promise<boolean> {
            return await api.delete(`/compliment/remove/${compliment_id}`,  
            {
                headers: {
                    Authorization: user.token
                }            
            })
            .then(() => {
                toast("success", "Elogio removido");
                return true;
            })
            .catch(res => {                
                outputCatch(res.response, "Ocorreu um erro ao remover o elogio");
                return false;
            })
        }

    //#endregion
    
    return (
        <ApiContext.Provider value={{
            getUsers,
            createUser,
            updateUser,
            removeUser,
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