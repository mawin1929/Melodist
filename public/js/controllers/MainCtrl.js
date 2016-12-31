// public/js/controllers/MainCtrl.js
angular.module('MainCtrl', []).controller('MainController', function ($scope) {

    $scope.tagline = "To the moon and back!";
    VF = Vex.Flow;


    // $scope.note =
    // {
    //     note: 'C',
    //     octave: 5,
    //     duration: 2
    // };

    $scope.tones = [
        {id: "A", name: 'A'},
        {id: "B", name: 'B'},
        {id: "C", name: 'C'}
    ];

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

    $scope.randomize = function () {
        $scope.randomPlaylist = [];
        for (var count = 0; count < 7; count++) {
            var randomize = $scope.playlist[Math.floor($scope.playlist.length * Math.random())];
            // console.log(randomize);
            $scope.randomPlaylist.push(randomize);
            var temp = $scope.randomPlaylist[0].note.toLowerCase();
            $scope.lowerCaseNotes = [];
            $scope.lowerCaseNotes.push(temp);
            console.log($scope.lowerCaseNotes[0]);
            $scope.drawNotes();

        }
    };

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


    // Materialize
    $('select').material_select();

});