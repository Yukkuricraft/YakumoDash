import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileModeToString'
})
export class FileModeToStringPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
