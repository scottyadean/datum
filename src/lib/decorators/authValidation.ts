import { JoiRequestError } from '../utils/errors';
import { Request } from 'express';
import { ObjectSchema } from 'joi';

type IJoiDecorator = (target: any, key: string, desc: PropertyDescriptor) => void;


export function authValidation(schema: ObjectSchema) : IJoiDecorator {

    return function (_target: any, _key: string, desc: PropertyDescriptor) {
        const method = desc.value;
        desc.value = async function (...args: any[]) {
            const req: Request = args[0];
            const {error} = await Promise.resolve(schema.validate(req.body));
            if( error?.details ){
                throw new JoiRequestError(error.details[0].message);
            }

            return method.apply(this, args);
        };

        return desc;
    };
}
