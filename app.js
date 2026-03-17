let surahs = JSON.parse(localStorage.getItem("quranData") || "null");

// DOWNLOAD ALL 114 SURAHS
document.getElementById("downloadBtn").onclick = async () => {

  alert("Downloading Quran...");

  let all = [];

  for(let i=1;i<=114;i++){

    let ar = await fetch(`https://api.alquran.cloud/v1/surah/${i}/ar.alafasy`).then(r=>r.json());
    let en = await fetch(`https://api.alquran.cloud/v1/surah/${i}/en.asad`).then(r=>r.json());

    let ayahs = ar.data.ayahs.map((a,index)=>({
      text:a.text,
      translation:en.data.ayahs[index].text,
      audio:a.audio
    }));

    all.push({
      number:i,
      name:ar.data.englishName,
      ayahs
    });

    console.log("Downloaded",i);
  }

  localStorage.setItem("quranData",JSON.stringify(all));
  alert("Done! Reload page.");
};

// LOAD LIST
if(surahs){
displaySurahs();
}

function displaySurahs(){
let list=document.getElementById("surahList");
list.innerHTML="";

surahs.forEach(s=>{
let btn=document.createElement("button");
btn.className="surahButton";
btn.textContent=s.number+" - "+s.name;
btn.onclick=()=>loadSurah(s.number);
list.appendChild(btn);
});
}

// LOAD SURAH
function loadSurah(num){

let s=surahs.find(x=>x.number===num);

localStorage.setItem("lastRead",num);

let reader=document.getElementById("reader");
reader.innerHTML="";

s.ayahs.forEach((a,i)=>{

let div=document.createElement("div");
div.className="ayah";

div.innerHTML=`
<div class="arabic">${a.text}</div>
<div class="translation">${a.translation}</div>

<audio controls src="${a.audio}"></audio>

<button onclick="bookmark(${num},${i})">⭐</button>
<button onclick="toggleMem(this)">🧠</button>
`;

let audio=div.querySelector("audio");

audio.onplay=()=>{
document.querySelectorAll(".ayah").forEach(x=>x.classList.remove("highlight"));
div.classList.add("highlight");
};

div.querySelector(".arabic").onclick=()=>{
alert(a.text.split(" ").join(" | "));
};

reader.appendChild(div);

});

}

// BOOKMARK
function bookmark(surah,ayah){
let b=JSON.parse(localStorage.getItem("bookmarks")||"[]");
b.push({surah,ayah});
localStorage.setItem("bookmarks",JSON.stringify(b));
alert("Saved ⭐");
}

// MEMORIZATION
function toggleMem(btn){
let a=btn.parentElement.querySelector(".arabic");
a.style.visibility=(a.style.visibility==="hidden")?"visible":"hidden";
}

// SEARCH
document.getElementById("search").oninput=function(){
let v=this.value.toLowerCase();
let list=document.getElementById("surahList");
list.innerHTML="";

surahs.filter(s=>s.name.toLowerCase().includes(v))
.forEach(s=>{
let btn=document.createElement("button");
btn.className="surahButton";
btn.textContent=s.number+" - "+s.name;
btn.onclick=()=>loadSurah(s.number);
list.appendChild(btn);
});
};

// RESUME
let last=localStorage.getItem("lastRead");
if(last && surahs){
loadSurah(parseInt(last));
}

// PROGRESS
document.getElementById("reader").onscroll=()=>{
let r=document.getElementById("reader");
let percent=(r.scrollTop/(r.scrollHeight-r.clientHeight))*100;
document.getElementById("progressBar").value=percent;
};

// THEME
document.getElementById("themeBtn").onclick=()=>{
document.body.classList.toggle("light");
};

// AUTO THEME
let h=new Date().getHours();
if(h>=6 && h<18) document.body.classList.add("light");