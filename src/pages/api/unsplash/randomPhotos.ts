import { createApi } from 'unsplash-js';
import { NextApiRequest, NextApiResponse } from 'next'

export const config = {
    api: {
      externalResolver: true,
    },
  }

export default function getPhotos(req: NextApiRequest, res: NextApiResponse) {

    switch (req.method) {
        case 'GET':
            const unsplash = createApi({
                accessKey: 'IAmKWMdYam8wFqxgZ1A0QUKGECDLyHknDNS6NyMGX1Q',
            });
    
            unsplash.photos.getRandom({count:18})
            .then((result) => {
                res.status(result.status).json({result})
                res.end();
            })
            .catch((error) => {
                console.error
                res.status(400).end();
            })
          break;
        default:
          res.status(405).end() //Method Not Allowed
          break;
    }

}
 

