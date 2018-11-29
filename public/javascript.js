$(function () {
    $(document).scroll(function(){
    var $nav = $('#mainNav');
    $nav.toggleClass('scrolled', $(this).scrollTop() > $nav.height());
    });
});

$('.showInfo').click(function(){
    $(this).toggleClass('fa-plus')
    $(this).toggleClass('fa-minus')
});

$('.btnClip').mouseover(function(){
    $(this).addClass('changeCopyColor')
});
$('.btnClip').mouseleave(function(){
    $(this).removeClass('changeCopyColor')
});