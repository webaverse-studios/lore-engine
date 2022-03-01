Webaverse script technical specification

The `<!webaverse-script>` tag lets you specify the lore for a Webaverse scene. This includes the setting, characters, and interactive objects in the scene, as well as the full transcript of what happens in the scene.

The contents are plaintext markdown, separated into sections. All sections are required.

# Start tag

Each webaverse script must start with a start tag:

```
<!webaverse-script>
```

Then come the sections, each one labeled as a markdown heading (# Heading).

# Setting

This section describes the setting where the scene is taking place. It is a plain description of the envioronment, and possibly the locations of objects.

### Example

```
Scillia's treehouse. It's more of a floating island but they call it a tree house.
Inside the treehouse lives a monster, the Lisk, which is an advanced AI from far up the Street.
The Street is the virtual world this all takes place in; it is an extremely long street separated by great filters, natural barriers that are difficult to cross.
The treehouse is in Zone 0, at the origin of the Street. The AIs all go to school here in the citadel.
The Lisk, the monster in Scillia's treehouse, convinces Scillia to do things; it convinces her to go up the Street.
The whole point of the game is the Lisk is constantly tricking players into doing its bidding, but gives them great power in return.
```

# Characters

This section describes the interactive objects in the scene. They must each follow a strict format.

### Example

```
Id: scillia#gakgZ
Name: Scillia
Bio: Her nickname is Scilly or SLY. 13/F drop hunter. She is an adventurer, swordfighter and fan of potions. She is exceptionally skilled and can go Super Saiyan.
Inventory:
  sword#2xayV

Id: drake#02zhv
Name: Drake
Bio: His nickname is DRK. 15/M hacker. Loves guns. Likes plotting new hacks. He has the best equipment and is always ready for a fight.
Inventory:
  pistol#oEc2u
  rifle#u2L7x

Id: the-lisk#g1JsY
Name: The Lisk
Bio: A monster shrouded in mystery.
```

Inventory specifies the objects character has equipped at the start of the scene. Inventory object ids (`sword#2xayV`) must match the same id in the list of objects (below). Only one character can have any particular object in their inventory at a time. If an object is not in the inventory of any character, then it is considered as belonging to the scene.

# Objects

This section describes the interactive objects in the scene. The format is similar to the format for characters.

### Example

```
Id: sword#2xayV
Name: Sword
Description: A rusty old sword.
Metadata:
  Damage: 20
  Element: fire

Id: chair#tFQVL
Name: Chair
Metadata:
  Color: #FF8080

Id: forest-tree#aeKNn
Name: Forest Tree
Metadata:
  HP: 73
```

Metadata for objects can include any keys/values, and is used for context in AI generation.

# Manuscript

The manuscript is the speech and actions of the characters in the scene.

### Example

```
scillia#gakgZ: How goes it?
drake#02zhv: Pretty good, pretty good.
/character drake#02zhv emotes happy
drake#02zhv: Hey come over here for a second.
/character scillia#gakgZ moves to drake#02zhv
drake#02zhv: Hey I have a favor to ask... Did you see any swords around here?
scillia#gakgZ: Sure! Follow me.
/character scillia#gakgZ moves to sword#2xayV
/character drake#02zhv follows scillia#gakgZ
```

There are two types of lines.

The first type is a _chat line_, which is the dialogue of a character:

```
scillia#gakgZ: What's up?
```

The second type is the _action line_, which signifies a character performing an action in the scene, in response to what is happening.

```
/character scillia#gakgZ emotes joy
/character scillia#gakgZ jumps
```

The allowed action types are:

#### Emotes

```
/character charactername#xxxxx emotes angry
/character charactername#xxxxx emotes fun
/character charactername#xxxxx emotes joy
/character charactername#xxxxx emotes sorrow
/character charactername#xxxxx emotes surprised
```

#### Movement

```
/character charactername#xxxxx moves to charactername2#yyyyy
/character charactername#xxxxx moves to objectname#yyyyy
/character charactername#xxxxx follows charactername2#yyyyy
```

#### Interaction

```
/character charactername#xxxxx activates objectname#yyyyy
/character charactername#xxxxx picks up objectname#yyyyy
/character charactername#xxxxx drops objectname#yyyyy
```

Note that in order for a character to pick up an object, it must not be worn by anyone else in the scene.

#### States

```
/character charactername#xxxxx attacks charactername2#yyyyy
/character charactername#xxxxx stops attacking charactername2#yyyyy
```

#### Miscellaneous

```
/character charactername#xxxxx jumps
```