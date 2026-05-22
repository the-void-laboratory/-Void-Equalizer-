require('../setting/config')
const fs = require('fs');
const {
    Telegraf,
    Context,
    Markup
} = require('telegraf')
const {
    message,
    editedMessage,
    channelPost,
    editedChannelPost,
    callbackQuery
} = require("telegraf/filters");
const path = require('path');
const os = require('os')
const yts = require('yt-search');
const { ytdl } = require('./lib/scrape/scrape-ytdl');
const startpairing = require('./rentbot');
const { BOT_TOKEN } = require('./token');
    const adminFilePath = './adminID.json';
const bannedPath = './lib2/pairing/banned.json';
// Helper to format runtime duration
const ITEMS_PER_PAGE = 10;
const pagedListPairs = {}; // In-memory cache for each admin
// Track when bot started
const botStartTime = Date.now();

// Check if adminID.json exists, if not, create it with your ID
if (!fs.existsSync(adminFilePath)) {
  const defaultAdmin = [String(process.env.OWNER_ID || '7828164131')]; // fallback if OWNER_ID is not set
  fs.writeFileSync(adminFilePath, JSON.stringify(defaultAdmin, null, 2));
}
// Handle listpair pagination

const userStore = './lib2/pairing/users.json';

function trackUser(id) {
  const users = JSON.parse(fs.readFileSync(userStore));
  if (!users.includes(id)) {
    users.push(id);
    fs.writeFileSync(userStore, JSON.stringify(users, null, 2));
  }
}
const adminIDs = JSON.parse(fs.readFileSync(adminFilePath, 'utf8'));
const bot = new Telegraf(BOT_TOKEN);
const premium_file = './premium.json';
let premiumUsers = [];

try {
  if (fs.existsSync(premium_file)) {
    premiumUsers = JSON.parse(fs.readFileSync(premium_file, 'utf-8'));
  } else {
    fs.writeFileSync(premium_file, JSON.stringify([]));
  }
} catch (error) {
  console.error('Failed to load premium users:', error);
}
const userStates = {};
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
function getPushName(ctx) {
  return ctx.from.first_name || ctx.from.username || "User";
}
function sendListPairPage(ctx, userID, pageIndex) {
  const pairedDevices = pagedListPairs[userID];
  const totalPages = Math.ceil(pairedDevices.length / ITEMS_PER_PAGE);
  const start = pageIndex * ITEMS_PER_PAGE;
  const currentPage = pairedDevices.slice(start, start + ITEMS_PER_PAGE);

  const pageText = currentPage.map((id, i) =>
    `*${start + i + 1}.* \`ID:\` ${id}`
  ).join('\n');

  const navButtons = [];
  if (pageIndex > 0) navButtons.push({ text: '⬅️ Back', callback_data: `listpair_page_${pageIndex - 1}` });
  if (pageIndex < totalPages - 1) navButtons.push({ text: '➡️ Next', callback_data: `listpair_page_${pageIndex + 1}` });

  ctx.deleteMessage().catch(() => {});
  ctx.reply(`*Paired Bots (Page ${pageIndex + 1}/${totalPages}):*\n\n${pageText}`, {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: navButtons.length ? [navButtons] : []
    }
  });
}
function sendDelPairPage(ctx, userID, pageIndex) {
  const pairedDevices = pagedListPairs[userID];
  const totalPages = Math.ceil(pairedDevices.length / ITEMS_PER_PAGE);
  const start = pageIndex * ITEMS_PER_PAGE;
  const currentPage = pairedDevices.slice(start, start + ITEMS_PER_PAGE);

  const keyboard = currentPage.map(id => [
    { text: `🗑️ ${id}`, callback_data: `delpair_${id}` }
  ]);

  const navButtons = [];
  if (pageIndex > 0) navButtons.push({ text: '⬅️ Back', callback_data: `delpair_page_${pageIndex - 1}` });
  if (pageIndex < totalPages - 1) navButtons.push({ text: '➡️ Next', callback_data: `delpair_page_${pageIndex + 1}` });

  if (navButtons.length) keyboard.push(navButtons);

  const text = `Delete Paired Devices (Page ${pageIndex + 1}/${totalPages}):\n\nTap a device ID to delete.`;

  ctx.deleteMessage().catch(() => {});
  ctx.reply(text, {
    parse_mode: 'Markdown',
    reply_markup: { inline_keyboard: keyboard }
  });
}
function formatRuntime(seconds) {
  const pad = (s) => (s < 10 ? '0' + s : s);
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${pad(hrs)}h ${pad(mins)}m ${pad(secs)}s`;
}
bot.command('runtime', async (ctx) => {
  const uptime = Math.floor((Date.now() - botStartTime) / 1000);
  ctx.reply(`☩ Equalizer ☩ ᴠ4 ʜᴀs ʙᴇᴇɴ ᴏɴʟɪɴᴇ ᴀɴᴅ ʀᴜɴɴɪɴɢ ғᴏʀ *${formatRuntime(uptime)}*`, {
    parse_mode: 'Markdown'
  });
});
bot.start((ctx) => {
  const userId = ctx.from.id;
  trackUser(userId); // Track user for broadcast

ctx.reply('☩ Equalizer ☩ ᴠᴇʀsɪᴏɴ (4) ɪs ᴀᴄᴛɪᴠᴇ ᴛᴏ ᴘᴀɪʀ ᴛᴀᴘ ᴛʜᴇ ʙᴜᴛᴛᴏɴ ʙᴇʟᴏᴡ', {
  reply_markup: {
    inline_keyboard: [
      [
        { text: 'sᴛᴀʀᴛ 💨', callback_data: 'start_bot' }
      ]
    ]
  }
});
});
bot.action('start_bot', async (ctx) => {
  const pushname = getPushName(ctx);
  const photoUrl = 'https://files.catbox.moe/zt5p9c.jpeg';
  const captionText =`
┏━━[ ☘ ] ⌠ ☩ Void Equalizer ☩ 𝕻𝖆𝖎𝖗 𝕯𝖔𝖒𝖆𝖎𝖓 ⌡
┃
┃ 𝚄𝚂𝙴 𝚃𝙷𝙴 𝙲𝙾𝙼𝙼𝙰𝙽𝙳 𝙱𝙴𝙻𝙾𝚆
┃     ├╼❀ /pair
┃     ├╼❀ /delpair
┃    𝙵𝙾𝚁 𝙾𝚆𝙽𝙴𝚁 𝙾𝙽𝙻𝚈!!!!
┃     ├╼❀ /runtime
┃     └╼✿ /listpair
┗━━━━━━━━━━━━━━━━━━━━❍
 © 𝐕𝐎𝐈𝐃 ᴛᴇᴄʜ ɪɴᴄ`;
    
  const buttons = Markup.inlineKeyboard([
    [
      Markup.button.url('♘ ᴏᴡɴᴇʀ ♘', 'https://t.me/certifiedloner_16'),
      Markup.button.url('ᴅᴇᴠ ᴄʜᴀɴɴᴇʟ', 'https://t.me/thevoidslab')
      
    ]
  ]);

  try {
    await ctx.sendChatAction('upload_photo');
    await ctx.replyWithPhoto(photoUrl, {
      caption: captionText,
      parse_mode: 'HTML',
      ...buttons
    });
  } catch (err) {
    console.error('Image failed to load, sending fallback text:', err);
    await ctx.reply(`${captionText}`, {
      parse_mode: 'HTML',
      ...buttons
    });
  }
});
bot.command('pair', async (ctx) => {
  try {
    const userId = ctx.from.id;

    const channelUsernames = ['@thevoidslab']; // Your required channels
    let joinedAllChannels = true;
    for (const channel of channelUsernames) {
      try {
        const member = await ctx.telegram.getChatMember(channel, userId);
        if (['left', 'kicked'].includes(member.status)) {
          joinedAllChannels = false;
          break;
        }
      } catch (e) {
        joinedAllChannels = false;
        break;
      }
    }

    if (!joinedAllChannels) {
      return ctx.reply(
        `Join Our Tg Official Channel.🌐.`,
        {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [{ text: 'Official Tg Channel', url: 'https://t.me/thevoidslab' }],
              [{ text: 'Done', callback_data: 'check_join' }]
            ]
          }
        }
      );
    }

    const text = ctx.message.text.split(' ')[1];
    if (!text) {
      return ctx.reply('To proceed plz enter a phone number in the format: /pair 234xxxxxxxx', { parse_mode: 'Markdown' });
    }

    if (/[a-z]/i.test(text)) {
      return ctx.reply('Please enter a valid phone number.');
    }

    if (!/^\d{7,15}(\|\d{1,10})?$/.test(text)) {
      return ctx.reply('Enter number in this format: 234xxxxxx(numbers only, no symbols or letters❌)', { parse_mode: 'Markdown' });
    }

    if (text.startsWith('0')) {
      return ctx.reply('Please use a different number format.');
    }

    const target = text.split("|")[0];
    const Xreturn = ctx.message.reply_to_message
      ? ctx.message.reply_to_message.from.id
      : target.replace(/[^0-9]/g, '') + "@s.whatsapp.net";

    if (!Xreturn) {
      return ctx.reply("This number is not registered on WhatsApp");
    }

    const countryCode = text.slice(0, 3);
    const prefixxx = text.slice(0, 1);
    if ([".", ".", ".", "0"].includes(countryCode) || prefixxx === "0") {
      return ctx.reply("Sorry, numbers with this country code or prefix are not supported.");
    }
    
const pairingFolder = './lib2/pairing';
const pairedUsersFromJson = fs.readdirSync(pairingFolder).filter(file => file.endsWith('@s.whatsapp.net')).length;
if (pairedUsersFromJson >= 50) {
  return ctx.reply("Limit reached,pairing is unavailable at the moment.Try again later.Or inform my owner - (https://t.me/certifiedloner_16) to create more servers.");
}
    const startpairing = require('./rentbot.js');
    await startpairing(Xreturn);
    await sleep(4000);

    const cu = fs.readFileSync('./lib2/pairing/pairing.json', 'utf-8');
    const cuObj = JSON.parse(cu);

    ctx.reply(
      `\n*CODE*: ${target}\n\nhttps://www.whatsapp.com/otp/code/?otp_type=COPY_CODE&code=otp${cuObj.code}\n\nInstructions:\n1. Open WhatsApp\n2. Go to Linked Devices\n3. Tap Link Device\n4. Enter the code`,
      {
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
        reply_markup: {
          inline_keyboard: [
            [{ text: 'WA-CHANNEL', url: 'https://whatsapp.com/channel/0029Vb5x2Nk4yltYjpqRR00D' }]
          ]
        }
      }
    );
  } catch (error) {
    console.error('Error in pair command:', error);
    ctx.reply('An error occurred while processing your request.');
  }
});
bot.action('check_join', async (ctx) => {
  const channelUsername = '@thevoidslab';
  const userId = ctx.from.id;

  const member = await ctx.telegram.getChatMember(channelUsername, userId);
  if (['member', 'administrator', 'creator'].includes(member.status)) {
    // Send a message instead of answering the callback query
    ctx.reply('You’ve successfully joined our channel 🎉.');
  } else {
    ctx.answerCbQuery('You haven’t our joined yet 💔.', { show_alert: true });
  }
});
bot.command('listpair', async (ctx) => {
  const userID = ctx.from.id.toString();

  if (!adminIDs.includes(userID)) {
    return ctx.reply(`Unauthorized access.This command is restricted.`);
  }

  const pairingPath = './lib2/pairing';
  if (!fs.existsSync(pairingPath)) return ctx.reply('No paired devices found.');

  const entries = fs.readdirSync(pairingPath, { withFileTypes: true });
  const pairedDevices = entries.filter(entry => entry.isDirectory()).map(entry => entry.name);

  if (pairedDevices.length === 0) return ctx.reply('No paired devices found.');

  pagedListPairs[userID] = pairedDevices;
  sendListPairPage(ctx, userID, 0);
});
bot.command('deluser', async (ctx) => {
  const userID = ctx.from.id.toString();

  if (!adminIDs.includes(userID)) {
    return ctx.reply(`Unauthorized access.This command is restricted.`);
  }

  const pairingPath = './lib2/pairing';
  if (!fs.existsSync(pairingPath)) return ctx.reply('No paired devices found.');

  const entries = fs.readdirSync(pairingPath, { withFileTypes: true });
  const pairedDevices = entries.filter(entry => entry.isDirectory()).map(entry => entry.name);

  if (pairedDevices.length === 0) return ctx.reply('No paired devices found.');

  pagedListPairs[userID] = pairedDevices;
  sendDelPairPage(ctx, userID, 0);
});
bot.command('broadcast', async (ctx) => {
  const senderId = ctx.from.id;
  const message = ctx.message.text.split(' ').slice(1).join(' ');

  if (!adminIDs.includes(senderId.toString())) {
    return ctx.reply('Unauthorized access.This command is restricted.');
  }

  if (!message) {
    return ctx.reply('Please provide a message to broadcast.\nUsage: /broadcast Hello users!');
  }

  const users = JSON.parse(fs.readFileSync('./lib2/pairing/users.json'));

  let success = 0;
  let failed = 0;

  for (const userId of users) {
    try {
      await ctx.telegram.sendMessage(userId, `Broadcast Message: \n\n${message}`, {
        parse_mode: 'Markdown'
      });
      success++;
    } catch {
      failed++;
    }
  }

  ctx.reply(`Broadcast complete.\n\nSuccess: ${success}\nFailed: ${failed}`);
});
bot.command('delpair', async (ctx) => {
  const text = ctx.message.text.trim();
  const args = text.split(' ').slice(1);

  if (args.length === 0) {
    return ctx.reply('To proceed plz enter a phone number in the format: /delpair 234xxxxxxxx', { parse_mode: 'Markdown' });
  }

  const inputNumber = args[0].replace(/\D/g, ''); // Remove non-numeric characters
  const jidSuffix = `${inputNumber}@s.whatsapp.net`;

  const pairingPath = './lib2/pairing';
  if (!fs.existsSync(pairingPath)) {
    return ctx.reply('No paired devices found.');
  }

  const entries = fs.readdirSync(pairingPath, { withFileTypes: true });
  const matched = entries.find(entry => entry.isDirectory() && entry.name.endsWith(jidSuffix));

  if (!matched) {
    return ctx.reply(`No paired device found for number ${inputNumber}`, { parse_mode: 'Markdown' });
  }

  const targetPath = `${pairingPath}/${matched.name}`;
  fs.rmSync(targetPath, { recursive: true, force: true });

  ctx.reply(
    `Paired user deleted successfully.\n\n*Phone:* \`${inputNumber}\`\n*ID:* \`${matched.name}\``,
    { parse_mode: 'Markdown' }
  );
});
bot.on('textffft', async (ctx) => {
    const userId = ctx.from.id;

    if (userStates[userId] === 'waiting_for_song') {
        const text = ctx.message.text;

        try {
            ctx.reply('🔒 looking for...');
            const search = await yts(text);
            const telaso = search.all[0].url;
            const response = await ytdl(telaso);
            const puki = response.data.mp3;

            await ctx.replyWithAudio({ url: puki }, {
                caption: `Title: ${search.all[0].title}\nDuration: ${search.all[0].timestamp}`,
            });
            ctx.reply('🔓 Selesai!');
        } catch (error) {
            console.error(error);
            ctx.reply('An error occurred while downloading the song, please try again later.');
        }

        delete userStates[userId];
    }
});

bot.launch()
    .then(() => console.log('The bot is running successfully'))
    .catch(err => console.error('Error while running bot:', err));

module.exports = bot;
