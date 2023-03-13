import { createApi } from 'unsplash-js';
import { NextApiRequest, NextApiResponse } from 'next'

export default function getPhotos(req: NextApiRequest, res: NextApiResponse) {

    switch (req.method) {
        case 'GET':
            const unsplash = createApi({
                accessKey: 'IAmKWMdYam8wFqxgZ1A0QUKGECDLyHknDNS6NyMGX1Q',
            });
    
            unsplash.photos.getRandom({count:10})
            .then((result) => {
                res.status(result.status).json({result})
            })
            .catch((error) => {
                console.error
            })
          break;
        default:
          res.status(405).end() //Method Not Allowed
          break;
    }

}
 

