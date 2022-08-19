import { useEffect, useState } from "react";
import { toast, ToastContainer } from 'react-toastify';
import { executeCustomToast } from "../services/toast";
import { useAuth } from "../hooks/useAuth";
import { useApi } from "../hooks/useApi";
import { UserItem } from "../components/UserItem";
import { TagsModifyForm } from "../components/TagsModifyForm";
import { UserModifyForm } from "../components/UserModifyForm";

import '../styles/home.scss'

type userType = {
    id: number,
    nome: string,
    email: string
}

export function Home() {
    const { user } = useAuth();
    const { getUsers, removeUser } = useApi();
    const [ users, setUsers ] = useState<userType[]>([]);
    const [ crateUserOrTag, setCrateUserOrTag ] = useState(0);
    const [ userEditId, setUserEdit ] = useState(0);

    useEffect(() => {
        handleGetUsers();
            
        // eslint-disable-next-line
    }, [user])
            
    
    async function handleGetUsers() {
        if (!user)
            return;

        const newUsers = await getUsers();
          
        if (newUsers && newUsers.length > 0)
            setUsers(newUsers);
            
    }

    function handleSetEditUser(usuId: number) {
        setUserEdit(usuId);
        setCrateUserOrTag(2);
    }

    async function handleRemoveUser(userId: number) {
        const toastId = executeCustomToast({ content: (
            <div className="toast-remove-user">
                <span>Tem certeza que deseja remover o usuário</span>
                <div className="yes-or-no">
                    <button 
                        className="yes"
                        onClick={async () => {
                            toast.dismiss(toastId)

                            if (await removeUser(userId))
                                setUsers(users.filter(user => user.id !== userId))
                        }}
                    >Sim
                    </button>
                    <button 
                        onClick={() => {toast.dismiss(toastId)}} 
                        className="no"
                    >Não
                    </button>
                </div>
            </div>
        ) })
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
                {user.admin && crateUserOrTag !== 0 &&
                    <aside>
                        {crateUserOrTag === 1 
                        ? <div className="tag-create-form">
                            <TagsModifyForm 
                                handleCancel={() => setCrateUserOrTag(0)}
                            />
                        </div>
                        : <div className="user-create-form">
                            <UserModifyForm 
                                closeForm={() => {
                                    setCrateUserOrTag(0)
                                    setUserEdit(0);
                                }}
                                userId={userEditId}
                                usersState={{
                                    users,
                                    setUsers
                                }}
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
                                    setUserEdit={handleSetEditUser}
                                    removeUser={handleRemoveUser}
                                />
                            ))}
                        </ul>
                    </div>
                </main>
            </div>
            <ToastContainer />
        </div>
    )
}