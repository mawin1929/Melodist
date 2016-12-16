/**
 * Created by Michael Win on 12/15/2016.
 */
var soundID ="Thunder";
function loadSound () {
    createjs.Sound.registerSound("assets/kirby032.mp3", soundID);
}
function playSound () {
    createjs.Sound.play(soundID);
}

    