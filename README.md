# ARGON-Fallout
An implementation of the [Argon - Combat HUD](https://foundryvtt.com/packages/enhancedcombathud) (by [TheRipper93][TheGhostlyCola](https://github.com/TheGhostlyCola)) for the [Fallout](https://github.com/Muttley/foundryvtt-fallout) system. The Argon Combat HUD (CORE) module is required for this module to work.


<sup>All icon included in this project are from [Game-icons.net](game-icons.net), used under the [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/) license</sup>

### The documentation for the core argon features can be found [here](https://api.theripper93.com/modulewiki/enhancedcombathud/free)

This module adjusts various Argon features for the Fallout system:
- **Portrait**
    - Hit points will be displayed in the bottom left
    - Toggleable AP tracker with option to align as you want.
    - Toggleable Luck tracker
    - Toggleable physical and energy resistance for armor
    - Actor speed if using [Unofficial Grid Based Combat](https://drive.google.com/file/d/1cQW-g-_FQTW48tG_UTruYdE_OrAY1UcW/view)
- **Action tracking** Allows for the use of Major and Minor actions in addition to Luck and AP which will reduce the points of Luck and AP respectively.  
- **Skills and Attributes** 
- **Tooltips** will display quantity, ammunition, damage, weapon qualities, damage effects, fire rate, and range where applicable

In addition this module also adds a basic injury system that limits certain actions. All Injuries have chat messages reminding users of an effect.
(Creatures can be buggy with this, no pun intended.)

- "Head" : Adds the "Head Injury" effect, automatically requires AP to take actions that are specified in the Fallout: The Roleplaying Game Core Rulebook

- "Torso" : Adds the "Torso Injury" effect, automatically applying damage to the actor at the end of their turn. 

- "Arms" : Adds the "Arm Injury" effect, currently sends a message of the effect.

- "Legs" : Adds the "Leg Injury" effect, converts the "Move" action to cost a Major action, reminds user that the "Sprint" action is unavailable if attempted.


This module has been produced with the explicit consent of Modiphius Entertainment.

All copyright assets included in the system are used with the explicit consent of Modiphius Entertainment. The module developer holds no claims to these underlying copyrighted assets.

Thanks to Modiphius for allowing the inclusion of action names and descriptions. 

Thanks to Muttley for answering my questions and pointing me in the right direction on certain things.
