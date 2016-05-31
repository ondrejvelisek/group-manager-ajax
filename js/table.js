/**
 * Created by ondrejvelisek on 28.3.16.
 */

var tableIdSeq = 0;
function Table(data) {
    tableIdSeq ++;

    this.tableId = tableIdSeq;
    this.parent;
    this.data = data;
    this.columns = [];
    this.rowClick;
    this.toolbar;
    this.hideThead;


    this.setData = function (data) {
        this.data = data;
        this.refresh();
    };

    this.addColumn = function (col) {
        this.columns.push(col);
        this.refresh();
    };

    this.setRowClick = function (rowClick) {
        this.rowClick = rowClick;
        this.refresh();
    };

    this.setToolbar = function (toolbar) {
        this.toolbar = toolbar;
        this.refresh();
    };

    this.setHideThead = function (hideThead) {
        this.hideThead = hideThead;
        this.refresh();
    };

    this.refresh = function () {
        if (this.parent) this.attach(this.parent);
    };

    this.attach = function (parent) {
        var top = parent.html("<table id='table-" + this.tableId + "' class='table table-bordered'></table>").children();
        top.html(this.innterHtml(top));

        if (this.toolbar) this.toolbar.attach(top.find("#toolbar-" + this.tableId));

        for (var i in this.data) {
            var row = this.data[i];
            for (var j in this.columns) {
                var col = this.columns[j];
                col.cell(row[col.key], row).attach(top.find("#cell-" + this.tableId +"-"+ i + "-" + j));
            }
        }
        this.parent = parent;
    };

    this.detach = function () {
        this.parent.html("");
        this.parent = undefined;
    };

    this.innterHtml = function (top) {
        var html = [];
        function push (text) {
            html.push(text)
        }

        if (this.rowClick) top.addClass("table-hover");

        push("<thead>");

        if (this.toolbar) {
            push("<tr>");
            push("<th id='toolbar-" + this.tableId + "' colspan='" + this.columns.length + "' class='toolbar-cell'>");
            push("INJECTED");
            push("</th>");
            push("</tr>");
        }

        if (!this.hideThead) {
            push("<tr>");
            for (var i in this.columns) {
                var col = this.columns[i];
                push("<th>");
                push(col.title);
                push("</th>");
            }
            push("</tr>");
        }

        push("</thead>");

        push("<tbody>");

        for (var i in this.data) {
            var row = this.data[i];
            var rowId = "row-" + this.tableId +"-"+ i;
            if (this.rowClick) top.on('click', '#'+rowId, row, this.rowClick);
            push("<tr id='" + rowId + "'>");

            for (var j in this.columns) {
                var col = this.columns[j];
                var colId = "cell-" + this.tableId +"-"+ i + "-" + j;
                push("<td id='" + colId + "' class='" + col.classes + "'>");
                push("INJECTED");
                push("</td>");
            }

            push("</tr>");
        }

        push("</tbody>");

        return html.join("");
    }

}
