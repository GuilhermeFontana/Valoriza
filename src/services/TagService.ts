import { TagRepository } from "../repositories/TagRepository";

interface ITagRequest {
    nome: string;
}

class TagService {
    async criar({ nome }: ITagRequest) {
        if (!nome)
            throw new Error("Nome não preenchido");
        
        const repository = new TagRepository();
        
        if ((await repository.buscaUm({ nome })).length > 0)
            throw new Error("Esta etiqueta já está cadastrado");

        return await repository.criar({ nome });
    }
}

export { TagService }