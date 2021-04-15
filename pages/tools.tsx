import Head from 'next/head';
import React, { useState } from 'react';
import { Header, Table, Statistic } from 'semantic-ui-react';
import { FileDrop } from 'react-file-drop';

import FixedMenuLayout from '../components/FixedMenuLayout';

import { getAllPosts } from '../utils/wiki';
import { parse } from '../utils/parser';

const renderAccessory = (playerData, index) => {
	if (index == 0) {
		return "NONE";
	} else {
		return `Level ${playerData.accessories[index].level} ${playerData.accessories[index].accessoryid}`;
	}
}

const renderGear = (playerData, index) => {
	if (index == 0) {
		return "NONE";
	} else {
		return `Level ${playerData.gears[index].level} ${playerData.gears[index].gearid}`;
	}
}

const ToolsPage = ({ allPosts }) => {
	const [playerData, setPlayerData] = useState(undefined);

	const parseFile = (files: FileList) => {
		files.item(0).arrayBuffer().then((arrayData) => {
			let result = parse(arrayData);
			console.log(result);
			setPlayerData(result);
		})
	}

	return (
		<div>
			<Head>
				<title>Star Trek: Legends - Player Tools</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<FixedMenuLayout allPosts={allPosts}>
				<Header as='h1'>Star Trek: Legends Player Tools</Header>
				<p>This is a work in progress, check <a href="https://github.com/TemporalAgent7/LegendsDataCore">GitHub</a> for updates!</p>
				{!playerData && <p>This lets you export your current game status (character list, etc.) to a human readable format for analysis. It only works on macOS computers; to use it drop your saved game below. The saved game path is usually <b>/Users/[you]]/Library/Containers/com.tiltingpoint.startrek/Data/Library/Preferences/com.tiltingpoint.startrek.plist</b> on your mac computer.</p>}

				{playerData && <p>Your saved game was succesfully loaded!</p>}

				{!playerData && <div style={{ border: '1px solid black', width: 600, color: 'black', padding: 20 }}>
					<FileDrop onDrop={(files) => parseFile(files)} >
						Drop the save-game here!
        			</FileDrop>
				</div>}

				{playerData &&
					<div>
						<p>Level: {playerData.last_level_rewarded}</p>

						<Statistic.Group size={"small"}>
							<Statistic>
								<Statistic.Value>{playerData.items.Credits}</Statistic.Value>
								<Statistic.Label><img src="/assets/Credits.png" style={{ filter: "invert(1)", height: "1em", display: "inline" }} /> Credits</Statistic.Label>
							</Statistic>
							<Statistic>
								<Statistic.Value>{playerData.items.Dilithium}</Statistic.Value>
								<Statistic.Label><img src="/assets/Dilithium.png" style={{ filter: "invert(1)", height: "1em", display: "inline" }} /> Dilithium</Statistic.Label>
							</Statistic>
							<Statistic>
								<Statistic.Value>{playerData.items.Latinum}</Statistic.Value>
								<Statistic.Label><img src="/assets/Latinum.png" style={{ filter: "invert(1)", height: "1em", display: "inline" }} /> Latinum</Statistic.Label>
							</Statistic>
							<Statistic>
								<Statistic.Value>{playerData.items.Medal}</Statistic.Value>
								<Statistic.Label><img src="/assets/Medal.png" style={{ filter: "invert(1)", height: "1em", display: "inline" }} /> Medal</Statistic.Label>
							</Statistic>
							<Statistic>
								<Statistic.Value>{playerData.items["Player XP"]}</Statistic.Value>
								<Statistic.Label><img src="/assets/Xp.png" style={{ filter: "invert(1)", height: "1em", display: "inline" }} /> Player XP</Statistic.Label>
							</Statistic>
							<Statistic>
								<Statistic.Value>{playerData.items["Power Cell"]}</Statistic.Value>
								<Statistic.Label><img src="/assets/PowerCell.png" style={{ filter: "invert(1)", height: "1em", display: "inline" }} /> Power Cell</Statistic.Label>
							</Statistic>
							<Statistic>
								<Statistic.Value>{playerData.items["PvP Stamina"]}</Statistic.Value>
								<Statistic.Label><img src="/assets/PvPStamina.png" style={{ filter: "invert(1)", height: "1em", display: "inline" }} /> PvP Stamina</Statistic.Label>
							</Statistic>
							<Statistic>
								<Statistic.Value>{playerData.items["Trellium-D"]}</Statistic.Value>
								<Statistic.Label><img src="/assets/Gearupgrade_Ore_TrelliumD.png" style={{ filter: "invert(1)", height: "1em", display: "inline" }} /> Trellium-D</Statistic.Label>
							</Statistic>
							<Statistic>
								<Statistic.Value>{playerData.items["Xenylon"]}</Statistic.Value>
								<Statistic.Label><img src="/assets/Gearupgrade_Cloth_Xenylon.png" style={{ filter: "invert(1)", height: "1em", display: "inline" }} /> Xenylon</Statistic.Label>
							</Statistic>
							<Statistic>
								<Statistic.Value>{playerData.items["Duranium"]}</Statistic.Value>
								<Statistic.Label><img src="/assets/Gearupgrade_Ore_Duranium.png" style={{ filter: "invert(1)", height: "1em", display: "inline" }} /> Duranium</Statistic.Label>
							</Statistic>
							<Statistic>
								<Statistic.Value>{playerData.items["Andorian Silk"]}</Statistic.Value>
								<Statistic.Label><img src="/assets/Gearupgrade_Cloth_AndorianSilk.png" style={{ filter: "invert(1)", height: "1em", display: "inline" }} /> Andorian Silk</Statistic.Label>
							</Statistic>
							<Statistic>
								<Statistic.Value>{playerData.items["Antineutron"]}</Statistic.Value>
								<Statistic.Label><img src="/assets/Gearupgrade_Antimatter_Neutron.png" style={{ filter: "invert(1)", height: "1em", display: "inline" }} /> Antineutron</Statistic.Label>
							</Statistic>
							<Statistic>
								<Statistic.Value>{playerData.items["Antiproton"]}</Statistic.Value>
								<Statistic.Label><img src="/assets/Gearupgrade_Antimatter_Proton.png" style={{ filter: "invert(1)", height: "1em", display: "inline" }} /> Antiproton</Statistic.Label>
							</Statistic>
						</Statistic.Group>
						<br /><br />

						<p>TODO! Format the data!</p>

						<br/>

						<Table sortable celled selectable striped collapsing unstackable compact="very">
							<Table.Header><Table.Row>
								<Table.HeaderCell>Character</Table.HeaderCell>
								<Table.HeaderCell>Xp</Table.HeaderCell><Table.HeaderCell>Rank</Table.HeaderCell>
								<Table.HeaderCell>Particle 1</Table.HeaderCell>
								<Table.HeaderCell>Particle 2</Table.HeaderCell>
								<Table.HeaderCell>Gear 1</Table.HeaderCell>
								<Table.HeaderCell>Gear 2</Table.HeaderCell>
								<Table.HeaderCell>Gear 3</Table.HeaderCell>
								<Table.HeaderCell>Gear 4</Table.HeaderCell>
								<Table.HeaderCell>Skills</Table.HeaderCell>
							</Table.Row>
							</Table.Header>
							<Table.Body>
								{Object.keys(playerData.units).map((char) =>
								(<Table.Row key={char}>
									<Table.Cell>{char}</Table.Cell>
									<Table.Cell>{playerData.units[char].xp}</Table.Cell>
									<Table.Cell>{playerData.units[char].rank}</Table.Cell>
									<Table.Cell>{renderAccessory(playerData, playerData.units[char].accessories["_0"])}</Table.Cell>
									<Table.Cell>{renderAccessory(playerData, playerData.units[char].accessories["_1"])}</Table.Cell>
									<Table.Cell>{renderGear(playerData, playerData.units[char].gears["_0"])}</Table.Cell>
									<Table.Cell>{renderGear(playerData, playerData.units[char].gears["_1"])}</Table.Cell>
									<Table.Cell>{renderGear(playerData, playerData.units[char].gears["_2"])}</Table.Cell>
									<Table.Cell>{renderGear(playerData, playerData.units[char].gears["_3"])}</Table.Cell>
									<Table.Cell>{Object.keys(playerData.units[char].skills).map(skill => `Level ${playerData.units[char].skills[skill]} ${skill}`).join(', ')}</Table.Cell>
								</Table.Row>))}
							</Table.Body>
						</Table>
					</div>}

			</FixedMenuLayout>
		</div>
	)
}

export default ToolsPage;

export async function getStaticProps() {
	return { props: { allPosts: getAllPosts(['title', 'slug']) } };
}