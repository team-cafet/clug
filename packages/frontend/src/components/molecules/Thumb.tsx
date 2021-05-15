import React, { useEffect, useState } from 'react';
import { Image } from 'react-bootstrap';

interface IProps {
  src: string | File;
  size?: number;
  alt?: string;
}

export const Thumb = (props: IProps) => {
  let { src, size, alt } = props;

  if (!size) {
    size = 256;
  }

  const [isLoading, setIsLoading] = useState(true);
  const [thumb, setThumb] = useState<string>('');

  useEffect(() => {
    // Transform a file in a data URL
    if (src instanceof File) {
      let reader = new FileReader();
      setIsLoading(true);

      reader.onloadend = () => {
        setIsLoading(false);
        if (reader.result) {
          setThumb(reader.result as string);
        }
      };

      reader.readAsDataURL(src);
    } else if (src !== thumb) {
      setIsLoading(false);
      setThumb(src as string);
    }
  }, [src, thumb]);

  if (!src) {
    return null;
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
