$(".cone_line").each(function() {
    $(this).prop('numberOfChosenCones', 0);
});

$(".cone").on("click", function(event) {

    var thisLine = $(this).parent();
    numberOfCHosenCones = thisLine.prop('numberOfChosenCones');
    if (!$(this).hasClass('chosen-cone')) {
        $(this).addClass('chosen-cone');
        thisLine.prop('numberOfChosenCones', numberOfCHosenCones + 1);

    } else {
        $(this).removeClass('chosen-cone');
        thisLine.prop('numberOfChosenCones', numberOfCHosenCones - 1);
    }

    //deselect other lines and their cones if they are chosen
    $(".cone_line.chosen-line").each(function() {
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
        if ($(this).prop('numberOfChosenCones') == 0) {
            if ($(this).hasClass('chosen-line')) {
                $(this).removeClass('chosen-line')
                $(".button-commit").css('display', 'none');
            }
        }
    });

    if (thisLine.prop('numberOfChosenCones') > 0) {
        if (!thisLine.hasClass('chosen-line')) {
            thisLine.addClass('chosen-line');
            $(".button-commit").css('display', 'block');
        }
    }

});

$(".button-commit").on("click", function(event) {
    changeLogo();
    $(".cone").each(function() {
        if ($(this).hasClass('chosen-cone')) {
            $(this).addClass('removed-cone');
            thisLine = $(this).parent();
            thisLine.prop('numberOfChosenCones', 0);
            thisLine.removeClass('chosen-line');
            $(".button-commit").css('display', 'none');
        }
    });
    if ($(".removed-cone").length == 24) {
        $('.cones').html("Проиграл! Иди за дровами");
    };
});


changeLogo = function() {
    images = [
        'images/elves_no_cones_reduced_friend.png',
        'images/elves_no_cones_reduced_hell.png',
        'images/elves_no_cones_reduced_rails.png'
    ]
    randomImageIndex = Math.round(Math.random() * 100) % images.length;
    randomImageUrl = images[randomImageIndex];
    $('.logo').attr('src', randomImageUrl);
}

changeLogo()