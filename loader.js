fetch('characters.json')
	.then((res) => {
		res.json().then((data) => {
			let tbody = document.querySelector('tbody.dynamicchars');

			data.forEach((character) => {
				let container = document.createElement('tr');
				container.innerHTML = `
<td>
	<div class="ui items">
		<div class="item">
			<div class="image">
				<img src="/assets/${character.icon}.png" />
			</div>
			<div class="content">
				<a class="header"><img title="${character.rarity}" src="/assets/Token_${character.rarity}.png" style="height:1em; display:inline" /> ${
					character.name
				}</a>
				<div class="meta">
				<span>${character.description}</span>
				</div>
				<div class="description">
				<p><b>${character.role}</b></p>
				<p><b>Bridge Stations</b>: ${character.bridgeStations.join(', ')}</p>
				</div>
				<div class="extra">
				${character.tags.join(', ')}
				</div>
			</div>
		</div>
	</div>
</td>
<td rowspan="2">
	<p style="white-space: nowrap"><b>GlancingChance</b> - ${character.GlancingChance}</p>
	<p style="white-space: nowrap"><b>GlancingDamage</b> - ${character.GlancingDamage}</p>
	<p style="white-space: nowrap"><b>CritChance</b> - ${character.CritChance}</p>
	<p style="white-space: nowrap"><b>CritDamage</b> - ${character.CritDamage}</p>
	<p style="white-space: nowrap"><b>Resolve</b> - ${character.Resolve}</p>
</td>
<td rowspan="2">
	<p style="white-space: nowrap"><img src="/assets/IconCharStat_Health.png" style="filter: invert(1); height:1em; display:inline" /><b>Health</b> - ${
		Math.round(character.MaxHealth * 100) / 100
	}</p>
	<p style="white-space: nowrap"><img src="/assets/IconCharStat_Defense.png" style="filter: invert(1); height:1em; display:inline" /><b>Defense</b> - ${
		Math.round(character.MaxDefense * 100) / 100
	}</p>
	<p style="white-space: nowrap"><img src="/assets/IconCharStat_Attack.png" style="filter: invert(1); height:1em; display:inline" /><b>Attack</b> - ${
		Math.round(character.MaxAttack * 100) / 100
	}</p>
	<p style="white-space: nowrap"><img src="/assets/IconCharStat_Tech.png" style="filter: invert(1); height:1em; display:inline" /><b>Tech</b> - ${
		Math.round(character.MaxTech * 100) / 100
	}</p>
	<p style="white-space: nowrap"><img src="/assets/IconCharStat_Speed.png" style="filter: invert(1); height:1em; display:inline" /><b>Speed</b> - ${
		Math.round(character.MaxSpeed * 100) / 100
	}</p>
</td>`;
				tbody.appendChild(container);

				let skills = [];
				if (character.skills) {
					for (let skillId in character.skills) {
						skills.push(skillId);
						if (character.skills[skillId].length != 2) {
							console.warn('Expected 2 levels for each skill!');
						}
					}
				}

				let container2 = document.createElement('tr');
				container2.innerHTML = `<td>
<table class="ui very basic collapsing celled table">
	<thead>
		<tr>${skills.map((skill) => `<th>${character.skills[skill][0].name}</th>`).join('')}</tr>
	</thead>
	<tbody>
		<tr>${skills
			.map(
				(skill) =>
					`<td>${
						character.skills[skill][0].img ? `<img class="ui tiny image" src="/assets/${character.skills[skill][0].img}.png" />` : '<span/>'
					}${character.skills[skill][0].description}</td>`
			)
			.join('')}</tr>
		<tr><td colspan="${skills.length}" style="text-align: center">Level 1</td></tr>
		<tr>${skills.map((skill) => `<td>${character.skills[skill][0].effects.map((e) => `<p>${e.effect}</p>`).join('')}</td>`).join('')}</tr>
		<tr><td colspan="${skills.length}" style="text-align: center">Level 2</td></tr>
		<tr>${skills.map((skill) => `<td>${character.skills[skill][1].effects.map((e) => `<p>${e.effect}</p>`).join('')}</td>`).join('')}</tr>
	</tbody>
</table></td>`;

				tbody.appendChild(container2);
			});
		});
	})
	.catch((err) => console.error(`Error in fetching the json (${err})`));

fetch('episodes.json')
	.then((res) => {
		res.json().then((data) => {
			let episodesDiv = document.querySelector('div.dynamicepisodes');

			data.forEach((episode) => {
				let container = document.createElement('div');
				container.innerHTML = `
<h2 class="ui header">${episode.identifier} - ${episode.name}</h2>
<img class="ui medium image" src="/assets/${episode.backgroundImage}.png" />
				`;

				episode.missions.forEach((mission) => {
					if (mission.difficulty != 'Easy')
						// TODO: load other difficulties too
						return;

					let firstEncounter = Object.values(mission.nodes).find((n) => n.encounter).encounter;

					container.innerHTML += `
<div class="ui items">
	<div class="item">
		<div class="ui tiny image">
			<img src="/assets/${firstEncounter.previewImage}.png">
		</div>
		<div class="content">
			<a class="header">${mission.name}</a>
			<div class="meta">
				<span>${mission.objective}</span>
			</div>
			<div class="description">
        		<p>${mission.description}</p>
      		</div>
		</div>
	</div>
</div>
					`;

					if (mission.rewards) {
						container.innerHTML += `
<h4 class="ui header">Rewards</h4>
						`;

						mission.rewards.forEach((reward) => {
							container.innerHTML += `<p>${reward.id} (${reward.difficulty}): ${JSON.stringify(reward.rewards)}</p>`;
						});
					}

					// TODO: Graph of nodes
					for (const nodeId in mission.nodes) {
						const node = mission.nodes[nodeId];

						container.innerHTML += `<h4 class="ui header">Node ${node.NodeId} ${
							node.PreviousNodeId ? `(after ${node.PreviousNodeId})` : ''
						}</h4>`;

						if (node.NextNodeIds && node.NextNodeIds.length > 0) {
							container.innerHTML += `<h4 class="ui sub header">Next node(s): ${node.NextNodeIds.join(', ')}</h4>`;
						}

						if (node.encounter) {
							container.innerHTML += `<p>${node.encounter.description}</p>`;
						}

						if (node.cutSceneDialogue && node.cutSceneDialogue.length > 0) {
							node.cutSceneDialogue.forEach((dialogue) => {
								container.innerHTML += `<p><b>${dialogue.dialogueHeader}</b>: ${dialogue.dialogueBody}</p>`;
							});
						}
					}
				});

				episodesDiv.appendChild(container);
			});
		});
	})
	.catch((err) => console.error(`Error in fetching the json (${err})`));
