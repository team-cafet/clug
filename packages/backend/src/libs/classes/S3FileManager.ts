import { fileConfig } from '../../config/file';
import { S3, Endpoint } from 'aws-sdk';
import { Readable } from 'node:stream';
import { ClientConfiguration } from 'aws-sdk/clients/s3';

export class S3FileManager {
  protected fileConfig;
  protected s3Client: S3;
  protected endpoint: Endpoint;

  constructor(endpoint?: string, s3ClientConfiguration?: ClientConfiguration) {
    this.fileConfig = fileConfig();

    this.endpoint = new Endpoint(endpoint ?? this.fileConfig.s3.endpoint);

    this.s3Client = new S3({
      ...(s3ClientConfiguration ?? this.fileConfig.s3),
      endpoint: this.endpoint,
    });
  }

  public async uploadToBucket(
    bucket: string,
    filename: string,
    file: Readable | ReadableStream | Blob
  ): Promise<any> {
    return new Promise((resolve, reject) =>
      this.s3Client.putObject(
        {
          Bucket: bucket,
          Key: filename,
          Body: file,
          // ContentType: req.file.mimetype,
          ACL: 'public-read',
        },
        (err, data) => (err ? reject(err) : resolve(data))
      )
    );
  }
}
