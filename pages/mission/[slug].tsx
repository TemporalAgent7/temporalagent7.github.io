import Head from 'next/head';
import { useRouter } from 'next/router'
import React, { useState } from 'react';
import { Header, Image, Segment, List, Icon, Label } from 'semantic-ui-react';
import { Stage, Text, Layer, Arrow, Image as KonvaImage } from 'react-konva';
import useImage from 'use-image';
import ErrorPage from 'next/error';

import { getMissionsStaticProps } from '../../utils/ssr';
import FixedMenuLayout from '../../components/FixedMenuLayout';

const NODE_IMAGE_SIZE = 48;

function imageForType(type: string) {
	switch(type) {
		case "Encounter": return "MapNode_Image_Encounter";
		case "Story": return "MapNode_Image_Story";
		case "Resource": return "MapNode_Image_LootCrate";
		case "Opportunity": return "MapNode_Image_Shuttle"; //?
		default: return "MapNode_Image_Encounter";
	}
}

const MapNodeImage = ({ x, y, onClicked, selected, type }) => {
	const [image] = useImage(`/assets/MapNode.png`);
	const [overlayImage] = useImage(`/assets/${imageForType(type)}.png`);
	const [imageSelected] = useImage(`/assets/MapNode_Active.png`); // MapNode_Complete
	return (<>
		<KonvaImage
			x={x}
			y={y}
			width={NODE_IMAGE_SIZE}
			height={NODE_IMAGE_SIZE}
			image={selected ? imageSelected : image}
			onClick={() => onClicked()}
			onTouchStart={() => onClicked()}
		/>
		<KonvaImage
			x={x + NODE_IMAGE_SIZE /4}
			y={y + NODE_IMAGE_SIZE /4}
			width={NODE_IMAGE_SIZE / 2}
			height={NODE_IMAGE_SIZE / 2}
			image={overlayImage}
			onClick={() => onClicked()}
			onTouchStart={() => onClicked()}
		/>
		</>
	);
};

const ISSERVER = typeof window === 'undefined';

class ConnectingNode {
	id: string;
	index: string;
}

class NodePosition {
	x: number;
	y: number;
	type: string;
	nextNodeIds: ConnectingNode[];
}

const MissionCanvasDisplay = ({ nodes, onNodeSelected }) => {
	if (ISSERVER) {
		return <span />;
	}

	const sortedX = nodes.map((n) => n.position.x).sort((a, b) => b - a);
	const sortedY = nodes.map((n) => n.position.y).sort((a, b) => b - a);

	let minX = sortedX[sortedX.length - 1];
	let maxX = sortedX[0];

	let minY = sortedY[sortedY.length - 1];
	let maxY = sortedY[0];

	let origX = maxX - minX;
	let origY = maxY - minY;

	let curX = 400 * origX / origY;
	let curY = 400;

	let translateX = (x: number) => ((x - minX) * curX) / (origX * 2);
	let translateY = (y: number) => curY * 0.05 + ((origY - y + minY) * curY) / (origY * 1.3);

	let nodePositions = new Map<string, NodePosition>();
	nodes.forEach((node) => {
		let entry = { x: translateX(node.position.x), y: translateY(node.position.y), type: node.Type, nextNodeIds: [] };
		node.NextNodeIds.forEach((nn) => {
			let hasExploration = false;
			node.exploration.forEach((e) => {
				if (e.branchingNodeId == nn) {
					// Multiple paths can lead to the same node
					let existing = entry.nextNodeIds.find(e => e.id == nn);
					if (existing) {
						existing.index = `${existing.index}, ${e.index}`;
					} else {
						entry.nextNodeIds.push({
							id: nn,
							index: e.index
						});
					}
					hasExploration = true;
				}
			});

			if (!hasExploration) {
				entry.nextNodeIds.push({
					id: nn,
					index: undefined
				});
			}
		});
		nodePositions.set(node.NodeId, entry);
	});

	const [backgroundImage] = useImage(`/assets/Shop_FrontImage_0.png`);
	const [selected, setSelected] = useState(nodes[0].NodeId);

	return (<div>
		<Stage width={curX / 1.8} height={400} style={{ overflowX: "scroll", overflowY: "hidden", WebkitOverflowScrolling: "touch"}}>
			<Layer>
				<KonvaImage
					opacity={0.35}
					x={0}
					y={0}
					width={curX / 1.8}
					height={400}
					image={backgroundImage}
				/>
				{Array.from(nodePositions.keys()).map((node) => (
					<React.Fragment key={node}>
						{nodePositions.get(node).nextNodeIds.map((nextNode) => (
							<React.Fragment key={nextNode.id}>
								<Arrow
									closed
									stroke={selected == node ? 'green' : 'black'}
									strokeWidth={4}
									x={nodePositions.get(node).x}
									y={nodePositions.get(node).y}
									points={[
										NODE_IMAGE_SIZE / 2,
										NODE_IMAGE_SIZE / 2,
										nodePositions.get(nextNode.id).x + NODE_IMAGE_SIZE / 2 - nodePositions.get(node).x,
										nodePositions.get(nextNode.id).y + NODE_IMAGE_SIZE / 2 - nodePositions.get(node).y
									]}
								/>
								{selected == node && nextNode.index != undefined && (
									<Text
										fontSize={NODE_IMAGE_SIZE / 3}
										x={nodePositions.get(nextNode.id).x + NODE_IMAGE_SIZE / 3}
										y={nodePositions.get(nextNode.id).y - NODE_IMAGE_SIZE / 5}
										text={nextNode.index.toString()}
									/>
								)}
							</React.Fragment>
						))}
						<MapNodeImage
							selected={selected == node}
							type={nodePositions.get(node).type}
							key={node}
							x={nodePositions.get(node).x}
							y={nodePositions.get(node).y}
							onClicked={() => {
								setSelected(node);
								onNodeSelected(node);
							}}
						/>
					</React.Fragment>
				))}
			</Layer>
		</Stage>
	</div>
	);
};

const MissionNodeDisplay = ({ node }) => {
	return (
		<Segment raised>
			<Header as='h4'>
				{node.NodeId} ({node.Type})
			</Header>
			{node.first_reward.Easy && (
				<>
					<Header as='h4'>Rewards</Header>
					<ul>
						{Object.keys(node.first_reward).map((dif) => (
							<li key={dif}>
								<b>{dif}</b>: {node.first_reward[dif]}
							</li>
						))}
					</ul>
					<Header as='h4'>Replay rewards</Header>
					<ul>
						{Object.keys(node.replay_reward).map((dif) => (
							<li key={dif}>
								<b>{dif}</b>: {node.replay_reward[dif]}
							</li>
						))}
					</ul>
				</>
			)}

			{node.battle.Easy && (<>
				<Header as='h4'>Battle cover (extra shields)</Header>
				<ul>
					{Object.keys(node.battle).map((dif) => (
						<li key={dif}>
							<b>{dif}</b>: {node.battle[dif].baseCoverHealth} health for indices {node.battle[dif].coverSlotIndices.join(', ')}
						</li>
					))}
				</ul>
			</>)}

			<List divided relaxed>
				{node.exploration.map((exp) => (
					<List.Item key={exp.difficulty + exp.index}>
						<Image avatar src={`/assets/${exp.iconName}.png`} style={{ filter: 'invert(1)' }} />
						<List.Content>
							<List.Header>
								Path {exp.index} ({exp.locHeaderLoc})
							</List.Header>
							<List.Description>
								{exp.requiredProficiencyValue.Easy > 0 ? (
									<ul>
										{Object.keys(exp.requiredProficiencyValue).map((dif) => (
											<li key={dif}>
												<b>{dif}</b>: requires {exp.requiredProficiencyValue[dif]} {exp.requiredProficiency[dif]}
											</li>
										))}
									</ul>
								) : (
									<span>No required proficiency</span>
								)}
								<p dangerouslySetInnerHTML={{ __html: exp.locReactionDialogueId }} />
								{exp.locResultHeaderLoc} <p dangerouslySetInnerHTML={{ __html: exp.locResultDescLoc }} />
								{exp.bonusEffectId && (
									<p>
										Bonus effect: <b>{exp.bonusEffectId}</b>
									</p>
								)}
								<Header as='h4'>Rewards</Header>
								<ul>
									{Object.keys(exp.first_reward).map((dif) => (
										<li key={dif}>
											<b>{dif}</b>: {exp.first_reward[dif]}
										</li>
									))}
								</ul>
								<Header as='h4'>Replay rewards</Header>
								<ul>
									{Object.keys(exp.replay_reward).map((dif) => (
										<li key={dif}>
											<b>{dif}</b>: {exp.replay_reward[dif]}
										</li>
									))}
								</ul>
							</List.Description>
						</List.Content>
					</List.Item>
				))}
			</List>
			{node.encounter && (
				<div>
					<Image size='tiny' src={`/assets/${node.encounter.previewImage}.png`} />
					<p dangerouslySetInnerHTML={{ __html: node.encounter.locDescription }} />
				</div>
			)}
			{node.cutSceneDialogue.map((dialogue) => (
				<p key={dialogue.dialogueBody}>
					<b>{dialogue.locDialogueHeader}</b> ({dialogue.dialoguePosition}):{' '}
					<span dangerouslySetInnerHTML={{ __html: dialogue.locDialogueBody }} />
				</p>
			))}
			<br />
		</Segment>
	);
};

const MissionDisplay = ({ mission }) => {
	const [selected, setSelected] = useState<string>(Object.keys(mission.nodes)[0]);

	return (
		<div>
			<p dangerouslySetInnerHTML={{ __html: mission.locObjective }} />
			<p dangerouslySetInnerHTML={{ __html: mission.locDescription }} />

			<Header as='h4'>Suggested power</Header>
			<ul>
				{Object.keys(mission.suggestedPower).map((dif) => (
					<li key={dif}>
						<b>{dif}</b>: {mission.suggestedPower[dif]}
					</li>
				))}
			</ul>

			<Header as="h4">Skill checks</Header>	
			<ul>
				{mission.reqSummary !== undefined ? (
					Object.keys(mission.reqSummary).map((dif) => (
						<li key={dif}>
							<b>{dif}</b>
							<ul>
								<li key={`${dif}.skills`}><b>Skills</b>: {mission.reqSummary[dif].skills.join(", ")}</li>
								<li key={`${dif}.min`}><b>Power</b>: {mission.reqSummary[dif].value}</li>
							</ul>
						</li>
					))
				) : (
					<li key="none">none</li>
				)}
			</ul>

			<Header as='h3'>Rewards</Header>

			{mission.rewards.map((reward) => (
				<div key={reward.id}>
					<Header as='h4'>{reward.id} rewards</Header>
					<ul>
						{Object.keys(reward.rewards).map((dif) => (
							<li key={dif}>
								<b>{dif}</b>: {reward.xp[dif]} player XP and {reward.rewards[dif]}
							</li>
						))}
					</ul>
				</div>
			))}

			<Header as='h3'>Nodes</Header>

			<Segment raised>
				<MissionCanvasDisplay nodes={Object.values(mission.nodes)} onNodeSelected={(node) => setSelected(node)} />
			</Segment>

			<MissionNodeDisplay node={mission.nodes[selected]} />
			<br />
		</div>
	);
};

const MissionPage = ({ missionData, allPosts }) => {
	const router = useRouter()
	if (!router.isFallback && !missionData?.mission) {
		return <ErrorPage statusCode={404} />
	}
	return (<div>
		<FixedMenuLayout allPosts={allPosts}>
			{router.isFallback ? (
				<Header as='h1'>Loading...</Header>
			) : (<>
				<Head>
					<title>Star Trek: Legends Wiki - {missionData.episode.locName} : {missionData.mission.locName}</title>
					<link rel="icon" href="/favicon.ico" />
				</Head>
				<Header as='h1'>{missionData.episode.locIdentifier} - {missionData.episode.locName} : {missionData.mission.locName}</Header>
				<Label as='a' onClick={() => router.push(`/missions`)}>
					<Icon name='backward' />See all missions
  				</Label>
				<MissionDisplay mission={missionData.mission} />
			</>)}
		</FixedMenuLayout>
	</div>);
}

export default MissionPage;

export async function getStaticProps({ params }) {
	const episodes = await getMissionsStaticProps();
	let missionData = undefined;
	episodes.episodes.forEach(episode => episode.missions.forEach(mission => {
		if (mission.nodesAsset == params.slug) {
			missionData = { mission, episode };
		}
	}));

	return {
		props: {
			missionData,
			allPosts: episodes.allPosts
		},
	}
}

export async function getStaticPaths() {
	const episodes = await getMissionsStaticProps();
	let missionSlugs = [];
	episodes.episodes.forEach(episode => episode.missions.forEach(mission => missionSlugs.push(mission.nodesAsset)));

	return {
		paths: missionSlugs.map((missionSlug) => {
			return {
				params: {
					slug: missionSlug,
				},
			}
		}),
		fallback: false,
	}
}