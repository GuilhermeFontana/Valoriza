import { FormEvent, useEffect, useState } from 'react';
import Select from 'react-select'
import makeAnimated from 'react-select/animated';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

import "./style.scss"

type TComplimentForm = {
    usuId: number;
    compliment?: {
        id: number,
        mensagem: string,
        etiqueta: {
            id: number,
            nome: string
        }
    };
    handleSendCompliment?: (destinatario_id: number, etiqueta_id: number, etiqueta_nome: string, mensagem: string) => {}
    handleRemoveCompliment?: (compliment_id: number) => {}
}

type TTag = {
    id: number,
    nome: string
}

type TSelect = {
    value: string,
    label: string
}

export function ComplimentForm(props: TComplimentForm) {
    const { user } = useAuth();
    const [ tags, setTags ] = useState([])
    const [ message, setMessage ] = useState(props.compliment?.mensagem || "");
    const [ complimentsTags, setComplimentsTags ] = useState<TSelect[]>(props.compliment
        ? [{value: props.compliment.etiqueta.id.toString(), label:props.compliment.etiqueta.nome }]
        : []
    );

    const btnTetx = !props.compliment ? "Elogiar" : "Excluir"

    useEffect(() => {
        if (!props.compliment)
            api.post("/tags/search", null, {
                headers: {
                    Authorization: user.token
                }
            })
            .then(res => setTags(
                res.data.map((x: TTag) => {
                    return { value: x.id, label: `#${x.nome}` }
                })
            ))
        
        // eslint-disable-next-line
    }, [])
    
    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        
        
        if (props.compliment?.id) {

            if (props.handleRemoveCompliment) 
                props.handleRemoveCompliment(
                    props.compliment.id
                )
        }
        else {
            if (props.handleSendCompliment)
                props.handleSendCompliment(
                    props.usuId, 
                    Number(complimentsTags[0].value), 
                    complimentsTags[0].label,
                    message
                )
        }
    }


    return (
        <form 
            className="form"
            onSubmit={handleSubmit}
        >
            <textarea
                placeholder="Elogie..."
                value={message}
                readOnly={!!props.compliment}
                onChange={(e) => setMessage(e.target.value)}
            />
            <div 
                className='actions'>
                {!props.compliment ?
                    <Select
                        className='select' 
                        isMulti 
                        components={makeAnimated()}
                        closeMenuOnSelect={false}
                        options={tags}
                        value={complimentsTags}
                        onChange={(e: any) => setComplimentsTags(e)}
                    />
                    :
                    <Select
                        className='select' 
                        isMulti 
                        isDisabled
                        value={complimentsTags} 
                    />
                }
                {(user.admin || !props.compliment) &&
                    <button type='submit'>{btnTetx}</button>
                }
            </div>
        </form>
    )
}