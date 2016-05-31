
$( document ).ready(function() {

    jso.callback();
    JSO.enablejQuery($);

    perunGet("authzResolver", "getPerunPrincipal", {}, function (principal) {

        setAttribute("principal", principal);

    });


    var voShortName = getHashPath(0);
    var groupName = getHashPath(1);

    var groupTableTmp = new Table([]);
    groupTableTmp.setHideThead(true);
    groupTableTmp.setToolbar(new Loading());
    groupTableTmp.attach($("div#table-groups"));
    perunGet("vosManager", "getVoByShortName", {"shortName":voShortName}, function (vo) {

        perunGet("groupsManager", "getGroups", {"vo":vo.id}, function (groups) {

            reload(vo, getGroupByName(groups, groupName), groups);

        });
        
    });

});



function reload(vo, group, groups) {
    if (group) {
        window.location.hash = "#/"+vo.shortName+"/"+group.name;
    } else {
        window.location.hash = "#/"+vo.shortName;
    }

    groupTable(vo, group, groups, getSubgroups(groups, group)).attach($("div#table-groups"));



    var groupMemberTable = memberTable(vo, group, groups, [], false);
    groupMemberTable.setHideThead(true);
    groupMemberTable.attach($("div#table-groupMembers"));


    var voMemberTable = memberTable(vo, group, groups, [], true);
    voMemberTable.setHideThead(true);
    voMemberTable.attach($("div#table-voMembers"));



    if (!isVo(group)) {
        groupMemberTable.setToolbar((new Loading()));
        var groupMembersCall = perunGet("groupsManager", "getGroupMembers", {"group": group.id});
    } else {
        groupMemberTable.detach();
    }


    voMemberTable.setToolbar((new Loading()));
    var voMembersCall = perunGet("membersManager", "getMembers", {"vo": vo.id});


    $.when(voMembersCall, groupMembersCall).done(function (voMbs, groupMbs) {

        if (groupMbs) {
            var groupMembers = groupMbs[0];
            var groupMemberUsers = [];
            $.when.apply($, fillMemberUsers(groupMemberUsers, groupMembers)).done(function () {
                groupMemberTable.setToolbar(null);
                groupMemberTable.setHideThead(false);
                groupMemberTable.setData(groupMemberUsers);
            });
        }

        var voMembers;
        if (groupMbs) {
            voMembers = diff(voMbs[0], directMembers(groupMbs[0]));
        } else {
            voMembers = voMbs[0];
        }
        var voMemberUsers = [];
        $.when.apply($, fillMemberUsers(voMemberUsers, voMembers)).done(function () {
            voMemberTable.setToolbar(null);
            voMemberTable.setHideThead(false);
            voMemberTable.setData(voMemberUsers);
        });

    });

}




function fillMemberUsers(memberUsers, members) {
    var calls = [];
    for (var i in members) {
        calls.push(perunGet("usersManager", "getUserById", {"id": members[i].userId}, success(members[i])));
        function success(member) {
            return function (user) {
                var dispayName = user.firstName+" "+user.lastName;
                memberUsers.push({name:dispayName, status:member.status,
                    membershipType:member.membershipType, member:member, user:user});
            }
        }
    }
    return calls;
}





function groupTable(vo, group, groups, subgroups) {

    var crumbClick = function (event) {
        reload(vo, event.data.group, groups);
    };
    var parentClick = function () {
        reload(vo, getParentGroup(groups, group), groups);
    };

    var breadcrumbs = new Breadcrumbs(getBreadcrumbs(vo, group, groups));
    breadcrumbs.setCrumbClick(crumbClick);
    if (!isVo(group)) breadcrumbs.setParent(parentClick);

    var textCell = function (value) {
        return {attach: function(parent) {
            parent.html(value);
        }};
    };
    var rowClick = function (event) {
        reload(vo, getGroupByName(groups, event.data.name), groups);
    };

    var table = new Table(subgroups);
    table.addColumn({title:"Name", key:"shortName", cell:textCell});
    table.addColumn({title:"Description", key:"description", cell:textCell});
    table.setRowClick(rowClick);
    table.setToolbar(breadcrumbs);
    return table;
}




function memberTable(vo, group, groups, memberUsers, voTable) {

    var textCell = function (value) {
        return {attach: function(parent) {
            parent.html(value);
        }};
    };
    var addMemberCell = function (value, row) {
        var btn = new Button("success", "<i class='glyphicon glyphicon-plus'>", function () {
            perunPost("groupsManager", "addMember", {"group": group.id, "member": row.member.id}, function () {
                reload(vo, group, groups)
            });
        });
        return btn;
    };
    var removeMemberCell = function (value, row) {
        var btn = new Button("danger", "<i class='glyphicon glyphicon-minus'>", function () {
            perunPost("groupsManager", "removeMember", {"group": group.id, "member": row.member.id}, function () {
                reload(vo, group, groups)
            });
        });
        if (isMembers(group)) {
            btn.setDisabled(true);
            return btn;
        } else if (row.member.membershipType == "DIRECT") {
            return btn;
        } else {
            btn = new Button("default", "<i class='glyphicon glyphicon-empty'></i>");
            btn.setDisabled(true);
            return btn;
        }
    };

    var table = new Table(memberUsers);
    table.addColumn({title: "Name", key: "name", cell: textCell});
    table.addColumn({title: "Status", key: "status", cell: textCell});
    if (voTable) {
        if (!isVo(group)) table.addColumn({title: "", key: "membershipType", cell: addMemberCell, classes:"tight-cell btn-cell"});
    } else {
        table.addColumn({title: "", key: "membershipType", cell: removeMemberCell, classes:"tight-cell btn-cell"});
    }
    return table;
}
