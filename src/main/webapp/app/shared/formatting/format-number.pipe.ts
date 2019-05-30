import { Pipe, PipeTransform } from '@angular/core';
// import 'rxjs/util/isNumeric';

@Pipe({name: 'formatNumber'})
export class FormatNumberPipe implements PipeTransform {
    private DEFAULT_SEPARATOR: string;
    private DEFAULT_PARTLENGTH: number;
    private regex: RegExp = new RegExp(/[^\dA-Z]/g);

    constructor() {
      // TODO comes from configuration settings
      this.DEFAULT_SEPARATOR = ' ';
      this.DEFAULT_PARTLENGTH = 4;
    }
    transform(value: string, partLength: number, separater: string): string {
        if (value === undefined || !value || value.length <= 0) {
            return;
        }
        if (!separater) {
            separater = this.DEFAULT_SEPARATOR;
        }
        if (!partLength) {
            partLength = this.DEFAULT_PARTLENGTH;
        }
        const partRegex: RegExp = new RegExp('(.{' + partLength + '})', 'g');
        value = value.replace(this.regex, '').replace(partRegex, '$1' + separater).trim();
        return value;
    }
}
