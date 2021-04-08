import { promises as fs } from 'fs';
import path from 'path';

import Head from 'next/head';
import React from 'react';
import { Header, Image, Item, Table, Rating, Modal, Button, Icon, Statistic } from 'semantic-ui-react';

import { SearchableTable, ITableConfigRow } from '../components/searchabletable';

import FixedMenuLayout from '../components/FixedMenuLayout';

const tableConfig: ITableConfigRow[] = [
  { width: 3, column: 'name', title: 'Character', pseudocolumns: ['name', 'role'] },
  { width: 1, column: 'computed_rarity', title: 'Rarity' },
  { width: 1, column: 'MaxHealth', title: 'MaxHealth' },
  { width: 1, column: 'MaxDefense', title: 'MaxDefense' },
  { width: 1, column: 'MaxAttack', title: 'MaxAttack' },
  { width: 1, column: 'MaxTech', title: 'MaxTech' }
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
          <span style={{ fontWeight: 'bolder', fontSize: '1.25em' }}>{character.name}</span>
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
      {Math.round(character.MaxHealth * 100) / 100}
    </Table.Cell>
    <Table.Cell textAlign='center'>
      {Math.round(character.MaxDefense * 100) / 100}
    </Table.Cell>
    <Table.Cell textAlign='center'>
      {Math.round(character.MaxAttack * 100) / 100}
    </Table.Cell>
    <Table.Cell textAlign='center'>
      {Math.round(character.MaxTech * 100) / 100}
    </Table.Cell>
  </Table.Row>)
}

const characterMatchesSearchFilter = (character: any, filters: any[], filterType: string) => {
  if (filters.length == 0)
    return true;

  const filterTypes = {
    'Exact': (input: string, searchString: string) => input.toLowerCase() == searchString.toLowerCase(),
    'Whole word': (input: string, searchString: string) => new RegExp('\\b' + searchString + '\\b', 'i').test(input),
    'Any match': (input: string, searchString: string) => input.toLowerCase().indexOf(searchString.toLowerCase()) >= 0
  };
  const matchesFilter = filterTypes[filterType];
  let meetsAnyCondition = false;

  for (let filter of filters) {
    let meetsAllConditions = true;
    if (filter.conditionArray.length === 0) {
      // text search only
      for (let segment of filter.textSegments) {
        let segmentResult =
          matchesFilter(character.name, segment.text) ||
          character.tags.some(t => matchesFilter(t, segment.text)) ||
          character.bridgeStations.some(t => matchesFilter(t, segment.text));
        meetsAllConditions = meetsAllConditions && (segment.negated ? !segmentResult : segmentResult);
      }
    } else {
      let rarities = [];
      for (let condition of filter.conditionArray) {
        let conditionResult = true;
        if (condition.keyword === 'name') {
          conditionResult = matchesFilter(character.name, condition.value);
        } else if (condition.keyword === 'tag') {
          conditionResult = character.tags.some(t => matchesFilter(t, condition.value));
        } else if (condition.keyword === 'rarity') {
          if (!condition.negated) {
            rarities.push(Number.parseInt(condition.value));
            continue;
          }

          conditionResult = character.computed_rarity === Number.parseInt(condition.value);
        }
        meetsAllConditions = meetsAllConditions && (condition.negated ? !conditionResult : conditionResult);
      }

      if (rarities.length > 0) {
        meetsAllConditions = meetsAllConditions && rarities.includes(character.computed_rarity);
      }

      for (let segment of filter.textSegments) {
        let segmentResult =
          matchesFilter(character.name, segment.text) ||
          character.tags.some(t => matchesFilter(t, segment.text));
        meetsAllConditions = meetsAllConditions && (segment.negated ? !segmentResult : segmentResult);
      }
    }
    if (meetsAllConditions) {
      meetsAnyCondition = true;
      break;
    }
  }

  return meetsAnyCondition;
}

const ItemSkillDisplay = ({ skill, isBridge }) => {
  let effects = skill.effects.filter(entry => entry.effect);
  let hasCasterEffect = !!skill.casterEffect.effect;

  return <Item>
    {skill.img && <Item.Image size='tiny' src={`/assets/${skill.img}.png`} />}
    <Item.Content>
      <Item.Header as='a'>{skill.name} {isBridge && " (Bridge Skill)"} - Level {skill.level} {skill.isPassive ? ' (passive)' : ''}</Item.Header>
      <Item.Description>
        <span dangerouslySetInnerHTML={{ __html: skill.description }} />
        <p><b>Effects: </b>{effects.map(entry => `${entry.effect} (${entry.fraction}x)`).join(', ')}</p>
        {hasCasterEffect && <p><b>Caster effect: </b>{skill.casterEffect.effect} ({skill.casterEffect.fraction}x)</p>}
        <p><b>Target:</b> {skill.targetState} {skill.targetType} {skill.isSingleTarget ? ' (single)' : skill.isMultiRandom ? ' (multi)' : ' (multi random'} <b>Cooldown:</b> {skill.cooldown} ({skill.startingCooldown} start)</p>
      </Item.Description>
    </Item.Content>
  </Item>;
}

const SkillDisplay = ({ skills, isBridge }) => {
  return skills.map((skill) => <ItemSkillDisplay isBridge={isBridge} skill={skill} key={skill.level} />);
}

const Home = ({ characters }) => {
  const [open, setOpen] = React.useState(false);
  const [selectedCharacter, setSelectedCharacter] = React.useState(undefined);

  return (
    <div>
      <Head>
        <title>Star Trek: Legends - Characters</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <FixedMenuLayout>
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
        <Modal.Header>{selectedCharacter.name} ({selectedCharacter.rarity})</Modal.Header>
        <Modal.Content image scrolling>
          <Image size='medium' src={`/assets/${selectedCharacter.icon}.png`} wrapped />

          <Modal.Description>
            <Header as='h4'><span dangerouslySetInnerHTML={{ __html: selectedCharacter.description }} /></Header>
            <p><b>Role:</b> {selectedCharacter.role}</p>
            <p><b>Bridge stations:</b> {selectedCharacter.bridgeStations.join(', ')}</p>
            <p><b>Tags:</b> {selectedCharacter.tags.join(', ')}</p>

            <Statistic.Group size={"small"}>
              <Statistic>
                <Statistic.Value>{selectedCharacter.GlancingChance}</Statistic.Value>
                <Statistic.Label>Glancing Chance</Statistic.Label>
              </Statistic>
              <Statistic>
                <Statistic.Value>{selectedCharacter.GlancingDamage}</Statistic.Value>
                <Statistic.Label>Glancing Damage</Statistic.Label>
              </Statistic>
              <Statistic>
                <Statistic.Value>{selectedCharacter.CritChance}</Statistic.Value>
                <Statistic.Label>Crit Chance</Statistic.Label>
              </Statistic>
              <Statistic>
                <Statistic.Value>{selectedCharacter.CritDamage}</Statistic.Value>
                <Statistic.Label>Crit Damage</Statistic.Label>
              </Statistic>
              <Statistic>
                <Statistic.Value>{selectedCharacter.Resolve}</Statistic.Value>
                <Statistic.Label>Resolve</Statistic.Label>
              </Statistic>
              <Statistic>
                <Statistic.Value>{selectedCharacter.Speed}</Statistic.Value>
                <Statistic.Label>Speed</Statistic.Label>
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
                  <Table.Cell>{selectedCharacter.Health}</Table.Cell>
                  <Table.Cell>{Math.round(selectedCharacter.MaxHealth * 100) / 100}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell><img src="/assets/IconCharStat_Defense.png" style={{ filter: "invert(1)", height: "1em", display: "inline" }} /> Defense</Table.Cell>
                  <Table.Cell>{selectedCharacter.Defense}</Table.Cell>
                  <Table.Cell>{Math.round(selectedCharacter.MaxDefense * 100) / 100}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell><img src="/assets/IconCharStat_Attack.png" style={{ filter: "invert(1)", height: "1em", display: "inline" }} /> Attack</Table.Cell>
                  <Table.Cell>{selectedCharacter.Attack}</Table.Cell>
                  <Table.Cell>{Math.round(selectedCharacter.MaxAttack * 100) / 100}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell><img src="/assets/IconCharStat_Tech.png" style={{ filter: "invert(1)", height: "1em", display: "inline" }} /> Tech</Table.Cell>
                  <Table.Cell>{selectedCharacter.Tech}</Table.Cell>
                  <Table.Cell>{Math.round(selectedCharacter.MaxTech * 100) / 100}</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>

            <Item.Group>
              {selectedCharacter.bridgeSkill && <SkillDisplay isBridge={true} skills={Object.values(selectedCharacter.bridgeSkill)[0]} />}
              {Object.keys(selectedCharacter.skills).map((skill) => <SkillDisplay isBridge={false} key={skill} skills={selectedCharacter.skills[skill]} />)}
            </Item.Group>

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

export default Home;

export async function getStaticProps() {
  const dataDirectory = path.join(process.cwd(), 'data');
  const fileContents = await fs.readFile(path.join(dataDirectory, 'characters.json'), 'utf8');

  let characters = JSON.parse(fileContents);
  characters.forEach((character: any) => {
    switch (character.rarity) {
      case "Common":
        character.computed_rarity = 1;
        break;
      case "Rare":
        character.computed_rarity = 2;
        break;
      case "VeryRare":
        character.computed_rarity = 3;
        break;
      case "Epic":
        character.computed_rarity = 4;
        break;
      case "Legendary":
        character.computed_rarity = 5;
        break;
    }
  });

  return { props: { characters } };
}