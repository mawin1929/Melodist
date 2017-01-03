// public/js/controllers/MainCtrl.js
angular.module('MainCtrl', ['ngAria', 'ngMaterial'])

    .constant("constants", {
        "majorIntervals": [2, 2, 1, 2, 2, 2, 1],
        "minorIntervals": [2, 1, 2, 2, 1, 2, 2]
    })

    .controller('MainController', function ($scope, constants) {
        $scope.tagline = "To the moon and back!"; // lol
        $scope.allNotes= [[]];

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
            if ($scope.selectedKey == undefined) {
                Materialize.toast('Please select a key', 2000);
            } else if ($scope.selectedScale == undefined) {
                Materialize.toast('Please select a scale', 2000)
            } else {
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

            var intervals = undefined;
            if ($scope.selectedScale == "Ma") {
                intervals = constants.majorIntervals;
            } else {
                intervals = constants.minorIntervals;
            }

            for (var i = 0; i < intervals.length; i++) {
                index += intervals[i];
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
        $scope.stopBool = 0;

        $scope.stop=function(){
            $scope.stopBool = 1;

            Synth.setVolume(0);
            console.log("stopBool is true, music should stop now")
        };


        $scope.play = function () {
            var totalDelay = 0, i = 0;
            $scope.stopBool = 0;
            Synth.setVolume(1);
            for (var key in $scope.randomPlaylist) {
                if($scope.stopBool == 0) {
                    console.log($scope.stopBool);
                    setTimeout(function () {
                        $scope.playNote($scope.randomPlaylist[i]);
                        i++;
                    }, totalDelay);
                    $scope.speed = 500;
                    $scope.speed = $scope.speed/(Math.ceil(Math.random() * 2));
                    console.log($scope.speed);
                    totalDelay += $scope.randomPlaylist[key].duration * $scope.speed;

                }
                else{

                }

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

        $scope.scales = [
            {scale: "Ma", scaleText: "Major"},
            {scale: "Mi", scaleText: "Minor"}
        ];
        $scope.selectedScale = undefined;

        // VexFlow
        $scope.VF = Vex.Flow;
        $scope.notesArray = [
            // new VF.StaveNote({clef: "treble", keys: [$scope.lowerCaseNotes[0]/"4"], duration: "q"}),
            // new $scope.VF.StaveNote({clef: "treble", keys: ["c/4"], duration: "q"}),
            // new $scope.VF.StaveNote({clef: "treble", keys: ["d/4"], duration: "q"}),
            // new $scope.VF.StaveNote({clef: "treble", keys: ["e/4"], duration: "q"}),
            // new $scope.VF.StaveNote({clef: "treble", keys: ["f/4"], duration: "q"}),
            // new $scope.VF.StaveNote({clef: "treble", keys: ["g/4"], duration: "q"}),
            // new $scope.VF.StaveNote({clef: "treble", keys: ["a/4"], duration: "q"}),
            // new $scope.VF.StaveNote({clef: "treble", keys: ["b/4"], duration: "q"}),
            // new $scope.VF.StaveNote({clef: "treble", keys: ["c/5"], duration: "q"})
        ];

        $scope.newBar = function(x){
            $scope.context = $scope.renderer.getContext();
            $scope.context.setFont("Arial", 10, "").setBackgroundFillStyle("#eed"); //font and bg-fill
            // Create a stave of width 400 at position 10, 40 on the canvas.
            $scope.stave = new $scope.VF.Stave(x, 40, 435);
            // Add a clef and time signature.
            // Connect it to the rendering context and draw!
            $scope.stave.setContext($scope.context).draw();
            //for loop notes array. push into notes array.
        };
        $scope.drawNotes = function () {
            $scope.context.clear();
            $scope.context = $scope.renderer.getContext();
            $scope.context.setFont("Arial", 10, "").setBackgroundFillStyle("#eed"); //font and bg-fill
            // Create a stave of width 400 at position 10, 40 on the canvas.
            $scope.stave = new $scope.VF.Stave(10, 40, 435);
            // Add a clef and time signature.
            $scope.stave.addClef("treble").addTimeSignature("4/4");
            // Connect it to the rendering context and draw!
            $scope.stave.setContext($scope.context).draw();
            var pushBar = 445;
            // $scope.newBar(pushBar);
            $scope.notesArray = [];
            var amountOfNotes = 8; //this variable can change
            for (var count = 0; count < (amountOfNotes + 1); count++) {
             if (count == 4) {
                 $scope.VF.Formatter.FormatAndDraw($scope.context, $scope.stave, $scope.notesArray);
                 $scope.notesArray = [];
             }
             else if (count != 4 && count != 0 && count%4 ==0 ){
                 $scope.newBar(pushBar);
                 $scope.VF.Formatter.FormatAndDraw($scope.context, $scope.stave, $scope.notesArray);
             }
             else if (count == amountOfNotes && count !=4){

             }
                if($scope.lowerCaseNotes[count].length > 1){
                    $scope.notesArray.push(new $scope.VF.StaveNote({
                        clef: "treble",
                        keys: [$scope.lowerCaseNotes[count] + "/" + $scope.randomPlaylist[count].octave],
                        duration: "q"
                    }).addAccidental(0, new $scope.VF.Accidental("#")));
                }
                else {
                    $scope.notesArray.push(new $scope.VF.StaveNote({
                        clef: "treble",
                        keys: [$scope.lowerCaseNotes[count] + "/" + $scope.randomPlaylist[count].octave],
                        duration: "q"
                    }));
                }

            }

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
                $scope.stave = new $scope.VF.Stave(10, 40, 435);
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