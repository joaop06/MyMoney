import { CreateDoc } from './doc/create.doc';
import { DeleteDoc } from './doc/delete.doc';
import { UpdateDoc } from './doc/update.doc';
import { UsersService } from './users.service';
import { FindOneDoc } from './doc/find-one.doc';
import { Public } from 'src/auth/jwt/jwt-auth-guard';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserReturnDto } from './dtos/user-return.dto';
import { ChangePasswordDoc } from './doc/change-password.doc';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { DynamicException } from 'interceptors/dynamic-exception';
import { UsersControllerInterface } from './interfaces/users.controller.interface';
import { Controller, Get, Post, Delete, Param, Body, Patch } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBody, ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController implements UsersControllerInterface {
    constructor(private readonly service: UsersService) { }

    @Delete(':id')
    @ApiParam(DeleteDoc.param)
    @ApiOperation(DeleteDoc.operation)
    @ApiOkResponse(DeleteDoc.okResponse)
    @ApiBadRequestResponse(DeleteDoc.badRequest)
    async delete(@Param('id') id: string): Promise<any> {
        try {
            const result = await this.service.delete(+id);
            return { message: 'Sucesso ao deletar', affected: result.affected };

        } catch (error) {
            error.message = `Erro ao deletar: ${error.message}`;
            new DynamicException(error, 'User');
        }
    }

    @Post('change-password')
    @ApiBody(ChangePasswordDoc.body)
    @ApiOperation(ChangePasswordDoc.operation)
    @ApiNotFoundResponse(ChangePasswordDoc.notFound)
    @ApiCreatedResponse(ChangePasswordDoc.okResponse)
    @ApiBadRequestResponse(ChangePasswordDoc.badRequest)
    async changePassword(@Body() object: ChangePasswordDto): Promise<any> {
        try {
            await this.service.changePassword(object);
            return { message: 'Sucesso ao atualizar senha' };

        } catch (error) {
            error.message = `Erro ao atualizar senha: ${error.message}`;
            new DynamicException(error, 'User');
        }
    }

    @Get(':id')
    @ApiParam(FindOneDoc.param)
    @ApiOperation(FindOneDoc.operation)
    @ApiOkResponse(FindOneDoc.okResponse)
    @ApiNotFoundResponse(FindOneDoc.notFound)
    async findOne(@Param('id') id: string): Promise<UserReturnDto> {
        try {
            return await this.service.findOne(+id);

        } catch (error) {
            new DynamicException(error, 'User');
        }
    }

    @Post()
    @Public()
    @ApiBody(CreateDoc.body)
    @ApiOperation(CreateDoc.operation)
    @ApiConflictResponse(CreateDoc.conflict)
    @ApiBadRequestResponse(CreateDoc.badRequest)
    @ApiCreatedResponse(CreateDoc.createdResponse)
    async create(@Body() object: CreateUserDto): Promise<UserReturnDto> {
        try {
            return await this.service.create(object);

        } catch (error) {
            error.message = `Erro ao inserir: ${error.message}`;
            new DynamicException(error, 'User');
        }
    }

    @Patch(':id')
    @ApiParam(UpdateDoc.param)
    @ApiOperation(UpdateDoc.operation)
    @ApiOkResponse(UpdateDoc.okResponse)
    @ApiBadRequestResponse(UpdateDoc.badRequest)
    async update(@Param('id') id: string, @Body() object: Partial<UpdateUserDto>): Promise<any> {
        try {
            const result = await this.service.update(+id, object);
            return { message: 'Sucesso ao atualizar', affected: result.affected };

        } catch (error) {
            error.message = `Erro ao atualizar: ${error.message}`;
            new DynamicException(error, 'User');
        }
    }
}
