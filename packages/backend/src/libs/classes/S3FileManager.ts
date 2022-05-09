import { fileConfig } from '../../config/file';
import { S3, PutObjectCommandOutput, PutObjectCommandInput, GetObjectCommandOutput, S3ClientConfig } from '@aws-sdk/client-s3';
import logger from '../functions/logger';
import { Readable } from 'stream';

export class S3FileManager {
  protected fileConfig;
  protected s3Client: S3;
  protected endpoint: S3ClientConfig['endpoint'];

  constructor(endpoint?: string, s3ClientConfiguration?: S3ClientConfig) {
    this.fileConfig = fileConfig();

    this.endpoint = endpoint ?? this.fileConfig.s3.endpoint;

    this.s3Client = new S3({
      ...(s3ClientConfiguration ?? this.fileConfig.s3),
      endpoint: this.endpoint,
    });
  }
  
  public static checkFileTypeFromName(filename: string, authorizedExtensions: string[]): null | string {
    for (const extension of authorizedExtensions) {
      if (filename.endsWith(extension)) {
        return extension;
      }
    }

    return null;
  }


  public async uploadToBucket(
    bucket: string,
    filename: string,
    file: PutObjectCommandInput['Body'],
    contentType?: string
  ): Promise<PutObjectCommandOutput>{
    return this.s3Client.putObject({
      Bucket: bucket,
      Key: filename,
      Body: file,
      ContentType: contentType ?? null
    });
  }

  public async getFromBucket(
    bucket: string,
    filename: string,
    authorizedExtensions: string[] = [],
  ): Promise<{file: Buffer, contentType:string}> {
    const response = await this.s3Client.getObject(
      {
        Bucket: bucket,
        Key: filename,        
      }
    );
    
    const contentType = `image/${S3FileManager.checkFileTypeFromName(
      filename,
      authorizedExtensions
    )}`;

    const file = await new Promise<Buffer>((resolve, reject) => {
      const responseDataChunks = [];
      try {
        (response.Body as Readable).on('data', (chunk) => responseDataChunks.push(chunk));
        (response.Body as Readable).once('end', () => resolve(Buffer.concat(responseDataChunks)));
      } catch(err) {
        logger.error(err);
        reject(err);
      }
    });
    
    return {file, contentType: contentType};
  }
}
