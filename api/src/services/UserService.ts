import { hash } from "bcryptjs"
import { UserRepository } from "../repositories/UserRepository";
import toPascaCase from "../utils/toPascalCase";
import { AuthenticateService } from "./AuthenticateService";

interface IUserInsert {
    nome: string;
    senha: string;
    confSenha: string;
    email: string;
    admin?: boolean;
}
interface IUserFindUpdate {
    nome?: string;
    email?: string;
    admin?: boolean;
}

const repository = new UserRepository();

class UserService {
    async criar({ nome, senha, confSenha, email, admin }: IUserInsert) {        
        if (!nome || !senha || !confSenha || !email)
            throw new Error("Nome, email ou senha não preenchido");
        
        if (senha !== confSenha)
            throw new Error("As senhas não correspondem")

        if ((await repository.buscarUm({ email })))
            throw new Error("Este email já está cadastrado");

        const user = await repository.criar({
            nome: toPascaCase(nome),
            email: email.toLocaleLowerCase(),
            senha: await hash(senha, Number(process.env.SALT)), 
            admin
        });

        const authService = new AuthenticateService();

        return {
            ...user,
            token: (await (authService.executar({ email, senha }))).token
        }
    }

    async buscar({ nome, email, admin }: IUserFindUpdate) {
        return await repository.buscar({
            nome,
            email,
            admin
        });
    }

    async buscarPorID(id: number) {
        if (!id)
            throw new Error("ID não informado");

        return await repository.buscarPorID(id);
    }

    async editar(id: number, { nome, email, admin }: IUserFindUpdate) {
        if (!id)
            throw new Error("ID não informado");

        const user = await repository.buscarUm({ email });
        if (email && user && Number(user.id) !== id) 
            throw new Error("Este email já esta sendo usado por outro usuário");

        const _nome = nome ? toPascaCase(nome) : nome;
        const _email = email ? email.toLocaleLowerCase() : email;

        const usuario = await repository.editar(id, {
            nome: _nome,
            email: _email,
            admin
        });

        if (!usuario) 
            throw new Error("Usuário não encontrado");

        return usuario;
    }

    async remover(id: number) {
        if (!id)
            throw new Error("ID não informado");

        if (await repository.remover(id) === 0)
            throw new Error("Usuário não encontrado");
    }

    async buscarUsuariosComEtiqueta(etiqueta_id: number) {
        if (!etiqueta_id)
            throw new Error("Etiqueta não informada");

        return await repository.buscarUsuariosComEtiqueta(etiqueta_id);
    }
}

export { UserService }