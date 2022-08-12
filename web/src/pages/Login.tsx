import { FormEvent, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth } from "../hooks/useAuth"
import outputCatch from "../services/outputCatch";
import '../styles/login.scss'


export function Login(){
    const history = useHistory();
    const { signInWithEmail } = useAuth();
    const [ email, setEmail ] = useState("admin@email.com");
    const [ senha, setSenha ] = useState("admin");
    const [ enableBtn, setEnableBtn ] = useState(true);


    
    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        setEnableBtn(false)

        await signInWithEmail({
            email,
            senha
        })
        .then(() => {
            history.push("/home");
        });

    }

    return (
        <div className="login-form">
            <form onSubmit={handleSubmit}>
                <h1>Login</h1>
                <input 
                    type="email" 
                    placeholder='Digite seu email' 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoFocus
                />
                <input 
                    type="password" 
                    placeholder='Digite sua senha'
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                />
                <button 
                    type="submit"
                    disabled={!enableBtn}
                >Enviar</button>
            </form>
        </div>
    )
}