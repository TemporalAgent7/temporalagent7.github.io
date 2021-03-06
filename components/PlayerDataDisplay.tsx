import React from 'react';
import { Header, Table, Statistic, Image } from 'semantic-ui-react';

import { SearchableTable, ITableConfigRow } from '../components/searchabletable';
import { characterProfileMatchesSearchFilter } from '../utils/filtering';

const AccessoryDisplay = ({ playerData, index }) => {
	if (index == 0) {
		return <span style={{ color: 'red' }}>NONE</span>;
	} else {
		return (
			<Image
				src={`/assets/NexusParticles_${playerData.accessories[index].accessoryid}.png`}
				alt={playerData.accessories[index].accessoryid}
				size={'tiny'}
				fluid
				label={{ floating: true, circular: true, color: 'green', content: playerData.accessories[index].level }}
			/>
		);
	}
};

const GearDisplay = ({ playerData, index, gearIcons }) => {
	if (index == 0) {
		return <span style={{ color: 'red' }}>NONE</span>;
	} else {
		return (
			<Image
				src={`/assets/${gearIcons[playerData.gears[index].gearid].m_Icon}.png`}
				alt={playerData.gears[index].gearid}
				size={'tiny'}
				fluid
				label={{ floating: true, circular: true, color: 'green', content: playerData.gears[index].level }}
			/>
		);
	}
};

const CharacterRender = ({ char, allCharacters }) => {
	if (!char) {
		return <span style={{ color: 'red' }}>NONE</span>;
	}

	let charData = allCharacters.find((c) => c.id == char);

	if (!charData) {
		return <span style={{ color: 'red' }}>{char}</span>;
	}

	return (
		<div
			style={{
				display: 'grid',
				gridTemplateColumns: '40px auto',
				gridTemplateAreas: `'icon stats'`,
				gridGap: '1px'
			}}>
			<div style={{ gridArea: 'icon' }}>
				<img width={32} src={`/assets/${charData.icon}.png`} />
			</div>
			<div style={{ gridArea: 'stats' }}>
				<span style={{ fontWeight: 'bolder', fontSize: '1.25em' }}>{charData.locName}</span>
			</div>
		</div>
	);
};

const gearCharacterAssignment = (playerData, gearId) => {
	for (let unit in playerData.units) {
		if (
			playerData.units[unit].gears['_0'] == gearId ||
			playerData.units[unit].gears['_1'] == gearId ||
			playerData.units[unit].gears['_2'] == gearId ||
			playerData.units[unit].gears['_3'] == gearId
		) {
			return unit;
		}
	}

	return undefined;
};

const accessoryCharacterAssignment = (playerData, accessoryId) => {
	for (let unit in playerData.units) {
		if (playerData.units[unit].accessories['_0'] == accessoryId || playerData.units[unit].accessories['_1'] == accessoryId) {
			return unit;
		}
	}

	return undefined;
};

const MissionStatus = ({ data }) => {
	if (!data) {
		return <span style={{ color: 'red' }}>ERROR</span>;
	}

	if (data.complete) {
		return <span>{data.complete_pct}% complete</span>;
	} else {
		return <span style={{ color: 'red' }}>NOT complete</span>;
	}
};

const gearTableConfig: ITableConfigRow[] = [
	{ width: 3, column: 'name', title: 'Gear' },
	{ width: 1, column: 'level', title: 'Level' },
	{ width: 3, column: 'char', title: 'Character' }
];

const accessoryTableConfig: ITableConfigRow[] = [
	{ width: 3, column: 'name', title: 'Particle' },
	{ width: 1, column: 'level', title: 'Level' },
	{ width: 3, column: 'char', title: 'Character' },
	{ width: 1, column: 'stat1', title: 'Stat 1' },
	{ width: 1, column: 'stat2', title: 'Stat 2' },
	{ width: 1, column: 'stat3', title: 'Stat 3' },
	{ width: 1, column: 'stat4', title: 'Stat 4' }
];

const characterTableConfig: ITableConfigRow[] = [
	{ width: 3, column: 'name', title: 'Character' },
	{ width: 1, column: 'xp', title: 'Xp' },
	{ width: 1, column: 'level', title: 'Level' },
	{ width: 1, column: 'rank', title: 'Rank' },
	{ width: 1, column: 'power', title: 'Power' },
	{ width: 1, column: 'shards', title: 'Shards' },
	{ width: 1, column: 'accessory1', title: 'Particle 1' },
	{ width: 1, column: 'accessory2', title: 'Particle 2' },
	{ width: 1, column: 'gear1', title: 'Gear 1' },
	{ width: 1, column: 'gear2', title: 'Gear 2' },
	{ width: 1, column: 'gear3', title: 'Gear 3' },
	{ width: 1, column: 'gear4', title: 'Gear 4' },
	{ width: 1, column: 'skills', title: 'Skills' }
];

const visibilityMap = {
	Common: [1, 2, 2, 2, 2],
	Rare: [1, 2, 2, 2, 2],
	VeryRare: [1, 2, 2, 3, 3],
	Epic: [2, 3, 3, 4, 4],
	Legendary: [2, 3, 3, 4, 4]
};

const filterStat = (stat, index: number, accessoryid: string, level: number) => {
	const rarity = accessoryid.substr(accessoryid.indexOf('_') + 1);

	if (visibilityMap[rarity][level - 1] >= index) {
		return stat;
	} else {
		return '-';
	}
};

export const PlayerDataDisplay = ({ playerData, gearIcons, levels, allCharacters }) => {
	let gearTableData = playerData
		? Object.keys(playerData.gears).map((gearId) => ({
				gearId,
				name: playerData.gears[gearId].gearid,
				level: playerData.gears[gearId].level,
				char: gearCharacterAssignment(playerData, gearId)
		  }))
		: [];

	const levelFromXp = (xp: number) => {
		let lastLevel = 1;
		for (let l in levels) {
			if (xp >= levels[l]) {
				lastLevel = Number.parseInt(l);
			}
		}
		return lastLevel;
	};

	let accessoryTableData = playerData
		? Object.keys(playerData.accessories).map((accessoryId) => ({
				accessoryId,
				name: playerData.accessories[accessoryId].accessoryid,
				level: playerData.accessories[accessoryId].level,
				char: accessoryCharacterAssignment(playerData, accessoryId),
				stat1: playerData.accessories[accessoryId].stats['_0'],
				stat2: filterStat(
					playerData.accessories[accessoryId].stats['_1'],
					2,
					playerData.accessories[accessoryId].accessoryid,
					playerData.accessories[accessoryId].level
				),
				stat3: filterStat(
					playerData.accessories[accessoryId].stats['_2'],
					3,
					playerData.accessories[accessoryId].accessoryid,
					playerData.accessories[accessoryId].level
				),
				stat4: filterStat(
					playerData.accessories[accessoryId].stats['_3'],
					4,
					playerData.accessories[accessoryId].accessoryid,
					playerData.accessories[accessoryId].level
				)
		  }))
		: [];

	let characterTableData = playerData
		? Object.keys(playerData.units).map((char) => ({
				char,
				name: char,
				xp: playerData.units[char].xp,
				level: levelFromXp(playerData.units[char].xp),
				rank: playerData.units[char].rank,
				power: playerData.units[char].power,
				shards: (playerData.items && playerData.items[char]) || 0,
				accessory1: playerData.units[char].accessories['_0'],
				accessory2: playerData.units[char].accessories['_1'],
				gear1: playerData.units[char].gears['_0'],
				gear2: playerData.units[char].gears['_1'],
				gear3: playerData.units[char].gears['_2'],
				gear4: playerData.units[char].gears['_3'],
				skills: Object.keys(playerData.units[char].skills)
					.map((skill) => `Level ${playerData.units[char].skills[skill]} ${skill}`)
					.join(', ')
		  }))
		: [];

	return (
		<div>
			<p>Level: {playerData.last_level_rewarded}</p>

			{playerData.items && (
				<Statistic.Group size={'small'}>
					<Statistic>
						<Statistic.Value>{playerData.items.Dilithium}</Statistic.Value>
						<Statistic.Label>
							<img src='/assets/Dilithium.png' style={{ filter: 'invert(1)', height: '1em', display: 'inline' }} /> Dilithium
						</Statistic.Label>
					</Statistic>
					<Statistic>
						<Statistic.Value>{playerData.items.Latinum}</Statistic.Value>
						<Statistic.Label>
							<img src='/assets/Latinum.png' style={{ filter: 'invert(1)', height: '1em', display: 'inline' }} /> Latinum
						</Statistic.Label>
					</Statistic>
					<Statistic>
						<Statistic.Value>{playerData.items.Medal}</Statistic.Value>
						<Statistic.Label>
							<img src='/assets/Medal.png' style={{ filter: 'invert(1)', height: '1em', display: 'inline' }} /> Medal
						</Statistic.Label>
					</Statistic>
					<Statistic>
						<Statistic.Value>{playerData.items['Player XP']}</Statistic.Value>
						<Statistic.Label>
							<img src='/assets/Xp.png' style={{ filter: 'invert(1)', height: '1em', display: 'inline' }} /> Player XP
						</Statistic.Label>
					</Statistic>
					<Statistic>
						<Statistic.Value>{playerData.items['Power Cell']}</Statistic.Value>
						<Statistic.Label>
							<img src='/assets/PowerCell.png' style={{ filter: 'invert(1)', height: '1em', display: 'inline' }} /> Power Cell
						</Statistic.Label>
					</Statistic>
					<Statistic>
						<Statistic.Value>{playerData.items['Trellium-D']}</Statistic.Value>
						<Statistic.Label>
							<img src='/assets/Gearupgrade_Ore_TrelliumD.png' style={{ filter: 'invert(1)', height: '1em', display: 'inline' }} />{' '}
							Trellium-D
						</Statistic.Label>
					</Statistic>
					<Statistic>
						<Statistic.Value>{playerData.items['Xenylon']}</Statistic.Value>
						<Statistic.Label>
							<img src='/assets/Gearupgrade_Cloth_Xenylon.png' style={{ filter: 'invert(1)', height: '1em', display: 'inline' }} /> Xenylon
						</Statistic.Label>
					</Statistic>
					<Statistic>
						<Statistic.Value>{playerData.items['Duranium']}</Statistic.Value>
						<Statistic.Label>
							<img src='/assets/Gearupgrade_Ore_Duranium.png' style={{ filter: 'invert(1)', height: '1em', display: 'inline' }} /> Duranium
						</Statistic.Label>
					</Statistic>
					<Statistic>
						<Statistic.Value>{playerData.items['Andorian Silk']}</Statistic.Value>
						<Statistic.Label>
							<img src='/assets/Gearupgrade_Cloth_AndorianSilk.png' style={{ filter: 'invert(1)', height: '1em', display: 'inline' }} />{' '}
							Andorian Silk
						</Statistic.Label>
					</Statistic>
					<Statistic>
						<Statistic.Value>{playerData.items['Antineutron']}</Statistic.Value>
						<Statistic.Label>
							<img src='/assets/Gearupgrade_Antimatter_Neutron.png' style={{ filter: 'invert(1)', height: '1em', display: 'inline' }} />{' '}
							Antineutron
						</Statistic.Label>
					</Statistic>
					<Statistic>
						<Statistic.Value>{playerData.items['Antiproton']}</Statistic.Value>
						<Statistic.Label>
							<img src='/assets/Gearupgrade_Antimatter_Proton.png' style={{ filter: 'invert(1)', height: '1em', display: 'inline' }} />{' '}
							Antiproton
						</Statistic.Label>
					</Statistic>
				</Statistic.Group>
			)}
			<br />

			<Header as='h3'>Characters</Header>

			<SearchableTable
				id='tools_chars'
				data={characterTableData}
				config={characterTableConfig}
				renderTableRow={(character) => (
					<Table.Row key={character.char}>
						<Table.Cell>
							<CharacterRender char={character.char} allCharacters={allCharacters} />
						</Table.Cell>
						<Table.Cell>{character.xp}</Table.Cell>
						<Table.Cell>{character.level}</Table.Cell>
						<Table.Cell>{character.rank}</Table.Cell>
						<Table.Cell>{character.power}</Table.Cell>
						<Table.Cell>{character.shards}</Table.Cell>
						<Table.Cell>
							<AccessoryDisplay playerData={playerData} index={character.accessory1} />
						</Table.Cell>
						<Table.Cell>
							<AccessoryDisplay playerData={playerData} index={character.accessory2} />
						</Table.Cell>
						<Table.Cell>
							<GearDisplay gearIcons={gearIcons} playerData={playerData} index={character.gear1} />
						</Table.Cell>
						<Table.Cell>
							<GearDisplay gearIcons={gearIcons} playerData={playerData} index={character.gear2} />
						</Table.Cell>
						<Table.Cell>
							<GearDisplay gearIcons={gearIcons} playerData={playerData} index={character.gear3} />
						</Table.Cell>
						<Table.Cell>
							<GearDisplay gearIcons={gearIcons} playerData={playerData} index={character.gear4} />
						</Table.Cell>
						<Table.Cell>{character.skills}</Table.Cell>
					</Table.Row>
				)}
				showFilterOptions={false}
				filterRow={(character, filter, filterType) => characterProfileMatchesSearchFilter(character, filter, filterType)}
			/>

			<Header as='h3'>Mission completion</Header>

			<Table sortable celled selectable striped collapsing unstackable compact='very'>
				<Table.Header>
					<Table.Row>
						<Table.HeaderCell>Mission</Table.HeaderCell>
						<Table.HeaderCell>Easy</Table.HeaderCell>
						<Table.HeaderCell>Advanced</Table.HeaderCell>
						<Table.HeaderCell>Expert</Table.HeaderCell>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{Object.keys(playerData.missions).map((mission) => (
						<Table.Row key={mission}>
							<Table.Cell>{mission}</Table.Cell>
							<Table.Cell>
								<MissionStatus data={playerData.missions[mission].Easy} />
							</Table.Cell>
							<Table.Cell>
								<MissionStatus data={playerData.missions[mission].Hard} />
							</Table.Cell>
							<Table.Cell>
								<MissionStatus data={playerData.missions[mission].Doom} />
							</Table.Cell>
						</Table.Row>
					))}
				</Table.Body>
			</Table>

			<Header as='h3'>Gears</Header>

			<SearchableTable
				id='tools_gears'
				data={gearTableData}
				config={gearTableConfig}
				renderTableRow={(gear) => (
					<Table.Row key={gear.gearId}>
						<Table.Cell>{gear.name}</Table.Cell>
						<Table.Cell>{gear.level}</Table.Cell>
						<Table.Cell>
							<CharacterRender char={gear.char} allCharacters={allCharacters} />
						</Table.Cell>
					</Table.Row>
				)}
				showFilterOptions={false}
				filterRow={(gear, filter, filterType) => true}
			/>

			<Header as='h3'>Particles</Header>

			<SearchableTable
				id='tools_accessories'
				data={accessoryTableData}
				config={accessoryTableConfig}
				renderTableRow={(accessory) => (
					<Table.Row key={accessory.accessoryId}>
						<Table.Cell>{accessory.name}</Table.Cell>
						<Table.Cell>{accessory.level}</Table.Cell>
						<Table.Cell>
							<CharacterRender char={accessory.char} allCharacters={allCharacters} />
						</Table.Cell>
						<Table.Cell>{accessory.stat1}</Table.Cell>
						<Table.Cell>{accessory.stat2}</Table.Cell>
						<Table.Cell>{accessory.stat3}</Table.Cell>
						<Table.Cell>{accessory.stat4}</Table.Cell>
					</Table.Row>
				)}
				showFilterOptions={false}
				filterRow={(accessory, filter, filterType) => true}
			/>
		</div>
	);
};
