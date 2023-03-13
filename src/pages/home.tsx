import Head from 'next/head'
import styles from '@/styles/Index.module.css'
import { Navbar } from '@/components/general/Navbar'

export default function Home() {

  return (
    <>
      <Head>
        <title>Web3 Pinterest</title>
        <meta name="description" content="Web3 Pinterest" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        Some Content 
        bla
        bla
        <Navbar />
      </main>
    </>
  )
}
