import {useEffect, useState} from "react";
import './App.css'
import 'bootstrap/dist/css/bootstrap.css';
import 'animate.css/animate.css';
import Card from "./components/card/card";
// import allWords from "./allWords";
import allWords from "./bigWordsBase";
import classNames from "classnames/bind";
import background from "./images/operatsija-vnedrenie-0.jpeg";
import king from "./images/fairytale.png";
import killBackground from "./images/04102019_manyak.jpeg";
import reload from "./images/external-reload-mintab-for-ios-becris-lineal-becris.png";
import show from "./images/visible.png";
import hide from "./images/hide.png";
import 'normalize.css/normalize.css'
import {BLUE_COLOR, CARDS_COUNT, GRAY_COLOR, RED_COLOR, TOTAL_CARDS} from "./constants";

function getRandomArrayElements(arr, count) {
  let shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
  while (i-- > min) {
    index = Math.floor((i + 1) * Math.random());
    temp = shuffled[index];
    shuffled[index] = shuffled[i];
    shuffled[i] = temp;
  }
  return shuffled.slice(min);
}

function hexToRgbA(hex, opacity = 1){
  let c;
  if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
    c= hex.substring(1).split('');
    if(c.length === 3){
      c= [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c= '0x'+c.join('');
    return `rgba(${[(c>>16)&255, (c>>8)&255, c&255].join(',')},${opacity})`;
  }
  throw new Error('Bad Hex');
}

function App() {
  const [state, setState] = useState({
    teams: [
      {
        name: 'team 1',
        color: RED_COLOR,
        openedCards: [],
        allCards: [],
        isFirst: null
      },
      {
        name: 'team 2',
        color: BLUE_COLOR,
        openedCards: [],
        allCards: [],
        isFirst: null
      }
    ],
    words: [],
    currentTeam: null,
    openedWords: [],
    isCapitanView: false,
    killCard: null,
    allWords: [...allWords],
    game: 0
  });

  useEffect(() => {
    setState((s) => {
      const words = getRandomArrayElements(s.allWords, TOTAL_CARDS);
      const currentTeam = s.teams.indexOf(getRandomArrayElements(s.teams, 1)[0]);
      const { teams, filteredWords } = s.teams.reduce((acc, cur, index) => {
          const isFirst = index === currentTeam;
          const allCards = getRandomArrayElements(acc.filteredWords, isFirst ? CARDS_COUNT + 1 : CARDS_COUNT);
          acc.teams.push({
            ...cur,
            allCards,
            isFirst,
            openedCards: [],
          })
          acc.filteredWords = acc.filteredWords.filter(w => allCards.every((c) => c !== w));
          return acc;
      }, {
        teams: [],
        filteredWords: words
      })
      const killCard = getRandomArrayElements(filteredWords, 1)[0];
      const allLocalWords = s.allWords.filter((i) => words.every(j => j !== i));
      return {
        ...s,
        teams,
        words,
        currentTeam,
        killCard,
        openedWords: [],
        allWords: allLocalWords.length > TOTAL_CARDS ? allLocalWords : allWords
      }
    });
  }, [state.game]);

  useEffect(() => {
    setState((s) => ({...s, game: 1}))
  }, [])

  const isKill = state.openedWords.some(w => w === state.killCard);
  return (
      <div className={'main'} style={{backgroundImage: `url(${isKill ? killBackground : background})`}}>
        <div className={'wrapper'}
            style={{
          backgroundColor: hexToRgbA(state.isCapitanView ? state.teams.find(t => t.isFirst)?.color : '#595A5C', 0.8),
        }}>
          <div className={'counter'}>
            <button
                className={classNames('btn', 'btn-light')}
                onClick={() => setState((s) => ({ ...s, isCapitanView: !s.isCapitanView}))}
            >
              <img src={state.isCapitanView ? hide : show } width={20} height={20} alt={'visibility'}/>
            </button>
            <div className={'counters'}>
              {
                state.teams.map(t => (
                    <div className={'count'} style={{ color: t.color }} key={t.name}>
                      {t.openedCards.filter(c => c !== state.killCard).length === t.allCards.length && <div className={'king'} style={{backgroundImage: `url(${king})`}} />}
                      {t.openedCards.filter(c => c !== state.killCard).length}/{t.allCards.length}
                    </div>
                ))
              }
            </div>
            <button
                className={classNames('btn', 'btn-light')}
                style={{marginLeft: '10px'}}
                onClick={() => setState((s) => {
                  return {
                    ...s,
                    game: s.game + 1
                  }
                })}
            >
              <img src={reload} width={15} height={15} alt={'reload'}/>
            </button>
          </div>
          <div className={'cards'}>
            {state.words.map((w) => {
              const isKillCard = w === state.killCard;
              const team = state.teams.find(t => state.isCapitanView ? t.allCards.find(o => o === w) : t.openedCards.find(o => o === w));
              let color = team?.color;
              if (isKillCard && (team ||  state.isCapitanView)) {
                color = 'black';
              }
              const isOpened = state.openedWords.some(o => o === w);
              return <Card
                  key={w}
                  word={w}
                  color={color || (isOpened ? GRAY_COLOR : '#fff')}
                  isOpened={isOpened}
                  onClick={() => {
                    if (state.isCapitanView || isOpened) {
                      return
                    }
                    setState((s) => {
                      const teams = s.teams.map((t) => {
                        const isGot = t.allCards.some((c) => c === w) || isKillCard;
                        return isGot ? {
                          ...t,
                          openedCards: [...t.openedCards, w]
                        } : t
                      })
                      return {
                        ...s,
                        teams,
                        openedWords: [...s.openedWords, w],
                      }
                    })
                  }
                  }
              />
            })}
          </div>
        </div>
      </div>
  );
}

export default App;
