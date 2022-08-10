import Select from 'react-select'
import makeAnimated from 'react-select/animated';
import { useEffect, useState } from "react"
import "./style.scss"
import api from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

type TTag = {
    id: number,
    nome: string
}

type TSelect = {
    value: string,
    label: string
}

type TagsModifyFormProps = {
    handleCancel: () => void
}


export function TagsModifyForm(props: TagsModifyFormProps) {
    const { user } = useAuth();
    const [selectedTab, setSelectedTab] = useState(0)
    const [ tags, setTags ] = useState([])
    const [ complimentsTags, setComplimentsTags ] = useState<TSelect[]>()

    useEffect(() => {
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

    return (
        <div className="tags-modify">
            <ul role="tablist">
                <li className={selectedTab === 0 ? "checked" : ""}  onClick={() => setSelectedTab(0)}>
                    <strong>Cadastrar</strong>
                </li>
                <li className={selectedTab === 1 ? "checked" : ""} onClick={() => setSelectedTab(1)}>
                    <strong>Remover</strong>
                </li>
            </ul>

            <div className="tabs">
                <div className="create-form">
                    <form>
                        {selectedTab === 0
                            ? <input className='input' type="text" placeholder="Descrição da etiqueta"/>
                            :<Select
                                isMulti 
                                components={makeAnimated()}
                                closeMenuOnSelect={false}
                                options={tags}
                                value={complimentsTags}
                                onChange={(e: any) => setComplimentsTags(e)}
                            />
                        }
                        <button className='button' type="submit">{selectedTab === 0 ? "Salvar" : "Remover"}</button>
                        <span onClick={props.handleCancel}>Cancelar</span>
                    </form>
                </div>
            </div>
      </div>
    )
}