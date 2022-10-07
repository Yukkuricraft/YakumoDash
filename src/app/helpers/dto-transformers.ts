import { CreatedEnv, Env } from '@app/models/env';
import {
  ClassConstructor,
  TransformationType,
  TransformFnParams,
} from 'class-transformer';
import { DomainConverter } from './domain';

export function dateStringTransformer({
  type,
  value,
}: TransformFnParams): string | Date {
  if (!value) {
    return value;
  }

  switch (type) {
    case TransformationType.PLAIN_TO_CLASS:
      return new Date(Date.parse(value));

    case TransformationType.CLASS_TO_PLAIN:
      return 'Fuck You Javascript';

    default:
      return value;
  }
}

export function modelTransformer<T>(model: ClassConstructor<T>) {
  return ({ type, value }: TransformFnParams): string | T => {
    if (!value) {
      return value;
    }

    switch (type) {
      case TransformationType.PLAIN_TO_CLASS:
        return DomainConverter.objectToInstance(model, value);
      case TransformationType.CLASS_TO_PLAIN:
        return DomainConverter.toDto(model, value);
      default:
        return value;
    }
  };
}

export function dockerStringArrayTransformer({
  type,
  value,
}: TransformFnParams): string | string[] {
  if (!value) {
    return value;
  }

  switch (type) {
    case TransformationType.PLAIN_TO_CLASS:
      return value.split(',');
    case TransformationType.CLASS_TO_PLAIN:
      return value.join(',');
    default:
      return value;
  }
}
