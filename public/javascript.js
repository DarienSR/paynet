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

// Transfer Capabilities
$('#getFirstCurrency').change(function(){
    if ($('#getFirstCurrency').val() === 'USD') {
        $('#getSecondCurrency').val('CAD')
        showTransfer()
    } else {
        $('#getSecondCurrency').val('USD')
        showTransfer()
    }
});

$('#amountFirstTransfer').change(function(){
    showTransfer()
});

var showTransfer = function(){
    var USDtoCAD = 1.33
    var CADtoUSD = 0.75

    var firstAmount = $('#amountFirstTransfer').val()
    var currency = $('#getFirstCurrency').val()
    if (currency === 'CAD') {
        var amount = firstAmount * CADtoUSD
        $('#amountSecondTransfer').val(amount)
    } else {
        var amount = firstAmount * USDtoCAD
        $('#amountSecondTransfer').val(amount)
    }
}