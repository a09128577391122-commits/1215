class DialogueManager {
  constructor(quizManager) {
    this.isActive = false;
    this.npcName = "角色2";
    this.quizManager = quizManager;
    this.currentQuestion = null;
    this.feedback = "";
    
    this.container = createDiv('');
    this.container.id('dialogue-box');
    
    let css = `
      #dialogue-box {
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        width: 600px;
        background: rgba(20, 25, 40, 0.95);
        border: 2px solid #4a90e2;
        border-radius: 10px;
        padding: 20px;
        color: white;
        font-family: 'Microsoft JhengHei', sans-serif;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        display: none;
        z-index: 1000;
        backdrop-filter: blur(5px);
      }
      #dialogue-header {
        font-size: 18px;
        font-weight: bold;
        color: #f1c40f;
        margin-bottom: 10px;
        display: flex;
        justify-content: space-between;
      }
      #dialogue-content {
        font-size: 16px;
        line-height: 1.5;
        min-height: 50px;
        margin-bottom: 15px;
        color: #ddd;
      }
      #dialogue-input-area {
        display: flex;
        gap: 10px;
      }
      #dialogue-input {
        flex-grow: 1;
        background: rgba(255,255,255,0.1);
        border: 1px solid #555;
        color: white;
        padding: 8px 12px;
        border-radius: 4px;
        outline: none;
      }
      #dialogue-input:focus {
        border-color: #4a90e2;
        background: rgba(255,255,255,0.2);
      }
      #btn-send {
        background: #4a90e2;
        border: none;
        color: white;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
      }
      #btn-send:hover {
        background: #357abd;
      }
      .fade-in { animation: fadeIn 0.3s ease-out; }
      @keyframes fadeIn { from { opacity: 0; transform: translate(-50%, 20px); } to { opacity: 1; transform: translate(-50%, 0); } }
    `;
    createElement('style', css);
    
    this.container.html(`
      <div id="dialogue-header">
        <span id="npc-name">${this.npcName}</span>
        <span style="font-size:12px; color:#888;">[ESC] 離開</span>
      </div>
      <div id="dialogue-content">你好，旅人。準備好回答問題了嗎？</div>
      <div id="dialogue-input-area">
        <input type="text" id="dialogue-input" placeholder="輸入你的答案..." autocomplete="off">
        <button id="btn-send">發送</button>
      </div>
    `);

    this.inputBox = select('#dialogue-input');
    this.sendBtn = select('#btn-send');
    this.contentBox = select('#dialogue-content');

    this.sendBtn.mousePressed(() => this.handleInput());
    
    this.inputBox.elt.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.handleInput();
      if (e.key === 'Escape') this.close();
    });
  }

  open() {
    if (this.isActive) return;
    this.isActive = true;
    this.container.style('display', 'block');
    this.container.addClass('fade-in');
    
    this.currentQuestion = this.quizManager.getRandomQuestion();
    this.setDialogueContent(this.currentQuestion.question);
    
    setTimeout(() => this.inputBox.elt.focus(), 100);
  }

  close() {
    this.isActive = false;
    this.container.style('display', 'none');
    this.container.removeClass('fade-in');
  }

  handleInput() {
    let answer = this.inputBox.value().trim();
    if (!answer) return;

    this.inputBox.value('');
    this.checkAnswer(answer);
  }

  checkAnswer(answer) {
    if (parseInt(answer) === this.currentQuestion.answer) {
      this.feedback = this.currentQuestion.correctFeedback;
    } else {
      this.feedback = this.currentQuestion.incorrectFeedback;
    }
    this.setDialogueContent(this.feedback);
    
    // 重新開啟問題
    setTimeout(() => {
      this.currentQuestion = this.quizManager.getRandomQuestion();
      this.setDialogueContent(this.currentQuestion.question);
    }, 2000);
  }

  setDialogueContent(text) {
    this.contentBox.html(text);
  }
}