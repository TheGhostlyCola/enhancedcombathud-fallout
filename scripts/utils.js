const ModuleName = "enhancedcombathud-fallout";
const SystemName = "fallout";


async function getTooltipDetails(item) {
    let title,itemtype, description, ammo, creatureAttribute, creatureSkill, damage, damageEffect, damageType, weaponQuality, firerate, range;
    //let propertiesLabel = game.i18n.localize(ModuleName + ".Titles.Properies");
	//let properties = [];

    let details = [];
	
	if (!item || !item.system) return;

    title = item.name;
    description = item.system?.description;
    itemtype = item.type;
    ammo = item.system.ammo;
    creatureAttribute = item.system.creatureAttribute;
    creatureSkill = item.system.creatureSkill;
    damage = item.system?.damage?.rating;
    //damageEffect = item.system?.damage?.damageEffect;
    damageType = item.system?.damage?.damageType;
    //weaponQuality = item.system?.damage?.weaponQuality;
    firerate = item.system.fireRate;
    range = item.system.range;

    damageEffect = [];

if (item.system?.damage?.damageEffect.arc.value == true) {
    damageEffect.push("Arc");
}
if (item.system?.damage?.damageEffect.breaking.value == true) {
    damageEffect.push("Breaking");
}
if (item.system?.damage?.damageEffect.burst.value == true) {
    damageEffect.push("Burst");
}
if (item.system?.damage?.damageEffect.freeze.value == true) {
    damageEffect.push("Freeze");
}
if (item.system?.damage?.damageEffect.persistent.value == true) {
    damageEffect.push("Persistent");
}
if (item.system?.damage?.damageEffect.piercing_x.value == true) {
    damageEffect.push("Piercing");
}
if (item.system?.damage?.damageEffect.radioactive.value == true) {
    damageEffect.push("Radioactive");
}
if (item.system?.damage?.damageEffect.spread.value == true) {
    damageEffect.push("Spread");
}
if (item.system?.damage?.damageEffect.stun.value == true) {
    damageEffect.push("Stun");
}
if (item.system?.damage?.damageEffect.vicious.value == true) {
    damageEffect.push("Vicious");
}

damageEffect = damageEffect.join(", "); // Combine effects into a single string

    weaponQuality = [];

if (item.system?.damage?.weaponQuality.accurate.value == true) {
    weaponQuality.push("Accurate")
}
if (item.system?.damage?.weaponQuality.ammo_hungry_x.value == true) {
    weaponQuality.push("Ammo Hungry")
}
if (item.system?.damage?.weaponQuality.blast.value == true) {
    weaponQuality.push("Blast")
}
if (item.system?.damage?.weaponQuality.bombard.value == true) {
    weaponQuality.push("Bombard")
}
if (item.system?.damage?.weaponQuality.close_quarters.value == true) {
    weaponQuality.push("Close Quarters")
}
if (item.system?.damage?.weaponQuality.concealed.value == true) {
    weaponQuality.push("Concealed")
}
if (item.system?.damage?.weaponQuality.delay_x.value == true) {
    weaponQuality.push("Delay")
}
if (item.system?.damage?.weaponQuality.gatling.value == true) {
    weaponQuality.push("Gatling")
}
if (item.system?.damage?.weaponQuality.inaccurate.value == true) {
    weaponQuality.push("Inaccurate")
}
if (item.system?.damage?.weaponQuality.limited.value == true) {
    weaponQuality.push("Limited")
}
if (item.system?.damage?.weaponQuality.mine.value == true) {
    weaponQuality.push("Mine")
}
if (item.system?.damage?.weaponQuality.night_vision.value == true) {
    weaponQuality.push("Night Vision")
}
if (item.system?.damage?.weaponQuality.parry.value == true) {
    weaponQuality.push("Parry")
}
if (item.system?.damage?.weaponQuality.placed.value == true) {
    weaponQuality.push("Placed")
}
if (item.system?.damage?.weaponQuality.recoil_x.value == true) {
    weaponQuality.push("Recoil")
}
if (item.system?.damage?.weaponQuality.recon.value == true) {
    weaponQuality.push("Recon")
}
if (item.system?.damage?.weaponQuality.slow_load.value == true) {
    weaponQuality.push("Slow Load")
}
if (item.system?.damage?.weaponQuality.accurate.value == true) {
    weaponQuality.push("Accurate")
}
if (item.system?.damage?.weaponQuality.suppressed.value == true) {
    weaponQuality.push("Suppressed")
}
if (item.system?.damage?.weaponQuality.surge.value == true) {
    weaponQuality.push("Surge")
}
if (item.system?.damage?.weaponQuality.thrown.value == true) {
    weaponQuality.push("Thrown")
}
if (item.system?.damage?.weaponQuality.two_handed.value == true) {
    weaponQuality.push("Two-Handed")
}
if (item.system?.damage?.weaponQuality.unreliable.value == true) {
    weaponQuality.push("Unreliable")
}
if (item.system?.damage?.weaponQuality.unstable_radiation.value == true) {
    weaponQuality.push("Unstable Radiation")
}

weaponQuality = weaponQuality.join(", "); // Combine effects into a single string

    switch (itemtype) {
        case "weapon":
                details.push({
                    label: "Damage",
                    value: damage
                });
                details.push({
                    label: "Ammo",
                    value: ammo
                });
                details.push({
                    label: "Effects",
                    value: damageEffect
                });
                details.push({
                    label: "Qualities",
                    value: weaponQuality
                });
                details.push({
                    label: "Firerate",
                    value: firerate
                });
                details.push({
                    label: "Range",
                    value: range
                });
                break;
        case "skill":
            
            }
        return { title, description, details };

}
async function sendBuyAPChatCard(skillName, apCost) {
    // Construct the chat card content
    const content = `
        <div class="fallout chat-item">
            <h2 style="text-align: center;"><strong>${skillName}</strong></h2>
            <p><strong>AP Cost:</strong> ${Math.abs(apCost)}</p>
            <p>${skillName} action executed.</p>
        </div>
    `;

    // Send the chat message
    await ChatMessage.create({
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ actor: game.user.character }),
        content: content,
        type: CONST.CHAT_MESSAGE_TYPES.OTHER,
    });
}
async function adjustPartyAP(adjustmentValue) {
    try {
        // Ensure APTracker is initialized
        if (!fallout.APTracker._instance) {
            await fallout.APTracker.initialise();
        }

        // Define AP type
        const apType = "partyAP";

        // Get the current AP value
        const currentPartyAP = game.settings.get("fallout", apType);

        // Check if there's enough AP to subtract
        if (currentPartyAP + adjustmentValue < 0) {
            const message = "Not enough AP available to perform this action!";
            console.warn(message);

            // Send a chat message
            ChatMessage.create({
                content: `<p><strong>System:</strong> ${message}</p>`,
                // whisper: ChatMessage.getWhisperRecipients("GM"), // Uncomment for GM-only messages
            });

            return false; // Indicate the adjustment could not be performed
        }

        // Subtract AP
        await fallout.APTracker.adjustAP(apType, adjustmentValue);
        console.log(`Adjusted ${apType} by ${adjustmentValue}`);
        return true; // Indicate success
    } catch (error) {
        console.error("Error adjusting AP:", error);
        return false; // Indicate failure
    }
}/*
async function applyInjuries(actor) {
    const bodyParts = actor.system.body_parts;

    if (!bodyParts) {
        console.warn("No body parts found for this actor.");
        return;
    }

    // Retrieve or initialize processed injuries flag
    if (!actor.getFlag("fallout", "processedInjuries")) {
        await actor.setFlag("fallout", "processedInjuries", {});
    }
    let processedInjuries = actor.getFlag("fallout", "processedInjuries");

    // Initialize processed injuries for each body part
    const bodyPartKeys = ["torso", "legL", "legR", "head", "armL", "armR"];
    for (const part of bodyPartKeys) {
        if (!processedInjuries[part]) {
            processedInjuries[part] = [];
        }
    }

    // Function to reset processed injuries for healed body parts
    const resetProcessedInjuriesIfHealed = (key) => {
        const currentInjuries = bodyParts[key]?.injuries || [];
        if (!currentInjuries.some((injury) => injury === 2)) {
            console.log(`${actor.name}: All injuries healed on ${key}. Resetting processed injuries.`);
            processedInjuries[key] = [];
        }
    };

    // Check and apply leg injuries
    for (const legKey of ["legL", "legR"]) {
        const currentInjuries = bodyParts[legKey]?.injuries || [];
        const newInjuries = currentInjuries.filter((injury) => injury === 2 && !processedInjuries[legKey].includes(injury));

        if (newInjuries.length > 0) {
            ChatMessage.create({
                user: game.user.id,
                speaker: ChatMessage.getSpeaker({ actor }),
                content: `<strong>${actor.name}:</strong> A leg injury forces you to fall prone and restricts your movement.`,
                style: CONST.CHAT_MESSAGE_STYLES.OTHER,
            });

            // Update processed injuries for this leg
            processedInjuries[legKey] = [...processedInjuries[legKey], ...newInjuries];
        }

        // Reset processed injuries if the leg is healed
        resetProcessedInjuriesIfHealed(legKey);
    }

    // Check and apply chest injuries
    const currentChestInjuries = bodyParts.torso?.injuries || [];
    const newChestInjuries = currentChestInjuries.filter((injury) => injury === 2 && !processedInjuries.torso.includes(injury));

    if (newChestInjuries.length > 0) {
        console.log(`${actor.name} has new chest injuries.`);

        // Notify via chat
        ChatMessage.create({
            user: game.user.id,
            speaker: ChatMessage.getSpeaker({ actor }),
            content: `<strong>${actor.name}:</strong> A chest injury has been detected.`,
            style: CONST.CHAT_MESSAGE_STYLES.OTHER,
        });

        // Update processed injuries
        processedInjuries.torso = [...processedInjuries.torso, ...newChestInjuries];
    }

    // Reset processed injuries if the torso is healed
    resetProcessedInjuriesIfHealed("torso");

    // Check and apply head injuries
    const currentHeadInjuries = bodyParts.head?.injuries || [];
    const newHeadInjuries = currentHeadInjuries.filter((injury) => injury === 2 && !processedInjuries.head.includes(injury));

    if (newHeadInjuries.length > 0) {
        console.log(`${actor.name} has new head injuries.`);

        // Notify via chat
        ChatMessage.create({
            user: game.user.id,
            speaker: ChatMessage.getSpeaker({ actor }),
            content: `<strong>${actor.name}:</strong> A head injury leaves you dazed, restricting your actions and vision.`,
            style: CONST.CHAT_MESSAGE_STYLES.OTHER,
        });

        // Update processed injuries
        processedInjuries.head = [...processedInjuries.head, ...newHeadInjuries];
    }

    // Reset processed injuries if the head is healed
    resetProcessedInjuriesIfHealed("head");

// Check and apply arm injuries
// Check and apply arm injuries

    // Check and apply arm injuries
    // Check and apply arm injuries
    for (const armKey of ["armL", "armR"]) {
        const currentInjuries = bodyParts[armKey]?.injuries || [];
        const newInjuries = currentInjuries
            .map((injury, index) => ({ index, injury })) // Track index for unique injuries
            .filter(({ injury, index }) => injury === 2 && !processedInjuries[armKey].some(processed => processed.index === index));

        // Send message only for new injuries
        if (newInjuries.length > 0) {
            for (const { index } of newInjuries) {
                ChatMessage.create({
                    user: game.user.id,
                    speaker: ChatMessage.getSpeaker({ actor }),
                    content: `<strong>${actor.name}:</strong> Your arm is broken! You drop any object held in that hand, and the arm is broken or otherwise unable to move. You cannot perform any actions using that arm by itself or alongside your other arm.`,
                    style: CONST.CHAT_MESSAGE_STYLES.OTHER,
                });
            }

            // Add new injuries to processed injuries
            processedInjuries[armKey] = [...processedInjuries[armKey], ...newInjuries];
        }

        // Retain only active injuries in processed injuries
        processedInjuries[armKey] = processedInjuries[armKey].filter(({ index }) => currentInjuries[index] === 2);
    }

    // Update the flag with processed injuries
    await actor.setFlag("fallout", "processedInjuries", processedInjuries);
}*/
async function applyInjuries(actor) {
    const bodyParts = actor.system.body_parts;

    if (!bodyParts) {
        console.warn("No body parts found for this actor.");
        return;
    }

    // Retrieve or initialize processed injuries flag
    if (!actor.getFlag("fallout", "processedInjuries")) {
        await actor.setFlag("fallout", "processedInjuries", {});
    }
    let processedInjuries = actor.getFlag("fallout", "processedInjuries");

    const resetProcessedInjuriesIfHealed = async (key) => {
        const currentInjuries = bodyParts[key]?.injuries || [];
        if (!currentInjuries.some((injury) => injury === 2)) {
            console.log(`${actor.name}: All injuries healed on ${key}. Resetting processed injuries.`);
            processedInjuries[key] = [];

            // Remove the icon effect for this injury
            const effects = actor.effects.filter(e => e.getFlag("core", "statusId") === `${key}-injury`);
            for (const effect of effects) {
                await effect.delete();
            }
        }
    };

    // Function to handle adding effects
    const addEffect = async (key, label, icon) => {
        const effectData = {
            label: label,
            icon: icon,
            origin: `Actor.${actor.id}`,
            disabled: false, // Effect is active
            flags: {
                core: {
                    statusId: `${key}-injury`, // Unique ID per body part
                },
            },
        };
        await actor.createEmbeddedDocuments("ActiveEffect", [effectData]);
    };
    
    // Check and apply head injuries
    const currentHeadInjuries = bodyParts.head?.injuries || [];
    const newHeadInjuries = currentHeadInjuries.filter((injury) => injury === 2 && !processedInjuries.head.includes(injury));
    if (newHeadInjuries.length > 0) {
        ChatMessage.create({
            user: game.user.id,
            speaker: ChatMessage.getSpeaker({ actor }),
            content: `<strong>${actor.name}:</strong> A head injury leaves you dazed, restricting your actions and vision.`,
            style: CONST.CHAT_MESSAGE_STYLES.OTHER,
        });

        await addEffect("head", "Head Injury", "/modules/enhancedcombathud-fallout/icons/head-injury.svg");
        processedInjuries.head = [...processedInjuries.head, ...newHeadInjuries];
    }
    resetProcessedInjuriesIfHealed("head");

  
    const currentChestInjuries = bodyParts.torso?.injuries || [];
    const newChestInjuries = currentChestInjuries.filter((injury) => injury === 2 && !processedInjuries.torso.includes(injury));
    if (newChestInjuries.length > 0) {
        ChatMessage.create({
            user: game.user.id,
            speaker: ChatMessage.getSpeaker({ actor }),
            content: `<strong>${actor.name}:</strong> A chest injury has been detected.`,
            style: CONST.CHAT_MESSAGE_STYLES.OTHER,
        });

        await addEffect("torso", "Torso Injury", "/modules/enhancedcombathud-fallout/icons/torso-injury.svg");
        processedInjuries.torso = [...processedInjuries.torso, ...newChestInjuries];
    }
    resetProcessedInjuriesIfHealed("torso");
    for (const legKey of ["legL", "legR"]) {
        const currentInjuries = bodyParts[legKey]?.injuries || [];
        const newInjuries = currentInjuries.filter((injury) => injury === 2 && !processedInjuries[legKey].includes(injury));
        if (newInjuries.length > 0) {
            const label = legKey === "legL" ? "Left Leg Injury" : "Right Leg Injury";
            const icon = legKey === "legL" 
                ? "/modules/enhancedcombathud-fallout/icons/left-knee.svg" 
                : "/modules/enhancedcombathud-fallout/icons/right-knee.svg";

            ChatMessage.create({
                user: game.user.id,
                speaker: ChatMessage.getSpeaker({ actor }),
                content: `<strong>${actor.name}:</strong> ${label} forces you to fall prone and restricts movement.`,
                style: CONST.CHAT_MESSAGE_STYLES.OTHER,
            });

            await addEffect(legKey, label, icon);
            processedInjuries[legKey] = [...processedInjuries[legKey], ...newInjuries];
        }
        resetProcessedInjuriesIfHealed(legKey);
    }
    for (const armKey of ["armL", "armR"]) {
        const currentInjuries = bodyParts[armKey]?.injuries || [];
        const newInjuries = currentInjuries
            .filter((injury) => injury === 2 && !processedInjuries[armKey].includes(injury));

        if (newInjuries.length > 0) {
            const label = armKey === "armL" ? "Left Arm Injury" : "Right Arm Injury";
            const icon = armKey === "armL" 
                ? "/modules/enhancedcombathud-fallout/icons/left-arm.svg" 
                : "/modules/enhancedcombathud-fallout/icons/right-arm.svg";

            ChatMessage.create({
                user: game.user.id,
                speaker: ChatMessage.getSpeaker({ actor }),
                content: `<strong>${actor.name}:</strong> ${label} detected. Actions using this arm are restricted.`,
                style: CONST.CHAT_MESSAGE_STYLES.OTHER,
            });

            await addEffect(armKey, label, icon);
            processedInjuries[armKey] = [...processedInjuries[armKey], ...newInjuries];
        }
        resetProcessedInjuriesIfHealed(armKey);
    }

    await actor.setFlag("fallout", "processedInjuries", processedInjuries);
}





















export {ModuleName, SystemName, getTooltipDetails,sendBuyAPChatCard, adjustPartyAP, applyInjuries}