import { UserEntity } from "../user.entity";
import { CreateUserDto } from "../dtos/create-user.dto";
import { UpdateUserDto } from "../dtos/update-user.dto";
import { UserReturnDto } from "../dtos/user-return.dto";
import { ChangePasswordDto } from "../dtos/change-password.dto";
import { ControllerInterface } from "interfaces/controller.interface";

export interface UsersControllerInterface extends ControllerInterface<
    UserEntity,
    CreateUserDto,
    UserReturnDto
> {
    changePassword(object: ChangePasswordDto): Promise<any>

    update(id: string, object: Partial<UpdateUserDto>): Promise<any>
}