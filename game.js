let answer = "MONEY IS POWER";
let category = "FINANCIAL LITERACY";
let guessed = new Set();
let puzzleList = ["MONEY IS POWER"];
let hintList = ["FINANCIAL LITERACY"];
let puzzleIndex = 0;
let currentRound=1;
let timer=60, timerId=null;

const letters="ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const wheelValues=["RM100","RM500","RM1,000","LOSE TURN","RM200","RM750","BANKRUPT","RM300"];

function renderPuzzle(){
  const p=document.getElementById("puzzle");
  p.innerHTML="";
  answer.toUpperCase().split(" ").forEach((word,wi)=>{
    const wd=document.createElement("div"); wd.className="word";
    [...word].forEach(ch=>{
      const el=document.createElement("div"); el.className="letter";
      el.textContent=guessed.has(ch)?ch:"";
      wd.appendChild(el);
    });
    p.appendChild(wd);
    if(wi<answer.split(" ").length-1){
      const sp=document.createElement("div");sp.className="space";p.appendChild(sp);
    }
  });
}

function renderKeyboard(){
  const kb=document.getElementById("keyboard");kb.innerHTML="";
  letters.forEach(l=>{
    const b=document.createElement("button");b.className="key";b.textContent=l;
    b.disabled=guessed.has(l);b.onclick=()=>guess(l);kb.appendChild(b);
  });
}
function guess(l){
  guessed.add(l);
  const exists=answer.toUpperCase().includes(l);
  const st=document.getElementById("status");
  st.textContent=exists ? `✅ ${l} is correct!` : `❌ No ${l} in the answer.`;
  st.className="status "+(exists?"good":"bad");
  renderPuzzle();renderKeyboard();
  if([...answer.toUpperCase()].filter(c=>c!==" ").every(c=>guessed.has(c))) {
    st.textContent="🎉 PUZZLE SOLVED!";
    st.className="status good";
  }
}
function applyCurrentPuzzle(){
  answer=(puzzleList[puzzleIndex]||"MONEY IS POWER").trim().toUpperCase();
  category=(hintList[puzzleIndex]||"FINANCIAL LITERACY").trim().toUpperCase();
  guessed.clear();
  document.getElementById("category").textContent=category;
  document.getElementById("status").textContent="Choose a letter!";
  document.getElementById("status").className="status";
  document.getElementById("puzzleCounter").textContent=`Puzzle ${puzzleIndex+1} / ${puzzleList.length}`;
  renderPuzzle();renderKeyboard();
}

function loadPuzzleList(){
  const rawHints=document.getElementById("hintInput").value;
  hintList=rawHints.split(/\n/).map(x=>x.trim()).filter(Boolean);

  const raw=document.getElementById("answersInput").value;
  puzzleList=raw.split(/\n/).map(x=>x.trim()).filter(Boolean).map(x=>x.toUpperCase());
  if(!puzzleList.length) puzzleList=["MONEY IS POWER"];
  puzzleIndex=0;
  applyCurrentPuzzle();
}

function nextPuzzle(){
  if(!puzzleList.length) loadPuzzleList();
  else {
    puzzleIndex=(puzzleIndex+1)%puzzleList.length;
    applyCurrentPuzzle();
  }
}

function prevPuzzle(){
  if(!puzzleList.length) loadPuzzleList();
  else {
    puzzleIndex=(puzzleIndex-1+puzzleList.length)%puzzleList.length;
    applyCurrentPuzzle();
  }
}

function loadPuzzle(){
  loadPuzzleList();
}

function revealAnswer(){
  answer.toUpperCase().replace(/[^A-Z]/g,"").split("").forEach(c=>guessed.add(c));
  document.getElementById("status").textContent="💡 ANSWER REVEALED";
  document.getElementById("status").className="status good";
  renderPuzzle();renderKeyboard();
}
function resetPuzzle(){loadPuzzle()}

function resetTimer(){
  clearInterval(timerId);timer=60;document.getElementById("timer").textContent=timer;
}
function startTimer(){
  clearInterval(timerId);
  timerId=setInterval(()=>{
    timer--;document.getElementById("timer").textContent=timer;
    if(timer<=0){clearInterval(timerId);document.getElementById("status").textContent="⏰ TIME'S UP!";document.getElementById("status").className="status bad";}
  },1000);
}
function nextRound(){
  currentRound++;
  document.getElementById("round").textContent=currentRound;
  resetTimer();
  nextPuzzle();
}
function spinWheel(){
  const wheel=document.getElementById("wheel");
  const idx=Math.floor(Math.random()*wheelValues.length);
  const degrees=1440+idx*(360/wheelValues.length)+Math.random()*20;
  wheel.style.transform=`rotate(${degrees}deg)`;
  document.getElementById("wheelResult").textContent="Spinning...";
  setTimeout(()=>document.getElementById("wheelResult").textContent="🎯 "+wheelValues[idx],3000);
}
loadPuzzleList();

function toggleHostPanel(){

  document.body.classList.toggle("host-hidden");

}


