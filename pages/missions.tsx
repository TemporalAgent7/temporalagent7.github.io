import { promises as fs } from 'fs';
import path from 'path';

import Head from 'next/head';
import React from 'react';
import { Header, Image } from 'semantic-ui-react';

import { getAllPosts } from '../utils/wiki';

import FixedMenuLayout from '../components/FixedMenuLayout';

const EpisodeDisplay = ({ episode }) => {
    let missions = episode.missions.filter(m => m.difficulty == 'Easy');
    return <div>
        <Header as="h2">{episode.identifier} - {episode.name}</Header>
        <Image size='medium' src={`/assets/${episode.backgroundImage}.png`} />
        {missions.map(mission => <div key={mission.id}>
            <Header as="h3">{mission.name}</Header>
            <p>{mission.objective}</p>
            <p dangerouslySetInnerHTML={{ __html: mission.description }} />
        </div>)}
    </div>;
}

const MissionPage = ({ episodes, allPosts }) => {
    return (
        <div>
            <Head>
                <title>Star Trek: Legends - Missions</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <FixedMenuLayout allPosts={allPosts}>
                <Header as='h1'>Star Trek: Legends Episodes and Missions</Header>
                <p>This is a work in progress, check <a href="https://github.com/TemporalAgent7/LegendsDataCore">GitHub</a> for updates!</p>

                {episodes.map(episode => <EpisodeDisplay episode={episode} key={episode.id} />)}
            </FixedMenuLayout>
        </div>);
}

export default MissionPage;

export async function getStaticProps() {
    const dataDirectory = path.join(process.cwd(), 'data');
    const fileContents = await fs.readFile(path.join(dataDirectory, 'episodes.json'), 'utf8');

    let episodes = JSON.parse(fileContents);

    return { props: { episodes, allPosts: getAllPosts(['title', 'slug']) } };
}