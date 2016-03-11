/**
 * Created by baihuibo on 16/3/8.
 */
module.exports = function util(rows, obj) {
    var slice = [].slice;

    var headers = slice.call(rows, obj.hds[0], obj.hds[1]);
    var bodys = slice.call(rows, obj.hds[1]);

    headers = map(headers, function (hr) {
        var row = ['date'];
        row._hr = hr;
        return row
    });

    formatHeaders(headers);
    return [].concat(normals(headers), formatBodys(bodys, obj.time || ''));
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

function formatBodys(bodys, date) {
    var rows = [];

    each(bodys, function (tr) {
        rows.push([date].concat(map(tr.cells, getText)));
    });

    return rows;
}

function formatHeaders(rows) {
    each(rows, function (row, rowIdx) {
        each(row._hr.cells, function (cell) {
            var val = getText(cell);
            var rowSpan = cell.rowSpan || 1,
                colSpan = cell.colSpan || 1;
            cellPut(rows, rowIdx, rowSpan, colSpan, val);
        });
    });

    function cellPut(arr, rid, rSpan, cSpan, val) {
        var x = getStartX(arr[rid]);
        var row;
        for (var i = 0; i < rSpan; i++) {
            row = arr[rid + i];
            for (var j = 0; j < cSpan; j++) {
                row[x + j] = val;
            }
        }
    }

    function getStartX(arr) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] === void 0) {
                return i;
            }
        }
        return i;
    }
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
    return (context || document).querySelector(selector);
}

function $$(selector, context) {
    return (context || document).querySelectorAll(selector);
}