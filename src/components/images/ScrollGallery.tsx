import { UnsplashClient } from "@/common/unsplashClient";
import { useEffect, useState } from "react";

interface Props {
}

export default function ScrollGallery(props: Props) {
    const [images, setImages] = useState([]);

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
            {images?.map((image) => (
                <div className="image-item" key={image['id']} >
                    <img src={image['urls']['regular']} className='object-cover w-full h-full' />
                </div>
            ))}
        </div>
    );
}