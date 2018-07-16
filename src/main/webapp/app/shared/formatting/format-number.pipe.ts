import { Pipe, PipeTransform } from '@angular/core';
import 'rxjs/util/isNumeric';

@Pipe({name: 'formatNumber'})
export class FormatNumberPipe implements PipeTransform {
    private DEFAULT_SEPARATOR: string;
    private DEFAULT_PARTLENGTH: number;
    private DEFAULT_TOTALLENGTH: number;
    private regex: RegExp = new RegExp(/[^\d]/g);

    constructor() {
      // TODO comes from configuration settings
      this.DEFAULT_SEPARATOR = '-';
      this.DEFAULT_PARTLENGTH = 4;
      this.DEFAULT_TOTALLENGTH = 16;
    }
    transform(value: string, partLength: number, separater: string, totalLength: number): string {
        if (value === undefined || !value || value.length <= 0) {
            return;
        }
        let output = value.replace(this.regex, '');
        console.error('value: ' + value);
        // if (value.length > totalLength) {
        //    value = value.slice(0, totalLength);
        // }
        console.error('output: ' + output);
        for (let i = 0; i < value.length; i++) {
        }
        return output;
    }
}
