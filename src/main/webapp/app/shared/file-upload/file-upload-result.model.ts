import { IUrl } from 'app/shared/model/url.model';
import { JhiAlert } from 'ng-jhipster';

export class FileUploadResult {
    constructor(
        public errors?: JhiAlert[],
        public urls?: IUrl[],
    ) {
    }
}
