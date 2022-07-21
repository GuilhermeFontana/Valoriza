import { hash } from "bcryptjs"
import { UserRepository } from "../repositories/UserRepository";
import toPascaCase from "../utils/toPascalCase";

interface IUserInsert {
    nome: string;
    senha: string;
    email: string;
    admin?: boolean;
}
interface IUserFindUpdate {
    nome?: string;
    senha?: string;
    email?: string;
    admin?: boolean;
}

const repository = new UserRepository();

class UserService {
    async criar({ nome, senha, email, admin }: IUserInsert) {        
        if (!nome || !senha || !email)
            throw new Error("Nome, email ou senha não preenchido");
        

        if ((await repository.buscarUm({ email })))
            throw new Error("Este email já está cadastrado");

        return await repository.criar({
            nome: toPascaCase(nome),
            email: email.toLocaleLowerCase(),
            senha: await hash(senha, Number(process.env.SALT)), 
            admin
        })
    }

    async buscar({ nome, email, admin }: IUserFindUpdate) {
        return await repository.buscar({
            nome,
            email,
            admin
        })
    }

    async buscarPorID(id: number) {
        if (!id)
            throw new Error("ID não informado");

        return await repository.buscarPorID(id);
    }
}

export { UserService }