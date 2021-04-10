import { join as joinPath } from 'path';
import multer from 'multer';
import AWS from 'aws-sdk';
import multerS3 from 'multer-s3';

interface IFileConfig {
  s3: any;
  multer: {
    general: any,
    memberpicture: any
  };
  buckets: {
    memberpicture: string;
  };
}

export const fileConfig = (): IFileConfig => {
  const spacesEndpoint = new AWS.Endpoint(
    process.env.S3_ENDPOINT ?? 'http://localstack-s3:4566'
  );
  const s3 = new AWS.S3({
    endpoint: spacesEndpoint,
    accessKeyId: process.env.S3_SPACES_KEY ?? 'key',
    secretAccessKey: process.env.S3_SPACES_SECRET ?? 'secret',
    sslEnabled: false
  });

  console.log(s3);

  const memberpicture = 'member-picture';
  const uploadFolder = joinPath(process.cwd(), '/uploads');
  const multerMemberPicture = multer({
    dest: uploadFolder,
    storage: multerS3({
      s3: s3,
      bucket: memberpicture,
      metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
      },
      key: function (req, file, cb) {
        cb(null, Date.now().toString());
      },
    }),
  });

  return {
    s3,
    multer: {
      general: multer({dest: uploadFolder}),
      memberpicture: multerMemberPicture 
    },
    buckets: {
      memberpicture,
    },
  };
};
