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
            <p>This is a work in progress, check <a href="https://github.com/TemporalAgent7/LegendsDataCore">GitHub</a> for updates. All feedback is welcome!</p>

            <Header as='h2'>Contact</Header>
            <p>The easiest way to get in touch is by opening issues on <a href="https://github.com/TemporalAgent7/temporalagent7.github.io/issues">GitHub</a>. You can also join the <a href="https://discord.gg/3kaPMDz7Rf">development Discord</a>.</p>

            <Header as='h2'>Licensing</Header>
            <p>This project is built with next.js, React and hard work. It follows the JAMstack architecture by using Git as a single source of truth.</p>
            <p>Assets and some textual elements like names and descriptions are owned by Tilting Point or their licensors. This project is not associated with nor endorsed by Tilting Point.</p>
            <p>Most of the code for the website was originally authored by TemporalAgent7 (c) 2021 and released under the GPL-3 license.</p>
            <p>This project is licensed under GPL-3, and if you choose to contribute code or other media you agree that your contributions will be licensed under its GPL-3 license.</p>
        </FixedMenuLayout>
    </div>);
}

export default AboutPage;