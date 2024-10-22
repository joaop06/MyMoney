import { UserEntity as Entity } from "../user.entity";
import { CreateUserDto } from "../dtos/create-user.dto";
import { UpdateUserDto } from "../dtos/update-user.dto";
import { UserReturnDto } from "../dtos/user-return.dto";
import { ChangePasswordDto } from "../dtos/change-password.dto";
import { ServiceInterface } from "interfaces/service.interface";

export interface UsersServiceInterface extends ServiceInterface<
    Entity,
    CreateUserDto,
    UserReturnDto
> {
    removePassword(user: Entity): Partial<Entity>

    findOneByEmail(email: string): Promise<Entity>

    changePassword(object: ChangePasswordDto): Promise<any>

    update(id: number, object: UpdateUserDto): Promise<any>
}