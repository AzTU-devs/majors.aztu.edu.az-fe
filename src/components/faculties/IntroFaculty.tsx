import React from 'react';
import Image from 'next/image';
import AzTU from "@/../public/aztu.jpg";

export default function IntroFaculty() {
  return (
    <section>
      <Image
  src={AzTU}
  alt="Azərbaycan Texniki Universiteti"
  sizes="100vw"
  style={{
    width: "100%",
    height: "auto",
    maxHeight: "400px", // limit how tall it gets
    objectFit: "contain", // no cropping
  }}
  priority
/>
    </section>
  );
}