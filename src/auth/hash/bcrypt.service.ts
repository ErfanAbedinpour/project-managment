import { HashingService } from "./hash.service";
import { hash, compare, genSalt } from 'bcrypt';

export class BcryptHashing implements HashingService {
    private SALT_LEN = 12
    async hash(passwrod: string | Buffer): Promise<string> {
        const salt = await genSalt(this.SALT_LEN);
        return hash(passwrod, salt);
    }

    compare(password: string, hash: string): Promise<boolean> {
        return compare(password, hash);
    }
}