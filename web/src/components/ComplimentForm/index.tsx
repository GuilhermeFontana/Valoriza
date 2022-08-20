import { FormEvent, useEffect, useState } from 'react';
import Select from 'react-select'
import makeAnimated from 'react-select/animated';
import { toast } from 'react-toastify';
import moment from 'moment';
import { executeCustomToast } from '../../services/toast';
import { useApi } from '../../hooks/useApi';
import { useAuth } from '../../hooks/useAuth';


import "./style.scss"
type TComplimentForm = {
    usuId: number;
    compliment?: {
        id: number,
        mensagem: string,
        remetente: {
            id: number,
            nome: string,
            email: string
        }
        dthr_criacao: string,
        etiquetas: {
            id: number,
            nome: string
        }[]
    };
    handleSendCompliment?: (destinatario_id: number, etiquetas: number[], mensagem: string) => {}
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
        ? props.compliment.etiquetas.map(x => { return { value:x.id.toString(), label: x.nome }})
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

            if (props.handleRemoveCompliment) {

                const toastId = executeCustomToast({ content: (
                    <div className="toast-remove-user">
                        <span>Tem certeza que deseja remover o usuário</span>
                        <div className="yes-or-no">
                            <button 
                                className="yes"
                                onClick={async () => {
                                    toast.dismiss(toastId);
                                    
                                    if (props.handleRemoveCompliment && props.compliment?.id) {
                                        props.handleRemoveCompliment(
                                            props.compliment.id
                                        )
                                }}}
                            >Sim</button>
                            <button 
                                onClick={() => {toast.dismiss(toastId)}} 
                                className="no"
                            >Não</button>
                        </div>
                    </div>
                ) })
            }
                
        }
        else {

            if (props.handleSendCompliment)
                props.handleSendCompliment(
                    props.usuId, 
                    complimentsTags.map(x => Number(x.value)), 
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
            <div className='footer'>
                {props.compliment &&
                    <div className="user-date-infos">
                        <strong>{props.compliment.remetente.nome}</strong>
                        <span>{moment(props.compliment.dthr_criacao).format("DD/MM/YYYY HH:mm:ss")}</span>
                    </div>
                }
                {(user.admin || !props.compliment || ( props.compliment.remetente && props.compliment.remetente.id === user.id )) &&
                    <button type='submit'>{btnTetx}</button>
                }
            </div>
        </form>
    )
}