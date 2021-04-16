import { writeFileSync, existsSync } from 'fs';
import { loadJson, formatRewardList } from './utils.mjs';

function generateEpisodesJson() {
	const episodes = loadJson('GSEpisodes');
	const missions = loadJson('GSMissions');
	const missionsObjective = loadJson('GSMissionObjective');
	const missionsRewards = loadJson('GSMissionRewards');
	const missionsNodes = loadJson('GSMissionNodes');
	const nodeEncounter = loadJson('GSNodeEncounter');
	const cutSceneDialogue = loadJson('GSCutSceneDialogue');
	const nodeExploration = loadJson('GSNodeExploration');
	const nodeReplayRewards = loadJson('GSNodeReplayRewards');
	const nodeRewards = loadJson('GSNodeRewards');
	const missionPos = loadJson('missionPos');

	//TODO: UI_Cutscene_Episode6_Text8

	let allepisodes = [];
	for (const ep in episodes) {
		// Load only the easy difficulty, others have the same values
		if (episodes[ep].Difficulty === 'Easy') {
			let episode = {
				id: episodes[ep].EpisodeId,
				name: episodes[ep].Name,
				identifier: episodes[ep].EpisodeIdentifierLoc,
				backgroundImage: episodes[ep].BackgroundImage.substring(0, episodes[ep].BackgroundImage.indexOf(':'))
			};

			episode.missions = [];
			for (const ms in missions) {
				if (missions[ms].EpisodeId === episode.id) {
					let alreadyAdded = episode.missions.find(m => m.id == missions[ms].MissionId);
					if (alreadyAdded) {
						// This is another difficulty of an already added mission
						alreadyAdded.suggestedPower[missions[ms].Difficulty] = missions[ms].SuggestedPower;
						continue;
					}

					let mission = {
						id: missions[ms].MissionId,
						name: missions[ms].Name,
						description: missions[ms].Description,
						suggestedPower: {},
						unlockReq: missions[ms].UnlockReq,
						nodesAsset: missions[ms].NodesAsset
					};

					mission.suggestedPower[missions[ms].Difficulty] = missions[ms].SuggestedPower;

					if (missionsObjective[mission.id]) {
						mission.objective = missionsObjective[mission.id].ObjectiveLoc;
					}

					// Rewards

					mission.rewards = [];
					for (const msr in missionsRewards) {
						if (missionsRewards[msr].MissionID === mission.id) {
							let alreadyFound = mission.rewards.find((r) => r.id == missionsRewards[msr].IdString);
							if (!alreadyFound) {
								alreadyFound = {
									id: missionsRewards[msr].IdString,
									percentageReq: missionsRewards[msr].PercentageReq,
									heroId: missionsRewards[msr].heroId,

                                    // These get filled in below
                                    xp: {},
                                    rewards: {}
								};

								mission.rewards.push(alreadyFound);
							}

                            alreadyFound.xp[missionsRewards[msr].Difficulty] = missionsRewards[msr].Xp
                            alreadyFound.rewards[missionsRewards[msr].Difficulty] = formatRewardList(missionsRewards[msr].reward.AllItems)
						}
					}

					// Nodes
					if (missionsNodes[mission.nodesAsset]) {
						mission.nodes = missionsNodes[mission.nodesAsset].Nodes;

						for (const nodeId in mission.nodes) {
							//TODO: BaseCoverHealth and CoverSlotIndices from GSBattle
							//TODO: enemy composition GSBattleEnemy

							for (const ne in nodeEncounter) {
								if (nodeEncounter[ne].NodeId === nodeId) {
									mission.nodes[nodeId].encounter = {
										description: nodeEncounter[ne].LocDescription,
										preBattleStory: nodeEncounter[ne].PreBattleStory,
										postBattleStory: nodeEncounter[ne].PostBattleStoryId, // TODO: cutscene dialogue from pre/post battle stories?
										previewImage: nodeEncounter[ne].PreviewImage
									};
								}
							}

							mission.nodes[nodeId].cutSceneDialogue = [];
							for (const csd in cutSceneDialogue) {
								if (cutSceneDialogue[csd].StoryID === nodeId) {
									mission.nodes[nodeId].cutSceneDialogue.push({
										dialogueBody: cutSceneDialogue[csd].DialogueBody,
										dialogueHeader: cutSceneDialogue[csd].DialogueHeader,
										leftCharacterId: cutSceneDialogue[csd].LeftCharacterId,
										rightCharacterId: cutSceneDialogue[csd].RightCharacterId,
										dialoguePosition: cutSceneDialogue[csd].DialoguePosition
									});
								}
							}

							// These get filled in below
							mission.nodes[nodeId].first_reward = {};
							mission.nodes[nodeId].replay_reward = {};

							// TODO: merge difficulties together for better display
							mission.nodes[nodeId].exploration = [];
							for (const nex in nodeExploration) {
								if (nodeExploration[nex].NodeId === nodeId) {
									let alreadyFound = mission.nodes[nodeId].exploration.find((ee) => ee.id == nodeExploration[nex].id.id);
									if (!alreadyFound) {
										alreadyFound = {
											id: nodeExploration[nex].id.id,
											index: nodeExploration[nex].Index,
											branchingNodeId: nodeExploration[nex].BranchingNodeId,
											iconName: nodeExploration[nex].IconName,
											headerLoc: nodeExploration[nex].HeaderLoc,

											// These get filled in below
											requiredProficiency: {},
											requiredProficiencyValue: {},
											first_reward: {},
											replay_reward: {},

											// translate
											objectNameLoc: nodeExploration[nex].ObjectNameLoc,
											reactionDialogueId: nodeExploration[nex].ReactionDialogueId,
											headerLoc: nodeExploration[nex].HeaderLoc
										};

										mission.nodes[nodeId].exploration.push(alreadyFound);
									}

									alreadyFound.requiredProficiency[nodeExploration[nex].Difficulty] = nodeExploration[nex].RequiredProficiency;
									alreadyFound.requiredProficiencyValue[nodeExploration[nex].Difficulty] = nodeExploration[nex].RequiredProficiencyValue;
								}
							}

							for (const nrr in nodeReplayRewards) {
								if (nodeReplayRewards[nrr].NodeId === nodeId) {
									mission.nodes[nodeId].replay_reward[nodeReplayRewards[nrr].Difficulty] = formatRewardList(
										nodeReplayRewards[nrr].reward.AllItems
									);
								}

								let explorationOption = mission.nodes[nodeId].exploration.find((nex) => nex.id == nodeReplayRewards[nrr].id.id);
								if (explorationOption) {
									explorationOption.resultHeaderLoc = nodeReplayRewards[nrr].HeaderLockey;
									explorationOption.resultDescLoc = nodeReplayRewards[nrr].DescLocKey;
									explorationOption.bonusEffectId = nodeReplayRewards[nrr].BonusEffectId;
									explorationOption.replay_reward[nodeReplayRewards[nrr].Difficulty] = formatRewardList(
										nodeReplayRewards[nrr].reward.AllItems
									);
								}
							}

							for (const nrr in nodeRewards) {
								if (nodeRewards[nrr].NodeId === nodeId) {
									mission.nodes[nodeId].first_reward[nodeRewards[nrr].Difficulty] = formatRewardList(nodeRewards[nrr].reward.AllItems);
								}

								let explorationOption = mission.nodes[nodeId].exploration.find((nex) => nex.id == nodeRewards[nrr].id.id);
								if (explorationOption) {
									explorationOption.resultHeaderLoc = nodeRewards[nrr].HeaderLockey;
									explorationOption.resultDescLoc = nodeRewards[nrr].DescLocKey;
									explorationOption.bonusEffectId = nodeRewards[nrr].BonusEffectId;
									explorationOption.first_reward[nodeRewards[nrr].Difficulty] = formatRewardList(nodeRewards[nrr].reward.AllItems);
								}
							}

							let pos = missionPos.find((mp) => mp.name === nodeId);
							if (!pos) {
								console.warn(`Couldn't find position for mission node '${nodeId}'`);
							} else {
								mission.nodes[nodeId].position = pos.pos;
							}
						}
					}

					episode.missions.push(mission);
				}
			}

			allepisodes.push(episode);

			if (!existsSync(new URL(`../public/assets/${episode.backgroundImage}.png`, import.meta.url))) {
				console.warn(`Missing background image for episode '${episode.name}'`);
			}
		}
	}

	writeFileSync(new URL(`../data/episodes.json`, import.meta.url), JSON.stringify(allepisodes));
}

export { generateEpisodesJson };
