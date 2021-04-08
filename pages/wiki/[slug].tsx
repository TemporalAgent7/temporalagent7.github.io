import Head from 'next/head';
import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import React from 'react';
import { Header } from 'semantic-ui-react';

import { getPostBySlug, getAllPosts } from '../../utils/wiki';
import markdownToHtml from '../../utils/markdownToHtml';
import FixedMenuLayout from '../../components/FixedMenuLayout';

const WikiPage = ({ post, allPosts }) => {
	const router = useRouter()
	if (!router.isFallback && !post?.slug) {
		return <ErrorPage statusCode={404} />
	}
	return (<div>
		<FixedMenuLayout allPosts={allPosts}>
			{router.isFallback ? (
				<Header as='h1'>Loading...</Header>
			) : (<>
				<Head>
					<title>Star Trek: Legends Wiki - {post.title}</title>
					<link rel="icon" href="/favicon.ico" />
				</Head>
				<Header as='h1'>{post.title}</Header>
				<div dangerouslySetInnerHTML={{ __html: post.content }} />
			</>)}
		</FixedMenuLayout>
	</div>);
}

export default WikiPage;

export async function getStaticProps({ params }) {
	const post = getPostBySlug(params.slug, [
		'title',
		'date',
		'slug',
		'author',
		'content'
	])
	const content = await markdownToHtml(post.content || '')

	return {
		props: {
			post: {
				...post,
				content,
			},
			allPosts: getAllPosts(['title', 'slug'])
		},
	}
}

export async function getStaticPaths() {
	const posts = getAllPosts(['slug']);

	return {
		paths: posts.map((post) => {
			return {
				params: {
					slug: post.slug,
				},
			}
		}),
		fallback: false,
	}
}