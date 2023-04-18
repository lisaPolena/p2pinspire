import { UnsplashClient } from "@/common/unsplashClient";
import { useEffect, useRef, useState } from "react";

interface Props {
}

type Image = {
    id: string;
    urls: {
        regular: string;
    };
};

export default function ScrollGallery(props: Props) {
    const [images, setImages] = useState<Image[]>([]);

    useEffect(() => {
        fetchImages();
    }, []);

    function fetchImages() {
        UnsplashClient.getRandomPhotos().then(res => {
            setImages(res?.response);
        });
    };

    return (
        <div className="grid grid-cols-3 grid-rows-8 gap-3 mx-4 max-h-[60%]">
            {images?.map((image, index) => (
                <div className="image-item" key={index} >
                    <img src={image['urls']['regular']} className='object-cover w-full h-full' />
                </div>
            ))}
        </div>
    );
}