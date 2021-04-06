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
				<a class="header"><img title="${character.rarity}" src="/assets/Token_${character.rarity}.png" style="height:1em; display:inline" /> ${character.name}</a>
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
	<p style="white-space: nowrap"><img src="/assets/IconCharStat_Health.png" style="filter: invert(1); height:1em; display:inline" /><b>Health</b> - ${Math.round(character.MaxHealth * 100) / 100}</p>
	<p style="white-space: nowrap"><img src="/assets/IconCharStat_Defense.png" style="filter: invert(1); height:1em; display:inline" /><b>Defense</b> - ${Math.round(character.MaxDefense * 100) / 100}</p>
	<p style="white-space: nowrap"><img src="/assets/IconCharStat_Attack.png" style="filter: invert(1); height:1em; display:inline" /><b>Attack</b> - ${Math.round(character.MaxAttack * 100) / 100}</p>
	<p style="white-space: nowrap"><img src="/assets/IconCharStat_Tech.png" style="filter: invert(1); height:1em; display:inline" /><b>Tech</b> - ${Math.round(character.MaxTech * 100) / 100}</p>
	<p style="white-space: nowrap"><img src="/assets/IconCharStat_Speed.png" style="filter: invert(1); height:1em; display:inline" /><b>Speed</b> - ${Math.round(character.MaxSpeed * 100) / 100}</p>
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
				container2.innerHTML =  `<td>
<table class="ui very basic collapsing celled table">
	<thead>
		<tr>${skills.map(skill => `<th>${character.skills[skill][0].name}</th>`).join('')}</tr>
	</thead>
	<tbody>
		<tr>${skills.map(skill => `<td>${character.skills[skill][0].img ? `<img class="ui tiny image" src="/assets/${character.skills[skill][0].img}.png" />` : '<span/>'}${character.skills[skill][0].description}</td>`).join('')}</tr>
		<tr><td colspan="${skills.length}" style="text-align: center">Level 1</td></tr>
		<tr>${skills.map(skill => `<td>${character.skills[skill][0].effects.map(e => `<p>${e.effect}</p>`).join('')}</td>`).join('')}</tr>
		<tr><td colspan="${skills.length}" style="text-align: center">Level 2</td></tr>
		<tr>${skills.map(skill => `<td>${character.skills[skill][1].effects.map(e => `<p>${e.effect}</p>`).join('')}</td>`).join('')}</tr>
	</tbody>
</table></td>`;

				tbody.appendChild(container2);
			});
		});
	})
	.catch((err) => console.error(`Error in fetching the json (${err})`));
