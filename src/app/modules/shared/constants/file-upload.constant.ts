export class FILE_UPLOAD {
  static checkFileUploadType(file: any) {
    const type = file.type.split('/');
    return type[1] === 'pdf' ? 'pdf' : type[0] === 'image' ? 'image' : '';
  }
}