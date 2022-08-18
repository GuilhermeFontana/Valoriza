import { TagRepository } from "../repositories/TagRepository";
import { UserService } from "./UserService";
import toPascaCase from "../utils/toPascalCase";

interface ITagInsert {
    nome: string;
}

interface ITagFIndUPdate {
    nome: string;
}


const repository = new TagRepository();
const userService = new UserService();

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

    async buscarPorIDs(id: number[]) {
        if (!id || id.length < 1)
            throw new Error("IDs não informados");

        return await repository.buscarPorIDs(id);
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

    async remover(id: number) {
        if (!id)
            throw new Error("ID não informado");

        if ((await userService.buscarUsuariosComEtiqueta(id)).length > 0)
            throw new Error("Não é possível excluir etiquetas em uso")

        if (await repository.remover(id) === 0)
            throw new Error("Usuário não encontrado");
    }
}

export { TagService }