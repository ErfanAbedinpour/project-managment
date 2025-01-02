import { IsNotEmpty, IsString, IsTaxId } from 'class-validator';

export class ContributeParam {
  @IsNotEmpty()
  @IsString()
  username: string;
  @IsNotEmpty()
  @IsString()
  projectName: string;
}
