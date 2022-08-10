import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { UserItem } from "../components/UserItem";


import '../styles/home.scss'
import { TagsModifyForm } from "../components/TagsModifyForm";
import { UserModifyForm } from "../components/UserModifyForm";
import { useApi } from "../hooks/useApi";

type userType = {
    id: number,
    nome: string,
    email: string
}

export function Home() {
    const { user } = useAuth();
    const { getUsers } = useApi();
    const [ users, setUsers ] = useState<userType[]>([]);
    const [ crateUserOrTag, setCrateUserOrTag ] = useState(0);
    const [ userEditId, setUserEdit ] = useState(0);

    useEffect(() => {
        handleGetDevs();
            
        // eslint-disable-next-line
    }, [user])
            
    
    async function handleGetDevs() {
        if (!user)
            return;

        const newUsers = await getUsers();
          
        if (newUsers && newUsers.length > 0)
            setUsers(newUsers);
            
    }

    function handleEditDev(usuId: number) {
        setUserEdit(usuId);
        setCrateUserOrTag(2);
    }


    return (
        <div id="home">
            <nav>
                <div className="user-name">
                    <strong>{user.nome}</strong>
                </div>
                {user.admin && 
                <>
                    <div className="actions">
                    {!userEditId && <button 
                            type="button" 
                            onClick={() => setCrateUserOrTag(2)}
                        >
                            Cadastrar Usuário
                        </button>}
                        <button 
                            type="button" 
                            onClick={() => {
                                setCrateUserOrTag(1)
                                setUserEdit(0);
                            }}
                        >
                            Etiquetas
                        </button>
                    </div>
                </>}
            </nav>
            <div className="body">
                {crateUserOrTag !== 0 &&
                    <aside>
                        {crateUserOrTag === 1 
                        ? <div className="tag-create-form">
                            <TagsModifyForm 
                                handleCancel={() => setCrateUserOrTag(0)}
                            />
                        </div>
                        : <div className="user-create-form">
                            <UserModifyForm 
                                handleCancel={() => {
                                    setCrateUserOrTag(0)
                                    setUserEdit(0);
                                }}
                                userId={userEditId}
                            />
                        </div>}
                    </aside>
                }
                <main>
                    <div className="list">
                        <ul>
                            {users.map(usu => (
                                <UserItem 
                                    key={usu.id}
                                    currentUser={{...usu}}
                                    setUserEdit={handleEditDev}
                                />
                            ))}
                        </ul>
                    </div>
                </main>
            </div>
        </div>
    )
}