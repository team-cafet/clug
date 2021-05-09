import React, { useState } from 'react';
import { Image } from 'react-bootstrap';

interface IProps {
  src: string | File;
  size?: number;
  alt?: string;
}

export const Thumb = (props: IProps) => {
  let { src, size, alt } = props;

  if(!size) {
    size = 256;
  }

  const [isLoading, setIsLoading] = useState(true);
  const [thumb, setThumb] = useState<string>('');

  if (!src) {
    return null;
  }

  // Transform a file in a data URL 
  if (isLoading && src instanceof File) {
    let reader = new FileReader();

    reader.onloadend = () => {
      setIsLoading(false);
      if (reader.result) {
        setThumb(reader.result as string);
      }
    };

    reader.readAsDataURL(src);
  } else if (isLoading) {
    setIsLoading(false);
    setThumb(src as string);
  }

  if (isLoading) {
    return <p>loading...</p>;
  }

  return (
    <Image
      width={size}
      height={size}
      className="img-thumbnail"
      alt={alt}
      roundedCircle
      src={thumb}
    />
  );
};
