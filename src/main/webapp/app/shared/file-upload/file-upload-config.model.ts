export const enum FileUploadConfigType {
}
export class FileUploadConfig {
    constructor(
        public id?: number,
        public name?: string,
        public code?: string,
        public fileExt = 'JPG, GIF, PNG',
        public maxFiles = 5,
        public maxSize = 5 // 5MB
    ) {
    }
}
