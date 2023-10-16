import '../styles/globals.css'
import 'tailwindcss/tailwind.css';

import React from 'react'
import { Windmill } from '@roketid/windmill-react-ui'
import type { AppProps } from 'next/app'
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
  // suppress useLayoutEffect warnings when running outside a browser
  if (!process.browser) React.useLayoutEffect = React.useEffect;

  return (
    <>
      <Head>
        <title>Feedback iStow</title>
      </Head>
      <Windmill usePreferences={true} >
        <Component {...pageProps} />
      </Windmill>
    </>
  )
}
export default MyApp
