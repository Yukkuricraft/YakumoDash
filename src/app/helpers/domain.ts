import { instanceToPlain, plainToInstance } from 'class-transformer';
import { ClassConstructor } from 'class-transformer/types/interfaces';

export class DomainConverter {
  static objectToInstance<T>(domain: ClassConstructor<T>, plain: any) {
    return plainToInstance<T, any>(domain, plain, { ignoreDecorators: true });
  }

  static fromDto<T>(domain: ClassConstructor<T>, dto: any): T {
    return plainToInstance<T, any>(domain, dto);
  }

  static toDto<T>(domain: ClassConstructor<T>, instance: any) {
    if (!(instance instanceof domain)) {
      instance = DomainConverter.objectToInstance<T>(domain, instance);
    }
    return instanceToPlain<any>(instance);
  }
}
