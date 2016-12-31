// public/js/controllers/MainCtrl.js
angular.module('MainCtrl', ['ngAria', 'ngMaterial']).controller('MainController', function ($scope) {
    $scope.tagline = "To the moon and back!";
    $scope.majorIntervals = [2, 2, 1, 2, 2, 2, 1];
    VF = Vex.Flow;

    $scope.piano = Synth.createInstrument('piano');
    $scope.keyboard = [];
    for (var octaveNum = 4; octaveNum <= 5; octaveNum++) {
        $scope.keyboard.push({note: "C", octave: octaveNum, duration: 2},
            {note: "C#", octave: octaveNum, duration: 2},
            {note: "D", octave: octaveNum, duration: 2},
            {note: "D#", octave: octaveNum, duration: 2},
            {note: "E", octave: octaveNum, duration: 2},
            {note: "F", octave: octaveNum, duration: 2},
            {note: "F#", octave: octaveNum, duration: 2},
            {note: "G", octave: octaveNum, duration: 2},
            {note: "G#", octave: octaveNum, duration: 2},
            {note: "A", octave: octaveNum, duration: 2},
            {note: "A#", octave: octaveNum, duration: 2},
            {note: "B", octave: octaveNum, duration: 2})
    }

    $scope.notesArray = [
        // new VF.StaveNote({clef: "treble", keys: [$scope.lowerCaseNotes[0]/"4"], duration: "q"}),
        new VF.StaveNote({clef: "treble", keys: ["c/4"], duration: "q"}),
        new VF.StaveNote({clef: "treble", keys: ["d/4"], duration: "q"}),
        new VF.StaveNote({clef: "treble", keys: ["e/4"], duration: "q"}),
        new VF.StaveNote({clef: "treble", keys: ["f/4"], duration: "q"}),
        new VF.StaveNote({clef: "treble", keys: ["g/4"], duration: "q"}),
        new VF.StaveNote({clef: "treble", keys: ["a/4"], duration: "q"}),
        new VF.StaveNote({clef: "treble", keys: ["b/4"], duration: "q"}),
        new VF.StaveNote({clef: "treble", keys: ["c/5"], duration: "q"})
    ];

    $scope.drawNotes = function () {
        $scope.tagline = "Hi Tim";
        $scope.context.clear();
        $scope.notesArray = [
            // new VF.StaveNote({clef: "treble", keys: [$scope.lowerCaseNotes[0]/"4"], duration: "q"}),
            new VF.StaveNote({clef: "treble", keys: ["b/4"], duration: "q"}),
            new VF.StaveNote({clef: "treble", keys: ["a/4"], duration: "q"}),
            new VF.StaveNote({clef: "treble", keys: ["g/4"], duration: "q"}),
            new VF.StaveNote({clef: "treble", keys: ["f/4"], duration: "q"}),
            new VF.StaveNote({clef: "treble", keys: ["c/4"], duration: "q"}),
            new VF.StaveNote({clef: "treble", keys: ["d/4"], duration: "q"}),
            new VF.StaveNote({clef: "treble", keys: ["b/4"], duration: "q"}),
            new VF.StaveNote({clef: "treble", keys: ["c/5"], duration: "q"})
        ];

        VF.Formatter.FormatAndDraw($scope.context, $scope.stave, $scope.notesArray);
    };

    $scope.randomize = function () {
        if ($scope.selectedKey !== undefined) {
            $scope.randomPlaylist = [];
            var filteredKeyboard = $scope.filterKeyboard();
            for (var count = 0; count < 7; count++) {
                var randomize = filteredKeyboard[Math.floor(filteredKeyboard.length * Math.random())];
                $scope.randomPlaylist.push(randomize);
                var temp = $scope.randomPlaylist[0].note.toLowerCase();
                $scope.lowerCaseNotes = [];
                $scope.lowerCaseNotes.push(temp);
                console.log($scope.lowerCaseNotes[0]);
                $scope.drawNotes();
            }
        } else {
            Materialize.toast('Please select a key', 2000)
        }
    };

    $scope.filterKeyboard = function() {
        var filteredKeyboard = [];
        var index = 0;
        for (var i = 0; i < $scope.keyboard.length - 1; i++) {
            if ($scope.keyboard[i].note == $scope.selectedKey) {
                index = i;
                filteredKeyboard.push($scope.keyboard[index]);
                break;
            }
        }

        for (var i = 0; i < $scope.majorIntervals.length; i++) {
            index += $scope.majorIntervals[i];
            filteredKeyboard.push($scope.keyboard[index]);
        }

        for (var i = 0; i < filteredKeyboard.length; i++) {
            console.log(filteredKeyboard[i]);
        }

        return filteredKeyboard;
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

    //Vexflow (clef visualization)

    var div = document.getElementById("clef");
    var renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);
    renderer.resize(900, 200); //size
    $scope.context = renderer.getContext();
    $scope.context.setFont("Arial", 10, "").setBackgroundFillStyle("#eed"); //font and bg-fill
    // Create a stave of width 400 at position 10, 40 on the canvas.
    $scope.stave = new VF.Stave(10, 40, 800);
    // Add a clef and time signature.
    $scope.stave.addClef("treble").addTimeSignature("4/4");
    // Connect it to the rendering context and draw!
    $scope.stave.setContext($scope.context).draw();

    //Adding notes

    VF.Formatter.FormatAndDraw($scope.context, $scope.stave, $scope.notesArray);

    $scope.tones = [
        {note: "A", noteText: "A"},
        {note: "A#", noteText: "A♯/B♭"},
        {note: "B", noteText: "B"},
        {note: "C", noteText: "C"},
        {note: "C#", noteText: "C♯/D♭"},
        {note: "D", noteText: "D"},
        {note: "D#", noteText: "D♯/E♭"},
        {note: "E", noteText: "E"},
        {note: "F", noteText: "F"},
        {note: "F#", noteText: "F♯/G♭"},
        {note: "G", noteText: "G"},
        {note: "G#", noteText: "G♯/A♭"}
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