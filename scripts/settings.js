import {ModuleName} from "./utils.js";

Hooks.once("init", () => {  
    
    game.settings.register(ModuleName, "Luck", {
        name: "Luck",
        hint: "Turn on the Luck stat on the portrait.",
        scope: "client",
        config: true,
        type: Boolean,
        default: false,
        requiresReload: true
      });
    game.settings.register(ModuleName, "AP", {
        name: "AP Counter",
        hint: "Turn on the local action point counter on the portrait.",
        scope: "client",
        config: true,
        type: Boolean,
        default: false,
        requiresReload: true
      });
      game.settings.register(ModuleName, "leftPosition", {
        name: "AP Position (Pixels)",
        hint: "Set the number of pixels for the AP alignment.",
        scope: "client",
        config: true,
        type: Number,
        default: 11,
    });
    game.settings.register(ModuleName, "Movement", {
        name: "Movement Stat",
        hint: "Turn on the movement stat on the portrait.",
        scope: "client",
        config: true,
        type: Boolean,
        default: false,
        requiresReload: true
      });
    game.settings.register(ModuleName, "Injuries", {
      name: "Injuries",
        hint: "Turn on injuries.",
        scope: "world",
        config: true,
        type: Boolean,
        default: true,
        requiresReload: true
    })
    game.settings.register(ModuleName, "Armor", {
      name: "Armor",
        hint: "Turn on armor tracker.",
        scope: "client",
        config: true,
        type: Boolean,
        default: true,
        requiresReload: true
    }) 
    game.settings.register(ModuleName, "Targeting", {
      name: "Targeting",
        hint: "Requires a target to be selected when attacking.(Bugged)",
        scope: "world",
        config: true,
        type: Boolean,
        default: true,
        requiresReload: true
    })         
});
