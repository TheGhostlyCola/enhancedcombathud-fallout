import { ModuleName } from "./utils.js";

const ItemReplacementID = "_argonUI_";

var falloutMinorItems = {};

var falloutMajorItems = {};

var falloutHItems = {};

var falloutLuckItems = {};

function registerfalloutItems () {
        falloutMinorItems = {
            groupflags : {
                actiontype : "Minor"
            },
            Interact : {
                img: "/modules/enhancedcombathud-fallout/icons/Hand.svg",
                name: game.i18n.localize("Interact"),
                type : "skill",
                system : {
                    description : ("Interact with your equipment or environment in a simple way, like opening a door, or pushing a button"),
            }
            },
            Move : {
                img : "/modules/enhancedcombathud-fallout/icons/walk.svg",
                name: game.i18n.localize("Move"),
                type : "skill",
                system : {
                    description : ("Movement action. Move up to your Endurance. Alternatively, stand up from a prone position."),
                }
            },
            Aim : {
                img: "/modules/enhancedcombathud-fallout/icons/reticule.svg",
                name: game.i18n.localize("Aim"),
                type : "skill",
                system : {
                    description : ("Re-roll 1d20 on the first attack roll you make this turn."),
            }
            },
            Take_a_Chem : {
                img: "/modules/enhancedcombathud-fallout/icons/drink-me.svg",
                name: game.i18n.localize("Take a Chem"),
                type : "skill",
                system : {
                    description : ("Administer a dose of a chem that you are holding, targeting yourself or a willing character within your reach. If you’re not holding the chem, then you need to draw it first."),
            }
            },
        }
        falloutMajorItems = {
            groupflags : {
                actiontype : "Major"
            },
            Pass : {
                img: "/modules/enhancedcombathud-fallout/icons/fast-forward-button.svg",
                name: game.i18n.localize("Pass"),
                type : "skill",
                system : {
                    description : ("You choose not to do anything."),
                }
            },
            Assist : {
                img: "/modules/enhancedcombathud-fallout/icons/team-idea.svg",
                name: game.i18n.localize("Assist"),
                type : "skill",
                system : {
                    description : ("You assist another character with their next test. When the character you are assisting takes their turn and attempts their task, you provide assistance (p.16). If you have not yet acted this round, you may give up your turn later in the round to assist an ally when they attempt a skill test."),
                }
            },
            Command_NPC : {
                img: "/modules/enhancedcombathud-fallout/icons/convince.svg",
                name: game.i18n.localize("Command"),
                type : "skill",
                system : {
                    description : ("If you have an allied NPC under your command, choose a single major action for them to take. If the action requires a test, then you automatically  assist using your CHA + Speech (if the NPC is a person), CHA + Survival (if the NPC is an animal), or INT + Science (if the NPC is a robot)."),
                }
            },
            Defend : {
                img: "/modules/enhancedcombathud-fallout/icons/shield.svg",
                name: game.i18n.localize("Defend"),
                type : "skill",
                system : {
                    description : ("You focus on protecting yourself. Make an AGI + Athletics test with a difficulty equal to your current Defense. If you succeed, add +1 to your Defense. For 2 AP, add an extra +1 to your Defense."),
                }
            },
            Rally : {
                img: "/modules/enhancedcombathud-fallout/icons/rally-the-troops.svg",
                name: game.i18n.localize("Rally"),
                type : "skill",
                attribute: "end",
                skill: "Survival",
                system : {
                    description : ("You grit your teeth, catch your breath, and prepare yourself. Make an END + Survival test with a difficulty of 0, and save any Action Points you generate. The GM may allow you to use a different ATT +skill for this action depending on how you describe it, such as CHA + Speech to inspire your allies."),
                }
            },
            First_Aid : {
                img: "/modules/enhancedcombathud-fallout/icons/first-aid-kit.svg",
                name: game.i18n.localize("First Aid"),
                type : "skill",
                system : {
                    description : ("- You try to quickly patch the wounds of yourself or an ally. Make an INT + Medicine test, with a difficulty equal to the number of injuries the patient has, and increase the difficulty by 1 if you are trying to perform first aid on yourself. If you succeed, you can either: - Heal HP equal to your Medicine rating (p.34), - Treat one injury the patient is suffering from (p.34), or - Stabilize a dying patient (p.34)"),
                }
            },
            Ready : {
                img: "/modules/enhancedcombathud-fallout/icons/two-shadows.svg",
                name: game.i18n.localize("Ready"),
                type : "skill",
                system : {
                    description : ("Describe a situation you expect to occur, and choose a major action you will perform when it does. If that action occurs before the start of your next turn, you may perform that major action immediately, interrupting other characters’ actions as necessary. If more than one character has readied an action for the same situation, their readied actions occur in initiative order."),
                }
            },
            Test : {
                img: "/modules/enhancedcombathud-fallout/icons/dice-twenty-faces-twenty.svg",
                name: game.i18n.localize("Test"),
                type : "skill",
                system : {
                    description : ("Perform a skill test for an action not covered by the other actions, with the gamemaster’s permission."),
                }
            },
            Sprint : {
                img: "/modules/enhancedcombathud-fallout/icons/run.svg",
                name: game.i18n.localize("Sprint"),
                type : "skill",
                system : {
                    description : ("Movement action. You move up to double your Endurance."),
                }
            },
            First_Aid_Robot : {
                img: "/modules/enhancedcombathud-fallout/icons/first-aid-kit.svg",
                name: game.i18n.localize("First Aid - Repair"),
                type : "skill",
                system : {
                    description : ("Make an INT + Repair test, with a difficulty equal to the number of injuries the patient has, and increase the difficulty by 1 if you are trying to perform first aid on yourself. If you succeed, you can either: - Heal HP equal to your Medicine rating (p.34), - Treat one injury the patient is suffering from (p.34), or - Stabilize a dying patient (p.34)"),
                }
            },
            First_Aid_Living : {
                img: "/modules/enhancedcombathud-fallout/icons/first-aid-kit.svg",
                name: game.i18n.localize("First Aid - Medicine"),
                type : "skill",
                system : {
                    description : ("Make an INT + Medicine test, with a difficulty equal to the number of injuries the patient has, and increase the difficulty by 1 if you are trying to perform first aid on yourself. If you succeed, you can either: - Heal HP equal to your Medicine rating (p.34), - Treat one injury the patient is suffering from (p.34), or - Stabilize a dying patient (p.34)"),
                }
            },
            Command_NPC_human : {
                img: "/modules/enhancedcombathud-fallout/icons/convince.svg",
                name: game.i18n.localize("Command Human"),
                type : "skill",
                system : {
                    description : ("Choose a single major action for the NPC to take. If the action requires a test, then you automatically assist using your CHA + Speech (if the NPC is a person)."),
                }
            },
            Command_NPC_Robot : {
                img: "/modules/enhancedcombathud-fallout/icons/convince.svg",
                name: game.i18n.localize("Command Robot"),
                type : "skill",
                system : {
                    description : ("Choose a single major action for the NPC to take. If the action requires a test, then you automatically assist using your INT + Science (if the NPC is a robot)."),
                }
            },
            Command_NPC_Animal : {
                img: "/modules/enhancedcombathud-fallout/icons/convince.svg",
                name: game.i18n.localize("Command Animal"),
                type : "skill",
                system : {
                    description : ("Choose a single major action for the NPC to take. If the action requires a test, then you automatically assist using your CHA + Survival (if the NPC is an animal)."),
                }
            },
            
        }
        falloutHItems = {
            groupflags : {
                actiontype : "AP"
            },
            Obtain_Info : {
                img : "/modules/enhancedcombathud-fallout/icons/info.svg",
                name: game.i18n.localize("Obtain Information"),
                type : "skill",
                system : {
                    description : ("Ask the gamemaster a single question about the current situation, based on your test. The GM will answer truthfully, but the answer might not be complete."),
                }
            },
            Reduce_Time : {
                img: "/modules/enhancedcombathud-fallout/icons/backward-time.svg",
                name: game.i18n.localize("Reduce Time"),
                type : "skill",
                system : {
                    description : ("AP from a successful test can allow the test to take less time to complete, when time is important. Spending 2 AP halves the amount of time a test takes to attempt."),
            }
            },
            Combat: {
                img: "/modules/enhancedcombathud-fallout/icons/clockwise-rotation.svg",
                name: game.i18n.localize("Combat AP Actions"),
                type : "skill",
                system : {
                    description : ("- Take Additional Minor Action (1 AP): Take 1 additional minor action in your turn. You can only take a total of 2 minor actions in a single round. - Take Additional Major Action (2 AP): Take one additional major action on your turn. Any skill test you must attempt is increased in difficulty by +1. You can only take a total of two major actions in a single round. - Add Extra Damage (1-3 AP): On a successful melee attack or thrown weapon attack you can spend AP to add 1 CD per AP spent, up to a maximum of +3 CD for 3 AP."),
                    }
                 },
            Buy_d20s_1 : {
                    img: "/modules/enhancedcombathud-fallout/icons/coinflip.svg",
                    name: game.i18n.localize("Buy d20"),
                    type : "skill",
                    system : {
                    description : ("Buy bonus d20s for a test, before the dice pool is rolled, but after the GM sets the difficulty. The cost increases for each die purchased: the first d20 costs 1 AP, the second costs 2, and the third costs 3. No more than three bonus d20s may be rolled for a single test, including any d20s from perks or traits."),
                }
            },
            Buy_d20s_2 : {
                img: "/modules/enhancedcombathud-fallout/icons/coinflip.svg",
                name: game.i18n.localize("Buy 2d20s"),
                type : "skill",
                system : {
                description : ("Buy bonus d20s for a test, before the dice pool is rolled, but after the GM sets the difficulty. The cost increases for each die purchased: the first d20 costs 1 AP, the second costs 2, and the third costs 3. No more than three bonus d20s may be rolled for a single test, including any d20s from perks or traits."),
                }
            },
            
            Buy_d20s_3 : {
                img: "/modules/enhancedcombathud-fallout/icons/coinflip.svg",
                name: game.i18n.localize("Buy 3d20s"),
                type : "skill",
                system : {
                description : ("Buy bonus d20s for a test, before the dice pool is rolled, but after the GM sets the difficulty. The cost increases for each die purchased: the first d20 costs 1 AP, the second costs 2, and the third costs 3. No more than three bonus d20s may be rolled for a single test, including any d20s from perks or traits."),
                }
            },
            
        }
        falloutLuckItems = {
                groupflags : {
                    actiontype : "Luck"
                },
                Luck_Draw : {
                    img: "/modules/enhancedcombathud-fallout/icons/info.svg",
                    name: game.i18n.localize("Luck of the Draw"),
                    type : "skill",
                    system : {
                        description : ("You may spend a Luck point to introduce a helpful fact or detail about the situation you’re in, something that you’d have to be lucky to encounter. You could find just the right items or the right kind of ammo while you’re scavenging, find a key to a locked door, or a clue to a computer password. The gamemaster may prompt you with an opportunity to do this, or you may suggest when it could happen, but they can veto your suggestions, or ask you to spend multiple Luck points to make it happen."),
                }
                },
                Stacked_Deck : {
                    img : "/modules/enhancedcombathud-fallout/icons/card-exchange.svg",
                    name: game.i18n.localize("Stacked Deck"),
                    type : "skill",
                    system : {
                        description : ("You may spend 1 point of Luck, before you attempt a skill test, to use LCK instead of the default attribute used for that test to determine your target number. Obviously, this only really has a benefit if your Luck is higher than the attribute it’s replacing."),
                    }
                },
                Lucky_Timing : {
                    img: "/modules/enhancedcombathud-fallout/icons/next-button.svg",
                    name: game.i18n.localize("Lucky Timing"),
                    type : "skill",
                    system : {
                        description : ("In a combat encounter, at the start of any round, or immediately after any other character or creature has acted, you may spend 1 Luck to interrupt the normal initiative order and take your turn for this round immediately. This counts as your normal turn—it simply allows you to act earlier—and you cannot do it if you have already taken a turn this round."),
                }
                },
                Miss_Fortune : {
                    img: "/modules/enhancedcombathud-fallout/icons/backward-time.svg",
                    name: game.i18n.localize("Miss Fortune"),
                    type : "skill",
                    system : {
                        description : ("You may spend one or more Luck points to re-roll dice in a dice pool you roll. You may re-roll one d20, or up to three CD, by spending one Luck point, and you can spend multiple Luck points on a roll. Each die may only be re-rolled once—you cannot re-roll a die that has already been re-rolled. You must accept the re-rolled result, even if it is worse than the original roll."),
                    }
                },
        }
        

        for (let itemset of [falloutMajorItems, falloutMinorItems, falloutHItems, falloutLuckItems]) {
            for (let itemkey of Object.keys(itemset)) {
                if (itemkey != "groupflags") {
                    if (!itemset[itemkey].flags) {
                        itemset[itemkey].flags = {};
                    }
                    
                    itemset[itemkey].flags[ModuleName] = {...itemset.groupflags, ...itemset[itemkey].flags[ModuleName]};
                    
                    let ReplacementItem = game.items.find(item => item.name == ItemReplacementID + itemkey);
                    
                    if (ReplacementItem) {
                        itemset[itemkey].system.description = ReplacementItem.system.description;
                    }
                }
            }
            
            delete itemset.groupflags;
        }
}

export {registerfalloutItems, falloutMajorItems, falloutMinorItems,falloutHItems,falloutLuckItems}