// ============================
// 🔥 QURAAN PRO FINAL APP.JS
// ============================

// GLOBALS
let Quran = [];
let currentSurah = null;
let currentAyahIndex = 0;

let loopMode = false;
let continueMode = false;

let reciter = localStorage.getItem("reciter") || "ar.alafasy";
let autoContinue = localStorage.getItem("autoContinue") === "true";
let loopDefault = localStorage.getItem("loopDefault") === "true";

let audio = new Audio();

// ============================
// 🔔 NOTIFY
// ============================
function notify(msg){
  if(Notification.permission === "granted"){
    new Notification(msg);
  } else {
    Notification.requestPermission();
  }
}

// ============================
// 📥 LOAD QURAN
// ============================
async function loadQuran(){
  try{
    const res = await fetch("https://api.alquran.cloud/v1/quran/quran-uthmani");
    const data = await res.json();

    Quran = data.data.surahs;

    showSurahs();
    loadSidebar();

    let last = localStorage.getItem("lastSurah");
    if(last){
      openSurah(parseInt(last));
    }

  }catch(e){
    console.error("Error:", e);
  }
}

// ============================
// 📜 MAIN LIST
// ============================
function showSurahs(){
  const list = document.getElementById("surahList");
  if(!list) return;

  let html = "";
  Quran.forEach(s=>{
    html += `
      <div class="surah" onclick="openSurah(${s.number})">
        ${s.number}. ${s.englishName}
      </div>
    `;
  });

  list.innerHTML = html;
}

// ============================
// 📂 SIDEBAR
// ============================
function loadSidebar(){
  const box = document.getElementById("sidebarSurahs");
  if(!box) return;

  let html = "";
  Quran.forEach(s=>{
    html += `
      <div class="surah" onclick="openSurah(${s.number}); closeSidebar();">
        ${s.number}. ${s.englishName}
      </div>
    `;
  });

  box.innerHTML = html;
}

function openSidebar(){
  document.getElementById("sidebar").classList.add("active");
}

function closeSidebar(){
  document.getElementById("sidebar").classList.remove("active");
}

// ============================
// 📖 OPEN SURAH
// ============================
function openSurah(num){
  currentSurah = Quran.find(s => s.number === num);
  if(!currentSurah) return;

  localStorage.setItem("lastSurah", num);

  const content = document.getElementById("content");

  let html = `<h2>${currentSurah.englishName}</h2>`;

  currentSurah.ayahs.forEach((a, i)=>{
    html += `
      <div class="ayah">
        <div class="arabic">${a.text}</div>

        <div class="controls">
          <button onclick="playAyah(${i})">▶️</button>
          <button onclick="toggleLoop(${i})">🔁</button>
          <button onclick="startContinue(${i})">⏭</button>
          <button onclick="bookmark(${i})">⭐</button>
        </div>
      </div>
    `;
  });

  content.innerHTML = html;
}

// ============================
// 🔊 AUDIO
// ============================
function playAyah(i){
  currentAyahIndex = i;

  let ayahNum = currentSurah.ayahs[i].number;
  audio.src = `https://cdn.islamic.network/quran/audio/128/${reciter}/${ayahNum}.mp3`;

  audio.play();
}

audio.onended = ()=>{
  if(loopMode || loopDefault){
    playAyah(currentAyahIndex);
  }

  if(continueMode || autoContinue){
    currentAyahIndex++;
    if(currentAyahIndex < currentSurah.ayahs.length){
      playAyah(currentAyahIndex);
    }
  }
};

// ============================
// 🔁 LOOP
// ============================
function toggleLoop(i){
  loopMode = true;
  continueMode = false;
  playAyah(i);
}

// ============================
// ⏭ CONTINUE
// ============================
function startContinue(i){
  continueMode = true;
  loopMode = false;
  playAyah(i);
}

// ============================
// ⭐ BOOKMARK
// ============================
function bookmark(i){
  localStorage.setItem("bookmark", JSON.stringify({
    surah: currentSurah.number,
    ayah: i
  }));
  notify("Bookmarked ⭐");
}

// ============================
// 🔍 SEARCH
// ============================
function searchSurah(q){
  q = q.toLowerCase();

  let filtered = Quran.filter(s =>
    s.englishName.toLowerCase().includes(q)
  );

  let list = document.getElementById("surahList");

  let html = "";
  filtered.forEach(s=>{
    html += `<div onclick="openSurah(${s.number})">${s.englishName}</div>`;
  });

  list.innerHTML = html;
}

// ============================
// 🌙 DARK MODE
// ============================
function toggleDark(){
  document.body.classList.toggle("dark");
  localStorage.setItem("dark", document.body.classList.contains("dark"));
}

if(localStorage.getItem("dark") === "true"){
  document.body.classList.add("dark");
}

// ============================
// ⚙️ SETTINGS
// ============================
function changeReciter(r){
  reciter = r;
  localStorage.setItem("reciter", r);
  notify("Reciter Changed 🎧");
}

function toggleAutoContinue(){
  autoContinue = !autoContinue;
  localStorage.setItem("autoContinue", autoContinue);
  notify("Auto Continue: " + autoContinue);
}

function toggleLoopDefault(){
  loopDefault = !loopDefault;
  localStorage.setItem("loopDefault", loopDefault);
  notify("Loop Default: " + loopDefault);
}

// ============================
// ⚙️ PANEL CONTROL
// ============================
function openSettings(){
  document.getElementById("settingsPanel").style.display = "block";
}

function closeSettings(){
  document.getElementById("settingsPanel").style.display = "none";
}

// ============================
// 🧹 RESET
// ============================
function resetApp(){
  localStorage.clear();
  location.reload();
}

// ============================
// 🚀 INIT
// ============================
window.onload = ()=>{
  loadQuran();
};
