import {registerfalloutItems, falloutMajorItems, falloutMinorItems, falloutHItems, falloutLuckItems} from "./specialitems.js";
import { ModuleName, SystemName, getTooltipDetails, sendBuyAPChatCard,adjustPartyAP, applyInjuries} from "./utils.js";
import {openNewInput} from "./popupInput.js";



Hooks.on("argonInit", (CoreHUD) => {
    const ARGON = CoreHUD.ARGON;
  
registerfalloutItems ();

if (!game.settings.get(ModuleName, "Injuries")) {
    
} else {
Hooks.once("ready", () => {
    if (!fallout.APTracker._instance) {
        fallout.APTracker.initialise();
    }
});
Hooks.on("updateActor", (actor, changes) => {
    if (changes.system?.body_parts) {
        applyInjuries(actor);
    }
});

let lastCombatant = null;

Hooks.on("updateCombat", async (combat, update, options, userId) => {
    // Detect if the turn or round has advanced
    if (update?.turn !== undefined || update?.round !== undefined) {
        const currentCombatant = combat.combatant;

        if (lastCombatant && lastCombatant !== currentCombatant) {
            console.log(`End turn for combatant: ${lastCombatant.name}`);

            const actor = lastCombatant.actor;
            if (!actor) return;

            // Ensure the actor has body parts data
            const bodyParts = actor.system?.body_parts;
            if (!bodyParts) {
                console.log(`No body parts data found for ${actor.name}.`);
                return;
            }

            // Check for chest injuries
            const torsoInjuries = bodyParts.torso?.injuries || [];
            const severityTwoInjuries = torsoInjuries.filter((injury) => injury === 2);

            if (severityTwoInjuries.length > 0) {
                // Count the number of severity 2 injuries on the torso
                const injuryCount = severityTwoInjuries.length;

                // Roll damage: 2d6 per injury
                const totalDamage = Array.from({ length: injuryCount }, () => 
                    Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1
                ).reduce((sum, roll) => sum + roll, 0);

                console.log(`Applying ${totalDamage} damage for ${injuryCount} chest injuries to ${actor.name}.`);

                // Apply the damage to the actor's health
                const currentHealth = actor.system.health?.value || 0;
                const newHealth = Math.max(0, currentHealth - totalDamage);
                await actor.update({ "system.health.value": newHealth });

                // Notify via chat
                ChatMessage.create({
                    user: game.user.id,
                    speaker: ChatMessage.getSpeaker({ actor }),
                    content: `<strong>${actor.name}:</strong> Sustains ${totalDamage} damage from ${injuryCount} chest injuries.`,
                    type: CONST.CHAT_MESSAGE_TYPES.OTHER,
                });
            }
        }

        // Update the last combatant to the current combatant
        lastCombatant = currentCombatant;
        }
    });
};

function consumeAction(type) {
    switch(type) {
        case "Major":
                ui.ARGON.components.main[0].isActionUsed = true;
                ui.ARGON.components.main[0].updateActionUse();
                break;
        case "Minor":
                ui.ARGON.components.main[1].isActionUsed = true;
				ui.ARGON.components.main[1].updateActionUse();
				break;
    }
}

class falloutPortraitPanel extends ARGON.PORTRAIT.PortraitPanel {
    constructor(...args) {
        super(...args);

    }
    
    
    get description() {
        return `${this.actor.system.description}`;
    }
    
    get isDead() {
        let isDead = (this.actor?.system.health.value == 0)
        return isDead;
    }

        
    get configurationTemplate() {
        return "modules/enhancedcombathud-dnd5e/templates/argon-actor-config.hbs";
    }
    async getsideStatBlocks() {
        let bodyParts = this.actor.system.body_parts;
    
        if (!bodyParts) {
            ui.notifications.warn("Body parts data not found on this actor.");
            return {left: [], right: []};  // Return empty blocks if body_parts is undefined
        }
        
        let Blocks = {left: [], right: []};

        if (!game.settings.get(ModuleName, "AP")) {
                } else { Blocks.left.push([
                    {
                        text: "AP",
                    },
                    {   // Label text for the AP box
                        isinput: true,
                        inputtype: "number",
                        textValue: 0,  // Initial numeric value to display
                        changevent: (newvalue) => {
                            console.log(`AP value set to: ${newvalue}`);
                         }
                    }
                ]);
            }
            if (!game.settings.get(ModuleName, "Armor")) {
            } else {
            // Define the desired order of body parts
const bodyPartOrder = ["head", "torso", "armL", "armR", "legL", "legR"];

// Sort body parts according to the predefined order
const sortedBodyParts = Object.keys(bodyParts).sort(
    (a, b) => bodyPartOrder.indexOf(a) - bodyPartOrder.indexOf(b)
);

// Iterate over sorted body parts
for (const key of sortedBodyParts) {
    const bodyPartData = {
                    head: { label: "Head", image: "/modules/enhancedcombathud-fallout/icons/AHelm.svg" },
                    torso: { label: "Torso", image: "/modules/enhancedcombathud-fallout/icons/ATorso.svg"},
                    armL: { label: "Left Arm", image: "/modules/enhancedcombathud-fallout/icons/ALArm.svg" },
                    armR: { label: "Right Arm", image: "/modules/enhancedcombathud-fallout/icons/ARArm.svg" },
                    legL: { label: "Left Leg", image: "/modules/enhancedcombathud-fallout/icons/ALLeg.svg" },
                    legR: { label: "Right Leg", image: "/modules/enhancedcombathud-fallout/icons/ARLeg.svg" },
                    
                };
        
                if (!bodyPartData[key]) continue; // Skip unlisted body parts
        
                // Get resistances
                const physicalResistance = bodyParts[key]?.resistance?.physical || 0;
                const energyResistance = bodyParts[key]?.resistance?.energy || 0;
        
                // Build the block with the image and resistance details
                // Build the block with the image and resistance details
                Blocks.right.push([
                    {
                        image: bodyPartData[key].image, // Add the image for the body part
                        alt: bodyPartData[key].label, // Alt text for the image
                        style: { width: "25px", height: "25px" }, // Adjust image size
                    },
                    {
                        text: `${energyResistance}`, // Energy resistance number only
                        color: "#6495ED", // Styling for energy resistance
                    },
                    {
                        text: "|", // Spacer element for separation
                        style: "margin: 10px 0;", // Add vertical spacing
                    },
                    {
                        text: `${physicalResistance}`, // Physical resistance number only
                        color: "#00ff00", // Styling for physical resistance
                    },
                ]);
                

            }
     
            }
        return Blocks;
    }
    
    
    async getStatBlocks() {
        const HPText = "HP";
        const hpColor = this.actor.system.health?.value ? "#6698f3" : "rgb(0 255 170)";
        const hpMaxColor = this.actor.system.health?.max ? "#ffb000" : "rgb(255 255 255)";
        let luck2 = this.actor.system.luckPoints ? "#b2abbc" : "rgb(178 171 188)";
        // Check if `end` attribute exists, otherwise default to a color or value
        let Move = this.actor.system.attributes?.end?.value ? "#20b320" : "rgb(32, 179, 32)";
        let Move2 = this.actor.system.attributes?.end?.value || 0;
        const MoveText = "Speed";
        let luck = this.actor.system.luckPoints;
        const luckText = "Luck";
       
        //console.log(this.actor.system.luckpoints)
        if (this.actor.type === "creature") {
            // For creatures, use the `body` attribute instead of `end`
            Move = this.actor.system.body?.value ? "#20b320" : "rgb(32, 179, 32)";
            Move2 = this.actor.system.body?.value || 0;
        }
        if (!game.settings.get(ModuleName, "Luck") && (!game.settings.get(ModuleName, "Movement"))) {
            return [
                [
                    {
                        text: `${this.actor.system.health?.value || 0}`,
                        color: hpColor,
                    },
                    {
                        text: `/`,
                    },
                    {
                        text: `${this.actor.system.health?.max || 0}`,
                        color: hpMaxColor,
                    },
                    {
                        text: HPText,
                    },
                ],
            ]
        } else if (!game.settings.get(ModuleName, "Movement")) {
            return [
                [
                    {
                        text: `${this.actor.system.health?.value || 0}`,
                        color: hpColor,
                    },
                    {
                        text: `/`,
                    },
                    {
                        text: `${this.actor.system.health?.max || 0}`,
                        color: hpMaxColor,
                    },
                    {
                        text: HPText,
                    },
                ],
                [
                    {
                        text: luckText,
                    },
                    {
                        text: `${luck}`,
                        color: luck2,
                    },
                ],
            ]
                            }
            else if (!game.settings.get(ModuleName, "Luck")) {
                return [
                    [
                        {
                            text: `${this.actor.system.health?.value || 0}`,
                            color: hpColor,
                        },
                        {
                            text: `/`,
                        },
                        {
                            text: `${this.actor.system.health?.max || 0}`,
                            color: hpMaxColor,
                        },
                        {
                            text: HPText,
                        },
                    ],
                    [
                        {
                            text: MoveText,
                        },
                        {
                            text: `${Move2}`,
                            color: Move,
                        },
                    ],
                ]
                } else {
                    return [
                        [
                            {
                                text: `${this.actor.system.health?.value || 0}`,
                                color: hpColor,
                            },
                            {
                                text: `/`,
                            },
                            {
                                text: `${this.actor.system.health?.max || 0}`,
                                color: hpMaxColor,
                            },
                            {
                                text: HPText,
                            },
                        ],
                        [
                            {
                                text: MoveText,
                            },
                            {
                                text: `${Move2}`,
                                color: Move,
                            },
                        ],
                        [
                            {
                                text: luckText,
                            },
                            {
                                text: `${luck}`,
                                color: luck2,
                            },
                        ],
                    ];
                }                      
    }
    async _renderInner(data) {
        await super._renderInner(data);
        
        
        
        if (!game.settings.get(ModuleName, "Armor")) {
            const statBlocks = await this.getsideStatBlocks();
			for (const position of ["left", "right"]) {
				const sb = document.createElement("div");
				
				sb.style = `position : absolute;${position} : 0px`;
				if ((!game.settings.get(ModuleName, "AlignAP")) && (!game.settings.get(ModuleName, "Movement"))) { 
                    for (const block of statBlocks[position]) {
                        const sidesb = document.createElement("div");
                        sidesb.classList.add("portrait-stat-block");
                        sidesb.style.left = "0px";
                        sidesb.style.paddingRight = "0.35em";
                        sidesb.style.position = "relative";
                        sidesb.style.top = "-50px";
                        //sidesb.style.topLeft = "-100px";
                        for (const stat of block) {
                            if (!stat.position) {
                                let displayer;

                if (stat.isinput) {
                    displayer = document.createElement("input");
                    displayer.type = stat.inputtype;
                    displayer.value = stat.text;
                    displayer.style.width = "3em";
                    displayer.style.color = "#ffffff";
                    displayer.onchange = () => stat.changevent(displayer.value);
                } else if (stat.image) {
                    displayer = document.createElement("img");
                    displayer.src = stat.image;
                    displayer.alt = stat.alt || "";
                    Object.assign(displayer.style, stat.style || {});
                } else {
                    displayer = document.createElement("span");
                    displayer.innerText = stat.text || "";
                }

                displayer.style.color = stat.color || "#fff";
                sidesb.appendChild(displayer);
            }
                        }
                        sb.appendChild(sidesb);
                    }
            } else if ((!game.settings.get(ModuleName, "AlignAP"))) { 
                for (const block of statBlocks[position]) {
                    const sidesb = document.createElement("div");
                    sidesb.classList.add("portrait-stat-block");
                    sidesb.style.left = "0px";
                    sidesb.style.paddingRight = "0.35em";
                    sidesb.style.position = "relative";
                    sidesb.style.top = "-50px";
                    //sidesb.style.topLeft = "-100px";
                    for (const stat of block) {
                        if (!stat.position) {
                            let displayer;

                if (stat.isinput) {
                    displayer = document.createElement("input");
                    displayer.type = stat.inputtype;
                    displayer.value = stat.text;
                    displayer.style.width = "3em";
                    displayer.style.color = "#ffffff";
                    displayer.onchange = () => stat.changevent(displayer.value);
                } else if (stat.image) {
                    displayer = document.createElement("img");
                    displayer.src = stat.image;
                    displayer.alt = stat.alt || "";
                    Object.assign(displayer.style, stat.style || {});
                } else {
                    displayer = document.createElement("span");
                    displayer.innerText = stat.text || "";
                }

                displayer.style.color = stat.color || "#fff";
                sidesb.appendChild(displayer);
            }
                    }
                    sb.appendChild(sidesb);
                }
        } else if ((!game.settings.get(ModuleName, "Movement"))) { 
            for (const block of statBlocks[position]) {
                const sidesb = document.createElement("div");
                sidesb.classList.add("portrait-stat-block");
                sidesb.style.left = "41px";
                sidesb.style.paddingRight = "0.35em";
                sidesb.style.position = "relative";
                sidesb.style.top = "-50px";
                //sidesb.style.topLeft = "-100px";
                for (const stat of block) {
                    if (!stat.position) {
                        let displayer;
                        if (stat.isinput) {
                            displayer = document.createElement("input");
                            displayer.type = stat.inputtype; 
                            displayer.value = stat.text;
                            displayer.style.width = "1.5em";
                            displayer.style.color = "#ffffff";
                            displayer.onchange = () => {stat.changevent(displayer.value)};
                        }
                        else {
                            displayer = document.createElement("span");
                            displayer.innerText = ``;
                            if (stat.text) {
                                displayer.innerText = displayer.innerText + stat.text;
                            }
                            if (stat.icon) {
                                let icon = document.createElement("i");
                                icon.classList.add(...stat.icon);
                                displayer.appendChild(icon);
                            }
                        }
                        displayer.style.color = stat.color;
                        sidesb.appendChild(displayer);
                    }
                }
                sb.appendChild(sidesb);
            }
    }else {
                for (const block of statBlocks[position]) {
					const sidesb = document.createElement("div");
					sidesb.classList.add("portrait-stat-block");
					sidesb.style.left = "7px";
					sidesb.style.paddingRight = "0.20em";
					sidesb.style.position = "relative";
                    sidesb.style.top = "-50px";
                    //sidesb.style.topLeft = "-100px";
					for (const stat of block) {
						if (!stat.position) {
							let displayer;

                if (stat.isinput) {
                    displayer = document.createElement("input");
                    displayer.type = stat.inputtype;
                    displayer.value = stat.text;
                    displayer.style.width = "2em";
                    displayer.style.color = "#ffffff";
                    displayer.onchange = () => stat.changevent(displayer.value);
                } else if (stat.image) {
                    displayer = document.createElement("img");
                    displayer.src = stat.image;
                    displayer.alt = stat.alt || "";
                    Object.assign(displayer.style, stat.style || {});
                } else {
                    displayer = document.createElement("span");
                    displayer.innerText = stat.text || "";
                }

                displayer.style.color = stat.color || "#fff";
                sidesb.appendChild(displayer);
            }
					}
					sb.appendChild(sidesb);
				}
            }
				this.element.appendChild(sb);
			}
        } else {
			const statBlocks = await this.getsideStatBlocks();
			for (const position of ["left", "right"]) {
				const sb = document.createElement("div");
				
				sb.style = `position : absolute;${position} : 0px`;
				if (!game.settings.get(ModuleName, "Movement")) { 
                    for (const block of statBlocks[position]) {
                        const sidesb = document.createElement("div");
                        sidesb.classList.add("portrait-stat-block");
                        const leftPosition = game.settings.get(ModuleName, "leftPosition");
                        
                        if (position === "left") {
                            sidesb.style.left = `${leftPosition}px`; 
                            sidesb.style.right = ""; 
                            sidesb.style.top = "-50px";
                        } else if (position === "right") {
                            sidesb.style.right = "0px"; 
                            sidesb.style.left = ""; 
                            sidesb.style.paddingTop = "0.25em";
                            sidesb.style.top = "-80px";
                        }
                    
                        sidesb.style.paddingRight = "0.20em";
                        sidesb.style.position = "relative";
               
                    
                        for (const stat of block) {
                            if (!stat.position) {
                                let displayer;
                    
                                if (stat.isinput) {
                                    displayer = document.createElement("input");
                                    displayer.type = stat.inputtype;
                                    displayer.value = stat.text;
                                    displayer.style.width = "3em";
                                    displayer.style.color = "#ffffff";
                                    displayer.onchange = () => stat.changevent(displayer.value);
                                } else if (stat.image) {
                                    displayer = document.createElement("img");
                                    displayer.src = stat.image;
                                    displayer.alt = stat.alt || "";
                                    Object.assign(displayer.style, stat.style || {});
                                } else {
                                    displayer = document.createElement("span");
                                    displayer.innerText = stat.text || "";
                                }
                    
                                displayer.style.color = stat.color || "#fff";
                                sidesb.appendChild(displayer);
                            }
                        }
                    
                        sb.appendChild(sidesb);
                    }
            } else {
        for (const block of statBlocks[position]) {
            const sidesb = document.createElement("div");
            sidesb.classList.add("portrait-stat-block");
            const leftPosition = game.settings.get(ModuleName, "leftPosition");
            if (position === "left") {
                sidesb.style.left = `${leftPosition}px`; 
                sidesb.style.right = ""; 
                sidesb.style.top = "-50px";
            } else if (position === "right") {
                sidesb.style.right = "0px"; 
                sidesb.style.left = ""; 
                sidesb.style.paddingTop = "0.25em";
                sidesb.style.top = "-80px";
            }
        
            sidesb.style.paddingRight = "0.20em";
            sidesb.style.position = "relative";
         
        
            for (const stat of block) {
                if (!stat.position) {
                    let displayer;
        
                    if (stat.isinput) {
                        displayer = document.createElement("input");
                        displayer.type = stat.inputtype;
                        displayer.value = stat.text;
                        displayer.style.width = "2em";
                        displayer.style.color = "#ffffff";
                        displayer.onchange = () => stat.changevent(displayer.value);
                    } else if (stat.image) {
                        displayer = document.createElement("img");
                        displayer.src = stat.image;
                        displayer.alt = stat.alt || "";
                        Object.assign(displayer.style, stat.style || {});
                    } else {
                        displayer = document.createElement("span");
                        displayer.innerText = stat.text || "";
                    }
        
                    displayer.style.color = stat.color || "#fff";
                    sidesb.appendChild(displayer);
                }
            }
        
            sb.appendChild(sidesb);
        }
        
    }
		this.element.appendChild(sb);
	}
			
}
			
			
}
	
} 
class falloutDrawerPanel extends ARGON.DRAWER.DrawerPanel {
    constructor(...args) {
        super(...args);
    }

    get categories() {
        let attributes = this.actor.system.attributes || {};
        let skills = this.actor.items.filter(item => item.type === "skill");
               

        let skillgroups = {};
        console.log("Actor system:", this.actor.system);
        console.log("Health:", this.actor.system?.health);
        console.log("Attributes:", this.actor.system?.attributes);

        for (let attribute of Object.keys(attributes)) {
            skillgroups[attribute] = skills.filter(skill => skill.system.defaultAttribute == attribute);
            
            skillgroups[attribute] = skillgroups[attribute].sort((a, b) => {
                if (a.name < b.name) { return -1; }
                if (a.name > b.name) { return 1; }
                return 0;
            });
        }
        skills = [];
        Object.values(skillgroups).forEach(group => skills = skills.concat(group));
        
        const attributesButtons = Object.keys(attributes).map((attribute) => {
            const attributeData = attributes[attribute];
            
            // Safely get the value, fallback to a default
            let valueLabel = attributeData?.value || 0;
    
            return new ARGON.DRAWER.DrawerButton([
                {
                    label: game.i18n.localize(CONFIG.FALLOUT.ATTRIBUTES[attribute]),
                    onClick: () => {
                        const rollName = `${game.i18n.localize(CONFIG.FALLOUT.ATTRIBUTES[attribute])} Roll`;
                        fallout.Dialog2d20.createDialog({
                            rollName,
                            diceNum: 2,
                            attribute: attributeData?.value || 0,
                            skill: 0,
                            tag: false,
                            complication: 20,
                            rollLocation: false,
                            actor: this.actor,
                            item: null
                        }).then(result => {
                            if (result) {
                                console.log("Roll result:", result);
                            } else {
                                console.log("Dialog closed without rolling.");
                            }
                        });
                    }
                },
                {
                    label: valueLabel,
                    onClick: () => {
                        const rollName = `${game.i18n.localize(CONFIG.FALLOUT.ATTRIBUTES[attribute])} Roll`;
                        fallout.Dialog2d20.createDialog({
                            rollName,
                            diceNum: 2,
                            attribute: attributeData?.value || 0,
                            skill: 0,
                            tag: false,
                            complication: 20,
                            rollLocation: false,
                            actor: this.actor,
                            item: null
                        }).then(result => {
                            if (result) {
                                console.log("Roll result:", result);
                            } else {
                                console.log("Dialog closed without rolling.");
                            }
                        });
                    },
                    style: "display: flex; justify-content: flex-end;"
                }
            ]);
        });

        let skillsButtons = [];
        if (skills.length) {
            skillsButtons = skills.map((skill) => {
                const skillData = skill.system;
                let valueLabel = `${skillData.value}<span style="margin: 0 1rem; filter: brightness(0.8)">(+${attributes[skillData.defaultAttribute].value})</span>`;
                
                return new ARGON.DRAWER.DrawerButton([
                    {
                        label: game.i18n.localize(skill.name),
                        onClick: () => {
                            // Roll using the selected skill and its associated attribute
                            const rollName = `${skill.name} Roll`;
                            const attributeValue = attributes[skillData.defaultAttribute].value;
                            fallout.Dialog2d20.createDialog({
                                rollName,
                                diceNum: 2,
                                attribute: attributeValue,
                                skill: skillData.value,
                                tag: skillData.tag || false,
                                complication: 20,
                                rollLocation: false,
                                actor: this.actor,
                                item: null // No specific item
                            }).then(result => {
                                if (result) {
                                    console.log("Roll result:", result);
                                } else {
                                    console.log("Dialog closed without rolling.");
                                }
                            });
                        }
                    },
                    {
                        label: valueLabel,
                        onClick: () => {
                            // Same callback as above for consistency
                            const rollName = `${skill.name} Roll`;
                            const attributeValue = attributes[skillData.defaultAttribute].value;
                            fallout.Dialog2d20.createDialog({
                                rollName,
                                diceNum: 2,
                                attribute: attributeValue,
                                skill: skillData.value,
                                tag: skillData.tag || false,
                                complication: 20,
                                rollLocation: false,
                                actor: this.actor,
                                item: null
                            }).then(result => {
                                if (result) {
                                    console.log("Roll result:", result);
                                } else {
                                    console.log("Dialog closed without rolling.");
                                }
                            });
                        },
                        style: "display: flex; justify-content: flex-end;"
                    }
                ]);
            });
        }
   
    
    let returncategories = [];

    returncategories.push({
        gridCols: "7fr 1fr",
        captions: [
            {
                label: ("Attribute"),
            },
            {
                label: ("Level"),
            },
        ],
        buttons: attributesButtons,
    });
    if(skillsButtons.length) {
    returncategories.push({

        gridCols: "7fr 3fr 1fr",
        captions: [
            {
                label: "Skills",
            },
            {
                label: "Level",
            },
            
        ],
        buttons: skillsButtons,
    })};

    return returncategories;
		}

		get title() {
			return `${game.i18n.localize("ATTRIBUTES")} & ${game.i18n.localize("SKILLS")}`;
    }
}




    
class falloutMajorPanel extends ARGON.MAIN.ActionPanel {
    constructor(...args) {
        super(...args);
        
        //this.actionsLeft = this.maxActions;
    }

    get label() {
        return "Major Actions";
    }
    
    get maxActions() {
        return 1;
    }

    get colorScheme(){
        return 0;
    }
    
    get currentActions() {
        return this.isActionUsed ? 0 : 1;
    }
    
    _onNewRound(combat) {
        this.isActionUsed = false;
        this.updateActionUse();
    }
    async _getButtons() {
        const specialActions = Object.values(falloutMajorItems);

        let buttons = [];

        buttons.push(new falloutItemButton({ item: null, isWeaponSet: true, isPrimary: true }));
        buttons.push(new ARGON.MAIN.BUTTONS.SplitButton (new falloutSpecialActionButton(specialActions[0]), new falloutSpecialActionButton(specialActions[1])));
        buttons.push(new ARGON.MAIN.BUTTONS.SplitButton (new falloutButtonPanelButton({parent : this, type: "command"}), new falloutSpecialActionButton(specialActions[3])));
        buttons.push(new ARGON.MAIN.BUTTONS.SplitButton (new falloutSpecialActionButton(specialActions[4]), new falloutButtonPanelButton({parent : this, type: "firstaid"})));
        buttons.push(new ARGON.MAIN.BUTTONS.SplitButton (new falloutSpecialActionButton(specialActions[6]), new falloutSpecialActionButton(specialActions[7])));
        buttons.push(new falloutSpecialActionButton(specialActions[8]));
       

        return buttons.filter(button => button.items == undefined || button.items.length);

    }
}
class falloutMinorPanel extends ARGON.MAIN.ActionPanel {
    constructor(...args) {
        super(...args);
        
        this.actionsLeft = this.maxActions;
    }

    get label() {
        return "Minor Actions";
    }
    
    get maxActions() {
        return 1;
    }
    
    get currentActions() {
        return this.isActionUsed ? 0 : 1;
    }
    
    
    _onNewRound(combat) {
        this.isActionUsed = false;
        this.updateActionUse();
    }
    async _getButtons() {
        const specialActions = Object.values(falloutMinorItems);
        
        let buttons = [];

        
        buttons.push(new ARGON.MAIN.BUTTONS.SplitButton(new falloutSpecialActionButton(specialActions[0]), new falloutSpecialActionButton(specialActions[1])));
        buttons.push(new ARGON.MAIN.BUTTONS.SplitButton(new falloutSpecialActionButton(specialActions[2]), new falloutButtonPanelButton({parent : this, type: "consumable"})));
        

        return buttons.filter(button => button.items == undefined || button.items.length);

    }
}
class falloutAPPanel extends ARGON.MAIN.ActionPanel {
    constructor(...args) {
        super(...args);
        
        this.actionsLeft = this.maxActions;
    }

    get label() {
        return "AP";
    }
    
   
    _onNewRound(combat) {
       
    }
    async _getButtons() {
        const specialActions = Object.values(falloutHItems);

        let buttons = [];

        
        buttons.push(new ARGON.MAIN.BUTTONS.SplitButton(new falloutButtonPanelButton({parent : this, type: "buyd20s"}), new falloutSpecialActionButton(specialActions[1])));
        buttons.push(new ARGON.MAIN.BUTTONS.SplitButton (new falloutSpecialActionButton(specialActions[2]), new falloutSpecialActionButton(specialActions[3])));

        return buttons.filter(button => button.items == undefined || button.items.length);

    }
}
class falloutLuckPanel extends ARGON.MAIN.ActionPanel {
    constructor(...args) {
        super(...args);
        
        this.actionsLeft = this.maxActions;
    }

    get label() {
        return "Luck";
    }
    
    
    
    _onNewRound(combat) {
       
    }
    async _getButtons() {
        const specialActions = Object.values(falloutLuckItems);

        let buttons = [];

        
        buttons.push(new ARGON.MAIN.BUTTONS.SplitButton(new falloutSpecialActionButton(specialActions[0]), new falloutSpecialActionButton(specialActions[1])));
        buttons.push(new ARGON.MAIN.BUTTONS.SplitButton (new falloutSpecialActionButton(specialActions[2]), new falloutSpecialActionButton(specialActions[3])));

        return buttons.filter(button => button.items == undefined || button.items.length);

    }
}
class falloutItemButton extends ARGON.MAIN.BUTTONS.ItemButton {
    constructor(...args) {
        super(...args);

        
    if (this.item?.type == "weapon") {
        }
    }


get hasTooltip() {
    return true;
}

get targets() {
    switch (this.item?.type){
        case "weapon":
            return 1;
        default:
            return 0;      
        
    }
}
get ranges(){
    
}

async getTooltipData() {
    const tooltipData = await getTooltipDetails(this.item, this.actor.type);
    return tooltipData;
}

async _onTooltipMouseEnter(event) {
    const tooltipData = await this.getTooltipData();
    if (!tooltipData) return;
    this._tooltip = new ARGON.CORE.Tooltip(tooltipData, this.element, this.tooltipOrientation);
    this._tooltip.render();
}

async _onLeftClick(event, special = "") {
    
    var used = false;
    
    

    let actor = this.actor;
    let item = this.item;
    

    const apCostItems = ["First Aid - Medicine", "First Aid - Repair"];
    const weaponTypes = ["weapon"]; 
    if (!game.settings.get(ModuleName, "Injuries")) {
    
    } else {

const bodyParts = actor.system.body_parts;
const hasHeadInjury = bodyParts.head?.injuries.includes(2);


if (hasHeadInjury && (apCostItems.includes(item.name) || weaponTypes.includes(item.type))) {
  
    const adjustmentValue = -2;

    const apAdjusted = await adjustPartyAP(adjustmentValue);
    if (!apAdjusted) {
        console.log("Not enough AP. Action canceled.");
        return; 
    }

  
    ChatMessage.create({
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ actor }),
        content: `<strong>${actor.name}:</strong> Spends 2 AP to perform the action: <em>${item.name}</em> due to a head injury.`,
        style: CONST.CHAT_MESSAGE_STYLES.OTHER,
    });

    used = true;
}


if (hasHeadInjury) {
    ui.notifications.warn(`${actor.name}'s difficulty for ${item.name} is increased due to a head injury.`);
    ChatMessage.create({
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ actor }),
        content: `<strong>${actor.name}:</strong> The difficulty of <em>${item.name}</em> is increased due to a head injury.`,
        style: CONST.CHAT_MESSAGE_STYLES.OTHER,
    });

    console.log(`Head injury affects action: ${item.name}.`);
    }
}

    if (this.item.type == "weapon") {
        used = true;
        
    };
    if (this.item.type == "consumable") {
        this.actor.consumeItem(this.item);
                
    };
    
    if (this.item.type == "skill") {
        const buySkillAPCosts = {
            "Buy d20": -1,
            "Buy 2d20s": -3,
            "Buy 3d20s": -6,
        };
    
       
        if (buySkillAPCosts[this.item.name]) {
            const apCost = buySkillAPCosts[this.item.name];
    
           
            const apAdjusted = await adjustPartyAP(apCost);
    
            if (!apAdjusted) {
                console.log("Not enough AP. Action canceled.");
                return; 
            }
    
          
            await sendBuyAPChatCard(this.item.name, apCost);
    
            console.log(`Action "${this.item.name}" executed. AP cost: ${apCost}`);
            return; 
        }
        console.log(this.item)
                let actor = this.actor;
                let attributeValue;
                let skillSkill;
                let skillValue;
                let rollName;
                let skillTag
                switch(this.item.name) {
                    case "First Aid - Medicine":
                        attributeValue = actor.system?.attributes?.int?.value ?? 0;
                        skillSkill = actor.items.find(i => i.name.toLowerCase() === "medicine" && i.type === "skill");
                        skillValue = skillSkill?.system?.value ?? 0;
                        skillTag = skillSkill?.system?.tag
                        rollName = "First Aid - Medicine"
                        break; 
                    case "First Aid - Repair": 
                        attributeValue = actor.system?.attributes?.int?.value ?? 0;
                        skillSkill = actor.items.find(i => i.name.toLowerCase() === "repair" && i.type === "skill");
                        skillValue = skillSkill?.system?.value ?? 0;
                        skillTag = skillSkill?.system?.tag
                        console.log(skillSkill)
                        rollName = "First Aid - Repair"
                        break; 
                    case "Command Human":
                        attributeValue = actor.system?.attributes?.cha?.value ?? 0;
                        skillSkill = actor.items.find(i => i.name.toLowerCase() === "speech" && i.type === "skill");
                        skillValue = skillSkill?.system?.value ?? 0;
                        skillTag = skillSkill?.system?.tag
                        console.log(skillSkill)
                        rollName = "Command NPC"
                        console.log(attributeValue)
                        break; 
                    case "Command Robot":
                        attributeValue = actor.system?.attributes?.cha?.value ?? 0;
                        skillSkill = actor.items.find(i => i.name.toLowerCase() === "science" && i.type === "skill");
                        skillValue = skillSkill?.system?.value ?? 0;
                        skillTag = skillSkill?.system?.tag
                        console.log(skillSkill)
                        rollName = "Command Robot"
                        console.log(attributeValue)
                        break;
                     case "Command Animal":
                        attributeValue = actor.system?.attributes?.cha?.value ?? 0;
                        skillSkill = actor.items.find(i => i.name.toLowerCase() === "survival" && i.type === "skill");
                        skillValue = skillSkill?.system?.value ?? 0;
                        skillTag = skillSkill?.system?.tag
                        console.log(skillSkill)
                        rollName = "Command Animal"
                        console.log(attributeValue)
                        break;
                    
                }        
                let diceNum = 2; 
                let tag = skillTag|| false; 
                 const complication = 20; 
                 let item = this.item;
            const rollLocation = false;
            fallout.Dialog2d20.createDialog({
                rollName,
                diceNum,
                attribute: attributeValue|| 0,
                skill: skillValue|| 0, 
                rollLocation,
                actor,
                item
            }).then(result => {
                if (result) {
                    console.log("Roll result:", result);
                } else {
                    console.log("Dialog closed without rolling.");
                }
            });
    }
    
    if (used) {
       falloutItemButton.consumeActionEconomy(this.item);
    
    const actor = this.actor; 
    const item = this.item; 
    let attribute;
    let skill;

if (item.isOwnedByCreature) {
    const creatureAttribute = item.system.creatureAttribute ?? "";
    const creatureSkill = item.system.creatureSkill ?? "";

    if (creatureSkill === "" || creatureAttribute === "") {
        return ui.notifications.warn(
            game.i18n.localize("FALLOUT.ERRORS.WeaponHasMissingCreatureConfiguration")
        );
    }

    attribute = actor.system[creatureAttribute];
    skill = actor.system[creatureSkill];
    skill.tag = true;
    } else {
    const skillName = item.system.weaponType === "custom"
        ? item.system.skill ?? ""
        : CONFIG.FALLOUT.WEAPON_SKILLS[item.system.weaponType];

    const customAttribute = item.system.weaponType === "custom"
        ? item.system.attribute ?? ""
        : false;

    if (skillName === "") {
        return ui.notifications.error(
            game.i18n.localize("FALLOUT.ERRORS.UnableToDetermineWeaponSkill")
        );
    }

    const skillItem = actor.items.find(i => i.name === skillName);

    if (skillItem) {
        skill = skillItem.system;
    } else {
        skill = { value: 0, tag: false, defaultAttribute: "str" };
    }

    const attributeOverride = CONFIG.FALLOUT.WEAPON_ATTRIBUTE_OVERRIDE[item.system.weaponType];

    if (customAttribute) {
        attribute = actor.system.attributes[customAttribute];
    } else if (attributeOverride) {
        attribute = actor.system.attributes[attributeOverride];
    } else {
        attribute = actor.system.attributes[skill.defaultAttribute];
    }

    if (!attribute) {
        return ui.notifications.error(
            game.i18n.localize("FALLOUT.ERRORS.UnableToDetermineWeaponAttribute")
        );
    }
}

console.log("Attribute used for roll:", attribute);
console.log("Skill used for roll:", skill);
     

const rollName = this.item.name;
let diceNum = 2; 
const tag = skill.tag || false; 
const complication = 20; 
const rollLocation = true; 


fallout.Dialog2d20.createDialog({
    rollName,
    diceNum,
    attribute: attribute?.value || 0, 
    skill: skill?.value || 0, 
    tag,
    complication,
    rollLocation,
    actor,
    item
}).then(result => {
    if (result) {
        console.log("Roll result:", result);
    } else {
        console.log("Dialog closed without rolling.");
    }
});

if(this.item.system.weaponType == "unarmed"){
    diceNum = this.item.system.damage.rating + this.actor.system.meleeDamage.value;
    console.log(diceNum)
} else if(this.item.system.weaponType == "melee"){
    diceNum = this.item.system.damage.rating + this.actor.system.meleeDamage.value,
    console.log(diceNum)
} else diceNum = this.item.system.damage.rating;
console.log(diceNum)


console.log(this.item.system.damage.rating,this.item.system.damage,this.item.system);
const falloutRoll = null;
const weapon = this.item;
fallout.DialogD6.createDialog({
    rollName,
	diceNum,
	falloutRoll,
	weapon,
}).then(result => {
    if (result) {
        console.log("Roll result:", result);
    } else {
        console.log("Dialog closed without rolling.");
    }
});
    }
}

static consumeActionEconomy(item) {
    let consumeID = undefined;
    
    if (item.type == "weapon") {
        consumeAction("Major");
    }
    
    if (item.type == "special_ability") {
        consumeAction("Major");
    }
   }
}
class falloutButtonPanelButton extends ARGON.MAIN.BUTTONS.ButtonPanelButton{
    constructor({ type, item, color }) {
        super();
        this.type = type;
        this.item = item;
        this.color = color;
        this._parent = parent;
    }
    get hasContents() {
        return this.item.length;
    }
    get colorScheme() {
        if (this.type == "consumable"){
        return 1;
    } else if (this.type == "buyd20s") {
        return 2;
    }
        
        return this.color;
    }
    get id() {
        return `${this.type}-${this.color}`
    }
    get label() {
        switch (this.type) {
            case "consumable":
                return "Take a Chem";
            case "firstaid":
                return "First Aid";
            case "command":
                return "Command";
           case "buyd20s":
                return "Buy d20s";
        }
    }
    get icon() {
        switch (this.type) {
            case "consumable":
                return "modules/enhancedcombathud-fallout/icons/drink-me.svg";
            case "firstaid":
                return "modules/enhancedcombathud-fallout/icons/first-aid-kit.svg";
            case "command":
                return "modules/enhancedcombathud-fallout/icons/convince.svg";
            case "buyd20s":
                return "modules/enhancedcombathud-fallout/icons/coinflip.svg";
        }
    }
    get buttonPanelContainer() {
        return ui.ARGON.buttonPanelContainer;
    }
    get validitems(){
        let items = [];
        let specialActions
       
        switch (this.type) {
            case "firstaid":
                
                specialActions = Object.values(falloutMajorItems).filter(item => {
                return item.name && item.name.toLowerCase().includes("first aid ");
                     });
            
            items = specialActions;
             break;
             case "command":
                
                specialActions = Object.values(falloutMajorItems).filter(item => {
                return item.name && item.name.toLowerCase().includes("command ");
                     });
            
            items = specialActions;
             break;
             case "buyd20s":
                
                specialActions = Object.values(falloutHItems).filter(item => {
                return item.name && item.name.toLowerCase().includes("buy ");
                     });
            
            items = specialActions;
             break;
           
            case "consumable":
                let consumableItems = this.actor.items.filter((item) => item.system.consumableType === "chem");                                            
                items = consumableItems;
                break;
            default:
                items = this.actor.items.filter(item => item.type == this.type);
                
                items = items.filter(item => actioninfo(item).actionType.value == this.actionType);
                break;
        }
        return items;
    }
    get isvalid() {
        return this.validitems.length;
    }
   
    async _getPanel() {
        if (this.type == "firstaid"){
            return new falloutButtonPanel({id: this.id, buttons: this.validitems.map(item => new falloutItemButton({item}))});
        } else if (this.type == "command"){
            return new falloutButtonPanel({id: this.id, buttons: this.validitems.map(item => new falloutItemButton({item}))});
        }else if (this.type == "buyd20s"){
            return new falloutButtonPanel({id: this.id, buttons: this.validitems.map(item => new falloutItemButton({item}))});
        }
        return new falloutButtonPanel({id: this.id, buttons: this.validitems.map(item => new falloutItemButton({item}))});
        
    }
}
class falloutButtonPanel extends ARGON.MAIN.BUTTON_PANELS.ButtonPanel {
    get actionType() {
        return this.parent?.actionType;
    }
    
    async sortbuttons(sortfunction) {
        this._buttons = this._buttons.sort((a,b) => sortfunction(a.item, b.item));
        
        this.render();
    }
}

class falloutSpecialActionButton extends ARGON.MAIN.BUTTONS.ActionButton {
    constructor(specialItem) {
        super();
        this.item = new CONFIG.Item.documentClass(specialItem, {
            parent: this.actor,
        });
    }

    get label() {
        return this.item.name;
    }

    get icon() {
        return this.item.img;
    }

    get hasTooltip() {
        return true;
    }
    
    get colorScheme() {
        switch (this.item?.flags[ModuleName]?.actiontype) {
            case "Major":
                return 0;
                break;
            case "Minor":
                return 1;
                break;
            case "AP":
                return 2;
                break;
            case "Luck":
                return 3;
                break;
        }
        return 0;
    }

    async getTooltipData() {
        const tooltipData = await getTooltipDetails(this.item, this.actor.system.creatureType);
        return tooltipData;
    }
    
    async _onLeftClick(event) {
        var used = true;
        this.actorItem ? await this.activity.use({ event }, { event }) : await this.createChatMessage();
        const item = this.item;
        
        if (item.system.skill) {
            rollCheck("skill", this.item.system.skill, this.actor);
        }
        
        if (item.flags[ModuleName]?.onclick) {
            used = item.flags[ModuleName]?.onclick({activeWeapon : (await ui.ARGON.components.weaponSets.getactiveSet()).primary});
        }
        if (!game.settings.get(ModuleName, "Injuries")) {
    
        } else {
            if ((item.name === "Sprint")) {
                let actor = this.actor
                console.log(`${actor.name} clicked the Sprint button.`);
            
                const bodyParts = actor.system.body_parts;
                const legKeys = ["legL", "legR"];
                const hasLegInjury = legKeys.some((key) => bodyParts[key]?.injuries.includes(2));
            
                if (hasLegInjury) {
                    ui.notifications.warn(`${actor.name} cannot Sprint due to leg injuries.`);
                    ChatMessage.create({
                        user: game.user.id,
                        speaker: ChatMessage.getSpeaker({ actor }),
                        content: `<strong>${actor.name}:</strong> Sprint action blocked due to leg injuries.`,
                        type: CONST.CHAT_MESSAGE_TYPES.OTHER,
                    });
            
                    return; 
                }
            
           
                console.log(`${actor.name} is Sprinting.`);
            }
            if (item.name === "Move") {
                let actor = this.actor;
                console.log(`${actor.name} clicked the Move button.`);
            
                const bodyParts = actor.system.body_parts;
                const legKeys = ["legL", "legR"];
                const hasLegInjury = legKeys.some((key) => bodyParts[key]?.injuries.includes(2));
            
                if (hasLegInjury) {
                    ui.notifications.warn(`${actor.name} cannot Move as a minor action due to leg injuries. It now costs a major action.`);
                    ChatMessage.create({
                        user: game.user.id,
                        speaker: ChatMessage.getSpeaker({ actor }),
                        content: `<strong>${actor.name}:</strong> Movement action requires a major action due to leg injuries.`,
                        style: CONST.CHAT_MESSAGE_STYLES.OTHER, // Updated to use CHAT_MESSAGE_STYLES
                    });
            
            
                    // Consume a major action
                    falloutSpecialActionButton.consumeActionEconomy({ flags: { [ModuleName]: { actiontype: "Major" } } });
            
                    return; // Stop further execution
                }
            
                // Default Move logic for actors without leg injuries
                console.log(`${actor.name} moves using a minor action.`);
                item.system.description = "Movement action. Move up to your Endurance. Alternatively, stand up from a prone position.";
                falloutSpecialActionButton.consumeActionEconomy({ flags: { [ModuleName]: { actiontype: "Minor" } } });
            }
            
            const apCostItems = ["Assist", "Defend", "First Aid", "Ready", "Sprint"]; 
const nonApCostItems = ["Interact", "Aim"]; 

if (apCostItems.includes(item.name) || nonApCostItems.includes(item.name)) {
    let actor = this.actor;
    console.log(`${actor.name} clicked the ${item.name} button.`);

    const bodyParts = actor.system.body_parts;
    const hasHeadInjury = bodyParts.head?.injuries.includes(2);

 
    const costsAP = apCostItems.includes(item.name) && hasHeadInjury;

    if (hasHeadInjury) {
        ui.notifications.warn(`${actor.name}'s difficulty for ${item.name} is increased due to a head injury.`);
        ChatMessage.create({
            user: game.user.id,
            speaker: ChatMessage.getSpeaker({ actor }),
            content: `<strong>${actor.name}:</strong> The difficulty of ${item.name} is increased due to head injury.`,
            style: CONST.CHAT_MESSAGE_STYLES.OTHER,
        });

        console.log(`Increased difficulty applied to ${item.name} due to head injury.`);
    }

    if (costsAP) {
        try {
          
            if (!fallout.APTracker._instance) {
                await fallout.APTracker.initialise();
            }

        
            const apType = "partyAP";
            const adjustmentValue = -2; 
            const currentPartyAP = game.settings.get("fallout", apType);

       
            if (currentPartyAP + adjustmentValue < 0) {
                const message = "Not enough AP available to perform this action!";
                console.warn(message);

                ChatMessage.create({
                    content: `<p><strong>System:</strong> ${message}</p>`,
                });

                return; 
            }

            await fallout.APTracker.adjustAP(apType, adjustmentValue);
            console.log(`Adjusted ${apType} by ${adjustmentValue} for action ${item.name}.`);

            ChatMessage.create({
                user: game.user.id,
                speaker: ChatMessage.getSpeaker({ actor }),
                content: `<strong>${actor.name}:</strong> Spends 2 AP to take the action: <em>${item.name}</em>.`,
                style: CONST.CHAT_MESSAGE_STYLES.OTHER,
            });

        } catch (error) {
            console.error("Error adjusting AP:", error);
        }
    } else {
        ChatMessage.create({
            user: game.user.id,
            speaker: ChatMessage.getSpeaker({ actor }),
            content: `<strong>${actor.name}:</strong> Takes the action: <em>${item.name}</em>.`,
            style: CONST.CHAT_MESSAGE_STYLES.OTHER,
        });
    }

    
    console.log(`${actor.name} proceeds with ${item.name}.`);
}

        }

        
        if (used && item.name !== "Sprint") {
            falloutSpecialActionButton.consumeActionEconomy(this.item);
            const isLuckItem = Object.keys(falloutLuckItems).some(key => falloutLuckItems[key].name === this.item.name);
            
            if (used && isLuckItem) {
                if (this.actor.system.luckPoints > 0) {
                    this.actor.update({ "system.luckPoints": this.actor.system.luckPoints - 1 });
                    console.log(`Luck point consumed by using ${this.item.name}. Remaining Luck: ${this.actor.system.luckPoints - 1}`);
                } else {
                    ui.notifications.warn("No more Luck points left!");
                    return; 
                }
                console.log("Checking if item is AP-related...");
        }
     
            
        
            const isAPItem = Object.keys(falloutHItems).some(key => falloutHItems[key].name === this.item.name);
        
            if (isAPItem) {
                try {
                    if (!fallout.APTracker._instance) {
                        await fallout.APTracker.initialise();
                    }            
                    const apType = "partyAP";
                    const adjustmentValue = -1;            
                    const currentPartyAP = game.settings.get("fallout", apType);
            
                    if (currentPartyAP + adjustmentValue < 0) {
                        const message = "Not enough AP available to perform this action!";
                        console.warn(message);
                        ChatMessage.create({
                            content: `<p><strong>System:</strong> ${message}</p>`,
                        });            
                        return; 
                    }            
          
                    await fallout.APTracker.adjustAP(apType, adjustmentValue);
                    console.log(`Adjusted ${apType} by ${adjustmentValue}`);
                } catch (error) {
                    console.error("Error adjusting AP:", error);
                }
            }
        


       
        if(used && item.name === "Rally") {
            const actor = this.actor;
            let enduranceValue = actor.system?.attributes?.end?.value ?? 0;
            let survivalSkill = actor.items.find(i => i.name.toLowerCase() === "survival" && i.type === "skill");
            let survivalValue = survivalSkill?.system?.value ?? 0;
            console.log(survivalSkill)
            const rollName = "Rally";
            let diceNum = 2; 
            let tag = survivalSkill.tag || false; 
            const complication = 20; 
            const rollLocation = false; 
            
            fallout.Dialog2d20.createDialog({
                rollName,
                diceNum,
                attribute: enduranceValue|| 0, 
                skill: survivalValue || 0, 
                tag,
                complication,
                rollLocation,
                actor,
                item
            }).then(result => {
                if (result) {
                    console.log("Roll result:", result);
                } else {
                    console.log("Dialog closed without rolling.");
                }
            });          
        } else if (used && item.name === "Defend"){
            const actor = this.actor;
            let attributeValue
            let skillSkill
            let skillValue
            let rollName
            attributeValue = actor.system?.attributes?.agi?.value ?? 0;
            skillSkill = actor.items.find(i => i.name.toLowerCase() === "athletics" && i.type === "skill");
            skillValue = skillSkill?.system?.value ?? 0;
            rollName = "Defend";
            let diceNum = 2; 
            const tag = skillValue.tag || false; 
            const complication = 20; 
            const rollLocation = false;
            fallout.Dialog2d20.createDialog({
                rollName,
                diceNum,
                attribute: attributeValue || 0,
                skill: skillValue || 0,
                tag,
                complication,
                rollLocation,
                actor,
                item
            }).then(result => {
                if (result) {
                    console.log("Roll result:", result);      
                  
                    const dicesRolled = result.dicesRolled;
            
                    if (Array.isArray(dicesRolled)) {                       
                        dicesRolled.forEach((dice, index) => {
                            console.log(`Dice ${index + 1}: Success = ${dice.success}`);
                        });
                        const totalSuccesses = dicesRolled.reduce((sum, dice) => sum + (dice.success || 0), 0);
                        //console.log("Total Successes:", totalSuccesses);
                        const defenseValue = this.actor.system?.defense?.value || 0;
                        const successMessage = totalSuccesses >= defenseValue 
                            ? `<strong>${rollName}</strong>: You successfully defended!`
                            : `<strong>${rollName}</strong>: Your defense failed.`;
                        ChatMessage.create({
                            user: game.user.id,
                            speaker: ChatMessage.getSpeaker({ actor }),
                            content: successMessage,
                            type: CONST.CHAT_MESSAGE_TYPES.ROLL
                        });
                        
                    } else {
                        console.log("dicesRolled is not an array.");
                    }
                } else {
                    console.log("Dialog closed without rolling.");
                }
               
            });                  
        }
    }               
}
    
    static consumeActionEconomy(item) {
        consumeAction(item.flags[ModuleName].actiontype);
    }
    async createChatMessage() {
        return await ChatMessage.create({
            user: game.user.id,
            speaker: {
                actor: this.actor,
                token: this.actor.token,
                alias: this.actor.name,
            },
            content: `
                <div class="fallout chat-item">
                    ${this.item.img ? `
                        <div style="text-align: center; margin-bottom: 0.5rem;">
                            <img class="item-img" src="${this.item.img}" title="${this.item.name}" />
                        </div>
                    ` : ''}
    
                    <div class="item-name">
                        <h2 style="border-bottom: none;"><strong>${this.item.name}</strong></h2>
                    </div>
    
                    ${this.item.system.description ? `
                        <div class="description">
                            ${this.item.system.description}
                        </div>
                        <hr>
                    ` : ''}
    
                    ${this.item.system.isWeapon ? `
                        <p><strong class="upperC">${game.i18n.localize("FALLOUT.TEMPLATES.Weapon_Type")}:</strong>
                        ${game.i18n.localize(CONFIG.FALLOUT.WEAPON_TYPES[this.item.system.weaponType])}</p>
    
                        <p><strong class="upperC">${game.i18n.localize("FALLOUT.TEMPLATES.DAMAGE_TYPE")}:</strong>
                        ${Object.keys(this.item.system.damage.damageType).map(key => 
                            this.item.system.damage.damageType[key] ? `${game.i18n.localize(CONFIG.FALLOUT.DAMAGE_TYPES[key])} <i class="fo-${key}"></i>` : ''
                        ).join(' ')}</p>
    
                        <p><strong class="upperC">${game.i18n.localize("FALLOUT.UI.BaseDamage")}:</strong> ${this.item.system.damage.rating}</p>
                        <p class="capitalize"><strong class="upperC">${game.i18n.localize("FALLOUT.TEMPLATES.RANGE")}:</strong> ${this.item.system.range}</p>
                        <p><strong class="upperC">${game.i18n.localize("FALLOUT.TEMPLATES.FIRE_RATE")}:</strong> ${this.item.system.fireRate}</p>
                        <p><strong class="upperC">${game.i18n.localize("FALLOUT.TEMPLATES.AMMO")}:</strong> ${this.item.system.ammo}</p>
                        <p><strong class="upperC">${game.i18n.localize("FALLOUT.TEMPLATES.Tear")}:</strong> ${this.item.system.tear}</p>
                        <p><strong class="upperC">${game.i18n.localize("FALLOUT.TEMPLATES.WEAPON_QUALITIES")}:</strong> ${this.item.system.damage.weaponQuality}</p>
                        <p><strong class="upperC">${game.i18n.localize("FALLOUT.TEMPLATES.Damage_Effects")}:</strong> ${this.item.system.damage.damageEffect}</p>
                    ` : ''}
                    
                    <hr>
                </div>
            `,
        });
    }
    
}
class falloutWeaponSets extends ARGON.WeaponSets {
    constructor(...args) {
        super(...args);
        
    }
    
    async getDefaultSets() {
        let attacks = this.actor.items.filter((item) => ["weapon"].includes(item.type));
        
        return {
            1: {
                primary: attacks[0]?.id ?? null,
                secondary: null,
            },
            2: {
                primary: attacks[1]?.id ?? null,
                secondary: null,
            },
            3: {
                primary: attacks[2]?.id ?? null,
                secondary: null,
            },
            4: {
                primary: attacks[3]?.id ?? null,
                secondary: null,
            },
            5: {
                primary: attacks[4]?.id ?? null,
                secondary: null,
            },
        };
    }

    async _onSetChange({sets, active}) {
        const updates = [];
        const activeSet = sets[active];
        const activeItems = Object.values(activeSet).filter((item) => item);
        const inactiveSets = Object.values(sets).filter((set) => set !== activeSet);
        const inactiveItems = inactiveSets.flatMap((set) => Object.values(set)).filter((item) => item);
        activeItems.forEach((item) => {
            if(!item.system?.equipped) updates.push({_id: item.id, "system.equipped": true});
        });
        inactiveItems.forEach((item) => {
            if(item.system?.equipped) updates.push({_id: item.id, "system.equipped": false});
        });
        return await this.actor.updateEmbeddedDocuments("Item", updates);
    }

    async _getSets() { //overwrite because slots.primary/secondary contains id, not uuid
        const sets = mergeObject(await this.getDefaultSets(), deepClone(this.actor.getFlag("enhancedcombathud", "weaponSets") || {}));

        for (const [set, slots] of Object.entries(sets)) {
            slots.primary = slots.primary ? await this.actor.items.get(slots.primary) : null;
            slots.secondary = null;
        }
        return sets;
    }
    
    async _onDrop(event) {
        try {      
            event.preventDefault();
            event.stopPropagation();
            const data = JSON.parse(event.dataTransfer.getData("text/plain"));
            const item = await fromUuid(data.uuid);
            if(! ["weapon"].includes(item?.type)) return;
            const set = event.currentTarget.dataset.set;
            const slot = event.currentTarget.dataset.slot;
            const sets = this.actor.getFlag("enhancedcombathud", "weaponSets") || {};
            sets[set] = sets[set] || {};
            sets[set][slot] = item.id;
            await this.actor.setFlag("enhancedcombathud", "weaponSets", sets);
            await this.render();
        } catch (error) {
            
        }
    }
    
    get template() {
        return `modules/${ModuleName}/templates/falloutWeaponSets.hbs`;
    }
    
    async getactiveSet() {
        const sets = await this._getSets();
        return sets[this.actor.getFlag("enhancedcombathud", "activeWeaponSet")];
    }
    }
    CoreHUD.definePortraitPanel(falloutPortraitPanel);
    CoreHUD.defineDrawerPanel(falloutDrawerPanel);
    CoreHUD.defineMainPanels([
		    falloutMajorPanel,
		    falloutMinorPanel,
            falloutAPPanel,
            falloutLuckPanel,
		    ARGON.PREFAB.PassTurnPanel
    ]);  
	CoreHUD.defineMovementHud(null);
	CoreHUD.defineWeaponSets(falloutWeaponSets);
	CoreHUD.defineSupportedActorTypes(["character", "npc","robot","creature"]);
});