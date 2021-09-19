import type { ReactElement } from 'react'
import Head from 'next/head'

// import contianers
import HomeContainer from 'containers/Home/Home.container'

const Index = (): ReactElement => (
    <div>
        <Head>
            <title>Dalmine</title>
            <meta property="og:title" content="My page title" key="title" />
            {
                // assets to preload
                [
                    'fonts/Sansation_Bold.ttf',
                    'fonts/Sansation_Regular.ttf',
                    'fonts/Sansation_Light.ttf',
                ].map((assetPath) => (
                    <link
                        key={assetPath}
                        rel="preload"
                        href={`/assets/${assetPath}`}
                        as="font"
                        crossOrigin=""
                    />
                ))
            }
        </Head>

        {/* if app grows add routing here to render different containers */}
        <HomeContainer />
    </div>
)

export default Index
