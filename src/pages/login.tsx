import Head from 'next/head'
import styles from '@/styles/Index.module.css'
import Button from '@/components/general/Button'

export default function Login() {
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
          <Button styleType='primary' content='Sign up'></Button>
          <Button styleType='secondary' content='Log in'></Button>
        </div>
      </main>
    </>
  )
}
