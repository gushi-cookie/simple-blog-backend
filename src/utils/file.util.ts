import mime from 'mime-types';


export interface ValidatedFileName {
    name: string,
    extension: string,
};

function validateFileName(fileName: string): ValidatedFileName | null {
    let supportedImageExts = ['jpeg', 'jpg', 'png', 'webp', 'avif', 'gif', 'svg', 'tiff'];
    let supportedVideoExts = ['mp4', 'm4p', 'mov', 'wmv', 'avi', 'mkv', 'webm', 'flv', 'vob', 'ogv', 'ogg'];

    let index = fileName.lastIndexOf('.');
    let name = fileName.slice(0, index);
    let ext = fileName.slice(index + 1);
    if(!mime.lookup(ext) || !supportedImageExts.includes(ext) && !supportedVideoExts.includes(ext)) {
        return null;
    }

    return {
        name,
        extension: ext,
    };
};

export default {
    validateFileName,
}