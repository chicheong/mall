import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'findLanguageFromKey'})
export class FindLanguageFromKeyPipe implements PipeTransform {
    private languages: any = {
        'zh-tw': { name: '繁體中文', shortName:'繁' },
        'en': { name: 'English', shortName:'ENG' }
        // jhipster-needle-i18n-language-key-pipe - JHipster will add/remove languages in this object
    };
    transform(lang: string, shortName: boolean): string {
        if (shortName) {
            return this.languages[lang].shortName;
        }
        return this.languages[lang].name;
    }
}
