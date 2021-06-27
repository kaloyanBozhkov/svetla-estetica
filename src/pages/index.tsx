import Head from 'next/head'

// import contianers
import HomeContainer from '~/containers/Home/Home.container'

const assetsToPreload = [
    'fonts/Sansation_Bold.ttf',
    'fonts/Sansation_Regular.ttf',
    'fonts/Sansation_Light.ttf',
]

const Index = (): JSX.Element => {
    return (
        <div>
            <Head>
                <title>Dalmine</title>
                <meta property="og:title" content="My page title" key="title" />
                {assetsToPreload.map((assetPath, index) => (
                    <link
                        key={index}
                        rel="preload"
                        href={`/assets/${assetPath}`}
                        as="font"
                        crossOrigin=""
                    />
                ))}
            </Head>

            {/* if app grows add routing here to render different containers */}
            <HomeContainer />
        </div>
    )
}

export default Index
