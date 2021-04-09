import Head from 'next/head';
import React from 'react';
import { Header, Table, Rating } from 'semantic-ui-react';

import { SearchableTable, ITableConfigRow } from '../components/searchabletable';
import FixedMenuLayout from '../components/FixedMenuLayout';

import { getItemsStaticProps } from '../utils/ssr';

import { itemMatchesSearchFilter } from '../utils/filtering';

const tableConfig: ITableConfigRow[] = [
	{ width: 3, column: 'locName', title: 'Item', pseudocolumns: ['locName', 'description'] },
	{ width: 1, column: 'rarity', title: 'Rarity' },
	{ width: 1, column: 'category', title: 'Category' },
	{ width: 1, column: 'Currency Type', title: 'currencyType' }
];

const renderTableRow = (item: any) => {
	return (<Table.Row key={item.id}>
		<Table.Cell>
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: '60px auto',
					gridTemplateAreas: `'icon stats' 'icon description'`,
					gridGap: '1px'
				}}>
				<div style={{ gridArea: 'icon' }}>
					<img width={48} src={`/assets/${item.icon}.png`} />
				</div>
				<div style={{ gridArea: 'stats' }}>
					<span style={{ fontWeight: 'bolder', fontSize: '1.25em' }}>{item.locName}</span>
				</div>
				<div style={{ gridArea: 'description' }}>
					<span dangerouslySetInnerHTML={{ __html: item.locDescription }} />
				</div>
			</div>
		</Table.Cell>
		<Table.Cell>
			<Rating rating={item.computed_rarity} maxRating={item.computed_rarity} size='large' disabled />
		</Table.Cell>
		<Table.Cell textAlign='center'>
			{item.category}
		</Table.Cell>
		<Table.Cell textAlign='center'>
			{item.currencyType}
		</Table.Cell>
	</Table.Row>)
}

const ItemList = ({ items, allPosts }) => {
	return (
		<div>
			<Head>
				<title>Star Trek: Legends - Items</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<FixedMenuLayout allPosts={allPosts}>
				<Header as='h1'>Star Trek: Legends Item List</Header>
				<p>This is a work in progress, check <a href="https://github.com/TemporalAgent7/LegendsDataCore">GitHub</a> for updates!</p>

				<SearchableTable
					id="index"
					data={items}
					config={tableConfig}
					renderTableRow={item => renderTableRow(item)}
					filterRow={(item, filter, filterType) => itemMatchesSearchFilter(item, filter, filterType)}
					showFilterOptions={true}
				/>
			</FixedMenuLayout>
		</div>
	)
}

export default ItemList;

export async function getStaticProps() {
	return { props: await getItemsStaticProps() };
}