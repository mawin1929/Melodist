// public/js/controllers/MainCtrl.js
angular.module('MainCtrl', ['ngAria', 'ngMaterial']).controller('MainController', function ($scope) {
    $scope.tagline = "To the moon and back!";
    $scope.majorIntervals = [2, 2, 1, 2, 2, 2, 1];

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

    $scope.randomize = function () {
        if ($scope.selectedKey !== undefined) {
            $scope.randomPlaylist = [];
            var filteredKeyboard = $scope.filterKeyboard();
            $scope.lowerCaseNotes = [];
            for (var count = 0; count < 8; count++) {
                var randomize = filteredKeyboard[Math.floor(filteredKeyboard.length * Math.random())];
                $scope.randomPlaylist.push(randomize);
                var temp = $scope.randomPlaylist[count].note.toLowerCase();
                $scope.lowerCaseNotes.push(temp);

            }
            $scope.drawNotes();
        } else {
            Materialize.toast('Please select a key', 2000)
        }
    };

    $scope.filterKeyboard = function () {
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

    $scope.getSelectedKey = function () {
        if ($scope.selectedKey !== undefined) {
            return $scope.selectedKey;
        } else {
            return "Select a Key"
        }
    };

    $scope.VF = Vex.Flow;

    $scope.notesArray = [
        // new VF.StaveNote({clef: "treble", keys: [$scope.lowerCaseNotes[0]/"4"], duration: "q"}),
        new $scope.VF.StaveNote({clef: "treble", keys: ["c/4"], duration: "q"}),
        new $scope.VF.StaveNote({clef: "treble", keys: ["d/4"], duration: "q"}),
        new $scope.VF.StaveNote({clef: "treble", keys: ["e/4"], duration: "q"}),
        new $scope.VF.StaveNote({clef: "treble", keys: ["f/4"], duration: "q"}),
        new $scope.VF.StaveNote({clef: "treble", keys: ["g/4"], duration: "q"}),
        new $scope.VF.StaveNote({clef: "treble", keys: ["a/4"], duration: "q"}),
        new $scope.VF.StaveNote({clef: "treble", keys: ["b/4"], duration: "q"}),
        new $scope.VF.StaveNote({clef: "treble", keys: ["c/5"], duration: "q"})
    ];

    $scope.drawNotes = function () {
        $scope.context.clear();
        $scope.context = $scope.renderer.getContext();
        $scope.context.setFont("Arial", 10, "").setBackgroundFillStyle("#eed"); //font and bg-fill
        // Create a stave of width 400 at position 10, 40 on the canvas.
        $scope.stave = new $scope.VF.Stave(10, 40, 800);
        // Add a clef and time signature.
        $scope.stave.addClef("treble").addTimeSignature("4/4");
        // Connect it to the rendering context and draw!
        $scope.stave.setContext($scope.context).draw();
        $scope.notesArray = [
            new $scope.VF.StaveNote({clef: "treble", keys: [$scope.lowerCaseNotes[0] + "/4"], duration: "q"}),
            new $scope.VF.StaveNote({clef: "treble", keys: [$scope.lowerCaseNotes[1] + "/4"], duration: "q"}),
            new $scope.VF.StaveNote({clef: "treble", keys: [$scope.lowerCaseNotes[2] + "/4"], duration: "q"}),
            new $scope.VF.StaveNote({clef: "treble", keys: [$scope.lowerCaseNotes[3] + "/4"], duration: "q"}),
            new $scope.VF.StaveNote({clef: "treble", keys: [$scope.lowerCaseNotes[4] + "/4"], duration: "q"}),
            new $scope.VF.StaveNote({clef: "treble", keys: [$scope.lowerCaseNotes[5] + "/4"], duration: "q"}),
            new $scope.VF.StaveNote({clef: "treble", keys: [$scope.lowerCaseNotes[6] + "/4"], duration: "q"}),
            new $scope.VF.StaveNote({clef: "treble", keys: [$scope.lowerCaseNotes[7] + "/4"], duration: "q"})

        ];
        $scope.VF.Formatter.FormatAndDraw($scope.context, $scope.stave, $scope.notesArray);
    };
}).directive('afterRender', function ($timeout) {
    return {
        link: function ($scope, element, attr) {
            $timeout(function () {

                //Vexflow (clef visualization)
                var div = document.getElementById("clef");
                $scope.renderer = new $scope.VF.Renderer(div, $scope.VF.Renderer.Backends.SVG);
                $scope.renderer.resize(900, 200); //size
                $scope.context = $scope.renderer.getContext();
                $scope.context.setFont("Arial", 10, "").setBackgroundFillStyle("#eed"); //font and bg-fill
                // Create a stave of width 400 at position 10, 40 on the canvas.
                $scope.stave = new $scope.VF.Stave(10, 40, 800);
                // Add a clef and time signature.
                $scope.stave.addClef("treble").addTimeSignature("4/4");
                // Connect it to the rendering context and draw!
                $scope.stave.setContext($scope.context).draw();
                $scope.VF.Formatter.FormatAndDraw($scope.context, $scope.stave, $scope.notesArray);

                $('select').material_select();
            });
        }
    }
});
;