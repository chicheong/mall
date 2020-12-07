import { Pipe, PipeTransform } from '@angular/core';
// import 'rxjs/util/isNumeric';

@Pipe({name: 'ellipsis'})
export class StringEllipsisPipe implements PipeTransform {
    private DEFAULT_SUFFIX?: string;
    constructor() {
        // TODO comes from configuration settings
        this.DEFAULT_SUFFIX = '...';
    }
    transform(value: string, size: number, suffix?: string | undefined): string {
        if (value === undefined || !value || value.length <= 0) {
            return '';
        }
        if (size === undefined) {
            return value;
        }
        if (!suffix) {
            suffix = this.DEFAULT_SUFFIX;
        }
        if (value.length > size) {
            return value.substring(0, size) + suffix;
        } else {
            return value;
        }
    }
}
