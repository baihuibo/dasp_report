/**
 * Created by baihuibo on 16/3/8.
 */
var ipcRenderer = require('electron').ipcRenderer;
exports.dljrResult = function (trs, date, type) {
    var slice = [].slice;

    var hds, bodys;
    if (type) {
        hds = slice.call(trs, 4, 9);
        bodys = slice.call(trs, 9);
    } else {
        hds = slice.call(trs, 4, 6);
        bodys = slice.call(trs, 6);
    }

    hds = map(hds, function (hr) {
        return getTitle(hr.childNodes, ['date'])
    });

    return [].concat(normals(hds), getRows(bodys, date || ''));
};

function normals(hds) {

    each(hds, function (row, idx) {
        each(row, function (col, i) {
            if (!col) {
                row[i] = getValue(i, idx, hds); //竖着找
            }
        });
    });

    return hds;
}

function getValue(i, idx, rows) {
    var j;
    for (j = idx; j < rows.length; j++) {
        if (rows[j][i]) {
            return rows[j][i];
        }
    }

    for (j = rows.length - 1; j >= 0; j--) {
        if (rows[j][i]) {
            return rows[j][i];
        }
    }
}

function getRows(bodys, date) {
    var rows = [];

    each(bodys, function (tr) {
        rows.push([date].concat(getRow($$('td', tr))));
    });

    return rows;
}

function getRow(tds) {
    return map(tds, getText);
}

function getTitle(rowCols, arr) {
    each(rowCols, function (cell) {
        if (cell.colSpan > 1) {
            var text = getText(cell);
            arr.push(text);
            for (var j = 1; j < cell.colSpan; j++) {
                arr.push(text);
            }
        } else {
            arr.push(getText(cell));
        }
    });
    return arr;
}

function getText(el) {
    return el ? (el.innerText || el.textContent || '').trim() || '' : '';
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