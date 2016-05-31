/**
 * Created by ondrejvelisek on 28.3.16.
 */

function Loading() {

    this.attach = function (parent) {
        var top = parent.html('<div class="progress"></div>').children();
        top.html(this.innerHtml(top));
    };

    this.innerHtml = function (top) {
        var html = [];
        function push (text) {
            html.push(text)
        }

        push('<div class="progress-bar progress-bar-striped active" style="width: 100%">');
        push('</div>');

        return html.join("");
    }
    
}


