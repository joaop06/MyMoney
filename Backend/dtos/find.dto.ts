import { Type } from 'class-transformer';
import { FindManyOptions } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BadRequestException } from '@nestjs/common';
import { IsNumber, IsOptional, IsObject, validateSync } from 'class-validator';

export class FindReturnModelDto<T> {
    rows: T[];
    count: number;
}
export class FindOptionsDto<T> implements FindManyOptions {
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    @ApiProperty({ required: false, description: 'Página da consulta', default: 0 })
    skip?: number = 0;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    @ApiProperty({ required: false, description: 'Número de registros por página', default: 10 })
    take?: number = 10;

    @IsObject()
    @IsOptional()
    @ApiProperty({ required: false, description: 'Filtros baseados nos campos do modelo buscado' })
    where?: Partial<T>;

    @IsObject()
    @IsOptional()
    @ApiProperty({ required: false, description: 'Ordenação dos registros', default: { createdAt: 'DESC' } })
    order?: Record<string, 'ASC' | 'DESC'> = { createdAt: 'DESC' };

    constructor(query: any = {}) {
        this.skip = query?.skip ? Number(query.skip) : this.skip;
        this.take = query?.take ? Number(query.take) : this.take;
        this.order = query?.order ? JSON.parse(query.order) : this.order;

        this.where = {}
        Object.keys(query).map(key => {
            if (!['skip', 'take', 'order'].includes(key)) {
                this.where[key] = query[key]
            }
        })

        const errors = validateSync(this);
        if (errors.length > 0) {
            throw new BadRequestException('Parâmetros de busca inválidos');
        }
    }
}