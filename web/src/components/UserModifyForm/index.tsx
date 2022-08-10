import { useEffect, useState } from "react"
import { useAuth } from "../../hooks/useAuth";
import api from "../../services/api";
import "./style.scss"

type UserModifyFormProps = {
    userId?: number,
    handleCancel: () => void
}

export function UserModifyForm(props: UserModifyFormProps) {
    const { user } = useAuth();

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confSenha, setConfSenha] = useState("");
    const [admin, setAdmin] = useState(false);

    useEffect(() => {
        if (props.userId !== 0) {
            api.get(`/users/search/${props.userId}`,  
            {
                headers: {
                    Authorization: user.token
                }            
            }).then(res => {
                setNome(res.data.nome);
                setEmail(res.data.email);
                setAdmin(res.data.admin);
            })
        }            
    })

    return (
        <div className="user-modify">
            <h2>Novo Usuário</h2>
            <form>
                <input 
                    type="text" 
                    placeholder="Nome Completo"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                />
                <input 
                    type="email" 
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                {!props.userId && <>
                    <input 
                        type="password" 
                        placeholder="Senha"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                    />
                    <input 
                        type="password" 
                        placeholder="Confirmação da Senha"
                        value={confSenha}
                        onChange={(e) => setConfSenha(e.target.value)}
                    />
                </>}
                <div className="admin-checkbox">
                    <input 
                        type="checkbox"
                        checked={admin}
                        onChange={(e) => console.log(e)}
                    />
                    <label>Administrador</label>
                </div>
                <button type="submit">Salvar</button>
                <span onClick={props.handleCancel} >Cancelar</span>
            </form>
        </div>
    )
}