import { IWordData, ISprintWord, EPage, IWord, IAuthObject, IUserWord} from "../../types/types";
import { model, view } from "../../ts";
import { api } from "../../ts/api";

export class Sprint {
  
  private sprintCorrectness: boolean;
  private streak: number;
  private viewChanged: boolean;
  private index: number;

  constructor(){
    this.sprintCorrectness = true;
    this.streak = 0;
    this.viewChanged = false;
    this.index = 0;
  }


  public getHTML(): string {
    return `
      <h2 class="sprint-title">Мини-игра спринт</h2>
      <div class="sprint">
        <div class="sprint__count-box" id="sprint-count-box">
          <div class="sprint__current-count" id="sprint-current-count">0</div>
          <div class="sprint__streak" id="sprint-streak"></div>
          <div class="sprint__score" id="sprint-score">0</div>
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

  private clearProperties(){
    model.sprintStatData = {
      correctWords: [],
      incorrectWords: [],
      learnedWords: 0,
      maxStreak: 0
    };
    this.viewChanged = false;
    model.sprintTimer = 59;
    this.streak = 0;
    model.sprintScore = '0';
    this.index = 0;
  }

  private createRandomNumber(): number {
    return Math.random() < 0.5 ? -1 : 1;
  }

  private sortWords(): Array<IWordData | IWord> {
    return [...model.sprintWordsArray].sort((firstWord, secondWord) => {
      return this.createRandomNumber();
    })
  }

  private createQuestionsArray(): Array<ISprintWord> {
    const questionsArray: Array<number> = new Array(model.sprintWordsArray.length).fill(0);
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
    model.previousPage = model.activePage;
    model.activePage = EPage.sprintStat;
    view.renderContent(model.activePage);
    model.updateSprintStatData(null, null, model.sprintStatData.learnedWords, this.streak);
    model.sprintTimer = -1;
  }

  private setWord(word: HTMLElement, translation: HTMLElement, questionsArray: Array<ISprintWord>): void{
    if (this.index === questionsArray.length){
      this.stopSprint();
      return
    }
    word.innerHTML = questionsArray[this.index].word;
    translation.innerHTML = questionsArray[this.index].wordTranslate;
    this.sprintCorrectness = questionsArray[this.index].correct;
  }

  private countCorrectAnswer(word: HTMLElement): void {
     let modifier = 0;
     const rightAudio = new Audio();
     rightAudio.src = '../../assets/sounds/Right-answer.mp3'
     let wordName = word.innerHTML;
     let correctWord = model.sprintWordsArray.find((elem) => elem.word === wordName);
     this.updateCorrectUserWord(correctWord);
     model.updateSprintStatData(correctWord);
     rightAudio.play();
    

     switch(this.streak) {
       case 0:
       case 1:
       case 2: 
        modifier = 1;
        this.correctAnswerDisplay(modifier);
        break;
       
       case 3:
       case 4: 
       case 5:
        modifier = 2;
        this.correctAnswerDisplay(modifier);
        break;

       case 6:
       case 7: 
       case 8:
        modifier = 3;
        this.correctAnswerDisplay(modifier);
        break; 

       case 9:
       case 10: 
       case 11:
        modifier = 4;
        this.correctAnswerDisplay(modifier);
        break;
        
       default: 
       modifier = 5;
       this.correctAnswerDisplay(modifier);
        break;
     }
  }

  private updateCorrectUserWord(word: IWord | IWordData | undefined ){
    if(!(word as IWord).userWord){
       const userWordData = {
         difficulty: 'normal',
         optional: {
           correctCount: 1,
           totalCorrectCount: 1,
           totalIncorrectCount: 0
         } 
      }
       api.createUserWord((model.auth as IAuthObject).userId, (word as IWord)._id, userWordData);
    } else {
      const userInfo = ((word as IWord).userWord as IUserWord)
      userInfo.optional.correctCount++;
      userInfo.optional.totalCorrectCount++;
       if(userInfo.difficulty === 'normal' && userInfo.optional.correctCount >= 3){
         model.sprintStatData.learnedWords++
         userInfo.difficulty = 'easy';
       }
       else if (userInfo.difficulty === 'hard' && userInfo.optional.correctCount >= 5){
        model.sprintStatData.learnedWords++
        userInfo.difficulty = 'easy';
       }
      api.updateUserWord((model.auth as IAuthObject).userId, (word as IWord)._id, userInfo);     
    }

  }

  private updateIncorrectUserWord(word: IWord | IWordData | undefined ){
    if(!(word as IWord).userWord){
       const userWordData = {
         difficulty: 'normal',
         optional: {
           correctCount: 0,
           totalCorrectCount: 0,
           totalIncorrectCount: 1
         } 
      }
       api.createUserWord((model.auth as IAuthObject).userId, (word as IWord)._id, userWordData);
    } else {
      const userInfo = ((word as IWord).userWord as IUserWord)
      userInfo.optional.totalIncorrectCount++;
       if (userInfo.difficulty === 'easy'){
        userInfo.difficulty = 'normal';
        userInfo.optional.correctCount = 0;
       }
      api.updateUserWord((model.auth as IAuthObject).userId, (word as IWord)._id, userInfo);     
    }

  }


  private correctAnswerDisplay(modifier: number){
    const ratingsArray = ['', '<span class="dope">D</span>ope!', '<span class="cool">C</span>ool!', '<span class="brilliant">B</span>rilliant!', '<span class="amazing">A</span>mazing!', '<span class="spectacular">S</span>pectacular!']
    const currentCount = document.getElementById('sprint-current-count') as HTMLElement;
    const score = document.getElementById('sprint-score') as HTMLElement;
    const streak = document.getElementById('sprint-streak') as HTMLElement;
    const cloneCurrentCount = currentCount.cloneNode() as HTMLElement;
    const cloneScore = score.cloneNode() as HTMLElement;
    const baseScore = 50;
        this.streak++
        cloneCurrentCount.innerHTML = `+${baseScore * modifier}`;
        currentCount.parentNode?.replaceChild(cloneCurrentCount, currentCount);
        cloneScore.innerHTML = (+score.innerHTML + (baseScore * modifier)).toString();
        score.parentNode?.replaceChild(cloneScore, score);
        streak.innerHTML = ratingsArray[modifier];
        model.sprintScore = cloneScore.innerHTML;
  } 


  private countIncorrectAnswer(word: HTMLElement) {
    const currentCount = document.getElementById('sprint-current-count') as HTMLElement;
    const streak = document.getElementById('sprint-streak') as HTMLElement;
    const wrongAudio = new Audio();
    wrongAudio.src = '../../assets/sounds/Wrong-answer.mp3';
    let wordName = word.innerHTML;
    let incorrectWord = model.sprintWordsArray.find((elem) => elem.word === wordName);
    this.updateIncorrectUserWord(incorrectWord);
    model.updateSprintStatData(null, incorrectWord, model.sprintStatData.learnedWords, this.streak);
    this.streak = 0;
    wrongAudio.play();
    currentCount.innerHTML = '+0';
    streak.innerHTML = '<span class="dope">D</span>ope!';
  }

  private setCheckListeners(): void {
    const word = document.getElementById('sprint-word') as HTMLElement;
    const translation = document.getElementById('sprint-translation') as HTMLElement;
    const questionsArray = this.createQuestionsArray();
    const correctButton = document.getElementById('sprint-right') as HTMLElement;
    const incorrectButton = document.getElementById('sprint-wrong') as HTMLElement;

    this.setWord(word, translation, questionsArray);

    correctButton.addEventListener('click', () => {
     this.correctListener(word, translation, questionsArray);
    })

    incorrectButton.addEventListener('click', () => {
     this.incorrectListener(word, translation, questionsArray);
    })

    document.onkeyup = (e) => this.keyboardListeners(e, word, translation, questionsArray); 
  }


  private correctListener(word: HTMLElement, translation: HTMLElement, questionsArray: ISprintWord[]){
    this.index++;
    if (this.sprintCorrectness){
      this.countCorrectAnswer(word);
      this.setWord(word, translation, questionsArray);
    }
    else if(!this.sprintCorrectness){
      this.countIncorrectAnswer(word);
      this.setWord(word, translation, questionsArray);
    }
  }

  private incorrectListener(word: HTMLElement, translation: HTMLElement, questionsArray: ISprintWord[]){
    this.index++;
    if (!this.sprintCorrectness){
      this.countCorrectAnswer(word);
      this.setWord(word, translation, questionsArray);
    }
    else if (this.sprintCorrectness){
      this.countIncorrectAnswer(word);
      this.setWord(word, translation, questionsArray);
    }
  }

  private keyboardListeners(e: KeyboardEvent, word: HTMLElement, translation: HTMLElement, questionsArray: ISprintWord[]){
      if (e.code === 'ArrowLeft'){
     this.incorrectListener(word, translation, questionsArray);
      }
      if (e.code === 'ArrowRight'){
     this.correctListener(word, translation, questionsArray);
      }
  }

  private setTimer(timer: HTMLElement) {
  timer.innerHTML = model.sprintTimer.toString();
  
  model.sprintTimer--;
  
    if (model.sprintTimer <= -1){
        this.stopSprint();
        return;     
    }

    if (this.viewChanged){
      return;
    }

    setTimeout(() => {this.setTimer(timer)}, 1000);
  }

  private setClearTimerListeners(){
    const header = document.getElementById('header') as HTMLElement;

    header.addEventListener('click',(e) => {
      if ((e.target as HTMLElement).tagName === 'LI'){
        this.viewChanged = true;
      } 
      });
  }

  private startTimer() {
   const timer = document.getElementById('sprint-timer') as HTMLElement;
    setTimeout(() => {this.setTimer(timer)}, 1000);
    this.setClearTimerListeners();
  }

  public startSprint(): void{
    this.clearProperties();
    this.startTimer();
    this.setCheckListeners();
}

} 