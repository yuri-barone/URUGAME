(function() {
        window.addEventListener("keydown", onKey)
        

        var enemies = []
        var bombs = []
        var powerBombs = []
        var portalPower = []
        var openPortals = []
        

        const possiblyDirections = ["ArrowRight", "ArrowDown", "ArrowUp", "ArrowLeft" ];
        document.addEventListener('DOMContentLoaded', initializePage, false);
        var portalKey 
        var portalStage = "blackHole"
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
            circuloObj = {id: circulo.id, currentPosition:{x: 0, y:0}, life:300, bombNum:5, portalNum:0} 
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

        function putSuperPowerBomb() {
            if (tick == 0) {
                return
            }
            if (tick % 100 == 0) {
                createSuperPowerBomb()
            }
        }

        function putPortalPower() {
            if (tick == 0) {
                return
            }
            if (tick % 50 == 0) {
                createPortalPower()  
            }
        }

        function changeNumber() {
            criaInimigo()   
            putSuperPowerBomb()
            putPortalPower()
            tick = tick + 1
            timeToMovementCirculo()
            moveEnemies()
            checkEnemies()
            mapCheckPower()
            mapColidedWithBomb()
            mapCheckPortalPower()
            checkIfGotInThePortal()
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
            if (nextCommand == "x") {
                checkIfCanCreatePortal()
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
                tirarBombaPan()
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

            var bomba = {id:tick, currentPosition:{x:circuloObj.currentPosition.x, y:circuloObj.currentPosition.y}}
            bombs.push(bomba)
        }

        function createPortalPower() {
            var positionY = getRandomYPosition()
            var positionX = getRandomYPosition()
            var id = "portalPower_" + tick
            var figure = document.createElement("figure")
            figure.className = "portal"
            figure.style.top = positionY + "px"
            figure.style.left = positionX + "px"
            figure.id = id

            document.body.appendChild(figure)

            var portal =  {id:id, currentPosition:{x:positionX, y:positionY,}}
            portalPower.push(portal)
        }

        function mapCheckPortalPower() {
            portalPower.map(checkPortalPower)
        }

        function checkPortalPower(portal) {
            if(circuloObj.currentPosition.x == portal.currentPosition.x && circuloObj.currentPosition.y == portal.currentPosition.y){
                circuloObj.portalNum =  circuloObj.portalNum + 1
                var elementoARemover = document.getElementById(portal.id)
                elementoARemover.remove()
                var indexPortal = portalPowers.indexOf(portal)
                portalPower.splice(indexPortal, 1)  
                addPortalToPanel()
            }
        }

        function checkIfCanCreatePortal() {
            if (circuloObj.portalNum > 0) {
                createPortal()
            }
        }

        function getColidedPortal() {
            var resultado = openPortals.filter(function(portal){
                return portal.currentPosition.x == circuloObj.currentPosition.x && portal.currentPosition.y == circuloObj.currentPosition.y
            })
            return resultado
        }

        function checkIfGotInThePortal() {
            var resultado = getColidedPortal()

            if (resultado.length > 0){
                transportTroughtTheUniverse(resultado.pop())
            }
        }

        function transportTroughtTheUniverse(portalPego) {
            
            var portaisEmQuestao = openPortals.filter(function(portal){
                return portal.key == portalPego.key;
            })

            var portalDeSaida = portaisEmQuestao.filter(function(portal){ return portal.id != portalPego[0].id })

            circuloObj.currentPosition = portalDeSaida[0].currentPosition
        }


        function createPortal() {
            var id = "portal_" + tick
            if (portalStage == "Yin") {
                portalStage = "Yang"
                
            }
            
            if (portalStage == "blackHole") {
                portalKey = "portalKey_" + tick
                portalStage = "Yin"
                changePortalStage()
            } 
            
            
            
            var figure = document.createElement("figure")
            figure.className = "portalUse"
            figure.style.top = circuloObj.currentPosition.y + "px"
            figure.style.left = circuloObj.currentPosition.x + "px"
            figure.id = id

            document.body.appendChild(figure)

            var portal =  {id:id, currentPosition:{x:circuloObj.currentPosition.x, y:circuloObj.currentPosition.y}, key:portalKey}
            openPortals.push(portal)

            if (portalStage == "Yang") {
                portalStage = "blackHole"    
                tirarPortalPan()  
                circuloObj.portalNum = circuloObj.portalNum - 1
            }
          
        }

        function tirarBombaPan() {
            var id = "bombpanel" + circuloObj.bombNum
            var bombaASerRetiradaDoPainel = document.getElementById("bombpanel" + circuloObj.bombNum)
            bombaASerRetiradaDoPainel.remove()
        }

        function changePortalStage() {
            var id = "portalpanel" + circuloObj.portalNum
            var figuraDoPainel = document.getElementById(id)
            figuraDoPainel.className = "portalpart2panel"
        }

        function tirarPortalPan() {
            var id = "portalpanel" + circuloObj.portalNum
            var portalASerRetiradoDoPainel = document.getElementById(id)
            portalASerRetiradoDoPainel.remove()
        }

        function createSuperPowerBomb() {
            var positionX = getRandomXPosition()
            var positionY = getRandomYPosition()
            var figure = document.createElement("figure")
            figure.className = "bomb"
            figure.style.top = positionY + "px"
            figure.style.left = positionX + "px"
            figure.id = tick
            document.body.appendChild(figure)
            var bomba = {id:tick, currentPosition:{x:positionX, y:positionY}}
            powerBombs.push(bomba)

        }
        function mapCheckPower() {
            powerBombs.map(checkIfGotSuperBomb)
        }
        function checkIfGotSuperBomb(bomb) {
            if(circuloObj.currentPosition.x == bomb.currentPosition.x && circuloObj.currentPosition.y == bomb.currentPosition.y){
                circuloObj.bombNum =  circuloObj.bombNum + 1
                var elementoARemover = document.getElementById(bomb.id)
                elementoARemover.remove()
                addBombToPanel()
            }
        }

        function addBombToPanel() {
            var figure = document.createElement("figure")
            figure.className = "bombpanel"
            figure.id = "bombpanel" + circuloObj.bombNum 
            var multiplier = circuloObj.bombNum - 1
            var xPosition = multiplier * 25
            figure.style.left = xPosition + "px"
            var divHolder = document.getElementById("bombholder")
            divHolder.appendChild(figure)
        }

        function addPortalToPanel() {
            var figure = document.createElement("figure")
            figure.className = "portalpanel"
            figure.id = "portalpanel" + circuloObj.portalNum 
            var multiplier = circuloObj.portalNum - 1
            var xPosition = multiplier * 25
            figure.style.left = xPosition + "px"
            var divHolder = document.getElementById("portalholder")
            divHolder.appendChild(figure)
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

        function getRandomXPosition() {
            var min = 0
            var max = windowWidth
            Math.ceil(min)
            Math.floor(max)
            var divider = Math.floor(Math.random() * (max - min)) + min;  
            var multiplier =  divider / speed
            var rounded = Math.round(multiplier)
            var result = rounded * speed
            return result

        }

        function getRandomYPosition() {
            var min = 0
            var max = windowHeight
            Math.ceil(min)
            Math.floor(max)
            var divider = Math.floor(Math.random() * (max - min)) + min;   
            var multiplier =  divider / speed
            var rounded = Math.round(multiplier)
            var result = rounded * speed
            return result
        }
})();
    
    


