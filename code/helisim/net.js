// Browser half of the co-op bridge. Trystero owns rendezvous/WebRTC while the
// wasm side owns protocol state and frames waiting in its fixed outbox.
const STRATEGY = 'nostr'; // change to 'torrent' to use the committed spare
const strategyModule = import(`./trystero-${STRATEGY}.bundle.js`);

const APP_ID = 'helisim-coop-v1';
const NET_MAX_FRAME = 1400;
const ROOM_ALPHABET = '23456789abcdefghjkmnpqrstuvwxyz';

let started = false;
let pumpTimer = 0;
let pumpPtr = 0;
let activePeer = null;
let pendingPeer = null; // joined while the slot was taken — usually a reloaded
                        // peer whose zombie link hasn't timed out yet
let activeRoom = null;
let activeMod = null;

function mintRoom() {
  const out = [];
  const limit = 256 - (256 % ROOM_ALPHABET.length);
  while (out.length < 5) {
    const bytes = new Uint8Array(5);
    crypto.getRandomValues(bytes);
    for (const byte of bytes) {
      if (byte < limit) out.push(ROOM_ALPHABET[byte % ROOM_ALPHABET.length]);
      if (out.length === 5) break;
    }
  }
  return out.join('');
}

function hashRoom() {
  const room = new URLSearchParams(location.hash.slice(1)).get('room');
  if (!room) return null;
  const id = room.toLowerCase();
  return /^[a-z0-9]{5}$/.test(id) ? id : null;
}

function waitForRuntime() {
  return new Promise(resolve => {
    const poll = () => {
      const mod = window.Module;
      if (mod && typeof mod._net_reset === 'function') resolve(mod);
      else setTimeout(poll, 25);
    };
    poll();
  });
}

function asBytes(data) {
  if (data instanceof Uint8Array) return data;
  if (data instanceof ArrayBuffer) return new Uint8Array(data);
  if (ArrayBuffer.isView(data))
    return new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
  return null;
}

async function start(roomId, isHost) {
  if (started) return;
  started = true;

  const [mod, {joinRoom}] = await Promise.all([waitForRuntime(), strategyModule]);
  activeMod = mod;
  mod.ccall('net_reset', null, [], []);
  mod.ccall('net_set_room', null, ['string'], [roomId]);
  mod.ccall('netgame_set_creator', null, ['number'], [isHost ? 1 : 0]);
  mod.ccall('net_on_joining', null, [], []);

  const room = joinRoom({appId: APP_ID}, roomId);
  activeRoom = room;
  const [sendFrame, receiveFrame] = room.makeAction('f');

  receiveFrame((data, peerId) => {
    if (peerId !== activePeer) return;
    const bytes = asBytes(data);
    if (!bytes || bytes.byteLength > NET_MAX_FRAME) return;
    mod.ccall('net_on_msg', null, ['array', 'number'], [bytes, bytes.byteLength]);
  });

  room.onPeerJoin(peerId => {
    // Strictly two-player, but a reload races: the new page's join often
    // arrives before the old page's zombie link times out. Park it and
    // promote when the stale peer finally leaves.
    if (activePeer !== null) { pendingPeer = peerId; return; }
    activePeer = peerId;
    mod.ccall('net_on_joining', null, [], []);
    mod.ccall('net_on_open', null, ['number'], [isHost ? 1 : 0]);
  });

  room.onPeerLeave(peerId => {
    if (peerId === pendingPeer) { pendingPeer = null; return; }
    if (peerId !== activePeer) return;
    activePeer = null;
    mod.ccall('net_on_close', null, [], []);
    if (pendingPeer !== null) {
      activePeer = pendingPeer;
      pendingPeer = null;
      mod.ccall('net_on_joining', null, [], []);
      mod.ccall('net_on_open', null, ['number'], [isHost ? 1 : 0]);
    }
  });

  pumpPtr = mod._malloc(NET_MAX_FRAME);
  pumpTimer = setInterval(() => {
    if (activePeer === null) return;
    for (;;) {
      const len = mod.ccall(
        'net_pump_outbox', 'number', ['number', 'number'],
        [pumpPtr, NET_MAX_FRAME]
      );
      if (len <= 0) break;
      const frame = mod.HEAPU8.slice(pumpPtr, pumpPtr + len);
      sendFrame(frame, activePeer);
    }
  }, 16);
}

window.hsNetHost = () => {
  if (started) return;
  const roomId = mintRoom();
  sessionStorage.setItem('hsHostRoom', roomId);
  location.hash = `room=${roomId}`;
  void start(roomId, true);
};

window.hsNetJoin = code => {
  if (started) return;
  const id = String(code).toLowerCase();
  if (!/^[a-z0-9]{5}$/.test(id)) return;
  location.hash = `room=${id}`;
  void start(id, false);
};

window.hsNetLeave = () => {
  const mod = activeMod || window.Module;
  if (activeRoom) activeRoom.leave();
  activeRoom = null;
  if (pumpTimer) clearInterval(pumpTimer);
  pumpTimer = 0;
  if (pumpPtr && mod) mod._free(pumpPtr);
  pumpPtr = 0;
  started = false;
  activePeer = null;
  pendingPeer = null;
  history.replaceState(null, '', `${location.pathname}${location.search}`);
  sessionStorage.removeItem('hsHostRoom');
  if (mod) {
    mod.ccall('netgame_set_creator', null, ['number'], [0]);
    mod.ccall('net_reset', null, [], []);
  }
  activeMod = null;
};

const linkedRoom = hashRoom();
if (linkedRoom)
  void start(linkedRoom, sessionStorage.getItem('hsHostRoom') === linkedRoom);
