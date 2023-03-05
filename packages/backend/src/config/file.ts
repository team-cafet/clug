import { join as joinPath } from 'path';
import multer from 'multer';
import { S3ClientConfig } from '@aws-sdk/client-s3';

interface IFileConfig {
  s3: S3ClientConfig;
  multer: {
    general: any,
    memberpicture: any
  };
}

export const fileConfig = (): IFileConfig => {
  
  const s3: S3ClientConfig = { 
    endpoint: process.env.S3_ENDPOINT ?? 'http://localstack-s3:4566',
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY ?? 'test',
      secretAccessKey: process.env.S3_SECRET_KEY ?? 'test',
    },
    tls: process.env.S3_SSL === 'true' ?? false,
    region: process.env.S3_REGION ?? 'eu-west-1', // see https://qubyte.codes/blog/tip-connecting-to-localstack-s3-using-the-javascript-aws-sdk-v3
    forcePathStyle: process.env.S3_FORCE_PATH_STYLE ? process.env.S3_FORCE_PATH_STYLE === 'true' : true,
    disableHostPrefix: true
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
