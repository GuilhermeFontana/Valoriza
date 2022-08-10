import { FormEvent, useEffect, useState } from 'react';
import Select from 'react-select'
import makeAnimated from 'react-select/animated';
import { useApi } from '../../hooks/useApi';
import { useAuth } from '../../hooks/useAuth';

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
    handleSendCompliment?: (destinatario_id: number, etiqueta_id: number, mensagem: string) => {}
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
    const { getTags } = useApi();
    const [ tags, setTags ] = useState<TSelect[]>([])
    const [ message, setMessage ] = useState(props.compliment?.mensagem || "");
    const [ complimentsTags, setComplimentsTags ] = useState<TSelect[]>(props.compliment
        ? [{value: props.compliment.etiqueta.id.toString(), label:props.compliment.etiqueta.nome }]
        : []
    );

    const btnTetx = !props.compliment ? "Elogiar" : "Excluir"

    useEffect(() => {
        
        async function executeGetTags() {
            if (!props.compliment) {
                const newTags = await getTags();
    
                if (newTags && newTags.length > 0)
                    setTags(
                        newTags.map((tag: TTag) => {
                            return { value: tag.id.toString(), label: `#${tag.nome}` }
                        })
                    )
                }
        }

        executeGetTags();
        
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
                required
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