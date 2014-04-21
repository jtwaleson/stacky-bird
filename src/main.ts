/// <reference path="def/jquery/jquery.d.ts"/>
/// <reference path="def/bootstrap/bootstrap.d.ts"/>
/// <reference path="flappy.ts"/>
/// <reference path="level.ts"/>
/// <reference path="actions.ts"/>
/// <reference path="levels.ts"/>
/// <reference path="factory.ts"/>

function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

$(function () {
    if ($('.factory1').length > 0) {
        var levelCode = getParameterByName('level');
        var level = Levels.byId[levelCode]; 
        if (level && level.unlocked) {
            new Level(level);
        } else {
            alert('invalid or not-yet unlocked level selected');
        }
    } else if ($('.level-list').length > 0) {
        Levels.list.forEach((level: LevelSerialized) => {
            $("<tr>").addClass(level.unlocked ? '': ' danger')
                .append($("<td>").text(level.code))
                .append($("<td>").text(level.name))
                .append($("<td>").text(level.points.bronze))
                .append($("<td>").text(level.points.silver))
                .append($("<td>").text(level.points.gold))
                .append($("<td>").text(localStorage.getItem('stackybird.levels.' + level.code + '.score') || '-'))
                .append($("<td>")
                        .append($("<a>")
                                .addClass('btn btn-primary' + (level.unlocked ? '' : ' disabled'))
                                .attr('href', 'level.html?level=' + level.code)
                                .text('Play')
                                )
                ).appendTo('.level-list');
        });
    }
    if ($('.blockpicker .actions').length > 0) {
        allActions.forEach((action) => {
            $('.blockpicker .actions').append(
                $('<button type="button" class="btn btn-default btn-lg btn-block" data-action="' + action.identifier + '">').text(action.identifier)
            );
        });
    }
});
