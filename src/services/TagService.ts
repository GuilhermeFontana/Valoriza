import { TagRepository } from "../repositories/TagRepository";
import toPascaCase from "../utils/toPascalCase";

interface ITagInsert {
    nome: string;
}

interface ITagFIndUPdate {
    nome: string;
}


const repository = new TagRepository();

class TagService {
    async criar({ nome }: ITagInsert) {
        if (!nome)
            throw new Error("Nome não preenchido");
        
        if (await repository.buscarUm({ nome }))
            throw new Error("Esta etiqueta já está cadastrado");

        return await repository.criar({ nome: toPascaCase(nome) });
    }

    async buscar({ nome }: ITagFIndUPdate) {
        return await repository.buscar({ nome: nome });
    }

    async buscarPorID(id: number) {
        if (!id)
            throw new Error("ID não informado");

        return await repository.buscarPorID(id);
    }

    async editar(id: number, { nome }: ITagFIndUPdate) {
        if (!id)
            throw new Error("ID não informado");

        const _nome = nome ? toPascaCase(nome) : nome;
        
        const etiqueta = await repository.editar(id, { nome: _nome });

        if (!etiqueta)
            throw new Error("Nenhuma etiqueta encontrada")

        return etiqueta;
    }
}

export { TagService }