import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'shortId' })
export class ShortIdPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    return value.substring(0, 8).toUpperCase();
  }
}