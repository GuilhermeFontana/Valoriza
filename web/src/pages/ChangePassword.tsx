import { FormEvent, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../hooks/useAuth';

import '../styles/change-password.scss'


export function ChangePassword(){
    const history = useHistory();
    const { changePassword } = useAuth();
    const [ password, setPassword ] = useState("");
    const [ confPassword, setConfPassword ] = useState("");
    const [ enableBtn, setEnableBtn ] = useState(true);


    
    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        setEnableBtn(false);

        if (await changePassword(password, confPassword)) 
            history.push("/login");
        
        setEnableBtn(true);
    }

    return (
        <div className="change-password">
            <form onSubmit={handleSubmit}>
                <h1>Redefinir senha</h1>
                <div className="new-password-form">
                    <input 
                        type="password" 
                        placeholder='Nova senha' 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoFocus
                    />
                    <input 
                        type="password" 
                        placeholder='Confirmação da senha'
                        value={confPassword}
                        required
                        onChange={(e) => setConfPassword(e.target.value)}
                    />
                    <button 
                        type="submit"
                        disabled={!enableBtn}
                    >Redefinir</button>
                </div>
            </form>
            <ToastContainer />
        </div>
    )
}