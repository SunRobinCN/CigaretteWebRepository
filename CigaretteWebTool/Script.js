






function CheckForEachTr(index, theTr) {
    //合理定量那一列
    var theTd = theTr.children().first().next().next().next().next();
    if (theTd.children().first().val() === "" &&
        (theTd.next().next().children().first().val() === "" ||
            theTd.next().next().children().first().val() === "0")) {
        //符合开抢条件并进行开抢
    } 
}

function ExcecuteForAppointedTr(index, theTr) {
    var theTd = theTr.children().first().next().next().next().next();
    var amount = MyRandom();
    theTd.next().children().first().val(amount);
    qtyDemandChange(theTd.next().children().first()[0], index);
    if (!($('.d-outer').parent().css("visibility") === 'visible' && $('.d-content').html().indexOf('为0条') > 0)) {
        //说明成功
        saveRecord();
    } else {
       //失败了，关闭弹出窗口
        let confirm = function () { return false; }
        $('.d-outer').parent().css("visibility", "hidden");
    }
}

function MyRandom() {
    var x = 100;
    var y = 50;
    var rand = parseInt(Math.random() * (x - y + 1) + y);
    return rand;
}


$("input[value='兰州(硬精品)']").first().parent().next().next().next().next().next().children().first().parent().html();
$("input[value='兰州(硬精品)']").first().parent().next().next().next().next().next().children().first().val(5);
qtyDemandChange($("input[value='兰州(硬精品)']").first().parent().next().next().next().next().next().children().first()[0], 155)


$("input[value='兰州(硬珍品)']").first().parent().next().next().next().next().next().children().first().parent().html();
$("input[value='兰州(硬珍品)']").first().parent().next().next().next().next().next().children().first().val(5);
qtyDemandChange($("input[value='兰州(硬珍品)']").first().parent().next().next().next().next().next().children().first()[0], 155)


if (!($('.d-outer').parent().css("visibility") === 'visible' && $('.d-content').html().indexOf('为0条') > 0)) {
    //说明没有成功
}


$("#dataTable tbody tr").each(function (index, theTr) {
    CheckForEachTr(index, theTr);
});