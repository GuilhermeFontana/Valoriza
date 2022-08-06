import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { UserItem } from "../components/UserItem";

import api from "../services/api"

import '../styles/home.scss'

type userType = {
    id: number,
    nome: string,
    email: string
}

export function Home() {
    const { user } = useAuth();
    const [ users, setUsers ] = useState<userType[]>([]);

    useEffect(() => {
        handleGetDevs();
            
        // eslint-disable-next-line
    }, [user])
            
    
    async function handleGetDevs() {
        if (!user)
            return;

        await api.post<userType[]>("/users/search", null, {
            headers: {
                Authorization: user.token
            }
        })
            .then(res => setUsers(res.data));
            
    }


    return (
        <div className="home">
            <ul>
                {users.map(usu => (
                    <UserItem 
                        key={usu.id}
                        usu={usu}
                    />
                ))}
            </ul>
        </div>
    )
}