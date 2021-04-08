import { writeFileSync, existsSync } from 'fs';
import { formatAsHtml, loadJson, L } from './utils.mjs';

function generateEpisodesJson() {
	const episodes = loadJson('GSEpisodes');
	const missions = loadJson('GSMissions');
	const missionsObjective = loadJson('GSMissionObjective');
    const missionsRewards = loadJson('GSMissionRewards');
    const missionsNodes = loadJson('GSMissionNodes');
    const nodeEncounter = loadJson('GSNodeEncounter');
    const cutSceneDialogue = loadJson('GSCutSceneDialogue');

	let allepisodes = [];
	for (const ep in episodes) {
		// Load only the easy difficulty, others have the same values
		if (episodes[ep].Difficulty === 'Easy') {
			let episode = {
				id: episodes[ep].EpisodeId,
				name: L(episodes[ep].Name),
				identifier: L(episodes[ep].EpisodeIdentifierLoc),
				backgroundImage: episodes[ep].BackgroundImage.substring(0, episodes[ep].BackgroundImage.indexOf(':'))
			};

			episode.missions = [];
			for (const ms in missions) {
				if (missions[ms].EpisodeId === episode.id) {
					let mission = {
						id: missions[ms].MissionId,
						name: L(missions[ms].Name),
						description: formatAsHtml(L(missions[ms].Description)),
						difficulty: missions[ms].Difficulty,
						suggestedPower: missions[ms].SuggestedPower,
						unlockReq: missions[ms].UnlockReq,
						nodesAsset: missions[ms].NodesAsset
					};

					if (missionsObjective[mission.id]) {
						mission.objective = formatAsHtml(L(missionsObjective[mission.id].ObjectiveLoc));
					}

                    // Rewards
                    mission.rewards = [];
                    for (const msr in missionsRewards) {
                        if (missionsRewards[msr].MissionID === mission.id) {
                            let reward = {
                                id: missionsRewards[msr].IdString,
                                difficulty: missionsRewards[msr].Difficulty,
                                percentageReq: missionsRewards[msr].PercentageReq,
                                latinumAmount: missionsRewards[msr].LatinumAmount,
                                xp: missionsRewards[msr].Xp,
                                heroId: missionsRewards[msr].heroId,
                                rewards: missionsRewards[msr].reward.AllItems,
                            }

                            mission.rewards.push(reward);
                        }
                    }

                    // Nodes
                    if(missionsNodes[mission.nodesAsset]) {
                        mission.nodes = missionsNodes[mission.nodesAsset].Nodes;

                        for (const nodeId in mission.nodes) {
                            //TODO: BaseCoverHealth and CoverSlotIndices from GSBattle
                            //TODO: enemy composition GSBattleEnemy
                            //TODO: per-node rewards from GSNodeRewards

                            for (const ne in nodeEncounter) {
                                if (nodeEncounter[ne].NodeId === nodeId) {
                                    mission.nodes[nodeId].encounter = {
                                        description: formatAsHtml(L(nodeEncounter[ne].LocDescription)),
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
                                        dialogueBody: formatAsHtml(L(cutSceneDialogue[csd].DialogueBody)),
                                        dialogueHeader: cutSceneDialogue[csd].DialogueHeader ? formatAsHtml(L(cutSceneDialogue[csd].DialogueHeader)) : '',
                                        leftCharacterId: cutSceneDialogue[csd].LeftCharacterId,
                                        rightCharacterId: cutSceneDialogue[csd].RightCharacterId,
                                        dialoguePosition: cutSceneDialogue[csd].DialoguePosition
                                    });
                                }
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
