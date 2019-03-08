export const enum FileUploadConfigType {
    MULTIPLEIMAGE = {
            fileExt = 'JPG, GIF, PNG',
            maxFiles = 5,
            maxSize = 5
                    },
    SINGLEIMAGE = {},
}
export class FileUploadConfig {
    constructor(
        public id?: number,
        public name?: string,
        public code?: string,
                
        public fileExt = 'JPG, GIF, PNG';
        public maxFiles = 5;
        public maxSize = 5; // 5MB
    ) {
    }
}