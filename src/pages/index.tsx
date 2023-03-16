import Head from 'next/head'
import styles from '@/styles/Index.module.css'
import { Button } from '@chakra-ui/react'
import { useEffect } from 'react'
import { UnsplashClient } from '@/common/unsplashClient'
import ScrollGallery from '@/components/images/ScrollGallery'

export default function Index() {

  useEffect(() => {
    UnsplashClient.getRandomPhotos();
  }, [])

  return (
    <>
      <Head>
        <title>Web3 Pinterest</title>
        <meta name="description" content="Web3 Pinterest" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <ScrollGallery />
        <div className={styles.contentContainer}>
          <img className={styles.logo} src='/assets/logo.png' alt='Logo'></img>
          <h2>Welcome to Web3 Pinterest</h2>
          <Button width={'70%'} borderRadius={'50px'} colorScheme='primary' variant='solid'>
            Sign up
          </Button>
          <Button width={'70%'} borderRadius={'50px'} colorScheme='white' variant='outline'>
            Log in
          </Button>
        </div>
      </main>
    </>
  )
}
