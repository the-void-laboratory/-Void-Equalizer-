const fs = require('fs')

global.owner = "234" //owner number
global.footer = "☩ Equalizer ☩" //footer section
global.status = false //"self/public" section of the bot
global.prefa = ['','!','.',',','🐤','🗿']
global.owner = ['62']
global.xprefix = '.'
global.gambar = "https://files.catbox.moe/uj9ngg.png"
global.OWNER_NAME = "@certifiedloner_16" //
global.DEVELOPER = ["7828164131"] //
global.BOT_NAME = "☩ Equalizer ☩"
global.bankowner = "Void"
global.creatorName = "𝐕𝐎𝐈𝐃ᴥ 〔𝖧𝖨𝖬𝖲𝖤𝖫𝖥〕 亗"
global.ownernumber = '2347078612004'  //creator number
global.location = "Nigeria, Ibadan, oyo"
global.prefa = ['','!','.','#','&']
//================DO NOT CHANGE OR YOU'LL GET AN ERROR=============\
global.footer = "𝐕𝐎𝐈𝐃ᴥ 〔𝖧𝖨𝖬𝖲𝖤𝖫𝖥〕 亗" //footer section
global.link = "https://whatsapp.com/channel/0029Vb7tekFBlHpXQGMz0L2q"
global.autobio = true//auto update bio
global.botName = "☩ Equalizer ☩"
global.version = "𝙑1"
global.botname = "☩ Equalizer ☩"
global.author = "𝐕𝐎𝐈𝐃ᴥ 〔𝖧𝖨𝖬𝖲𝖤𝖫𝖥〕 亗"
global.themeemoji = '🚀'
global.wagc = 'https://chat.whatsapp.com/JztfFbiz8NR3Th9DcJm2h7'
global.thumbnail = 'https://files.catbox.moe/pdkau1.JPG'
global.packname = "sᴛɪᴄᴋᴇʀ ᴍᴀᴅᴇ ʙʏ 𝐕𝐎𝐈𝐃"
global.author = "\n\n\n\n\nCreate by Void\ntelegram : @certifiedloner_16"
global.creator = "2347078612004@s.whatsapp.net"
global.ownername = '𝐕𝐎𝐈𝐃ᴥ 〔𝖧𝖨𝖬𝖲𝖤𝖫𝖥〕 亗' 
global.onlyowner = `sᴏʀʀʏ ᴏɴʟʏ ᴏᴡɴᴇʀ ᴄᴀɴ ᴜsᴇ, ᴄᴏɴᴛᴀᴄᴛ 𝐕𝐎𝐈𝐃 ᴛᴏ ʙᴇ ᴀɴ ᴏᴡɴᴇʀ`
  // reply 
global.database = `ᴡᴀɴɴᴀ ʙᴇ ɪɴ ᴅᴀᴛᴀʙᴀsᴇ? ᴄᴏɴᴛᴀᴄᴛ 𝐕𝐎𝐈𝐃ᴥ 〔𝖧𝖨𝖬𝖲𝖤𝖫𝖥〕 亗`
  global.mess = {
wait: "_Wait Radiation_",
   success: "sᴜᴄᴄᴇss ☩ Equalizer ☩",
   on: "☩ Equalizer ☩ ɪs ᴀᴄᴛɪᴠᴇ", 
   prem: "FOR PREMIUM USERS ONLY ADD YOUR NUMBER TO DATABASE TO ACCESS PREMIUM", 
   off: "☩ Equalizer ☩ ɪs ᴏғғ",
   query: {
       text: "Where's the text?",
       link: "Where's the link, bro?",
   },
   error: {
       fitur: "Sorry bro, the feature has error. Please chat with the Bot Developer so it can be fixed immediately.",
   },
   only: {
       group: "Bro, this feature's locked to groups only, can't use it elsewhere, ya hear?",
       private: "Private chats only, fam! This feature's locked to private chat, can't use it in public chats, bro.",
       owner: "Sorry bro, Only my developer is the only one with access to this feature.",
       admin: "Admins only, fam! You're not an admin, so you can't use this feature.",
       badmin: "Bro, bot ain't admin here, that's why you're locked out of this feature, gotta give bot admin rights first",
       premium: "ᴛʜɪs ғᴇᴀᴛᴜʀᴇ ɪs ᴏɴʟʏ ᴀᴄᴄᴇssᴀʙʟᴇ ᴛᴏ ᴘʀᴇᴍɪᴜᴍ ᴜsᴇʀs, ᴅᴍ ᴅᴇᴠ 𝐕𝐎𝐈𝐃 ᴛᴏ ʜᴀᴠᴇ ᴀᴄᴄᴇss",
   }
}

global.hituet = 0
//false=disable and true=enable
global.autoRecording = true //auto recording
global.autoTyping = true //auto typing
global.autorecordtype = true //auto typing + recording
global.autoread = false //auto read messages
global.autobio = true //auto update bio
global.anti92 = true //auto block +92 
global.autoswview = true //auto view status/story

let file = require.resolve(__filename)
require('fs').watchFile(file, () => {
  require('fs').unwatchFile(file)
  console.log('\x1b[0;32m'+__filename+' \x1b[1;32mupdated!\x1b[0m')
  delete require.cache[file]
  require(file)
})
