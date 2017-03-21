var game = (function() {

  console.log("Initilizing game.js");
  var count = 0;//FOR SCORE
  var fallSpeed = 400;


            function createGrid(nrow, ncol) {
              grid = [];
              grid.length = nrow;
              for (var i = 0; i < nrow; i++) {
                grid[i] = [];
                grid[i].length = ncol;
              }
              notify();
            }

            function updateScore() {
              return count.toString();
            }

            //Clear row function
            function clearRow(){
              for(var i = 0; i <= 10; i++) {
                if(i === 10){
                  for(var j = 0; j < 10; j++) {
                    grid[activerow][j] = null;
                  }
                  count+=10;
                  $('#score').text(updateScore());
                  //console.log("Score is " + count);


                  //grid[activerow][activecol] = false;
                  //grid[activerow][activecol+1] = false;

                  // DROP REMAINING BLOCKS
                  for(var k = grid.length-1; k > 0; k--) {

                    for(var l = 10; l >= 0; l--) {
                      if(grid[k][l] === true) {
                        grid[k+1][l] = true;
                        grid[k][l] = null;
                      }
                    }

                  }
                }
                else if(grid[activerow][i] === true) {
                  console.log("There is a block in row " + i);
                }
                else {
                  break;
                }
              }
            }

            function randomPiece() {
              var rng = Math.floor(Math.random() * 10);

              return rng;
            }

            var activerow = null;
            var activecol = null;

            var enemyrow = null;
            var enemycol = null;

            function startGame() {
              createBlock(0, 5);
              createEnemy(14, 5);
            }

            function findPowerUp(row, col){
              if(grid[activerow+row][activecol] === 1){
                $('#powerUpBox').addClass('player').html('&#9973;');
              }
              else if(grid[activerow+row][activecol] === 2){
                $('#powerUpBox').addClass('player').html('&#9889;');
              }
            }


            function moveLeft() {
              if (activerow !== null && activecol !== null && activecol-1 >= 0 && activecol-1 <= 9 && grid[activerow][activecol-1] !== true) {
                grid[activerow][activecol] = null;
                activecol--;
                grid[activerow][activecol] = 0;
                console.log(activecol)

                findPowerUp(1, 0);
              }
            }

            function moveRight() {
              if (activerow !== null && activecol !== null && activecol+1 >= 0 && activecol+1 <= 9 && grid[activerow][activecol+1] !== true) {
                grid[activerow][activecol] = null;
                activecol++;
                grid[activerow][activecol] = 0;
                console.log(activecol)

                findPowerUp(1, 0);
              }
            }

            function moveDown() {
              if (activerow !== null && activecol !== null && activerow+1 >= 0 && activerow+1 <= 14 && grid[activerow+1][activecol] !== true) {
                grid[activerow][activecol] = null;
                activerow++;
                grid[activerow][activecol] = 0;
                console.log(activerow)


                findPowerUp(1, 0);
              }
            }

            function moveUp() {
              if (activerow !== null && activecol !== null && activerow-1 >= 0 && activerow-1 <= 14 && grid[activerow-1][activecol] !== true) {
                grid[activerow][activecol] = null;
                activerow--;
                grid[activerow][activecol] = 0;
                console.log(activerow)

                findPowerUp(1, 0);
              }
            }

            function moveDiagLeftDown() {
              if (activerow !== null && activecol !== null && activerow+1 >= 0 && activerow+1 <= 14 && grid[activerow+1][activecol] !== true
                    && activecol-1 >= 0 && activecol-1 <= 9 && grid[activerow][activecol-1] !== true) {
                grid[activerow][activecol] = null;
                activerow++;
                activecol--;
                grid[activerow][activecol] = 0;
                console.log(activerow)

                findPowerUp(1, 0);
              }
            }

            function moveDiagRightDown() {
              if (activerow !== null && activecol !== null && activerow+1 >= 0 && activerow+1 <= 14 && grid[activerow+1][activecol] !== true
                    && activecol+1 >= 0 && activecol+1 <= 9 && grid[activerow][activecol+1] !== true) {
                grid[activerow][activecol] = null;
                activerow++;
                activecol++;
                grid[activerow][activecol] = 0;
                console.log(activerow)

                findPowerUp(1, 0);
              }
            }

            function moveDiagLeftUp() {
              if (activerow !== null && activecol !== null && activerow-1 >= 0 && activerow-1 <= 14 && grid[activerow-1][activecol] !== true
                    && activecol-1 >= 0 && activecol-1 <= 9 && grid[activerow][activecol-1] !== true) {
                grid[activerow][activecol] = null;
                activerow--;
                activecol--;
                grid[activerow][activecol] = 0;
                console.log(activerow)

                findPowerUp(1, 0);
              }
            }

            function moveDiagRightUp() {
              if (activerow !== null && activecol !== null && activerow-1 >= 0 && activerow-1 <= 14 && grid[activerow-1][activecol] !== true
                    && activecol+1 >= 0 && activecol+1 <= 9 && grid[activerow][activecol+1] !== true) {
                grid[activerow][activecol] = null;
                activerow--;
                activecol++;
                grid[activerow][activecol] = 0;
                console.log(activerow)

                findPowerUp(1, 0);
              }
            }

            function autoComplete() {
              for(var i = grid.length-1; i > 0; i--) {
                for(var j = 10; j >= 0; j--) {
                    grid[i][j] = true;
                  }
                }
            }


            function loadPowerups() {
              var rngArr = [1, null, null, null, 1, 2, null, null, null, null];

              for(var i = 0; i < 15; i++) {
                for(var j = 0; j < 10; j++) {
                  rng = randomPiece();
                  if(!grid[i][j]){
                    grid[i][j] = rngArr[rng];
                    console.log("Filled tile");
                  }
                  }
                }
            }

            function createBlock(row, col){
              $('#score').text(updateScore());
              loadPowerups();
              activerow = row;
              activecol = col;
              console.log(activerow + " " + activecol);
              id = grid[activerow][activecol] = 0;
              notify();
              var interval = setInterval(function() {
                if (activerow+1 === grid.length /*|| grid[activerow+1][activecol] === true*/) {
                  // we reached the bottom
                  clearInterval(interval);

                //createBlock(0, 4); FOR ENEMY MOVEMENT
                }

                  notify();
                //Clear a complete row
                clearRow();


            }, fallSpeed);
        }

        function enemyMove() {
          var dir;
          var hPos = 0;
          var vPos = 0;
          dir = Math.floor(Math.random() * 2);

          if(dir === 0) { // Left
            hPos = -1;
          }
          else if(dir === 1) { // Right
            hPos = 1;
          }

          return hPos;
        }

        function createEnemy(row, col){
          var enemyDir;
          $('#score').text(updateScore());
          enemyrow = row;
          console.log("THIS IS THE ENEMYCOL " + enemycol)
          enemycol = col;
          console.log(enemyrow + " " + enemycol);
          id = grid[enemyrow][enemycol] = true;
          notify();
          var enemyInterval = setInterval(function() {
            enemyDir = Math.floor(Math.random() * 3);
            if (enemyrow === 0) {

              // we reached the bottom
              clearInterval(enemyInterval);
              if (enemyrow !== 14) {
                // Increase fallspeed based on these conditions
                if(fallSpeed > 50 && (count % 5 === 0) && count !== 0) {
                  fallSpeed -= 25;
                }
                count-=1;
                console.log(enemyrow)
                createEnemy(14, 5);
                console.log("Fall speed is " + fallSpeed)
              }
              else{
                $('#gameover').text("GAME OVER");
              }
            }
            else {
              console.log("ENEMY COL " + enemycol)
              grid[enemyrow][enemycol] = null;
              if(enemyDir === 0 && enemycol) {
                enemyrow--;
                grid[enemyrow][enemycol] = 0;
              }
              else if(enemyDir === 1 && enemycol >= 0 && enemycol-1 >= 0 && enemycol+1 <= 9) {
                enemycol--;
                grid[enemyrow][enemycol] = 0;
              }
              else if(enemyDir === 2 && enemycol < 10 && enemycol-1 >= 0 && enemycol+1 <= 9) {
                enemycol++;
                grid[enemyrow][enemycol] = 0;
              }
              else{
                console.log("Attempted to go Out of bounds");
                if(enemycol === 9){
                  enemycol--;
                  grid[enemyrow][enemycol] = 0;
                }
                else if(enemycol === 0){
                    enemycol++;
                    grid[enemyrow][enemycol] = 0;
                }
              }

              notify();
            }


        }, 500);
    }

            var listeners = [];

            function addListener(cb) {
              listeners.push(cb);
              notify();
            }

            function notify() {
              for(var i = 0; i < listeners.length; i++){
                var cb = listeners[i];
                cb(grid);
              }
            }

            return {
              addListener: addListener,
              startGame: startGame,
              moveLeft: moveLeft,
              moveRight: moveRight,
              moveDown: moveDown,
              moveUp: moveUp,
              moveDiagLeftDown: moveDiagLeftDown,
              moveDiagRightDown: moveDiagRightDown,
              moveDiagRightUp: moveDiagRightUp,
              moveDiagLeftUp: moveDiagLeftUp,
              autoComplete: autoComplete,
              clearRow: clearRow,
              updateScore: updateScore,
              createGrid: createGrid
            };

})();
