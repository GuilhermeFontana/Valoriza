import { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth';

import { ComplimentForm } from '../ComplimentForm';

import removeUserImg from '../../assets/images/remove-user.svg';
import editUserImg from '../../assets/images/edit-user.svg';
import elogiarImg from '../../assets/images/elogiar.svg';
import verElogiosImg from '../../assets/images/ver-elogios.svg';

import './style.scss'
import { useApi } from '../../hooks/useApi';


type TUserType = {
    id: number,
    nome: string,
    email: string
}

type TCompliment = {
    id: number,
    mensagem: string,
    remetente: TUserType,
    dthr_criacao: string,
    etiquetas: {
        id: number,
        nome: string
    }[]
}

type UserItemProps = {
    currentUser: TUserType,
    setUserEdit: (userId: number) => void
    removeUser: (user_id: number) => void
}

export function UserItem({currentUser, setUserEdit, removeUser}: UserItemProps) {
    const { user } = useAuth();
    const { getCompliments, createCompliment, removeCompliment } = useApi();
    const [ compliments, setCompliments ] = useState<TCompliment[]>([])
    const [ complimentVisible, setcomplimentVisible ] = useState(false);
    const [ complimentingVisible, setComplimentingVisible ] = useState(false);


    useEffect(() => {
        async function execute() {
            if (complimentVisible){
                const newCompliments = await getCompliments(currentUser)

                if (newCompliments && newCompliments.length > 0)
                    setCompliments(newCompliments)
            }
        }

        execute();
        
        // eslint-disable-next-line
    }, [complimentVisible])


    async function handleSendCompliment(destinatario_id: number, etiquetas: number[], mensagem: string) {
        const newCompliment = await createCompliment(destinatario_id, etiquetas, mensagem);
        
        if (newCompliment) {            
            setCompliments([ newCompliment, ...compliments]);
            setComplimentingVisible(false);
        }
    }

    async function handleRemoveCompliment(compliment_id: number) {
        if (await removeCompliment(compliment_id))
            setCompliments(compliments.filter(x => x.id !== compliment_id));  
    }


    return (
        <li className='user'>
            <div className='data'>
                <div className='user-infos'>
                    <strong>{currentUser.nome}</strong>
                    <span>{currentUser.email}</span>  
                </div>
                <div className='actions'>
                    <button
                        type="button"
                    >
                        <img 
                            src={verElogiosImg} 
                            alt="Ver elogios do usuário"
                            onClick={() => { setcomplimentVisible(!complimentVisible) }}
                        />
                    </button>
                    {user.id !== currentUser.id &&
                    <button
                        type="button"
                    >
                        <img 
                            src={elogiarImg} 
                            alt="Elogiar usuário"
                            onClick={() => { setComplimentingVisible(!complimentingVisible) }}

                        />
                    </button>
                    }
                    {user.admin && <>
                        <button
                            type="button"
                        >
                            <img 
                                src={editUserImg} 
                                alt="Editar usuário"
                                onClick={() => {
                                    setUserEdit(currentUser.id)
                                    window.scroll(0,0);
                                }}
                            />
                        </button>
                        {user.id !== currentUser.id &&
                        <button
                            type="button"
                        >
                            <img 
                                src={removeUserImg} 
                                alt="Remover usuário"
                                onClick={() => removeUser(currentUser.id)}
                            />
                        </button>}
                    </>}
                </div>
            </div>
            
            <footer className={`compliments`}>
                <>
                {complimentingVisible &&
                    <ComplimentForm
                        usuId={currentUser.id}
                        handleSendCompliment={handleSendCompliment}
                    />
                }
                {complimentVisible &&
                    (compliments.length > 0 
                        ? compliments.map((x) => {
                            return <ComplimentForm
                                key={x.id}
                                usuId={currentUser.id}
                                compliment={x}
                                handleRemoveCompliment={handleRemoveCompliment}
                            />
                        })
                        :<div className="no-compliments">
                            <strong>
                                Este usuário ainda não foi elogiado 😢
                            </strong>
                        </div>
                    )}
                </>
            </footer>
        </li>
    )
}