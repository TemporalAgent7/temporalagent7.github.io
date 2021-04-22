import Head from 'next/head';
import { useRouter } from 'next/router'
import React, { useState } from 'react';
import { Header, Image, Segment, List, Icon, Label } from 'semantic-ui-react';
import { Stage, Text, Layer, Arrow, Image as KonvaImage } from 'react-konva';
import useImage from 'use-image';
import ErrorPage from 'next/error';

import { getCharacterIds, getCharacterStaticProps } from '../../utils/ssr';
import FixedMenuLayout from '../../components/FixedMenuLayout';
import CharacterStats from '../../components/CharacterStats';

const CharacterPage = ({ character, allPosts }) => {
	const router = useRouter()
	if (!router.isFallback && !character?.locName) {
		return <ErrorPage statusCode={404} />
	}
	return (<div>
		<FixedMenuLayout allPosts={allPosts}>
			{router.isFallback ? (
				<Header as='h1'>Loading...</Header>
			) : (<>
				<Head>
					<title>Star Trek: Legends Wiki - {character.locName}</title>
					<link rel="icon" href="/favicon.ico" />
				</Head>
				<CharacterStats character={character} />
			</>)}
		</FixedMenuLayout>
	</div>);
}

export default CharacterPage;

export async function getStaticProps({ params }) {
	const characterData = await getCharacterStaticProps(params.slug);

	return {
		props: {
			character: characterData.character,
			allPosts: characterData.allPosts
		},
	}
}

export async function getStaticPaths() {
	const characterIds = await getCharacterIds();

	return {
		paths: characterIds.map((id) => ({
			params: {
				slug: id,
			},
		})),
		fallback: false,
	}
}