/**
 * Created by ondrejvelisek on 28.3.16.
 */

var buttonIdSeq = 0;
function Button(type, htmlText, btnClick) {
    buttonIdSeq ++;

    this.buttonId = buttonIdSeq;
    this.type = type;
    this.htmlText = htmlText;
    this.btnClick = btnClick;
    this.disabled = false;

    this.setDisabled = function (disabled) {
        this.disabled = disabled;
    };

    this.attach = function (parent) {
        var top = parent.html('<button class="btn"></button>').children();
        top.html(this.innerHtml(top));
    };


    this.innerHtml = function (top) {
        var html = [];
        function push (text) {
            html.push(text)
        }

        top.attr("id", "button-" + this.buttonId);
        top.addClass("btn-" + this.type);
        if (this.disabled) top.attr("disabled", "disabled");
        else top.click(this.btnClick);

        push(this.htmlText);

        return html.join("");
    }
    
}


