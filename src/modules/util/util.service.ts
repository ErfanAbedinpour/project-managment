import { hash, genSaltSync, compare } from 'bcrypt';

export class UtilService {
  dayToMilisecond(day: number) {
    return day * 24 * 60 * 60 * 1000 + Date.now();
  }

  generateUniqueCode(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min);
  }
}
