import { hash } from "bcryptjs"
import { UserRepository } from "../repositories/UserRepository";
import toPascaCase from "../utils/toPascalCase";

interface IUserRequest {
    nome: string;
    senha: string;
    email: string;
    admin?: boolean;
}

class UserService {
    async criar({ nome, senha, email, admin }: IUserRequest) {        
        if (!nome || !senha || !email)
            throw new Error("Nome, email ou senha não preenchido");
        
        const userRepository = new UserRepository();

        if ((await userRepository.buscarUm({ email })).length > 0)
            throw new Error("Este email já está cadastrado");

        return await userRepository.criar({
            nome: toPascaCase(nome),
            email: email.toLocaleLowerCase(),
            senha: await hash(senha, Number(process.env.SALT)), 
            admin
        })
    }
}

export { UserService }