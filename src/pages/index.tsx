import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { useEffect } from 'react'
import { UnsplashClient } from '@/common/unsplashClient'

export default function Index() {


  return (
    <>
      <Head>
        <title>Web3 Pinterest</title>
        <meta name="description" content="Web3 Pinterest" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.imagesContainer}> 
          Images
        </div>
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
