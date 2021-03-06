// public/js/controllers/MainCtrl.js
angular.module('MainCtrl', ['ngAria', 'ngMaterial'])


    .constant("constants", {
        "intervals": {
            "ma": [2, 2, 1, 2, 2, 2, 1], "natMi": [2, 1, 2, 2, 1, 2, 2], "harmMi": [2, 1, 2, 2, 1, 3, 1],
            "penMa": [2, 2, 3, 2]
        },
        "defaultDuration": 1,
        "bpmConversion": 60000,
        "bpmConversionPlay": 10,
        "minBPM": 36,
        "maxBPM": 256,
        "defaultBPM": 100,
        "noteCount": 8,
        "measures": 2,
        "defaultMeasures": 2,
        "minMeasures": 1,
        "maxMeasures": 10
    })

    .controller('MainController', function ($scope, constants) {
        $scope.tagline = "To the moon and back!"; // lol

        //Text for the drop down menus
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
        $scope.scales = [
            {scale: "ma", scaleText: "Major"},
            {scale: "penMa", scaleText: "Pentatonic Major"},
            {scale: "natMi", scaleText: "Natural Minor"},
            {scale: "harmMi", scaleText: "Harmonic Minor"}
        ];


        //For the html sliders
        $scope.bpm = constants.defaultBPM;
        $scope.minBPM = constants.minBPM;
        $scope.maxBPM = constants.maxBPM;
        $scope.minMeasureCount = constants.minMeasures;
        $scope.maxMeasureCount = constants.maxMeasures;

        //Toggles type of note ex. quarter note, eigth note
        $scope.quarterOn = true;
        $scope.eighthOn = true;
        $scope.sixteenthOn = false;

        //How many measures will be created
        $scope.measureCount = constants.defaultMeasures;
        $scope.delay = 0;
        $scope.velocity = 200;

        //Load in midi.js
        MIDI.loadPlugin({
            soundfontUrl: "assets/soundfont/",
            instrument: "acoustic_grand_piano",
            onsuccess: function() {
                MIDI.setVolume(0, 127);
            }
        });

        //Array with all possible notes on a keyboard
        $scope.keyboard = [];
        for (var octaveNum = 4; octaveNum <= 5; octaveNum++) {
            $scope.keyboard.push(
                {note: "C", octave: octaveNum, duration: constants.defaultDuration},
                {note: "C#", octave: octaveNum, duration: constants.defaultDuration},
                {note: "D", octave: octaveNum, duration: constants.defaultDuration},
                {note: "D#", octave: octaveNum, duration: constants.defaultDuration},
                {note: "E", octave: octaveNum, duration: constants.defaultDuration},
                {note: "F", octave: octaveNum, duration: constants.defaultDuration},
                {note: "F#", octave: octaveNum, duration: constants.defaultDuration},
                {note: "G", octave: octaveNum, duration: constants.defaultDuration},
                {note: "G#", octave: octaveNum, duration: constants.defaultDuration},
                {note: "A", octave: octaveNum, duration: constants.defaultDuration},
                {note: "A#", octave: octaveNum, duration: constants.defaultDuration},
                {note: "B", octave: octaveNum, duration: constants.defaultDuration})
        }

        //Automatic resize function for the Sheet Music (resize depends on amount of measures)
        $scope.canvasResize = function(){
            if($scope.measureCount <= 2){
                $scope.canvasSize = 178;
            }
            else {
                if($scope.measureCount % 2 == 1) {
                    $scope.tempCount = $scope.measureCount + 1;
                }
                else{
                    $scope.tempCount = $scope.measureCount;
                }
                $scope.canvasSize = ($scope.tempCount * 61.75);
            }
            $scope.renderer.resize(900, $scope.canvasSize);
            console.log("Canvas size is" + $scope.canvasSize);
        };

        //Randomizes notes, puts them in a new array
        $scope.randomize = function () {
            $scope.canvasResize();
            if ($scope.currentTimer != undefined) {
                $scope.stop();
            }

            if ($scope.selectedKey == undefined) {
                Materialize.toast('Please select a key', 2000);
            } else if ($scope.selectedScale == undefined) {
                Materialize.toast('Please select a scale', 2000)
            } else {
                $scope.randomPlaylist = [];
                var filteredKeyboard = $scope.filterKeyboard();
                $scope.lowerCaseNotes = [];
                for (var measureNum = 0; measureNum < $scope.measureCount; measureNum++) {
                    var count = 0;
                    var variableNoteLengths = $scope.getNoteLengths();
                    var qOut = $scope.quarterOn;
                    var eighthOut = $scope.eighthOn;
                    while (count < 4) {
                        var randomize = filteredKeyboard[Math.floor(filteredKeyboard.length * Math.random())];
                        if (count > 3 && qOut) {
                            variableNoteLengths.pop();
                            qOut = false;
                        }
                        if (count > 3.5 && eighthOut) {
                            variableNoteLengths.pop();
                            eighthOut = false;
                        }
                        randomize.duration = variableNoteLengths[Math.floor(variableNoteLengths.length * Math.random())];
                        count += randomize.duration;
                        var playNote = {
                            note: $scope.convertToMIDINote(randomize.note),
                            octave: randomize.octave,
                            duration: randomize.duration
                        };
                        $scope.randomPlaylist.push(playNote);
                        var lowercase = {
                            note: randomize.note.toLowerCase(),
                            octave: randomize.octave,
                            duration: randomize.duration
                        };
                        $scope.lowerCaseNotes.push(lowercase);
                    }
                }

                $scope.drawNotes();
            }

        };
        //Have to translate note lengths into numbers for the API's
        $scope.getNoteLengths = function() {
            var noteLengths = [];
            if ($scope.sixteenthOn) {
                noteLengths.push(.25);
            }
            if ($scope.eighthOn) {
                noteLengths.push(.5);
            }
            if ($scope.quarterOn) {
                noteLengths.push(1);
            }
            return noteLengths;
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
            var intervals = constants.intervals[$scope.selectedScale];
            for (i = 0; i < intervals.length; i++) {
                index += intervals[i];
                filteredKeyboard.push($scope.keyboard[index]);
            }
            return filteredKeyboard;
        };

        $scope.playNote = function (i) {
            var midiNote = MIDI.keyToNote[i.note + i.octave];
            MIDI.noteOn(0, midiNote, $scope.velocity, $scope.delay);
            MIDI.noteOff(0, midiNote, $scope.delay + i.duration - 0.15);
        };

        $scope.stop = function () {
            if ($scope.currentTimer != undefined) {
                clearTimeout($scope.currentTimer);
                $scope.currentTimer = undefined;
            }
        };

        $scope.play = function () {
            if ($scope.randomPlaylist != undefined) {
                $scope.stop();
                $scope.recursivePlay(0);
            } else {
                Materialize.toast('Please generate notes by clicking randomize', 2500)
            }
        };

        $scope.recursivePlay = function (index) {
            if (index < $scope.randomPlaylist.length) {
                if (index != 0) {
                    $scope.currentTimer = setTimeout(function () {
                        $scope.playNote($scope.randomPlaylist[index]);
                        $scope.recursivePlay(index + 1);
                    }, $scope.randomPlaylist[index - 1].duration * (constants.bpmConversion / $scope.bpm));
                } else {
                    $scope.playNote($scope.randomPlaylist[index]);
                    $scope.recursivePlay(index + 1);
                }
            } else {
                $scope.currentTimer = undefined;
                console.log("End playing");
            }
        };

        $scope.exportMidi = function () {

        };


        $scope.selectedKey = undefined;
        $scope.selectedScale = undefined;

        // VexFlow
        $scope.VF = Vex.Flow;
        $scope.notesArray = [];

        //Used to determine where to add new measures
        $scope.newBar = function (x,y) {
            $scope.context = $scope.renderer.getContext();
            $scope.context.setFont("Arial", 10, "").setBackgroundFillStyle("#eed"); //font and bg-fill
            // Create a stave of width 435 at position x, y on the canvas.
            $scope.stave = new $scope.VF.Stave(x, y, 435);
            // Add a clef and time signature.
            // Connect it to the rendering context and draw!
            $scope.stave.setContext($scope.context).draw();
            //for loop notes array. push into notes array.
        };

        //Translating note lengths so that VexFlow can read them
        $scope.convertToText = function (length) {
            switch (length) {
                case 1:
                    return "q";
                case .5:
                    return "8";
                case .25:
                    return "16";
            }
            return "q";
        };

        $scope.convertToMIDINote = function(originalNote) {
            switch (originalNote) {
                case "A#": return "Bb";
                case "C#": return "Db";
                case "D#": return "Eb";
                case "F#": return "Gb";
                case "G#": return "Ab";
                default: return originalNote;
            }
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
            $scope.pushBar = 0;
            $scope.newLine = 0;
            $scope.nextLine = 40;
            // $scope.newBar(pushBar);
            $scope.notesArray = [];
            $scope.firstCase = 0;

            var count = 0;
            for (var lowerCaseNote in $scope.lowerCaseNotes) {
                var lcn = $scope.lowerCaseNotes[lowerCaseNote];
                if (lcn.note.length > 1) {
                    $scope.notesArray.push(new $scope.VF.StaveNote({
                        clef: "treble",
                        keys: [lcn.note + "/" + lcn.octave],
                        duration: $scope.convertToText(lcn.duration)
                    }).addAccidental(0, new $scope.VF.Accidental("#")));
                } else {
                    $scope.notesArray.push(new $scope.VF.StaveNote({
                        clef: "treble",
                        keys: [lcn.note + "/" + lcn.octave],
                        duration: $scope.convertToText(lcn.duration)
                    }));
                }
                count += lcn.duration;
              //  console.log(count);

                if (count >= 4) {
                    var beams = $scope.VF.Beam.generateBeams($scope.notesArray);
                    $scope.VF.Formatter.FormatAndDraw($scope.context, $scope.stave, $scope.notesArray);
                    beams.forEach(function(beam) {
                        beam.setContext($scope.context).draw();
                    });
                    $scope.newLine +=1;
                    $scope.notesArray = [];
                    count = 0;

                    //For the first bar only
                    if ($scope.firstCase ==0){
                        $scope.pushBar = 445;
                        $scope.firstCase = 1;
                    }
                    else{
                        $scope.pushBar += 435;
                    }

                    if ($scope.newLine ==2){
                        $scope.newLine =0;
                        $scope.nextLine += 105;
                        $scope.pushBar = 10;
                    }
                    $scope.newBar($scope.pushBar, $scope.nextLine);
                 //   console.log($scope.canvasSize);

                }
            }

        };
    }).directive('afterRender', function ($timeout) {
    return {
        link: function ($scope, element, attr) {
            $timeout(function () {
                Materialize.toast('Select a key and scale, then press randomize', 3500);

                //Vexflow (clef visualization)

                var div = document.getElementById("clef");
                $scope.renderer = new $scope.VF.Renderer(div, $scope.VF.Renderer.Backends.SVG);
                $scope.renderer.resize(900, 178); //size
                $scope.context = $scope.renderer.getContext();
                $scope.context.setFont("Arial", 10, "").setBackgroundFillStyle("#eed"); //font and bg-fill
                // Create a stave of width 435 at position 10, 40 on the canvas.
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