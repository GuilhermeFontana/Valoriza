import { useEffect, useState } from 'react'
import api from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

import { ComplimentForm } from '../ComplimentForm';

import elogiarImg from '../../assets/images/elogiar.svg';
import verElogiosImg from '../../assets/images/ver-elogios.svg';

import './style.scss'


type TUserType = {
    usu: {
        id: number,
        nome: string,
        email: string
    }
}

type TCompliment = {
    id: number,
    mensagem: string,
    etiqueta: {
        id: number,
        nome: string
    }
}


export function UserItem({usu}: TUserType) {
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
                <header>
                    <strong>{usu.nome}</strong>
                    <span>{usu.email}</span>  
                </header>
                <footer>
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
                </footer>
            </div>
            
            <footer className={`compliment`}>
                <>
                {complimentingVisible &&
                    <ComplimentForm
                        usuId={usu.id}
                        handleSendCompliment={handleSendCompliment}
                    />
                }
                {complimentVisible &&
                    compliments.map((x) => {
                        return <ComplimentForm
                            key={x.id}
                            usuId={usu.id}
                            compliment={x}
                            handleRemoveCompliment={handleRemoveCompliment}
                        />
                    })
                }
                </>
            </footer>
        </li>
    )
}