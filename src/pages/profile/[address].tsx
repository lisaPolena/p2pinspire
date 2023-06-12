import { AppBar } from '@/components/general/AppBar';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAccount, useContractRead, useContractWrite } from 'wagmi';
import userManager from '../../contracts/build/UserManager.json';
import boardManager from '../../contracts/build/BoardManager.json';
import { Board, Pin, User } from '@/common/types/structs'
import { Tabs, TabList, Tab, TabPanels, TabPanel, Stack, Skeleton, useToast } from '@chakra-ui/react';
import React from 'react';
import { useAppState } from '@/components/general/AppStateContext';
import { Toast } from '@/components/general/Toasts';
import { storeUserInStorage } from '@/common/functions/users';

export default function DetailProfile() {
    const { address, isConnected } = useAccount()
    const router = useRouter()
    const [profile, setProfile] = useState<User>();
    const [isFollowing, setIsFollowing] = useState<boolean>(false);
    const [boards, setBoards] = useState<Board[]>([]);
    const { user, setUser } = useAppState();
    const toast = useToast();

    const { data: profileData } = useContractRead({
        address: `0x${process.env.NEXT_PUBLIC_USER_MANAGER_CONTRACT}`,
        abi: userManager.abi,
        functionName: 'getUserByAddress',
        enabled: !!router.query.address,
        args: [router.query.address],
        onSuccess(data) {
            const res = data as User;

            if (res.userAddress !== '0x0000000000000000000000000000000000000000') {
                setProfile(res);
            };

            if (res.followers?.find((follower) => follower === address)) {
                setIsFollowing(true);
            };
        },
        onError(error) {
            console.log('getUserByAdress', error);
        },
    });

    const { data: allBoardsByAddress } = useContractRead({
        address: `0x${process.env.NEXT_PUBLIC_BOARD_MANAGER_CONTRACT}`,
        abi: boardManager.abi,
        functionName: 'getBoardsByOwner',
        args: [address],
        onSuccess(data) {

        },
        onError(error) {
            console.log(error);
        },
    });

    const {
        data: followUserData,
        status: followUserStatus,
        writeAsync: followUser,
    } = useContractWrite({
        address: `0x${process.env.NEXT_PUBLIC_USER_MANAGER_CONTRACT}`,
        abi: userManager.abi,
        functionName: 'followUser',
        onSuccess(data) {
            console.log('success', data);
            handleToast('Followed user', '');
        },
        onError(err) {
            console.log('error', err);
        }
    })

    const {
        data: unfollowUserData,
        status: unfollowUserStatus,
        writeAsync: unfollowUser,
    } = useContractWrite({
        address: `0x${process.env.NEXT_PUBLIC_USER_MANAGER_CONTRACT}`,
        abi: userManager.abi,
        functionName: 'unfollowUser',
        onSuccess(data) {
            console.log('success', data);
            handleToast('Unfollowed user', '');
            setIsFollowing(false);
        },
        onError(err) {
            console.log('error', err);
        }
    })

    useEffect(() => {

    }, [isConnected, profileData, allBoardsByAddress, isFollowing])

    const handleFollowUser = async () => {
        if (user && profile) {
            await followUser({ args: [user.userAddress, profile.userAddress] });
            setUser({ ...user, following: user.following ? [...user.following, profile.userAddress] : [profile.userAddress] });
            storeUserInStorage({ ...user, following: user.following ? [...user.following, profile.userAddress] : [profile.userAddress] });
        } else {
            console.log('user or profile is undefined');
        }
    }

    const handleUnfollowUser = async () => {
        if (user && profile) {
            await unfollowUser({ args: [user.userAddress, profile.userAddress] });
            setUser({ ...user, following: user.following?.filter((address) => address !== profile.userAddress) });
            storeUserInStorage({ ...user, following: user.following?.filter((address) => address !== profile.userAddress) });
        } else {
            console.log('user or profile is undefined');
        }
    }

    console.log(user);

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
            <Head>
                <title>Detail</title>
            </Head>
            <main className='flex flex-col min-h-screen overflow-auto bg-black mb-18'>
                <AppBar isBoard={false} isSavedPin={false} hideBackButton={false} />
                {profile &&
                    <>
                        <div className='flex flex-col items-center justify-center pt-20'>
                            {profile.profileImageHash &&
                                <div className=''>
                                    <img src={`https://web3-pinterest.infura-ipfs.io/ipfs/${profile.profileImageHash}`}
                                        className="object-cover w-40 h-40 rounded-full" />
                                </div>
                            }

                            {profile.name != '' || profile.userAddress &&
                                <div className='mt-2 text-2xl font-bold text-white'>
                                    {profile.name != '' ? (
                                        profile.name
                                    ) : (
                                        profile.userAddress.substring(0, 6) + '...' + profile.userAddress.substring(profile.userAddress.length - 4, profile.userAddress.length)
                                    )}
                                </div>
                            }

                            {profile.username &&
                                <div className='mt-2 text-sm font-medium text-gray-400'>
                                    @{(profile.username).toLowerCase()}
                                </div>
                            }

                            {profile.bio &&
                                <div className='px-6 mt-2 text-base font-medium text-white'>
                                    {profile.bio}
                                </div>
                            }

                            <div className='flex items-center justify-center mt-4 space-x-4'>
                                <div className='flex flex-col items-center justify-center'>
                                    <div className='text-sm font-medium text-gray-400'>{profile.followers?.length ?? 0}{' '}Followers</div>
                                </div>

                                <div className='flex flex-col items-center justify-center'>
                                    <div className='text-sm font-medium text-gray-400'>{profile.following?.length ?? 0}{' '}Following</div>
                                </div>

                            </div>

                            <button className={`px-4 py-2 mt-4 text-white transition-colors  ${isFollowing ? 'bg-gray-700' : 'bg-red-600'} rounded-3xl`}
                                onClick={isFollowing ? handleUnfollowUser : handleFollowUser}>
                                {isFollowing ? 'Following' : 'Follow'}
                            </button>

                        </div>

                        <div className='relative flex flex-col items-center mt-6'>
                            <Tabs variant='soft-rounded' colorScheme='primary' defaultIndex={1} size='md' align='center'>
                                <TabList>
                                    <Tab key={'Tab-1'}>Created</Tab>
                                    <Tab key={'Tab-2'}>Saved</Tab>
                                </TabList>
                                <TabPanels>
                                    <TabPanel key={'TabPanel-1'}>

                                    </TabPanel>
                                    <TabPanel key={'TabPanel-2'} width='100vw'>
                                        <div className='grid grid-cols-2 gap-4 mb-16'>
                                            {boards?.map(({ id, name, pins }) => (
                                                <React.Fragment key={id}>
                                                    <div className='text-left' onClick={() => router.push(`/boards/${name}/${id}`)}>
                                                        <div className={`h-[120px] rounded-3xl grid ${(pins?.length > 1 && pins[1].imageHash) || pins?.length === 0 ? 'grid-cols-2' : 'grid-cols-1'} gap-x-0.5`}>

                                                            <div className='col-span-1'>
                                                                {pins?.length > 0 && pins[0].imageHash ? (
                                                                    <img className={`object-cover w-full h-[120px] ${pins.length > 1 && pins[0].imageHash ? 'rounded-tl-3xl rounded-bl-3xl' : 'rounded-3xl'}`} src={`https://web3-pinterest.infura-ipfs.io/ipfs/${pins[0].imageHash}`} />
                                                                ) : (
                                                                    <div className='h-full bg-white rounded-tl-3xl rounded-bl-3xl'>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <div className={`grid col-span-1 ${(pins?.length > 2 && pins[2].imageHash) || pins?.length === 0 ? 'grid-rows-2 gap-y-0.5' : 'grid-rows-1'} `}>

                                                                {pins?.length > 1 && pins[1].imageHash ? (
                                                                    <img className={`object-cover w-full ${pins.length > 2 && pins[2].imageHash ? 'h-[60px]' : 'h-[120px] rounded-br-3xl'} rounded-tr-3xl`} src={`https://web3-pinterest.infura-ipfs.io/ipfs/${pins[1].imageHash}`} />
                                                                ) : (
                                                                    <div className='h-full row-span-1 bg-white rounded-tr-3xl'></div>
                                                                )}

                                                                {pins?.length > 2 && pins[2].imageHash && (
                                                                    <img className={`object-cover w-full h-[60px] rounded-br-3xl`} src={`https://web3-pinterest.infura-ipfs.io/ipfs/${pins[2].imageHash}`} />
                                                                )}

                                                                {pins.length === 0 && (
                                                                    <div className='h-full row-span-1 bg-white rounded-br-3xl'></div>
                                                                )}

                                                            </div>

                                                        </div>
                                                        <p className='pl-[0.7rem]'>{name}</p>
                                                        <p className='text-xs text-gray-400 pl-[0.7rem]'>{pins?.length} Pins</p>
                                                    </div>
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    </TabPanel>
                                </TabPanels>
                            </Tabs>
                        </div>
                    </>
                }
            </main>
        </>
    )
}

