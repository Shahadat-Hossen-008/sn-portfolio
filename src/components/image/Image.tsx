import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image'; 
import { imageProp } from './imagePropType';


export default function SanityImage({ image, alt, width, height, className }: imageProp) {
  if (!image || !width || !height) return null;

  return (
    <img
      src={urlFor(image).quality(80).width(width).height(height).url()}
      alt={ `portfolio of ${alt}`}
      width={width}
      height={height}
      className={className}
      srcSet={urlFor(image).width(width).height(height).url()}
      // quality={80}
    />
  );
}