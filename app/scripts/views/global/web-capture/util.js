/**
 * Created by baihuibo on 16/3/8.
 */

exports.dljrResult = function (table, type) {
    var trs = table.querySelectorAll('tr');
    var result = [], slice = [].slice;

    var hds, bodys;
    if (type) {
        hds = slice.call(trs, 4, 9);
        bodys = slice.call(trs, 9);
    } else {
        hds = slice.call(trs, 4, 6);
        bodys = slice.call(trs, 6);
    }

    hds = map(hds, function (hr) {
        return getTitle($$('td', hr), [])
    });

    return result.concat(normals(hds), getRows(bodys));
};

function normals(hds) {
    hds.forEach(function (row, idx) {
        row.forEach(function (col, i) {
            if (!col) {
                row[i] = getValue(i, idx + 1, hds);
            } else if (!row[i + 1]) {
                row[i + 1] = col;
            }
        });
    });

    return hds;
}

function getValue(i, idx, rows) {
    for (var j = idx; j < rows.length; j++) {
        if (rows[j][i]) {
            return rows[j][i];
        }
    }

    for (j = rows.length; j > 0; j--) {
        if (rows[j][i]) {
            return rows[j][i];
        }
    }
}

function getRows(bodys) {
    var rows = [];

    each(bodys, function (tr) {
        rows.push(getRow($$('td', tr)));
    });

    return rows;
}

function getRow(tds) {
    return map(tds, getText);
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
    return arr;
}

function getText(el) {
    return el ? el.innerText.trim() || null : '';
}

function each(list, callback) {
    for (var i = 0; i < list.length; i++) {
        callback(list[i], i, list);
    }
}

function map(list, callback) {
    var result = [];

    each(list, function (item, i) {
        result[i] = callback(item, i, list);
    });

    return result;
}

function $(selector, context) {
    return context.querySelector(selector);
}

function $$(selector, context) {
    return context.querySelectorAll(selector);
}