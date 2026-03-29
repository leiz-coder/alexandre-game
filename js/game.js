// Ocelot Galaxy - Jeu de plateformes 2D - Phaser 3
const W = 800, H = 450;

// ==========================================
// SYSTÈME MUSICAL (Web Audio API)
// ==========================================
const Music = (() => {
  let ctx, master, timer = null;
  const Hz = {
    R:0,
    C3:130.81,D3:146.83,E3:164.81,F3:174.61,G3:196,A3:220,Bb3:233.08,B3:246.94,
    C4:261.63,D4:293.66,Eb4:311.13,E4:329.63,F4:349.23,G4:392,Ab4:415.3,A4:440,Bb4:466.16,B4:493.88,
    C5:523.25,D5:587.33,E5:659.25,F5:698.46,G5:783.99,A5:880,Bb5:932.33,B5:987.77,
    C6:1046.5,D6:1174.66
  };
  const TRACKS = {
    menu:{ bpm:152,
      melody:[[Hz.C5,.5],[Hz.E5,.5],[Hz.G5,.5],[Hz.C6,.5],[Hz.B5,.5],[Hz.G5,.5],[Hz.E5,.5],[Hz.C5,.5],
              [Hz.D5,.5],[Hz.F5,.5],[Hz.A5,.5],[Hz.D6,.5],[Hz.C6,.5],[Hz.A5,.5],[Hz.F5,.5],[Hz.D5,.5],
              [Hz.E5,1],[Hz.G5,.5],[Hz.A5,.5],[Hz.G5,.5],[Hz.E5,.5],[Hz.D5,.5],[Hz.C5,.5],
              [Hz.C5,.5],[Hz.E5,.5],[Hz.G5,1],[Hz.R,.5],[Hz.A5,.5],[Hz.G5,.5],[Hz.E5,.5],[Hz.C5,1]],
      bass:[[Hz.C3,1],[Hz.C3,1],[Hz.F3,1],[Hz.G3,1],[Hz.C3,1],[Hz.C3,1],[Hz.F3,1],[Hz.G3,1]]
    },
    level1:{ bpm:168,  // Mexique - tropical festif
      melody:[[Hz.E5,.5],[Hz.G5,.5],[Hz.A5,1],[Hz.G5,.5],[Hz.E5,.5],[Hz.D5,1],
              [Hz.E5,.5],[Hz.G5,.5],[Hz.A5,.5],[Hz.C6,.5],[Hz.B5,.5],[Hz.A5,.5],[Hz.G5,1],
              [Hz.D5,.5],[Hz.F5,.5],[Hz.G5,1],[Hz.F5,.5],[Hz.D5,.5],[Hz.C5,1],
              [Hz.D5,.5],[Hz.F5,.5],[Hz.G5,.5],[Hz.A5,.5],[Hz.G5,.5],[Hz.E5,.5],[Hz.D5,1]],
      bass:[[Hz.A3,1],[Hz.A3,1],[Hz.E3,1],[Hz.E3,1],[Hz.F3,1],[Hz.F3,1],[Hz.G3,1],[Hz.G3,1]]
    },
    level2:{ bpm:145,  // Tanzanie - pentatonique africaine
      melody:[[Hz.A4,.5],[Hz.C5,.5],[Hz.D5,1],[Hz.E5,.5],[Hz.G5,.5],[Hz.A5,1],
              [Hz.G5,.5],[Hz.E5,.5],[Hz.D5,1],[Hz.C5,.5],[Hz.A4,.5],[Hz.R,1],
              [Hz.D5,.5],[Hz.E5,.5],[Hz.G5,1],[Hz.A5,.5],[Hz.G5,.5],[Hz.E5,1],
              [Hz.D5,.5],[Hz.C5,.5],[Hz.A4,.5],[Hz.C5,.5],[Hz.D5,2]],
      bass:[[Hz.A3,2],[Hz.D3,2],[Hz.E3,2],[Hz.A3,2]]
    },
    level3:{ bpm:120,  // Ouganda - paisible, lac
      melody:[[Hz.C5,1],[Hz.E5,.5],[Hz.G5,.5],[Hz.A5,1],[Hz.G5,.5],[Hz.E5,.5],
              [Hz.F5,1],[Hz.E5,.5],[Hz.D5,.5],[Hz.C5,2],
              [Hz.D5,.5],[Hz.E5,.5],[Hz.G5,1],[Hz.A5,.5],[Hz.G5,.5],[Hz.F5,1],
              [Hz.E5,.5],[Hz.D5,.5],[Hz.C5,.5],[Hz.D5,.5],[Hz.E5,2]],
      bass:[[Hz.C3,2],[Hz.F3,2],[Hz.G3,2],[Hz.C3,2]]
    },
    level4:{ bpm:130,  // Soudan - mystérieux, phrygien
      melody:[[Hz.E5,1],[Hz.F5,.5],[Hz.E5,.5],[Hz.D5,1],[Hz.C5,1],
              [Hz.D5,.5],[Hz.E5,.5],[Hz.F5,.5],[Hz.G5,.5],[Hz.F5,1],[Hz.E5,1],
              [Hz.A5,.5],[Hz.G5,.5],[Hz.F5,.5],[Hz.E5,.5],[Hz.D5,1],[Hz.C5,1],
              [Hz.E5,.5],[Hz.F5,.5],[Hz.E5,.5],[Hz.D5,.5],[Hz.E5,2]],
      bass:[[Hz.E3,2],[Hz.C3,2],[Hz.D3,2],[Hz.E3,2]]
    },
    level5:{ bpm:155,  // Etna - dramatique, mineur
      melody:[[Hz.A4,.5],[Hz.R,.5],[Hz.A4,.5],[Hz.C5,.5],[Hz.E5,1],[Hz.D5,1],
              [Hz.C5,.5],[Hz.R,.5],[Hz.C5,.5],[Hz.E5,.5],[Hz.G5,1],[Hz.F5,1],
              [Hz.E5,.5],[Hz.D5,.5],[Hz.C5,.5],[Hz.B4,.5],[Hz.A4,2],
              [Hz.B4,.5],[Hz.C5,.5],[Hz.D5,.5],[Hz.E5,.5],[Hz.A5,2]],
      bass:[[Hz.A3,1],[Hz.A3,1],[Hz.E3,1],[Hz.E3,1],[Hz.C3,2],[Hz.E3,2]]
    },
    level6:{ bpm:108,  // Forêt brûlée - mélancolique
      melody:[[Hz.A4,1],[Hz.C5,.5],[Hz.B4,.5],[Hz.A4,1],[Hz.G4,1],
              [Hz.F4,1],[Hz.G4,.5],[Hz.A4,.5],[Hz.E4,2],
              [Hz.C5,1],[Hz.B4,.5],[Hz.A4,.5],[Hz.G4,1],[Hz.F4,1],
              [Hz.E4,.5],[Hz.F4,.5],[Hz.G4,.5],[Hz.A4,.5],[Hz.A4,2]],
      bass:[[Hz.A3,2],[Hz.F3,2],[Hz.C3,2],[Hz.E3,2]]
    },
    level7:{ bpm:125,  // Koh Phi Phi - relaxant
      melody:[[Hz.G5,1],[Hz.A5,.5],[Hz.G5,.5],[Hz.E5,1],[Hz.D5,1],
              [Hz.E5,.5],[Hz.G5,.5],[Hz.A5,1],[Hz.B5,2],
              [Hz.A5,.5],[Hz.G5,.5],[Hz.E5,.5],[Hz.D5,.5],[Hz.G5,1],[Hz.E5,1],
              [Hz.D5,.5],[Hz.E5,.5],[Hz.G5,.5],[Hz.A5,.5],[Hz.G5,2]],
      bass:[[Hz.G3,2],[Hz.C3,2],[Hz.D3,2],[Hz.G3,2]]
    },
    level8:{ bpm:170,  // Sydney - joyeux, dynamique
      melody:[[Hz.C5,.5],[Hz.D5,.5],[Hz.E5,.5],[Hz.G5,.5],[Hz.E5,.5],[Hz.D5,.5],[Hz.C5,1],
              [Hz.D5,.5],[Hz.E5,.5],[Hz.F5,.5],[Hz.A5,.5],[Hz.G5,.5],[Hz.F5,.5],[Hz.E5,1],
              [Hz.G5,.5],[Hz.A5,.5],[Hz.B5,.5],[Hz.C6,.5],[Hz.B5,.5],[Hz.A5,.5],[Hz.G5,1],
              [Hz.A5,.5],[Hz.G5,.5],[Hz.E5,.5],[Hz.C5,.5],[Hz.D5,.5],[Hz.E5,.5],[Hz.C5,1]],
      bass:[[Hz.C3,1],[Hz.G3,1],[Hz.F3,1],[Hz.G3,1],[Hz.C3,1],[Hz.G3,1],[Hz.A3,1],[Hz.G3,1]]
    },
    gameover:{ bpm:90,
      melody:[[Hz.C5,.5],[Hz.B4,.5],[Hz.Bb4,.5],[Hz.A4,.5],
              [Hz.Ab4,1],[Hz.G4,1],[Hz.R,.5],[Hz.E4,.5],[Hz.G4,.5],[Hz.E4,.5],[Hz.C4,2]]
    },
    win:{ bpm:140,
      melody:[[Hz.C5,.5],[Hz.E5,.5],[Hz.G5,.5],[Hz.C6,1],[Hz.G5,.5],[Hz.E5,.5],[Hz.G5,.5],[Hz.C6,2],
              [Hz.E5,.5],[Hz.G5,.5],[Hz.A5,.5],[Hz.C6,1],[Hz.A5,.5],[Hz.G5,.5],[Hz.E5,.5],[Hz.C5,2]]
    }
  };

  function init() {
    if (ctx) return;
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain(); master.gain.value = 0.1;
      master.connect(ctx.destination);
    } catch(e) {}
  }

  function playNote(freq, t, dur, type, vol) {
    if (!ctx || freq <= 0) return;
    const osc = ctx.createOscillator(), g = ctx.createGain();
    osc.type = type; osc.frequency.value = freq;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.01);
    g.gain.setValueAtTime(vol * 0.8, t + dur * 0.6);
    g.gain.linearRampToValueAtTime(0, t + dur);
    osc.connect(g); g.connect(master);
    osc.start(t); osc.stop(t + dur + 0.02);
  }

  function schedule(track, at) {
    const b = 60 / track.bpm; let t = at;
    track.melody.forEach(([f, beats]) => { playNote(f, t, beats*b*0.88, 'square', 0.55); t += beats*b; });
    const dur = t - at;
    if (track.bass) { t = at; track.bass.forEach(([f, beats]) => { playNote(f, t, beats*b*0.75, 'triangle', 0.32); t += beats*b; }); }
    return dur;
  }

  return {
    init,
    play(name, loop=true) {
      if (timer) { clearTimeout(timer); timer = null; }
      if (!ctx) init(); if (!ctx) return;
      if (ctx.state === 'suspended') ctx.resume();
      const track = TRACKS[name]; if (!track) return;
      const go = (at) => {
        const dur = schedule(track, at);
        if (loop) timer = setTimeout(() => go(at + dur), Math.max(10, (dur-0.3)*1000));
      };
      go(ctx.currentTime + 0.05);
    },
    stop() { if (timer) { clearTimeout(timer); timer = null; } }
  };
})();

// Metadata par niveau
const LEVELS = [
  null,
  { name:'Forêt Tropicale · Mexique',  tile:'ground',    musicKey:'level1' },
  { name:'Savane · Tanzanie',           tile:'dirt',      musicKey:'level2' },
  { name:'Lac Victoria · Ouganda',      tile:'stone',     musicKey:'level3' },
  { name:'Désert du Soudan',            tile:'sandstone', musicKey:'level4' },
  { name:'Volcan Etna · Sicile',        tile:'lava_rock', musicKey:'level5' },
  { name:'Forêt Brûlée · France',       tile:'ash',       musicKey:'level6' },
  { name:'Koh Phi Phi · Thaïlande',     tile:'sand',      musicKey:'level7' },
  { name:'Sydney · Australie',          tile:'pavement',  musicKey:'level8' },
];

// ==========================================
// BOOT
// ==========================================
class BootScene extends Phaser.Scene {
  constructor() { super('Boot'); }
  create() {
    const g = this.make.graphics({ add: false });

    // ---- Ocelot (Rayman style) ----
    const OC = { fur:0xe89420, dark:0xb05010, pale:0xffd870, out:0x180800, eyeG:0x22cc44, shoe:0x5533ee, shoeH:0x8866ff, pink:0xffaaaa };
    g.fillStyle(OC.out);
    g.fillTriangle(3,17,10,2,17,17); g.fillTriangle(15,17,22,2,29,17);
    g.fillCircle(16,16,13); g.fillEllipse(16,34,24,28);
    g.fillCircle(2,28,6); g.fillCircle(30,28,6);
    g.fillRect(8,41,7,9); g.fillRect(17,41,7,9);
    g.fillEllipse(11,48,15,8); g.fillEllipse(21,48,15,8);
    g.fillStyle(OC.fur); g.fillTriangle(5,16,11,4,16,16); g.fillTriangle(16,16,21,4,27,16);
    g.fillStyle(OC.pink); g.fillTriangle(7,15,11,7,14,15); g.fillTriangle(18,15,21,7,25,15);
    g.fillStyle(OC.fur); g.fillCircle(16,16,12);
    g.fillStyle(OC.pale); g.fillEllipse(16,19,15,12);
    g.fillStyle(OC.dark); g.fillEllipse(8,10,6,7); g.fillEllipse(24,10,6,7);
    g.fillStyle(0xffffff); g.fillCircle(11,14,4); g.fillCircle(21,14,4);
    g.fillStyle(OC.eyeG); g.fillCircle(11,14,3); g.fillCircle(21,14,3);
    g.fillStyle(0x000000); g.fillCircle(11,14,2); g.fillCircle(21,14,2);
    g.fillStyle(0xffffff); g.fillCircle(12,13,1); g.fillCircle(22,13,1);
    g.fillStyle(OC.out); g.fillEllipse(16,20,6,4);
    g.fillStyle(OC.pink); g.fillEllipse(16,20,5,3);
    g.fillStyle(0xffffff); g.fillRect(2,20,8,1); g.fillRect(22,20,8,1);
    g.fillStyle(OC.fur); g.fillEllipse(16,34,22,26);
    g.fillStyle(OC.pale); g.fillEllipse(16,36,12,18);
    g.fillStyle(OC.dark); g.fillEllipse(7,29,5,7); g.fillEllipse(25,29,5,7); g.fillEllipse(8,37,4,6); g.fillEllipse(24,37,4,6);
    g.fillStyle(OC.fur); g.fillCircle(2,28,5); g.fillCircle(30,28,5);
    g.fillStyle(OC.pale); g.fillCircle(1,30,3); g.fillCircle(31,30,3);
    g.fillStyle(OC.fur); g.fillRect(9,42,5,7); g.fillRect(18,42,5,7);
    g.fillStyle(OC.shoe); g.fillEllipse(11,47,12,7); g.fillEllipse(21,47,12,7);
    g.fillStyle(OC.shoeH); g.fillEllipse(10,45,6,3); g.fillEllipse(20,45,6,3);
    g.generateTexture('player',32,48);

    // ---- ground (Mexique) ----
    g.clear();
    g.fillStyle(0x1a4400); g.fillRect(0,0,32,32);
    g.fillStyle(0x5fd45f); g.fillRect(0,0,32,12);
    g.fillStyle(0x88ee66); g.fillRect(0,0,32,4);
    g.fillStyle(0x44bb44); g.fillRect(0,4,32,2);
    g.fillStyle(0x9b6a3c); g.fillRect(0,12,32,20);
    g.fillStyle(0x7a5230); g.fillRect(2,16,28,2); g.fillRect(2,22,28,2); g.fillRect(2,27,28,2);
    g.fillStyle(0xaaaaaa); g.fillCircle(8,20,2); g.fillCircle(22,26,2);
    g.generateTexture('ground',32,32);

    // ---- dirt (Tanzanie) ----
    g.clear();
    g.fillStyle(0x5a2800); g.fillRect(0,0,32,32);
    g.fillStyle(0xc87a3a); g.fillRect(1,1,30,10);
    g.fillStyle(0xe0964a); g.fillRect(1,1,30,6);
    g.fillStyle(0xaa6030); g.fillRect(1,11,30,20);
    g.fillStyle(0x8a4820); g.fillRect(2,15,28,2); g.fillRect(2,21,28,2); g.fillRect(2,27,28,2);
    g.generateTexture('dirt',32,32);

    // ---- stone (Ouganda) ----
    g.clear();
    g.fillStyle(0x222233); g.fillRect(0,0,32,32);
    g.fillStyle(0x778899); g.fillRect(1,1,30,30);
    g.fillStyle(0x99aabb); g.fillRect(1,1,30,8);
    g.fillStyle(0x556677); g.fillRect(2,10,28,2); g.fillRect(2,18,28,2); g.fillRect(2,25,28,2);
    g.fillStyle(0xaabbcc); g.fillCircle(8,5,3); g.fillCircle(22,5,3);
    g.generateTexture('stone',32,32);

    // ---- sandstone (Soudan) ----
    g.clear();
    g.fillStyle(0x7a5010); g.fillRect(0,0,32,32);
    g.fillStyle(0xe8c060); g.fillRect(1,1,30,30);
    g.fillStyle(0xf0d080); g.fillRect(1,1,30,8);
    g.fillStyle(0xc8a040); g.fillRect(2,10,28,2); g.fillRect(2,18,28,2); g.fillRect(2,25,28,2);
    g.generateTexture('sandstone',32,32);

    // ---- lava_rock (Etna) ----
    g.clear();
    g.fillStyle(0x110000); g.fillRect(0,0,32,32);
    g.fillStyle(0x3a1a1a); g.fillRect(1,1,30,30);
    g.fillStyle(0xff4400); g.fillRect(1,1,30,4);
    g.fillStyle(0xcc2200); g.fillRect(1,1,14,4);
    g.fillStyle(0x2a1010); g.fillRect(2,6,28,2); g.fillRect(2,14,28,2); g.fillRect(2,22,28,2);
    g.fillStyle(0xff6600); g.fillCircle(8,3,2); g.fillCircle(22,3,2);
    g.generateTexture('lava_rock',32,32);

    // ---- ash (France brûlée) ----
    g.clear();
    g.fillStyle(0x111111); g.fillRect(0,0,32,32);
    g.fillStyle(0x404040); g.fillRect(1,1,30,12);
    g.fillStyle(0x606060); g.fillRect(1,1,30,5);
    g.fillStyle(0x2a2a2a); g.fillRect(1,13,30,18);
    g.fillStyle(0x333333); g.fillRect(2,16,28,2); g.fillRect(2,22,28,2); g.fillRect(2,27,28,2);
    g.fillStyle(0xff4400,0.6); g.fillCircle(10,3,2); g.fillCircle(24,3,2);
    g.generateTexture('ash',32,32);

    // ---- sand (Koh Phi Phi) ----
    g.clear();
    g.fillStyle(0xaa8820); g.fillRect(0,0,32,32);
    g.fillStyle(0xf0e060); g.fillRect(1,1,30,10);
    g.fillStyle(0xfff080); g.fillRect(1,1,30,4);
    g.fillStyle(0xd0c040); g.fillRect(1,11,30,20);
    g.fillStyle(0xb8a030); g.fillRect(2,14,28,2); g.fillRect(2,20,28,2); g.fillRect(2,26,28,2);
    g.fillStyle(0xffffff,0.5); g.fillCircle(8,3,2); g.fillCircle(20,3,2);
    g.generateTexture('sand',32,32);

    // ---- pavement (Sydney) ----
    g.clear();
    g.fillStyle(0x223344); g.fillRect(0,0,32,32);
    g.fillStyle(0x8898aa); g.fillRect(1,1,30,30);
    g.fillStyle(0xaabbc0); g.fillRect(1,1,30,8);
    g.fillStyle(0x6678888); g.fillRect(2,10,28,2); g.fillRect(2,18,28,2); g.fillRect(16,1,2,30);
    g.generateTexture('pavement',32,32);

    // ---- enemy ----
    g.clear();
    g.fillStyle(0x111122); g.fillRect(5,0,22,48);
    g.fillStyle(0xddddff); g.fillRect(6,1,20,8);
    g.fillStyle(0x4455cc); g.fillRect(6,6,20,4);
    g.fillStyle(0xffd090); g.fillRect(8,9,16,12);
    g.fillStyle(0x000000); g.fillRect(9,10,5,2); g.fillRect(18,10,5,2); g.fillRect(9,12,5,3); g.fillRect(18,12,5,3);
    g.fillStyle(0xff3333); g.fillRect(10,13,3,2); g.fillRect(19,13,3,2);
    g.fillStyle(0x000000); g.fillRect(10,18,12,2); g.fillRect(10,16,2,2); g.fillRect(20,16,2,2);
    g.fillStyle(0xffffff); g.fillRect(7,22,18,14);
    g.fillStyle(0x3355aa); g.fillRect(7,22,18,6);
    g.fillStyle(0xffdd00); g.fillCircle(16,32,2);
    g.fillStyle(0xffd090); g.fillRect(2,22,5,10); g.fillRect(25,22,5,10);
    g.fillStyle(0x3355aa); g.fillRect(8,37,6,10); g.fillRect(18,37,6,10);
    g.fillStyle(0x222233); g.fillEllipse(11,47,12,6); g.fillEllipse(21,47,12,6);
    g.generateTexture('enemy',32,48);

    // ---- fruits ----
    const fC=[0xee4444,0xcc44cc,0xf0a030,0x44bbee,0x44cc44];
    const fD=[0xaa1111,0x881188,0xb06010,0x1188aa,0x228822];
    fC.forEach((col,i)=>{
      g.clear();
      g.fillStyle(0x111111); g.fillEllipse(14,16,26,28);
      g.fillStyle(col); g.fillEllipse(14,16,24,26);
      g.fillStyle(fD[i]); g.fillEllipse(16,20,14,14);
      g.fillStyle(0xffffff); g.fillEllipse(8,9,8,12); g.fillEllipse(7,8,4,6);
      g.fillStyle(0x115500); g.fillRect(12,0,4,7);
      g.fillStyle(0x228822); g.fillRect(13,0,2,6);
      g.generateTexture('fruit'+i,28,30);
    });

    // ---- flag ----
    g.clear();
    g.fillStyle(0x3a1f0a); g.fillRect(12,0,6,80);
    g.fillStyle(0x6b3a1f); g.fillRect(13,0,4,80);
    g.fillStyle(0x111111); g.fillRect(17,4,30,20);
    g.fillStyle(0xee2222); g.fillRect(18,5,28,18);
    g.fillStyle(0xffffff); g.fillCircle(32,14,7);
    g.fillStyle(0xee2222); g.fillCircle(32,14,5);
    g.generateTexture('flag',50,80);

    // ---- heart ----
    g.clear();
    g.fillStyle(0x880000); g.fillCircle(7,7,7); g.fillCircle(13,7,7); g.fillTriangle(0,8,20,8,10,20);
    g.fillStyle(0xee1111); g.fillCircle(7,7,6); g.fillCircle(13,7,6); g.fillTriangle(1,9,19,9,10,19);
    g.fillStyle(0xff8888); g.fillCircle(6,5,2);
    g.generateTexture('heart',20,20);

    // ---- cloud ----
    g.clear();
    g.fillStyle(0xbbbbcc); g.fillCircle(25,28,18); g.fillCircle(45,22,22); g.fillCircle(68,28,18); g.fillRect(18,28,60,18);
    g.fillStyle(0xeeeeff); g.fillCircle(25,25,18); g.fillCircle(45,19,22); g.fillCircle(68,25,18); g.fillRect(18,25,60,18);
    g.fillStyle(0xffffff); g.fillCircle(25,23,17); g.fillCircle(45,17,21); g.fillCircle(68,23,17); g.fillRect(18,23,60,15);
    g.generateTexture('cloud',90,46);

    // ---- tree (tropical) ----
    g.clear();
    g.fillStyle(0x3a1a08); g.fillRect(13,38,14,30);
    g.fillStyle(0x7a4820); g.fillRect(15,38,10,30);
    g.fillStyle(0x1a5a10); g.fillTriangle(0,46,20,4,40,46);
    g.fillStyle(0x2a7a20); g.fillTriangle(2,44,20,6,38,44);
    g.fillStyle(0x3a9a30); g.fillTriangle(5,40,20,10,35,40);
    g.fillStyle(0x60cc50); g.fillTriangle(12,32,20,10,24,28);
    g.generateTexture('tree',40,68);

    // ---- bush ----
    g.clear();
    g.fillStyle(0x1a5a10); g.fillCircle(12,18,13); g.fillCircle(24,18,13); g.fillCircle(18,11,14);
    g.fillStyle(0x2a7a20); g.fillCircle(12,16,11); g.fillCircle(24,16,11); g.fillCircle(18,9,13);
    g.fillStyle(0x3a9a30); g.fillCircle(12,14,9); g.fillCircle(24,14,9); g.fillCircle(18,8,10);
    g.fillStyle(0x60cc50); g.fillCircle(11,12,5); g.fillCircle(25,12,5); g.fillCircle(18,6,6);
    g.generateTexture('bush',36,30);

    // ---- acacia (Tanzanie) ----
    g.clear();
    g.fillStyle(0x5a3010); g.fillRect(17,28,6,40); g.fillStyle(0x8a5030); g.fillRect(18,28,4,40);
    g.fillStyle(0x1a5a10); g.fillRect(0,20,60,16);
    g.fillStyle(0x2a7a20); g.fillRect(2,18,56,14);
    g.fillStyle(0x3a9a30); g.fillRect(4,16,52,12);
    g.fillStyle(0x60bb50); g.fillRect(6,14,48,6);
    g.generateTexture('acacia',60,68);

    // ---- palm (Koh Phi Phi) ----
    g.clear();
    g.fillStyle(0x8a6040); g.fillRect(17,14,6,54); g.fillStyle(0xaa8060); g.fillRect(18,14,4,54);
    g.fillStyle(0x1a7a20); g.fillEllipse(20,4,44,12); g.fillEllipse(34,10,36,10); g.fillEllipse(6,10,36,10);
    g.fillStyle(0x2a9a30); g.fillEllipse(20,2,38,10); g.fillEllipse(32,8,32,8); g.fillEllipse(8,8,32,8);
    g.fillStyle(0x50cc50); g.fillEllipse(20,0,20,8);
    g.generateTexture('palm',40,68);

    // ---- cactus (Soudan) ----
    g.clear();
    g.fillStyle(0x115510); g.fillRect(14,8,12,60);
    g.fillStyle(0x1a7a20); g.fillRect(15,8,8,60);
    g.fillStyle(0x115510); g.fillRect(0,22,14,8); g.fillRect(26,18,14,8);
    g.fillStyle(0x1a7a20); g.fillRect(2,22,10,8); g.fillRect(28,18,10,8);
    g.fillStyle(0x115510); g.fillRect(0,10,12,14); g.fillRect(28,6,12,14);
    g.fillStyle(0x1a7a20); g.fillRect(2,10,8,14); g.fillRect(30,6,8,14);
    g.fillStyle(0xffffaa); g.fillRect(12,16,2,3); g.fillRect(26,14,2,3);
    g.generateTexture('cactus',40,68);

    // ---- burnt_tree (France) ----
    g.clear();
    g.fillStyle(0x1a1a1a); g.fillRect(15,16,10,52);
    g.fillStyle(0x2a2a2a); g.fillRect(0,24,18,5); g.fillRect(22,18,18,5);
    g.fillStyle(0x2a2a2a); g.fillRect(2,16,12,10); g.fillRect(26,10,12,10);
    g.fillStyle(0x111111); g.fillRect(3,10,8,8); g.fillRect(29,6,8,8);
    g.fillStyle(0xff4400); g.fillEllipse(20,66,18,8);
    g.generateTexture('burnt_tree',40,68);

    // ---- particles ----
    [['particle',0xffdd00],['p_red',0xff4444],['p_blue',0x44aaff],['p_green',0x44ee44],['p_white',0xffffff]].forEach(([k,c])=>{
      g.clear(); g.fillStyle(c); g.fillCircle(5,5,5); g.generateTexture(k,10,10);
    });

    g.destroy();
    this.scene.start('Intro');
  }
}

// ==========================================
// INTRO
// ==========================================
class IntroScene extends Phaser.Scene {
  constructor() { super('Intro'); }
  create() {
    this.cameras.main.setBackgroundColor(0x000010);
    this.cameras.main.fadeIn(800,0,0,16);
    let musicStarted = false;
    const goToMenu = () => {
      if (!musicStarted) { musicStarted = true; Music.play('menu'); }
      this.cameras.main.fadeOut(600,0,0,0);
      this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('Menu'));
    };

    // Étoiles
    for (let i = 0; i < 70; i++) {
      const s = this.add.circle(
        Phaser.Math.Between(20, W-20), Phaser.Math.Between(20, H-80),
        Phaser.Math.FloatBetween(0.4,2), [0xffffff,0xaaddff,0xffddaa][Phaser.Math.Between(0,2)]
      ).setAlpha(0);
      this.tweens.add({ targets:s, alpha:Phaser.Math.FloatBetween(0.4,1), delay:i*25, duration:200 });
    }

    // Planète
    const planet = this.add.circle(W*0.72, H*0.32, 52, 0xb05010).setAlpha(0);
    const planetH = this.add.circle(W*0.72, H*0.32, 44, 0xe89420).setAlpha(0);
    const planetS = this.add.circle(W*0.66, H*0.28, 20, 0xf0c060).setAlpha(0);
    this.time.delayedCall(700, () => {
      [planet, planetH, planetS].forEach(p => this.tweens.add({ targets:p, alpha:1, duration:600 }));
    });

    // Ocelot qui court
    this.time.delayedCall(1400, () => {
      const hero = this.add.image(-40, H*0.68, 'player').setScale(2.2).setFlipX(false);
      this.tweens.add({ targets:hero, x: W+50, duration:1600, ease:'Power1',
        onUpdate: (tw) => { hero.y = H*0.68 + Math.sin(tw.progress * Math.PI * 6) * 12; }
      });
    });

    // Titre
    this.time.delayedCall(2200, () => {
      const title = this.add.text(W/2, H/2 - 15, 'OCELOT GALAXY', {
        fontSize:'60px', fontFamily:'Arial Black, Arial',
        color:'#ffdd00', stroke:'#000000', strokeThickness:8
      }).setOrigin(0.5).setScale(0.1).setAlpha(0);
      this.tweens.add({ targets:title, scaleX:1, scaleY:1, alpha:1, duration:700, ease:'Back.easeOut' });

      this.time.delayedCall(400, () => {
        const sub = this.add.text(W/2, H/2+48, "L'Aventure Galactique", {
          fontSize:'22px', fontFamily:'Arial', color:'#aaddff', stroke:'#000', strokeThickness:3
        }).setOrigin(0.5).setAlpha(0);
        this.tweens.add({ targets:sub, alpha:1, duration:600 });

        this.time.delayedCall(400, () => {
          const hint = this.add.text(W/2, H-30, 'Appuie sur ESPACE pour commencer', {
            fontSize:'14px', fontFamily:'Arial', color:'#888888'
          }).setOrigin(0.5);
          this.tweens.add({ targets:hint, alpha:0.3, duration:600, yoyo:true, repeat:-1 });
        });
      });

      // Auto-proceed après 4.5s
      this.time.delayedCall(4500, goToMenu);
      this.input.keyboard.once('keydown-SPACE', goToMenu);
      this.input.once('pointerdown', goToMenu);
    });
  }
}

// ==========================================
// MENU
// ==========================================
class MenuScene extends Phaser.Scene {
  constructor() { super('Menu'); }
  create() {
    Music.play('menu');
    this.add.rectangle(0,0,W,H,0x87ceeb).setOrigin(0);
    this.add.rectangle(0,H*0.75,W,H*0.25,0x1a6ea8).setOrigin(0);
    [100,300,540,710].forEach((x,i)=>{ this.add.image(x,55+i*12,'cloud').setAlpha(0.9); });

    this.add.text(W/2,75,'OCELOT GALAXY',{
      fontSize:'58px', fontFamily:'Arial Black, Arial', color:'#ffdd00', stroke:'#8b0000', strokeThickness:7
    }).setOrigin(0.5);
    this.add.text(W/2,145,"L'Aventure Galactique",{
      fontSize:'24px', fontFamily:'Arial', color:'#ffffff', stroke:'#000000', strokeThickness:4
    }).setOrigin(0.5);

    const hero = this.add.image(W/2,265,'player').setScale(2.5);
    this.tweens.add({ targets:hero, y:253, duration:700, yoyo:true, repeat:-1, ease:'Sine.easeInOut' });

    const btn = this.add.text(W/2,355,'  ▶  JOUER  ◀  ',{
      fontSize:'30px', fontFamily:'Arial Black, Arial', color:'#ffffff', stroke:'#000000', strokeThickness:4,
      backgroundColor:'#cc2200', padding:{x:20,y:12}
    }).setOrigin(0.5).setInteractive({useHandCursor:true});
    btn.on('pointerover',()=>btn.setStyle({color:'#ffdd00'}));
    btn.on('pointerout', ()=>btn.setStyle({color:'#ffffff'}));
    btn.on('pointerdown',()=>this.scene.start('Game',{level:1,lives:3,score:0}));

    this.add.text(W/2,420,'← → bouger   |   ↑ ou ESPACE sauter  (double saut !)',{
      fontSize:'13px', fontFamily:'Arial', color:'#ffffff', stroke:'#000000', strokeThickness:2
    }).setOrigin(0.5);
    this.input.keyboard.once('keydown-SPACE',()=>this.scene.start('Game',{level:1,lives:3,score:0}));
  }
}

// ==========================================
// GAME
// ==========================================
class GameScene extends Phaser.Scene {
  constructor() { super('Game'); }
  init(data) {
    this.currentLevel = data.level || 1;
    this.lives = data.lives !== undefined ? data.lives : 3;
    this.score = data.score || 0;
    this.isDead = false; this.fruitsCollected = 0; this.totalFruits = 0; this.jumpCount = 0;
  }

  create() {
    const WORLD_W = 3200;
    Music.play(LEVELS[this.currentLevel].musicKey);
    // Difficulté progressive : gravité augmente par niveau
    const gravities = [null, 580, 610, 640, 670, 700, 730, 760, 800];
    this.levelGravity = gravities[this.currentLevel];
    // Vitesse de saut ajustée pour compenser la gravité plus forte
    const jumps     = [null, -495, -510, -525, -540, -558, -574, -592, -615];
    this.jumpVel = jumps[this.currentLevel];
    this.physics.world.gravity.y = this.levelGravity;
    this.physics.world.setBounds(0,0,WORLD_W,H+100);
    this.createBackground(WORLD_W);
    this.platforms = this.physics.add.staticGroup();
    this.enemies = this.physics.add.group();
    this.fruits = this.physics.add.staticGroup();

    const builders = [null,
      ()=>this.buildLevel1(), ()=>this.buildLevel2(), ()=>this.buildLevel3(), ()=>this.buildLevel4(),
      ()=>this.buildLevel5(), ()=>this.buildLevel6(), ()=>this.buildLevel7(), ()=>this.buildLevel8()
    ];
    builders[this.currentLevel]();

    this.createPlayer(); this.createFlag(WORLD_W); this.createUI();
    this.cameras.main.setBounds(0,0,WORLD_W,H);
    this.cameras.main.startFollow(this.player,true,0.1,0.1);
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.time.addEvent({ delay:50, loop:true, callback:()=>{
      const t = this.time.now/1000;
      this.fruits.getChildren().forEach((f,i)=>{ if(f.active) f.y = f.getData('baseY')+Math.sin(t*2+i)*5; });
    }});
  }

  // ---- BACKGROUNDS ----
  createBackground(worldW) {
    const lvl = this.currentLevel;

    if (lvl === 1) { // Mexique - forêt tropicale
      this.add.rectangle(0,0,worldW,H*0.6,0x4ab8f0).setOrigin(0).setScrollFactor(0);
      this.add.rectangle(0,H*0.6,worldW,H*0.4,0x87ceeb).setOrigin(0).setScrollFactor(0);
      this.add.rectangle(0,H-52,worldW,52,0x1a7a3a).setOrigin(0);
      this.add.circle(680,65,42,0xffdd44).setScrollFactor(0.04);
      this.add.circle(680,65,34,0xffee88).setScrollFactor(0.04);
      for(let i=0;i<7;i++){ this.add.circle(i*180+60,H-50,140,0x3a9a28).setScrollFactor(0.12); this.add.circle(i*180+140,H-50,110,0x44aa30).setScrollFactor(0.12); }
      for(let i=0;i<10;i++) this.add.circle(i*160+40,H-50,90,0x2a8820).setScrollFactor(0.28);
      for(let i=0;i<12;i++) this.add.image(i*110+30,46+(i%4)*20,'cloud').setScrollFactor(0.18).setAlpha(0.88);
      for(let i=0;i<16;i++) this.add.image(i*105+20,H-66,'tree').setScrollFactor(0.32).setScale(0.85+(i%3)*0.1);
      for(let i=0;i<22;i++) this.add.image(i*95+10,H-50,'bush').setScrollFactor(0.48);

    } else if (lvl === 2) { // Tanzanie - savane
      this.add.rectangle(0,0,worldW,H*0.55,0xe87a10).setOrigin(0).setScrollFactor(0);
      this.add.rectangle(0,H*0.55,worldW,H*0.25,0xf0a040).setOrigin(0).setScrollFactor(0);
      this.add.rectangle(0,H*0.8,worldW,H*0.2,0xc8882a).setOrigin(0).setScrollFactor(0);
      this.add.rectangle(0,H-52,worldW,52,0xaa6620).setOrigin(0);
      this.add.circle(700,70,50,0xff8800).setScrollFactor(0.04);
      this.add.circle(700,70,42,0xffaa00).setScrollFactor(0.04);
      // Kilimanjaro silhouette
      const bg = this.add.graphics().setScrollFactor(0.08);
      bg.fillStyle(0x886644); bg.fillTriangle(500,H-52,700,H-180,900,H-52);
      bg.fillStyle(0xffffff); bg.fillTriangle(620,H-170,700,H-180,780,H-170); // neige
      for(let i=0;i<8;i++) this.add.circle(i*180+60,H-50,80,0xbb8833).setScrollFactor(0.18);
      for(let i=0;i<14;i++) this.add.image(i*115+20,H-68,'acacia').setScrollFactor(0.35).setScale(0.9+(i%3)*0.12);
      for(let i=0;i<10;i++) this.add.image(i*130+30,45+(i%3)*18,'cloud').setScrollFactor(0.18).setAlpha(0.5).setTint(0xffcc88);

    } else if (lvl === 3) { // Ouganda - Lac Victoria
      this.add.rectangle(0,0,worldW,H*0.5,0x5ab8d8).setOrigin(0).setScrollFactor(0);
      this.add.rectangle(0,H*0.5,worldW,H*0.3,0x2a90b0).setOrigin(0).setScrollFactor(0); // lac
      this.add.rectangle(0,H*0.8,worldW,H*0.2,0x2a7a48).setOrigin(0).setScrollFactor(0);
      this.add.rectangle(0,H-52,worldW,52,0x1a6a38).setOrigin(0);
      const bg2 = this.add.graphics().setScrollFactor(0.1);
      bg2.fillStyle(0x336644); bg2.fillTriangle(100,H-50,300,H-140,500,H-50); bg2.fillTriangle(400,H-50,600,H-120,800,H-50);
      // reflet lac
      this.add.rectangle(0,H*0.5,worldW,8,0x88ccee).setOrigin(0).setAlpha(0.6);
      for(let i=0;i<16;i++) this.add.image(i*105+20,50+(i%3)*20,'cloud').setScrollFactor(0.18).setAlpha(0.7);
      for(let i=0;i<12;i++) this.add.image(i*130+30,H-68,'tree').setScrollFactor(0.32).setScale(0.9+(i%3)*0.1);
      for(let i=0;i<18;i++) this.add.image(i*95+10,H-50,'bush').setScrollFactor(0.48);

    } else if (lvl === 4) { // Soudan - désert
      this.add.rectangle(0,0,worldW,H*0.5,0xe06020).setOrigin(0).setScrollFactor(0);
      this.add.rectangle(0,H*0.5,worldW,H*0.5,0xc08020).setOrigin(0).setScrollFactor(0);
      this.add.rectangle(0,H-52,worldW,52,0xd0a030).setOrigin(0);
      this.add.circle(650,80,55,0xff9900).setScrollFactor(0.04);
      this.add.circle(650,80,46,0xffbb22).setScrollFactor(0.04);
      // dunes
      for(let i=0;i<6;i++){ this.add.circle(i*230+80,H-50,180,0xd09020).setScrollFactor(0.1); this.add.circle(i*230+180,H-50,140,0xe0a830).setScrollFactor(0.1); }
      // pyramides
      const bg3 = this.add.graphics().setScrollFactor(0.12);
      bg3.fillStyle(0xc08828);
      bg3.fillTriangle(150,H-52,250,H-150,350,H-52);
      bg3.fillTriangle(400,H-52,490,H-120,580,H-52);
      bg3.fillTriangle(700,H-52,800,H-160,900,H-52);
      for(let i=0;i<8;i++) this.add.image(i*170+30,H-68,'cactus').setScrollFactor(0.35).setScale(0.8+(i%3)*0.15);
      for(let i=0;i<8;i++) this.add.image(i*150+50,55+(i%3)*20,'cloud').setScrollFactor(0.15).setAlpha(0.35).setTint(0xff8800);

    } else if (lvl === 5) { // Etna - volcan
      this.add.rectangle(0,0,worldW,H,0x1a0000).setOrigin(0).setScrollFactor(0);
      this.add.rectangle(0,H*0.6,worldW,H*0.4,0x2a0800).setOrigin(0).setScrollFactor(0);
      this.add.rectangle(0,H-52,worldW,52,0x3a0a00).setOrigin(0);
      // laves
      const bg4 = this.add.graphics().setScrollFactor(0.15);
      bg4.fillStyle(0xdd2200);
      for(let i=0;i<10;i++) bg4.fillEllipse(i*160+50,H-52,60,30);
      bg4.fillStyle(0xff5500);
      for(let i=0;i<10;i++) bg4.fillEllipse(i*160+80,H-52,40,20);
      // volcan
      const bg5 = this.add.graphics().setScrollFactor(0.08);
      bg5.fillStyle(0x3a1010); bg5.fillTriangle(600,H-52,1000,H-250,1400,H-52);
      bg5.fillStyle(0xff4400); bg5.fillTriangle(940,H-220,1000,H-250,1060,H-220);
      // fumée
      for(let i=0;i<10;i++) this.add.circle(Phaser.Math.Between(200,1400),Phaser.Math.Between(20,H*0.5),Phaser.Math.Between(30,70),0x332222).setScrollFactor(0.06).setAlpha(0.4);
      // braises
      for(let i=0;i<20;i++) this.add.circle(Phaser.Math.Between(0,1500),Phaser.Math.Between(H*0.3,H*0.7),Phaser.Math.Between(1,3),0xff6600).setScrollFactor(0.1).setAlpha(0.7);

    } else if (lvl === 6) { // France - forêt brûlée
      this.add.rectangle(0,0,worldW,H,0x2a2020).setOrigin(0).setScrollFactor(0);
      this.add.rectangle(0,H*0.65,worldW,H*0.35,0x1a1010).setOrigin(0).setScrollFactor(0);
      this.add.rectangle(0,H-52,worldW,52,0x181010).setOrigin(0);
      // lueur orange au sol
      const bg6 = this.add.graphics().setScrollFactor(0.2);
      bg6.fillStyle(0xff3300);
      for(let i=0;i<18;i++) bg6.fillEllipse(i*95+30,H-52,50,15);
      // nuages de cendres
      for(let i=0;i<14;i++) this.add.image(i*120+40,40+(i%4)*22,'cloud').setScrollFactor(0.15).setAlpha(0.45).setTint(0x444444);
      for(let i=0;i<14;i++) this.add.image(i*116+20,H-68,'burnt_tree').setScrollFactor(0.32).setScale(0.8+(i%3)*0.15);
      // braises
      for(let i=0;i<30;i++) this.add.circle(Phaser.Math.Between(0,1600),Phaser.Math.Between(H*0.4,H-52),Phaser.Math.Between(1,3),0xff4400).setScrollFactor(0.25).setAlpha(0.8);

    } else if (lvl === 7) { // Koh Phi Phi - plage
      this.add.rectangle(0,0,worldW,H*0.55,0x30c0f0).setOrigin(0).setScrollFactor(0);
      this.add.rectangle(0,H*0.55,worldW,H*0.3,0x10a0d0).setOrigin(0).setScrollFactor(0); // mer
      this.add.rectangle(0,H*0.85,worldW,H*0.15,0x80d0f0).setOrigin(0).setScrollFactor(0); // mer claire
      this.add.rectangle(0,H-52,worldW,52,0xf0e060).setOrigin(0); // sable
      // falaises calcaires
      const bg7 = this.add.graphics().setScrollFactor(0.1);
      bg7.fillStyle(0x888866);
      bg7.fillRect(100,H*0.3,60,H*0.55); bg7.fillRect(300,H*0.2,80,H*0.65); bg7.fillRect(600,H*0.35,50,H*0.5);
      bg7.fillStyle(0x66aa44); bg7.fillEllipse(130,H*0.3,80,60); bg7.fillEllipse(340,H*0.2,100,70); bg7.fillEllipse(625,H*0.35,70,55);
      // reflet mer
      this.add.rectangle(0,H*0.55,worldW,6,0xaaeeff).setOrigin(0).setAlpha(0.5);
      for(let i=0;i<10;i++) this.add.image(i*130+30,45+(i%3)*18,'cloud').setScrollFactor(0.18).setAlpha(0.85);
      for(let i=0;i<14;i++) this.add.image(i*120+20,H-66,'palm').setScrollFactor(0.35).setScale(0.85+(i%3)*0.12);
      for(let i=0;i<20;i++) this.add.image(i*100+10,H-50,'bush').setScrollFactor(0.5).setTint(0x88cc44);

    } else { // lvl 8 - Sydney
      this.add.rectangle(0,0,worldW,H*0.65,0x60b0e8).setOrigin(0).setScrollFactor(0);
      this.add.rectangle(0,H*0.65,worldW,H*0.2,0x3080c0).setOrigin(0).setScrollFactor(0); // eau
      this.add.rectangle(0,H*0.85,worldW,H*0.15,0x50a0d8).setOrigin(0).setScrollFactor(0);
      this.add.rectangle(0,H-52,worldW,52,0x404050).setOrigin(0);
      // skyline + opera house + bridge
      const bg8 = this.add.graphics().setScrollFactor(0.12);
      bg8.fillStyle(0x334455);
      const buildings = [[100,140,50,200],[170,160,40,200],[230,120,60,200],[310,170,40,200],[360,100,70,200],[450,140,50,200],[520,160,35,200],[570,130,45,200],[630,180,40,200],[680,110,55,200],[750,150,45,200],[820,130,60,200],[900,160,45,200],[960,100,70,200],[1050,140,50,200]];
      buildings.forEach(([x,y,w,h2])=>{ bg8.fillRect(x,y,w,h2); bg8.fillStyle(0xffee88); for(let r=y+10;r<y+h2;r+=20) for(let c=x+5;c<x+w-5;c+=14) bg8.fillRect(c,r,8,10); bg8.fillStyle(0x334455); });
      // Opera House (coquilles blanches)
      bg8.fillStyle(0xeeeeff);
      bg8.fillTriangle(200,H*0.65,240,H*0.42,280,H*0.65);
      bg8.fillTriangle(255,H*0.65,300,H*0.45,345,H*0.65);
      // Harbour Bridge
      bg8.fillStyle(0x888898);
      bg8.fillRect(400,H*0.48,300,8);
      bg8.fillRect(400,H*0.3,10,H*0.35); bg8.fillRect(690,H*0.3,10,H*0.35);
      bg8.fillRect(390,H*0.3,20,8); bg8.fillRect(690,H*0.3,20,8);
      for(let i=0;i<15;i++){ bg8.fillRect(410+i*20,H*0.48,2,H*0.18-i*2); }
      // reflet eau
      this.add.rectangle(0,H*0.65,worldW,4,0x88ccff).setOrigin(0).setAlpha(0.6);
      for(let i=0;i<12;i++) this.add.image(i*110+30,44+(i%3)*18,'cloud').setScrollFactor(0.18).setAlpha(0.8);
    }
  }

  // ---- LEVEL BUILDERS ----
  tile(x,y,n,key){ for(let i=0;i<n;i++) this.platforms.create(x+i*32+16,y+16,key).refreshBody(); }

  buildLevel1() {
    const t=(x,y,n)=>this.tile(x,y,n,'ground');
    t(0,388,18); t(700,388,10); t(1100,388,14); t(1700,388,10); t(2000,388,12); t(2500,388,10); t(2900,388,10);
    t(200,298,4); t(380,218,3); t(520,298,3); t(720,248,4); t(880,308,3);
    t(1120,288,4); t(1280,208,3); t(1430,288,3); t(1720,268,3); t(1860,188,3);
    t(2020,288,4); t(2180,208,3); t(2330,288,3); t(2520,238,4); t(2680,308,3); t(2820,218,3);
    [[420,368],[800,368],[1200,368],[1500,368],[2100,368],[2350,368],[2650,368],[390,198],[1290,188]].forEach(([x,y])=>this.spawnEnemy(x,y,65,110));
    [[230,270],[400,190],[540,270],[730,220],[900,280],[1140,260],[1300,180],[1450,260],[1740,240],[1880,160],[2040,260],[2200,180],[2350,260],[2540,210],[2700,280],[2840,190]].forEach(([x,y],i)=>this.spawnFruit(x,y,i));
  }

  buildLevel2() {
    const t=(x,y,n)=>this.tile(x,y,n,'dirt');
    t(0,388,16); t(620,388,8); t(1000,388,12); t(1580,388,10); t(1900,388,10); t(2380,388,10); t(2780,388,10);
    t(180,298,4); t(370,218,3); t(510,308,3); t(680,248,4); t(840,308,3);
    t(1060,278,4); t(1240,198,3); t(1400,278,3); t(1640,258,3); t(1800,188,3);
    t(1960,278,4); t(2120,198,3); t(2280,278,3); t(2450,228,4); t(2630,308,3); t(2810,218,3);
    [[380,368],[700,368],[1100,368],[1400,368],[2000,368],[2200,368],[2600,368],[2900,368],[370,198],[1250,178]].forEach(([x,y])=>this.spawnEnemy(x,y,70,120));
    [[210,270],[390,190],[530,280],[700,220],[860,280],[1100,250],[1260,170],[1420,250],[1660,230],[1820,160],[1980,250],[2140,170],[2300,250],[2470,200],[2650,280],[2830,190],[2920,270]].forEach(([x,y],i)=>this.spawnFruit(x,y,i));
  }

  buildLevel3() {
    const t=(x,y,n)=>this.tile(x,y,n,'stone');
    t(0,388,12); t(480,388,8); t(900,388,10); t(1380,388,8); t(1750,388,10); t(2200,388,8); t(2620,388,12);
    t(160,308,3); t(320,238,3); t(480,308,3); t(620,248,4); t(800,318,3);
    t(960,288,4); t(1140,208,3); t(1300,288,3); t(1440,248,3); t(1600,178,3);
    t(1800,278,4); t(1960,208,3); t(2100,278,3); t(2260,218,4); t(2440,308,3); t(2660,228,3);
    t(100,358,4); t(560,358,4); t(1060,358,4); t(1560,358,4); t(2060,358,4); t(2560,358,4);
    [[350,368],[700,368],[1100,368],[1500,368],[1900,368],[2350,368],[2750,368],[310,218],[960,188],[1560,158]].forEach(([x,y])=>this.spawnEnemy(x,y,75,110));
    [[180,280],[340,210],[500,280],[640,220],[820,290],[1000,260],[1160,180],[1320,260],[1460,220],[1620,150],[1820,250],[1980,180],[2120,250],[2280,190],[2460,280],[2680,200],[2730,260]].forEach(([x,y],i)=>this.spawnFruit(x,y,i));
  }

  buildLevel4() {
    const t=(x,y,n)=>this.tile(x,y,n,'sandstone');
    t(0,388,10); t(380,388,8); t(750,388,10); t(1200,388,8); t(1600,388,10); t(2050,388,8); t(2500,388,10);
    t(140,308,3); t(300,238,3); t(460,318,3); t(600,248,3); t(760,318,3);
    t(900,238,3); t(1060,168,3); t(1260,238,3); t(1420,308,3); t(1580,228,3);
    t(1720,158,4); t(1900,228,3); t(2060,308,4); t(2220,228,3); t(2380,158,3); t(2560,238,4); t(2740,308,3); t(2880,228,3);
    [[250,368],[600,368],[1050,368],[1450,368],[1900,368],[2350,368],[2750,368],[900,208],[1620,198],[2380,128]].forEach(([x,y])=>this.spawnEnemy(x,y,80,120));
    [[160,280],[320,210],[480,290],[620,220],[780,290],[920,210],[1080,140],[1280,210],[1440,280],[1600,200],[1740,130],[1920,200],[2080,280],[2240,200],[2400,130],[2580,210],[2760,280],[2900,200]].forEach(([x,y],i)=>this.spawnFruit(x,y,i));
  }

  buildLevel5() {
    const t=(x,y,n)=>this.tile(x,y,n,'lava_rock');
    t(0,388,10); t(380,388,6); t(700,388,8); t(1100,388,6); t(1450,388,8); t(1870,388,6); t(2250,388,10); t(2730,388,8);
    t(120,308,3); t(280,238,3); t(420,168,3); t(560,248,3); t(720,318,3); t(880,228,3);
    t(1020,158,3); t(1200,238,3); t(1360,318,3); t(1500,238,3); t(1640,168,3); t(1800,238,3);
    t(1960,308,3); t(2100,228,3); t(2260,148,4); t(2460,228,3); t(2620,308,3); t(2790,228,3); t(2940,148,3);
    [[250,368],[580,368],[980,368],[1350,368],[1750,368],[2130,368],[2550,368],[2850,368],[420,148],[1640,138],[2260,118]].forEach(([x,y])=>this.spawnEnemy(x,y,85,100));
    [[140,280],[300,210],[440,140],[580,220],[740,290],[900,200],[1040,130],[1220,210],[1380,290],[1520,210],[1660,140],[1820,210],[1980,280],[2120,200],[2280,120],[2480,200],[2640,280],[2810,200],[2960,120]].forEach(([x,y],i)=>this.spawnFruit(x,y,i));
  }

  buildLevel6() {
    const t=(x,y,n)=>this.tile(x,y,n,'ash');
    t(0,388,12); t(460,388,8); t(860,388,10); t(1320,388,8); t(1700,388,8); t(2100,388,8); t(2520,388,10);
    t(100,308,3); t(260,228,4); t(480,308,3); t(640,228,3); t(820,318,3); t(980,238,3);
    t(1120,168,4); t(1340,248,3); t(1500,168,3); t(1640,248,3); t(1760,168,4);
    t(1900,248,3); t(2040,168,3); t(2180,248,4); t(2360,168,3); t(2560,248,3); t(2730,168,4); t(2900,248,3);
    [[280,368],[760,368],[1140,368],[1540,368],[1960,368],[2380,368],[2780,368],[260,208],[1120,138],[1760,138],[2730,138]].forEach(([x,y])=>this.spawnEnemy(x,y,88,130));
    [[120,280],[280,200],[500,280],[660,200],[840,290],[1000,210],[1140,140],[1360,220],[1520,140],[1660,220],[1780,140],[1920,220],[2060,140],[2200,220],[2380,140],[2580,220],[2750,140],[2920,220]].forEach(([x,y],i)=>this.spawnFruit(x,y,i));
  }

  buildLevel7() {
    const t=(x,y,n)=>this.tile(x,y,n,'sand');
    t(0,388,10); t(380,388,8); t(760,388,8); t(1160,388,8); t(1560,388,6); t(1960,388,8); t(2400,388,6); t(2820,388,10);
    t(140,308,3); t(300,228,4); t(480,318,3); t(640,238,3); t(800,318,3); t(960,238,3);
    t(1100,168,4); t(1300,248,3); t(1480,168,3); t(1640,248,3); t(1800,168,4);
    t(2020,248,3); t(2180,168,3); t(2360,248,4); t(2540,168,3); t(2720,248,3); t(2900,168,4);
    [[250,368],[600,368],[1000,368],[1400,368],[1800,368],[2250,368],[2700,368],[3000,368],[1100,138],[1800,138],[2360,218]].forEach(([x,y])=>this.spawnEnemy(x,y,92,120));
    [[160,280],[320,200],[500,290],[660,210],[820,290],[980,210],[1120,140],[1320,220],[1500,140],[1660,220],[1820,140],[2040,220],[2200,140],[2380,220],[2560,140],[2740,220],[2920,140],[3020,210]].forEach(([x,y],i)=>this.spawnFruit(x,y,i));
  }

  buildLevel8() {
    const t=(x,y,n)=>this.tile(x,y,n,'pavement');
    t(0,388,10); t(380,388,6); t(720,388,8); t(1140,388,6); t(1520,388,8); t(1960,388,6); t(2380,388,8); t(2820,388,10);
    t(120,318,3); t(280,248,3); t(440,178,3); t(600,258,3); t(760,318,3); t(920,248,3); t(1080,178,3);
    t(1260,258,3); t(1420,178,3); t(1600,258,3); t(1760,178,4); t(1940,258,3); t(2100,178,3);
    t(2260,258,4); t(2460,178,3); t(2640,258,3); t(2820,178,4); t(2980,258,3);
    [[240,368],[600,368],[1020,368],[1440,368],[1840,368],[2260,368],[2720,368],[3000,368],[440,148],[1080,148],[1760,148],[2820,148]].forEach(([x,y])=>this.spawnEnemy(x,y,100,140));
    [[140,290],[300,220],[460,150],[620,230],[780,290],[940,220],[1100,150],[1280,230],[1440,150],[1620,230],[1780,150],[1960,230],[2120,150],[2280,230],[2480,150],[2660,230],[2840,150],[3000,230]].forEach(([x,y],i)=>this.spawnFruit(x,y,i));
  }

  spawnEnemy(x,y,speed,range){
    const e=this.enemies.create(x,y,'enemy');
    e.setBounce(0).setCollideWorldBounds(false);
    e.setVelocityX(speed); e.setData('startX',x); e.setData('dir',1); e.setData('range',range); e.setData('speed',speed);
    this.physics.add.collider(e,this.platforms);
  }

  spawnFruit(x,y,i){
    const f=this.fruits.create(x,y,'fruit'+(i%5));
    f.setData('baseY',y); f.refreshBody(); this.totalFruits++;
  }

  createPlayer(){
    this.player=this.physics.add.sprite(80,330,'player');
    this.player.setCollideWorldBounds(true).setBounce(0.05);
    this.physics.add.collider(this.player,this.platforms);
    this.physics.add.overlap(this.player,this.enemies,this.hitEnemy,null,this);
    this.physics.add.overlap(this.player,this.fruits,this.collectFruit,null,this);
  }

  createFlag(worldW){
    this.flag=this.add.image(worldW-80,328,'flag').setOrigin(0.5,1);
    this.flagZone=this.add.zone(worldW-80,350,55,80).setOrigin(0.5);
    this.physics.world.enable(this.flagZone,Phaser.Physics.Arcade.STATIC_BODY);
    this.physics.add.overlap(this.player,this.flagZone,this.reachGoal,null,this);
  }

  createUI(){
    this.scoreText=this.add.text(10,8,'Berrys : '+this.score,{
      fontSize:'20px',fontFamily:'Arial Black, Arial',color:'#ffdd00',stroke:'#000',strokeThickness:3
    }).setScrollFactor(0).setDepth(10);
    this.fruitsText=this.add.text(10,34,'Akuma no Mi : 0 / '+this.totalFruits,{
      fontSize:'15px',fontFamily:'Arial',color:'#ffaaff',stroke:'#000',strokeThickness:2
    }).setScrollFactor(0).setDepth(10);
    this.add.text(W/2,8,'Niveau '+this.currentLevel+'/8  —  '+LEVELS[this.currentLevel].name,{
      fontSize:'15px',fontFamily:'Arial Black, Arial',color:'#ffffff',stroke:'#000',strokeThickness:3
    }).setOrigin(0.5,0).setScrollFactor(0).setDepth(10);
    this.heartsGroup=[];
    this.redrawHearts();
  }

  redrawHearts(){
    this.heartsGroup.forEach(h=>h.destroy()); this.heartsGroup=[];
    for(let i=0;i<this.lives;i++)
      this.heartsGroup.push(this.add.image(W-14-i*26,16,'heart').setScrollFactor(0).setDepth(10));
  }

  collectFruit(player,fruit){
    if(!fruit.active) return;
    const fx=fruit.x,fy=fruit.getData('baseY'); fruit.destroy();
    this.fruitsCollected++; this.score+=100;
    this.scoreText.setText('Berrys : '+this.score);
    this.fruitsText.setText('Akuma no Mi : '+this.fruitsCollected+' / '+this.totalFruits);
    const txt=this.add.text(fx,fy-10,'+100',{fontSize:'16px',fontFamily:'Arial Black, Arial',color:'#ffdd00',stroke:'#000',strokeThickness:2}).setDepth(10);
    this.tweens.add({targets:txt,y:fy-55,alpha:0,duration:700,onComplete:()=>txt.destroy()});
  }

  hitEnemy(player,enemy){
    if(this.isDead||!enemy.active) return;
    if(player.body.velocity.y>40&&player.y<enemy.y-10){
      const ex=enemy.x,ey=enemy.y; enemy.destroy();
      player.setVelocityY(-430); this.score+=50;
      this.scoreText.setText('Berrys : '+this.score);
      this.spawnParticles(ex,ey);
      const txt=this.add.text(ex,ey-10,'+50',{fontSize:'16px',fontFamily:'Arial Black, Arial',color:'#ffffff',stroke:'#000',strokeThickness:2}).setDepth(10);
      this.tweens.add({targets:txt,y:ey-55,alpha:0,duration:700,onComplete:()=>txt.destroy()});
    } else { this.loseLife(); }
  }

  loseLife(){
    if(this.isDead) return;
    this.isDead=true; this.lives--; this.redrawHearts();
    this.cameras.main.shake(280,0.012);
    this.player.setTint(0xff6666); this.player.setVelocityY(-240);
    this.time.delayedCall(950,()=>{
      if(this.lives<=0){
        Music.stop();
        this.scene.start('GameOver',{score:this.score,level:this.currentLevel});
      } else {
        this.player.setPosition(80,330); this.player.setVelocity(0,0);
        this.player.clearTint(); this.isDead=false; this.jumpCount=0;
      }
    });
  }

  reachGoal(){
    if(this.isDead) return;
    this.isDead=true; this.player.setVelocity(0,0);
    this.cameras.main.flash(700,255,220,0);
    this.time.delayedCall(950,()=>{
      if(this.currentLevel<8)
        this.scene.start('Game',{level:this.currentLevel+1,lives:this.lives,score:this.score});
      else {
        Music.stop();
        this.scene.start('Win',{score:this.score});
      }
    });
  }

  spawnParticles(x,y){
    const keys=['particle','p_red','p_blue','p_green','p_white'];
    for(let i=0;i<10;i++){
      const p=this.add.image(x,y,keys[i%5]).setDepth(5);
      this.tweens.add({targets:p,x:x+Phaser.Math.Between(-80,80),y:y+Phaser.Math.Between(-80,20),alpha:0,scale:0.5,duration:600,onComplete:()=>p.destroy()});
    }
  }

  update(){
    if(this.isDead) return;
    const p=this.player,onGround=p.body.blocked.down;
    if(onGround) this.jumpCount=0;
    const goLeft=this.cursors.left.isDown||this.keyA.isDown;
    const goRight=this.cursors.right.isDown||this.keyD.isDown;
    if(goLeft){p.setVelocityX(-195);p.setFlipX(true);}
    else if(goRight){p.setVelocityX(195);p.setFlipX(false);}
    else p.setVelocityX(0);
    const jumpPressed=Phaser.Input.Keyboard.JustDown(this.cursors.up)||Phaser.Input.Keyboard.JustDown(this.cursors.space)||Phaser.Input.Keyboard.JustDown(this.keyW);
    if(jumpPressed&&this.jumpCount<2){p.setVelocityY(this.jumpVel);this.jumpCount++;}
    if(p.y>H+30) this.loseLife();
    this.enemies.getChildren().forEach(e=>{
      if(!e.active) return;
      const sx=e.getData('startX'),r=e.getData('range'),sp=e.getData('speed');
      let d=e.getData('dir');
      if(e.x>sx+r){d=-1;e.setData('dir',-1);}
      if(e.x<sx-r){d=1;e.setData('dir',1);}
      // Niveaux 6+ : accélèrent quand le joueur est proche
      let finalSpeed = sp;
      if(this.currentLevel>=6){
        const dist = Math.abs(this.player.x - e.x);
        if(dist < 220) finalSpeed = sp * 1.45;
      }
      e.setVelocityX(d*finalSpeed); e.setFlipX(d<0);
    });
  }
}

// ==========================================
// WIN
// ==========================================
class WinScene extends Phaser.Scene {
  constructor() { super('Win'); }
  init(data) { this.score = data.score||0; }
  create() {
    Music.play('win', false);
    this.add.rectangle(0,0,W,H,0x030818).setOrigin(0);
    for(let i=0;i<80;i++) this.add.circle(Math.random()*W,Math.random()*H*0.8,Math.random()*2+0.5,[0xffffff,0xaaddff,0xffddaa][Math.floor(Math.random()*3)]);
    const hero = this.add.image(W/2,160,'player').setScale(3);
    this.tweens.add({targets:hero,y:148,duration:600,yoyo:true,repeat:-1,ease:'Sine.easeInOut'});
    this.add.text(W/2,60,'🎉 BRAVO ALEXANDRE ! 🎉',{fontSize:'38px',fontFamily:'Arial Black, Arial',color:'#ffdd00',stroke:'#000',strokeThickness:6}).setOrigin(0.5);
    this.add.text(W/2,220,"Tu as traversé les 8 mondes\net sauvé la galaxie !",{fontSize:'22px',fontFamily:'Arial',color:'#aaddff',stroke:'#000',strokeThickness:3,align:'center'}).setOrigin(0.5);
    this.add.text(W/2,300,'Score final : '+this.score+' Berrys',{fontSize:'28px',fontFamily:'Arial Black, Arial',color:'#f1c40f',stroke:'#000',strokeThickness:4}).setOrigin(0.5);
    const btn=this.add.text(W/2,375,'  ↺  REJOUER  ↺  ',{fontSize:'26px',fontFamily:'Arial Black, Arial',color:'#ffffff',stroke:'#000',strokeThickness:4,backgroundColor:'#228822',padding:{x:20,y:12}}).setOrigin(0.5).setInteractive({useHandCursor:true});
    btn.on('pointerover',()=>btn.setStyle({color:'#ffdd00'}));
    btn.on('pointerout', ()=>btn.setStyle({color:'#ffffff'}));
    btn.on('pointerdown',()=>{ Music.stop(); this.scene.start('Menu'); });
    this.input.keyboard.once('keydown-SPACE',()=>{ Music.stop(); this.scene.start('Menu'); });
  }
}

// ==========================================
// GAME OVER
// ==========================================
class GameOverScene extends Phaser.Scene {
  constructor() { super('GameOver'); }
  init(data) { this.score = data.score||0; this.level = data.level||1; }
  create() {
    Music.play('gameover', false);
    this.add.rectangle(0,0,W,H,0x180000).setOrigin(0);
    this.add.text(W/2,90,'GAME OVER',{fontSize:'62px',fontFamily:'Arial Black, Arial',color:'#ee2222',stroke:'#000',strokeThickness:6}).setOrigin(0.5);
    this.add.text(W/2,180,'Score : '+this.score+' Berrys',{fontSize:'26px',fontFamily:'Arial Black, Arial',color:'#f1c40f',stroke:'#000',strokeThickness:3}).setOrigin(0.5);
    this.add.text(W/2,230,'Niveau atteint : '+this.level+'/8 — '+LEVELS[this.level].name,{fontSize:'16px',fontFamily:'Arial',color:'#aaaaaa',stroke:'#000',strokeThickness:2}).setOrigin(0.5);

    // Bouton CONTINUER
    const btnContinue = this.add.text(W/2-120,320,'  ▶  CONTINUER  ',{
      fontSize:'24px',fontFamily:'Arial Black, Arial',color:'#ffffff',stroke:'#000',strokeThickness:4,
      backgroundColor:'#226622',padding:{x:16,y:12}
    }).setOrigin(0.5).setInteractive({useHandCursor:true});
    btnContinue.on('pointerover',()=>btnContinue.setStyle({color:'#aaffaa'}));
    btnContinue.on('pointerout', ()=>btnContinue.setStyle({color:'#ffffff'}));
    btnContinue.on('pointerdown',()=>{
      Music.stop();
      this.scene.start('Game',{level:this.level,lives:3,score:this.score});
    });

    // Bouton MENU
    const btnMenu = this.add.text(W/2+120,320,'  ✕  MENU  ',{
      fontSize:'24px',fontFamily:'Arial Black, Arial',color:'#ffffff',stroke:'#000',strokeThickness:4,
      backgroundColor:'#880000',padding:{x:16,y:12}
    }).setOrigin(0.5).setInteractive({useHandCursor:true});
    btnMenu.on('pointerover',()=>btnMenu.setStyle({color:'#ffaaaa'}));
    btnMenu.on('pointerout', ()=>btnMenu.setStyle({color:'#ffffff'}));
    btnMenu.on('pointerdown',()=>{ Music.stop(); this.scene.start('Menu'); });

    this.add.text(W/2,395,'CONTINUER = reprendre depuis ce niveau avec 3 vies',{
      fontSize:'12px',fontFamily:'Arial',color:'#666666'
    }).setOrigin(0.5);
    this.input.keyboard.once('keydown-SPACE',()=>{ Music.stop(); this.scene.start('Game',{level:this.level,lives:3,score:this.score}); });
  }
}

// ==========================================
// LANCEMENT
// ==========================================
new Phaser.Game({
  type: Phaser.AUTO,
  width: W, height: H,
  backgroundColor: '#000010',
  physics: { default:'arcade', arcade:{ gravity:{y:580}, debug:false } },
  scene: [BootScene, IntroScene, MenuScene, GameScene, WinScene, GameOverScene]
});
