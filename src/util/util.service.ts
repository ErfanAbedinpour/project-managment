import {hash,genSaltSync,compare} from 'bcrypt';

export class UtilService{
    private readonly SALT_LEN=12;
    hash(password:string):Promise<string>{
        try{
            const salt = genSaltSync(this.SALT_LEN);
            return hash(password,salt);
        }catch(err){
            throw err;
        }
    }

    verify(password:string,hash:string):Promise<boolean>{
        return compare(password,hash);
    }

}