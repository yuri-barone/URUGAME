(function() {
        window.addEventListener("keydown", onKey)
        

        var enemies = []
        var bombs = []
        const possiblyDirections = ["ArrowRight", "ArrowDown", "ArrowUp", "ArrowLeft" ];
        document.addEventListener('DOMContentLoaded', initializePage, false);
        var circulo
        var circuloObj
        var enemieId = 0
        var legalTimer
        var speed = 50
        var leftPosition = 0
        var topPosition = 0
        var tick = 0
        var lastCommand = "ArrowDown"
        var windowWidth
        var windowHeight
        
        function addCirculoObject() {
            circuloObj = {id: circulo.id, currentPosition:{x: 0, y:0}, life:300, bombNum:5} 
        }
        
        function getWindowSize() {
            windowHeight = window.innerHeight
            windowWidth = window.innerWidth
        }

        function timer() {
            legalTimer = setInterval(changeNumber, 500)
            
        }

        function isValidPosition(position) {
            if(position == null){return false}
            if(position.x < -1){return false}
            if(position.x > windowWidth){return false}
            if(position.y > windowHeight - 50){return false}
            if(position.y < -1){return false}
                return true
            
        }

        function criaInimigo(){
            if (tick == 0){
                return 
            } if (tick % 10 == 0 ) {
                createEnemie()
            }
        }

        function changeNumber() {
            criaInimigo()
            tick = tick + 1
            timeToMovementCirculo()
            moveEnemies()
            checkEnemies()
            mapColidedWithBomb()
            updateBar()
            mapColisionResults()
            ifLoose()
            document.getElementById("score").innerHTML ="Score:" + tick
                        
        }

        function initializePage() {
            setCirculo()
            getWindowSize()
            timer()
        }

        function setCirculo() {
            circulo = document.getElementById('circulo')
            makeBar()
            addCirculoObject()

        }
        
        function onKey(event) {
            var nextCommand = event.key
            if (nextCommand == " ") {
                putBomb()
            }
            if(possiblyDirections.includes(nextCommand)){   
                lastCommand = event.key
            }
            

        }
        
        function timeToMovementCirculo() {
            var newPosition = getNextPosition(circuloObj.currentPosition, lastCommand)

            circuloObj.currentPosition = newPosition 
        
            moveCharacter(circuloObj.id, circuloObj.currentPosition)

        }

        function getColidedEnemies() {
            var resultado = enemies.filter(function(enemie){
                return enemie.currentPosition.x == circuloObj.currentPosition.x && enemie.currentPosition.y == circuloObj.currentPosition.y
            })
            return resultado
        }

        function colision(enemie) {
            circuloObj.life = circuloObj.life - enemie.life
            removeEnemie(enemie)
        }

        function mapColisionResults() {
            var colisionResults = getColidedEnemies()
            colisionResults.map(colision)
        }

        function ifLoose() {
            if (circuloObj.life <= 0) {
                clearInterval(legalTimer)
                var barra = document.getElementById("lifeBar")
                barra.value = "0"
                showLooseScreen()   
            }
        }
        function showLooseScreen() {
            var body = document.getElementById("bodyelement")
            body.style.backgroundColor = "Gray"

            var stringElement = document.createElement("H1")
            stringElement.style.color = "White"
            stringElement.style.top = "50px"
            stringElement.style.marginLeft = "25%"
            stringElement.innerHTML = "You snooze, you loose. Your final score was: " + tick

            var restartMessage = document.createElement("H2")
            restartMessage.style.color = "White"
            restartMessage.style.top = "150px"
            restartMessage.style.marginLeft = "35%"
            restartMessage.innerHTML = "Click anywhere to restart the game"

            document.onclick = restartTheGame
 
            body.appendChild(stringElement)
            body.appendChild(restartMessage)

        }
 
        function restartTheGame() {
            location.reload()
        }
    
        function makeBar() {
            var lifeBar = document.createElement("progress")
            lifeBar.id = "lifeBar"
            lifeBar.value = "100"
            lifeBar.max = "100"

            document.getElementById("barHolder").appendChild(lifeBar)   
        }

        function updateBar() {
            var lifeBar = document.getElementById("lifeBar")
            lifeBar.value = checkCircleLife()
        }

        function checkCircleLife() {
            var life = circuloObj.life
            var porcentagem = life/3
            var totalQueVaiNaBarra = Math.floor(porcentagem)
            return totalQueVaiNaBarra;
        }

        function getColidedWithBombEnemies(bomb) {
            var colidedEnemies = enemies.filter(function(enemie){
                return enemie.currentPosition.x == bomb.currentPosition.x && enemie.currentPosition.y == bomb.currentPosition.y
                
                }
            )
           for (let index = 0; index < colidedEnemies.length; index++) {
              const enemie = colidedEnemies[index]
              removeEnemie(enemie)
           }
           if (colidedEnemies.length > 0) {
               return bomb
           }
        }

        function mapColidedWithBomb() {
           var colidedBombs = bombs.map(getColidedWithBombEnemies) 
           for (let index = 0; index < colidedBombs.length; index++) {
            
            const bomb = colidedBombs[index]
            if (bomb) {
                removeBombColided(bomb)
            }
         }
        }

        function removeBombColided(bomb) {
            var indexBomb = bombs.indexOf(bomb)
            bombs.splice(indexBomb, 1)
            var elementoARemover = document.getElementById(bomb.id)
            elementoARemover.remove()
            
        }

        function putBomb() {
            if (circuloObj.bombNum >= 1) {
                createBomb()
                circuloObj.bombNum = circuloObj.bombNum - 1
                return
            }   
        }

        function createBomb() {

            var figure = document.createElement("figure")
            figure.className = "bomb"
            figure.style.top = circuloObj.currentPosition.y + "px"
            figure.style.left = circuloObj.currentPosition.x + "px"
            figure.id = tick
            document.body.appendChild(figure)

            var element = document.getElementById(tick)
            var bomba = {id:tick, currentPosition:{x:circuloObj.currentPosition.x, y:circuloObj.currentPosition.y}}
            bombs.push(bomba)
        }








        
        //inimigos
        function checkEnemies() {
          enemies.map(lessLifeOnEnemie)
        }

        function removeEnemie(enemie) {
            var indexEnemie = enemies.indexOf(enemie)
            enemies.splice(indexEnemie, 1)
            var elementoARemover = document.getElementById(enemie.id)
            elementoARemover.remove()
        }

        function lessLifeOnEnemie(enemie) {
            if (enemie.life == 0) {
                removeEnemie(enemie)
                return
            }
            enemie.life--
        }

        function createEnemie() {
            var position = {x:0, y:0}
            var life = getRandomLife()
            var enemieElement = createBootElement(position)
            var boot = createBoot(enemieElement.id, position.x, position.y, life)
            enemies.push(boot)

        }

        function createBootElement(position){
            var figure = document.createElement("FIGURE");
            figure.className = "circleInimigo"
            figure.style.top= position.x + "px"
            figure.style.left= position.y + "px"
            figure.id = "enemie_" + enemieId++
            document.body.appendChild(figure)
            return figure;
        }

    

        function createBoot(id, x, y, life) {
            var boot = {id: id, currentPosition:{x: x, y: y}, life: life}
            return boot
        }

        function getRandomDirection() {
            var number = Math.floor(Math.random() * 4)
            var direction = possiblyDirections[number];
            return direction;
        }
        
        function getNextPosition(posicaoAtual, direction) {
            var newPosition = {x: posicaoAtual.x, y: posicaoAtual.y};
            switch (direction) {
                case "ArrowDown":
                newPosition.y = posicaoAtual.y + speed
                    
                break;
        
                case "ArrowUp":
                newPosition.y = posicaoAtual.y - speed 

                break;

                case "ArrowLeft":
                newPosition.x = posicaoAtual.x - speed 
                    
                break;

                case "ArrowRight":
                newPosition.x = posicaoAtual.x + speed 

                break;
            }
        
            return newPosition
        }
        
        function changeEnemiesPosition(enemie) {
            var newDirection 
            var newPosition

            while(!isValidPosition(newPosition)){
                newDirection = getRandomDirection()
                newPosition = getNextPosition(enemie.currentPosition, newDirection);
            }   
            enemie.currentPosition = newPosition 
            moveCharacter(enemie.id, enemie.currentPosition)

        }

 

        function moveCharacter(characterId, position) {
            var character = document.getElementById(characterId)
            character.style.top = position.y + "px"
            character.style.left = position.x + "px"
            
        }

        function moveEnemies() {
            enemies.map(changeEnemiesPosition)
        }

        function getRandomLife(){
            var min = 30
            var max = 300
            Math.ceil(min)
            Math.floor(max)
            return Math.floor(Math.random() * (max - min)) + min;   
        }
})();
    
    


