import { instanceToPlain, plainToInstance } from 'class-transformer';
import { ClassConstructor } from 'class-transformer/types/interfaces';
import { CaseOptions, camelizeKeys, toSnakeCase } from './converting-case';

export type FromDtoOptions = { caseOptions?: CaseOptions };
export type ToDtoOptions = { caseOptions?: CaseOptions };

export class DomainConverter {
  static objectToInstance<T>(domain: ClassConstructor<T>, plain: any) {
    return plainToInstance<T, any>(domain, plain, { ignoreDecorators: true });
  }

  static fromDto<T>(domain: ClassConstructor<T>, dto: any, options?: FromDtoOptions): T {
    return plainToInstance<T, any>(domain, camelizeKeys(dto, options?.caseOptions));
  }

  static toDto<T>(domain: ClassConstructor<T>, instance: any, options?: ToDtoOptions) {
    if (!(instance instanceof domain)) {
      instance = DomainConverter.objectToInstance<T>(domain, instance);
    }
    return toSnakeCase(instanceToPlain<any>(instance), options?.caseOptions);
  }
}
