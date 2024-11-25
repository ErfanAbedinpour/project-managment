export abstract class HashingService {
  abstract hash(passwrod: string | Buffer): Promise<string>;

  abstract compare(password: string, hash: string): Promise<boolean>;
}
