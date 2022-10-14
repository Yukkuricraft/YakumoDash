import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "dateToShorthand",
})
export class DateToShorthandPipe implements PipeTransform {
  MONTHS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  transform(date: Date, ...args: unknown[]): string {
    // Add option for timezone?

    const month = this.MONTHS[date.getUTCMonth()];
    const day = date.getUTCDate();
    const hour = date.getUTCHours();
    const min = date.getUTCMinutes();

    return `${month} ${day} ${hour}:${min}`;
  }
}
