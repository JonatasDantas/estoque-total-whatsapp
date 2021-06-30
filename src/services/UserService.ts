import { getRepository, Repository } from "typeorm";
import { User } from "../models";

class UserService {
    private userRepository: Repository<User>;

    constructor() {
        this.userRepository = getRepository(User);
    }

    public async retrieveUser(userId): Promise<User> {
        return await this.userRepository.findOne({ where: { id: userId } });
    }
}

export { UserService };