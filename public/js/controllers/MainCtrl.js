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
        "defaultBPM": 80,
        "noteCount": 8,
        "measures": 2
    })

    .controller('MainController', function ($scope, constants) {
        $scope.tagline = "To the moon and back!"; // lol
        $scope.bpm = constants.defaultBPM;
        $scope.minBPM = constants.minBPM;
        $scope.maxBPM = constants.maxBPM;
        $scope.quarterOn = true;
        $scope.eighthOn = true;
        $scope.sixteenthOn = true;

        $scope.piano = Synth.createInstrument('piano');
        $scope.keyboard = [];
        for (var octaveNum = 4; octaveNum <= 5; octaveNum++) {
            $scope.keyboard.push({note: "C", octave: octaveNum, duration: constants.defaultDuration},
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

        $scope.randomize = function () {
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

                /*
                for (var count = 0; count < constants.noteCount; count++) {
                    var randomize = filteredKeyboard[Math.floor(filteredKeyboard.length * Math.random())];
                    randomize.duration = constants.noteLengths[Math.floor(constants.noteLengths.length * Math.random())];
                    var noteLengths = $scope.getNoteLengths();
                    randomize.duration = noteLengths[Math.floor(noteLengths.length * Math.random())];
                    $scope.randomPlaylist.push(randomize);
                    var temp = $scope.randomPlaylist[count].note.toLowerCase();
                    $scope.lowerCaseNotes.push(temp);
                }
                */

                for (var measureNum = 0; measureNum < constants.measures; measureNum++) {
                    var count = 0;
                    var variableNoteLengths = $scope.getNoteLengths();
                    var qOut = constants.quarterOn;
                    var eighthOut = constants.eighthOn;
                    while (count < 4) {
                        var randomize = filteredKeyboard[Math.floor(filteredKeyboard.length * Math.random())];
                        if (count > 3 && !qOut) {
                            variableNoteLengths.pop();
                            qOut = true;
                        }
                        if (count > 3.5 && !eighthOut) {
                            variableNoteLengths.pop();
                            eighthOut = true;
                        }
                        randomize.duration = variableNoteLengths[Math.floor(variableNoteLengths.length * Math.random())];
                        count += randomize.duration;
                        $scope.randomPlaylist.push(randomize);
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
            $scope.piano.play(i.note, i.octave, i.duration * constants.bpm * constants.bpmConversion);
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
            {scale: "ma", scaleText: "Major"},
            {scale: "penMa", scaleText: "Pentatonic Major"},
            {scale: "natMi", scaleText: "Natural Minor"},
            {scale: "harmMi", scaleText: "Harmonic Minor"}
        ];
        $scope.selectedScale = undefined;

        // VexFlow
        $scope.VF = Vex.Flow;
        $scope.notesArray = [];

        $scope.newBar = function (x) {
            $scope.context = $scope.renderer.getContext();
            $scope.context.setFont("Arial", 10, "").setBackgroundFillStyle("#eed"); //font and bg-fill
            // Create a stave of width 400 at position 10, 40 on the canvas.
            $scope.stave = new $scope.VF.Stave(x, 40, 435);
            // Add a clef and time signature.
            // Connect it to the rendering context and draw!
            $scope.stave.setContext($scope.context).draw();
            //for loop notes array. push into notes array.
        };

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
                if (count >= 4) {
                    $scope.VF.Formatter.FormatAndDraw($scope.context, $scope.stave, $scope.notesArray);
                    $scope.notesArray = [];
                    count = 0;
                }
            }

            /*
            for (var count = 0; count < (constants.noteCount + 1); count++) {
                if (count == 4) {
                    $scope.VF.Formatter.FormatAndDraw($scope.context, $scope.stave, $scope.notesArray);
                    $scope.notesArray = [];
                }
                else if (count != 4 && count != 0 && count % 4 == 0) {
                    $scope.newBar(pushBar);
                    $scope.VF.Formatter.FormatAndDraw($scope.context, $scope.stave, $scope.notesArray);
                }
                else if (count == constants.noteCount && count != 4) {

                }
                if ($scope.lowerCaseNotes[count].length > 1) {
                    $scope.notesArray.push(new $scope.VF.StaveNote({
                        clef: "treble",
                        keys: [$scope.lowerCaseNotes[count] + "/" + $scope.randomPlaylist[count].octave],
                        duration: $scope.textDuration[count]
                    }).addAccidental(0, new $scope.VF.Accidental("#")));
                }
                else {
                    $scope.notesArray.push(new $scope.VF.StaveNote({
                        clef: "treble",
                        keys: [$scope.lowerCaseNotes[count] + "/" + $scope.randomPlaylist[count].octave],
                        duration: $scope.textDuration[count]
                    }));
                }
            }
            */


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