import { IsNotEmpty, IsMongoId } from 'class-validator';

export class ChangeSuperAdminDto {
    @IsMongoId()
    @IsNotEmpty()
    newSuperAdminId: string;
}
