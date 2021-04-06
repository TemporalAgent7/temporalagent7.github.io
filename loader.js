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
<td>
	<p style="margin : 0; padding-top:0;white-space: nowrap"><b>GlancingChance</b> - ${character.GlancingChance}</p>
	<p style="margin : 0; padding-top:0;white-space: nowrap"><b>GlancingDamage</b> - ${character.GlancingDamage}</p>
	<p style="margin : 0; padding-top:0;white-space: nowrap"><b>CritChance</b> - ${character.CritChance}</p>
	<p style="margin : 0; padding-top:0;white-space: nowrap"><b>CritDamage</b> - ${character.CritDamage}</p>
	<p style="margin : 0; padding-top:0;white-space: nowrap"><b>Resolve</b> - ${character.Resolve}</p>
</td>
<td>
	<p style="margin : 0; padding-top:0;white-space: nowrap"><img src="/assets/IconCharStat_Health.png" style="filter: invert(1); height:1em; display:inline" /><b>Health</b> - ${Math.round(character.MaxHealth * 100) / 100}</p>
	<p style="margin : 0; padding-top:0;white-space: nowrap"><img src="/assets/IconCharStat_Defense.png" style="filter: invert(1); height:1em; display:inline" /><b>Defense</b> - ${Math.round(character.MaxDefense * 100) / 100}</p>
	<p style="margin : 0; padding-top:0;white-space: nowrap"><img src="/assets/IconCharStat_Attack.png" style="filter: invert(1); height:1em; display:inline" /><b>Attack</b> - ${Math.round(character.MaxAttack * 100) / 100}</p>
	<p style="margin : 0; padding-top:0;white-space: nowrap"><img src="/assets/IconCharStat_Tech.png" style="filter: invert(1); height:1em; display:inline" /><b>Tech</b> - ${Math.round(character.MaxTech * 100) / 100}</p>
	<p style="margin : 0; padding-top:0;white-space: nowrap"><img src="/assets/IconCharStat_Speed.png" style="filter: invert(1); height:1em; display:inline" /><b>Speed</b> - ${Math.round(character.MaxSpeed * 100) / 100}</p>
</td>`;
				tbody.appendChild(container);
			});
		});
	})
	.catch((err) => console.error(`Error in fetching the URLs json (${err})`));
