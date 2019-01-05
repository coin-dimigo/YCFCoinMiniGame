var a1,a2
function updateUI(gapTime){
    let str ="";
    let m = 6;
    //a1.innerHTML=`${ (gapTime/60>=10?"":"0")}${Math.floor(gapTime/60)}`;
    for( let gtn=gapTime>0?gapTime:1; gtn>0; gtn=Math.floor(gtn/10)) m--;
    for( ; m>0; m--) str += "0"
    a1.innerHTML = str+gapTime;
}

function updateUI2(){
    a2.innerHTML = ` ${life_>0?life_:"<span style='color: #f00'>You died</span>" } `;
}

function addLife( n ){
    life_ += n;
    updateUI2();
}

function addScore( n ){
    SCORE_ += n;
    if( SCORE_ < 0 ) SCORE_ =0;
    updateUI(SCORE_);
}

function timeScore(){
    let currentTime = new Date();
    let gapScore = Math.floor( (currentTime.getTime() - lastTime_.getTime()) / 100);
    addScore( gapScore );
    lastTime_ = currentTime;
}

function initUI(){
    a1 = document.getElementById("score");
    a2 = document.getElementById("life");
    SCORE_ = 0;
    life_ = MAX_LIFE;
    setInterval( timeScore, 1000);
}