let Quran=[];

// 🔔 NOTIFICATION
function notify(msg){
  if(Notification.permission==="granted"){
    new Notification(msg);
  } else {
    Notification.requestPermission();
  }
}

// LOAD QURAN
async function loadQuran(){
  const res=await fetch("https://api.alquran.cloud/v1/quran/quran-uthmani");
  const data=await res.json();

  Quran=data.data.surahs;
  localStorage.setItem("quran",JSON.stringify(Quran));

  showSurahs();
  loadSidebar();
}

// SHOW SURAHS
function showSurahs(){
  let list=document.getElementById("surahList");
  list.innerHTML="";

  Quran.forEach(s=>{
    list.innerHTML += `
      <div class="surah" onclick="openSurah(${s.number})">
        ${s.number}. ${s.englishName}
      </div>
    `;
  });
}

// SIDEBAR
function loadSidebar(){
  let box=document.getElementById("sidebarSurahs");
  box.innerHTML="";

  Quran.forEach(s=>{
    box.innerHTML += `
      <div class="surah" onclick="openSurah(${s.number})">
        ${s.number}. ${s.englishName}
      </div>
    `;
  });
}

// OPEN SURAH
function openSurah(n){
  let s=Quran.find(x=>x.number==n);
  let content=document.getElementById("content");

  localStorage.setItem("lastRead", n);

  content.innerHTML=`<h2>${s.englishName}</h2>`;

  s.ayahs.forEach(a=>{
    content.innerHTML += `
      <div class="ayah">
        <div class="arabic">${a.text}</div>
        <button onclick="play(${n},${a.numberInSurah})">▶</button>
        <button onclick="bookmark(${n},${a.numberInSurah})">⭐</button>
        <button onclick="showTafsir(${a.number})">📖</button>
      </div>
    `;
  });
}

// AUDIO
let currentReciter = localStorage.getItem("reciter") || "ar.alafasy";

function play(s,a){
  new Audio(
    `https://cdn.islamic.network/quran/audio/128/${currentReciter}/${s}${a}.mp3`
  ).play();
}

// DOWNLOAD AUDIO
function downloadAudio(s,a){
  let url=`https://cdn.islamic.network/quran/audio/128/${currentReciter}/${s}${a}.mp3`;
  let link=document.createElement("a");
  link.href=url;
  link.download=`${s}_${a}.mp3`;
  link.click();
}

// BOOKMARK
function bookmark(s,a){
  let b=JSON.parse(localStorage.getItem("b")||"[]");
  b.push({s,a});
  localStorage.setItem("b",JSON.stringify(b));
}

// SIDEBAR CONTROL
function openSidebar(){
  document.getElementById("sidebar").classList.add("active");
  document.getElementById("overlay").classList.add("active");
}

function closeSidebar(){
  document.getElementById("sidebar").classList.remove("active");
  document.getElementById("overlay").classList.remove("active");
}

// THEME
function toggleTheme(){
  document.body.classList.toggle("light");
}

// NAMAZ TIMES
function showNamaz(){
  document.getElementById("namazPanel").classList.toggle("hidden");

  navigator.geolocation.getCurrentPosition(pos=>{
    let lat = pos.coords.latitude;
    let lon = pos.coords.longitude;

    fetch(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=2`)
    .then(r=>r.json())
    .then(data=>{
      let t = data.data.timings;

      document.getElementById("namazTimes").innerHTML = `
        Fajr: ${t.Fajr}<br>
        Dhuhr: ${t.Dhuhr}<br>
        Asr: ${t.Asr}<br>
        Maghrib: ${t.Maghrib}<br>
        Isha: ${t.Isha}
      `;

      // ✅ FIXED: NOTIFICATION OUTSIDE HTML
      notify("Time for Salah 🕌");
    });
  });
}

// TAFSIR
function showTafsir(ayah){
  fetch(`https://api.alquran.cloud/v1/ayah/${ayah}/en.asad`)
  .then(r=>r.json())
  .then(d=>{
    alert("Tafsir:\n\n" + d.data.text);
  });
}

// INIT
window.onload=()=>{
  Quran=JSON.parse(localStorage.getItem("quran")||"[]");

  if(Quran.length){
    showSurahs();
    loadSidebar();
  } else {
    loadQuran();
  }
};
