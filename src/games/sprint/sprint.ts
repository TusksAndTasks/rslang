import { IWordData, ISprintWord, EPage} from "../../types/types";
import { model, view } from "../../ts";

export class Sprint {
  
  private sprintCorrectness: boolean;
  private timerArray: Array<NodeJS.Timer>;
  private streak: number;

  constructor(){
    this.sprintCorrectness = true;
    this.timerArray = [];
    this.streak = 0;
  }


  public getHTML(): string {
    model.sprintStatData = {
      correctWords: [],
      incorrectWords: [],
      learnedWords: [],
      maxStreak: 0
    };
    return /*html*/`
      <h2>Мини-игра спринт</h2>
      <div class="sprint">
        <div class="sprint__count-box" id="sprint-count-box">
          <div class="sprint__current-count" id="sprint-current-count"></div>
          <div class="sprint__streak" id="sprint-streak"></div>
          <div class="sprint__score" id="sprint-score"></div>
        </div>
        <div class="sprint__timer" id="sprint-timer">60</div>
        <div class="sprint__word-box">
          <div class="sprint__word" id="sprint-word"></div>
          <div class="sprint__transcription" id="sprint-translation"></div>
        </div>
        <div class="sprint__answer-box">
          <button class="sprint__wrong-answer" id="sprint-wrong">Неверно!</button>
          <button class="sprint__right-answer" id="sprint-right">Верно!</button>
        </div>  
      </div>
    `;
  }

  private createRandomNumber(): number {
    return Math.random() < 0.5 ? -1 : 1;
  }

  private sortWords(): Array<IWordData> {
    return [...model.wordsArray].sort((firstWord, secondWord) => {
      return this.createRandomNumber();
    })
  }

  private createQuestionsArray(): Array<ISprintWord> {
    const questionsArray: Array<number> = new Array(model.wordsArray.length).fill(0);
    const sortedArray = this.sortWords();


    return questionsArray.map((el, index) : ISprintWord => {
      let element = {word: '', wordTranslate: '', correct: true};
      element.word = sortedArray[index].word;
      if (this.createRandomNumber() > 0) {
        element.wordTranslate = sortedArray[index].wordTranslate;
        element.correct = true;
      } else {
        element.wordTranslate = sortedArray.filter(elem => elem.word !== element.word)[Math.floor(Math.random() * (sortedArray.length - 1))].wordTranslate;
        element.correct = false;
      }
      return element;
    })
  }

  private stopSprint(){
    model.activePage = EPage.sprintStat;
    view.renderContent(model.activePage);
    model.updateSprintStatData(null, null, null, this.streak);
    this.streak = 0;
  }

  private setWord(word: HTMLElement, translation: HTMLElement, questionsArray: Array<ISprintWord>, index: number): void{
    if (index === questionsArray.length){
      this.stopSprint();
      clearInterval(this.timerArray[0]);
      return
    }
    word.innerHTML = questionsArray[index].word;
    translation.innerHTML = questionsArray[index].wordTranslate;
    this.sprintCorrectness = questionsArray[index].correct;
  }

  private countCorrectAnswer(word: HTMLElement): void {
     const currentCount = document.getElementById('sprint-current-count') as HTMLElement;
     const score = document.getElementById('sprint-score') as HTMLElement;
     const streak = document.getElementById('sprint-streak') as HTMLElement;
     const rightAudio = new Audio();
     rightAudio.src = '../../assets/sounds/Right-answer.mp3'
     let wordName = word.innerHTML;
     let correctWord = model.wordsArray.find((elem) => elem.word === wordName);
     model.updateSprintStatData(correctWord);

     switch(this.streak) {
       case 0:
       case 1:
       case 2: 
        rightAudio.play();
        this.streak++
        currentCount.innerHTML = '+50'
        score.innerHTML = (+score.innerHTML + 50).toString();
        streak.innerHTML = 'Dope!';
        break;
       
       case 3:
       case 4: 
       case 5:
        rightAudio.play();
        this.streak++
        currentCount.innerHTML = '+100'
        score.innerHTML = (+score.innerHTML + 100).toString();
        streak.innerHTML = 'Cool!';
        break;

       case 6:
       case 7: 
       case 8:
        rightAudio.play();
        this.streak++
        currentCount.innerHTML = '+150'
        score.innerHTML = (+score.innerHTML + 150).toString();
        streak.innerHTML = 'Brilliant!';
        break; 

       case 9:
       case 10: 
       case 11:
        rightAudio.play();
        this.streak++
        currentCount.innerHTML = '+200'
        score.innerHTML = (+score.innerHTML + 200).toString();
        streak.innerHTML = 'Amazing!';
        break;
        
       default: 
        rightAudio.play();
        this.streak++
        currentCount.innerHTML = '+250'
        score.innerHTML = (+score.innerHTML + 250).toString();
        streak.innerHTML = 'Spectacular!';
        break;
     }
  }

  private countIncorrectAnswer(word: HTMLElement) {
    const currentCount = document.getElementById('sprint-current-count') as HTMLElement;
    const streak = document.getElementById('sprint-streak') as HTMLElement;
    const wrongAudio = new Audio();
    wrongAudio.src = '../../assets/sounds/Wrong-answer.mp3';
    let wordName = word.innerHTML;
    let incorrectWord = model.wordsArray.find((elem) => elem.word === wordName);
    model.updateSprintStatData(null, incorrectWord, null, this.streak);
    this.streak = 0;
    wrongAudio.play();
    currentCount.innerHTML = '+0';
    streak.innerHTML = 'Dope!';
  }

  private setCheckListeners(): void {
    const word = document.getElementById('sprint-word') as HTMLElement;
    const translation = document.getElementById('sprint-translation') as HTMLElement;
    const questionsArray = this.createQuestionsArray();
    const correctButton = document.getElementById('sprint-right') as HTMLElement;
    const incorrectButton = document.getElementById('sprint-wrong') as HTMLElement;
    let index = 0;

    this.setWord(word, translation, questionsArray, index);

    correctButton.addEventListener('click', () => {
      if (this.sprintCorrectness){
        this.countCorrectAnswer(word);
        index++;
        this.setWord(word, translation, questionsArray, index);
      }
      else if (!this.sprintCorrectness) {
        this.countIncorrectAnswer(word);
        index++;
        this.setWord(word, translation, questionsArray, index);
      }
    })

    incorrectButton.addEventListener('click', () => {
      if (!this.sprintCorrectness){
        this.countCorrectAnswer(word);
        index++;
        this.setWord(word, translation, questionsArray, index);
      }
      else if (this.sprintCorrectness) {
        this.countIncorrectAnswer(word);
        index++;
        this.setWord(word, translation, questionsArray, index);
      }
    })

  }

  private setTimer(id: NodeJS.Timer) {
  const timer = document.getElementById('sprint-timer') as HTMLElement;

  timer.innerHTML = model.sprintTimer.toString();
  
  model.sprintTimer--;
  
    if (model.sprintTimer === -1){
          this.clearTimer(id);
          this.stopSprint();
    }
  }

  private clearTimer(id: NodeJS.Timer){
    clearInterval(id);
    this.timerArray.shift();
    model.sprintTimer = 59;
  }


  private setClearTimerListeners(){
    const header = document.getElementById('header') as HTMLElement;

    header.addEventListener('click',(e) => {
      if ((e.target as HTMLElement).classList.contains('btn') && (e.target as HTMLElement).id !== 'sprint-btn' ||
      (e.target as HTMLElement).id === 'sprint-btn' && this.timerArray.length > 1){
        clearInterval(this.timerArray[0]);
        this.timerArray.shift();
        model.sprintTimer = 59;
        this.streak = 0;
      } 
      });
  }

  private startTimer() {
    const id = setInterval(() => {this.setTimer(id)}, 1000);
    this.timerArray.push(id);
    this.setClearTimerListeners();
  }

  public startSprint(): void{
    this.startTimer();
    this.setCheckListeners();
}


} 

