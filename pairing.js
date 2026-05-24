const fs = require('fs');
const path = require('path');

const STATE_FILE = path.join(__dirname, 'pairing-state.json');
const PAIRING_TTL_MS = 5 * 60 * 1000;

const defaultState = () => ({
  activePairing: null,
  linkedSession: null
});

let state = loadState();

function loadState() {
  try {
    if (!fs.existsSync(STATE_FILE)) return defaultState();
    const parsed = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
    return {
      activePairing: parsed.activePairing || null,
      linkedSession: parsed.linkedSession || null
    };
  } catch {
    return defaultState();
  }
}

function saveState() {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function now() {
  return Date.now();
}

function isExpired(pairing) {
  return !pairing || (now() - pairing.createdAt) > PAIRING_TTL_MS;
}

function cleanupExpiredPairing() {
  if (state.activePairing && isExpired(state.activePairing)) {
    state.activePairing = null;
    saveState();
  }
}

function beginPairing({ userId, phone, code }) {
  cleanupExpiredPairing();

  state.activePairing = {
    userId,
    phone,
    code,
    status: 'pending',
    createdAt: now()
  };
  saveState();
  return state.activePairing;
}

function markLinked(connectionSnapshot) {
  if (!state.activePairing) return null;

  state.linkedSession = {
    userId: state.activePairing.userId,
    phone: state.activePairing.phone,
    code: state.activePairing.code,
    linkedAt: now(),
    connectionSnapshot: connectionSnapshot ?? null
  };
  state.activePairing = null;
  saveState();
  return state.linkedSession;
}

function clearPairing() {
  state.activePairing = null;
  state.linkedSession = null;
  saveState();
}

function clearPendingPairing() {
  if (state.activePairing) {
    state.activePairing = null;
    saveState();
  }
}

function markDisconnected() {
  if (state.linkedSession) {
    state.linkedSession = null;
    saveState();
  }
}

function getState() {
  cleanupExpiredPairing();
  return {
    activePairing: state.activePairing,
    linkedSession: state.linkedSession
  };
}

function getActivePairing() {
  cleanupExpiredPairing();
  return state.activePairing;
}

function getLinkedSession() {
  return state.linkedSession;
}

function hasLinkedSession() {
  return Boolean(state.linkedSession);
}

function isPairingOwnedBy(userId) {
  return state.activePairing?.userId === userId || state.linkedSession?.userId === userId;
}

function getRemainingPairingMs() {
  cleanupExpiredPairing();
  if (!state.activePairing) return 0;
  return Math.max(0, PAIRING_TTL_MS - (now() - state.activePairing.createdAt));
}

module.exports = {
  beginPairing,
  clearPairing,
  clearPendingPairing,
  getActivePairing,
  getLinkedSession,
  getRemainingPairingMs,
  getState,
  hasLinkedSession,
  isPairingOwnedBy,
  markDisconnected,
  markLinked
};
