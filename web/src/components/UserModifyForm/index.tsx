import { Dispatch, FormEvent, SetStateAction, useEffect, useState } from "react"
import { useApi } from "../../hooks/useApi";
import { useAuth } from "../../hooks/useAuth";
import api from "../../services/api";
import { updateCookies } from "../../services/cookies";
import "./style.scss"

type userType = {
    id: number,
    nome: string,
    email: string
}
type UserModifyFormProps = {
    userId?: number,
    closeForm: () => void,
    usersState: ({users: userType[], setUsers: Dispatch<SetStateAction<userType[]>>})
}

export function UserModifyForm(props: UserModifyFormProps) {
    const { user, updateLoggedUser } = useAuth();
    const { createUser, updateUser } = useApi();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confPassword, setConfPassword] = useState("");
    const [admin, setAdmin] = useState(false);

    useEffect(() => {
        if (props.userId !== 0) {
            api.get(`/users/search/${props.userId}`,  
            {
                headers: {
                    Authorization: user.token
                }            
            }).then(res => {
                setName(res.data.nome);
                setEmail(res.data.email);
                setAdmin(res.data.admin);
            })
        }  
        
        // eslint-disable-next-line
    }, [props.userId])

    function clearForm() { 
        setName("");
        setEmail("");
        setPassword("")
        setConfPassword("");
        setAdmin(false);
    }

    async function handleCreateUser(e: FormEvent) {
        e.preventDefault();
        
        const { users, setUsers } = props.usersState

        const newUser = await createUser(name, email, password, confPassword, admin);

        if (newUser){
            setUsers([...users, newUser]);
            clearForm();
        }
    }

    async function handleUpdateUser(e: FormEvent) {
        e.preventDefault();


        if (props.userId) {
            const { users, setUsers } = props.usersState

            const newUser = await updateUser(props.userId, name, email, admin);

            if (newUser) {
                setUsers(users.map((usu) => {
                    
                    if (usu.id !== props.userId)
                        return usu;

                    return {...usu, ...newUser}
                }));

                clearForm();

                if (user.id === props.userId){
                    updateCookies("user", {nome: name, email, admin})
                    updateLoggedUser({nome: name, email, admin});
                }
            }
        }
    }
    
    return (
        <div className="user-modify">
            <h2>Novo Usuário</h2>
            <form onSubmit={props.userId ? handleUpdateUser : handleCreateUser}>
                <input 
                    type="text" 
                    placeholder="Nome Completo"
                    value={name}
                    required
                    onChange={(e) => setName(e.target.value)}
                />
                <input 
                    type="email" 
                    placeholder="Email"
                    value={email}
                    required
                    onChange={(e) => setEmail(e.target.value)}
                />
                {!props.userId && <>
                    <input 
                        type="password" 
                        placeholder="Senha"
                        value={password}
                        required
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <input 
                        type="password" 
                        placeholder="Confirmação da Senha"
                        value={confPassword}
                        required
                        onChange={(e) => setConfPassword(e.target.value)}
                    />
                </>}
                <div className="admin-checkbox">
                    <input 
                        type="checkbox"
                        checked={admin}
                        onChange={(e) => setAdmin(e.target.checked)}
                    />
                    <label>Administrador</label>
                </div>
                <button type="submit">Salvar</button>
                <span onClick={props.closeForm} >Cancelar</span>
            </form>
        </div>
    )
}