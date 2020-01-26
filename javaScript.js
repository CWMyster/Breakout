
        const container = document.querySelector('.container');
        
        let conDim = container.getBoundingClientRect();
        
        const gameover = document.createElement('div');
        gameover.textContent = "Start Game";
        gameover.style.position = "absolute";
        gameover.style.color = "white";
        gameover.style.lineHeight = "300px";
        gameover.style.textAlign = "center";
        gameover.style.fontSize = "3em";
        gameover.style.textTransform = "uppercase";
        gameover.style.backgroundColor = "red";
        gameover.style.width = "100%";
        container.appendChild(gameover);
        gameover.addEventListener('click', startGame);
        container.appendChild(gameover);

        const ball = document.createElement('div');
        ball.style.position = "absolute";
        ball.style.width = "20px";
        ball.style.height = "20px";
        ball.style.backgroundColor = "white";
        ball.style.borderRadius = "25px";
        ball.style.backgroundImage = "url('images/ball_60x60.png')";
        ball.style.backgroundSize = "20px 20px";
        ball.style.display = "none";
        ball.style.top = "76%";
        ball.style.left = "%60";
         
        container.appendChild(ball);
        
        const paddle = document.createElement('div');
        paddle.style.position = "absolute";
        paddle.style.backgroundColor = "white";
        paddle.style.height = "20px";
        paddle.style.width = "150px";
        paddle.style.borderRadius = "25px";
        paddle.style.bottom = "30px";
        paddle.style.left = "50%";
        container.appendChild(paddle);

        document.addEventListener('keydown', function(e) {
            //console.log(e.keyCode);
            if(e.keyCode === 37)paddle.left = true;
            if(e.keyCode === 39)paddle.right = true;
        })
        
          document.addEventListener('keyup', function(e) {
            //console.log(e.keyCode);
            if(e.keyCode === 37)paddle.left = false;
            if(e.keyCode === 39)paddle.right = false;
        })

        const player = {
            gameover :true
        };
        
        function startGame() {
            //console.log('start');
            if(player.gameover){
                player.gameover = false;
                gameover.style.display = "none";
                player.score = 0;
                player.lives = 3;
                ball.style.display = "block";
                player.ballDir = [5,5];
                //setup bricks
                setupBricks(30);
                scoreUpdater();
                window.requestAnimationFrame(update);
            }  
      }
        
        function setupBricks(num){
            let row = {
                x: ((conDim.width % 100)/2),
                y: 50
            }
            let skip = false;
            for(let x=0; x<num; x++){
                //console.log(row);
                if(row.x>(conDim.width-100)){
                    row.y += 50;
                    if (row.y > (conDim.height/2)){
                        skip = true;
                    }
                    row.x = ((conDim.width % 100)/2);
                }
                row.count = x;
                if(!skip) {
                    createBrick(row);}
                row.x += 100;
            }
        }
        
        function createBrick(pos){
            const div = document.createElement('div');
            div.setAttribute('class','brick');
            div.style.backgroundColor = rColor();
            div.textContent = pos.count + 1;
            div.style.left = pos.x +'px';
            div.style.top = pos.y + 'px';            
            container.appendChild(div);
        }
         
        function isCollide(a,b){
            let aRect = a.getBoundingClientRect();
            let bRect = b.getBoundingClientRect();
            //console.log(aRect); //paddle
            //console.log(bRect); //ball
       
            //console.log(temp1);
            //console.log(temp2);
            return !((aRect.right< bRect.left)||(aRect.left>bRect.right)||!(aRect.top< bRect.bottom)||(aRect.top>bRect.bottom));
                    
        }
            
        function rColor(){
            return '#' + Math.random().toString(16).substr(-6);
        }
        
       
        function scoreUpdater(){
            document.querySelector('.score').textContent = player.score;
            document.querySelector('.lives').textContent = player.lives;
        }

        function update() {
            let pCurrent = paddle.offsetLeft;
            moveBall();
            //console.log(pCurrent);
            if(paddle.left){
                pCurrent -= 5;
            }
            if(paddle.right){
               pCurrent +=5;
               }
            
            paddle.style.left = pCurrent + 'px';                   
            window.requestAnimationFrame(update);
        }
        
        function moveBall(){
            let posBall = {
                x:ball.offsetLeft,
                y:ball.offsetTop
            }
            
            if(posBall.y > (conDim.height-30) || posBall.y <0){
                player.ballDir[1] *= -1;
            }
              if(posBall.x > (conDim.width-20) || posBall.x <0){
                player.ballDir[0] *= -1;
            }
            
                       
            if(isCollide(paddle,ball)){
                //paddle physics
                 let temp = ((posBall.x-paddle.offsetLeft)-(paddle.offsetWidth/2))/10
                 console.log('hit');
                 player.ballDir[0] = temp;
                 player.ballDir[1] *= -1;
               
            };
            let bricks = document.querySelectorAll('.brick');
            for(let tBrick of bricks){
                if(isCollide(tBrick,ball)){
                    player.ballDir[1]*=-1;
                    //tBrick.remove;
                    tBrick.parentNode.removeChild(tBrick);
                    player.score++;
                    scoreUpdater();
                }
            
            }
                      
            
            posBall.y += player.ballDir[1];
            posBall.x += player.ballDir[0];
            
            ball.style.top = posBall.y + 'px';
            ball.style.left = posBall.x + 'px';
        }
 


        /*var start = null;
 
        function step(timestamp) {
            if (!start) start = timestamp;
            var progress = timestamp - start;
            container.style.transform = 'translateX(' + Math.min(progress / 10, 200) + 'px)';
            if (progress < 2000) {
                console.log(progress);
                window.requestAnimationFrame(step);
            }
        }

        window.requestAnimationFrame(step);*/
