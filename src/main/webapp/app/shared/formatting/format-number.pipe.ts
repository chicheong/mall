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
      this.DEFAULT_SEPARATOR = "-";
      this.DEFAULT_PARTLENGTH = 4;
      this.DEFAULT_TOTALLENGTH = 16;
    }
    transform(value: string, partLength: number, separater: string, totalLength: number): string {
        if (value.length <= 0)
			return;
		
		value = value.replace(regex, '');
		
		for (let i = 0; i < value.length; i++) {
		}
        
        
        return this.languages[lang].name;
    }
}
