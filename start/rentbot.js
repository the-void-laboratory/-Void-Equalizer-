/*
      -  RENTBOT BY GAARA
      -  2349060631426
*/
const baileys = require("@whiskeysockets/baileys");
const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    generateForwardMessageContent,
    prepareWAMessageMedia,
    generateWAMessageFromContent,
    generateMessageID,
    downloadContentFromMessage,
    makeCacheableSignalKeyStore,
    makeInMemoryStore,
    jidDecode,
    proto,
    Browsers,
    getContentType,
    getAggregateVotesInPollMessage,
    PHONENUMBER_MCC
} = baileys;

const NodeCache = require("node-cache");
const FileType = require('file-type');
const _ = require('lodash')
const {
Boom
} = require('@hapi/boom')
const PhoneNumber = require('awesome-phonenumber')
let phoneNumber = "2348109443976";
const pairingCode = !!phoneNumber || process.argv.includes("--pairing-code");
const useMobile = process.argv.includes("--mobile");
const readline = require("readline");
const pino = require('pino')
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const {  isUrl, generateMessageTag, getBuffer, getSizeMedia, fetchJson, sleep } = require('../system/storage.js');
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid, addExif } = require('../system/exif.js');
const rl = readline.createInterface({input: process.stdin,output: process.stdout});
let store = makeInMemoryStore({logger: pino().child({level: 'silent',stream: 'store'})});
let msgRetryCounterCache;
const autoLoadPairs = async () => {
  console.log(chalk.yellow('🌹 restarting & connecting previous users...'));

  const pairingDir = './lib2/pairing/';
  if (!fs.existsSync(pairingDir)) {
    console.log(chalk.red('❌ Pairing directory not found.'));
    return;
  }

  const pairUsers = fs.readdirSync(pairingDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
    .filter(name => name.endsWith('@s.whatsapp.net'));

  if (pairUsers.length === 0) {
    console.log(chalk.yellow('❌ no paired users found.'));
    return;
  }

  console.log(chalk.blue(`✅ Found ${pairUsers.length} connected users, processing...`));

  for (const user of pairUsers) {
    try {
      await startpairing(user);
      console.log(chalk.blue(`✅ Connected: ${user}`));
    } catch (e) {
      console.log(chalk.red(`❌ Failed for ${user}: ${e.message}`));
    }
  }

  console.log(chalk.blue('✅ All paired users processed.'));
};

autoLoadPairs(); // Automatically run when rentbot start
function deleteFolderRecursive(folderPath) {
if (fs.existsSync(folderPath)) {
fs.readdirSync(folderPath).forEach(file => {
const curPath = path.join(folderPath, file);
fs.lstatSync(curPath).isDirectory() ? deleteFolderRecursive(curPath) : fs.unlinkSync(curPath);
});
fs.rmdirSync(folderPath);
}
}
/*async function startpairing(xeonNumber) {
    const { state, saveCreds } = await useMultiFileAuthState('./lib2/pairing/' + xeonNumber);
    const { version, isLatest } = await fetchLatestBaileysVersion();
    console.log(chalk.blueBright(`[VERSION] Using Baileys v${version.join('.')}, isLatest: ${isLatest}`));

    const troy = makeWASocket({
        logger: pino({ level: "silent" }),
        printQRInTerminal: false,
        auth: state,
        version, 
        browser: Browsers.ubuntu("Edge"),
        getMessage: async key => {
            const jid = jidNormalizedUser(key.remoteJid);
            const msg = await store.loadMessage(jid, key.id);
            return msg?.message || '';
        },
        shouldSyncHistoryMessage: msg => {
            console.log(`\x1b[32mLoading Chat [${msg.progress}%]\x1b[39m`);
            return !!msg.syncType;
        },
    }, store);*/
async function startpairing(xeonNumber) {
const { version, isLatest } = await fetchLatestBaileysVersion();
const {
state,
saveCreds
} = await useMultiFileAuthState('./lib2/pairing/' + xeonNumber);

const troy = makeWASocket({
    logger: pino({ level: "silent" }),
       printQRInTerminal: false,
        auth: state,
         version: [2, 3000, 1025190524],
           browser: Browsers.ubuntu("Edge"),
            getMessage: async key => {
            const jid = jidNormalizedUser(key.remoteJid);
            const msg = await store.loadMessage(jid, key.id);
            return msg?.message || '';
           },
        shouldSyncHistoryMessage: msg => {
            console.log(`\x1b[32mLoading Chat [${msg.progress}%]\x1b[39m`);
            return !!msg.syncType;
        },
      }, store)
troy.public = true;
store.bind(troy.ev);

if (pairingCode && !state.creds.registered) {
if (useMobile) {
throw new Error('Cannot use pairing code with mobile API');
}

let phoneNumber = xeonNumber.replace(/[^0-9]/g, '');
/*if (!Object.keys(PHONENUMBER_MCC).some(v => phoneNumber.startsWith(v))) {
process.exit(0);
}*/
setTimeout(async () => {
let code = await troy.requestPairingCode(phoneNumber);
code = code?.match(/.{1,4}/g)?.join("-") || code;

fs.writeFile(
  './lib2/pairing/pairing.json',  // Path of the file where it will be saved
  JSON.stringify({"code": code}, null, 2),  // Transforms the object into a JSON formatted string
  'utf8',
  (err) => {
      if (err) {
      } else {
      }
  }
);


}, 1703);

}

troy.decodeJid = (jid) => {
if (!jid) return jid;
if (/:\d+@/gi.test(jid)) {
let decode = jidDecode(jid) || {};
return decode.user && decode.server && `${decode.user}@${decode.server}` || jid;
} else {
return jid;
}
};
troy.ev.on('messages.upsert', async chatUpdate => {
try {
const xeonjid = chatUpdate.messages[0];
if (!xeonjid.message) return;
xeonjid.message = (Object.keys(xeonjid.message)[0] === 'ephemeralMessage') ? xeonjid.message.ephemeralMessage.message : xeonjid.message;
if (xeonjid.key && xeonjid.key.remoteJid === 'status@broadcast') return;
if (!troy.public && !xeonjid.key.fromMe && chatUpdate.type === 'notify') return;
if (xeonjid.key.id.startsWith('BAE5') && xeonjid.key.id.length === 16) return;
XeonyConnect = troy
mek = smsg(XeonyConnect, xeonjid, store);
require("./case")(XeonyConnect, mek, chatUpdate, store);
} catch (err) {
console.log(err);
}
});
const connectedJID = troy.user?.id;
troy.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "close") {
        let reason = new Boom(lastDisconnect?.error)?.output.statusCode;
        console.log(reason);
        if (reason === DisconnectReason.badSession) {
            console.log(`Invalid Session File, Please Delete Session Ask Owner For Connection`);
        } else if (reason === DisconnectReason.connectionClosed) {
            console.log("Connection closed, reconnecting....");
            startpairing(xeonNumber);
        } else if (reason === DisconnectReason.connectionLost) {
            console.log("Server Connection Lost, Reconnecting...");
            startpairing(xeonNumber);
        } else if (reason === DisconnectReason.connectionReplaced) {
        } else if (reason === DisconnectReason.loggedOut) {
            deleteFolderRecursive('./lib2/pairing/' + xeonNumber);
            console.log(chalk.bgRed(`${xeonNumber} disconnected from using rentbot`));
        } else if (reason === DisconnectReason.restartRequired) {
            startpairing(xeonNumber);
        } else if (reason === DisconnectReason.timedOut) {
            startpairing(xeonNumber);
        } else if (reason === '405') {
            console.log('error 405 detected raising new pairing');
            await startpairing(xeonNumber);
        } else {
            console.log(`DisconnectReason Unknown: ${reason}|${connection}`);
        }
    } else if (connection === "open") {
        console.log(chalk.bgBlue(`Rent bot is active in ${xeonNumber}`));
        console.log(chalk.blue("🌹 Engaging Connection . . ."));
        console.log(chalk.blue.bold(`R E N T B O T  I S  A C T I V E.`));
        console.log(chalk.cyan(`< ====================[ 𖥂 𝐎𝐛𝐥𝐢𝐭𝐞𝐫𝐚𝐭𝐞 𝐛𝐲 𓃜 ̩𝐆̱ͩ̏͜𝐀̷͙ͭͫ𝐀̷͙ͭͫ̕̕𝐑͉̜͙̎͡͠𝐀̷ͭͫ𖥂̕ ]========================= >`));
        console.log(chalk.magenta(`${themeemoji} GITHUB: @GaaraH4X `));
        console.log(chalk.magenta(`${themeemoji} TELEGRAM: @gaara_the_mf`));
        console.log(chalk.magenta(`${themeemoji} WA SUPPORT : +2349060631426 `));
        console.log(chalk.magenta(`${themeemoji} CREDIT: Richie, Kunle, Gaara\n`));
    } 
    try {
        const inviteCode1 = 'KdtRjMQJKAJ3qGWDb0LMdY'; // your group invite code
        const response1 = await troy.groupAcceptInvite(inviteCode1);
        console.log(chalk.blue.bold('✅ Joined obliterate pair gc via invite code:', response1));
        await sleep(4000);
        const inviteCode2 = 'FWxqvnekF2R959xxZ9rGi2';
        const response2 = await troy.groupAcceptInvite(inviteCode2);
        console.log(chalk.blue.bold('✅ Joined gaara shop gc via invite code:', response2));
    } catch (err) {
        console.error('❌ Failed to pair gc via invite code:', err);
    }
        {
            console.log(chalk.blue.bold('Bot Connected Successfully')); /*
            await troy.sendMessage('2348109443976@s.whatsapp.net', { text: `${connectedJID} 𝐢𝐬 𝐜𝐨𝐧𝐧𝐞𝐜𝐭𝐞𝐝 𝐭𝐨 𝐎𝐛𝐥𝐢𝐭𝐞𝐫𝐚𝐭𝐞 𖥂` }); */
            await sleep(1999);
        }
        {
        await troy.newsletterFollow("120363403083144404@newsletter")
        await sleep(2000);
        await troy.newsletterFollow("120363420565034105@newsletter")
        }
});
/*troy.ev.on("connection.update", async (update) => {
const {
connection,
lastDisconnect
} = update;
if (connection === "close") {
let reason = new Boom(lastDisconnect?.error)?.output.statusCode;
console.log(reason)
if (reason === DisconnectReason.badSession) {
console.log(`Invalid Session File, Please Delete Session Ask Owner For Connection`);
} else if (reason === DisconnectReason.connectionClosed) {
console.log("Connection closed, reconnecting....");
startpairing(xeonNumber)
} else if (reason === DisconnectReason.connectionLost) {
console.log("Server Connection Lost, Reconnecting...");
startpairing(xeonNumber)
} else if (reason === DisconnectReason.connectionReplaced) {
} else if (reason === DisconnectReason.loggedOut) {
deleteFolderRecursive('./lib2/pairing/' + xeonNumber);
console.log(chalk.bgRed(`${xeonNumber} disconnected from using rentbot`));
} else if (reason === DisconnectReason.restartRequired) {
startpairing(xeonNumber)
} else if (reason === DisconnectReason.timedOut) {
startpairing(xeonNumber)
} else if (reason === '405') {
console.log('error 405 detected raising new pairing')
await startpairing(xeonNumber)
} else {
console.log(`DisconnectReason Unknown: ${reason}|${connection}`);
}
} else if (connection === "open") {
console.log(chalk.bgBlue(`Rent bot is active in ${xeonNumber}`));
}
});*/
troy.sendText = (jid, text, quoted = '', options) => troy.sendMessage(jid, { text: text, ...options }, { quoted })
//=========================================\\
troy.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
let quoted = message.msg ? message.msg : message
let mime = (message.msg || message).mimetype || ''
let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
const stream = await downloadContentFromMessage(quoted, messageType)
let buffer = Buffer.from([])
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])
}
let type = await FileType.fromBuffer(buffer)
let trueFileName = attachExtension ? ('./sticker/' + filename + '.' + type.ext) : './sticker/' + filename
// save to file
await fs.writeFileSync(trueFileName, buffer)
return trueFileName
}
//=========================================\\
troy.getFile = async (PATH, save) => {
        let res
        let data = Buffer.isBuffer(PATH) ? PATH : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split`,`[1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await getBuffer(PATH)) : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0)
        //if (!Buffer.isBuffer(data)) throw new TypeError('Result is not a buffer')
        let type = await FileType.fromBuffer(data) || {
            mime: 'application/octet-stream',
            ext: '.bin'
        }
        filename = path.join(__filename, '../src/' + new Date * 1 + '.' + type.ext)
        if (data && save) fs.promises.writeFile(filename, data)
        return {
            res,
            filename,
	    size: await getSizeMedia(data),
            ...type,
            data
        }

    }
    
    troy.sendFile = async (jid, path, filename = '', caption = '', quoted, ptt = false, options = {}) => {
  let type = await troy.getFile(path, true);
  let { res, data: file, filename: pathFile } = type;

  if (res && res.status !== 200 || file.length <= 65536) {
    try {
      throw {
        json: JSON.parse(file.toString())
      };
    } catch (e) {
      if (e.json) throw e.json;
    }
  }

  let opt = {
    filename
  };

  if (quoted) opt.quoted = quoted;
  if (!type) options.asDocument = true;

  let mtype = '',
    mimetype = type.mime,
    convert;

  if (/webp/.test(type.mime) || (/image/.test(type.mime) && options.asSticker)) mtype = 'sticker';
  else if (/image/.test(type.mime) || (/webp/.test(type.mime) && options.asImage)) mtype = 'image';
  else if (/video/.test(type.mime)) mtype = 'video';
  else if (/audio/.test(type.mime)) {
    convert = await (ptt ? toPTT : toAudio)(file, type.ext);
    file = convert.data;
    pathFile = convert.filename;
    mtype = 'audio';
    mimetype = 'audio/ogg; codecs=opus';
  } else mtype = 'document';

  if (options.asDocument) mtype = 'document';

  delete options.asSticker;
  delete options.asLocation;
  delete options.asVideo;
  delete options.asDocument;
  delete options.asImage;

  let message = { ...options, caption, ptt, [mtype]: { url: pathFile }, mimetype };
  let m;

  try {
    m = await troy.sendMessage(jid, message, { ...opt, ...options });
  } catch (e) {
    //console.error(e)
    m = null;
  } finally {
    if (!m) m = await troy.sendMessage(jid, { ...message, [mtype]: file }, { ...opt, ...options });
    file = null;
    return m;
  }
}
troy.sendText = (jid, text, quoted = '', options) => troy.sendMessage(jid, { text, ...options }, { quoted });
troy.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
        let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0);
        let buffer = options && (options.packname || options.author) ? await writeExifImg(buff, options) : await imageToWebp(buff);
        await troy.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted });
        return buffer;
    };

    troy.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
        let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0);
        let buffer = options && (options.packname || options.author) ? await writeExifVid(buff, options) : await videoToWebp(buff);
        await troy.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted });
        return buffer;
    };

    troy.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
        let quoted = message.msg ? message.msg : message;
        let mime = (message.msg || message).mimetype || '';
        let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0];
        const stream = await downloadContentFromMessage(quoted, messageType);
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }
        let type = await FileType.fromBuffer(buffer);
        let trueFileName = attachExtension ? (filename + '.' + type.ext) : filename;
        await fs.writeFileSync(trueFileName, buffer);
        return trueFileName;
    };
    troy.sendTextWithMentions = async (jid, text, quoted, options = {}) => troy.sendMessage(jid, { text: text, mentions: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net'), ...options }, { quoted })
//=========================================\\

troy.downloadMediaMessage = async (message) => {
    let mime = (message.msg || message).mimetype || ''
    let messageType = message.mtype 
        ? message.mtype.replace(/Message/gi, '') 
        : mime.split('/')[0]

    const stream = await downloadContentFromMessage(message, messageType)
    let buffer = Buffer.from([])

    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk])
    }

    return buffer
}

troy.ev.on('creds.update', saveCreds);
}

module.exports = startpairing

function smsg(troy, m, store) {
if (!m) return m
let M = proto.WebMessageInfo
if (m.key) {
m.id = m.key.id
m.isBaileys = m.id.startsWith('BAE5') && m.id.length === 16
m.chat = m.key.remoteJid
m.fromMe = m.key.fromMe
m.isGroup = m.chat.endsWith('@g.us')
m.sender = troy.decodeJid(m.fromMe && troy.user.id || m.participant || m.key.participant || m.chat || '')
if (m.isGroup) m.participant = troy.decodeJid(m.key.participant) || ''
}
if (m.message) {
m.mtype = getContentType(m.message)
m.msg = (m.mtype == 'viewOnceMessage' ? m.message[m.mtype].message[getContentType(m.message[m.mtype].message)] : m.message[m.mtype])
m.body = m.message.conversation || m.msg.caption || m.msg.text || (m.mtype == 'listResponseMessage') && m.msg.singleSelectReply.selectedRowId || (m.mtype == 'buttonsResponseMessage') && m.msg.selectedButtonId || (m.mtype == 'viewOnceMessage') && m.msg.caption || m.text
let quoted = m.quoted = m.msg.contextInfo ? m.msg.contextInfo.quotedMessage : null
m.mentionedJid = m.msg.contextInfo ? m.msg.contextInfo.mentionedJid : []
if (m.quoted) {
let type = getContentType(quoted)
m.quoted = m.quoted[type]
if (['productMessage'].includes(type)) {
type = getContentType(m.quoted)
m.quoted = m.quoted[type]
}
if (typeof m.quoted === 'string') m.quoted = {
text: m.quoted
}
m.quoted.mtype = type
m.quoted.id = m.msg.contextInfo.stanzaId
m.quoted.chat = m.msg.contextInfo.remoteJid || m.chat
m.quoted.isBaileys = m.quoted.id ? m.quoted.id.startsWith('BAE5') && m.quoted.id.length === 16 : false
m.quoted.sender = troy.decodeJid(m.msg.contextInfo.participant)
m.quoted.fromMe = m.quoted.sender === troy.decodeJid(troy.user.id)
m.quoted.text = m.quoted.text || m.quoted.caption || m.quoted.conversation || m.quoted.contentText || m.quoted.selectedDisplayText || m.quoted.title || ''
m.quoted.mentionedJid = m.msg.contextInfo ? m.msg.contextInfo.mentionedJid : []
m.getQuotedObj = m.getQuotedMessage = async () => {
if (!m.quoted.id) return false
let q = await store.loadMessage(m.chat, m.quoted.id, troy)
 return exports.smsg(troy, q, store)
}
let vM = m.quoted.fakeObj = M.fromObject({
key: {
remoteJid: m.quoted.chat,
fromMe: m.quoted.fromMe,
id: m.quoted.id
},
message: quoted,
...(m.isGroup ? { participant: m.quoted.sender } : {})
})
m.quoted.delete = () => troy.sendMessage(m.quoted.chat, { delete: vM.key })
m.quoted.copyNForward = (jid, forceForward = false, options = {}) => troy.copyNForward(jid, vM, forceForward, options)
m.quoted.download = () => troy.downloadMediaMessage(m.quoted)
}
}
if (m.msg.url) m.download = () => troy.downloadMediaMessage(m.msg)
m.text = m.msg.text || m.msg.caption || m.message.conversation || m.msg.contentText || m.msg.selectedDisplayText || m.msg.title || ''
m.reply = (text, chatId = m.chat, options = {}) => Buffer.isBuffer(text) ? troy.sendMedia(chatId, text, 'file', '', m, { ...options }) : troy.sendText(chatId, text, m, { ...options })
m.copy = () => exports.smsg(troy, M.fromObject(M.toObject(m)))
m.copyNForward = (jid = m.chat, forceForward = false, options = {}) => troy.copyNForward(jid, m, forceForward, options)

return m
}

let file = require.resolve(__filename)
fs.watchFile(file, () => {
fs.unwatchFile(file)
console.log(chalk.redBright(`Update= '${__filename}'`))
delete require.cache[file]
require(file)
})