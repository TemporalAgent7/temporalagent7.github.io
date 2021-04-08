import Head from 'next/head';
import React from 'react';
import { Header } from 'semantic-ui-react';

import FixedMenuLayout from '../components/FixedMenuLayout';

const AboutPage = () => {
    return (<div>
        <Head>
            <title>Star Trek: Legends - About</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <FixedMenuLayout>
            <Header as='h1'>Star Trek: Legends Helper</Header>
            <p>This is a work in progress, check <a href="https://github.com/TemporalAgent7/LegendsDataCore">GitHub</a> for updates!</p>

            <p>TODO!</p>
        </FixedMenuLayout>
    </div>);
}

export default AboutPage;