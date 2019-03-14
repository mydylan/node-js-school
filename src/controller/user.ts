import { BaseContext } from 'koa';
import { getManager, Repository, Not, Equal } from 'typeorm';
import { validate, ValidationError } from 'class-validator';
import { OK, CREATED, NO_CONTENT, BAD_REQUEST, FORBIDDEN } from 'http-status-codes';
import { User } from '../entity/user';

export default class UserController {

    public static async getUsers (ctx: BaseContext) {
        const userRepository: Repository<User> = getManager().getRepository(User);

        const users: User[] = await userRepository.find();

        ctx.status = OK;
        ctx.body = users;
    }

    public static async getUser (ctx: BaseContext) {
        const userRepository: Repository<User> = getManager().getRepository(User);

        const user: User = await userRepository.findOne(Number(ctx.params.id));

        if (!user) {
            ctx.status = BAD_REQUEST;
            ctx.body = 'The user you are trying to retrieve user doesn\'t exist in the db';
            return;
        }

        ctx.status = OK;
        ctx.body = user;
    }

    public static async createUser (ctx: BaseContext) {
        const userRepository: Repository<User> = getManager().getRepository(User);

        const userToBeSaved: User = new User();
        userToBeSaved.name = ctx.request.body.name;
        userToBeSaved.email = ctx.request.body.email;

        const errors: ValidationError[] = await validate(userToBeSaved);

        if (errors.length > 0) {
            ctx.status = BAD_REQUEST;
            ctx.body = errors;
            return;
        }

        if ( await userRepository.findOne({ email: userToBeSaved.email }) ) {
            ctx.status = BAD_REQUEST;
            ctx.body = 'The specified e-mail address already exists';
            return;
        }

        const user = await userRepository.save(userToBeSaved);

        ctx.status = CREATED;
        ctx.body = user;
    }

    public static async updateUser (ctx: BaseContext) {
        const userRepository: Repository<User> = getManager().getRepository(User);

        const userToBeUpdated: User = new User();
        userToBeUpdated.name = ctx.request.body.name;
        userToBeUpdated.email = ctx.request.body.email;

        const errors: ValidationError[] = await validate(userToBeUpdated);

        if (errors.length > 0) {
            ctx.status = BAD_REQUEST;
            ctx.body = errors;
            return;
        }

        if ( !await userRepository.findOne(Number(ctx.params.id)) ) {
            ctx.status = BAD_REQUEST;
            ctx.body = 'The user you are trying to update doesn\'t exist in the db';
            return;
        }

        if ( await userRepository.findOne({ email: userToBeUpdated.email }) ) {
            ctx.status = BAD_REQUEST;
            ctx.body = 'The specified e-mail address already exists';
            return;
        }

        const user = await userRepository.save(userToBeUpdated);

        ctx.status = OK;
        ctx.body = user;
    }

    public static async deleteUser (ctx: BaseContext) {
        const userRepository = getManager().getRepository(User);

        const userToRemove: User = await userRepository.findOne(Number(ctx.params.id));

        if (!userToRemove) {
            ctx.status = BAD_REQUEST;
            ctx.body = 'The user you are trying to delete doesn\'t exist in the db';
            return;
        }

        if (Number(ctx.state.user.id) !== userToRemove.id) {
            ctx.status = FORBIDDEN;
            ctx.body = 'A user can only be deleted by himself';
            return;
        }

        await userRepository.remove(userToRemove);

        ctx.status = NO_CONTENT;
    }

}
