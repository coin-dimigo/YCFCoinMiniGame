function initInput( ){
    document.addEventListener('keydown', function(event) {
        switch( event.keyCode ){
            case 37:
                keyboards.numLeft = true;
                break;
            case 39:
                keyboards.numRight = true;
                break;
            case 38:
                keyboards.numUp = true;
                break;
            case 40:
                keyboards.numDown = true;
                break;

            case 65:
                keyboards.A = true;
                break;
            case 68:
                keyboards.D = true;
                break;
            case 87:
                keyboards.W = true;
                break;
            case 83:
                keyboards.S = true;
                break;
            case 32:
                keyboards.Space = true;
                break;

        }
    });
    document.addEventListener('keyup', function(event) {
        switch( event.keyCode ){
            case 37:
                keyboards.numLeft = false;
                break;
            case 39:
                keyboards.numRight = false;
                break;
            case 38:
                keyboards.numUp = false;
                break;
            case 40:
                keyboards.numDown = false;
                break;

            case 65:
                keyboards.A = false;
                break;
            case 68:
                keyboards.D = false;
                break;
            case 87:
                keyboards.W = false;
                break;
            case 83:
                keyboards.S = false;
                break;
            case 32:
                keyboards.Space = false;
                break;
        }
    });
}