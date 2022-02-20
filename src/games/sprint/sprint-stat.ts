import { model, view } from "../../ts";
import { api } from "../../ts/api";
import { EPage, IWord, IWordData } from "../../types/types";

export class SprintStat {

    public getHTML(): string{
        return `
      <div class="sprint-stat">
       <div class="sprint-stat__stat-box" id="sprint-stat-short">
       <p class="sprint-stat__title">Ваш результат</[]>
       <div class="sprint-stat__circle">
         <div class="sprint-stat__wave"></div>
         <div class="sprint-stat__percent"></div>
       </div>
       <div class="sprint-stat__result">
         <div class="sprint-stat__score" id="sprint-score-stat"></div>
         <div class="sprint-stat__streak" id="sprint-streak-stat"></div>
         <div class="sprint-stat__correct" id="sprint-correct-stat"></div>
         <div class="sprint-stat__incorrect" id="sprint-incorrect-stat"></div>
       </div>
       <div class="sprint-stat__buttons">
        <button class="sprint-stat__button" id="sprint-full-button">Подробнее</button>
        <button class="sprint-stat__button" id="sprint-again-button">Заново</button>
       </div> 
       </div>
       <div class="sprint-stat__full hidden" id="sprint-stat-full">
        <div class="sprint-stat__result-words" id="sprint-result-stat">
        <h2>Правильные ответы</h2>
       </div>
        <div class="sprint-stat__return-button" id="sprint-return-button">Назад</div>
       </div>
      </div>
      `
    }

    public showStatWords() {
        if(model.auth){this.changeStatistics()}
        const streakSection = document.getElementById('sprint-streak-stat') as HTMLElement;
        const scoreSection = document.getElementById('sprint-score-stat') as HTMLElement;
        const correctSection = document.getElementById('sprint-correct-stat') as HTMLElement;
        const incorrectSection = document.getElementById('sprint-incorrect-stat') as HTMLElement;
        streakSection.innerHTML = `Лучшая серия верных ответов за раунд: ${(model.sprintStatData.maxStreak).toString()}`;
        scoreSection.innerHTML = `Ваш счет за раунд: ${model.sprintScore}`;
        correctSection.innerHTML = `Верных ответов: ${model.sprintStatData.correctWords.length}`;
        incorrectSection.innerHTML = `Ошибок: ${model.sprintStatData.incorrectWords.length}`
        this.showCircle();
        document.onkeyup = null; 
        this.showCorrectWords();
        this.showIncorrectWords();
        this.setAudioListeners();
        this.setAgainButtonListener();
    }

    private showCircle() {
        const percent = document.querySelector('.sprint-stat__percent') as HTMLElement;
        const wave = document.querySelector('.sprint-stat__wave') as HTMLElement;
        const lengthOfWords = model.sprintStatData.correctWords.length + model.sprintStatData.incorrectWords.length;
        const percentOfCorrectAnswers = !isNaN(Math.floor((model.sprintStatData.correctWords.length * 100) / lengthOfWords)) ? Math.floor((model.sprintStatData.correctWords.length * 100) / lengthOfWords) : 0;
        
        percent.innerHTML = `${percentOfCorrectAnswers}%`;
        if (!isNaN(Math.floor((model.sprintStatData.correctWords.length * 100) / lengthOfWords))){
        wave.animate(
            [{ top: "100%" }, { top: `${100 - percentOfCorrectAnswers}%` }],
            { duration: 2000, fill: "forwards" }
          ); 
        }
    }

    private async changeStatistics(){
      let statistic = await api.getStatistics();
      
      if(!statistic){
          statistic = {learnedWords: model.sprintStatData.learnedWords,
          optional: {
              audiocall: {
                 correctWords: 0,
                 incorrectWords: 0,
                 streak: 0,
                 newWords: +0
              },
              sprint: {
                  correctWords: model.sprintStatData.correctWords.length,
                  incorrectWords: model.sprintStatData.incorrectWords.length,
                  streak: model.sprintStatData.maxStreak,
                  newWords: model.sprintNewWords
              }
          }
        }
      } else {
          delete statistic.id;
          statistic.learnedWords += model.sprintStatData.learnedWords;
          statistic.optional.sprint.correctWords += model.sprintStatData.correctWords.length;
          statistic.optional.sprint.incorrectWords += model.sprintStatData.incorrectWords.length;
          statistic.optional.sprint.streak = statistic.optional.sprint.streak < model.sprintStatData.maxStreak ? model.sprintStatData.maxStreak : statistic.optional.sprint.streak,
          statistic.optional.sprint.newWords += model.sprintNewWords
      }
      
      api.updateStatistics(statistic);
    }

    private showCorrectWords(){
        const correctSection = document.getElementById('sprint-result-stat') as HTMLElement;

        model.sprintStatData.correctWords.forEach((elem) => {
            correctSection.innerHTML += `<div class="sprint-stat__correct-word">
            <button class="sprint-stat__correct-audio" id="${!model.auth ? (elem as IWordData).id : (elem as IWord)._id}"></button>
            <div class="details-word">${elem.word}</div>
            <div class="details-word_tr">${elem.transcription}</div>
            <div class="details-word_lang">${elem.wordTranslate}</div>
            <div id="check-answer" class="check-answer valid"> 
            </div>`
        });
    }

    private showIncorrectWords(){
        const incorrectSection = document.getElementById('sprint-result-stat') as HTMLElement;
        incorrectSection.innerHTML += '<h2>Неправильные ответы</h2>'
        model.sprintStatData.incorrectWords.forEach((elem) => {
            incorrectSection.innerHTML += `<div class="sprint-stat__incorrect-word">
            <button class="sprint-stat__incorrect-audio" id="${!model.auth ? (elem as IWordData).id : (elem as IWord)._id}"></button>
            <div class="details-word">${elem.word}</div>
            <div class="details-word_tr">${elem.transcription}</div>
            <div class="details-word_lang">${elem.wordTranslate}</div>
            <div id="check-answer" class="check-answer invalid"> 
            </div>`
        })  
    }

    private setAudioListeners(){
           const correctAudioBtn = document.querySelectorAll('.sprint-stat__correct-audio');
           const incorrectAudioBtn = document.querySelectorAll('.sprint-stat__incorrect-audio');

           correctAudioBtn.forEach((elem) => {
            const audio = new Audio();
            audio.src = `${api.baseUrl}/${(model.sprintStatData.correctWords.find((el) => (model.auth ? (el as IWord)._id : (el as IWordData).id) === elem.id) as IWordData | IWord).audio}`
              elem.addEventListener('click', function(){
                  audio.play();
              })
           });

           incorrectAudioBtn.forEach((elem) => {
            const audio = new Audio();
            audio.src = `${api.baseUrl}/${(model.sprintStatData.incorrectWords.find((el) => (model.auth ? (el as IWord)._id : (el as IWordData).id) === elem.id) as IWordData | IWord).audio}`
              elem.addEventListener('click', function(){
                  audio.play();
              })
           })

    }

    private setAgainButtonListener(){
        const againBtn = document.getElementById('sprint-again-button') as HTMLElement;
        const fullBtn = document.getElementById('sprint-full-button') as HTMLElement;
        const returnBtn = document.getElementById('sprint-return-button') as HTMLElement;
        const shortStat = document.getElementById('sprint-stat-short') as HTMLElement;
        const fullStat = document.getElementById('sprint-stat-full') as HTMLElement;
        againBtn.addEventListener('click', () => {
            model.previousPage = model.activePage;
            model.activePage = EPage.sprintDifficulty;
            view.renderContent(model.activePage);
        });

        fullBtn.addEventListener('click', function(){
            shortStat.classList.add('hidden');
            fullStat.classList.remove('hidden');
        })

        returnBtn.addEventListener('click', function(){
            fullStat.classList.add('hidden');
            shortStat.classList.remove('hidden');
        })
    }

}