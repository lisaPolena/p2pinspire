import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:3000/api/',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  validateStatus: () => true,
});

export namespace UnsplashClient {

  export async function getRandomPhotos() {
    const url = 'unsplash/randomPhotos';
    const res = await axiosClient.get(`${url}`);
    return res.data.result;
  };

}

