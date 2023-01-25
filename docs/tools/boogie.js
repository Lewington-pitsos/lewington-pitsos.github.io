const form = document.querySelector('.my-form');
const btns = document.querySelectorAll(".my-form button");
const resultPrompts = document.getElementById("result-prompts");
const resultStrengths = document.getElementById("result-strengths");
const resultContainer = document.getElementById("result-container");


function hideResults() {
  if(resultContainer.style.display == '') {
    resultContainer.style.display = 'none';
  }
}

function showResults() {
  if(resultContainer.style.display == 'none') {
    resultContainer.style.display = '';
  }
}

function calculateBeatFrames(secondsPerBeat, fps, totalFrames) {
  const beatFrames = [0];

  var nextBeatTime = secondsPerBeat
  var nextFrameTime = 1/fps

  for (let frame = 1; frame <= totalFrames; frame++) {
    if (nextFrameTime >= nextBeatTime) {
      beatFrames.push(frame);
      nextBeatTime += secondsPerBeat;
    }
    nextFrameTime += 1/fps;
  }

  return beatFrames;
}

function calculatePromptFrames(prompts, frames, framesPerPrompt) {
  const data = {}

  for (let index = 0; index < prompts.length; index++) {
    const prompt = prompts[index];

    data[frames[index]] = prompt;
    
  }

  if (frames.length > prompts.length) {
    for (let index = prompts.length; index < frames.length; index++) {
      const frame = frames[index];
      data[frame] = prompts[prompts.length - 1];
    }
  }

  return data;
}


function calculateStrengths(beatFrames, highStrength, lowStrength, holdFrames) {
  const strengths = []

  for (let index = 0; index < beatFrames.length; index++) {
    const frame = beatFrames[index];
    
    if (index > 0) { 
      strengths.push([frame - 1, lowStrength]);
    }
    strengths.push([frame, lowStrength]);
    strengths.push([frame + 1, highStrength]);
    strengths.push([frame + holdFrames, highStrength]);
  }  

  return strengths;
}

function displayResults(promptFrames, strengths) {
  var promptRep = "{<br>"
  for (const [key, value] of Object.entries(promptFrames)) {
    console.log(key, value);
    promptRep += `"${key}": "${value}",\n<br>`
  }

  promptRep = promptRep.slice(0, promptRep.length-6)+"<br>";
  promptRep += "}"
  resultPrompts.innerHTML = promptRep;

  var strengthRep = ""
  for (const [frame, value] of strengths) {
    strengthRep += `${frame}:(${value}), `
  }
  strengthRep = strengthRep.slice(0, strengthRep.length - 2);
  resultStrengths.innerHTML = strengthRep;
}

function submitForm(event) {
  event.preventDefault();
  const data = event.target;

  const secondsPerBeat = 60 / data['bpm'].value;

  const beatFrames = calculateBeatFrames(secondsPerBeat, data['fps'].value, data['total-frames'].value);

  console.log(beatFrames);

  const splitPrompts = data['prompts'].value.split('\n');

  const promptFrames = calculatePromptFrames(splitPrompts, beatFrames, 1);
  
  const strengths = calculateStrengths(beatFrames, data['high-strength'].value, data['low-strength'].value, parseInt(data['hold-frames'].value));

  displayResults(promptFrames, strengths);
  showResults();
}

form.addEventListener('submit', submitForm);


function copyClipboard(id) {
  const element = document.getElementById(id);
  console.log(element.innerHTML);
  navigator.clipboard.writeText(element.innerHTML.replace(/<br>/g, ""));
}