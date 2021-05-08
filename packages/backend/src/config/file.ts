import { join as joinPath } from 'path';
import multer from 'multer';

interface IFileConfig {
  s3: {
    endpoint: string,
    accessKeyId: string ,
    secretAccessKey: string, 
    sslEnabled: boolean,
    s3ForcePathStyle: boolean
  };
  multer: {
    general: any,
    memberpicture: any
  };
}

export const fileConfig = (): IFileConfig => {
  
  const s3 = { 
    endpoint: process.env.S3_ENDPOINT ?? 'http://localstack-s3:4566',
    accessKeyId: process.env.S3_SPACES_KEY ?? 'test',
    secretAccessKey: process.env.S3_SPACES_SECRET ?? 'test',
    sslEnabled: process.env.S3_SSL === 'true' ?? false,
    s3ForcePathStyle: process.env.S3_FORCE_PATH_STYLE ? process.env.S3_FORCE_PATH_STYLE === 'true' : true
  };

  const MULTER_MEMORY_STORAGE = multer.memoryStorage();

  const uploadFolder = joinPath(process.cwd(), '/uploads');
  const multerMemberPicture = multer({
    storage: MULTER_MEMORY_STORAGE
  });

  return {
    s3,
    multer: {
      general: multer({dest: uploadFolder}),
      memberpicture: multerMemberPicture 
    }
  };
};
