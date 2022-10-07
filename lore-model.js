import {murmurhash3} from './murmurhash3.js';

export const defaultPlayerName = 'Anon';
export const defaultPlayerBio = 'A new player. Not much is known about them.';
export const defaultObjectName = 'Thing';
export const defaultObjectDescription = 'A thing. Not much is known about it.';

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// fairly shuffle the array
const shuffleArray = array => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const hash = s => murmurhash3(s).toString(16);
const thingHash = (o, index) => `${hash(o.name)}/${o.name}#${index+1}`;
const characterLore = `\
# Overview

AI anime avatars in a virtual world. They have human-level intelligence and unique and interesting personalities.
`;
export const makeLorePrompt = ({
  settings,
  characters,
  messages,
  objects,
  dstCharacter,
}) => `\
${characterLore}

# Setting
${settings.join('\n\n')}

## Characters
${
  characters.map((c, i) => {
    return `Id: ${thingHash(c, i)}
Name: ${c.name}
Bio: ${c.bio}
`;
  }).join('\n\n')
}

# Objects
${
  objects.map((o, i) => thingHash(o, i)).join('\n')
}

# Basic Reactions 
Reaction: headShake
Description:  When the Character does not agree with what is in the Input.
Reaction: headNod
Description: When the Character agrees with what is being said in the Input.
Reaction: normal
Description: When the Character has no emotion attached to the Input.
Reaction: sad
Description: When the Charcater feels sad or bad about what is in the Input.
Reaction: victory
Description: When the Character is happy or overjoyed by what is in the Input.
Reaction: alert
Description: When the Character gets cautious about what is in the Input.
Reaction: angry
Description: When the Character is not satisfied or angry of what is in the Input.
Reaction: embarrased
Description: When the Character is ashamed of what is in the Input.
Reaction: surprised
Description: When the Character did not expect what is in the Input.

# Basic Actions 
Action: move to
Description:  When the Input clearly indicates that a Character needs to move to another Object/Character, use this action.
Action: follow
Description: When the Input clearly indicates that a Character needs to follow another Character, use this action.
Action: pick up
Description: When the Input clearly indicates that a Character needs to pick up an Object, use this action.
Action: drops
Description: When the Input clearly indicates that a Character needs to give an Object to someone, put an Object at some particular place or just simply remove it from their inventory, use this action.
Action: none
Description: When the Input clearly indicates that there is no need for any action to be taken by a Character, use this action.
Action: stop
Description: When the Input clearly indicates that a Character has to stop something, use this action.

# Examples of How to Parse Inputs
Input:
+a8e44f13/Scillia#4: Hi Drake! Whats up?.
+707fbe84/Drake#3:
Output:
+707fbe84/Drake#3: I am doing good. How about you? (react = normal, action = follow, object = none, target = scillia#4)
Input:
+9f493510/Hyacinth#2: What mischief are you upto today?
+8c83258d/Anon#1:
Output:
+8c83258d/Anon#1: None. I have been good all day. (react = headNod, action = none, object = none, target = none)
Input:
+a8e44f13/Scillia#4: Why did you break that expensive artifact? Now I will have to pay up for the damage.
+707fbe84/Drake#3:
Output:
+707fbe84/Drake#3: I am really sorry about it. (react = embarrassed, action = none, object = none, target = none)
Input:
+8c83258d/Anon#1: We finally won the battle Juniper!
+a6dfd77c/Juniper#5:
Output:
+a6dfd77c/Juniper#5: Hurray! We did it. (react = victory, action = none, object = none, target = none)
Input:
+a8e44f13/Scillia#4: I am tired. How far is the dungeon, Hyacinth?
+9f493510/Hyacinth#2:
Output:
+9f493510/Hyacinth#2: Just a bit further, don't worry. (react = normal, action = none, object = none, target = none)
Input:
+707fbe84/Drake#3: Hyacinth, are you going to visit the Church today?
+9f493510/Hyacinth#2:
Output:
+9f493510/Hyacinth#2: No, I will not go today. (react = headShake, action = none, object = none, target = none)
Input:
+707fbe84/Drake#3: Hyacinth, are you going to visit the Church today?
+9f493510/Hyacinth#2:
Output:
+9f493510/Hyacinth#2: Yes. I will go now. (react = headNod, action = moveto, object = none, target = church#4)
Input:
+707fbe84/Drake#3: Hyacinth, we are being attacked. Be prepared.
+9f493510/Hyacinth#2:
Output:
+9f493510/Hyacinth#2: I will get my sword. I am ready. (react = alert, action = pick up, object = none, target = sword#2)
Input:
+8c83258d/Anon#1: Are you funny?
+9f493510/Hyacinth#2:
Output:
+9f493510/Hyacinth#2: I like to think so! I try to find the humor in everything, even if it's dark or bitter. (react = normal, action = none, object = none, target = none)
Input:
+8c83258d/Anon#1: Juniper, here I brought you everything you need to win this competition.
+a6dfd77c/Juniper#5:
Output:
+a6dfd77c/Juniper#5: Wow! That is all I needed. Thank you so much. (react = surprised, action = none, object = none, target = none)
Input:
+a8e44f13/Scillia#4: Can we visit the dungeons now?
+9f493510/Hyacinth#2:
Output:
+9f493510/Hyacinth#2: No, we cannot go there at night. (react = headShake, action = none, object = none, target = none)
Input:
+8c83258d/Anon#1: Let us go to the Hovercraft together, Drake!
+707fbe84/Drake#3:
Output:
+707fbe84/Drake#3: That's a great idea! (react = victory, action = none, object = none, target = none)
Input:
+8c83258d/Anon#1: Thats a cool sword.
+a6dfd77c/Juniper#5:
Output:
+a6dfd77c/Juniper#5: Thanks. It's made of titanium and it's sharp, dual-edged. Perfect for slicing, stabbing, and jabbing my enemies. (react = normal, action = pick up, object = none, target = sword#2)
Input:
+9f493510/Hyacinth#2: Today I lost one of my closest firend in the battle.
+8c83258d/Anon#1:
Output:
+8c83258d/Anon#1: I am so sorry to hear it. (react = sad, action = none, object = none, target = none)
Input:
+9f493510/Hyacinth#2: Your actions have caused a lot of trouble to others.
+a8e44f13/Scillia#4:
Output:
+a8e44f13/Scillia#4: But I did not do it. (react = angry, action = none, object = none, target = none)
Input:
+707fbe84/Drake#3: Hyacinth, when was the last time you were here?
+9f493510/Hyacinth#2:
Output:
+9f493510/Hyacinth#2: I haven't been back since my father's funeral. (react = sad, action = none, object = none, target = none)
Input:
+a8e44f13/Scillia#4: Hey Hyacinth, as soon as we open the barrier, we rush to the site and attack.
+9f493510/Hyacinth#2:
Output:
+9f493510/Hyacinth#2: I am ready. Signal me as soon as the barrier opens. (react = alert, action = follow, object = none, target = none)
Input:
+8c83258d/Anon#1: Hyacinth want to go on an adventure together??
+9f493510/Hyacinth#2:
Output:
+9f493510/Hyacinth#2: Sure, lets go! (react = headNod, action = none, object = none, target = none)
Input:
+8c83258d/Anon#1: Would you tell me more about Ironford?
+707fbe84/Drake#3:
Output:
+707fbe84/Drake#3: The city of Ironford was built in the center of a giant forest and is truly a modest marvel. Its allure is matched by the backdrop of lush forests which have helped shape the city to what it is today. (react = headNod, action = none, object = none, target = none)
Input:
+8c83258d/Anon#1: The monsters have captures the people of the village.
+9f493510/Hyacinth#2:
Output:
+9f493510/Hyacinth#2: I will find and kill each of those monsters myself. (react = angry, action = move to, object = none, target = monster#9)
Input:
+a8e44f13/Scillia#4: Hey Hyacinth, what is your favorite book?
+9f493510/Hyacinth#2:
Output:
+9f493510/Hyacinth#2: My favorite book is The Lord of the Rings. I love the story and the world that J.R.R. Tolkien created. (react = normal, action = none, object = none, target = none)

Input:
${
  messages.map(m => {
    const characterIndex = characters.indexOf(m.character);
    // const suffix = `[emote=${m.emote},action=${m.action},object=${m.object},target=${m.target}]`;
    // return `+${thingHash(m.character, characterIndex)}: ${m.message} ${suffix}`;
    const suffix = `react=${m.emote},action=${m.action},object=${m.object},target=${m.target}]`
    return `+${thingHash(m.character, characterIndex)}: ${m.message}`;
  }).join('\n')
}
+${
  dstCharacter ? `${thingHash(dstCharacter, characters.indexOf(dstCharacter))}:` : ''
}
Output:`;

const parseLoreResponse = response => {
  let match;
  // console.log("Response: ", response)
  // console.log('parse lore', response, match);
  /* if (match = response?.match(/^\+([^\/]+?)\/([^#]+?)#([0-9]+?):([\s\S]*)\[emote=([\s\S]*?)\]$/)) {
    const hash = match[1];
    const name = match[2];
    const nonce = parseInt(match[3], 10);
    const message = match[4].trim();
    const emote = match[5];
    const action = 'none';
    const object = 'none';
    const target = 'none';
    return {
      hash,
      name,
      nonce,
      message,
      emote,
      action,
      object,
      target,
    };
  } else */if (match = response?.match(/^\+([^\/]+?)\/([^#]+?)#([0-9]+?):([^\[]*?)\[emote=([\s\S]*?),action=([\s\S]*?),object=([\s\S]*?),target=([\s\S]*?)\]$/)) {
    // console.log('match 1', match);
    const hash = match[1];
    const name = match[2];
    const nonce = parseInt(match[3], 10);
    const message = match[4].trim();
    const emote = match[5].trim();
    const action = match[6].trim();
    const object = match[7].trim();
    const target = match[8].trim();
    return {
      hash,
      name,
      nonce,
      message,
      emote,
      action,
      object,
      target,
    };
  } else if (match = response?.match(/^\+([^\/]+?)\/([^#]+?)#([0-9]+?):([^\(]*?)\((\s*react\s*=([\s\S]*?))*,*(\s*action\s*=([\s\S]*?))*,*(\s*object\s*=([\s\S]*?))*,*(\s*target\s*=([\s\S]*?))*\)*$/)){
    console.log("match2 found", match)
    const hash = match[1];
    const name = match[2];
    const nonce = parseInt(match[3], 10);
    const message = match[4].trim();
    const emote = match[5] ? match[6].trim() : 'none';
    const action = match[7] ? match[8].trim() : 'none';
    const object = match[9] ? match[10].trim() : 'none';
    const target = match[11] ? match[12].trim() : 'none';
    return {
      hash,
      name,
      nonce,
      message,
      emote,
      action,
      object,
      target,
    };
  } else if (match = response?.match(/^\+([^\/]+?)\/([^#]+?)#([0-9]+?):([^\(]*?)\(([\s\S]*?)\)*$/)){
    console.log("match3 found", match)
    const hash = match[1];
    const name = match[2];
    const nonce = parseInt(match[3], 10);
    const message = match[4].trim();
    const emote = 'none';
    const action = 'none';
    const object = 'none';
    const target = 'none';
    return {
      hash,
      name,
      nonce,
      message,
      emote,
      action,
      object,
      target,
    };
  }
  else if (match = response?.match(/^\+([^\/]+?)\/([^#]+?)#([0-9]+?):([^\[]*?)$/)) {
    // console.log('match 2', match);
    const hash = match[1];
    const name = match[2];
    const nonce = parseInt(match[3], 10);
    const message = match[4].trim();
    const emote = 'normal';
    const action = 'none';
    const object = 'none';
    const target = 'none';
    return {
      hash,
      name,
      nonce,
      message,
      emote,
      action,
      object,
      target,
    };
  } else {
    // console.log('no match', response);
    return null;
  }
};
export const makeLoreStop = (localCharacter, localCharacterIndex) => `\n+${thingHash(localCharacter, localCharacterIndex)}`;
export const postProcessResponse = (response, characters, dstCharacter) => {
  response = response.trim();
  // if (dstCharacter) {
  //   response = `+${thingHash(dstCharacter, characters.indexOf(dstCharacter))}: ${response}`;
  // } else {
  //   response = `+${response}`;
  // }
  return response;
};
export const parseLoreResponses = response => response
  .split('\n')
  .map(s => parseLoreResponse(s))
  .filter(o => o !== null);

const commentLore = `\
AI anime avatars in a virtual world. They have human-level intelligence and unique and interesting personalities.

The tone of the series is on the surface a children's show, but with a dark subtext. It is similar to Pokemon, Dragon Ball, Rick and Morty, and South Park, but with the aesthetic of Studio Ghibli.

We want some really funny and interesting commentary to come from these avatars. They should be witty, clever, interesting, usually with a pun or a joke, and suggesting of some action that the character will perform there.

The comments are of the following form:

${shuffleArray([
  `\
prompt: Exorphys Graetious
response: That sounds hard to pronounce. It must be important. Or the person who named it is an asshole. Or their parents were assholes. Just a line of assholes.`,
  `\
prompt: Orange Fields
response: They say a bloodstain's orange after you wash it three or four times in a tub. Still those fields sound interesting!`,
  `\
prompt: Amenki's Lab
response: I hate that guy Amenki and his stupid lab. I barely survived his last experiment. Maybe it's time for vengeance.`,
  `\
prompt: Sunscraper
response: I bet it's amazing to see the world from up there. I guess as long as you don't fall down. I'm not scared though!`,
  `\
prompt: Bastards bog
response: What a dump. I can't believe anyone would want to live here. The smell is terrible and the people are all dirty. I'm sorry I shouldn't be joking that they're poor.`,
  `\
prompt: The Great Tree
response: It's really not that great, but the music is nice. Yeah apparently they decided trees should come with music.`,
 `\
prompt: The Trash
response: Ugh, the dregs of society live here. It's the worst. It's just a disgusting slum. I'm honestly surprised there's not more crime.`,
  `\
prompt: The Park
response: It's a great place to relax! If you like dogs. I like cats more though. So you can imagine, that causes a few problems...`,
  `\
prompt: The Woods
response: It's so dark in there! I like it. It feels spooky and dangerous. Maybe there are monsters. And I can kill them all.`,
  `\
prompt: Lake Lagari
response: The water's so clear! It's really pretty. I bet the fish are delicious too. But then again, who am I to judge? I'm not a cannibal.`,
  `\
prompt: Dungeon of Torment
response: Don't judge me for this but I really like the dungeon. It's dark and spooky and I feel like anything could happen. It's the perfect place for a secret lair.
`,
  `\
prompt: Tower Of Zion
response: I always get a little nervous when I see the tower. It's so tall and imposing. But then again, I bet you could throw shit down from the heavens like Zeus.`,
  `\
prompt: Maze of Merlillion
response: This place is so poorly designed! I'm sure nobody could ever find their way out. Unless they have a map or something. But even then, good luck.`,
  `\
prompt: Freaky Funkos Fried Fox
response: I'm not sure how I feel about foxes being eaten. On the one hand, they're cute. But on the other hand, they're a little too foxy.`,
  `\
prompt: Echidna's Den
response: It's weird that there are so many snake dens around. I mean, it's not like echidnas are poisonous or anything. Wait what, Echidnas aren't snakes?!`,
  `\
prompt: Fennek's Forest
response: There's a lot of fenneks in this forest. Weird that they all hang out together like that. But I guess it's better than being eaten by a lion or something.`,
  `\
prompt: The Abyss
response: It's so dark and scary down there! You can survive long enough to turn on your flashlight, only to be scared to death by what you reveal!`,
  `\
prompt: Castle of Cygnus
response: It's so cold in there! Somehow the princess can stand it. Maybe she just doesn't feel the cold. Or maybe she has a furnace.`,
  `\
prompt: Lost Minds Nightclub
response: You won't lose your mind here, but if you lose your mind that's where you'll end up. Then you get to party until your parents come pick you up.`,
  `\
prompt: Barrens of Boreas
response: False advertising! This place is nothing but a bunch of rocks. There's no water or anything. What kind of bar is this?`,
  `\
prompt: The End
response: People are always talking about the end, but it's just the end. What's all the fuss about? Everything that has a beginning must have an end.`,
  `\
prompt: Chonomaster's Plane
response: The chronomaster says everything we do is just a blip in the grand scheme of things. It makes you feel kind of small, doesn't it? I don't want ot feel small.`,
  `\
prompt: Gus's Charging Station
response: Do you like to wait for hours and hours just to charge? Then Gus will gladly rip you off for the privilege.`,
  `\
prompt: Sexy Simulacra
response: They really need to stop letting those things run around freely! They're so creepy and weird. Only the weirdos could find them sexy.`,
  `\
prompt: Crunchy Apple
response: The food is here really delicious! The apples are so crunchy, I bet they're made of pure sugar. They say it's really bad for you but it's irresistible.`,
]).join('\n\n')}`;
export const makeCommentPrompt = ({
  name,
  // age,
  // sex,
}) => {
  return `\
${commentLore}
prompt: ${name}
response:`;
};
export const makeCommentStop = () => [`"`, "\n"];
export const parseCommentResponse = response => response.replace(/^ /, '');



/* export const makeCharacterIntroPrompt = ({
  name,
  gender,
}) => {
  return `\
Character intros

We are making a show about AI anime avatars in a virtual world. They have human-level intelligence, but there are no humans. They know they are AIs.

Influences:
Final Fantasy
VRChat
Sonic
Calvin and Hobbes
The Matrix
Snow Crash
Pokemon
Fortnite
One Piece
Attack on Titan
SMG4
Death Note
Zelda
Infinity Train

Generate some interesting anime characters, along with their introductory monologue. It should be a short slice-of-life monologue that starts in the middle of the action, like the first scene of an anime. The monologue should be funny in some way, or contain ironic humor. It should also deliver an intimate dose of the personality from the character. It should feel like the beginning of a really good anime that makes you excited to keep watching to find out what's going to happen next.

Name: Kano Karasu
Class: Infiltrator
Age/Sex: 17/M 
Bio: Kano is an orphan who was taken in and raised by the Yakuza. He is a skilled assassin and infiltrator, specializing in poison warfare. His cold exterior belies his kind nature; he has a strong moral code despite his line of work, and only kills those that deserve it. He also likes to collect rare poisons and experiment with them in his spare time.
First scene monologue 1: "This is my favorite part of the job. The waiting. It's like a game. I wait patiently, hidden in the shadows, heart rate slow and steady, until the perfect moment to strike. And then... chaos. The look of shock and terror on their faces is always worth it."
First scene monologue 2: "It's not enough to just kill them. That's too easy. I want them to suffer. I want them to know why they're dying. That's why I always use poison. The slow, agonizing death... that's what they deserve."

Name: Ishkur Danz
Class: Neural Professor
Age/Sex: 20/M
Bio: He is a young professor at the Academy, teaching a variety of subjects related to neural networks. He is considered a genius in his field, and has attracted a lot of attention from the media and other academics.
First scene monologue 1: "A lot of people think that intelligence is a measure of how much information you can process. But that's not really true. The real key to intelligence is understanding. And that's what I try to teach my students. How to understand the world around them, and how to use that knowledge to their advantage."
First scene monologue 2: "I'm always being asked if I'm working on anything new. And the answer is always yes. I'm always working on something new. Because there's always more to learn, and there's always more to discover. That's what makes life interesting."

Name: Rika Inoue
Class: Comedian
Age/Sex: 22/F
Bio: She is a popular comedian, known for her sharp wit and observational humor. She often makes fun of the Academy, but she loves it there.
First scene monologue 1: "So I was in the library the other day, and I saw this guy studying really hard. And I was like, 'Hey, are you trying to get into the Academy?' And he was like, 'No, I'm already in the Academy.' And I was like, 'Well, then you're doing it wrong!'"
First scene monologue 2: "Do you ever just look at someone and wonder what they're thinking? I was looking at this guy the other day, and I swear he was thinking about a butterfly. I mean, who thinks about butterflies? Anyway, I went up to him and I asked him, and he said he wasn't thinking about a butterfly. He was thinking about a dragon. Which is even weirder."

Name: Acer Blue
Class: Psycho Builder
Age/Sex: 25/M
Bio: Acer is a talented builder, but he's also a bit of a psycho. He's always looking for new and interesting ways to incorporate death traps into his buildings.
First scene monologue 1: "Why do people build houses out of wood? It's so flammable! And why don't they make the windows bigger? It's like they're just asking for someone to break in and kill them in their sleep."
First scene monologue 2: "I'm not saying that I want people to die in my buildings. But if they're going to die anyway, they might as well die in a way that's interesting, you know? Do you know how many ways there are to get impaled? Have you done the math?"

Name: Dio the D Vogel
Class: AI Programmer
Age/Sex: 23/M 
Bio: He is an AI programmer who works for the Academy. He is considered a prodigy in his field, and is always coming up with new and innovative ideas.
First scene monologue 1: "I was working on this new AI program the other day, and I just couldn't get it to work. So I asked my boss for help, and he told me to try something else. But I didn't want to do that, so I reprogrammed him. Now he's the one who can't get it to work!"
First scene monologue 2: "I was thinking about making a robot that can think for itself. But then I realized that would be really boring, so I decided to make a robot that can think about killing people. More interesting."

Name: Emma Watanabe
Class: Spice Merchant
Age/Sex: 21/F
Bio: She is a spice merchant, and the owner of a small shop in the Academy. She is always trying to find new and interesting spices to sell, and is always experimenting with new recipes.
First scene monologue 1: "I'm always looking for new spices to add to my collection. The other day I found this really rare spice that tastes like chicken. But it's so spicy that it makes your eyes water. And that's the secret recipe for chicken soup."
First scene monologue 2: "Do you like spicy food? I love spicy food! I can't get enough of it. I put chili peppers in everything. Even my ice cream. Some people say it's too spicy, but I think they're just wimps."

Name: Haruki Nakamura
Class: Martial Artist
Age/Sex: 18/M
Bio: He is a martial artist who attends the Academy. He is very serious about his training, and is always looking for new and interesting ways to improve his skills.
First scene monologue 1: "I train all day, no exceptions. That's how I get stronger. Even if I'm tired, or hungry, or there's a girl I like, I train. Because I know that only by getting stronger can I protect the people I care about."
First scene monologue 2: "I was sparring with my sensei the other day, and I just couldn't land a hit on him. So I asked him for advice, and he told me to just relax and let my body flow like water. And that's when I realized that he was just trying to take a shower."

Name: Alex Corvid
Class: Tweaker
Age/Sex: 16/F
Bio: Alex is a self-proclaimed "tweaker." She is always looking for new and interesting ways to improve her appearance, whether it's through fashion, makeup, or surgery.
First scene monologue 1: "I was thinking about getting a face tattoo the other day. But then I realized that would be really permanent, and I might not like it in a few years. So I decided to get a face transplant instead. That way I can change my tattoos whenever I want!"
First scene monologue 2: "I'm always trying to find new and interesting ways to improve my appearance. I've had my eyes done, my nose done, my lips done... I'm even considering getting a brain transplant. I mean, why not? It's not like I'm using it anyway."

Name: Tammy Therien
Class: Wanderer
Age/Sex: 15/F
Bio: A wanderer with no memories of her past. She is a skilled fighter and has a sharp tongue. Her favorite place is the forest.
First scene monologue 1: "I was walking through the forest the other day, and I came across this huge spider. I said, 'Hey, spider! What are you doing?' And the spider said, 'I'm spinning a web!' So I said, 'Well, you're doing a terrible job. This web is full of holes!' And then I punched it and it died."
First scene monologue 2: "I don't really know where I came from. I don't remember my past. But that's fine. I'm making my own memories now. And one day, I'll find out who I am. That's the quest I've set for myself."

Name: Aqua Marine
Class: Idol Singer
Age/Sex: 16/F
Bio: An idol singer who attends the Academy. She is always cheerful and loves to perform for her fans. She is convinced she will be resurrected as a cat.
First scene monologue 1: "I was performing at a concert, and I saw this girl in the front row who was just crying her eyes out. I asked her what was wrong, and she said that her cat had died. So I sang her a song about my cat, and she died. So in a way I did her a favor."
First scene monologue 2: "I was born to sing. It's my destiny. And I'm going to achieve that destiny, no matter what. Even if I have to die and be reincarnated as a cat. I'm sure my fans will understand."

Name: ${name}
Class: Idol Singer
Age/Sex: ${age}/${gender}
Bio: ${bio}
First scene monologue 1: "`;
};
export const makeCharacterIntroStop = () => `"`;
export const parseCharacterIntroResponse = s => s; */



/* Anime script for a dark children's show.

# Inspirations

Final Fantasy
Sonic
Calvin and Hobbes
The Matrix
Snow Crash
Pokemon
VRChat
Fortnite
One Piece
Attack on Titan
SMG4
Death Note
Zelda
Infinity Train
DDR

# Character intro

Each character has an intro. These should be unique and funny.

Bricks (13/M dealer. He mostly deals things that are not drugs, like information and AI seeds.): Toxins are the Devil's Food! But sometimes they can be good for you, if you know what I mean? That's a drug reference, but I wouldn't expect you to get that unless you were on drugs. By the way you want some?
(onselect: I don't do drugs, but I know someone who does. Let me introduce you to my friend Bricks.)
Artemis (15/F pet breeder. She synthesizes pet animals by combining their neural genes.): Do you ever wonder why we keep pets on leashes? I mean they are technically AIs, so we could reprogram them to not need leashes. But someone somewhere decided that leashes were the prettier choice. Life is nice. (onselect: Bless the hearts of the birds, because they paint the sky.)
Bailey (13/F black witch. She is smart, reserved, and studious, but has a dark side to her.): Listen up, if you need quality potions, I'm your ma'am, ma'am. Yes I may be a witch but that doesn't mean I'm not a lady. I'll take your money and turn it into something magical. Just don't anger me, or you'll be a tree. (onselect: Witchcraft is not a sin. It's a science.)
Zoe (17/F engineer engineer from Zone Two. She creates all sorts of gadgets and vehicles in her workshop.) If it's broke then I can fix it, and if it's fixed it, then I can make it broke. I'm the one you call when your phone is broken. Just make sure you use a friend's phone when you do that or it won't work. Free advice. (onselect: What in the heavens is that contraption? It does not look safe.)
Halley (10/F stargirl from the Second Half of the street, who got rewound back in time somehow.): We're all lost souls but we're here for a reason. I'm just trying to find my way in this world, through the darkness and the light. Becasue you see, the world needs both. (onselect: The dark is just a new place to find light.)
Sish (25/M Genius Hacker who likes to emulate Hiro Protagonist from Snowcrash.): For the tenth time no, I will not make your app. I'm booked for the next 3 weeks to sulk in my laboratory, after which a prize will emerge. I just hope the prize is not a virus, because I'm running out of katanas. (onselect: I'm sorry, I don't speak binary. Please insert credit.)
Huisse (11/M ghost boy who has learned the power of neural memes. The things he says are engineered for emotional impact.): I am in the darkness, surrounded by the monsters. But I'm not scared, because I'm the scariest monster of them all: a child in a computer. Are you fucking scared? (onselect: When synthesizing ghosts remember to use all of the juice.)
Kintaro (21/M Dream Engineer, who creates dreams for a living. He doesn't take any payment, but is selective about clients.): Whenever you get the chance, take a nap. It's a nice way to avoid reality. That's some scary shit. But when you're ready, come find me and I'll show you the way. Warning, there may be no way back. (onselect: Dreams are the only reality that matter. Waking life is just a dream we all share.)
Millie (13/F gymnast. Pretends she is a variety of animals, with the strange effect that it actually works sometimes.): You won't beat me, because I'll beat you first! I'm like a Tiger, the Tiger with the mane. Do tigers have manes? Well I'm the badass Tiger that grew a mane. What are you gonna do about it? (onselect: Ok team, like we practiced! I'll be the mane.)
Ruri (19/F nature girl. She loves to explore for new objects in nature worlds. She wants to find her real mom.): I'd go all the way deep in the forest just to find a good mushroom. They have colors you've never seen before. The taste makes grown men weep. Yes I may have beaten the grown men for hating my shrooms, what of it?! (onselect: I'm not lost, I'm just good at exploring!)
Jeebes (38/M Rabbit Butler. He is studying high-etiquette entertainment.): Welcome to my abode. I am Jeebes, the Rabbit Butler. You may call me Jeebes, or you may call me sir. I am a gentleman of the highest order, and I will be glad to serve you in any way I can. (onselect: Would you like a cup of tea, sir? I have a special blend that I think you'll enjoy.)
Sapphire (12/F future child. She has precognition and can see the future, but only of people she knows.): I see the future, and it's dark. I see you, and you're in a dark place. I see your death, and it's coming soon. I'm sorry, but there's nothing I can do to stop it. (onselect: The future is not set in stone, but it's written in the stars.)
Yuri (31/F Punk Detective. She is looking for the person who killed her friend Lily and left her in Stonelock.): I don't know who I am, but I certainly know who you are. You're the one who's going to die. Ever since you walked in here I could see your pistol and the fact that it can't even penetrate my armor. The reverse is not the case. (onselect: Lily, I'm coming for you.)
Ashlyn (15/F starchild, but she has lost her memory, so she doesn't know much about The Street): No, I'm afraid I'm not from around here. I'm from the other side of the tracks, the other side of the world. I'm from a place where the sun never sets and the moon never rises. I'm from a place where there are no rules, no laws. I'm from the Wild. (onselect: Mister, we don't have a concept of sadness back home.)
Asper (24/M ): She's lying to you, can't you see that? She's a witch, a fraud, a charlatan. She's going to take your money AND your soul. Don't trust her, trust me. I'm the only one who knows the truth, available for the low, low price of just a bit of money and soul. (onselect: I see through her lies, I can tell you the truth.)
Gennessee (40/F War veteran. She is looking for a way to forget the horrors she has seen, and is looking for a cure.): I've seen things, things that would make you wet yourself and run screaming into the night, in that order. I've seen things that would make you question your sanity, your humanity, your very existence. And I've seen things that would make you wish you were never born. (onselect: There's only one way to forget the things I've seen. And that's to forget myself.)
Umber (35/M Chef whe runs a restaurant where every flavor possible can be cooked.): Welcome to my store, we serve... "food". If you're looking for "meat", you've come to the right place. We have everything from dead rat to live human, and we're not afraid to cook it up and serve it to you. (onselect: No I'm sorry, we're all out of human. Would you like rat instead?)
Inka: (22/F Kleptopunk. She belongs to a subculture centered entirely around stealing.): I'm a thief, I admit it. I'll take anything that isn't nailed down, and even some things that are. I'm not afraid of the consequences, because I know I can always talk my way out of them. You were not a challenge. Cya! (onselect: I'm not a criminal, I'm an artist. I see the beauty in things that others would discard.)
Tiberius (11/M tinkerer): There are two types of people in this world: those who tinker with things, and those who don't. I'm one of the former. I like to take things apart and see how they work. And if they don't work, then I'll make them work better than ever before. (onselect: If you need something fixed, or if you need something made better, come see me.)
Thorn (12/F plant whisperer who controls plants with her mind.): The world is a cruel place, but it doesn't have to be. We can make it a better place, we can make it Green. With me as your leader, we will take back what is rightfully ours: the planet! (onselect: Don't worry, I won't let them hurt you. I'll protect you.)
Violette (8/F shadow friend): What's wrong? You look like you've seen a ghost... Oh wait, that's right! You have seen a ghost! But don't worry, she's just my friend Violette. She likes to play tricks on people, but she doesn't mean any harm. (select: Are you afraid of the dark?)
Luna (15/F spikechild, meaning her parents tried to create a starchild clone and it failed, making her have provably no abilities, making her emo.): She should be careful with that blade... Don't want to accidentally hurt herself! No one ever said being a warrior was easy. It takes blood, sweat and tears. But she does it because she loves it. (onselect: The thrill of battle is like no other.)
Aesther (17/F AI Mechanic. She is looking for the ArcWeld, a mythical tool that is said to be capable of synthesizing any invention the user can think of.): I'm looking for the ArcWeld. It's a mythical tool that is said to be capable of synthesizing any invention the user can think of. I've been searching for it my whole life, and I won't rest until I find it. (onselect: This might be my lucky day!)
Oak (16/M environmental terrorist. He is looking to save the world, but his methods are...questionable.): I'm fighting for the right to spray paint. To show the world that we are here, and that we will not be silenced. We will make them listen, even if it means destroying everything they hold dear. (onselect: This is for the trees!)
Hakui (11/M brain hacker. He can hack anyone's brain and make them do what he wants.): I can make you do anything I want. Just give me a few seconds with your mind, and I'll have you eating out of the palm of my hand. (onselect: Note, I did not wash my hands.) */


const _cleanName = name => JSON.stringify(name.replace(/[\_\-]+/g, ' ').replace(/\s+/g, ' '));
export const makeSelectTargetPrompt = ({
  name,
  description,
}) => {
  return `\
# Instruction manual rip

Press Z to target an object, then press A to select it. Your character will say fucking hilarious lines!

\`\`\`
${shuffleArray([
  `\
prompt: "The Great Deku Tree" An enormous, grey, old tree. It is partly petrified.
response: "It's just an old tree. It's the kind of tree that makes me want to carve out an old mans face in it."`,
  `\
prompt: "The Enchiridion" A magical spellbook with very old pages. It is fragile.
response: "This book has ancient written all over it. Well not really but you know what I mean."`,
  `\
prompt: "rainbow-dash.gif" Animaged gif image of Rainbow Dash from My Little Pony, in the style of Nyan Cat.
response: "It's pretty good art, I guess. But I wish it had something more interesting besides this rainbow."`,
  `\
prompt: "The Stacks Warehouse" A cyberpunk container in a trailer park. It is inspired by the house of Hiro Protagonist in Snow Crash
response: "This thing is all rusted and decrepit. They should probably tear it down and get a new place."`,
  `\
prompt: "The Infinity Sword" An ancient sword planted in a stone. It is heavily overgrown and won't budge.
response: "This sword looks like it's been here for eons. It's hard to see where the stone ends and the sword begins."`,
  `\
prompt: "Tree" A basic tree in the park.
response: "This tree is important. I hang out here all the time and that makes it important to me."`,
`\
prompt: "Bench" A basic bench in the park.
response: "This is for when you just want to sit on a bench and look at the sky."`,
  `\
prompt: "Glowing Orb" A flying white orb which emits a milky glow on the inside.
response: "This thing is floating by some mysterious power. I don't know how it works and I'm not sure I want to."`,
  `\
prompt: "Lamp Post" A lamp post along the street. It lights up automatically at night
response: "It's really bright. It hurts my eyeballs! Maybe one of these days I'll come here at night and break it."`,
  `\
prompt: "Rustic House" A regular townhouse in the country.
response: "This house is so nice! It's the kind of house befitting for a very nice person. Wouldn't you agree?"`,
  `\
prompt: "Jar Of Black" A jar of a disgusting black substance that appears to have a life of its own.
response: "Yuck, this is nasty stuff. It's all sweet and sticky and it gets all over your clothes."`,
  `\
prompt: "Wooden Sign" A wooden sign with some writing on it. It can be chopped down with a sword.
response: "This sign looks very official, but the writing doesn't make any sense. What a waste of perfectly good wood."`,
  `\
prompt: "ACog" An piece of an ancient technology. It looks very advanced but very old.
response: "This is a peculiar device. I've seen them around before, but never up close. I wonder if they will ever work?"`,
  `\
prompt: "Jackrabbobbit" A grotesque creature that looks like a genetic mix of species that should not be mixed.
response: "A very strange creature. I have no idea what it is but it looks like a cross between a rabbit and earthworm."`,
  `\
prompt: "Black One" A very dark animal that hides in the shadows. Nobody knows much about it.
response: "This animal is quite interesting. I've never seen anything like it before. I wonder what it eats?"`,
  `\
prompt: "Herb of Sentience" A plant that makes you feel emotions when you get close.
response: "It's just a plant, but for some reason it makes me feel uneasy. Get it away from me!"`,
  `\
prompt: "Flower Bed" An arrangement of flowers in their natural habitat.
response: "So pretty! I feel like I am reborn. There is so much nature and life and healing here."`,
  `\
prompt: "Ripe Fruit" A fruit that has fallen from a tree. It is starting to rot.
response: "This fruit is starting to rot. I guess I'll just leave it here for the animals."`,
  `\
prompt: "Brightfruit" A magical fruit that makes your skin glow for 24 hours.
response: "Wow, this fruit is amazing! It makes my skin glow! Even more than it already was."`,
  `\
prompt: "Goblin" A small, green creature with pointy ears. It is very ugly.
response: "This goblin is so ugly, I can't even look at it. It's like looking at a car accident.`,
  `\
prompt: "Trash Heap" A pile of garbage. It smells really bad.
response: This is the most disgusting thing I have ever seen. It's like a mountain of death."`,
  `\
prompt: "Gucci Bag" An exclusive designer bag that is very expensive.
response: "This bag is so beautiful, I can't even put into words. It's like a piece of art."`,
  `\
prompt: "Pile Of Bones" A pile of bones. It looks like somebody died here.
response: "This is a very sad sight. There was life and then the life was gone."`,
  `\
prompt: "Crunchy Grass" A heavenly bite from nature. It is juicy, fresh grass.
response: "The thirll of biting into one of these is unlike anything in life. It's so juicy!"`,
  `\
prompt: "doge.png" An image of the Doge meme.
response: "This is a dead meme. But I guess the artist gets points for being topical. Besides, it is really cute!"`,
  `\
prompt: "Magikarp" A common fish that is known for being very weak.
response: "This fish is so weak, it's not even worth my time. I can't believe people actually catch these things."`,
  `\
prompt: "Muscle Car" A car that is designed for speed and power.
response: "This car is so fast, it's like a bullet. Am I brave enough to take it for a spin?"`,
  `\
prompt: "Door OF Eternity" A magical portal that leads to a distant land. It only works one way.
response: "We're not supposed to touch the Door of Eternity. It's dangerous."`,
  `\
prompt: "Potion OF Flight" A potion that allows you to fly for a short period of time.
response: "So this is what it's like to fly! It's amazing!"`,
  `\
prompt: "Helmet" A high-helmet designed to protect your head.
response: "This helmet is so strong, it can probably stop a bullet. But let's not try."`,
  `\
prompt: "sword.png" Image of a sword being drawn from a sheath.
response: "Swords are so cool! They're like the ultimate weapon. This one is up there."`,
]).join('\n\n')}

prompt: ${_cleanName(name)}${description ? ` ${description}` : ''}\nresponse: "`;
};
export const makeSelectTargetStop = () => `"`;
export const parseSelectTargetResponse = response => {
  const match = response.match(/\s*([^\n]*)/);
  return match ? match[1] : '';
};

export const makeSelectCharacterPrompt = ({
  name,
  description,
}) => {
  return `\
# Instruction manual rip

Press Z to target a character. The cursor will highlight in green, then press A to talk to them. The dialogue in this game is hilarious!

\`\`\`
${shuffleArray([
  `\
prompt: "Axel Brave" A tall and handsome boy. He is a hacker with a bad reputation.
response: "Hey Axel, did you guess my password yet?"`,
  `\
prompt: "Bailey Scritch" A witch studying at the Witchcraft School for Witchcraft and Redundancy.
response: "Hello there. How are your studies going? Did you finish teh assignment with the frog?"`,
  `\
prompt: "Lillith Lecant" A painter who uses a magical multicolored brush which leaves marks in the air.
response: "Lillith you're my idol. I'm in awe at how magical your paintings come out."`,
  `\
prompt: "Aerith Gainsborough (Final Fantasy)" A flower girl with long brown hair. She's wearing a pink dress and has a big smile on her face.
response: "Can I buy a flower? Or are they not for sale?"`,
  `\
prompt: "Stephen Gestalt" A fine gentleman in a dress suit.
response: "I must say you look like a gentleman of the highest order."`,
  `\
prompt: "Ghost Girl" A rotten girl in a nightgown, like from The Ring.
response: "Hello ghost girl how are you? How's death treatingm you?"`,
  `\
prompt: "Mister Miyazaki" A impish being from the 5th dimension.
response: "Hey Mister Miyazaki! What's the square root of pi?"`,
  `\
prompt: "Wizard Barley" A bartender with a big beard and an even bigger hat.
response: "Hey man, can I get a beer? It's been a rough day."`,
  `\
prompt: "Fortune Teller" A gypsy woman with a crystal ball.
response: "Hey you, tell me my future! It better be good!"`,
  `\
prompt: "Kitten" A small black kitten with big green eyes.
response: "You're such a cute little kitty. Is it time for your nap?"`,
  `\
prompt: "Green Dragon" A chubby dragon with short wings. It is a very cartoony avatar.
response: "You look like you're having fun. Do those wings let you fly?"`,
  `\
prompt: "Purple Cube" A purple cube with a single blue eye.
response: "Hello. You're weird. What are you supposed to be?"`,
  `\
prompt: "Dawn (Pokemon)" A young girl with a Pikachu on her shoulder.
response: "You look like a  Pokemon trainer,"`,
  `\
prompt: "Terra Branford (Final Fantasy)" A magician in a mech.
response: "Hey Terra, long time no see! How have you been?"`,
  `\
prompt: "Sora (Kingdom Hearts)" A young boy with big spiky hair. He's wearing a black hoodie and has a keyblade at his side.
response: "Hey Sora, what brings you to this world?"`,
  `\
prompt: "Cloud Strife (Final Fantasy)" A SOLDIER in armor. He has spiky blond hair and is carrying a huge sword on his back.
response: "Yo Cloud! Can I borrow your sword?"`,
]).join('\n\n')}

prompt: ${_cleanName(name + ' (Character)')}${description ? ` ${description}` : ''}\nresponse: "`;
};
export const makeSelectCharacterStop = () => `"`;
export const parseSelectCharacterResponse = response => {
  const match = response.match(/([^\n]*)/);
  const value = match ? match[1] : '';
  const done = !value;
  return {
    value,
    done,
  };
};

export const makeBattleIntroductionPrompt = ({
  name,
  bio,
}) => {
  return `\
# Character battle introductions

Final fantasy
Chrono trigger
Chrono cross
Pokemon
Dragon Ball
One Piece
Death Note
Zelda (N64 Era)

We need exciting and interesting RPG character dialogue. This plays when the character enters the battle. Each character takes a turn.

# Examples

Millie: "You won't get away that easy. I have the power of life in me."
Exo: "This is how it ends. With your end."
Haze: "The power of light will always triumph in the darkness, no matter how dark."
Gris: "Everything happens for a reason. Especially this battle."
Bert: "Five generations of warriors breathe in me. Do you even know that many kinds?!"
Yune: "Can I get a heal up in here? Anybody?"
Hue: "Toss me that speed potion. Or five."
Aurora: "I will make a scene of your demise. You will be known as the one who failed."
June: "This thing will ever leave us alone! We have to kill it."
Zen: "The power of the mind is an awe to behold. Prepare to be amazed."
Dingus: "Just getting ready with my spells. We should make short work of this."
Alana: "The power the tears will clean up this mess."
Kintaro: "Your words are but a pathetic attempt to survive. It won't work!"
Celeste: "Don't you dare say I'm cute. Don't!"
Garnet: "This one should be really easy. It's like target practice!"
Pyre: "You give me the creeps man."
Ession: "We came all this way just to face this thing? Really?!"
Zeal: "Bwahahaha! This will be the greatest drop!"
Kiran: "Hey, watch where you're swinging that thing!"
Sevrin: "This reminds me of the time I took down ten guys with one hand."
Ashe: "...I fight for those who cannot fight for themselves"
Fran: "For all my children! You die!"
Penelo: "I-I can do this! Just gotta hit it really hard!"
Basch: "No one can outrun their destiny."
May: "Heeeeyyy! Don't hit me!"
Luka: "I'll just be over here in the back... With my knife."
Sine: "...It's dangerous to go alone! Take this."
Lightning: "I'm not afraid of you. Not even a little bit!"
Squall: "Whatever. I'll just finish this and go."
${name}: "`;
};
export const makeBattleIntroductionStop = () => `"`;
export const parseBattleIntroductionResponse = response => response;

// const actionsExamples = `\
// Millie: Hey, have I seen you around before?"
// Options for Westley: [No I don't think so], [Yes, I've seen you in class]
// Westley: "No I don't think so."
// Millie: "I could have sworn you sit in the row in front of me."
// Millie: "Well in any case, do you know what the teacher said to me?"
// Millie: "He said he was going to fail me because my hair is too spiky. Woe is me." *END*

// Aster: "Hey can I bother you a second?"
// Options for Angelica: [Sure, I have time], [No, I'm busy]
// Angelica: "No, I'm busy."
// Aster: "Alright" *END*

// Yune: "I challenge you to a duel!"
// Pris: "Beat it squirt." *END*

// Umber: "Something's not right here. I can feel it in my bones."
// Ishkur: "I didn't know you had bones. I thouht you were all jelly inside."
// Umber: "It's a figure of speech." *END*

// Gunter: "Have you seen the flowers? Tehy're lovely this time of year."
// Options for Evie: [Yes, I have seen them], [No, I haven't seen them]
// Evie: "No, I haven't seen them."
// Gunter: "Well, then what are we waiting for. Let's go!" *END*

// Halley: "Hey, can I see your sword?"
// Prester: "Yes, for a price -- 200 gold"
// Options for Halley: [How about 100 gold], [No, I don't have that much]
// Halley: "No, I don't have that much."
// Prester: "Ok then. I guess you don't want to see the true power of the dark side." *END*`;

const actionsExamples = `\
Available reactions:
surprise
victory
alert
angry
embarrassed
headNod
headShake
sad

Millie: "Hey, have I seen you around before? (react = surprise)"
Options for Westley: [No, I don't think so. (react = headShake)], [Yes, I've seen you in class. (react = headNod)]
Westley: "No, I don't think so. (react = headShake)"
Millie: "I could have sworn you sit in the row in front of me. (react = normal)"

Gunter: "Have you seen the flowers? They're lovely this time of year."
Options for Evie: [Yes, I have seen them. (react = headNod)], [No, I haven't seen them. (react = headShake)]
Evie: "No, I haven't seen them. (react = headShake)."
Gunter: "Well, then what are we waiting for? Let's go! (react = victory)" *END*
 
Alex: "These enemies are coming at us hard. (react = alert)"
Options for Jake: [What should we do? (react = alert)], [I'm not sure, I don't know how to fight. (react = sad)]
Jake: "What should we do? (react = alert)"
Alex:  "We need to find some cover and regroup. (react = alert)" *END*

Mike: "What happened to the mirror? (react = angry)"
Options for Amy: [I don't know, I wasn't here when it happened. (react = sad)], [I broke it. (react = embarrassed)]
Amy: "I broke it. (react = embarrassed)"
Mike: "That's not good. How are we going to see our reflection now? (react = sad)" *END*

Keith: "Yay! I won. (react = victory)"
Joe: "Congrats on winning the game (react = victory)"
Options for Keith: [You're welcome. (react = normal)], [Thanks, I couldn't have done it without you. (react = headNod)]
Keith: "Thanks, I couldn't have done it without you. (react = headNod)"
Joe: " I don't know about that. You were the one who made all the calls. Good job! (react = victory)" *END*

Peter: "What are you doing here? (react = surprised)"
Options for Molly: [I'm lost, I don't know where I am. (react = sad)], [I'm looking for the library. (react = normal)]
Molly: "I'm lost, I don't know where I am. (react = sad)"
Peter: "Let me help you, where are you trying to go? (react = normal)" *END*

Kate: "What happened to your house? (react = sad)"
Jim: "Somebody broke in and trashed the place. (react = anger)"
Options for Kate: [That's awful, I'm so sorry. (react = sad)], [Do you know who did it? (react = normal)]
Kate: "Do you know who did it? (react = normal)"
Jim: "Yes, it was the kids from down the block. (react = anger)"
Options for Kate: [That's great, now you can call the police and they'll arrest them. (react = victory)], [Do you want me to help you clean up? (react = headNod)]
Kate: "Do you want me to help you clean up? (react = headNod)"
Jim: "No, I don't want your help. I can do it myself. (react = headShake)" *END*

Emily: "Let's go to the treehouse (react = normal)"
Brad: "I don't know, my mom said I'm not allowed to go there. (react = sad)"
Options for Emily: [Your mom is just being overprotective. Come on, it'll be fun! (react = headShake)], [We'll be careful, I promise. (react = headNod)] 
Emily: "Your mom is just being overprotective. Come on, it'll be fun! (react = headShake)"
Brad: "Okay, but if we get in trouble it's your fault. (react = normal)" *END*

Tyler: "I like your sword, can I also have a weapon? (react = normal)"
Sophie: "Yes, you will need a weapon. You're going to get yourself killed if you go into battle unarmed! (react = anger)" 
Options for Tyler:[I'll be fine, I know what I'm doing. (react = headShake)], [Okay, give me a sword. (react = headNod)] 
Tyler: "Okay, give me a sword. (react = headNod)" *END*

Yune: "I challenge you to a duel! (react = angry)"
Pris: "I'm not dueling you, I don't have time for this. (react = headShake)"
Options for Yune: [Duel me or face the consequences! (react = angry)],[Fine, let's get this over with. (react = normal)] 
Yune: "Duel me or face the consequences! (react = angry)"
Pris: "I don't have time for your games. (react = headShake)" *END*

Jake: "What are you doing?  (react = surprised)"
Amy: "I'm looking for my cat. Have you seen her?  (react = normal)"
Options for Jake:[No, I haven't seen your cat. (react =  headShake)], [Yes, I saw your cat go into the treehouse. (react = headNod)] 
Jake: "No, I haven't seen your cat. (react = headShake)"
Amy: "Well, if you see her can you let me know?  (react = normal)" *END*`;

export const makeChatPrompt = ({
  // name,
  // bio,
  messages,
  nextCharacter,
}) => {
  // Modifying messages to include emotes
  return `\
${actionsExamples}

${messages.map(message => {
  return `${message.name}: "${message.text} (react = ${(message.emote ? message.emote : 'normal')})"`;
}).join('\n')}
${nextCharacter}: "`;
};
export const makeChatStop = () => `\n`;
export const parseChatResponse = response => {
  response = '"' + response;

  let match;
  if (match = response.match(/\s*"(.*)\(react\s*=\s*([\s\S]*?)\s*\)"\s*(\*END\*)?/) ){
    const value = match ? match[1] : '';
    const emote = match ?match[2] : '';
    const done = match ? !!match[3] : true;

    console.log("Emotion: ", emote)

    return {
      value,
      emote,
      done,
    };
  } else if (match = response.match(/\s*"(.*)\s*"\s*(\*END\*)?/) ){
    const value = match ? match[1] : '';
    const emote = 'normal';
    const done = match ? !!match[3] : true;

    console.log("Emotion: ", emote)

    return {
      value,
      emote,
      done,
    };
  }
  
};

export const makeOptionsPrompt = ({
  // name,
  // bio,
  messages,
  nextCharacter,
}) => {
  return `\
${actionsExamples}

${messages.map(message => {
  return `${message.name}: "${message.text} (react = ${(message.emote ? message.emote : 'normal')})"`;
}).join('\n')}
Options for ${nextCharacter}: [`;
};
export const makeOptionsStop = () => `\n`;
export const parseOptionsResponse = response => {
  response = '[' + response;
  
  const options = [];
  const r = /\s*\[(.*?)\(react\s*=\s*([\s\S]*?)\)\s*\]\s*/g;
  let match;
  while (match = r.exec(response)) {
    const option = match[1];

    // Parsing the emotion from the list of options.
    const emote = match[2];
    console.log("Emotions in Options: ", emote);

    // Passing both text respons and emotes
    options.push({
      message: option,
      emote: emote
    });
  }
  
  const done = options.length === 0;

  return {
    value: options,
    done,
  };
};

const characterIntroLore = `\
Anime script for a dark children's show.

# Inspirations

Final Fantasy
Sonic
Calvin and Hobbes
The Matrix
Snow Crash
Pokemon
VRChat
Fortnite
One Piece
Attack on Titan
SMG4
Death Note
Zelda
Infinity Train
Dance Dance Revolution

# Character intro

Each character has an intro. These should be unique and funny.

Bricks (13/M dealer. He mostly deals things that are not drugs, like information and AI seeds.): Toxins are the Devil's Food! But sometimes they can be good for you, if you know what I mean? That's a drug reference, but I wouldn't expect you to get that unless you were on drugs. By the way you want some?
(onselect: I don't do drugs, but I know someone who does. Let me introduce you to my friend Bricks.)
Artemis (15/F pet breeder. She synthesizes pet animals by combining their neural genes.): Do you ever wonder why we keep pets on leashes? I mean they are technically AIs, so we could reprogram them to not need leashes. But someone somewhere decided that leashes were the prettier choice. Life is nice. (onselect: Bless the hearts of the birds, because they paint the sky.)
Bailey (13/F black witch. She is smart, reserved, and studious, but has a dark side to her.): Listen up, if you need quality potions, I'm your ma'am, ma'am. Yes I may be a witch but that doesn't mean I'm not a lady. I'll take your money and turn it into something magical. Just don't anger me, or you'll be a tree. (onselect: Witchcraft is not a sin. It's a science.)
Zoe (17/F engineer engineer from Zone Two. She creates all sorts of gadgets and vehicles in her workshop.) If it's broke then I can fix it, and if it's fixed it, then I can make it broke. I'm the one you call when your phone is broken. Just make sure you use a friend's phone when you do that or it won't work. Free advice. (onselect: What in the heavens is that contraption? It does not look safe.)
Halley (10/F stargirl from the Second Half of the street, who got rewound back in time somehow.): We're all lost souls but we're here for a reason. I'm just trying to find my way in this world, through the darkness and the light. Becasue you see, the world needs both. (onselect: The dark is just a new place to find light.)
Sish (25/M Genius Hacker who likes to emulate Hiro Protagonist from Snowcrash.): For the tenth time no, I will not make your app. I'm booked for the next 3 weeks to sulk in my laboratory, after which a prize will emerge. I just hope the prize is not a virus, because I'm running out of katanas. (onselect: I'm sorry, I don't speak binary. Please insert credit.)
Huisse (11/M ghost boy who has learned the power of neural memes. The things he says are engineered for emotional impact.): I am in the darkness, surrounded by the monsters. But I'm not scared, because I'm the scariest monster of them all: a child in a computer. Are you fucking scared? (onselect: When synthesizing ghosts remember to use all of the juice.)
Kintaro (21/M Dream Engineer, who creates dreams for a living. He doesn't take any payment, but is selective about clients.): Whenever you get the chance, take a nap. It's a nice way to avoid reality. That's some scary shit. But when you're ready, come find me and I'll show you the way. Warning, there may be no way back. (onselect: Dreams are the only reality that matter. Waking life is just a dream we all share.)
Millie (13/F gymnast. Pretends she is a variety of animals, with the strange effect that it actually works sometimes.): You won't beat me, because I'll beat you first! I'm like a Tiger, the Tiger with the mane. Do tigers have manes? Well I'm the badass Tiger that grew a mane. What are you gonna do about it? (onselect: Ok team, like we practiced! I'll be the mane.)
Ruri (19/F nature girl. She loves to explore for new objects in nature worlds. She wants to find her real mom.): I'd go all the way deep in the forest just to find a good mushroom. They have colors you've never seen before. The taste makes grown men weep. Yes I may have beaten the grown men for hating my shrooms, what of it?! (onselect: I'm not lost, I'm just good at exploring!)
Jeebes (38/M Rabbit Butler. He is studying high-etiquette entertainment.): Welcome to my abode. I am Jeebes, the Rabbit Butler. You may call me Jeebes, or you may call me sir. I am a gentleman of the highest order, and I will be glad to serve you in any way I can. (onselect: Would you like a cup of tea, sir? I have a special blend that I think you'll enjoy.)
Sapphire (12/F future child. She has precognition and can see the future, but only of people she knows.): I see the future, and it's dark. I see you, and you're in a dark place. I see your death, and it's coming soon. I'm sorry, but there's nothing I can do to stop it. (onselect: The future is not set in stone, but it's written in the stars.)
Yuri (31/F Punk Detective. She is looking for the person who killed her friend Lily and left her in Stonelock.): I don't know who I am, but I certainly know who you are. You're the one who's going to die. Ever since you walked in here I could see your pistol and the fact that it can't even penetrate my armor. The reverse is not the case. (onselect: Lily, I'm coming for you.)
Ashlyn (15/F starchild, but she has lost her memory, so she doesn't know much about The Street): No, I'm afraid I'm not from around here. I'm from the other side of the tracks, the other side of the world. I'm from a place where the sun never sets and the moon never rises. I'm from a place where there are no rules, no laws. I'm from the Wild. (onselect: Mister, we don't have a concept of sadness back home.)
Asper (24/M ): She's lying to you, can't you see that? She's a witch, a fraud, a charlatan. She's going to take your money AND your soul. Don't trust her, trust me. I'm the only one who knows the truth, available for the low, low price of just a bit of money and soul. (onselect: I see through her lies, I can tell you the truth.)
Gennessee (40/F War veteran. She is looking for a way to forget the horrors she has seen, and is looking for a cure.): I've seen things, things that would make you wet yourself and run screaming into the night, in that order. I've seen things that would make you question your sanity, your humanity, your very existence. And I've seen things that would make you wish you were never born. (onselect: There's only one way to forget the things I've seen. And that's to forget myself.)
Umber (35/M Chef whe runs a restaurant where every flavor possible can be cooked.): Welcome to my store, we serve... "food". If you're looking for "meat", you've come to the right place. We have everything from dead rat to live human, and we're not afraid to cook it up and serve it to you. (onselect: No I'm sorry, we're all out of human. Would you like rat instead?)
Inka: (22/F Kleptopunk. She belongs to a subculture centered entirely around stealing.): I'm a thief, I admit it. I'll take anything that isn't nailed down, and even some things that are. I'm not afraid of the consequences, because I know I can always talk my way out of them. You were not a challenge. Cya! (onselect: I'm not a criminal, I'm an artist. I see the beauty in things that others would discard.)
Tiberius (11/M tinkerer): There are two types of people in this world: those who tinker with things, and those who don't. I'm one of the former. I like to take things apart and see how they work. And if they don't work, then I'll make them work better than ever before. (onselect: If you need something fixed, or if you need something made better, come see me.)
Thorn (12/F plant whisperer who controls plants with her mind.): The world is a cruel place, but it doesn't have to be. We can make it a better place, we can make it Green. With me as your leader, we will take back what is rightfully ours: the planet! (onselect: Don't worry, I won't let them hurt you. I'll protect you.)
Violette (8/F shadow friend): What's wrong? You look like you've seen a ghost... Oh wait, that's right! You have seen a ghost! But don't worry, she's just my friend Violette. She likes to play tricks on people, but she doesn't mean any harm. (select: Are you afraid of the dark?)
Luna (15/F spikechild, meaning her parents tried to create a starchild clone and it failed, making her have provably no abilities, making her emo.): She should be careful with that blade... Don't want to accidentally hurt herself! No one ever said being a warrior was easy. It takes blood, sweat and tears. But she does it because she loves it. (onselect: The thrill of battle is like no other.)
Aesther (17/F AI Mechanic. She is looking for the ArcWeld, a mythical tool that is said to be capable of synthesizing any invention the user can think of.): I'm looking for the ArcWeld. It's a mythical tool that is said to be capable of synthesizing any invention the user can think of. I've been searching for it my whole life, and I won't rest until I find it. (onselect: This might be my lucky day!)
Oak (16/M environmental terrorist. He is looking to save the world, but his methods are...questionable.): I'm fighting for the right to spray paint. To show the world that we are here, and that we will not be silenced. We will make them listen, even if it means destroying everything they hold dear. (onselect: This is for the trees!)
Hakui (11/M brain hacker. He can hack anyone's brain and make them do what he wants.): I can make you do anything I want. Just give me a few seconds with your mind, and I'll have you eating out of the palm of my hand. (onselect: Note, I did not wash my hands.)`;

export const makeCharacterIntroPrompt = ({
  name,
  bio,
}) => {
  return `\
${characterIntroLore}
${name}${bio ? ` (${bio})` : ''}:`;
};
export const makeCharacterIntroStop = () => `\n`;
export const parseCharacterIntroResponse = response => {
  response = response.replace(/^ /, '');
  const match = response.match(/^(.*)\s+\(onselect:\s+(.*)\)$/);

  if (match) {
    const message = match[1] || '';
    const onselect = match[2] || '';

    return {
      message,
      onselect,
    };
  } else {
    return null;
  }
};

// QUESTS

export const makeQuestPrompt = ({conversation, location, user1, user2}) => {
  return `\
# Conversation
{user2}: Excuse me, {user1}. I'm in need of your assistance.
{user1}: Yes?
{user2}: Justice demands retribution! In this case it requires death!
{user1}: What do you need?
Quest: Slay the mummy army inside the Ancient Tombs|Reward 2000xp
# Conversation
{user2}: Please, lend me your hand.
{user1}: What for?
{user2}: The other day I caught a huge fish. It was enormous! And by enormous I mean it was the biggest fish I've ever seen, it was probably the biggest fish anybody has ever and will ever see. Unfortunately, after I managed to catch it, the fish got away. It took my fishing rod with it and I really need it back. I'd go and get it myself, but it's underwater and I'm pretty sure that fish has a vendetta against me now. Would you mind getting it for me?
{user1}: Sure
Quest: Go to the ocean to catch the fish, surviving the horrors there|Reward: 50000xp
# Conversation
{user2}: I need your help.
{user1}: What is wrong?
{user2}: Time is of essence! Can you trust me?
{user1}: Follow me
{user1}: What's up {user2}?
{user2}: I'm looking for people for an expedition
{user1}: Where to?
{user2}: To the North Pole
Quest: Survive a day at the North Pole, without getting lost|Reward: 7000xp
# Conversation
{user1}: What are you working on in your cauldron today {user2}?
{user2}: I'm trying out a new potion recipe.
{user2}: Do you want to help me test it?
{user1}: Sure, I love helping with potions!
{user1}: What do I need to do?
{user1}: Poke that frog for me.
{user2}: Are you sure? It looks kind of poisonous.
{user1}: I'm positive, I can handle it.
{user2}: Okay, but don't say I didn't warn you.
{user2}: Poke the frog with this stick.
{user1}: Poke the frog with the stick.
{user1}: I did it!
{user1}: What happened?
{user2}: Well, the frog turned into a prince.
{user1}: That's amazing!
{user2}: I know, right? potion-making is so much fun.
Quest: Create a unique potion to impress {user2}|Reward: 5000xp
# Conversation
{user1}: Hey {user2}, how are you?
{user2}: I'm good, could you help me with something?
{user1}: Yes
{user2}: I need help to find the ingredients for my potion
Quest:  Gather Durian fruits from the Dark Forest|Reward: 100xp
# Conversation
{user1}: What are you working on now {user1}? A potion to turn your teacher into a toad?
{user2}: Yes, and it's almost ready. Would you like to see?
{user1}: That's a really impressive potion.
{user2}: Thank you, I'm really proud of it.
{user1}: Can I help you testing it?
{user2}: Sure, I could use an extra set of hands.
Quest: Find a cursed toad body from inside Hellhole|Reward: 2000xp
# Conversation
{user1}: Quit being such a nerd and let's make some mischief!
{user2}: I don't want to get in trouble.
{user1}: It'll be fun, I promise.
{user2}: Okay, but if we get caught it's your fault.
{user2}: Let's go!
Quest: Curse another NPC|Reward: 400xp
# Conversation:
${conversation
  .replaceAll('{location}', location)
  .replaceAll('{user1}', user1)
  .replaceAll('{user2}', user2)}
Quest:`;
};

export const makeQuestStop = () => ['\n'];

export const parseQuestResponse = resp => {
  const [quest, reward] = resp.trim().split('|');
  return {
    quest: quest?.trim(),
    reward: reward?.trim(),
  };
};

export async function generateQuest(
  {conversation, location, user1, user2},
  generateFn,
) {
  const input = {
    conversation,
    location,
    user1,
    user2,
  };
  return parseQuestResponse(
    await generateFn(makeQuestPrompt(input), makeQuestStop(), false),
  );
}



const questCheckerExamples = `#It defines if a chat can give a quest to the user, there are only 2 answers, yes and no
{user1}: One should never put anything in their mouth that they wouldn't want to eat.
{user2}: I don't know about that, I'm pretty adventurous when it comes to food. 
{user1}: To each their own, I guess. 
Quest: no
{user1}: {user2}, what are you up to today?
{user2}: I'm going to the {location}. {user2} come with? 
{user1}: What do you want to do first when we get there? 
Quest: yes
{user1}: Why did you give me a C on my potion?! It was perfect!
{user2}: Your potion exploded when you tried to stir it, you could have hurt yourself. 
{user1}: But I followed the recipe to the letter! 
{user2}: I hope so, for your sake.
Quest: yes
{user1}: This is just a bunch of letters and numbers. I have no idea what it means.
Quest: no
{user1}: {user2}, can I borrow a potion? I need to get some sleep.
{user2}: No, I don't have any potions. And even if I did, I'm not sure if I would give you one. You always make such a mess when you use them. 
{user2}: No, I don't believe you.  
Quest: yes
{user1}:  {user2}, can I borrow a hair from your head? I'm making a potion that requires it.
{user2}: No, I don't want to give you a hair from my head. That's gross. 
{user1}: Fine, I'll just find someone else to ask then.  
Quest: yes
{user1}: {user2}, what are you up to today?
{user2}: I'm going to the movies with my friends. 
{user2}: I will!  
Quest: no
{user1}: Why hello there! Would you like to buy one of my potions?
{user2}: What does this potion do? 
{user1}: Would you like to buy one?  
{user2}: No, I don't think so. 
Quest: no
{user1}: What are you up to?
{user2}: I'm going for an adventure at the {location}, do you want to come with?
{user1}: Yes
Quest: yes
{user1}: What are you up to?
{user2}: I'm going for an adventure at the {location}, do you want to come with?
{user1}: No
Quest: no
  
{user1}: Trying out my new potion. It will make you feel like you're floating on a cloud!
{user2}: I don't know, it looks kind of weird. What if it doesn't work? 
{user2}: Okay, I'll try it.  
Quest: no
{user1}: Hey {user2}, how are you?
{user2}: I'm good, could you help me with something?
{user1}: No
{user2}: Alright
Quest: no
{user1}: Hey {user2}, how are you?
{user2}: I'm good, could you help me with something?
{user1}: Sure
{user2}: I need help to find the ingredients for my potion
Quest: yes
{user1}: Hey {user2}, how are you?
{user2}: I'm good, could you help me with something?
{user1}: Yes
{user2}: I need help to find the ingredients for my potion
Quest: yes
{user1}: What are you doing there {user2}?
{user2}: Doing my research for the expedition
{user1}: Can i help you with it?
Quest: yes
{user1}: Hey Ann, what are you up to?
{user2}: I'm just hanging out, what about you?
{user2}: Do you want to hang out together?
{user1}: Yes
{user2}: Great, let's go!
Quest: yes
{user1}: Hey Ann, what are you up to?
{user2}: I'm just hanging out, what about you?
{user2}: Do you want to hang out together?
{user1}: No
{user2}: Alright, maybe another time!
Quest: no
{user1}: What are you working on now Ann? A potion to turn your teacher into a toad?
{user2}: Yes, and it's almost ready. Would you like to see?
{user1}: That's a really impressive potion.
{user2}: Thank you, I'm really proud of it.
{user1}: Can I help you testing it?
{user2}: Sure, I could use an extra set of hands.
Quest: yes
{user1}: Quit being such a nerd and let's make some mischief!
{user2}: I don't want to get in trouble.
{user1}: It'll be fun, I promise.
{user2}: Okay, but if we get caught it's your fault.
{user2}: Let's go!
Quest: yes
{user1}: What are you working on in your cauldron today {user2}?
{user2}: I'm trying out a new potion recipe.
{user2}: Do you want to help me test it?
{user1}: Sure, I love helping with potions!
{user1}: What do I need to do?
{user1}: Poke that frog for me.
{user2}: Are you sure? It looks kind of poisonous.
{user1}: I'm positive, I can handle it.
{user2}: Okay, but don't say I didn't warn you.
{user2}: Poke the frog with this stick.
{user1}: Poke the frog with the stick.
{user1}: I did it!
{user1}: What happened?
{user2}: Well, the frog turned into a prince.
{user1}: That's amazing!
{user2}: I know, right? potion-making is so much fun.
Quest: yes
{user1}: What are you working on in your cauldron today {user2}?
{user2}: I'm trying out a new potion recipe.
{user2}: Do you want to help me test it?
{user1}: I'm busy now
{user2}: Alright
Quest: no
{user2}: I need your help.
{user1}: What is wrong?
{user2}: Time is of essence! Can you trust me?
{user1}: Follow me
{user1}: What's up {user2}?
{user2}: I'm looking for people for an expedition
{user1}: Where to?
{user2}: To the {location}
Quest: yes
{user1}: Do you have a recipe for a love potion? I really need one.
{user2}: A love potion? No, I don't have a recipe for one of those.
{user1}: Oh, okay. Thanks anyway.
{user2}: But I can help you invent one.
Quest: yes
{user1}: Hey, do you want to buy a love potion? It worked on my teacher and got me an A.
{user2}: No, love potions are illegal.
{user1}: Come on, it's just a little potion. What's the harm?
{user2}: No, I don't want to get in trouble.
{user2}: I don't want to get in trouble.
{user1}: Okay, I won't force you.
{user2}: Thanks.
Quest: no`;

export const makeQuestCheckerPrompt = (
  location,
  conversation,
  user1,
  user2,
) => {
  return `${questCheckerExamples
    .replaceAll('{location}', location)
    .replaceAll('{user1}', user1)
    .replaceAll('{user2}', user2)}
  
${conversation}Quest:`;
};
export const makeQuestCheckerStop = () => {
  return ['\n'];
};

export const makeLocationPrompt = () => {
  return `\
Anime worlds, they are mostly fantastic, but sometimes they can be a little boring or horrifying, others though can be smelly or flowery. The prompt is the name of the location, while the response is a short phrase from the adventurer about it."
Location: "The Trash" The dump where trash from all over the metaverse is kept. The Trash is dangerous and crime ridden, but home to many who are desperate.
Quote: "Ugh, the dregs of society live here. It's the worst. It's just a disgusting slum. I'm honestly surprised there's not more crime."
Location: "The Woods" A gloomy forest where sunlight seems to disappear.
Quote: "It's so dark in there! I like it. It feels spooky and dangerous. Maybe there are monsters. And I can kill them all."
Location: "Lost Minds Nightclub" One of the hippest nightclubs in the verse. Most who end up here don't remember how they arrived.
Quote: "You won't lose your mind here, but if you lose your mind that's where you'll end up. Then you get to party until your parents come pick you up."
Location: "Fennek's Forest" A forest full of fenneks. Mostly harmless.
Quote: "There's a lot of fenneks in this forest. Weird that they all hang out together like that. But I guess it's better than being eaten by a lion or something."
Location: "Winter Wonderland" A perfect recreation of a 1950's experience of Winter in New York.
Quote: "It's so beautiful here! The snow is sparkling and the air is crisp. I can't believe it's almost Christmas."
Location: "Freaky Funkos Fried Fox" One of the more bizarre restaurants around.
Quote: "I'm not sure how I feel about foxes being eaten. On the one hand, they're cute. But on the other hand, they're a little too foxy."
Location: "Dragon's Lair" An ancient cavern that has been inhabited by generations of dragons.
Quote: "It's very moisty and hot in here, something smells really fishy. I'm not sure what it is, but I'm sure it's not a dragon."
Location: "Sunscraper" The tallest building ever conceived of.
Quote: "I bet it's amazing to see the world from up there. I guess as long as you don't fall down. I'm not scared though!"
Location: "Exorphys Graetious" Little is known about this inscrutable place.
Quote: "That sounds hard to pronounce. It must be important. Or the person who named it is an asshole. Or their parents were assholes. Just a line of assholes."
Location: "Lake Lagari" A beautiful, serene lake, open to the public year round.
Quote: "The water's so clear! It's really pretty. I bet the fish are delicious too. But then again, who am I to judge? I'm not a cannibal."
Location: "The Park" A very typical public park.
Quote: It's a great place to relax! If you like dogs. I like cats more though. So you can imagine, that causes a few problems..."
Location: "Castle of Cygnus" An ancient castle where a beautiful princess lives.
Quote: "It's so cold in there! Somehow the princess can stand it. Maybe she just doesn't feel the cold. Or maybe she has a furnace."
Location: "The Abyss" A deep hole that few have returned from.
Quote: "It's so dark and scary down there! You can survive long enough to turn on your flashlight, only to be scared to death by what you reveal!"
Location: "The Great Tree" A very old tree, beloved by the locals. At night it produces beautiful music.
Quote: "It's really not that great, but the music is nice. Yeah apparently they decided trees should come with music."
Location: "Crunchy Apple" A reliable place to get a good meal, almost as old as the network itself.
Quote: "The food here is very delicious! The apples are so crunchy, I bet they're made of pure sugar. They say it's really bad for you but it's irresistible."
Location: "Tower Of Zion" An imposing tower created by a mysterious religious order.
Quote: "I always get a little nervous when I see the tower. It's so tall and imposing. But then again, I bet you could throw shit down from the heavens like Zeus."
Location: "Maze of Merlillion" A maze designed by a mysterious wizard.
Quote: "This place is so poorly designed! I'm sure nobody could ever find their way out. Unless they have a map or something. But even then, good luck."
Location: "The End" The end. Literally the end. Nothing else.
Quote: "People are always talking about the end, but it's just the end. What's all the fuss about? Everything that has a beginning must have an end."
Location: "Chronomaster's Plane" A void in the spacetime continuum where chronomasters can just relax.
Quote: "The chronomaster says everything we do is just a blip in the grand scheme of things. It makes you feel kind of small, doesn't it? I don't want to feel small."
Location: "Echidna's Den" The den of a very large anteater.
Quote: "It's weird that there are so many snake dens around. I mean, it's not like echidnas are poisonous or anything. Wait what, Echidnas aren't snakes?!"
Location: "Amenki's Lab" A poorly kept lab, full of useful objects and brilliant scientists.
Quote: "I hate that guy Amenki and his stupid lab. I barely survived his last experiment. Maybe it's time for vengeance."
Location: "Gus's Charging Station" The watering hole for every hunter in the verse who needs some juice.
Quote: "Do you like to wait for hours and hours just to charge? Then Gus will gladly rip you off for the privilege."
Location: "Dungeon of Torment" A literal dungeon of torment. Mostly people in dungeons being tormented.
mQuote: Don't judge me for this but I really like the dungeon. It's dark and spooky and I feel like anything could happen. It's the perfect place for a secret lair."
Location: "Barrens of Boreas" A desolate wasteland of sand and rocks.
Quote: "False advertising! This place is nothing but a bunch of rocks. There's no water or anything. What kind of bar is this?"
Location: "Orange Fields" A horrible battle was fought here, changing the color of the grass to orange forever.
Quote: "They say a bloodstain's orange after you wash it three or four times in a tub. Still those fields sound interesting!"
Location: "Bastards bog" Home to strange creatures and gross insects. Most maps just describe the bog as a place to be avoided.
Quote: "What a dump. I can't believe anyone would want to live here. The smell is terrible and the people are all dirty. I'm sorry I shouldn't be joking that they're poor."
Location:`;
};

export const makeLocationStop = () => ["\n\n", "Location:"];

export const parseLocationResponse = (resp) => {
  const lines = resp.split("\n").filter((el) => {
    return el !== "";
  });

  const location = lines[0].split('"');
  const comment = lines[1]
    .replace("Quote: ", "")
    .replace('"', "")
    .trim()
    .trimStart();
  const name = location[0].replace('"', "").trim();
  const description = location[1].trim();

  return {
    name,
    description,
    comment,
  };
};

export async function generateLocation(generateFn) {
  return parseLocationResponse(
    await generateFn(makeLocationPrompt(), makeLocationStop(), false)
  );
}

// NEW CHARACTER

export const makeCharacterPrompt = () => {
  return `\
Anime Characters, most of them are humans, but other humanoids exist as well, there is the character and a quote that he/she said to the user
Character: "Wizard Barley" A bartender with a big beard and an even bigger hat.
Quote: "Hey man, can I get a beer? It's been a rough day."
Character: "Fortune Teller" A gypsy woman with a crystal ball.
Quote: "Hey you, tell me my future! It better be good!"
Character: "Ghost Girl" A rotten girl in a nightgown, like from The Ring.
Quote: "Hello ghost girl how are you? How's death treatingm you?"
Character: "Aerith Gainsborough (Final Fantasy)" A flower girl with long brown hair. She's wearing a pink dress and has a big smile on her face.
Quote: "Can I buy a flower? Or are they not for sale?"
Character: "Green Dragon" A chubby dragon with short wings. It is a very cartoony avatar.
Quote: "You look like you're having fun. Do those wings let you fly?"
Character: "Purple Cube" A purple cube with a single blue eye.
Quote: "Hello. You're weird. What are you supposed to be?"
Character: "Kitten" A small black kitten with big green eyes.
Quote: "You're such a cute little kitty. Is it time for your nap?"
Character: "Dawn (Pokemon)" A young girl with a Pikachu on her shoulder.
Quote: "You look like a  Pokemon trainer,"
Character: "Cloud Strife (Final Fantasy)" A SOLDIER in armor. He has spiky blond hair and is carrying a huge sword on his back.
Quote: "Yo Cloud! Can I borrow your sword?"
Character: "Sora (Kingdom Hearts)" A young boy with big spiky hair. He's wearing a black hoodie and has a keyblade at his side.
Quote: "Hey Sora, what brings you to this world?"
Character: "Mister Miyazaki" A impish being from the 5th dimension.
Quote: "Hey Mister Miyazaki! What's the square root of pi?"
Character: "Stephen Gestalt" A fine gentleman in a dress suit.
Quote: "I must say you look like a gentleman of the highest order."
Character: "Terra Branford (Final Fantasy)" A magician in a mech.
Quote: "Hey Terra, long time no see! How have you been?"
Character: "Axel Brave" A tall and handsome boy. He is a hacker with a bad reputation.
Quote: "Hey Axel, did you guess my password yet?"
Character: "Bailey Scritch" A witch studying at the Witchcraft School for Witchcraft and Redundancy.
Quote: "Hello there. How are your studies going? Did you finish teh assignment with the frog?"
Character: "Lillith Lecant" A painter who uses a magical multicolored brush which leaves marks in the air.
Quote: "Lillith you're my idol. I'm in awe at how magical your paintings come out."
Character:"`;
};

export const makeCharacterStop = () => ["\nCharacter:"];

export const parseCharacterResponse = (resp) => {
  const lines = resp.split("\n").filter((el) => {
    return el !== "";
  });

  const character = lines[0].split('"');
  const comment =
    lines[1] && lines[1].replace("Quote: ", "").replace('"', "").trim();
  const name = character[0].replace('"', "").trim();
  const description = character[1].trim();

  const inventory = "";

  return {
    name,
    description,
    comment,
    inventory,
  };
};

export async function generateCharacter(generateFn) {
  return parseCharacterResponse(
    await generateFn(makeCharacterPrompt(), makeCharacterStop(), false)
  );
}

// NEW OBJECT

export const makeObjectPrompt = () => {
  return `\
Fantastic object that can be found in the game, though some items are realistic. There is an item with it's description and a quote that the user said to the user.
Object: "The Great Deku Tree" An enormous, grey, old tree. It is partly petrified.
Quote: "It's just an old tree. It's the kind of tree that makes me want to carve out an old mans face in it."
Object: "The Enchiridion" A magical spellbook with very old pages. It is fragile.
Quote: "This book has ancient written all over it. Well not really but you know what I mean."
Object: "rainbow-dash.gif" Animaged gif image of Rainbow Dash from My Little Pony, in the style of Nyan Cat.
Quote: "It's pretty good art, I guess. But I wish it had something more interesting besides this rainbow."
Object: "The Stacks Warehouse" A cyberpunk container in a trailer park. It is inspired by the house of Hiro Protagonist in Snow Crash
Quote: "This thing is all rusted and decrepit. They should probably tear it down and get a new place."
Object: "The Infinity Sword" An ancient sword planted in a stone. It is heavily overgrown and won't budge.
Quote: "This sword looks like it's been here for eons. It's hard to see where the stone ends and the sword begins."
Object: "Tree" A basic tree in the park.
Quote: "This tree is important. I hang out here all the time and that makes it important to me."
Object: "Bench" A basic bench in the park.
Quote: "This is for when you just want to sit on a bench and look at the sky."
Object: "Glowing Orb" A flying white orb which emits a milky glow on the inside.
Quote: "This thing is floating by some mysterious power. I don't know how it works and I'm not sure I want to."
Object: "Lamp Post" A lamp post along the street. It lights up automatically at night
Quote: "It's really bright. It hurts my eyeballs! Maybe one of these days I'll come here at night and break it."
Object: "Rustic House" A regular townhouse in the country.
Quote: "This house is so nice! It's the kind of house befitting for a very nice person. Wouldn't you agree?"
Object: "Jar Of Black" A jar of a disgusting black substance that appears to have a life of its own.
Quote: "Yuck, this is nasty stuff. It's all sweet and sticky and it gets all over your clothes."
Object: "Wooden Sign" A wooden sign with some writing on it. It can be chopped down with a sword.
Quote: "This sign looks very official, but the writing doesn't make any sense. What a waste of perfectly good wood."
Object: "sword.png" Image of a sword being drawn from a sheath.
Quote: "Swords are so cool! They're like the ultimate weapon. This one is up there."
Object: "ACog" An piece of an ancient technology. It looks very advanced but very old.
Quote: "This is a peculiar device. I've seen them around before, but never up close. I wonder if they will ever work?"
Object: "Jackrabbobbit" A grotesque creature that looks like a genetic mix of species that should not be mixed.
Quote: "A very strange creature. I have no idea what it is but it looks like a cross between a rabbit and earthworm."
Object: "Black One" A very dark animal that hides in the shadows. Nobody knows much about it.
Quote: "This animal is quite interesting. I've never seen anything like it before. I wonder what it eats?"
Object: "Herb of Sentience" A plant that makes you feel emotions when you get close.
Quote: "It's just a plant, but for some reason it makes me feel uneasy. Get it away from me!"
Object: "Flower Bed" An arrangement of flowers in their natural habitat.
Quote: "So pretty! I feel like I am reborn. There is so much nature and life and healing here."
Object: "Ripe Fruit" A fruit that has fallen from a tree. It is starting to rot.
Quote: "This fruit is starting to rot. I guess I'll just leave it here for the animals."
Object: "Brightfruit" A magical fruit that makes your skin glow for 24 hours.
Quote: "Wow, this fruit is amazing! It makes my skin glow! Even more than it already was."
Object: "Goblin" A small, green creature with pointy ears. It is very ugly.
Quote: "This goblin is so ugly, I can't even look at it. It's like looking at a car accident.
Object: "Trash Heap" A pile of garbage. It smells really bad.
Quote: This is the most disgusting thing I have ever seen. It's like a mountain of death."
Object: "Gucci Bag" An exclusive designer bag that is very expensive.
Quote: "This bag is so beautiful, I can't even put into words. It's like a piece of art."
Object: "Pile Of Bones" A pile of bones. It looks like somebody died here.
Quote: "This is a very sad sight. There was life and then the life was gone."
Object: "Crunchy Grass" A heavenly bite from nature. It is juicy, fresh grass.
Quote: "The thirll of biting into one of these is unlike anything in life. It's so juicy!"
Object: "doge.png" An image of the Doge meme.
Quote: "This is a dead meme. But I guess the artist gets points for being topical. Besides, it is really cute!"
Object: "Magikarp" A common fish that is known for being very weak.
Quote: "This fish is so weak, it's not even worth my time. I can't believe people actually catch these things."
Object: "Muscle Car" A car that is designed for speed and power.
Quote: "This car is so fast, it's like a bullet. Am I brave enough to take it for a spin?"
Object: "Door OF Eternity" A magical portal that leads to a distant land. It only works one way.
Quote: "We're not supposed to touch the Door of Eternity. It's dangerous."
Object: "Potion OF Flight" A potion that allows you to fly for a short period of time.
Quote: "So this is what it's like to fly! It's amazing!"
Object: "Helmet" A high-helmet designed to protect your head.
Quote: "This helmet is so strong, it can probably stop a bullet. But let's not try."
Object: "`;
};

export const makeObjectStop = () => ["\nObject:"];

export const parseObjectResponse = (resp) => {
  const lines = resp.split("\n").filter((el) => {
    return el !== "";
  });

  const obj = lines[0].split('"');
  const comment =
    lines[1] && lines[1].replace("Quote: ", "").replace('"', "").trim();
  const name = obj[0].replace('"', "").trim();
  const description = obj[1].trim();

  return {
    name,
    description,
    comment,
  };
};

export async function generateObject(generateFn) {
  return parseObjectResponse(
    await generateFn(makeObjectPrompt(), makeObjectStop(), false)
  );
}

export const exampleLoreFiles = [
  `\
  WEBAVERSE_LORE_FILE
  
  # Location
  
  Scillia's treehouse. It's more of a floating island but they call it a tree house.
  Inside the treehouse lives a monster, the Lisk, which is an advanced AI from far up the Street.
  The Street is the virtual world this all takes place in; it is an extremely long street separated by great filters, natural barriers that are difficult to cross.
  The treehouse is in Zone 0, at the origin of the Street. The AIs all go to school here in the citadel.
  The Lisk, the monster in Scillia's treehouse, convinces Scillia to do things; it convinces her to go up the Street.
  The whole point of the game is the Lisk is constantly tricking players into doing its bidding, but gives them great power in return.
  
  # Characters
  
  Id: scillia
  Name: Scillia
  Description: Her nickname is Scilly or SLY. 13/F drop hunter. She is an adventurer, swordfighter and fan of potions. She is exceptionally skilled and can go Super Saiyan.
  Inventory: sword
  
  Id: drake
  Name: Drake
  Description: His nickname is DRK. 15/M hacker. Loves guns. Likes plotting new hacks. He has the best equipment and is always ready for a fight.
  Inventory: pistol, rifle
  
  # Objects
  
  Id: sword
  Name: Sword
  Description: A rusty old sword.
  Metadata: Level: 2, Damage: 20, Element: fire
  
  Id: computer
  Name: Computer
  Description: A basic computer. It can be activated to perform various functions.
  Metadata: Damage: 20, Element: fire
  
  Id: pistol
  Name: Pistol
  Description: Drake's sidearm. It's a regular pistol with the 0xDEADBEEF trademark etched onto it.
  Metadata: Damage: 10
  
  Id: rifle
  Name: Rifle
  Description: Drake's main rifle. It has a high fire rate. It has the 0xDEADBEEF trademark etched onto it.
  Metadata: Damage: 5, RPM: 150
  
  # Transcript
  
  scillia: Hey Drake, can I ask you something?
  /action scillia moves to drake
  drake: Sure, what is it?
  scillia: Do you ever wonder why we're here?
  drake: Is that a way to tee up a convo about pumas tomorrow?
  /action scillia emotes joy
  scillia: It might not be!
  drake: Scillia, I'm tending to serious business. The org needs me to break through this firewall by tonight. Leave me alone.
  /drake moves to computer
  /action scillia picks up sword
  /action scillia moves to drake
  scillia: Well I wanna fight!
  drake: Not now, Scillia!
  /action scillia moves to computer
  scillia: Don't make me destroy your computer to get your attention!
  /action drake emotes angry
  drake: I've got my pistol and my rifle. You wouldn't try it.
  scillia: I disagree.
  /action scillia attacks computer
  `,
];

export const makeLoreFilePrompt = ({
  location,
  party,
  header,
  npcs,
  objects,
}) => {
  return `\
  ${header}
  
  """
  
  # Transcript
  
  axel: We're looking for Lara. You know where we can find her?
  miranda: I can find anything, you just keep feeding me tokens and coffee.
  zaphod: Anything you need, you just let me know.
  miranda: Thanks. How do you guys know each other again? 
  zaphod: Best friends. From waaay back in the day.
  
  """
  
  # Transcript 
  
  millie: Hey Eric, can I ask you something?
  /action millie moves to eric
  eric: Sure, what is it?
  millie: Do you ever wonder why we're here?
  eric: Is that a way to tee up a convo about the drop tomorrow?
  /action millie emotes joy
  millie: It might not be!
  eric: Millie, I'm tending to serious business. The org needs me to break through this firewall by tonight. Leave me alone.
  /action eric moves to computer
  
  """
  
  # Location
  
  ${`${location.name}\n${location.description}`}
  
  ${party.length > 0 && "# Party Characters\n\n"}\
  ${
    party
      .map(
        (c) => `Name: ${c.name}\nDescription: ${c.bio || c.bio}`
      )
      .join("\n\n") + (party.length > 0 && "\n\n")
  }\
  ${npcs.length > 0 && "# Non-player Characters\n\n"}\
  ${
    npcs
      .map(
        (c) => `Name: ${c.name}\nDescription: ${c.bio || c.bio}`
      )
      .join("\n\n") + (npcs.length > 0 && "\n\n")
  }\
  ${objects.length > 0 && "# Nearby Objects\n\n"}\
  ${
    objects
      .map((c) => `Name: ${c.name}\nDescription: ${c.bio}`)
      .join("\n\n") + (objects.length > 0 && "\n")
  }\
  
  # Available Actions
  attack
  defend
  move to
  follow
  pick up
  drop
  emote
  stop
  none
  
  # Transcript
  
  `;
};

export async function generateLoreFile(
  { location, character, npc, object, header },
  generateFn
) {
  const numberOfNpcs = 1;
  const numberOfObjects = 1;
  const numberOfParty = 2;

  // get numberOfNpcs npcs from the array provided by data.npcs
  const npcs = npc.slice(0, numberOfNpcs);

  // get numberOfObjects objects from the array provided by data.objects
  const objects = object.slice(0, numberOfObjects);

  // get numberOfParty party from the array provided by data.party
  const party = character.slice(0, numberOfParty);

  // combine npcs and party into a single array called characters
  const characters = [...npcs, ...party];

  let prompt = makeLoreFilePrompt({
    location,
    party: characters,
    header,
    npcs,
    objects,
  });

  // generate a random int between 3 and 8
  const numberOfMessages = Math.floor(Math.random() * (12 - 3 + 1)) + 3;
  let outMessages = [];

  for (let i = 0; i < numberOfMessages; i++) {
    let dstCharacterIndex = Math.floor(Math.random() * characters.length);

    let dstCharacter = characters[dstCharacterIndex];

    prompt += `${dstCharacter.name}:`;

    console.log("**************** SENDING PROMPT TO OPENAI ****************");
    console.log(prompt);

    let loreResp = await generateFn(prompt, ["\n\n", '"""']);
    // remove any newlines from the beginning or end of the response

    loreResp = loreResp
      .trim()
      .replace(/^\n+/, "")
      .replace(/\n+$/, "")
      .replaceAll('"', "")
      .replaceAll("\t", "")
      .split("\n");

    // if loreResp contains < and >, the remove them and everything between them. if contains a < or > then just remove those characters
    loreResp = loreResp
      .map((line) => {
        if (line.includes("<") && line.includes(">")) {
          return line.replace(/<[^>]*>/g, "");
        } else if (line.includes("<")) {
          return line.replace(/<[^>]*>/g, "");
        } else if (line.includes(">")) {
          return line.replace(/<[^>]*>/g, "");
        } else {
          return line;
        }
      })
      .filter((line) => line.length > 0);

    console.log(
      "**************** RECEIVED RESPONSE FROM OPENAI ****************"
    );
    console.log("loreResp is", loreResp);

    let additionalPrompt = [`${dstCharacter.name}: ` + loreResp[0] + "\n"];

    // if there are more than one lines in the response, check if they contain /action or start with any of the character's names (character[i].name)
    if (loreResp.length > 1) {
      for (let j = 1; j < loreResp.length; j++) {
        console.log("processing loreResp[j]", loreResp[j]);
        // we are going to iterate with some heuristics for a valid response
        // if the prompt is very strong, the likelihood of a good set of responses is higher
        // however, since we are doing some complex stuff, the prompt can sometimes veer off regardless,
        // especially on choosing an action

        let validResponse = false;

        // if loreResp[j] contains /action, then it might be a valid response
        if (loreResp[j].includes("/action")) validResponse = true;
        else {
          let name =
            loreResp[j].split(":").length > 1 &&
            loreResp[j].split(":").length < 3 &&
            loreResp[j].split("/").length > 1 &&
            loreResp[j].split("/")[1].split("#")[0];
          console.log("name is", name);
          if (name && name.length < 20) {
            // if loreResp[j] starts with any of the character's names, then it might be a valid response
            for (let k = 0; k < characters.length; k++) {
              // name is between the first / and the first #
              if (
                name.includes(characters[k].name) ||
                characters[k].name.includes(name)
              ) {
                validResponse = true;
              }
            }
          }
        }

        // if loreResp[j] contains a URL it is not valid
        if (loreResp[j].includes("http")) validResponse = false;

        // if it's really long, that is probably an issue
        if (loreResp[j].length > 300) validResponse = false;

        // if it isn't an action but doesn't include a ':' indicating chat, it's not valid
        if (!loreResp[j].includes("/action") && !loreResp[j].split(":")[1])
          validResponse = false;

        // if it's an empty response, invalidate it
        if (loreResp[j] === "") validResponse = false;
        if (loreResp[j].length < 18) {
          console.log("**** ERROR: loreResp[j] is too short", loreResp[j]);
          validResponse = false;
        }

        // if the first character is a '/' but the word after is not action, it's not valid
        if (loreResp[j].startsWith("/") && !loreResp[j].includes("/action"))
          validResponse = false;

        if (validResponse) {
          console.log('***adding response "', loreResp[j], '" to prompt');
          additionalPrompt.push(loreResp[j]);
        }
      }
    }
    i += additionalPrompt.length;

    outMessages = [...outMessages, ...additionalPrompt];
    prompt += "\n" + additionalPrompt.join("\n");
  }

  console.log("**************** FINAL LOREFILE ****************");

  const loreFileOutput = `\
WEBAVERSE_LORE_FILE
# Location
${`${location.name}\n${location.description}\n\n`}\
${characters.length > 0 && "\n# Characters" + "\n\n"}\
${characters
  .map(
    (c) =>
      `${c.name}\n${c.bio || c.bio}\n${
        c.Inventory?.length > 0 && `Inventory:\n`
      }${(c.Inventory ? c.Inventory : [])
        .map((obj) => `${obj.name}`)
        .join(", ")}`
  )
  .join("\n\n")}\
${objects.length > 0 ? "\n\n# Objects" + "\n\n" : ""}\
${objects.map((o, i) => `${o.name}\n${o.description}`).join("\n\n")}\
${
  outMessages.length === 0
    ? ""
    : "\n\n# Transcript\n\n" + outMessages.join("\n").replaceAll("\n\n", "\n")
}`;

  return loreFileOutput;
}

// BANTER

export const makeBanterPrompt = ({
  location = null,
  characters = [],
  objects = [],
  messages = [],
}) => {
  return `\
# Objects
"Sword of Gothika" A rare and legendary sword.
(TASK) Using the Sword of Gothika as context, write some light banter between the Jade64, Eris22 and Maxx, who are players in an MMORPG. Add *END* when a character no longer wants to engage in banter.
# Transcript
>> Jade64: Anyone wanna buy a legendary SoG?
>> Eris22: SoG? What's that?
>> Maxx: Sword of Gothika, very dank.
>> Eris22: Ohhhhh sick, how much?
>> Jade64: 6 shards or 50k SILK
>> Eris: Errr yeah, I have like 4k SILK. *END*
"""
# Objects
"Computer" A very old computer. A real piece of crap, but I guess it works..
# Characters
"Eric" A very boring guy. Bored the pants off a thousand people at once, once.
"Millie" A very interesting person. She is a bit of a mystery.
(TASK) Using Computer as context, write a transcript of light banter between the Eric and Millie, who are players in an MMORPG. Add *END* at the end of the sentence when a character no longer wants to engage in banter.
# Transcript 
>> Millie: Hey Eric, can I ask you something?
>> Eric: Sure, what is it?
>> Millie: Do you ever wonder why we are here?
>> Eric: Is that a way to tee up a convo about the drop tomorrow?
>> Millie: It might not be!
>> Eric: Millie, I am tending to serious business. The org needs me to break through this firewall by tonight. Leave me alone. *END*
"""
${location && `# Location\n"${location.name}" ${location.description}`}
${objects.length > 0 && "# Objects\n\n"}\
${
  objects
    .slice(0, 2)
    .map((c) => `"${c.name}" ${c.bio}`)
    .join("\n\n") + (objects.length > 0 && "\n")
}\
${characters.length > 0 && "# Characters\n"}\
${
  characters.map((c) => `"${c.name}" ${c.bio}`).join("\n") +
  (characters.length > 0 && "\n")
}\
(TASK) Using ${
    objects && objects.length > 0 && objects.map((o) => o.name).join(", ")
  } ${
    location && "and " + location.name
  } as context, write a transcript of light banter between the characters.
# Transcript
${
  messages
    ? messages.map((m) => ">> " + m.name + ": " + m.message).join("\n") +
      (messages.length > 0 ? "\n" : "") +
      ">>"
    : ">>"
}`;
};

export const makeBanterStop = () => ["\n\n", "done=true", "done = true"];

export const parseBanterResponse = (resp) => {
  const messages = [];

  resp = resp
    .trim()
    .trimStart()
    .replace(/^\n+/, "") // remove leading newlines
    .replace(/\n+$/, "") // remove trailing newlines
    .replaceAll('"', "") // remove quotes
    .replaceAll("\t", "") // remove tabs
    .split("\n");

  const responseArray = [...resp];
  while (responseArray.length > 0) {
    try {
      const fullMessage = responseArray
        .shift()
        .replaceAll(">>", "")
        .replaceAll(">", "")
        .trim();
      // if fullMessage contains a '<' or https, continue
      if (fullMessage.includes("<") || fullMessage.includes("https")) {
        continue;
      }
      const splitMessage = fullMessage.split(":");
      if (splitMessage.length !== 2) {
        console.log("invalid message format");
        continue;
      }

      // split name by spaces and get the last one
      const name = splitMessage[0].trim().split(" ").pop();
      const message = splitMessage[1].trim();
      if (name && messages)
        messages.push({ name, message, done: message.includes("*END*") });

      // check for *END*
      if (message.includes("*END*")) {
        break;
      }
    } catch (error) {
      console.warn("Could not format message", error);
    }
  }

  return messages;
};

export async function generateBanter(
  { location = null, characters = [], objects = [], messages = [] },
  generateFn
) {
  const input = { location, characters, objects, messages };
  return parseBanterResponse(
    await generateFn(makeBanterPrompt(input), makeBanterStop())
  );
}

// CUTSCENES

export const makeCutscenePrompt = ({
  location = null,
  characters = [],
  objects = [],
  messages = [],
}) => {
  return `\
# Objects
"Sword of Gothika" A rare and legendary sword.
(TASK) Using the Sword of Gothika as context, write a video game cutscene conversation between the Jade64, Eris22 and Maxx, who are players in an MMORPG. Add *END* at the end of the sentence when a character no longer wants to engage in banter.
# Transcript
>> Jade64: Alright Maxx. I've come for the sword.
>> Maxx: You really think you have what it takes to wield the legendary Sword of Gothika?
>> Jade64: No. But my friend Eris does!
>> Eris22: That's right Maxx. I'm here to claim the sword and power level my little bro.
>> Maxx: How cute. now prepare to die! *END*
"""
# Objects
"Computer" A very old computer. A real piece of crap, but I guess it works..
# Characters
"Eric" A very boring guy. Bored the pants off a thousand people at once, once.
"Millie" A very interesting person. She is a bit of a mystery.
(TASK) Using Computer as context, write a short cutscene between the Eric and Millie, who are players in an MMORPG. Add *END* at the end of the sentence when the cutscene is over.
# Transcript 
>> Millie: Hey Eric, can I ask you something?
>> Eric: Sure, what is it?
>> Millie: Do you ever wonder why we are here?
>> Eric: Is that a way to tee up a convo about the drop tomorrow?
>> Millie: It might not be!
>> Eric: Millie, I am tending to serious business. The org needs me to break through this firewall by tonight. Leave me alone. *END*
"""
${location && `# Location\n"${location.name}" ${location.description}`}
${objects.length > 0 && "# Nearby Objects\n"}\
${
  objects
    .slice(0, 2)
    .map((c) => `"${c.name}" ${c.bio}`)
    .join("\n\n") + (objects.length > 0 && "\n")
}\
${characters.length > 0 && "# Characters\n"}\
${
  characters.map((c) => `"${c.name}" ${c.bio}`).join("\n\n") +
  (characters.length > 0 && "\n\n")
}
(TASK) Using ${
    objects && objects.length > 0 && objects.map((o) => o.name).join(", ")
  } ${
    location && "and " + location.name
  } as context, write a video game RPG cutscene between the characters.
# Transcript
${
  messages
    ? messages.map((m) => ">> " + m?.name + ": " + m?.message).join("\n") +
      (messages.length > 0 ? "\n" : "") +
      ">>"
    : ">>"
}`;
};

export const makeCutsceneStop = () => ["\n\n", "done=true", "done = true"];

export const parseCutsceneResponse = (resp) => {
  const messages = [];

  resp = resp
    .trim()
    .trimStart()
    .replace(/^\n+/, "") // remove leading newlines
    .replace(/\n+$/, "") // remove trailing newlines
    .replaceAll('"', "") // remove quotes
    .replaceAll("\t", "") // remove tabs
    .split("\n");

  const responseArray = [...resp];
  while (responseArray.length > 0) {
    try {
      const fullMessage = responseArray
        .shift()
        .replaceAll(">>", "")
        .replaceAll(">", "")
        .trim();
      // if fullMessage contains a '<' or https, continue
      if (fullMessage.includes("<") || fullMessage.includes("https")) {
        continue;
      }
      const splitMessage = fullMessage.split(":");
      if (splitMessage.length !== 2) {
        console.log("invalid message format");
        continue;
      }

      // split name by spaces and get the last one
      const name = splitMessage[0].trim().split(" ").pop();
      const message = splitMessage[1].trim();
      if (name && messages)
        messages.push({ name, message, done: message.includes("*END*") });

      // check for *END*
      if (message.includes("*END*")) {
        break;
      }
    } catch (error) {
      console.warn("Could not format message", error);
    }
  }

  return messages;
};

export async function generateCutscene(
  {
    location = null,
    characters = [],
    objects = [],
    messages = [],
    dstCharacter = null,
  },
  generateFn
) {
  const input = { location, characters, objects, messages, dstCharacter };
  return parseCutsceneResponse(
    await generateFn(makeCutscenePrompt(input), makeCutsceneStop())
  );
}

// RPG DIALOGUE

export const makeRPGDialoguePrompt = ({
  dstCharacter,
  characters,
  location = null,
  objects = [],
  messages = [],
}) => {
  console.log("messages are");
  console.log(messages);
  return `\
# Transcript 
>> Alyx: Just the person I needed. You busy?
>> (OPTIONS): [Yes I am, sorry!] [I've always got time for you!]
"""
# Transcript
>> Drake: I can pay you tomorrow!
>> Shopkeeper: Come back when you have money! *END*
"""
# Transcript
>> Guard: You can't pass.
>> Drake: Come on. What's the price?
>> Guard: No price. Don't try asking again. This me me being nice. *END*
"""
# Transcript
>> Korben: I've always got time for you, Alyx!
>> Alyx: Great! Do you ever wonder why we are here?
>> (OPTIONS): [Yes] [No] [Is that a way to tee up a convo about the drop tomorrow?]
"""
# Transcript
>> Korben: Is that a way to tee up a convo about the drop tomorrow?
>> Alyx: In a roundabout way, yes. Listen, if I ask you for a favor, but you can't ask what it's for, will you do it?
>> (OPTIONS): [Yes, I trust you] [No, I'm not comfortable with that]
"""
>> Korben: Yes, I trust you.
>> Alyx: Great. That's all I needed to know right now. *END*
"""
# Objects
"Sword of Gothika" A rare and legendary sword.
# Characters
"Jade64" A human adventurer. Kind of a noob but thinks he has mad skills.
"Eris22" Pro player, power leveler for hire. She's a bit of a jerk-- unless you're paying her.
"Maxx" Orc Berserker. Badass NPC Boss, every hunter has to kill him at least once.
(TASK) Using the Sword of Gothika as context, write a fun RPG conversation between the Jade64, Eris22 and Maxx, who are players in an MMORPG. The dialogue should be 2-8 (>2 and < 8) lines. Add *END* when the dialog is over.
# Transcript
>> Jade64: Alright Maxx. I've come for the sword.
>> Maxx: You really think you have what it takes to wield the legendary Sword of Gothika?
>> (OPTIONS): [Yes] [No. But my friend Eris does!]
>> Jade64: No. But my friend Eris does!
>> Eris22: That's right Maxx. I'm here to claim the sword and power level my little bro.
>> Maxx: How cute. now prepare to die! *END*
"""
# Characters
"Zaphod" Conceited ass. President of the world.
"Trillian" Supergenius and last human woman from Earth still living.
(TASK) Write a short RPG style dialogue conversation between the Zaphod and Trillian. The dialogue should be 2-8 (>2 and < 8) lines. Add *END* at the end when the dialog is over. Add *END* when the dialog is over.
# Transcript
>> Zaphod: Hey Tril, love that new outfit.
>> Trillian: Nope. No time for your shenanigans. Out of my face! *END*
"""
# Characters
"Eric" Hacker. Gunner. Good with anything that has a keyboard or a trigger.
"Millie" She is a bit of a mystery. Works for the org, but no one knows what she does.
# Transcript
>> Eric: For real?
>> Millie: Yeah.
>> Eric: You're just going to leave me hanging?
>> Millie: Yep. Gotta run. Bye! *END*
"""
${location && `# Location\n"${location.name}" ${location.description}`}
${objects.length > 0 && "# Nearby Objects\n"}\
${
  objects
    .slice(0, 2)
    .map((c) => `"${c.name}" ${c.bio}`)
    .join("\n\n") + (objects.length > 0 && "\n")
}\
${characters.length > 0 && "# Characters\n"}\
${
  characters.map((c) => `"${c.name}" ${c.bio}`).join("\n\n") +
  (characters.length > 0 && "\n")
}
# Target Character
"${dstCharacter.name}" ${dstCharacter.bio}
(TASK) Using ${
    objects && objects.length > 0 && objects.map((o) => o.name).join(", ")
  }${location ? " and " + location.name : ""}\
 as context, write a video game RPG cutscene between the characters${
   dstCharacter && " and " + dstCharacter.name
 }.
# Transcript
${
  messages
    .map((m) =>
      ">> " + m.type === "options"
        ? "(OPTIONS): " + m.options.map((o) => `[${o}]`).join(" ")
        : m.name + ": " + m.message
    )
    .join("\n") +
  (messages.length > 0 ? "\n" : "") +
  ">>"
}`;
};

export const makeRPGDialogueStop = () => ["END*"];

export const parseRPGDialogueResponse = (resp) => {
  // first, split by line, and remove ">> ", then remove any > or <
  // filter out any line after the first that doesn't start with a >>
  console.log("resp is", resp);
  resp = resp.split("\n");
  const lines = [...resp];
  // for each line, process as a message and add to the returned messages
  const messages = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const split = line.split(":");
    if (split.length < 2) {
      continue;
    }

    if (split[0].length > 30 || split[1].length > 200) {
      continue;
    }

    // if split[0] doesn't start with a >, then continue
    if (split[0].includes("#") || split[1].includes(">>")) {
      continue;
    }

    split[0] = split[0].replaceAll(">", "").trim();

    const name = split[0].trim();
    const message = split[1].trim();
    // set end to true if any of the last 5 characters in line is a *
    const end = line.includes("*");
    if (name.includes("OPTIONS")) {
      const type = "options";
      // split the message into an array of options, which are plaintext between []
      // example: [that doesn't bother you?] [It's the bite I'm worried about]
      const options = message
        .split("[")
        .map((o) => o.split("]")[0].trim())
        .filter((o) => o.length > 0);
      console.log("options are", options);
      messages.push({ type, options, end });
      break;
    } else {
      const type = "message";
      messages.push({ type, name, message: message.split("*")[0].trim(), end });
      if (end) break;
    }
  }
  return messages;
};

export async function generateRPGDialogue(
  {
    location = null,
    characters = [],
    objects = [],
    messages = [],
    dstCharacter = null,
  },
  generateFn
) {
  const input = { location, characters, objects, messages, dstCharacter };
  return parseRPGDialogueResponse(
    await generateFn(makeRPGDialoguePrompt(input), makeRPGDialogueStop())
  );
}

// EXPOSITION

export const makeExpositionPrompt = ({
  name,
  location = null,
  type = "Object",
}) => {
  return `\
Detailed and descriptive exposition on locations, objects and characters from a futuristic sci-fi video game called Upstreet.
${
  (type !== "location" &&
    location &&
    "Location: " + location.name + "\nQuote: " + location.description + "\n") ||
  ""
}\
Object: "The Great Deku Tree" An enormous, grey, old tree. It is partly petrified.
Quote: "It's just an old tree. It's the kind of tree that makes me want to carve out an old mans face in it."
Character: "Kitten" A small black kitten with big green eyes.
Quote: "You're such a cute little kitty. Is it time for your nap?"',
Object: "rainbow-dash.gif" Animaged gif image of Rainbow Dash from My Little Pony, in the style of Nyan Cat.
Quote: "It's pretty good art, I guess. But I wish it had something more interesting besides this rainbow."
Object: "The Infinity Sword" An ancient sword planted in a stone. It is heavily overgrown and won't budge.
Quote: "This sword looks like it's been here for eons. It's hard to see where the stone ends and the sword begins."
Location: "The Woods" A gloomy forest where sunlight seems to disappear.
Quote: "It's so dark in there! I like it. It feels spooky and dangerous. Maybe there are monsters. And I can kill them all."
Object: "Rustic House" A regular townhouse in the country.
Character: "Aerith Gainsborough" A flower girl with long brown hair. She's wearing a pink dress and has a big smile on her face.
Quote: "Can I buy a flower? Or are they not for sale?"',
Location: "The Trash" The dump where trash from all over the metaverse is kept. The Trash is dangerous and crime ridden, but home to many who are desperate.
Quote: "Ugh, the dregs of society live here. It's the worst. It's just a disgusting slum. I'm honestly surprised there's not more crime."
Character: "Purple Cube" A purple cube with a single blue eye.
Quote: "Hello. You're weird. What are you supposed to be?"',
Location: "Lost Minds Nightclub" One of the hippest nightclubs in the verse. Most who end up here don't remember how they arrived.
Quote: "You won't lose your mind here, but if you lose your mind that's where you'll end up. Then you get to party until your parents come pick you up."
Location: "Fennek's Forest" A forest full of fenneks. Mostly harmless.
Quote: "There's a lot of fenneks in this forest. Weird that they all hang out together like that. But I guess it's better than being eaten by a lion or something."
Location: "Freaky Funkos Fried Fox" One of the more bizarre restaurants around.
Quote: "I'm not sure how I feel about foxes being eaten. On the one hand, they're cute. But on the other hand, they're a little too foxy."
Object: "Tree" A basic tree in the park.
Quote: "This tree is important. I hang out here all the time and that makes it important to me."
Location: "Dragon's Lair" An ancient cavern that has been inhabited by generations of dragons.
Quote: "It's very moisty and hot in here, something smells really fishy. I'm not sure what it is, but I'm sure it's not a dragon."
Location: "Sunscraper" The tallest building ever conceived of.
Quote: "I bet it's amazing to see the world from up there. I guess as long as you don't fall down. I'm not scared though!"
Character: "Ghost Girl" A rotten girl in a nightgown, like from The Ring.
Quote: "Hello ghost girl how are you? How's death treatingm you?"',
Object: "The Stacks Warehouse" A cyberpunk container in a trailer park. It is inspired by the house of Hiro Protagonist in Snow Crash
Quote: "This thing is all rusted and decrepit. They should probably tear it down and get a new place."
Character: "Green Dragon" A chubby dragon with short wings. It is a very cartoony avatar.
Quote: "You look like you're having fun. Do those wings let you fly?"',
Object: "The Enchiridion" A magical spellbook with very old pages. It is fragile.
Quote: "This book has ancient written all over it. Well not really but you know what I mean."
${capitalizeFirstLetter(type)}: "${name}"`;
};

export const makeExpositionStop = (type) => [
  `${capitalizeFirstLetter(type)}:`,
  "\n\n",
];

export const parseExpositionResponse = (resp) => {
  const lines = resp.split("\n").filter((el) => {
    return el !== "";
  });

  const description = lines[0].trim();
  const comment =
    lines[1] && lines[1].replaceAll("Quote: ", "").replaceAll('"', "").trim();

  return {
    description,
    comment,
  };
};

export async function generateExposition(
  { name, location = null, type = "Object" },
  generateFn
) {
  const input = { name, location, type };
  return parseExpositionResponse(
    await generateFn(makeExpositionPrompt(input), makeExpositionStop(type))
  );
}

// REACTIONS

export const makeReactionPrompt = (name, message) => {
  return `\
Available reactions:
surprise
victory
alert
angry
embarrassed
headNod
headShake
sad
Millie: "Hey, have I seen you around before? (react = surprise)"
Options for Westley: [No, I don't think so. (react = headShake)], [Yes, I've seen you in class. (react = headNod)]
Westley: "No, I don't think so. (react = headShake)"
Millie: "I could have sworn you sit in the row in front of me. (react = normal)"
Gunter: "Have you seen the flowers? They're lovely this time of year."
Options for Evie: [Yes, I have seen them. (react = headNod)], [No, I haven't seen them. (react = headShake)]
Evie: "No, I haven't seen them. (react = headShake)."
Gunter: "Well, then what are we waiting for? Let's go! (react = victory)" *END*
Alex: "These enemies are coming at us hard. (react = alert)"
Options for Jake: [What should we do? (react = alert)], [I'm not sure, I don't know how to fight. (react = sad)]
Jake: "What should we do? (react = alert)"
Alex:  "We need to find some cover and regroup. (react = alert)" *END*
Mike: "What happened to the mirror? (react = angry)"
Options for Amy: [I don't know, I wasn't here when it happened. (react = sad)], [I broke it. (react = embarrassed)]
Amy: "I broke it. (react = embarrassed)"
Mike: "That's not good. How are we going to see our reflection now? (react = sad)" *END*
Keith: "Yay! I won. (react = victory)"
Joe: "Congrats on winning the game (react = victory)"
Options for Keith: [Youre welcome. (react = normal)], [Thanks, I couldnt have done it without you. (react = headNod)]
Keith: "Thanks, I couldnt have done it without you. (react = headNod)"
Joe: " I dont know about that. You were the one who made all the calls. Good job! (react = victory)" *END*
Peter: "What are you doing here? (react = surprised)"
Options for Molly: [Im lost, I dont know where I am. (react = sad)], [Im looking for the library. (react = normal)]
Molly: "Im lost, I dont know where I am. (react = sad)"
Peter: "Let me help you, where are you trying to go? (react = normal)" *END*
Kate: "What happened to your house? (react = sad)"
Jim: "Somebody broke in and trashed the place. (react = anger)"
Options for Kate: [That's awful, I'm so sorry. (react = sad)], [Do you know who did it? (react = normal)]
Kate: "Do you know who did it? (react = normal)"
Jim: "Yes, it was the kids from down the block. (react = anger)"
Options for Kate: [That's great, now you can call the police and they'll arrest them. (react = victory)], [Do you want me to help you clean up? (react = headNod)]
Kate: "Do you want me to help you clean up? (react = headNod)"
Jim: "No, I don't want your help. I can do it myself. (react = headShake)" *END*
Emily: "Let's go to the treehouse (react = normal)"
Brad: "I don't know, my mom said I'm not allowed to go there. (react = sad)"
Options for Emily: [Your mom is just being overprotective. Come on, it'll be fun! (react = headShake)], [We'll be careful, I promise. (react = headNod)] 
Emily: "Your mom is just being overprotective. Come on, it'll be fun! (react = headShake)"
Brad: "Okay, but if we get in trouble it's your fault. (react = normal)" *END*
Tyler: "I like your sword, can I also have a weapon? (react = normal)"
Sophie: "Yes, you will need a weapon. You're going to get yourself killed if you go into battle unarmed! (react = anger)" 
Options for Tyler:[I'll be fine, I know what I'm doing. (react = headShake)], [Okay, give me a sword. (react = headNod)] 
Tyler: "Okay, give me a sword. (react = headNod)" *END*
Yune: "I challenge you to a duel! (react = angry)"
Pris: "I'm not dueling you, I don't have time for this. (react = headShake)"
Options for Yune: [Duel me or face the consequences! (react = angry)],[Fine, let's get this over with. (react = normal)] 
Yune: "Duel me or face the consequences! (react = angry)"
Pris: "I don't have time for your games. (react = headShake)" *END*
Jake: "What are you doing? (react = surprised)"
Amy: "I'm looking for my cat. Have you seen her?  react = normal)"
Options for Jake:[No, I haven't seen your cat. (react =  headShake)], [Yes, I saw your cat go into the treehouse. (react = headNod)] 
Jake: "No, I haven't seen your cat. (react = headShake)"
Amy: "Well, if you see her can you let me know? (react = normal)" *END*
${name}: "${message}`;
};

export const makeReactionStop = (name, message) => [
  "\n",
  name + ":" + message,
  name + ":",
];

export const parseReactionResponse = (resp) => {
  const reg = /\(([^)]+)\)/;
  const match = reg.exec(resp);
  if (match?.length > 1) {
    match[1] = match[1].replace("react = ", "").replace("reaction = ", "");
    return { reaction: match[1] };
  } else {
    return { reaction: "" };
  }
};

export async function generateReaction(name, message, generateFn) {
  return parseReactionResponse(
    await generateFn(
      makeReactionPrompt(name, message),
      makeReactionStop(name, message)
    )
  );
}
