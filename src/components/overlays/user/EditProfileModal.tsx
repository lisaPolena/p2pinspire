import React, { useEffect, useState } from 'react';
import Modal from '../../general/Modal';
import { useAppState } from '../../general/AppStateContext';
import { Input, Textarea, useToast } from '@chakra-ui/react';
import { IoAdd } from 'react-icons/io5';
import { useIpfs } from '@/common/functions/contracts';
import { AiOutlineLoading } from "react-icons/ai";
import { useAccount, useContractWrite } from 'wagmi';
import userManager from '../../../contracts/build/UserManager.json';
import { Toast } from '../../general/Toasts';
import DeleteProfileModal from './DeleteProfile';
import { useRouter } from 'next/router';
import { clearUserStorage, getUserFromStorage, storeUserInStorage } from '@/common/functions/users';

const EditProfileModal: React.FC = () => {
    const { user, setUser, editProfileModalOpen, setEditProfileModalOpen, deleteProfile, setDeleteProfile } = useAppState();
    const { address } = useAccount();
    const [newData, setNewData] = useState<boolean>(false);
    const [profileName, setProfileName] = useState<string>('');
    const [profileBio, setProfileBio] = useState<string>('');
    const [profileUsername, setProfileUsername] = useState<string>('');
    const [profileImage, setProfileImage] = useState<string>('');
    const [imageLoading, setImageLoading] = useState<boolean>(false);
    const [deleteProfileModalOpen, setDeleteProfileModalOpen] = useState<boolean>(false);
    const ipfs = useIpfs();
    const toast = useToast();
    const router = useRouter();

    const {
        data: editBoardData,
        status: editBoardStatus,
        writeAsync: editUser,
    } = useContractWrite({
        address: `0x${process.env.NEXT_PUBLIC_USER_MANAGER_CONTRACT}`,
        abi: userManager.abi,
        functionName: 'editUser',
        onSuccess() {
            handleToast('Profile edited!', '');
        },
        onError(err) {
            console.log('error', err);
        }
    })

    const {
        data: deleteUserData,
        status: deleteUserStatus,
        writeAsync: deleteUser,
    } = useContractWrite({
        address: `0x${process.env.NEXT_PUBLIC_USER_MANAGER_CONTRACT}`,
        abi: userManager.abi,
        functionName: 'deleteUser',
        onError(err) {
            console.log('error ', err);
        }
    })

    useEffect(() => {

        if (!user) {
            setUser(getUserFromStorage());
        }

        if (profileName || profileBio || profileUsername || profileImage) {
            setNewData(true);
        } else {
            setNewData(false);
        }

    }, [user, profileName, profileBio, profileUsername, profileImage]);

    const handleEditProfile = async () => {
        if (newData) {

            if (profileBio.length > 300) {
                handleToast('Bio must be less than 300 characters', '');
                return;
            }

            const userAddress = user?.userAddress ?? address ?? '';
            const name = profileName != '' ? profileName : user?.name ?? '';
            const bio = profileBio != '' ? profileBio : user?.bio ?? '';
            const username = profileUsername != '' ? profileUsername.replace(/\s/g, '') : user?.username ?? '';
            const image = profileImage != '' ? profileImage : user?.profileImageHash ?? '';
            handleToast('Profile editing...', '');
            await editUser({ args: [userAddress, name, username, image, bio] });
            setUser({ userAddress, name, username, profileImageHash: image, bio, followers: user?.followers ?? [], following: user?.following ?? [] });
            storeUserInStorage({ userAddress, name, username, profileImageHash: image, bio, followers: user?.followers ?? [], following: user?.following ?? [] });
            setEditProfileModalOpen(false);
        }
    }

    function handleCloseModal() {
        setEditProfileModalOpen(false);
        setProfileName('');
        setProfileBio('');
        setProfileUsername('');
        setProfileImage('');
    }

    const handleImageUpload = async (image: File | null) => {
        if (!image) return;
        setImageLoading(true);
        const res = await ipfs.add(image);
        setImageLoading(false);
        setProfileImage(res.path);
    }

    const handleDeleteProfile = async () => {
        setDeleteProfileModalOpen(false);
        setEditProfileModalOpen(false);
        await deleteUser({ args: [user?.userAddress ?? address] })
        setDeleteProfile(user?.userAddress ?? '');
        setUser(null);
        clearUserStorage();
        handleToast('Profile deleting...', '');
        router.push('/');
    }

    function handleToast(message: string, imageHash: string) {
        toast({
            position: 'top',
            render: () => (
                <Toast text={message} imageHash={imageHash} />
            ),
        })
    }

    return (
        <>
            <Modal isOpen={editProfileModalOpen} closeModal={handleCloseModal} title="Edit Profile" height='h-[99%]'>
                <div className='absolute top-3 right-3'>
                    <button
                        className="px-4 py-2 transition-colors text-white bg-red-600 disabled:!bg-transparent disabled:!text-gray-400 rounded-3xl"
                        disabled={!newData}
                        onClick={() => handleEditProfile()}
                    >
                        Done
                    </button>
                </div >

                <div className='flex flex-col gap-4'>
                    <div>

                        {!user?.profileImageHash && !profileImage ? (
                            <div className='flex items-center justify-center w-40 h-40 m-auto mt-4 mb-6 border-2 border-white border-dashed rounded-full'>
                                {imageLoading ? (
                                    <div className="flex flex-col items-center m-auto">
                                        <AiOutlineLoading size={40} className='animate-spin' />
                                    </div>
                                ) : (
                                    <>
                                        <IoAdd size={30} />
                                        <Input
                                            type="file"
                                            height="180px"
                                            width="180px"
                                            position="absolute"
                                            top="10%"
                                            left="30%"
                                            opacity="0"
                                            aria-hidden="true"
                                            accept="image/*"
                                            onChange={(e) => handleImageUpload(e.target.files ? e.target.files[0] : null)}
                                        />

                                    </>
                                )}

                            </div>
                        ) : (
                            <div className='flex flex-col items-center '>
                                <img src={`https://web3-pinterest.infura-ipfs.io/ipfs/${!profileImage && user?.profileImageHash ? user?.profileImageHash : profileImage}`}
                                    className="object-cover w-40 h-40 rounded-full" />
                                <div>
                                    <button
                                        className="w-20 px-4 py-2 mt-4 text-white transition-colors bg-gray-500 rounded-2xl">
                                        Edit

                                    </button>
                                    <Input
                                        type="file"
                                        height="60px"
                                        width="120px"
                                        position="absolute"
                                        left="33%"
                                        top="30%"
                                        opacity="0"
                                        aria-hidden="true"
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(e.target.files ? e.target.files[0] : null)}
                                    />
                                </div>

                            </div>
                        )}
                    </div>

                    <div className='mt-4 mb-2'>
                        <p className='text-lg'>Username</p>
                        <Input variant='unstyled' placeholder='Enter your name' fontSize={'lg'}
                            defaultValue={!profileUsername && user?.username ? user.username : profileUsername} onChange={(e) => setProfileUsername(e.target.value)} />
                    </div>

                    <div className='mb-2'>
                        <p className='text-lg'>Name</p>
                        <Input variant='unstyled' placeholder='Enter your name' fontSize={'lg'}
                            defaultValue={!profileName && user?.name ? user.name : profileName} onChange={(e) => setProfileName(e.target.value)} />
                    </div>

                    <div>
                        <p className='text-lg'>About</p>
                        <Textarea
                            variant='unstyled' placeholder='Tell your story' size={'lg'}
                            defaultValue={!profileBio && user?.bio ? user.bio : profileBio} fontSize={'lg'}
                            onChange={(e) => setProfileBio(e.target.value)}
                        />
                    </div>

                </div>

                <div className='flex justify-center mt-40'>
                    <button
                        className="px-4 py-2 text-white transition-colors bg-gray-600 rounded-3xl"
                        onClick={() => setDeleteProfileModalOpen(true)}
                    >
                        Delete Profile
                    </button>

                </div>

            </Modal>
            <DeleteProfileModal isOpen={deleteProfileModalOpen} closeModal={() => setDeleteProfileModalOpen(false)} handleDeleteProfile={handleDeleteProfile} />
        </>
    );
};

export default EditProfileModal;
