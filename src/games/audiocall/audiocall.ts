import { IWordsData, IWordData } from "../../types/types";
import { api } from "../../ts/api";

const numberOfPages = 30;

export class Audiocall {
  public getHTML(): string {
    return /*html*/ `
      <div class="audiocall mt-10">
        <h2>Мини-игра аудиовызов</h2>
        <h4> Игра направлена на тре&shy;ни&shy;ров&shy;ку навы&shy;ков ауди&shy;рова&shy;ния. В процес&shy;се 
        игры необ&shy;хо&shy;димо уга&shy;дать пе&shy;ре&shy;вод слова, произ&shy;несен&shy;ного на англий&shy;ском языке.</h4>
        <p>Для начала выбери сложность игры</p>
        <div id="levels" class="levels">
        <button data-level=0 class="btn">1</button>
        <button data-level=1 class="btn">2</button>
        <button data-level=2 class="btn">3</button>
        <button data-level=3 class="btn">4</button>
        <button data-level=4 class="btn">5</button>
        <button data-level=5 class="btn">6</button>
        </div>
      </div>
    `;
  }

  private getRandomNumber(max: number): number {
    return Math.floor(Math.random() * (max + 1));
  }

  getRandomArray(arr:IWordsData):IWordsData{
  for (let index = arr.length - 1; index > 0; index-=1) {
    let j = Math.floor(Math.random() * (index + 1));
    let elArr = arr[index];
    arr[index] = arr[j];
    arr[j] = elArr;
  }
  return arr;
};

  private getArrOfAnsvers(correctWord:IWordData, data:IWordsData):IWordsData {
     const arrOfAnsvrers = [correctWord];
     const numberWrongAnsvers = 3;
     const arrWrongAnswers = data.filter((wordData) => wordData.word!==correctWord.word);
     const randomAnswers = this.getRandomArray(arrWrongAnswers);
     for(let index = 0; index<numberWrongAnsvers; index+=1){
        arrOfAnsvrers.push(randomAnswers[index])      
     };
    return this.getRandomArray(arrOfAnsvrers);
     }

  public addListeners(): void {
    const levels = document.querySelector("#levels") as HTMLElement;
    levels.addEventListener("click", (e: Event): void => {
      const level = (e.target as HTMLElement).dataset.level;
      const group = Number(level); 
      const page = this.getRandomNumber(numberOfPages);
      api.getWords(group, page).then((words) => {
        //console.log(words);
        //console.log(this.getArrOfAnsvers(words[5],words))
        this.game (words[5], this.getArrOfAnsvers(words[5],words));
      });
    });
  }

  private getSrc (path: string): string {
    return `${api.baseUrl}/${path}`;
  };

  private createOffset (percent:number, length:number): string {
    const offset = length-percent/100*length;
    return String(offset);
  }

  private game (word: IWordData, arrAnsvers:IWordsData):void {
    const contentEl = document.querySelector("#content") as HTMLElement;
    const url = `${this.getSrc(word.image)}`;
    const backImg = `background-image:url(${url})`;
    const audioSrc = `${this.getSrc(word.audio)}`;

    contentEl.innerHTML = `
    <div class="game-audio">
      <div class="game-header">
        <div class="game-header__progress">
          <svg class="game-header__progress_svg">
              <circle id="circle" class="game-header__progress_circle" fill="none" r="45">
          </svg>
          <div id="textPtogress" class="game-header__progress_text">
          0/20
          </div>
        </div>
        <div class="game-header__settings">
          <div class="game-header__settings_sound"></div>
          <div class="game-header__settings_full"></div>
        </div>
      </div>
      <div id="image" class="game-main__word_image" style=${backImg}>
        <button id="sound-btn" class="game-main__word_sound">
          <div id="animation" class="game-main__word_animate"></div>
        </button>
        <div id="correct-word" class="game-main__word_en hide">${word.word} ${word.transcription} </div>
      </div>
      <div id="ansvers" class="game-main__word_ansvers"></div>
      <button id="next" class="btn button-ansvers_dont-know"> Не знаю </button>
    </div>
    `;

    const audio = new Audio(audioSrc);
    audio.play();
    const audioAnimateElement = document.getElementById("animation") as HTMLElement;
    const audioAnimate = audioAnimateElement.animate([{transform: 'scale(1)', opacity:1},
          {transform: 'scale(1.4)', opacity:0.1}],
          {duration: 600, iterations: Infinity})
    audio.addEventListener('ended',()=>audioAnimate.cancel());

    const audioButton=document.getElementById("sound-btn") as HTMLButtonElement;
    audioButton.addEventListener("click",()=>{
      audio.play();
      audioAnimate.play();
   })

  const circle=document.getElementById("circle") as unknown as SVGCircleElement;
  const radius=circle.r.baseVal.value;
  const length = 2*Math.PI*radius;
  circle.style.strokeDasharray=`${length} ${length}`;
  circle.style.strokeDashoffset = `${length}`;

  const ansvers= document.getElementById('ansvers') as HTMLElement;
  const contentProgress=document.getElementById('textPtogress') as HTMLElement;
  const buttonNext=document.getElementById('next') as HTMLButtonElement;
  const correctWord = document.getElementById('correct-word') as HTMLElement;
  const stepProgress=5;
  let progress=0;
  let textProgress=0;

  arrAnsvers.forEach((wordData:IWordData )=> {
  const button  = document.createElement("button");
  button.textContent = wordData.wordTranslate;
  button.className="btn button-ansvers"
  ansvers.append(button);  
  button.addEventListener('click',()=>{
    progress+=stepProgress;
    textProgress+=1;
    circle.style.strokeDashoffset = this.createOffset(progress,length);
    contentProgress.textContent=`${textProgress}/20`;
    ansvers.querySelectorAll('button').forEach(btn => {
      btn.disabled=true;
      btn.style.cursor="default";
    });
    buttonNext.textContent="Дальше";
    correctWord.classList.remove('hide');
    audioButton.classList.add('after-select')



    if(button.textContent === word.wordTranslate){
      button.style.background="#00FF7F";
    } else {
      button.style.background="#CD5C5C";
    }
  })
    });
  }
}
