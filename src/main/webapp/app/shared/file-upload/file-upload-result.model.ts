import { IMyUrl } from 'app/shared/model/my-url.model';
import { JhiAlert } from 'ng-jhipster';

export class FileUploadResult {
    constructor(
        public errors?: JhiAlert[],
        public urls?: IMyUrl[],
    ) {
    }
}
