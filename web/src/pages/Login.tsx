import { FormEvent, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'
import { useAuth } from "../hooks/useAuth"
import outputCatch from "../services/outputCatch";
import 'react-toastify/dist/ReactToastify.css';

import '../styles/login.scss'


export function Login(){
    const history = useHistory();
    const { signInWithEmail, forgotPassword } = useAuth();
    const [ email, setEmail ] = useState("");
    const [ senha, setSenha ] = useState("");
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
        })
        .catch(res => {
            outputCatch( res.response, "Ocorreu um erro ao tentar logar você", "", "right")
            setEnableBtn(true);
        });
    }

    return (
        <div className="login">
            <form onSubmit={handleSubmit}>
                <h1>Login</h1>
                <div className="login-form">
                    <input 
                        type="email" 
                        placeholder='Digite seu email' 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoFocus
                    />
                    <input 
                        type="password" 
                        placeholder='Digite sua senha'
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                    />
                    <span onClick={() => forgotPassword(email)}>Esqueceu a senha de novo, né?</span>
                    <button 
                        type="submit"
                        disabled={!enableBtn}
                    >Enviar</button>
                </div>
            </form>
            <ToastContainer />
        </div>
    )
}