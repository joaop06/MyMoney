import { FindOptionsDto, FindReturnModelDto } from "dtos/find.dto"

export interface ServiceInterface<Entity, CreateDto, EntityReturnDto = Entity> {
    delete(id: number): Promise<any>

    findOne(id: number): Promise<EntityReturnDto>

    create(object: CreateDto): Promise<EntityReturnDto>

    update(id: number, object: Partial<Entity>): Promise<any>

    findAll(options: FindOptionsDto<Entity>): Promise<FindReturnModelDto<EntityReturnDto>>
}