import React from 'react';
import { Header, Item, Table, Statistic } from 'semantic-ui-react';

const ItemSkillDisplay = ({ skill, isBridge }) => {
	let effects = skill.effects.filter(entry => entry.effect);
	let hasCasterEffect = !!skill.casterEffect.effect;

	return <Item>
		{skill.img && <Item.Image size='tiny' src={`/assets/${skill.img}.png`} />}
		<Item.Content>
			<Item.Header as='a'>{skill.locName} {isBridge && " (Bridge Skill)"} - Level {skill.level} {skill.isPassive ? ' (passive)' : ''}</Item.Header>
			<Item.Description>
				<span dangerouslySetInnerHTML={{ __html: skill.locDescription }} />
				<p><b>Effects: </b>{effects.map(entry => `${entry.effect} (${entry.fraction}x)`).join(', ')}</p>
				{hasCasterEffect && <p><b>Caster effect: </b>{skill.casterEffect.effect} ({skill.casterEffect.fraction}x)</p>}
				<p><b>Target:</b> {(skill.numTargets == 0) ? "All" : skill.numTargets} {skill.targetState} {skill.targetType} {skill.isSingleTarget ? ' (single)' : skill.isMultiRandom ? ' (multiple random)' : ' (multiple)'} <b>Cooldown:</b> {skill.cooldown} ({skill.startingCooldown} start)</p>
			</Item.Description>
		</Item.Content>
	</Item>;
}

const SkillDisplay = ({ skills, isBridge }) => {
	return skills.map((skill) => <ItemSkillDisplay isBridge={isBridge} skill={skill} key={skill.level} />);
}

const CharacterStats = ({ character }) => {
	return <>
		<Item.Group>
			<Item>
				<Item.Image src={`/assets/${character.icon}.png`} />
				<Item.Content>
					<Item.Header>{character.locName}</Item.Header>
					<Item.Meta><span dangerouslySetInnerHTML={{ __html: character.locDescription }} /></Item.Meta>
					<Item.Description>
						<p><b>Role:</b> <img src={`/assets/Class_${character.role}.png`} style={{ filter: "invert(1)", height: "1em", display: "inline" }} /> {character.role}</p>
						<p><b>Bridge stations:</b> {character.bridgeStations.join(', ')}</p>
					</Item.Description>
					<Item.Extra><b>Tags:</b> {character.tags.join(', ')}</Item.Extra>
				</Item.Content>
			</Item>
		</Item.Group>

		<Statistic.Group size={"small"}>
			<Statistic>
				<Statistic.Value>{Math.floor(character.GlancingChance * 100)}%</Statistic.Value>
				<Statistic.Label><img src="/assets/Icon_GlancePercent.png" style={{ filter: "invert(1)", height: "1em", display: "inline" }} /> Glancing Chance</Statistic.Label>
			</Statistic>
			<Statistic>
				<Statistic.Value>{Math.floor(character.GlancingDamage * 100)}%</Statistic.Value>
				<Statistic.Label><img src="/assets/Icon_Glance.png" style={{ filter: "invert(1)", height: "1em", display: "inline" }} /> Glancing Damage</Statistic.Label>
			</Statistic>
			<Statistic>
				<Statistic.Value>{Math.floor(character.CritChance * 100)}%</Statistic.Value>
				<Statistic.Label><img src="/assets/Icon_CritPercent.png" style={{ filter: "invert(1)", height: "1em", display: "inline" }} /> Crit Chance</Statistic.Label>
			</Statistic>
			<Statistic>
				<Statistic.Value>{Math.floor(character.CritDamage * 100)}%</Statistic.Value>
				<Statistic.Label><img src="/assets/Icon_Crit.png" style={{ filter: "invert(1)", height: "1em", display: "inline" }} /> Crit Damage</Statistic.Label>
			</Statistic>
			<Statistic>
				<Statistic.Value>{Math.floor(character.Resolve * 100)}%</Statistic.Value>
				<Statistic.Label><img src="/assets/Icon_Resolve.png" style={{ filter: "invert(1)", height: "1em", display: "inline" }} /> Resolve</Statistic.Label>
			</Statistic>
		</Statistic.Group>

		<br />

		<Table definition>
			<Table.Header>
				<Table.Row>
					<Table.HeaderCell>Statistic</Table.HeaderCell>
					<Table.HeaderCell>Base Value (Rank 1, Level 1)</Table.HeaderCell>
					<Table.HeaderCell>Max Value (Rank 9, Level 99)</Table.HeaderCell>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				<Table.Row>
					<Table.Cell><img src="/assets/IconCharStat_Health.png" style={{ filter: "invert(1)", height: "1em", display: "inline" }} /> Health</Table.Cell>
					<Table.Cell>{character.Health}</Table.Cell>
					<Table.Cell>{character.MaxHealth}</Table.Cell>
				</Table.Row>
				<Table.Row>
					<Table.Cell><img src="/assets/IconCharStat_Defense.png" style={{ filter: "invert(1)", height: "1em", display: "inline" }} /> Defense</Table.Cell>
					<Table.Cell>{character.Defense}</Table.Cell>
					<Table.Cell>{character.MaxDefense}</Table.Cell>
				</Table.Row>
				<Table.Row>
					<Table.Cell><img src="/assets/IconCharStat_Attack.png" style={{ filter: "invert(1)", height: "1em", display: "inline" }} /> Attack</Table.Cell>
					<Table.Cell>{character.Attack}</Table.Cell>
					<Table.Cell>{character.MaxAttack}</Table.Cell>
				</Table.Row>
				<Table.Row>
					<Table.Cell><img src="/assets/IconCharStat_Tech.png" style={{ filter: "invert(1)", height: "1em", display: "inline" }} /> Tech</Table.Cell>
					<Table.Cell>{character.Tech}</Table.Cell>
					<Table.Cell>{character.MaxTech}</Table.Cell>
				</Table.Row>
				<Table.Row>
					<Table.Cell><img src="/assets/IconCharStat_Speed.png" style={{ filter: "invert(1)", height: "1em", display: "inline" }} /> Speed</Table.Cell>
					<Table.Cell>{character.Speed}</Table.Cell>
					<Table.Cell>{character.MaxSpeed}</Table.Cell>
				</Table.Row>
			</Table.Body>
		</Table>

		<Item.Group>
			{character.bridgeSkill && <SkillDisplay isBridge={true} skills={Object.values(character.bridgeSkill)[0]} />}
			{Object.keys(character.skills).map((skill) => <SkillDisplay isBridge={false} key={skill} skills={character.skills[skill]} />)}
		</Item.Group>

		<Header as='h3'>Quips</Header>
		{character.quips.map(quip => <p key={quip.id}><b>{quip.type}</b> {(quip.reactionTo != "None") && `(${quip.reactionTo})`} {quip.locText}</p>)}
	</>
}

export default CharacterStats;