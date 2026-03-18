let Quran=[];
let currentReciter=localStorage.getItem("reciter")||"ar.alafasy";

// LOAD
async function loadQuran(){
  let res = await fetch("https://api.alquran.cloud/v1/quran/quran-uthmani");
  let data = await res.json();

  Quran = data.data.surahs;

  // ✅ LOAD AFTER DATA READY
  loadSidebar();
}

// SIDEBAR
function loadSidebar(){
  let box = document.getElementById("sidebarSurahs");

  let html = "";

  Quran.forEach(s=>{
    html += `
    `;
  });

  box.innerHTML = html;
}

// SEARCH
function searchSurah(q){
  let box=document.getElementById("sidebarSurahs");
  let html="";
  Quran.filter(s=>s.englishName.toLowerCase().includes(q.toLowerCase()))
  .forEach(s=>{
    html+=`<div class="surah" onclick="openSurah(${s.number})">${s.englishName}</div>`;
  });
  box.innerHTML=html;
}

// OPEN SURAH
function openSurah(n){
  let s = Quran.find(x=>x.number==n);

  if(!s){
    alert("Loading... try again");
    return;
  }

  let c = document.getElementById("content");

  let html = `<h2>${s.englishName}</h2>`;

  s.ayahs.forEach(a=>{
    html += `
      <div class="ayah">
        <div class="arabic">${a.text}</div>

        <button onclick="play(${n},${a.numberInSurah})">▶</button>
      </div>
    `;
  });

  c.innerHTML = html;
}

      <button onclick="play(${n},${a.numberInSurah})">▶</button>
      <button onclick="bookmark(${n},${a.numberInSurah})">⭐</button>
      <button onclick="loopAyah(${n},${a.numberInSurah})">🔁</button>
      <button onclick="showTafsir(${a.number})">📖</button>
    </div>`;
  });

  c.innerHTML=html;
}

// AUDIO
function play(s,a){
  new Audio(`https://cdn.islamic.network/quran/audio/128/${currentReciter}/${s}${a}.mp3`).play();
}

// LOOP
function loopAyah(s,a){
  let audio=new Audio(`https://cdn.islamic.network/quran/audio/128/${currentReciter}/${s}${a}.mp3`);
  audio.loop=true;
  audio.play();
}

// BOOKMARK
function bookmark(s,a){
  let b=JSON.parse(localStorage.getItem("b")||"[]");
  b.push({s,a});
  localStorage.setItem("b",JSON.stringify(b));
}

// BOOKMARK VIEW
function showBookmarks(){
  let b=JSON.parse(localStorage.getItem("b")||"[]");
  let c=document.getElementById("content");

  let html="<h2>Bookmarks</h2>";
  b.forEach(x=>{
    html+=`<div class="ayah">Surah ${x.s} Ayah ${x.a}</div>`;
  });

  c.innerHTML=html;
}

// SETTINGS
function openSettings(){
  document.getElementById("settingsPanel").classList.toggle("hidden");

  document.getElementById("settingsPanel").innerHTML=`
    <h3>Settings</h3>
    <select onchange="changeReciter(this.value)">
      <option value="ar.alafasy">Alafasy</option>
      <option value="ar.husary">Husary</option>
    </select>
  `;
}

// CHANGE RECITER
function changeReciter(r){
  currentReciter=r;
  localStorage.setItem("reciter",r);
}

// NAMAZ
function showNamaz(){
  document.getElementById("namazPanel").classList.toggle("hidden");

  navigator.geolocation.getCurrentPosition(pos=>{
    fetch(`https://api.aladhan.com/v1/timings?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}`)
    .then(r=>r.json())
    .then(d=>{
      let t=d.data.timings;
      document.getElementById("namazTimes").innerHTML=
      `Fajr:${t.Fajr}<br>Dhuhr:${t.Dhuhr}<br>Asr:${t.Asr}<br>Maghrib:${t.Maghrib}<br>Isha:${t.Isha}`;
    });
  });
}

// QIBLA
function showQibla(){
  document.getElementById("qiblaPanel").classList.toggle("hidden");

  window.addEventListener("deviceorientation",e=>{
    document.getElementById("compass").style.transform=`rotate(${e.alpha}deg)`;
  });
}

// TAFSIR
function showTafsir(a){
  fetch(`https://api.alquran.cloud/v1/ayah/${a}/en.asad`)
  .then(r=>r.json())
  .then(d=>alert(d.data.text));
}

// SIDEBAR
function openSidebar(){
  document.getElementById("sidebar").classList.add("active");
  document.getElementById("overlay").classList.add("active");
}
function closeSidebar(){
  document.getElementById("sidebar").classList.remove("active");
  document.getElementById("overlay").classList.remove("active");
}

// HOME
function showHome(){
  document.getElementById("content").innerHTML="<h2>Select Surah 📖</h2>";
}

// INIT
window.onload=()=>{
  loadQuran();
  showHome();
};
// ============================
// ⚙️ SETTINGS SYSTEM
// ============================

let reciter = localStorage.getItem("reciter") || "ar.alafasy";
let autoContinue = localStorage.getItem("autoContinue") === "true";
let loopDefault = localStorage.getItem("loopDefault") === "true";
let notificationsOn = localStorage.getItem("notifications") !== "false";

// ============================
// 🎧 CHANGE RECITER
// ============================
function changeReciter(r){
  reciter = r;
  localStorage.setItem("reciter", r);
  notify("Reciter Changed 🎧");
}

// ============================
// 🌙 DARK MODE (SAVE)
// ============================
function toggleDark(){
  document.body.classList.toggle("dark");
  localStorage.setItem("dark", document.body.classList.contains("dark"));
}

// LOAD DARK MODE
if(localStorage.getItem("dark") === "true"){
  document.body.classList.add("dark");
}

// ============================
// 🔠 FONT SIZE
// ============================
function changeFont(size){
  document.documentElement.style.setProperty("--fontSize", size + "px");
  localStorage.setItem("fontSize", size);
}

// LOAD FONT
let savedFont = localStorage.getItem("fontSize");
if(savedFont){
  document.documentElement.style.setProperty("--fontSize", savedFont + "px");
}

// ============================
// 🔁 LOOP DEFAULT
// ============================
function toggleLoopDefault(){
  loopDefault = !loopDefault;
  localStorage.setItem("loopDefault", loopDefault);
  notify("Loop Default: " + loopDefault);
}

// ============================
// ⏭ AUTO CONTINUE
// ============================
function toggleAutoContinue(){
  autoContinue = !autoContinue;
  localStorage.setItem("autoContinue", autoContinue);
  notify("Auto Continue: " + autoContinue);
}

// ============================
// 🔔 NOTIFICATIONS
// ============================
function toggleNotifications(){
  notificationsOn = !notificationsOn;
  localStorage.setItem("notifications", notificationsOn);
  notify("Notifications: " + notificationsOn);
}

// UPDATE AUDIO BEHAVIOR
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
