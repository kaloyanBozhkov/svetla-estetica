import type { AppProps /*, AppContext */ } from 'next/app'

import 'scss/general.scss'

// import template
import BaseLayout from 'templates/BaseLayout/BaseLayout'

// import components
import Header from 'components/Header/Header'

const App = ({ Component, pageProps }: AppProps): JSX.Element => {
    return (
        <BaseLayout header={<Header />}>
            <Component {...pageProps} />
        </BaseLayout>
    )
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.

// MyApp.getInitialProps = async (appContext: AppContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);

//   return { ...appProps }
// }

export default App
