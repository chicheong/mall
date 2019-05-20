import { Url } from '../../entities/url';
import { JhiAlert } from 'ng-jhipster';

export class FileUploadResult {
    constructor(
        public errors?: JhiAlert[],
        public urls?: Url[],
    ) {
    }
}
