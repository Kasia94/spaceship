import { Missile } from "./Missile.js";
import { Enemy } from "./Enemy.js";
import { Spaceship } from "./Spaceship.js";
class Game {
  #htmlElements = {
    spaceship: document.querySelector("[data-spaceship]"),
    container: document.querySelector("[data-container]"),
    score: document.querySelector("[data-score]"),
    lives: document.querySelector("[data-lives]"),
    modal: document.querySelector("[data-modal]"),
    scoreInfo: document.querySelector("[data-score-info]"),
    button: document.querySelector("[data-button]")
  };
  #ship = new Spaceship(
    this.#htmlElements.spaceship,
    this.#htmlElements.container
  );
  #enemies = [];
  #lives=null
  #score=null
  #checkPositionInterval = null;
  #createEnemyInterval = null;
  #enemiesInterval = null;
  init() {
    this.#ship.init();
    this.#newGame();
    this.#htmlElements.button.addEventListener('click',()=> this.#newGame())
  }
  #newGame() {
    this.#htmlElements.modal.classList.add('hide')
    this.#enemiesInterval = 120;
    this.#lives=3
    this.#score=0
    this.#updateLivesText()
    this.#updateScoreText()
    this.#ship.element.style.left='0px'
    this.#ship.setPosition()
    this.#checkPositionInterval = setInterval(() => this.#randomNewEnemy(), 1000);
    this.#createEnemyInterval = setInterval(() => this.#checkPosition(), 1);
  }
  #endGame(){
    this.#htmlElements.modal.classList.remove('hide')
    this.#htmlElements.scoreInfo.textContent= `Przegrałeś !! Zdobyłeś ${this.#score} punkty`
    this.#enemies.forEach((enemy)=>enemy.explode())
    this.#enemies.length=0
    clearInterval(this.#createEnemyInterval)
    clearInterval(this.#checkPositionInterval)
  }
  #randomNewEnemy(){
    const randomNumber= Math.floor(Math.random()*5)+1
    randomNumber %5 ? this.#createNewEnemy(
        this.#htmlElements.container,
        this.#enemiesInterval,
        'enemy',
        'explosion'
    ):  this.#createNewEnemy(
        this.#htmlElements.container,
        this.#enemiesInterval * 2,
        'enemy--big',
        'explosion--big',
        3
    )
  }
  #createNewEnemy(...params) {
    const enemy = new Enemy(
     ...params
    );
    enemy.init();
    this.#enemies.push(enemy);
  }
  #checkPosition() {
    this.#enemies.forEach((enemy, enemyIndex, enemyArr) => {
      const enemyPosition = {
        top: enemy.element.offsetTop,
        right: enemy.element.offsetLeft + enemy.element.offsetWidth,
        bottom: enemy.element.offsetTop + enemy.element.offsetHeight,
        left: enemy.element.offsetLeft,
      };
      if (enemyPosition.top > window.innerHeight) {
        enemy.explode();
        enemyArr.splice(enemyIndex, 1);
        this.#updateLives();
      }
      this.#ship.missieles.forEach((missile, missileIndex, missieleArr) => {
        const missilePosition = {
          top: missile.element.offsetTop,
          right: missile.element.offsetLeft + missile.element.offsetWidth,
          bottom: missile.element.offsetTop + missile.element.offsetHeight,
          left: missile.element.offsetLeft,
        };
        if (
          missilePosition.bottom >= enemyPosition.top &&
          missilePosition.top <= enemyPosition.bottom &&
          missilePosition.right >= enemyPosition.left &&
          missilePosition.left <= enemyPosition.right
        ) {
          enemy.hit();
          if (!enemy.lives) {
            enemyArr.splice(enemyIndex, 1);
          }
          missile.remove();
          missieleArr.splice(missileIndex, 1);
          this.#updateScore()
        }
        if (missilePosition.bottom < 0) 
        {
          missile.remove();
          missieleArr.splice(missileIndex, 1);
        }
      })
    });
  }
  #updateScore(){
this.#score++
if(!(this.#score%5)){
this.#enemiesInterval--}
this.#updateScoreText()
  }
  #updateLives(){
this.#lives--
this.#updateLivesText()
this.#htmlElements.container.classList.add('hit')
setTimeout(()=>this.#htmlElements.container.classList.remove('hit'),100)
if(!this.#lives){
  this.#endGame()
}
  }
  #updateScoreText(){
    this.#htmlElements.score.textContent=`Score: ${this.#score}`
  }
  #updateLivesText(){
    this.#htmlElements.lives.textContent=`Lives: ${this.#lives}`
  }
}

window.onload = function () {
  const game = new Game();
  game.init();
};
