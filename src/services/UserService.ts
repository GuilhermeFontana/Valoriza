import { UserRepository } from "../repositories/UserRepository";

interface IUserRequest {
    nome: string;
    email: string;
    admin?: boolean;
}

class UserService {
    async criar({ nome, email, admin }: IUserRequest) {
        if (!nome || !email)
            throw new Error("Nome ou email não preenchido");
        
        const userRepository = new UserRepository();

        if ((await userRepository.buscarUm({ email })).rowCount > 0)
            throw new Error("Este email já está cadastrado");

        return await userRepository.criar({
            nome,
            email,
            admin
        })
    }
}

export { UserService }