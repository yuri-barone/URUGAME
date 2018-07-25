(function() {
        window.addEventListener("keydown", onKey)
        
        var enemies = []
        const possiblyDirections = ["ArrowRight", "ArrowDown", "ArrowUp", "ArrowLeft" ];
        document.addEventListener('DOMContentLoaded', initializePage, false);
        var circulo
        var circuloObj
        var LegalTimer
        var speed = 50
        var leftPosition = 0
        var topPosition = 0
        var tick = 0
        var lastCommand = "ArrowDown"
        var windowWidth
        var windowHeight
        
        function addCirculoObject() {
            circuloObj = {id: circulo.id, currentPosition:{x: 0, y:0}} 
        }
        
        function getWindowSize() {
            windowHeight = window.innerHeight
            windowWidth = window.innerWidth
        }

        function timer() {
            LegalTimer = setInterval(changeNumber, 500)
            
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
            document.getElementById("score").innerHTML ="Score:" + tick
            GetBadEnemies()
            
        }

        function initializePage() {
            setCirculo()
            getWindowSize()
            timer()
        }

        function setCirculo() {
            circulo = document.getElementById('circulo')
            addCirculoObject()

        }
        
        function onKey(event) {
            var nextCommand = event.key
            if(possiblyDirections.includes(nextCommand)){   
                lastCommand = event.key
            }
            

        }
        
        function timeToMovementCirculo() {
            var newPosition = getNextPosition(circuloObj.currentPosition, lastCommand)

            circuloObj.currentPosition = newPosition 
        
            moveCharacter(circuloObj.id, circuloObj.currentPosition)

        }

        function GetBadEnemies() {
            var resultado = enemies.filter(function(enemie){
                return enemie.currentPosition.x == circuloObj.currentPosition.x && enemie.currentPosition.y == circuloObj.currentPosition.y
            })
            if(resultado.length > 0 ){ var tickTotal = tick -1
                clearInterval(LegalTimer)
                 alert("Voce morreu men, sua pontuacao final foi " + tickTotal  + " pontos")
                 
                }
        }

        

        //inimigos

        function createEnemie() {
            var position = {x:0, y:0}
            var enemieElement = createBootElement(position)
            var boot = createBoot(enemieElement.id, position.x, position.y)
            enemies.push(boot)

        }

        function createBootElement(position){
            var figure = document.createElement("FIGURE");
            figure.className = "circleInimigo"
            figure.style.top= position.x + "px"
            figure.style.left= position.y + "px"
            figure.id = "enemie_" + enemies.length
            document.body.appendChild(figure)
            return figure;
        }

    

        function createBoot(id, x, y) {
            var boot = {id: id, currentPosition:{x: x, y: y}}
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

})();
    
    


