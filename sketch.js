// ==========================================
// 全域變數宣告
// ==========================================
let spriteSheetWalk, spriteSheetKick, spriteSheetPrepare, spriteSheetAttack, spriteSheetAlt, spriteSheetAltHit;
let framesWalk = [], framesKick = [], framesPrepare = [], framesAttack = [], framesAlt = [], framesAltHit = [];

// 動畫設定
const frameCountWalk = 8;
const frameCountKick = 5;
const frameCountPrepare = 6;
const frameCountAttack = 9;
const frameCountAlt = 10;
const frameCountAltHit = 14;

let currentFrame = 0;
let baseFrameDelay = 6;
let frameTicker = 0;
let spriteScale = 1.6;

// 動作狀態
let isKicking = false, kickFrame = 0, kickTicker = 0, kickFrameDelay = 6;
let isPreparing = false, prepareFrame = 0, prepareTicker = 0, prepareFrameDelay = 6;
let isAttacking = false; 

// 攻擊特效
let attackEffects = [];
let attackEffectFrameDelay = 6;
let attackEffectScale = 2.2;
let attackEffectSpeed = 16;

// NPC (Alt Character)
let altFrame = 0, altTicker = 0, altFrameDelay = 6;
let altX = 0, altY = 0, altScale = 1.6, altFacing = 1;
let isAltHit = false, altHitFrame = 0, altHitTicker = 0, altHitFrameDelay = 6, altHitStandupTimer = 0;

// 新增：NPC2 變數（右側角色）
let spriteSheet6;
let frames6 = [];
const frameCount6 = 5;
let alt2Frame = 0, alt2Ticker = 0, alt2FrameDelay = 6;
let alt2X = 0, alt2Y = 0, alt2Scale = 1.6, alt2Facing = 1;

// 物理與位置
let x = 0, y = 0, vx = 0, ax = 0;
const maxSpeed = 6;
const accel = 0.6;
const friction = 0.4;
let facing = 1;

// 測驗系統變數
let quizSystem;
let quizTable; 
const proximityDist = 180; 

// ==========================================
// 核心 P5.js 函式
// ==========================================

function preload() {
  try {
    // 請確保您的資料夾結構正確
    spriteSheetWalk = loadImage('2/all 2.png');
    spriteSheetKick = loadImage('3/all 3.png');
    spriteSheetPrepare = loadImage('1/all 1.png');
    spriteSheetAttack = loadImage('4/all 4.png');
    spriteSheetAlt = loadImage('5/all 5.png');
    spriteSheetAltHit = loadImage('5/11/all 11.png');
    // 新增：載入 NPC2 精靈圖
    spriteSheet6 = loadImage('6/all 6.png');
  } catch (e) {
    console.error("圖片載入失敗", e);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  
  // 調整角色初始 Y 軸位置，讓他們站在地板上
  x = width / 2;
  y = height * 0.65; 

  // 切割 Sprites
  sliceSprites(spriteSheetWalk, frameCountWalk, framesWalk);
  sliceSprites(spriteSheetKick, frameCountKick, framesKick);
  sliceSprites(spriteSheetPrepare, frameCountPrepare, framesPrepare);
  sliceSprites(spriteSheetAttack, frameCountAttack, framesAttack);
  sliceSprites(spriteSheetAlt, frameCountAlt, framesAlt);
  sliceSprites(spriteSheetAltHit, frameCountAltHit, framesAltHit);
  // 新增：切割 NPC2 精靈
  sliceSprites(spriteSheet6, frameCount6, frames6);

  setupNPC();
  // 新增：設定 NPC2 位置
  setupNPC2();
  generateMockCSV(10); 
  quizSystem = new QuizSystem(quizTable);
}

function draw() {
  // 1. 繪製教室背景 (新增的功能)
  drawClassroomBackground();

  // 2. 檢查距離
  let distToNPC = dist(x, y, altX, altY);
  let canInteract = (distToNPC < proximityDist && !isAltHit);

  // 3. 遊戲邏輯
  if (!quizSystem.isActive) {
    updatePhysics();
    updateAnimationState();
  } else {
    vx = 0; ax = 0; currentFrame = 0; 
  }

  // 4. 繪製角色與特效
  drawNPC();
  // 新增：繪製右側 NPC2
  drawNPC2();
  drawCharacter();
  drawEffects();

  // 5. 繪製 UI
  if (canInteract && !quizSystem.isActive) {
    drawInteractionPrompt(altX, altY - 140, "按 Enter 接受特訓");
  }

  quizSystem.update(canInteract);
}

function keyPressed() {
  if (quizSystem.isActive) {
    if (keyCode === ESCAPE) quizSystem.close();
    return;
  }
  let distToNPC = dist(x, y, altX, altY);
  if (keyCode === ENTER && distToNPC < proximityDist && !isAltHit) {
    quizSystem.open();
    return;
  }
  if (keyCode === UP_ARROW && !isActionBusy()) {
    isKicking = true; kickFrame = 0; kickTicker = 0;
  }
  if (keyCode === 32 && !isActionBusy()) {
    isPreparing = true; prepareFrame = 0; prepareTicker = 0;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // 重算地板位置
  y = height * 0.65;
  altY = y;
  // 新增：更新 NPC2 的 y 座標
  alt2Y = y;
}

// ==========================================
// 新增：繪製教室背景函式
// ==========================================
function drawClassroomBackground() {
  push();
  // 1. 牆壁顏色
  background('#fcf3cf'); 

  // 2. 地板 (深色木紋)
  noStroke();
  fill('#5d4037'); // 深咖啡色
  rectMode(CORNER);
  // 地板從畫面 65% 高度開始往下畫
  rect(0, height * 0.65 + 60, width, height * 0.35); 

  // 地板踢腳板 (牆壁與地板交界)
  fill('#3e2723');
  rect(0, height * 0.65 + 50, width, 10);

  // 3. 黑板 (置中)
  rectMode(CENTER);
  // 黑板邊框
  fill('#8d6e63'); 
  rect(width/2, height/2 - 80, 620, 320, 8);
  // 黑板綠色表面
  fill('#2e7d32');
  rect(width/2, height/2 - 80, 600, 300);
  // 黑板溝槽 (放粉筆的地方)
  fill('#8d6e63');
  rect(width/2, height/2 + 80, 600, 15);

  // 4. 黑板上的文字裝飾
  fill(255, 180); // 半透明白色 (像粉筆跡)
  textAlign(CENTER);
  noStroke();
  
  textSize(40);
  textStyle(BOLD);
  text("數學格鬥大會", width/2, height/2 - 90);
  
  textSize(20);
  textStyle(NORMAL);
  textAlign(LEFT);
  text("值日生：周杰倫", width/2 + 150, height/2 + 50);
  textAlign(RIGHT);
  text("距離期末考: 3天", width/2 - 150, height/2 + 50);

  // 5. 簡易窗戶 (左側)
  fill('#b3e5fc');
  stroke('#0288d1');
  strokeWeight(6);
  rect(150, height/2 - 100, 160, 240); // 窗框
  noStroke();
  // 窗戶光影
  fill(255, 100);
  rect(150, height/2 - 100, 160, 240);
  // 窗櫺
  stroke('#0288d1');
  strokeWeight(4);
  line(150, height/2 - 220, 150, height/2 + 20); // 直線
  line(70, height/2 - 100, 230, height/2 - 100); // 橫線

  pop();
}

// ==========================================
// 輔助函式區域
// ==========================================
function generateMockCSV(numQuestions) {
  quizTable = new p5.Table();
  quizTable.addColumn('question'); quizTable.addColumn('answer');
  quizTable.addColumn('feedback_correct'); quizTable.addColumn('feedback_wrong');
  quizTable.addColumn('hint');

  for (let i = 0; i < numQuestions; i++) {
    let numA = floor(random(1, 10));
    let numB = floor(random(1, 10));
    let ans = numA + numB;
    let newRow = quizTable.addRow();
    
    newRow.setString('question', `隨堂測驗：${numA} + ${numB} = ?`);
    newRow.setString('answer', str(ans));
    
    let correctPhrases = ["很好！這題考試會考！", "不錯嘛，看來昨天有複習！", "正解！下課後可以提早回家了！"];
    let wrongPhrases = ["太鬆懈了！給我去走廊罰站！", "算錯了！今晚留下來課後輔導！", "粉筆丟過去囉！算錯了！"];
    
    newRow.setString('feedback_correct', random(correctPhrases));
    newRow.setString('feedback_wrong', random(wrongPhrases));
    newRow.setString('hint', `同學，拿手指出來算！${numA} 加上 ${numB} 是多少？`);
  }
  console.log("魔鬼教官的題庫已生成！");
}

function sliceSprites(sheet, count, targetArray) {
  if (!sheet) return;
  const fw = sheet.width / count;
  const fh = sheet.height;
  for (let i = 0; i < count; i++) {
    targetArray.push(sheet.get(Math.round(i * fw), 0, Math.round(fw), fh));
  }
}

function setupNPC() {
  const gap = 200;
  const refW = framesWalk[0] ? framesWalk[0].width * spriteScale : 100;
  // 更新 NPC 位置以符合新的地板高度
  altX = width/2 - gap - refW; 
  altY = height * 0.65; 

  // 更新 NPC2 位置
  const gap2 = 100;
  alt2X = width/2 + gap2;
  alt2Y = height * 0.65;
}

// 新增：設定 NPC2 位置
function setupNPC2() {
  const gap = 200;
  const refW = framesWalk[0] ? framesWalk[0].width * spriteScale : 100;
  alt2X = width/2 + gap + refW;
  alt2Y = height * 0.65;
  alt2Facing = (x < alt2X) ? -1 : 1;
}

function isActionBusy() {
  return isKicking || isPreparing || isAttacking || attackEffects.length > 0;
}

function updatePhysics() {
  let inputAxis = 0;
  if (keyIsDown(RIGHT_ARROW)) { inputAxis = 1; facing = 1; }
  else if (keyIsDown(LEFT_ARROW)) { inputAxis = -1; facing = -1; }

  ax = inputAxis * accel;
  vx += ax;

  if (inputAxis === 0) {
    if (vx > 0) vx = max(0, vx - friction);
    else if (vx < 0) vx = min(0, vx + friction);
  }

  vx = constrain(vx, -maxSpeed, maxSpeed);
  x += vx;
  x = constrain(x, 50, width - 50);

  if (!isAltHit) { altFacing = (x < altX) ? -1 : 1; }
  // 新增：讓 NPC2 面向玩家
  alt2Facing = (x < alt2X) ? -1 : 1;
}

function updateAnimationState() {
  if (isPreparing) {
    prepareTicker++;
    if (prepareTicker >= prepareFrameDelay) { prepareFrame++; prepareTicker = 0; }
    if (prepareFrame >= framesPrepare.length) {
      isPreparing = false; isAttacking = true; spawnAttackEffect(); 
    }
  } else if (isKicking) {
    kickTicker++;
    if (kickTicker >= kickFrameDelay) { kickFrame++; kickTicker = 0; }
    if (kickFrame >= framesKick.length) { isKicking = false; }
  } else if (!isAttacking) {
    if (abs(vx) > 0.3) {
      frameTicker++;
      if (frameTicker >= baseFrameDelay) {
        currentFrame = (currentFrame + 1) % framesWalk.length;
        frameTicker = 0;
      }
    } else {
      currentFrame = 0;
    }
  }
}

function spawnAttackEffect() {
  const refFrame = framesWalk[0];
  const charW = refFrame ? refFrame.width * spriteScale : 100;
  const handOffsetX = charW * 0.32;
  const handOffsetY = -(refFrame ? refFrame.height * spriteScale : 100) * 0.12;
  
  attackEffects.push({
    x: x + facing * handOffsetX,
    y: y + handOffsetY,
    vx: facing * attackEffectSpeed,
    frame: 0, ticker: 0, frameDelay: attackEffectFrameDelay,
    scale: attackEffectScale, owner: true
  });
}

function drawCharacter() {
  let img = framesWalk[currentFrame];
  if (isPreparing) img = framesPrepare[prepareFrame];
  else if (isAttacking && framesPrepare.length > 0) img = framesPrepare[framesPrepare.length - 1];
  else if (isKicking) img = framesKick[kickFrame];

  if (img) {
    push();
    translate(x, y);
    scale(facing, 1);
    image(img, 0, 0, img.width * spriteScale, img.height * spriteScale);
    pop();
  }
}

function drawNPC() {
  let img = null;
  if (isAltHit && framesAltHit.length > 0) {
    altHitTicker++;
    if (altHitTicker >= altHitFrameDelay) { altHitFrame++; altHitTicker = 0; }
    if (altHitFrame >= framesAltHit.length) {
      altHitFrame = framesAltHit.length - 1; altHitStandupTimer++;
    }
    if (altHitStandupTimer > 40) {
      isAltHit = false; altHitStandupTimer = 0; altFrame = 0;
    }
    img = framesAltHit[altHitFrame];
  } else if (framesAlt.length > 0) {
    altTicker++;
    if (altTicker >= altFrameDelay) {
      altFrame = (altFrame + 1) % framesAlt.length; altTicker = 0;
    }
    img = framesAlt[altFrame];
  }

  if (img) {
    push();
    translate(altX, altY);
    scale(altFacing, 1);
    image(img, 0, 0, img.width * altScale, img.height * altScale);
    pop();
  }
}

// 新增：繪製 NPC2（右側，循環播放 frames6）
function drawNPC2() {
  if (frames6.length === 0) return;
  alt2Ticker++;
  if (alt2Ticker >= alt2FrameDelay) {
    alt2Frame = (alt2Frame + 1) % frames6.length;
    alt2Ticker = 0;
  }
  let img = frames6[alt2Frame];
  if (!img) return;
  push();
  translate(alt2X, alt2Y);
  scale(alt2Facing, 1);
  image(img, 0, 0, img.width * alt2Scale, img.height * alt2Scale);
  pop();
}

function drawEffects() {
  for (let i = attackEffects.length - 1; i >= 0; i--) {
    let eff = attackEffects[i];
    eff.x += eff.vx;
    eff.ticker++;
    if (eff.ticker >= eff.frameDelay) { eff.frame++; eff.ticker = 0; }
    if (!isAltHit && abs(eff.x - altX) < 80 && abs(eff.y - altY) < 100) {
      isAltHit = true; altHitFrame = 0;
    }
    if (eff.frame >= framesAttack.length || eff.x < -200 || eff.x > width + 200) {
      if (eff.owner) isAttacking = false;
      attackEffects.splice(i, 1);
      continue;
    }
    let img = framesAttack[eff.frame];
    if (img) {
      push();
      translate(eff.x, eff.y);
      if (eff.vx < 0) scale(-1, 1);
      image(img, 0, 0, img.width * eff.scale, img.height * eff.scale);
      pop();
    }
  }
}

function drawInteractionPrompt(posX, posY, txt) {
  push();
  translate(posX, posY);
  let floatY = sin(frameCount * 0.1) * 5;
  translate(0, floatY);
  fill(0, 180);
  noStroke();
  rectMode(CENTER);
  rect(0, 0, 160, 34, 17);
  fill(0, 180);
  triangle(-10, 17, 10, 17, 0, 25);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(16);
  textStyle(BOLD);
  text(txt, 0, -2);
  pop();
}

// ==========================================
// Class: QuizSystem (測驗互動系統)
// ==========================================
class QuizSystem {
  constructor(tableData) {
    this.table = tableData;
    this.isActive = false;
    this.currentQuestionRow = null;
    this.npcName = "魔鬼數學教官";

    // CSS 樣式：黑板風格
    let css = `
      #quiz-box {
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        width: 650px;
        background-color: #2d5a27;
        background-image: radial-gradient(#2d5a27, #1e3b1a);
        border: 8px solid #8b5a2b;
        border-radius: 6px;
        padding: 25px;
        color: #fff;
        font-family: 'Comic Sans MS', 'Microsoft JhengHei', cursive, sans-serif;
        box-shadow: 0 10px 30px rgba(0,0,0,0.6);
        display: none;
        z-index: 1000;
      }
      #quiz-header {
        display: flex; justify-content: space-between; align-items: center; 
        border-bottom: 2px dashed rgba(255,255,255,0.3); padding-bottom: 10px; margin-bottom: 15px;
      }
      #npc-name { 
        color: #f1c40f; font-weight: bold; font-size: 20px; text-decoration: underline;
      }
      #quiz-content {
        text-align: center; margin-bottom: 20px;
      }
      #q-text { 
        font-size: 32px; font-weight: bold; margin: 15px 0; letter-spacing: 2px;
        text-shadow: 2px 2px 0px rgba(0,0,0,0.3);
      }
      #feedback-text { 
        font-size: 18px; color: #ddd; min-height: 24px; margin-top: 5px; font-style: italic;
      }
      .correct-msg { color: #5dade2 !important; font-weight: bold; }
      .wrong-msg { color: #e74c3c !important; font-weight: bold; }
      #input-area { display: flex; justify-content: center; gap: 15px; }
      #ans-input {
        width: 120px; padding: 8px; font-size: 22px; text-align: center;
        background: rgba(255,255,255,0.1); border: 2px solid #fff; color: white; border-radius: 0;
        border-bottom-width: 4px;
      }
      #ans-input::placeholder { color: rgba(255,255,255,0.5); }
      #ans-input:focus { border-color: #f1c40f; outline: none; background: rgba(255,255,255,0.2); }
      #btn-submit {
        padding: 0 25px; background: #e67e22; border: 2px solid #d35400; 
        font-weight: bold; font-size: 18px; color: white; cursor: pointer;
        box-shadow: 2px 2px 0px #a04000;
      }
      #btn-submit:active { transform: translate(2px, 2px); box-shadow: none; }
      .fade-in { animation: fadeIn 0.3s ease-out; }
      @keyframes fadeIn { from { opacity: 0; transform: translate(-50%, 20px); } to { opacity: 1; transform: translate(-50%, 0); } }
    `;
    createElement('style', css);

    this.container = createDiv(`
      <div id="quiz-header">
        <span id="npc-name">${this.npcName}</span>
        <span style="font-size:12px; color:#ccc;">[ESC] 翹課</span>
      </div>
      <div id="quiz-content">
        <div id="q-text">準備好了嗎？</div>
        <div id="feedback-text">請在黑板上寫下答案...</div>
      </div>
      <div id="input-area">
        <input type="number" id="ans-input" placeholder="?" autocomplete="off">
        <button id="btn-submit">交卷</button>
      </div>
    `).id('quiz-box');

    this.qText = select('#q-text'); this.fText = select('#feedback-text');
    this.inputBox = select('#ans-input'); this.btnSubmit = select('#btn-submit');

    this.btnSubmit.mousePressed(() => this.checkAnswer());
    this.inputBox.elt.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.checkAnswer();
      if (e.key === 'Escape') this.close();
    });
  }

  open() {
    if (this.isActive) return;
    this.isActive = true;
    this.container.style('display', 'block');
    this.container.addClass('fade-in');
    this.nextQuestion();
  }

  close() {
    this.isActive = false;
    this.container.style('display', 'none');
    this.container.removeClass('fade-in');
  }

  update(canInteract) {
    if (this.isActive && !canInteract) { this.close(); }
  }

  nextQuestion() {
    let rowCount = this.table.getRowCount();
    let rIndex = floor(random(rowCount));
    this.currentQuestionRow = this.table.getRow(rIndex);

    this.qText.html(this.currentQuestionRow.getString('question'));
    this.fText.html('請在黑板上寫下答案...');
    this.fText.removeClass('correct-msg');
    this.fText.removeClass('wrong-msg');
    
    this.inputBox.value('');
    setTimeout(() => this.inputBox.elt.focus(), 100);
  }

  checkAnswer() {
    if (!this.currentQuestionRow) return;
    let playerAns = this.inputBox.value().trim();
    let correctAns = this.currentQuestionRow.getString('answer');

    if (playerAns === correctAns) {
      let msg = this.currentQuestionRow.getString('feedback_correct');
      this.fText.html(msg);
      this.fText.class('correct-msg');
      setTimeout(() => this.nextQuestion(), 1500);
    } else {
      let msg = this.currentQuestionRow.getString('feedback_wrong');
      let hint = this.currentQuestionRow.getString('hint');
      this.fText.html(`${msg}<br><span style="font-size:14px; color:#aaa; font-weight:normal;">(${hint})</span>`);
      this.fText.class('wrong-msg');
      this.inputBox.value('');
    }
  }
}