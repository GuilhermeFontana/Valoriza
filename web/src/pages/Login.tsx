import '../styles/login.scss'

export function Login(){
    return (
        <div className="login-form">
            <form>
                <h1>Login</h1>
                <input type="email" placeholder='Digite seu email' autoFocus/>
                
                <input type="password" placeholder='Digite sua senha'/>
                
                <button type="submit">Enviar</button>
            </form>
        </div>
    )
}