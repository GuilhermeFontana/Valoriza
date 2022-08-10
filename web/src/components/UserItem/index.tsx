import { useEffect, useState } from 'react'
import api from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

import { ComplimentForm } from '../ComplimentForm';

import removeUserImg from '../../assets/images/remove-user.svg';
import editUserImg from '../../assets/images/edit-user.svg';
import elogiarImg from '../../assets/images/elogiar.svg';
import verElogiosImg from '../../assets/images/ver-elogios.svg';

import './style.scss'


type TUserType = {
    id: number,
    nome: string,
    email: string
}

type TCompliment = {
    id: number,
    mensagem: string,
    etiqueta: {
        id: number,
        nome: string
    }
}

type UserItemProps = {
    usu: TUserType,
    setUserEdit: (userId: number) => void
}

export function UserItem({usu, setUserEdit}: UserItemProps) {
    const { user } = useAuth();
    const [ compliments, setCompliments ] = useState<TCompliment[]>([])
    const [ complimentVisible, setcomplimentVisible ] = useState(false);
    const [ complimentingVisible, setComplimentingVisible ] = useState(false);


    useEffect(() => {
        if (complimentVisible){
            api.post(`/compliment/received/${usu.id}`, null, {
                headers: {
                    Authorization: user.token
                }
            })
            .then(res => 
                setCompliments(res.data)
            )
            
        }
        
        // eslint-disable-next-line
    }, [complimentVisible])


    async function handleSendCompliment(destinatario_id: number, etiqueta_id: number, etiqueta_nome: string, mensagem: string) {
        await api.post("/compliment/send", 
            {
                destinatario_id,
                etiqueta_id,
                mensagem
            },
            {
            headers: {
                Authorization: user.token
            }            
        })
        .then(res => {
            res.data.etiqueta = {
                id: etiqueta_id,
                nome: etiqueta_nome
            };
            
            setCompliments([ ...compliments, res.data]);
            setComplimentingVisible(false);
        })
    }

    async function handleRemoveCompliment(compliment_id: number) {
        await api.delete(`/compliment/remove/${compliment_id}`,  
        {
            headers: {
                Authorization: user.token
            }            
        })
        .then(res => {            
            setCompliments(compliments.filter(x => x.id !== compliment_id));
        })
    }


    return (
        <li className='user'>
            <div className='data'>
                <div className='user-infos'>
                    <strong>{usu.nome}</strong>
                    <span>{usu.email}</span>  
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
                    {user.id !== usu.id &&
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
                                    setUserEdit(usu.id)
                                    window.scroll(0,0);
                                }}
                            />
                        </button>
                        <button
                            type="button"
                        >
                            <img src={removeUserImg} alt="Remover usuário"/>
                        </button>
                    </>}
                </div>
            </div>
            
            <footer className={`compliments`}>
                <>
                {complimentingVisible &&
                    <ComplimentForm
                        usuId={usu.id}
                        handleSendCompliment={handleSendCompliment}
                    />
                }
                {complimentVisible &&
                    (compliments.length > 0 
                        ? compliments.map((x) => {
                            return <ComplimentForm
                                key={x.id}
                                usuId={usu.id}
                                compliment={x}
                                handleRemoveCompliment={handleRemoveCompliment}
                            />
                        })
                        :<div className="no-compliments">
                            <strong>Este usuário ainda não foi elogiado :,( </strong>
                        </div>
                    )}
                </>
            </footer>
        </li>
    )
}