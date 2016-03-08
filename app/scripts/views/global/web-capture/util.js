/**
 * Created by baihuibo on 16/3/8.
 */

exports.dljrResult = function (table) {
    var trs = table.querySelectorAll('tr');

    var head1 = trs[4],
        head2 = trs[5],
        bodys = [].slice.call(trs, 6);

    var h1_tds = $$('td', head1),
        h2_tds = $$('td', head2);

    var result = [];
    var h1 = getTitle(h1_tds, []);
    var h2 = getTitle(h2_tds, []);

    titleNormal(h1, h2);

    result.push(h1, h2);

    result = result.concat(getRows(bodys));

    return result;
};


function getRows(bodys) {
    var rows = [];

    each(bodys, function (tr) {
        rows.push(getRow($$('td', tr)));
    });

    return rows;
}

function getRow(tds) {
    var arr = [];
    each(tds, function (item) {
        arr.push(getText(item));
    });
    return arr;
}

function titleNormal(h1, h2) {
    h1.forEach(function (item, index) {
        if (!item) {
            h1[index] = h1[index - 1];
        }
    });

    h2.forEach(function (item, index) {
        if (!item) {
            h2[index] = h1[index];
        }
    });
}

function getTitle(tds, arr) {
    each(tds, function (td, i) {
        if (td.colSpan > 1) {
            arr.push(getText(td));
            for (var j = 1; j < td.colSpan; j++) {
                arr.push('');
            }
        } else {
            arr.push(getText(td));
        }
    });
    console.log('h', arr);
    return arr;
}

function getText(el) {
    return el ? el.innerText.trim() || null : '';
}

function each(list, callback) {
    for (var i = 0; i < list.length; i++) {
        var obj = list[i];
        callback(obj, i, list);
    }
}

function $(selector, context) {
    return context.querySelector(selector);
}

function $$(selector, context) {
    return context.querySelectorAll(selector);
}