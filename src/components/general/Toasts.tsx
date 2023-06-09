
interface ToastProps {
    text: string;
    imageHash?: string;
}

export const Toast: React.FC<ToastProps> = ({ text, imageHash }) => {

    return (

        <div className={`text-white bg-zinc-800 rounded-full h-[70px] flex items-center ${imageHash ? 'justify-evenly gap-2 px-2' : 'justify-center'} `}>
            {imageHash &&
                <img src={`https://web3-pinterest.infura-ipfs.io/ipfs/${imageHash}`}
                    className="object-cover w-[50px] h-[50px] rounded-2xl" />
            }

            <p>{text}</p>
        </div>
    );
}