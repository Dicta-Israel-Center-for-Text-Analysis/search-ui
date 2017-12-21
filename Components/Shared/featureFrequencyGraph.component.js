jTextMinerApp.component('featureFrequencyGraph', {
        templateUrl: 'Components/Shared/featureFrequencyGraph.component.html',
        bindings: {
            featureId: '@',
            classaverages: '=?',
            currentvalue: '@?',
            classaverage: '@?',
            otheraverage: '@?',
            ttest: '@',
            classcolors: '=?',
            classcolor: '@?'
        },
        controller: ['$scope', 'ExperimentService', 'APIService', 'ClassService', function ($scope, ExperimentService, APIService, ClassService) {
            // setup

            var ctrl = this;

            // there are two ways to call the graph, so make sure that either way,
            // classcolors and classaverages hold the points we want to graph
            if (!Array.isArray(ctrl.classcolors)) {
                ctrl.classcolors = [];
            }
            if (!Array.isArray(ctrl.classaverages)) {
                ctrl.classaverages = [];
            }
            else {
                // received all the classes, so use the default colors
                for (var i = 0; i < ctrl.classaverages.length; i++) {
                    ctrl.classcolors.push(ClassService.classIndexToColor(i));
                }
            }

            // classaverage is the average for class that this feature belongs to
            var classAverage;
            // otherAverage is the average for all other classes
            var otherAverage;

            // utility function to sort numerically - see MDN
            var sortCompare = function(a, b) {
                return a - b;
            };

            // called with classAverage and otherAverage
            if (ctrl.classaverage !== undefined) {
                ctrl.classaverages.push(ctrl.classaverage);
                ctrl.classcolors.push(ctrl.classcolor);
                // force conversion to numbers
                classAverage = +ctrl.classaverage;
                otherAverage = +ctrl.otheraverage;
            }
            else {
                // called with a list of averages
                var copyOfAverages = ctrl.classaverages.slice();
                copyOfAverages.sort(sortCompare);
                // the highest value is the class this feature belongs to
                classAverage = +(copyOfAverages.pop());
                var sum = copyOfAverages.reduce(function(previousValue, currentValue, currentIndex, array) {
                    return previousValue + (+currentValue);
                });
                otherAverage = sum / copyOfAverages.length;
            }
            // one std dev = 5% on this graph
            // a ttest of 2 means the means are 2 std dev apart, hence 10% apart
            var midpoint = (classAverage + otherAverage) / 2;
            // variables to hold the origin and the scale for the graph
            var stdDev = (classAverage - otherAverage) / ctrl.ttest;
            // if stdDev is not valid, graph things in the middle of the bar anyway
            if (isNaN(stdDev) || stdDev == 0) { stdDev = 1;}
            var left = midpoint - 10*stdDev;
            // text sometimes overlaps, so we'll move labels that will overlap slightly
            var averageAndIndex = ctrl.classaverages.map(
                function(value, index) {
                    // create objects with the data we'll need
                    return { index: index, value: value, position: convertFreqToPercent(value)}
                }).sort(function(a, b) {
                    // sort them by value
                    return a.value - b.value;
                });
            // move everything overlapping slightly, 10 times. There has GOT to be a better way.
            for (var i = 0; i < 10; i++) {
                for (var j = 0; j < averageAndIndex.length - 1; j++) {
                    var leftPos = averageAndIndex[j].position;
                    var rightPos = averageAndIndex[j+1].position;
                    var distance = rightPos - leftPos;
                    if (distance < 8) {
                        if (rightPos < 2) {
                            averageAndIndex[j + 1].position += 2;
                        }
                        else if (leftPos > 96) {
                            averageAndIndex[j].position -= 2;
                        }
                        else {
                            averageAndIndex[j + 1].position += 1;
                            averageAndIndex[j].position -= 1;
                        }
                    }
                }
            }
            var indexToPosition = {};
            for (var i = 0; i < averageAndIndex.length; i++) {
                indexToPosition[averageAndIndex[i].index] = averageAndIndex[i].position;
            }


            function clamp(percent) {
                return (percent > 100) ? 100 : ((percent < 0) ? 0 : percent);
            }

            function convertFreqToPercent(frequency){
                var percent = (frequency - left)/stdDev*5;
                return clamp(percent);
            }
            ctrl.otherDot =       {
                left: "calc(" + convertFreqToPercent(ctrl.otheraverage) + "% - 10px"
            };
            ctrl.otherDotLabel =  {
                left: "calc(" + convertFreqToPercent(ctrl.otheraverage) + "% - 20px"
            };
            ctrl.classDot = function (index) {
                return {
                    left: "calc(" + convertFreqToPercent(ctrl.classaverages[index]) + "% - 10px",
                    "background-color": ctrl.classcolors[index]
                }
            };
            ctrl.classDotLabel = function(index) {
                return {
                    left: "calc(" + indexToPosition[index] + "% - 20px",
                    color: ctrl.classcolors[index]
                };
            };
            ctrl.currentMark =    {left: "calc(" + convertFreqToPercent(ctrl.currentvalue) + "% - 5px"};
            ctrl.currentMarkLabel ={left: "calc(" + convertFreqToPercent(ctrl.currentvalue) + "% - 20px"};
        }]
});