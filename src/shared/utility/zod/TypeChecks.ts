export const isMulterFile = (file: any) => {
    return file &&
        typeof file === 'object' &&
        typeof file.originalname == 'string' &&
        typeof file.mimetype == 'string';
}