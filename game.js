function initGame() {
    var resources = {
        mob: "res/mob.png",
        player1: "res/player1.png",
        player2: "res/player2.png",
        arrow: "res/att.png"
    }

    cc.game.onStart = function () {
        //load resources
        cc.LoaderScene.preload(
            [
                resources.mob,
                resources.arrow,
                resources.player1,
                resources.player2,
            ],
            function () {
                var size = cc.director.getWinSize();
                const BLOCK_WIDTH = 60;
                const BLOCK_HEIGHT = 60;
                //const MAX_BLOCK_NUM_X = Math.ceil(size.width / BLOCK_WIDTH);
                //const MAX_BLOCK_NUM_Y = Math.ceil(size.height / BLOCK_HEIGHT);
                const MAX_BLOCK_NUM_X = 20;
                const MAX_BLOCK_NUM_Y = 20;
                const MAX_ARROW_NUMBER = 14;
                const SPEEDBYLEN = 5;
                const SPEEDBYLENMOB = 80;
                const STOP_TIME_DELAY = 90;

                const minX = size.width / 2 - MAX_BLOCK_NUM_X / 2 * BLOCK_WIDTH;
                const maxX = size.width / 2 + (MAX_BLOCK_NUM_X / 2 - 1) * BLOCK_WIDTH;
                const minY = size.height / 2 - MAX_BLOCK_NUM_Y / 2 * BLOCK_HEIGHT;
                const maxY = size.height / 2 + (MAX_BLOCK_NUM_X / 2 - 1) * BLOCK_HEIGHT;


                var gameMap = new Array(MAX_BLOCK_NUM_X);
                var gameLayers = new Array(MAX_BLOCK_NUM_X);
                var gameMobs = new Array();
                var gameLayer2 = new Array(MAX_BLOCK_NUM_X);
                var arrowLayer = new Array();

                var availableToCreateX = (new Array(MAX_BLOCK_NUM_X)).fill(false);
                var availableToCreateY = (new Array(MAX_BLOCK_NUM_X)).fill(false);
                var tmpRect;
                var blocks = new Array();
                var aimPos;
                var aimObj;

                for (let i = 0; i < MAX_BLOCK_NUM_X; i++) {
                    gameMap[i] = new Array(MAX_BLOCK_NUM_Y);
                    gameLayers[i] = new Array(MAX_BLOCK_NUM_Y);
                    gameLayer2[i] = new Array(MAX_BLOCK_NUM_Y);
                    for (let j = 0; j < MAX_BLOCK_NUM_Y; j++) {
                        gameMap[i][j] = 0;
                        if (i < 2 || i >= MAX_BLOCK_NUM_X - 2 || j < 2 || j >= MAX_BLOCK_NUM_Y - 2) {
                            gameMap[i][j] = 4; // EDGE
                        }

                        if ((i >= MAX_BLOCK_NUM_X / 2 - 4 && i <= MAX_BLOCK_NUM_X / 2 + 4) && (j >= MAX_BLOCK_NUM_Y / 2 - 4 && j <= MAX_BLOCK_NUM_Y / 2 + 4)) {
                            gameMap[i][j] = 1; // ACTIVE BLOCK
                            availableToCreateX[i] = availableToCreateY[j] = true;
                        }
                    }
                } //init map
                var MyScene = cc.Scene.extend({
                    onEnter: function () {
                        this._super();
                        isInited = true;
                        
                        for (let i2 = 0; i2 < MAX_BLOCK_NUM_X; i2++) {
                            for (let j2 = 0; j2 < MAX_BLOCK_NUM_Y; j2++) {
                                if (gameMap[i2][j2] == 1) { //ACTIVE BLOCK
                                    let layer = cc.LayerColor.create(cc.Color(120, 40, 120, 255), BLOCK_WIDTH, BLOCK_HEIGHT);
                                    layer.ignoreAnchorPointForPosition(false);
                                    layer.setPosition(minX+i2*BLOCK_WIDTH, minY+j2*BLOCK_HEIGHT);
                                    this.addChild(layer, 0);
                                    gameLayers[i2][j2] = layer;
                                }
                                if (gameMap[i2][j2] == 4) { // EDGE
                                    let layer = cc.LayerColor.create(cc.Color(120, 40, 120, 255), BLOCK_WIDTH, BLOCK_HEIGHT);
                                    layer.ignoreAnchorPointForPosition(false);
                                    layer.setPosition(minX+i2*BLOCK_WIDTH, minY+j2*BLOCK_HEIGHT);
                                    this.addChild(layer, 0);
                                    gameLayer2[i2][j2] = layer;
                                }
                            }
                        }
                        
                        player1 = cc.Sprite.create(resources.player1);
                        player1.setPosition(size.width / 2, size.height / 2);
                        player1.setScale(0.4);
                        this.addChild(player1, 1);

                        player2 = cc.Sprite.create(resources.player2);
                        player2.setPosition(minX + 20, minY + 20);
                        player2.setScale(0.3);
                        this.addChild(player2, 1);

                        // var labelPlayer1 = cc.LabelTTF.create("Player1", "Arial", 30);
                        // labelPlayer1.setColor(0);
                        // labelPlayer1.setPosition(70, 150);
                        // player1.addChild(labelPlayer1, 1);

                        // var labelPlayer2 = cc.LabelTTF.create("Player2", "Arial", 30);
                        // labelPlayer2.setColor(0);
                        // labelPlayer2.setPosition(70, 150);
                        // player2.addChild(labelPlayer2, 1);
                                
                        let aimStd = [
                            {
                                x: 3,
                                y: 3
                            },
                            {
                                x: MAX_BLOCK_NUM_X-4, 
                                y: 3
                            },
                            {
                                x: 3,
                                y: MAX_BLOCK_NUM_Y-4
                            },
                            {
                                x: MAX_BLOCK_NUM_X-4, 
                                y: MAX_BLOCK_NUM_Y-4
                            }
                        ]

                        tmpRect = cc.LayerColor.create(cc.Color(120, 40, 120, 255), BLOCK_WIDTH*(MAX_BLOCK_NUM_X-5), BLOCK_HEIGHT*(MAX_BLOCK_NUM_Y-5)); //2~MAX_BLOCK_NUM_X-2
                        tmpRect.ignoreAnchorPointForPosition(false);
                        tmpRect.setPosition(minX + (MAX_BLOCK_NUM_X-1)*BLOCK_WIDTH/2, minY + (MAX_BLOCK_NUM_Y-1)*BLOCK_HEIGHT/2);

                        // aimPos = {x: 5, y: 5};
                        aimPos = aimStd[ Math.ceil(Math.random() * 40 )%aimStd.length ];
                        let aimX = aimPos.x * BLOCK_WIDTH + minX ;
                        let aimY = aimPos.y * BLOCK_HEIGHT+ minY ;

                        

                        aimObj = cc.LayerColor.create(cc.Color(120, 40, 120, 255), BLOCK_WIDTH*2, BLOCK_HEIGHT*2);
                        aimObj.ignoreAnchorPointForPosition(false);
                        aimObj.setPosition( aimX, aimY );
                        this.addChild( aimObj, 1 );

                        var createRandomMob = () => {
                            let mob = cc.Sprite.create(resources.mob);
                            mob.setPosition( (minX+ BLOCK_WIDTH*(MAX_BLOCK_NUM_X/2-4) ) , (minY+ BLOCK_WIDTH*(MAX_BLOCK_NUM_Y/2-4) ) );
                            mob.setScale(0.3);

                            let labelMob = cc.LabelTTF.create("mob", "Arial", 30);
                            labelMob.setColor(0);
                            labelMob.setPosition(80, 150);
                            mob.addChild(labelMob, 1);
                            this.addChild(mob, 1);
                            let indexT = gameMobs.length;
                            gameMobs[indexT] = mob;
                            console.log(`[add] mob[${indexT}]`);

                            let findPlace = ()=>{
                                let mmaa, mmab, mmba, mmbb;
                                for (let i = 0; i < MAX_BLOCK_NUM_X; i++) { 
                                    if (availableToCreateX[i]) {
                                        mmaa = i;
                                        break;
                                    }
                                }
                                for (let i = mmaa; i < MAX_BLOCK_NUM_X; i++) {
                                    if (!availableToCreateX[i]) {
                                        mmab = i-1;
                                        break;
                                    }
                                }
                                for (let i = 0; i < MAX_BLOCK_NUM_Y; i++) { 
                                    if (availableToCreateY[i]) {
                                        mmba = i;
                                        break;
                                    }
                                }
                                for (let i = mmba; i < MAX_BLOCK_NUM_Y; i++) {
                                    if (!availableToCreateY[i]) {
                                        mmbb = i-1;
                                        break;
                                    }
                                }
                                let tpos = gameMobs[indexT].getPosition();
                                let xx, yy, ok_s; 
                                let originX=Math.round ((tpos.x-minX)/BLOCK_WIDTH);
                                let originY=Math.round ((tpos.y-minY)/BLOCK_HEIGHT);

                                let MMax = ( a, b)=>{
                                    if( a>b) return a;
                                    else return b;
                                }
                                let MMin = (a,b)=>{
                                    return a+b-MMax(a,b);
                                }


                                xx = originX;
                                yy = originY;
                                ok_s= true;
                                switch( Math.floor(Math.random()*100)%2 ){
                                    case 0:
                                    xx = Math.round(Math.random()*MAX_BLOCK_NUM_X)%(mmab - mmaa ) + mmaa;
                                    for( let i=MMin(originX, xx); i<=MMax(originX, xx); i++ ){
                                        if( gameMap[i][originY]!=1 )  {
                                            ok_s = false;
                                            break;
                                        }
                                    }
                                    break;

                                    case 1:
                                    yy = Math.round(Math.random()*MAX_BLOCK_NUM_Y)%(mmbb - mmba ) + mmba;
                                    for( let i=MMin(originY, yy); i<=MMax(originY, yy); i++ ){
                                        if( gameMap[originX][i]!=1 )  {
                                            ok_s = false;
                                            break;
                                        }
                                    }
                                    break;
                                }
                                if( ok_s && gameMap[xx][yy]==1 ) {
                                    console.log(`[GET] location : [${xx*BLOCK_WIDTH+minX}, ${yy*BLOCK_HEIGHT+minY}]`);
                                    console.log(`from[${originX}, ${originY}] -> to[${xx}, ${yy}] [${ok_s?"true":"false"}] `)
                                    return {
                                        x: xx*BLOCK_WIDTH+minX,
                                        y: yy*BLOCK_HEIGHT+minY
                                    }
                                }
                                
                                return false;    
                            }

                            let moveRandomPlace = ()=>{
                                let monster = gameMobs[indexT];
                                // ADD set to DELETED MOB, delete from interval
                                if( !monster ){
                                    console.log("[stop] MOB: stop moving")
                                    return;
                                }
                                let toPos = findPlace();
                                if( toPos){
                                    let fromPos = monster.getPosition();
                                    let len = Math.sqrt( (fromPos.x - toPos.x)*(fromPos.x - toPos.x)+(fromPos.y - toPos.y)*(fromPos.y - toPos.y) , 2.0 );
                                    let time_ = len / SPEEDBYLENMOB ;
                                    monster.runAction(new cc.MoveTo.create(time_, cc.p(toPos.x, toPos.y))); //d
                                    console.log(`[move] MOB from [${fromPos.x}, ${fromPos.y}] to [${toPos.x}, ${toPos.y}]`);
                                    console.log( ` - len: [${len}], time: [${time_}]`);
                                    setTimeout(moveRandomPlace, time_*1000+STOP_TIME_DELAY);
                                } else{
                                    let fromPos = monster.getPosition();
                                    let originX = Math.round((fromPos.x - minX)/BLOCK_WIDTH*10)/10;
                                    let originY = Math.round((fromPos.y - minY)/BLOCK_HEIGHT*10)/10;
                                    
                                    console.log(`[move] retry from [${originX}, ${originY}] to [${toPos.x}, ${toPos.y}] in 300ms`)
                                    setTimeout(moveRandomPlace, 300);
                                }
                            }

                            moveRandomPlace();

    
                        }

                        var createRandomBlock = () => {
                            let x = 2;
                            let y = 2;
                            let mma, mmb;
                            let pA, pB, pC, pD;
                            pA = pB = pC = pD = 10;
                            if( aimPos.x == aimStd[0].x || aimPos.x == aimStd[2].x ){ // left
                                pD += 60;
                            }
                            if( aimPos.x == aimStd[1].x || aimPos.x == aimStd[3].x ){ // right
                                pC += 60;
                            }
                            if( aimPos.y == aimStd[0].y || aimPos.y == aimStd[1].y ){ // bottom
                                pB += 60;
                            }
                            if( aimPos.y == aimStd[2].y || aimPos.y == aimStd[3].y ){ // top
                                pA += 60;
                            }

                            let pP = parseInt(Math.random() * 300 % (pA+pB+pC+pD) );
                            
                            if( pP < pA){ // TOP, select X
                                y = MAX_BLOCK_NUM_Y - 3;
                            }
                            if( pP < pB+pA ){ // Bottom, Select X
                                for (let i = 0; i < MAX_BLOCK_NUM_X; i++) {
                                    if (availableToCreateX[i]) {
                                        mma = i;
                                        break;
                                    }
                                }
                                for (let i = mma; i < MAX_BLOCK_NUM_X; i++) {
                                    if (!availableToCreateX[i]) {
                                        mmb = i-1;
                                        break;
                                    }
                                }
                                x = Math.round(Math.random() * (mmb - mma) + mma);
                                if (!availableToCreateX[x] || gameMap[x][y] != 0) {
                                    console.log(`[make block] return [${x}, ${y}]`);
                                    return setTimeout(this.createRandomBlock, 30);
                                }
                            }
                            
                            else{
                                if( pP < pA+pB+pC ){ //RIGHT, Select Y
                                    x = MAX_BLOCK_NUM_X - 3;
                                }
                                for (let i = 0; i < MAX_BLOCK_NUM_Y; i++) { // left, Select Y
                                    if (availableToCreateY[i]) {
                                        mma = i;
                                        break;
                                    }
                                }
                                for (let i = mma; i < MAX_BLOCK_NUM_Y; i++) {
                                    if (!availableToCreateY[i]) {
                                        mmb = i-1;
                                        break;
                                    }
                                }
                                y = Math.round(Math.random() * (mmb - mma) + mma);
                                if (!availableToCreateX[y] || gameMap[x][y] != 0) {
                                    console.log(`[make block] return [${x}, ${y}]`);
                                    return setTimeout(this.createRandomBlock, 30);
                                }
                            }

                            let xx = x * BLOCK_WIDTH + minX;
                            let yy = y * BLOCK_HEIGHT + minY;
                            let tindex = blocks.length;
                            gameMap[x][y] = 2; //BEFORE BLOCK,
                            console.log(`[make block] [${x}, ${y}]`);

                            blocks[tindex] = cc.LayerColor.create(cc.Color(120, 40, 120, 255), BLOCK_WIDTH, BLOCK_HEIGHT);
                            blocks[tindex].ignoreAnchorPointForPosition(false);
                            blocks[tindex].setPosition(xx, yy);

                            this.addChild(blocks[tindex], 0);
                            
                            var deleteLayerFrom = ( )=>{
                                if( !blocks[tindex] ) return console.log("[delete] This block has been destroyed")
                                blocks[tindex].removeFromParent();
                                gameMap[x][y] = 0;
                                delete blocks[tindex];
                            }

                            setTimeout( deleteLayerFrom, 8000+Math.floor(Math.random()*3000));

                        }

                        var createRandomArrow = () => {
                            //if( arrowLayer.length >= MAX_ARROW_NUMBER ) return;
                            let x = 2;
                            let y = 2;
                            let mma, mmb;
                            let pA, pB, pC, pD;
                            pA = pB = pC = pD = 10;
                            if( aimPos.x == aimStd[0].x || aimPos.x == aimStd[2].x ){ // left
                                pD += 30;
                            }
                            if( aimPos.x == aimStd[1].x || aimPos.x == aimStd[3].x ){ // right
                                pC += 30;
                            }
                            if( aimPos.y == aimStd[0].y || aimPos.y == aimStd[1].y ){ // bottom
                                pB += 30;
                            }
                            if( aimPos.y == aimStd[2].y || aimPos.y == aimStd[3].y ){ // top
                                pA += 30;
                            }

                            let pP = parseInt(Math.random() * 300 % (pA+pB+pC+pD) );
                            
                            if( pP < pA){ // TOP, select X
                                y = MAX_BLOCK_NUM_Y - 3;
                            }
                            if( pP < pB+pA ){ // Bottom, Select X
                                for (let i = 0; i < MAX_BLOCK_NUM_X; i++) {
                                    if (availableToCreateX[i]) {
                                        mma = i;
                                        break;
                                    }
                                }
                                for (let i = mma; i < MAX_BLOCK_NUM_X; i++) {
                                    if (!availableToCreateX[i]) {
                                        mmb = i-1;
                                        break;
                                    }
                                }
                                x = Math.round(Math.random() * (mmb - mma) + mma);
                                if (!availableToCreateX[x] || gameMap[x][y] != 0) {
                                    console.log(`[make arrow] return [${x}, ${y}]`);
                                    return setTimeout(this.createRandomArrow, 30);
                                }
                            }
                            
                            else{
                                if( pP < pA+pB+pC ){ //RIGHT, Select Y
                                    x = MAX_BLOCK_NUM_X - 3;
                                }
                                for (let i = 0; i < MAX_BLOCK_NUM_Y; i++) { // left, Select Y
                                    if (availableToCreateY[i]) {
                                        mma = i;
                                        break;
                                    }
                                }
                                for (let i = mma; i < MAX_BLOCK_NUM_Y; i++) {
                                    if (!availableToCreateY[i]) {
                                        mmb = i-1;
                                        break;
                                    }
                                }
                                y = Math.round(Math.random() * (mmb - mma) + mma);
                                if (!availableToCreateX[y] || gameMap[x][y] != 0) {
                                    console.log(`[make arrow] return [${x}, ${y}]`);
                                    return setTimeout(this.createRandomArrow, 30);
                                }
                            }

                            let xx = x * BLOCK_WIDTH + minX;
                            let yy = y * BLOCK_HEIGHT + minY;
                            let tindex = arrowLayer.length;
                            gameMap[x][y] = 3; //ARROW,
                            console.log(`[make arrow] [${x}, ${y}]`);

                            arrowLayer[tindex] = cc.Sprite.create(resources.arrow);
                            arrowLayer[tindex].ignoreAnchorPointForPosition(false);
                            arrowLayer[tindex].setPosition(xx, yy);
                            arrowLayer[tindex].setScale(0.8);

                            this.addChild(arrowLayer[tindex], 2);
                            
                            var deleteLayerFrom = ( )=>{
                                if( !arrowLayer[tindex] ) return console.log("[delete] This arrow has been destroyed")
                                arrowLayer[tindex].removeFromParent();
                                gameMap[x][y] = 0;
                                delete arrowLayer[tindex];
                            }

                            setTimeout( deleteLayerFrom, 4000+Math.floor(Math.random()*3000));

                        }

                        //createRandomMob();
                        setInterval( createRandomMob, 6500 );
                        setInterval( createRandomBlock, 2300);
                        setInterval( createRandomArrow, 970);

                        this.scheduleUpdate();
                    },

                    update: function (dt) {
                        // this.space.step(dt);

                        if (keyboards.D) speedX1 = 1;
                        else if (keyboards.A) speedX1 = -1;
                        else speedX1 = 0;

                        if (keyboards.W) speedY1 = 1;
                        else if (keyboards.S) speedY1 = -1;
                        else speedY1 = 0;

                        if (keyboards.numRight) speedX2 = 1;
                        else if (keyboards.numLeft) speedX2 = -1;
                        else speedX2 = 0;

                        if (keyboards.numUp) speedY2 = 1;
                        else if (keyboards.numDown) speedY2 = -1;
                        else speedY2 = 0;

                        if (keyboards.W || keyboards.S || keyboards.A || keyboards.D) {
                            this.moveP1();
                        }
                        if (keyboards.numLeft || keyboards.numRight || keyboards.numUp || keyboards.numDown) {
                            this.moveP2();
                        }

                        let rect1 = player1.getBoundingBox();
                        for( let i=0; i<gameMobs.length; i++ ){
                            if( !gameMobs[i] ) continue;
                            if( cc.rectIntersectsRect(rect1, gameMobs[i].getBoundingBox())){ //collide
                                console.log("[Crash!]");
                                // 체력 감소?
                                gameMobs[i].removeFromParent();
                                delete gameMobs[i];
                            }
                        }

                        
                        let ok_ = false;
                        for (let i = 0; i < MAX_BLOCK_NUM_X; i++) {
                            for (let j = 0; j < MAX_BLOCK_NUM_Y; j++) {
                                if (gameMap[i][j] == 1) {
                                    if (cc.rectIntersectsRect(rect1, gameLayers[i][j].getBoundingBox())) {
                                        ok_ = true;
                                        break;
                                    }
                                }
                            }
                        }
                        
                        if (!ok_) {
                            let spriteX = player1.getPosition().x + speedX1 * SPEED;
                            let spriteY = player1.getPosition().y + speedY1 * SPEED;
    
                            let XX = Math.round( (spriteX-minX) / BLOCK_WIDTH);
                            let YY = Math.round( (spriteY-minY) / BLOCK_HEIGHT);

                            player1.setPosition(size.width / 2, size.height / 2);
                            console.log(`[PLAYER1] move out from map [${XX}, ${YY}]`);
                        }

                        
                        if( cc.rectIntersectsRect(rect1, aimObj.getBoundingBox())){
                            alert("[ C L E A R ]");
                            speedX1=speedX2=speedY1=speedY2=0;
                            keyboards.numLeft = keyboards.numTop = keyboards.numDown = keyboards.numRight = keyboards.W = keyboards.A = keyboards.S = keyboards.D = keyboards.Space = false;
                            player1.setPosition(size.width/2, size.height/2);
                        }


                    },
                    moveP1: function () {
                        let spriteX = player1.getPosition().x + speedX1 * SPEED;
                        let spriteY = player1.getPosition().y + speedY1 * SPEED;

                        let XX = Math.round( (spriteX-minX) / BLOCK_WIDTH);
                        let YY = Math.round( (spriteY-minY) / BLOCK_HEIGHT);

                        sprite_action = cc.MoveBy.create(0.2, cc.p(speedX1 * SPEED, speedY1 * SPEED));
                        player1.runAction(sprite_action);
                    },
                    moveP2: function () {
                        let spriteX = player2.getPosition().x + speedX2 * SPEED;
                        let spriteY = player2.getPosition().y + speedY2 * SPEED;

                        let XX = Math.round( (spriteX-minX)/BLOCK_WIDTH );
                        let YY = Math.round( (spriteY-minY)/BLOCK_HEIGHT);
                        
                        let rect1 = player2.getBoundingBox();
                        
                        if( cc.rectIntersectsRect( rect1,tmpRect.getBoundingBox() ) ){ //가운데서 밀기 
                            let centerX = minX + (MAX_BLOCK_NUM_X-1)*BLOCK_WIDTH/2;
                            let centerY = minY + (MAX_BLOCK_NUM_Y-1)*BLOCK_HEIGHT/2;
                            
                            XX = (spriteX-centerX)*1.021 + centerX;
                            YY = (spriteY-centerY)*1.021 + centerY;

                            sprite_action = cc.MoveTo.create(0.2, cc.p(XX,YY));
                            player2.runAction(sprite_action);

                            console.log(`[OUT] [${XX}, ${YY}]`);
                            return;
                        }

                        if( spriteX<minX || spriteX>maxX || spriteY<minY || spriteY>maxY ){
                            let centerX = minX + (MAX_BLOCK_NUM_X-1)*BLOCK_WIDTH/2;
                            let centerY = minY + (MAX_BLOCK_NUM_Y-1)*BLOCK_HEIGHT/2;
                            
                            XX = (spriteX-centerX)*0.979 + centerX;
                            YY = (spriteY-centerY)*0.979 + centerY;

                            sprite_action = cc.MoveTo.create(0, cc.p(XX,YY));
                            player2.runAction(sprite_action);

                            console.log(`[OUT] [${XX}, ${YY}]`);
                            return;
                        }
                        //console.log(`[move] [${spriteX}, ${spriteY}] min[${minX}, ${minY}] max[${maxX}, ${maxY}]`)
                        
                        sprite_action = cc.MoveBy.create(0, cc.p(speedX2 * SPEED, speedY2 * SPEED));
                        player2.runAction(sprite_action);
                        
                        for( let i=0; i<arrowLayer.length; i++){
                            if( !arrowLayer[i] ) continue;
                            rect2 = arrowLayer[i].getBoundingBox();
                            if( cc.rectIntersectsRect(rect1, rect2)){

                                let pos = arrowLayer[i].getPosition();
                                let ax = Math.round( (pos.x - minX ) / BLOCK_WIDTH );
                                let ay = Math.round( (pos.y - minY ) / BLOCK_HEIGHT );
                                let dx=0, dy=0;

                                //Moving

                                let newlayer = cc.Sprite.create(resources.arrow);
                                newlayer.ignoreAnchorPointForPosition(false);
                                newlayer.setPosition(pos.x, pos.y);
                                newlayer.setScale(0.8);
                                this.addChild(newlayer,3);

                                arrowLayer[i].removeFromParent(  );
                                delete arrowLayer[i];
                                gameMap[ ax ][ ay ] = 0;

                                if( ax == MAX_BLOCK_NUM_X-3){ // X (-) 
                                    dx = -1;
                                }
                                else if( ax == 2 ){ // X(+)
                                    dx = 1;
                                }

                                else if( ay == MAX_BLOCK_NUM_Y-3){ // Y (-) 
                                    dy = -1;
                                }
                                else if( ay == 2 ){ // Y (+)
                                    dy = 1;
                                }

                                let timem = 1/SPEEDBYLEN ;

                                let moveArrow = ()=>{
                                    
                                    newlayer.runAction(cc.MoveBy.create( timem, cc.p(dx*BLOCK_WIDTH, dy*BLOCK_HEIGHT) ));
                                    let rect1= newlayer.getBoundingBox();
                                    console.log(`[move] arrow from [${minX+ax*BLOCK_WIDTH}, ${minY+ay*BLOCK_HEIGHT}]`);
                                    for( let i=0; i<gameMobs.length; i++){
                                        if( !gameMobs[i]) continue;
                                        if( cc.rectIntersectsRect(rect1, gameMobs[i].getBoundingBox())){
                                            gameMobs[i].removeFromParent();
                                            delete gameMobs[i];
                                            console.log(`[delete] mob`);
                                        }
                                    }
                                }

                                let prog = ()=>{
                                    let i;
                                    
                                    for( i=0; i< (dx?MAX_BLOCK_NUM_X:MAX_BLOCK_NUM_Y); i++){
                                        setTimeout( moveArrow, i*timem*1000);
                                    }
                                    setTimeout( deleteLayer2, i*timem*1000);
                                }

                                let deleteLayer2 = ()=>{
                                    //DELETE CODE
                                    newlayer.removeFromParent();
                                    console.log("[delete] arrow")
                                }

                                setTimeout(prog,0);

                                break;
                            }
                        }//arrow 밀기

                        for( let i=0; i<blocks.length; i++){
                            if( !blocks[i] ) continue;
                            rect2 = blocks[i].getBoundingBox();
                            if( cc.rectIntersectsRect(rect1, rect2)){

                                let pos = blocks[i].getPosition();
                                let ax = Math.round( (pos.x - minX ) / BLOCK_WIDTH );
                                let ay = Math.round( (pos.y - minY ) / BLOCK_HEIGHT );
                                let bx, by;

                                //Moving
                                let newlayer = cc.LayerColor.create(cc.Color(120, 40, 120, 255), BLOCK_WIDTH, BLOCK_HEIGHT);
                                newlayer.ignoreAnchorPointForPosition(false);
                                newlayer.setPosition(pos.x, pos.y);
                                this.addChild(newlayer);

                                if( ax == MAX_BLOCK_NUM_X-3){ // X (-) 
                                    by = ay;
                                    for( let i=MAX_BLOCK_NUM_X-3; i>=2; i--){
                                        if( gameMap[i][by]==1 ){
                                            bx = i+1;
                                            break;
                                        }
                                    }
                                }
                                else if( ax == 2 ){ // X(+)
                                    by = ay;
                                    for( let i=2; i<MAX_BLOCK_NUM_X-2; i++){
                                        if( gameMap[i][by]==1 ){
                                            bx = i-1;
                                            break;
                                        }
                                    }
                                }

                                else if( ay == MAX_BLOCK_NUM_Y-3){ // Y (-) 
                                    bx = ax;
                                    for( let i=MAX_BLOCK_NUM_Y-3; i>=2; i--){
                                        if( gameMap[bx][i]==1 ){
                                            by = i+1;
                                            break;
                                        }
                                    }
                                }
                                else if( ay == 2 ){ // Y (+)
                                    bx = ax;
                                    for( let i=2; i<MAX_BLOCK_NUM_Y-2; i++){
                                        if( gameMap[bx][i]==1 ){
                                            by = i-1;
                                            break;
                                        }
                                    }
                                }

                                let time = Math.sqrt( Math.pow((ax-bx),2.0)*Math.pow((ay-by),2.0), 2.0 )*SPEEDBYLEN + 1.3;
                                newlayer.runAction(cc.MoveTo.create( time, cc.p(minX+bx*BLOCK_WIDTH, minY+by*BLOCK_HEIGHT) ));
                                gameMap[bx][by]=1;
                                gameLayers[bx][by]=newlayer;
                                availableToCreateX[bx] = availableToCreateY[by] = true;


                                //DELETE CODE
                                console.log(`[move] block from [${minX+ax*BLOCK_WIDTH}, ${minY+ay*BLOCK_HEIGHT}] -> to [${minX+bx*BLOCK_WIDTH}, ${minY+by*BLOCK_HEIGHT}]`);
                                blocks[i].removeFromParent();
                                gameMap[ax][ay] = 0;
                                delete blocks[i];
                                console.log("[delete] block")

                                break;
                            }
                        }//block 밀기
                        
                    }


                });
                cc.director.runScene(new MyScene());
            }, this);

    };

    cc.game.run("gameCanvas");

};