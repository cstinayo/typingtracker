
//elements
const button = document.getElementById('button');
const button_format = document.getElementById('button_format');
const wpm = document.getElementById('wpm');
const start_text = document.getElementById('start_text');

//declared variables
let wordCount = 0;
let tracking = false;
let time = 0;
let buttonCount = 1; 
//1 = start button shown
//2 = stop button shown 
intervalId = null;
//will this part work?
let startTime = 0; 

button.addEventListener('click', () => {
    if(buttonCount === 1){
        tracking = true; 
        //document.getElementById("img").src = img.src.replace("_t", "_b");
        //button_format.src = button_format.src.replace("image_orig", "image_now");
        button_format.src = 'image_now';
        buttonCount = 2; 
        startTime = Date.now();
        start_text.style.opacity = "0.0"
        intervalId = setInterval(updateWPM, 500);

    }
    else if(buttonCount === 2){
        tracking = false; 
        //button_format.src = button_format.src.replace("image_orig", "image_now");
        button_format.src = 'image_now';
        buttonCount = 1; 
        startTime = 0; 
        wordCount = 0;
        start_text.style.opacity = "1.0";
        clearInterval(intervalId);
        intervalId = null;
        wpm.textContent = "Not Currently Tracking";

    }
    else{
        wpm.textContent = "error";
    }
});

function updateWPM(){
    if(!tracking || !startTime) return;
    const elapsedMinutes = (Date.now() - startTime) / 60000;
    const wordsPerMinute = elapsedMinutes > 0 ? Math.round(wordCount / elapsedMinutes) : 0;
    wpm.textContent = `WPM: ${wordsPerMinute}`;
}

document.addEventListener('input', (event) => {
    if (!tracking) return;
  
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
      wordCount = (event.target.value.trim().match(/\S+/g) || []).length;
    }
  });

  function authenticate(callback) {
    chrome.identity.getAuthToken({ interactive: true }, function(token) {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        return;
      }
      callback(token);
    });
  }

  function getWordCount(token, documentId, callback) {
    fetch(`https://docs.googleapis.com/v1/documents/${documentId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      let wordCount = 0;
  
      if (data.body && data.body.content) {
        data.body.content.forEach(element => {
          if (element.paragraph) {
            element.paragraph.elements.forEach(e => {
              if (e.textRun && e.textRun.content) {
                wordCount += e.textRun.content.trim().split(/\s+/).filter(Boolean).length;
              }
            });
          }
        });
      }
  
      callback(wordCount);
    })
    .catch(err => console.error("Docs API error:", err));
  }
  

