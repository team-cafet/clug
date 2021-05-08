import { Request } from 'express';

export interface IRequestWithFile extends Request {
  file: {
    fieldname: string; // Field name specified in the form
    originalname: string; // Name of the file on the user's computer
    encoding: string; // Encoding type of the file
    mimetype: string; // Mime type of the file
    size; // Size of the file in bytes
    destination?; // The folder to which the file has been saved DiskStorage
    filename?; // The name of the file within the destination DiskStorage
    path?; // The full path to the uploaded file DiskStorage
    buffer?; // A Buffer of the entire file MemoryStorage
  };
}
