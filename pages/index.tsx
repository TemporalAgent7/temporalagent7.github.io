import Head from 'next/head';
import React from 'react';
import { Header, Image, Table, Rating, Modal, Button, Icon } from 'semantic-ui-react';

import { SearchableTable, ITableConfigRow } from '../components/searchabletable';
import FixedMenuLayout from '../components/FixedMenuLayout';
import CharacterStats from '../components/CharacterStats';

import { getCharactersStaticProps } from '../utils/ssr';
import { characterMatchesSearchFilter } from '../utils/filtering';

const tableConfig: ITableConfigRow[] = [
	{ width: 3, column: 'locName', title: 'Character', pseudocolumns: ['locName', 'role'] },
	{ width: 1, column: 'computed_rarity', title: 'Rarity' },
	{ width: 1, column: 'MaxHealth', title: 'Max Health' },
	{ width: 1, column: 'MaxDefense', title: 'Max Defense' },
	{ width: 1, column: 'MaxAttack', title: 'Max Attack' },
	{ width: 1, column: 'MaxTech', title: 'Max Tech' },
	{ width: 1, column: 'MaxTotalPower', title: 'Max Total Power' },
];

const renderTableRow = (character: any, onClick) => {
	return (<Table.Row key={character.id} style={{ cursor: 'zoom-in' }} onClick={onClick}>
		<Table.Cell>
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: '60px auto',
					gridTemplateAreas: `'icon stats' 'icon description'`,
					gridGap: '1px'
				}}>
				<div style={{ gridArea: 'icon' }}>
					<img width={48} src={`/assets/${character.icon}.png`} />
				</div>
				<div style={{ gridArea: 'stats' }}>
					<span style={{ fontWeight: 'bolder', fontSize: '1.25em' }}>{character.locName}</span>
				</div>
				<div style={{ gridArea: 'description' }}>
					{character.role}
				</div>
			</div>
		</Table.Cell>
		<Table.Cell>
			<Rating rating={character.computed_rarity} maxRating={character.computed_rarity} size='large' disabled />
		</Table.Cell>
		<Table.Cell textAlign='center'>
			{character.MaxHealth}
		</Table.Cell>
		<Table.Cell textAlign='center'>
			{character.MaxDefense}
		</Table.Cell>
		<Table.Cell textAlign='center'>
			{character.MaxAttack}
		</Table.Cell>
		<Table.Cell textAlign='center'>
			{character.MaxTech}
		</Table.Cell>
		<Table.Cell textAlign='center'>
			{character.MaxTotalPower}
		</Table.Cell>
	</Table.Row>)
}

const CharacterList = ({ characters, allPosts }) => {
	const [open, setOpen] = React.useState(false);
	const [selectedCharacter, setSelectedCharacter] = React.useState(undefined);

	return (
		<div>
			<Head>
				<title>Star Trek: Legends - Characters</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<FixedMenuLayout allPosts={allPosts}>
				<Header as='h1'>Star Trek: Legends Character List</Header>
				<p>This is a work in progress, check <a href="https://github.com/TemporalAgent7/LegendsDataCore">GitHub</a> for updates!</p>

				<SearchableTable
					id="index"
					data={characters}
					config={tableConfig}
					renderTableRow={character => renderTableRow(character, () => { setSelectedCharacter(character); setOpen(true); })}
					filterRow={(character, filter, filterType) => characterMatchesSearchFilter(character, filter, filterType)}
					showFilterOptions={true}
				/>
			</FixedMenuLayout>

			{selectedCharacter && <Modal
				open={open}
				onClose={() => setOpen(false)}
				onOpen={() => setOpen(true)}
			>
				<Modal.Header>{selectedCharacter.locName} ({selectedCharacter.locRarity})</Modal.Header>
				<Modal.Content image scrolling>
					<Image size='medium' src={`/assets/${selectedCharacter.icon}.png`} wrapped />
					<Modal.Description>
						<CharacterStats character={selectedCharacter} />
					</Modal.Description>
				</Modal.Content>
				<Modal.Actions>
					<Button onClick={() => setOpen(false)} primary>
						Close <Icon name='chevron right' />
					</Button>
				</Modal.Actions>
			</Modal>}
		</div>
	)
}

export default CharacterList;

export async function getStaticProps() {
	return { props: await getCharactersStaticProps() };
}