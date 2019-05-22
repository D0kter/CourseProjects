/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/
/*eslint-env browser*/

var scores, roundScore, activePlayer, gamePlaying, prevRoll, dice;

init();

//get element is faster
//document.getElementById('current-' + activePlayer).textContent = dice;


document.querySelector('.btn-roll').addEventListener('click', function () {
    if (gamePlaying) {
        dice = [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1];
        document.getElementById('dice-1').style.display = 'block';
        document.getElementById('dice-2').style.display = 'block';
        document.getElementById('dice-1').src = 'dice-' + dice[0] + '.png';
        document.getElementById('dice-2').src = 'dice-' + dice[1] + '.png';

        if ([dice[0], dice[1]].indexOf(1) !== -1) { //or dice[1] dice[0] !== 1 && dice[1] !== 1
            changeActive();
        } else if ((prevRoll[0] === 6 || prevRoll[1] === 6) && (dice[0] === 6 || dice[1] === 6)) {
            scores[activePlayer] = 0;
            document.querySelector('#score-' + activePlayer).textContent = scores[activePlayer];
            changeActive();
            dice = [1, 1];
        } else {
            //scores[activePlayer] += roundScore;
            //document.querySelector('#score-' + activePlayer).textContent = scores[activePlayer];
            roundScore += (dice[0] + dice[1]);
            document.querySelector('#current-' + activePlayer).textContent = roundScore;
        }
    }

    //    console.log(dice[0], dice[1]);
    //    console.log([prevRoll[0], prevRoll[1]].indexOf(6));
    //    console.log([dice[0], dice[1]].indexOf(1));
    //    console.log([dice[0], dice[1]].indexOf(1) !== -1);
    prevRoll = dice;
});

document.querySelector('.btn-hold').addEventListener('click', function () {
    if (gamePlaying) {
        scores[activePlayer] += roundScore;
        document.querySelector('#score-' + activePlayer).textContent = scores[activePlayer];
        prevRoll = [1, 1];
        
        var input = document.querySelector('.final-score').value;
        var winScore;
        
        // Undefined, 0, null or "" are COERCED to false
        // Anything else is COERCED to true
        if(input) {
            winScore = input;
        } else {
            winScore = 100;
        }
        
        if (scores[activePlayer] >= winScore) {
            gamePlaying = false;
            document.querySelector('#name-' + activePlayer).textContent = 'Winner!';
            document.getElementById('dice-1').style.display = 'none';
            document.getElementById('dice-2').style.display = 'none';
            document.querySelector('.player-' + activePlayer + '-panel').classList.add('winner');
            document.querySelector('.player-' + activePlayer + '-panel').classList.remove('active');
        } else {
            changeActive();
        }
    }

});


document.querySelector('.btn-new').addEventListener('click', init);


function changeActive() {
    activePlayer = activePlayer === 0 ? 1 : 0;
    roundScore = 0;
    document.querySelector('#current-0').textContent = '0';
    document.querySelector('#current-1').textContent = '0';
    document.querySelector('.player-0-panel').classList.toggle('active');
    document.querySelector('.player-1-panel').classList.toggle('active');
    document.getElementById('dice-1').style.display = 'none';
    document.getElementById('dice-2').style.display = 'none';
}


function init() {
    scores = [0, 0];
    roundScore = 0;
    activePlayer = 0;
    gamePlaying = true;
    prevRoll = [1, 1];

    document.getElementById('dice-1').style.display = 'none';
    document.getElementById('dice-2').style.display = 'none';
    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-1').textContent = '0';
    document.getElementById('score-0').textContent = '0';
    document.getElementById('score-1').textContent = '0';
    document.getElementById('name-0').textContent = 'Player1';
    document.getElementById('name-1').textContent = 'Player2';
    document.querySelector('.player-0-panel').classList.remove('winner');
    document.querySelector('.player-1-panel').classList.remove('winner');
    document.querySelector('.player-0-panel').classList.remove('active');
    document.querySelector('.player-1-panel').classList.remove('active');
    document.querySelector('.player-0-panel').classList.add('active');

}
