import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "capitalize",
})
export class CapitalizePipe implements PipeTransform {
  transform(value: string | null, ...args: unknown[]): string {
    if (!value || value.length <= 0) {
      return value ?? "";
    } else if (value.length === 1) {
      return value.toUpperCase();
    } else {
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
  }
}
