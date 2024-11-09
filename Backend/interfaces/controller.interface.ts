import { FindOptionsDto, FindReturnModelDto } from "dtos/find.dto";

export interface ControllerInterface<Entity, CreateDto, EntityReturnDto = Entity> {
    delete?(id: string): Promise<any>

    findOne(id: string): Promise<EntityReturnDto>

    create(object: CreateDto): Promise<EntityReturnDto>

    update(id: string, object: Partial<Entity>): Promise<any>

    findAll?(options: FindOptionsDto<Entity>): Promise<FindReturnModelDto<EntityReturnDto>>
}