import Select from 'react-select'
import makeAnimated from 'react-select/animated';
import { FormEvent, useEffect, useState } from "react"
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
    const { getTags, createTag, removeTag } = useApi();
    const [selectedTab, setSelectedTab] = useState(0);
    const [ description, setDescription ] = useState("");
    const [ tags, setTags ] = useState<TSelect[]>([]);
    const [ selectedTags, setSelectedTags ] = useState<TSelect[]>();

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

    
    async function handleCreateTag() {
        const newTag = await createTag(description);

        if (newTag) {
            setTags([...tags, { value: newTag.id.toString(), label: `#${newTag.nome}` }].sort((a, b) => (a.label > b.label) ? 1 : ((b.label > a.label) ? -1 : 0)))
        }
    }

    async function handleRemoveTag() {
        if (selectedTags && selectedTags.length > 0) {
            await removeTag(Number(selectedTags[0].value));

            setTags(tags.filter(tag => tag.value !== selectedTags[0].value));
        }

    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();

        if (selectedTab === 0) {
            await handleCreateTag()   
            setDescription("");
        }
        else {
            await handleRemoveTag();
            setSelectedTags([]);
        }
    }

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
                    <form onSubmit={handleSubmit}>
                        {selectedTab === 0
                            ? <input 
                                className='input' 
                                type="text" 
                                placeholder="Descrição da etiqueta"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                            :<Select
                                isMulti 
                                components={makeAnimated()}
                                closeMenuOnSelect={false}
                                options={tags}
                                value={selectedTags}
                                onChange={(e: any) => setSelectedTags(e)}
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