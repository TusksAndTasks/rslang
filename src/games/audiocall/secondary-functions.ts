import { IWordsData, IWordData } from "../../types/types";
import { api } from "../../ts/api";

export const getRandomNumber = (max: number): number => {
  return Math.floor(Math.random() * (max + 1));
};

const getRandomArray = (arr: IWordsData): IWordsData => {
  for (let index = arr.length - 1; index > 0; index -= 1) {
    let j = Math.floor(Math.random() * (index + 1));
    let elArr = arr[index];
    arr[index] = arr[j];
    arr[j] = elArr;
  }
  return arr;
};

const numberWrongAnswers = 3;

export const getArrOfAnswers = (
  correctWord: IWordData,
  data: IWordsData
): IWordsData => {
  const arrOfAnswerers = [correctWord];
  const arrWrongAnswers = data.filter(
    (wordData) => wordData.word !== correctWord.word
  );
  const randomAnswers = getRandomArray(arrWrongAnswers);
  for (let index = 0; index < numberWrongAnswers; index += 1) {
    arrOfAnswerers.push(randomAnswers[index]);
  }
  return getRandomArray(arrOfAnswerers);
};

export const getSrc = (path: string): string => {
  return `${api.baseUrl}/${path}`;
};

export const createOffset = (percent: number, length: number): string => {
  const offset = length - (percent / 100) * length;
  return String(offset);
};

export const changeValFromLS = (keyLS: string): void => {
  let step;
  if (keyLS === "progress") {
    step = 5;
  } else {
    step = 1;
  }
  const oldValue = localStorage.getItem(keyLS);
  const nemValue = Number(oldValue) + step;
  localStorage.setItem(keyLS, String(nemValue));
};

export const addAnswer = (word: IWordData, key: string): void => {
  const oldValue = getFromLocalStorage(key) || [];
  setInLocalStorage([...oldValue, word], key);
};

export const setInLocalStorage = (data: IWordsData, nameKey: string) => {
  localStorage.setItem(nameKey, JSON.stringify(data));
};

export const getFromLocalStorage = (nameKey: string): IWordsData => {
  return JSON.parse(localStorage.getItem(nameKey) as string);
};
