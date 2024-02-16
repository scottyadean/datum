/* eslint-disable @typescript-eslint/no-explicit-any */
// import { Request } from 'express';
import { ObjectSchema } from 'joi';
// import { RequestValidationError } from '@utils/errors';

// type IVaildateDecorator = ( target: any, key: string, descriptor: PropertyDescriptor ) => void;
// export function baseValidation(schema: ObjectSchema) :IVaildateDecorator {
//     return (_target:any, _key: string, descriptor: PropertyDescriptor) => {
//         const origin = descriptor.value;
//         descriptor.value = async function (...args:any) {
//             const req: Request = args[0];
//             const { error } = await Promise.resolve(schema.validate(req.body));
//             if(error?.details){
//                 throw new RequestValidationError(`${error?.details[0].message}`);
//             }
//             return origin.apply(this, ...args);
//         };
//         return descriptor;
//     };

// }


// export function baseValidation(schema: ObjectSchema) {
//     return function (_target: any, _key: string, descriptor: PropertyDescriptor) : void {

//         console.log(schema);
//         console.log(descriptor);

//         //descriptor.configurable = value;
//     };
//   }


// export function baseValidation(originalMethod: any, _context: any) {
//     function replacementMethod(this: any, ...args: any[]) {
//       console.log('start:', originalMethod.name);
//       console.log(_context);
//       const result = originalMethod.call(this, ...args);
//       console.log('end:', originalMethod.name);
//       return result;
//     }

//     return replacementMethod;
//   }



// export function baseValidation(originalMethod: any, context: ClassMethodDecoratorContext) {
//     const methodName = String(context.name);

//     function replacementMethod(this: any, ...args: any[]) {
//         console.log(`LOG: Entering method '${methodName}'.`);
//         const result = originalMethod.call(this, ...args);
//         console.log(`LOG: Exiting method '${methodName}'.`);
//         return result;
//     }

//     return replacementMethod;

// }


export function validate(_target: any, key: string, descriptor: PropertyDescriptor) {
    const original = descriptor?.value;

    descriptor.value = function(...args: any[]) {

        console.log(key)

      return original.apply(this, args);
    };
  }
