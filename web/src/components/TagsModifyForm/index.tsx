import Select from 'react-select'
import makeAnimated from 'react-select/animated';
import { useEffect, useState } from "react"
import { useApi } from '../../hooks/useApi';

import "./style.scss"

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
    const { getTags } = useApi();
    const [selectedTab, setSelectedTab] = useState(0)
    const [ tags, setTags ] = useState<TSelect[]>([])
    const [ complimentsTags, setComplimentsTags ] = useState<TSelect[]>()

    useEffect(() => {
        async function executeGetTags() {
            const newTags = await getTags();
    
            if (newTags && newTags.length > 0)
                setTags(
                    newTags.map((tag: TTag) => {
                        return { value: tag.id.toString(), label: `#${tag.nome}` }
                    })
                )
        }

        executeGetTags();
        
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