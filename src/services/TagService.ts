import { TagRepository } from "../repositories/TagRepository";
import toPascaCase from "../utils/toPascalCase";

interface ITagRequest {
    nome: string;
}

const repository = new TagRepository();

class TagService {
    async criar({ nome }: ITagRequest) {
        if (!nome)
            throw new Error("Nome não preenchido");
        
        
        if ((await repository.buscarUm({ nome })).length > 0)
            throw new Error("Esta etiqueta já está cadastrado");

        return await repository.criar({ nome: toPascaCase(nome) });
    }

    async buscarPorID(id: number) {
        if (!id)
            throw new Error("ID não informado");

        return await repository.buscarPorID(id);
    }
}

export { TagService }