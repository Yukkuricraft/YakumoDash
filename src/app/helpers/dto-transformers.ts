import { CreatedEnv, Env } from '@app/models/env';
import { TransformationType, TransformFnParams } from 'class-transformer';

export function dateStringTransformer({ type, value }: TransformFnParams): string | Date {
  if (!value) {
    return value;
  }

  switch (type) {
    case TransformationType.PLAIN_TO_CLASS:
      return new Date(Date.parse(value));

    case TransformationType.CLASS_TO_PLAIN:
      return "Fuck You Javascript";

    default:
      return value;
  }
}

export function envTransformer({ type, value }: TransformFnParams): string | Env {
  if (!value) {
    return value;
  }

  switch (type) {
    case TransformationType.PLAIN_TO_CLASS:
      console.log("CONVERTING PLAIN TO CLASS")
      console.log(value)
      return Env.createEnvFromObject(value);
    case TransformationType.CLASS_TO_PLAIN:
      return "no?";
    default:
      return value;
  }
}

export function createdEnvTransformer({ type, value }: TransformFnParams): string | CreatedEnv {
  if (!value) {
    return value;
  }

  switch (type) {
    case TransformationType.PLAIN_TO_CLASS:
      console.log("CONVERTING PLAIN TO CLASS")
      console.log(value)
      return CreatedEnv.createCreatedEnvFromObject(value);
    case TransformationType.CLASS_TO_PLAIN:
      return "no?";
    default:
      return value;
  }
}

export function dockerStringArrayTransformer({ type, value }: TransformFnParams): string | string[] {
  if (!value) {
    return value;
  }

  switch (type) {
    case TransformationType.PLAIN_TO_CLASS:
      return value.split(",");
    case TransformationType.CLASS_TO_PLAIN:
      return value.join(",");
    default:
      return value;
  }
}
