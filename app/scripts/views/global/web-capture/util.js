/**
 * Created by baihuibo on 16/3/8.
 */
var ipcRenderer = require('electron').ipcRenderer;
exports.dljrResult = function (table, type) {
    ipcRenderer.sendToHost('debug', 'dljrResult', table, type);
    var trs = table.querySelectorAll('tr:not([class])');
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
        return getTitle($$('td', hr), [])
    });

    return [].concat(normals(hds), getRows(bodys));
};

function normals(hds) {

    each(hds, function (row, idx) {
        //ipcRenderer.sendToHost('debug' , 'row', row);
        each(row, function (col, i) {
            if (!col) {
                hds[idx][i] = getValue(i, idx + 1, hds); //竖着找
            } else if (i != row.length - 1 && !row[i + 1]) {
                hds[idx][i + 1] = col;   //横着找
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

    for (var j = rows.length - 1; j > 0; j--) {

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