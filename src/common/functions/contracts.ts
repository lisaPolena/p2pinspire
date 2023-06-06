import { create } from "ipfs-http-client";

var window = require('global/window')

export const useIpfs = () => {
    const authorization = "Basic " + window.btoa(process.env.NEXT_PUBLIC_IPFS_API_KEY + ":" + process.env.NEXT_PUBLIC_IPFS_API_SECRET);

    const ipfs = create({
        url: "https://ipfs.infura.io:5001/api/v0",
        headers: {
            authorization,
        },
    });

    return ipfs;
}