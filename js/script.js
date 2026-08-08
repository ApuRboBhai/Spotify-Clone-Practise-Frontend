console.log("This website made by Apurbo")
const currentsong = new Audio()
let currFolder;
let songUl;
let songs;

function playmusic(track){
    
   
    currentsong.src = `${currFolder}/` + track.trim();
    currentsong.play();
    document.querySelector("#play").src = "img/pause.svg";

  document.querySelector(".songinfo").innerHTML = `<span>${track}</span>`; //moving 
   
   document.querySelector(".songtime").innerHTML="00:00/00:00";
  document.querySelector(".volume").style.display = "flex";
   

  // --- Highlight Currently Playing Song Logic ---
    let allSongs = document.querySelectorAll(".songlist li .songPlay");

    allSongs.forEach(songDiv => {
        
        songDiv.classList.remove("active-song"); 
        
   
        let songName = songDiv.querySelector(".two p").innerHTML.trim();
        if(songName === track.trim()) {
           
            songDiv.classList.add("active-song"); 
        }
    });
}



function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}


async function getsongs(folder) {
    currFolder =folder
//   let a = await fetch(`/${folder}/`);    Git remove
let a = await fetch(`${folder}/songs.json`);
  let data = await a.json();
 let songs = data.songs;

//Git remove
//   let response = await a.text();
//   let div = document.createElement("div");
//   div.innerHTML = response;
//   let tds = div.getElementsByTagName("a");
//   let songs = [];
//   for (let i = 0; i < tds.length; i++) {
//     const element = tds[i];
//     if (element.href.endsWith(".mp3")) {
//       songs.push(decodeURIComponent(element.href.split(`/${currFolder}/`)[1]).trim());
//     }
//   }

//List all the songs in library area
   let ul= document.querySelector(".songlist").getElementsByTagName("ul")[0];
   ul.innerHTML = "";
  let html = "";
  for (const song of songs) {
     html += 
`<li> 
    <div class="songPlay">
        <div class="songname">
            <img src="img/music.svg" alt="">
            <div class="two">
                <p>${song}</p>
                <h1>Apurbo</h1>
            </div>
        </div>
        
        <div class="second">
            <span>play now</span> 
            <img src="img/smallplay.svg" alt=""> 
        </div>
    </div>
</li>`;
  }
   ul.innerHTML = html;
 //add an event listener to play each song
Array.from(document.querySelectorAll(".songlist .two")).forEach(e=>{
    e.addEventListener("click",element=>{
let track =e.querySelector("p").innerHTML.trim()


playmusic(track)
    })
    
});


return songs
}
//display all the albums on the page
async function displayAlbum() {
    let trendingSongs = document.querySelector(".trendingSongs");
    let folders = ["Yo Yo Honey Singh","Sleepy song","Novel Songs","sad song","Jubin Nautiyal","Arijit Singh Songs","Jisan Khan Shuvo","Darshan Raval","Arman Alif","Atif Aslam Songs","DJ song"];
    //Git remove
//    let a = await fetch(`/Songs/`);
//     let response = await a.text();
//     let div = document.createElement("div");
//     div.innerHTML = response; 
//     let anchors = div.getElementsByTagName("a");
//     let trendingSongs = document.querySelector(".trendingSongs")
  
//     for (let i = 0; i < anchors.length; i++) {
//         const element = anchors[i];
    
//         if (element.href.includes("/Songs/")) {
//             let folder = element.href.split("/Songs/")[1];
            
//             if (folder === undefined || folder === "" || folder.includes(".")) {
//                  continue; 
//             }          
//             folder = folder.replace("/", ""); 
           for(let folder of folders){

               
               try {
                // git remove 
                let infoFetch = await fetch(`Songs/${folder}/info.json`);
                
                   
                   // Jodi file ta na thake tahole skip kore jabe, crash korbe na
                   if(!infoFetch.ok) {
                       console.log(`Error: ${folder} er bitore info.json nai ba path vul!`);
                       continue; 
                    }
                 

                let info = await infoFetch.json();

                trendingSongs.insertAdjacentHTML("beforeend", `
                    <div data-folder="${folder}" class="card">
                        <div class="innercard">
                            <div class="songcard">
                                <div class="pic">
                                    <img src="Songs/${folder}/cover.jpg" alt="">
                                </div>
                                <div class="h1h2">
                                    <h1>${info.title}</h1>
                                    <h2>${info.description}</h2>
                                </div>
                            </div>
                            <div class="Greenplay">
                                <img src="img/Greenplay.svg" alt="">
                            </div>
                        </div>
                    </div>`);
            } catch (err) {
                console.log(`Failed to load ${folder}:`, err);
            }
        }
    }
    // git remove
// }


async function main() {

  await displayAlbum();
    // লিস্ট লোড করা হচ্ছে
 songs = await getsongs("Songs/Yo Yo Honey Singh");

    // Attach an event listener to play, next and previous
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play();
            play.src = "img/pause.svg";
             document.querySelector('.songinfo span').style.animationPlayState = 'running';
        }
        else {
            currentsong.pause();
            play.src = "img/play.svg";
          document.querySelector('.songinfo span').style.animationPlayState = 'paused';
        }
    })

    // Add event listener to timeupdate
    currentsong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)}/${secondsToMinutesSeconds(currentsong.duration)}`;
    })

    // seekbar circle move right with currentsong with the songs currentime
    currentsong.addEventListener("timeupdate", (e) => {
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
    })

    // add eventlistner to click seekbar to change the circle any x axis location
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = ((currentsong.duration) * percent) / 100;
    })

    // Add eventlistner into the PreviousButton
    document.getElementById("previous").addEventListener("click", () => {
let index = songs.indexOf(decodeURIComponent(currentsong.src.split("/").pop()).trim());
        if ((index - 1) >= 0) {
            playmusic(songs[index - 1]);
        } else {
            playmusic(songs[songs.length - 1]);
        }
    })

    // Add eventlistner into the  Next Button
    document.getElementById("next").addEventListener("click", () => {
       let index = songs.indexOf(decodeURIComponent(currentsong.src.split("/").pop()).trim());
        if ((index + 1) < songs.length) {
            playmusic(songs[index + 1]);
        } else {
            playmusic(songs[0]);
        }
    })

    // Add event in menu bar to open left bar
    document.querySelector(".menu img").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0px";
        document.querySelector(".menu img").src = "img/cross.svg";
    })

    // Add event in cross bar to close left bar
    document.querySelector(".close img").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-320px";
        document.querySelector(".menu img").src = "img/menu.svg";
    });

    // Add volume event to decrease and increase the music volume
    document.querySelector(".range")?.getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentsong.volume = parseInt(e.target.value) / 100;
    })

    // Load the playlist whenever the card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getsongs(`Songs/${item.currentTarget.dataset.folder}`);
            document.querySelector(".left").style.left = "0px";
            document.querySelector(".text").style.display="none"
playmusic(songs[0])
            
              
        })
        
    })
//Add event listner to mute the track
let volImg = document.querySelector(".volume > img");

volImg.addEventListener("click", (e) => {
    // includes দিয়ে চেক করা হচ্ছে ফাইলের নামে volume.svg আছে কিনা
    if (volImg.src.includes("img/volume.svg")) {
        volImg.src = "img/mute.svg";
        currentsong.volume = "0"
        document.querySelector(".range").getElementsByTagName("input")[0].value = 0
    } else {
        volImg.src = "img/volume.svg";
        currentsong.volume = ".1"
        document.querySelector(".range").getElementsByTagName("input")[0].value = 10
    }
});


} 

main();