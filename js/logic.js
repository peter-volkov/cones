$(document).ready(function() {

    $(".cone-line").each(function() {
        $(this).prop('numberOfChosenCones', 0);
    });

    function getRandomElements(arr, n) {
        var result = new Array(n),
            len = arr.length,
            taken = new Array(len);
        if (n > len)
            throw new RangeError("getRandom: more elements taken than available");
        while (n--) {
            var x = Math.floor(Math.random() * len);
            result[n] = arr[x in taken ? taken[x] : x];
            taken[x] = --len;
        }
        return result;
    }

    var isGameAgainstComputer = false;
    var isLastTurnMadeByFirstPlayer = false;
    var isGameFinished = false;

    getRandomLine = function(lines) {
        randomLineIndex = Math.floor(Math.random() * lines.length);
        randomLine = lines.eq(randomLineIndex);
        return randomLine;
    }

    getRandomConesFromLine = function(cones, numberOfConesToChoose) {
        return getRandomElements(cones, numberOfConesToChoose);
    }
     
    getConesToChoose = function(remainingLines) {
        numberOfRemainingLines = remainingLines.length;

        if (numberOfRemainingLines == 1) {
            numberOfConesToChooseInLine = Math.max(1, numberOfRemainingConesInLine - 1);

        } else if (numberOfRemainingLines == 2) {
            remainingConesInFirstLine = remainingLines.eq(0).find('.cone').not('.removed-cone').not('.chosen-cone');
            remainingConesInSecondLine = remainingLines.eq(1).find('.cone').not('.removed-cone').not('.chosen-cone');

            // take all cones from line with 1+ cones
            if (remainingConesInFirstLine.length == 1) {
                return remainingConesInSecondLine;
            } else if (remainingConesInSecondLine.length == 1) {
                return remainingConesInFirstLine;

                // leave same number of cones in both lines
            } else if (remainingConesInFirstLine.length > remainingConesInSecondLine.length) {
                numberOfConesToChooseInLine = Math.max(1, remainingConesInFirstLine.length - remainingConesInSecondLine.length);
                return getRandomConesFromLine(remainingConesInFirstLine, numberOfConesToChooseInLine)
            } else if (remainingConesInFirstLine.length < remainingConesInSecondLine.length) {
                numberOfConesToChooseInLine = Math.max(1, remainingConesInSecondLine.length - remainingConesInFirstLine.length);
                return getRandomConesFromLine(remainingConesInSecondLine, numberOfConesToChooseInLine)
            }

        } else if (numberOfRemainingLines == 3) {
            remainingConesInFirstLine = remainingLines.eq(0).find('.cone').not('.removed-cone').not('.chosen-cone');
            remainingConesInSecondLine = remainingLines.eq(1).find('.cone').not('.removed-cone').not('.chosen-cone');
            remainingConesInThirdLine = remainingLines.eq(2).find('.cone').not('.removed-cone').not('.chosen-cone');
            //bad situations are 1,1,1, 1,2,3 and 1,4,5

            // x,x,x remove whole random line if they are all of same size
            if (remainingConesInFirstLine.length == remainingConesInSecondLine.length == remainingConesInThirdLine.length) {
                randomRemainingLineCones = getRandomLine(remainingLines).find('.cone').not('.removed-cone').not('.chosen-cone');
                return randomRemainingLineCones;
            }
            // 1,1,x make all three lines have 1 cone if possible
            else if (remainingConesInThirdLine.length == 1 && remainingConesInSecondLine.length == 1 && remainingConesInFirstLine.length > 1) {
                numberOfConesToChooseInLine = remainingConesInFirstLine.length - 1;
                return getRandomConesFromLine(remainingConesInFirstLine, numberOfConesToChooseInLine)
            } else if (remainingConesInFirstLine.length == 1 && remainingConesInThirdLine.length == 1 && remainingConesInSecondLine.length > 1) {
                numberOfConesToChooseInLine = remainingConesInSecondLine.length - 1;
                return getRandomConesFromLine(remainingConesInSecondLine, numberOfConesToChooseInLine)
            } else if (remainingConesInFirstLine.length == 1 && remainingConesInSecondLine.length == 1 && remainingConesInThirdLine.length > 1) {
                numberOfConesToChooseInLine = remainingConesInThirdLine.length - 1;
                return getRandomConesFromLine(remainingConesInThirdLine, numberOfConesToChooseInLine)
            }
            // x,x,y make all two lines with same amount of cones if possible
            else if (remainingConesInThirdLine.length == remainingConesInSecondLine.length) {
                return remainingConesInFirstLine;
            } else if (remainingConesInThirdLine.length == remainingConesInFirstLine.length) {
                return remainingConesInSecondLine;
            } else if (remainingConesInFirstLine.length == remainingConesInSecondLine.length) {
                return remainingConesInThirdLine;
            } else if (remainingConesInFirstLine.length != remainingConesInSecondLine.length &&
                remainingConesInFirstLine.length != remainingConesInThirdLine.length &&
                remainingConesInThirdLine.length != remainingConesInSecondLine.length) {
                // x,y,z try to keep x,y,z, because both x,y and x,y,y should not be given to the other player
                // bas situations here are 1,2,3 and 1,4,5, any other is good
                sortedLengths = [remainingConesInFirstLine.length, remainingConesInSecondLine.length, remainingConesInThirdLine.length].sort();
                lengthsAndLines = {};
                lengthsAndLines[remainingConesInFirstLine.length] = remainingConesInFirstLine;
                lengthsAndLines[remainingConesInSecondLine.length] = remainingConesInSecondLine;
                lengthsAndLines[remainingConesInThirdLine.length] = remainingConesInThirdLine;

                minLengthLine = lengthsAndLines[sortedLengths[0]];
                secondLengthLine = lengthsAndLines[sortedLengths[1]];
                maxLengthLine = lengthsAndLines[sortedLengths[2]];
                if (minLengthLine.length == 1 && secondLengthLine.length == 2 && maxLengthLine.length != 3) {
                    // make 1,2,3: 4->3, 5->3                          
                    numberOfConesToChooseInLine = maxLengthLine.length - 3;
                    return getRandomConesFromLine(maxLengthLine, numberOfConesToChooseInLine)    
                } else if (minLengthLine.length == 1 && secondLengthLine.length == 3) {
                    // make 1,2,3: 4->2, 5->2
                    numberOfConesToChooseInLine = maxLengthLine.length - 2;
                    return getRandomConesFromLine(maxLengthLine, numberOfConesToChooseInLine)
                } else if (minLengthLine.length == 2 && secondLengthLine.length == 3) {
                    // make 1,2,3: 4->1, 5->1 
                    numberOfConesToChooseInLine = maxLengthLine.length - 1;
                    return getRandomConesFromLine(maxLengthLine, numberOfConesToChooseInLine)
                } else if ((minLengthLine.length == 2 || minLengthLine.length == 3) && secondLengthLine.length == 4) {
                    // make 1,4,5: 3->1, 2->1
                    numberOfConesToChooseInLine = minLengthLine.length - 1;
                    return getRandomConesFromLine(minLengthLine, numberOfConesToChooseInLine)
                }

            }
        }

    }

    doComputerPlayerTurn = function() {
        remainingLines = $('.cone-line').not('.removed-line');
        var conesToChoose = getConesToChoose(remainingLines);

        // if no predefined choice do random turn
        if (conesToChoose == null || !conesToChoose) {
            randomRemainingLine = getRandomLine(remainingLines);
            remainingConesInLine = randomRemainingLine.find('.cone').not('.removed-cone').not('.chosen-cone');
            numberOfConesToChooseInLine = Math.ceil(Math.random() * remainingConesInLine.length);
            randomCones = getRandomConesFromLine(remainingConesInLine, numberOfConesToChooseInLine);
            conesToChoose = randomCones;
        }

        for (i = 0; i < conesToChoose.length; i += 1) {
            coneClick($(conesToChoose[i]));
        }

        timeout = 3000;
        setTimeout(function() {
            commit();
            isLastTurnMadeByFirstPlayer = false;
        }, timeout);
    }

    getRemovedAndChosenConesSum = function() {
        return $(".removed-cone").length + $('.chosen-cone').length;
    }

    coneClick = function(cone) {

        var thisLine = cone.parent();
        numberOfCHosenCones = thisLine.prop('numberOfChosenCones');

        if (!cone.hasClass('chosen-cone')) {
            //check to avoid removing last cone
            if (getRemovedAndChosenConesSum() != 24) {
                cone.addClass('chosen-cone');
                thisLine.prop('numberOfChosenCones', numberOfCHosenCones + 1);
            }
        } else {
            cone.removeClass('chosen-cone');
            thisLine.prop('numberOfChosenCones', numberOfCHosenCones - 1);
        }


        //deselect other lines and their cones if they are chosen
        $(".cone-line.chosen-line").each(function() {
            if (thisLine[0] != $(this)[0]) {
                $(this).removeClass('chosen-line');
                $(this).find('.cone').each(function() {
                    if ($(this).hasClass('chosen-cone')) {
                        $(this).removeClass('chosen-cone');
                        $(this).parent().prop('numberOfChosenCones',
                            Math.max(0, numberOfCHosenCones - 1));
                    }
                });
            }
            if (cone.prop('numberOfChosenCones') == 0) {
                if (cone.hasClass('chosen-line')) {
                    cone.removeClass('chosen-line')
                    $(".button-commit").css('visibility', 'hidden');
                }
            }
        });

        if (thisLine.prop('numberOfChosenCones') > 0) {
            if (!thisLine.hasClass('chosen-line')) {
                thisLine.addClass('chosen-line');
                if (!isGameAgainstComputer || (isGameAgainstComputer && !isLastTurnMadeByFirstPlayer)) {
                    $(".button-commit").css('visibility', 'visible');
                }
            }
        }
    }

    $(".cone").on("click", function(event) {
        if (!isGameAgainstComputer || (isGameAgainstComputer && !isLastTurnMadeByFirstPlayer)) {
            cone = $(this);
            coneClick(cone);
        }
    });

    commit = function() {
        changeLogo();
        $(".cone").each(function() {
            if ($(this).hasClass('chosen-cone')) {
                $(this).addClass('removed-cone');
                $(this).removeClass('chosen-cone');
                thisLine = $(this).parent();
                thisLine.prop('numberOfChosenCones', 0);
                numberOfRemovedCones = thisLine.find('.removed-cone').length;
                thisLine.prop('numberOfRemovedCones', numberOfRemovedCones);
                if (numberOfRemovedCones == 5) {
                    thisLine.addClass('removed-line');
                }
                thisLine.removeClass('chosen-line');
                $(".button-commit").css('visibility', 'hidden');
            }
        });
        if ($(".removed-cone").length == 24) {
            finishGame();
        };
    }


    getFinishGameImageUrl = function() {
        if (!isLastTurnMadeByFirstPlayer) {
            if (isGameAgainstComputer) {
                return "images/cone_juggler.png";
            } else {
                return "images/cone_juggler.png";
            }
        } else {
            if (isGameAgainstComputer) {
                return "images/forest_walk.png";
            } else {
                return "images/cone_juggler.png";
            }
        }
    }

    getFinishGameMessage = function() {
        if (!isLastTurnMadeByFirstPlayer) {
            if (isGameAgainstComputer) {
                return "Победа! Проигравший идёт за дровами.";
            } else {
                return "Победа первого игрока! Проигравший идёт за дровами.";
            }
        } else {
            if (isGameAgainstComputer) {
                return "Поражение! Проигравший идёт за дровами.";
            } else {
                return "Победа второго игрока! Проигравший идёт за дровами.";
            }
        }
    }

    finishGame = function() {
        if (!isGameFinished) {
            isGameFinished = true;

            $('.game-result-image').prop('src', getFinishGameImageUrl());
            $('.game-result-message').html(getFinishGameMessage());
            $('.game-container').hide();
            $('.game-result-container').show();
        }
    }

    $(".button-commit").on("click", function(event) {
        commit();
        isLastTurnMadeByFirstPlayer = !isLastTurnMadeByFirstPlayer;
        if (!isGameAgainstComputer) {
            if (isLastTurnMadeByFirstPlayer) {
                $(".button-commit").html('Второй игрок: cделать ход');
            } else {
                $(".button-commit").html('Первый игрок: cделать ход');
            }
        }

        if (isGameAgainstComputer) {
            timeout = 1000;
            setTimeout(function() {
                doComputerPlayerTurn();
            }, timeout);
        }
    });

    changeLogo = function() {
        images = [
            'images/phrases/friend.png',
            'images/phrases/hell.png',
            'images/phrases/angry_elves.png',
            'images/phrases/finger.png',
            'images/phrases/count.png',
            'images/phrases/ultimatum_zen.png',
            'images/phrases/three_legs_elf.png',
            'images/phrases/bottom.png',
            'images/phrases/poleno.png',
            'images/phrases/elberetovka.png',
            'images/phrases/rails.png'
        ]
        randomImageIndex = Math.round(Math.random() * 100) % images.length;
        randomImageUrl = images[randomImageIndex];
        $('.logo').attr('src', randomImageUrl);
    }

    changeLogo();

    $(".button-replay").on("click", function(event) {
        
        $(".cone-line").each(function() {
            $(this).prop('numberOfChosenCones', 0);
        });

        $(".cone-line.removed-line").each(function() {
            $(this).removeClass('removed-line');
        });

        $(".cone.chosen-cone").each(function() {
            $(this).removeClass('chosen-cone');
        });

        $(".cone.removed-cone").each(function() {
            $(this).removeClass('removed-cone');
        });

        isGameFinished = false;
        isLastTurnMadeByFirstPlayer = false

        $('.game-result-container').hide();
        $('.game-container').show();

        if (isGameAgainstComputer) {
            chooseFirstPlayer();
        }
    });
    
    chooseFirstPlayer = function() {
        coinFlip = Math.floor(Math.random() * 2);
        if (coinFlip) {
            isLastTurnMadeByFirstPlayer = true;
            doComputerPlayerTurn();
        }       
    }

    $(".button-game-against-computer").on("click", function(event) {
        isGameAgainstComputer = true;
        $(".button-commit").html('Cделать ход');
        $('.start-container').hide();
        $('.game-container').show();
        chooseFirstPlayer();
    });

    $(".button-game-against-human").on("click", function(event) {
        isGameAgainstComputer = false;
        $('.start-container').hide();
        $('.game-container').show();
    });


});
