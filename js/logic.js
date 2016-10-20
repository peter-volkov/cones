$( document ).ready(function() {

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

doRandomTurn = function() {
    remainingLines = $('.cone-line').not('.removed-line');    
    numberOfRemainingLines = remainingLines.length;
    randomRemainingLineIndex = Math.floor(Math.random() * numberOfRemainingLines); 
    randomRemainingLine = remainingLines.eq(randomRemainingLineIndex);
    
    numberOfRemovedLines = 5 - numberOfRemainingLines;
    numberOfRemovedConesTotal = $(".removed-cone").length;
    numberOfRemaingConesTotal = 25 - numberOfRemovedConesTotal;

    remainingConesInLine = randomRemainingLine.find('.cone').not('.removed-cone').not('.chosen-cone');
    numberOfRemainingConesInLine = remainingConesInLine.length;
    numberOfRemovedConesInLine = 5 - numberOfRemainingConesInLine

    var conesToGet = null;
    var numberOfConesToChooseInLine = Math.ceil(Math.random() * numberOfRemainingConesInLine);
    if (numberOfRemainingLines == 1) {
        numberOfConesToChooseInLine = Math.max(1, numberOfRemainingConesInLine - 1); 
    } else if (numberOfRemainingLines == 2) {
         remainingConesInFirstLine = remainingLines.eq(0).find('.cone').not('.removed-cone').not('.chosen-cone');
         remainingConesInSecondLine = remainingLines.eq(1).find('.cone').not('.removed-cone').not('.chosen-cone');

         if (remainingConesInFirstLine.length == 1) {
             conesToGet = remainingConesInSecondLine;    
         } else if (remainingConesInSecondLine.length == 1) {
             conesToGet = remainingConesInFirstLine;    
         } else if (remainingConesInFirstLine.length == 2) {
             numberOfConesToChooseInLine = Math.max(1, remainingConesInSecondLine.length - 2);
             remainingConesInLine = remainingConesInSecondLine;    
         } else if (remainingConesInSecondLine.length == 2) {
             numberOfConesToChooseInLine = Math.max(1, remainingConesInFirstLine.length - 2)
             remainingConesInLine = remainingConesInFirstLine;
         } 
    }
    var randomCones = getRandomElements(remainingConesInLine, numberOfConesToChooseInLine);
    if (conesToGet == null) {
        conesToGet = randomCones;
    }
    for (i = 0; i < conesToGet.length; i += 1) { 
        coneClick($(conesToGet[i]));
    }

    timeout = 1000;
    setTimeout(function() {commit(); isLastTurnMadeByFirstPlayer = false;}, timeout);      
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
        setTimeout(function() {doRandomTurn();}, timeout);          
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
    //$('.game-result-container').hide();
    //$('.game-container').show();
    //FIXME
    location.reload();
});

$(".button-game-against-computer").on("click", function(event) {
    isGameAgainstComputer = true;
    $(".button-commit").html('Cделать ход');   
    $('.start-container').hide();
    $('.game-container').show();
});

$(".button-game-against-human").on("click", function(event) {
    isGameAgainstComputer = false;
    $('.start-container').hide();
    $('.game-container').show();
});

   
});