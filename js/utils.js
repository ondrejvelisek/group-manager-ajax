/**
 * Created by ondrejvelisek on 25.3.16.
 */

$( document ).ready(function() {
    // Jquery .when() array
    if (jQuery.when.all === undefined) {
        jQuery.when.all = function (deferreds) {
            var deferred = new jQuery.Deferred();
            $.when.apply(jQuery, deferreds).then(
                function () {
                    deferred.resolve(toArray(arguments));
                },
                function () {
                    deferred.fail(toArray(arguments));
                });
            function toArray (args) { return deferreds.length > 1 ? $.makeArray(args) : [args]; };
            return deferred;
        }
    }
});



function setAttribute(name, attr) {
    //console.log(attr)
    $("[data-var]").each(function () {
        var element = $(this);
        var dataVar = element.attr("data-var").split(".");
        if (dataVar[0] == name) {
            dataVar.shift();
            var last = attr;
            for (var i in dataVar) {
                var prop = dataVar[i];
                if (last[prop] == undefined) {
                    last = undefined;
                    break;
                }
                last = last[prop];
            }
            element.html(last);
        }
    })
}


function perunGet(manager, method, params, success) {
    
    return jso.ajax({
        method: "GET",
        url: perunRpc+"/json/"+manager+"/"+method,
        data: params,
        dataType: "json",
        xhrFields: {
            withCredentials: false
        },
        success: success
    });
    
}

function perunPost(manager, method, params, success) {

    return jso.ajax({
        method: "POST",
        url: perunRpc+"/json/"+manager+"/"+method,
        data: JSON.stringify(params),
        contentType: 'application/json; charset=UTF-8',
        dataType: "json",
        xhrFields: {
            withCredentials: false
        },
        success: success
    });

}


function getHashPath(index) {
    var hash = window.location.hash.substring(1);
    var pathString = hash.split("?")[0];
    if (pathString.startsWith("/")) {
        pathString = pathString.substring(1);
    }
    var path = pathString.split("/");
    if (path.length <= index) {
        return undefined;
    }
    return path[index];
}

function getHashParam(name) {

    var hash = window.location.hash.substring(1);
    var queries = hash.split("?")[1].split("&");
    for (var i in queries) {
        var query = queries[i].split("=");
        if (query[0] == name) {
            if (query[1] != undefined) {
                return query[1];
            } else {
                return true;
            }
        }
    }
}




function diff(all, diff) {
    var result = [];
    for (var i in all) {
        if (!containsId(diff, all[i].id)) {
            result.push(all[i]);
        }
    }
    return result;
}
function containsId(all, id) {
    for (var i in all) {
        if (all[i].id == id) {
            return true;
        }
    }
    return false;
}

function directMembers(members) {
    var result = [];
    for (var i in members) {
        var member = members[i];
        if (member.membershipType == "DIRECT") {
            result.push(member);
        }
    }
    return result;
}

function getParentGroup(groups, group) {
    if (group == undefined || group == null) {
        return undefined;
    }
    return getGroupById(groups, group.parentGroupId);
}

function getBreadcrumbs(vo, group, groups, result) {
    if (result == undefined) {
        result = [];
    }
    if (group == undefined || group == null) {
        return [{title:vo.name}].concat(result);
    } else {
        result.unshift({title:group.shortName, group:group});
        return getBreadcrumbs(vo, getParentGroup(groups, group), groups, result);
    }
}

function isVo(group) {
    return (group == undefined || group == null);
}

function isMembers(group) {
    return (group != undefined && group != null && group.name == "members");
}

function getGroupByName(groups, groupName) {
    for (var i in groups) {
        var group = groups[i];
        if (group.name == groupName) {
            return group;
        }
    }
    return undefined;
}

function getGroupById(groups, groupId) {
    for (var i in groups) {
        var group = groups[i];
        if (group.id == groupId) {
            return group;
        }
    }
    return undefined;
}

function getSubgroups(groups, group) {
    var result = [];

    if (group != undefined && group != null) {
        for (var i in groups) {
            var g = groups[i]
            if (g.parentGroupId == group.id) {
                result.push(g);
            }
        }
    } else {
        for (var i in groups) {
            var g = groups[i]
            if (getGroupById(groups, g.parentGroupId) == null) {
                result.push(g);
            }
        }
    }

    return result;
}




