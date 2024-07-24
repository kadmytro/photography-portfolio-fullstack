import React from "react";
import { Carousel } from "./Carousel";

interface IImage {
  src: string
  alt: string
  description: string
}


interface WrapperProps {
  data: IImage[][]
}


function CarouselWrapper({data}: WrapperProps) {
  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto">
        <div className="flex space-x-4">
          <Carousel images={data[0]} />
          <Carousel images={data[1]} />
          <Carousel images={data[2]} />
        </div>
      </div>
    </div>
  );
}

export default CarouselWrapper
  