const ModuleName = "enhancedcombathud-fallout";
const SystemName = "fallout";

async function getTooltipDetails(item) {
    let title, description, ammo, creatureAttribute, creatureSkill, damage,damageEffect,damageType, weaponQuality, firerate, range, type;
    let propertiesLabel;
	let properties = [];

    let details = [];
	
	if (!item || !item.system) return;

    title = item.name;
    description = item.system?.description
    type = item.type
    ammo = item.system?.ammo;
    creatureAttribute = item.system?.creatureAttribute;
    creatureSkill = item.system?.creatureSkill;
    damage = item.system?.damage.rating;
    damageEffect = item.system?.damage.damageEffect;
    damageType = item.system?.damage.damageType;
    weaponQuality = item.system?.damage.weaponQuality;
    firerate = item.system?.firerate;
    range = item.system?.range;

    switch (itemtype) {
        case "weapon":
                details.push({
                    label: "fallout.item.damage",
                    value: damage
                });
                details.push({
                    label: "fallout.item.ammo",
                    value: ammo
                });
                details.push({
                    label: "fallout.item.damageEffect",
                    value: damageEffect
                });
                details.push({
                    label: "fallout.item.weaponQuality",
                    value: weaponQuality
                });
                details.push({
                    label: "fallout.item.firerate",
                    value: firerate
                });
                details.push({
                    label: "fallout.item.range",
                    value: range
                });
                break;
} 
}



export {ModuleName, SystemName, getTooltipDetails}