// public/js/controllers/MainCtrl.js
angular.module('MainCtrl', ['ngAria', 'ngMaterial']).controller('MainController', function ($scope) {

    $scope.piano = Synth.createInstrument('piano');
    $scope.playlist = [
        {note: "C", octave: 4, duration: 2},
        {note: "D", octave: 4, duration: 2},
        {note: "E", octave: 4, duration: 2},
        {note: "F", octave: 4, duration: 2},
        {note: "G", octave: 4, duration: 2},
        {note: "A", octave: 4, duration: 2},
        {note: "B", octave: 4, duration: 2},
        {note: "C", octave: 5, duration: 2}
    ];

    $scope.randomize = function () {
        $scope.randomPlaylist = [];
        for (var count = 0; count < 7; count++) {
            var randomize = $scope.playlist[Math.floor($scope.playlist.length * Math.random())];
            console.log(randomize);
            $scope.randomPlaylist.push(randomize);
        }
    };

    $scope.playNote = function (i) {
        $scope.piano.play(i.note, i.octave, i.duration);
    };

    var speed = 500;
    $scope.play = function () {
        var totalDelay = 0, i = 0;
        for (var key in $scope.randomPlaylist) {
            setTimeout(function () {
                $scope.playNote($scope.randomPlaylist[i]);
                i++;
            }, totalDelay);
            totalDelay += $scope.randomPlaylist[key].duration * speed;
        }
    };


    $scope.tones = [
        "A", "A♯/B♭", "B", "C", "C♯/D♭", "D", "D♯/E♭", "E", "F", "F♯/G♭", "G", "G♯/A♭"
    ];

    $scope.selectedKey = undefined;

    $scope.getSelectedKey = function() {
        if ($scope.selectedKey !== undefined) {
            return $scope.selectedKey;
        } else {
            return "Select a Key"
        }
    };
});