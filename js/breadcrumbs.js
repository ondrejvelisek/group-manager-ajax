/**
 * Created by ondrejvelisek on 28.3.16.
 */

var breadcrumbsIdSeq = 0;
function Breadcrumbs(crumbs) {
    breadcrumbsIdSeq++;

    this.breadcrumbsId = breadcrumbsIdSeq;
    this.crumbs = crumbs;
    this.crumbClick = null;
    this.parentClick = null;


    this.setParent = function (parent) {
        this.parentClick = parent;
    };

    this.setCrumbClick = function (crumbClick) {
        this.crumbClick = crumbClick;
    };


    this.attach = function (parent) {
        var top = parent.html("<ol class='breadcrumb'></ol>").children();
        top.html(this.innerHtml(top));
    };


    this.innerHtml = function (top) {
        var html = [];
        function push (text) {
            html.push(text)
        }

        var i;
        for (i = 0; i < this.crumbs.length-1; i++) {
            var crumb = this.crumbs[i];
            var crumbId = "crumb-" + this.breadcrumbsId +"-"+ i;
            if (this.crumbClick) top.on('click', '#'+crumbId, crumb, this.crumbClick);
            push('<li id="' + crumbId + '">');
            push('<a>');
            push(crumb.title);
            push('</a>');
            push('</li>');
        }
        var crumb = this.crumbs[i];
        push('<li id="crumb-' + this.breadcrumbsId + '-' + i + '" class="active">');
        push(crumb.title);
        push('</li>');

        var parentId = "parentClick-" + this.breadcrumbsId;
        if (this.parentClick) {
            top.on('click', '#'+parentId, this.parentClick);
            push('<a id="' + parentId + '" class="pull-right">');
        } else {
            push('<a id="' + parentId + '" class="pull-right disabled">');
        }
        push('<i class="glyphicon glyphicon-arrow-up"></i>');
        push('</a>');

        return html.join("");
    }
    
}


