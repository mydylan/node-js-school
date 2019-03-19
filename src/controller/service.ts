import { BaseContext } from 'koa';
import { getManager, Repository } from 'typeorm';
import { validate, ValidationError } from 'class-validator';
import { OK, CREATED, NO_CONTENT, BAD_REQUEST, FORBIDDEN } from 'http-status-codes';
import { Service } from '../entity/service';
import { transformFile } from '../utils/transform';

export default class ServiceController {

    public static async register (ctx: BaseContext) {
        const serviceRepository: Repository<Service> = getManager().getRepository(Service);

        const serviceToBeSaved: Service = new Service();
        serviceToBeSaved.flowSteps = ctx.request.body.flowSteps;

        const errors: ValidationError[] = await validate(serviceToBeSaved);

        if (errors.length > 0) {
            ctx.status = BAD_REQUEST;
            ctx.body = errors;
            return;
        }

        const service = await serviceRepository.save(serviceToBeSaved);

        ctx.status = CREATED;
        ctx.body = service.id;
    }

    public static async execute (ctx: BaseContext) {
        const serviceRepository: Repository<Service> = getManager().getRepository(Service);

        const service: Service = await serviceRepository.findOne({ id: ctx.params.id });

        if (!service) {
            ctx.status = BAD_REQUEST;
            ctx.body = 'The service you are trying to retrieve doesn\'t exist in the db';
            return;
        }

        ctx.status = OK;
        ctx.body = await transformFile(service.flowSteps, ctx.req);
    }
}
