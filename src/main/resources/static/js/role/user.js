var app = new Vue({
    el: '#userIndex',
    data: {
        search: {name: '', cellphone: ''},
        users: [],
        beginIndex: 0

    },
    methods: {
        getUsers: function () {
            var pageIndex = pageVM.current_page;
            var pageSize = 5;
            var params = {
                name: this.search.name,
                cellphone:this.search.cellphone,
                roleId: $("#hidRoleId").val(),
                newObj: $("input[value='new']").prop("checked"),
                pageIndex: pageIndex, pageSize: pageSize
            };
            this.$http.post(getUrl('user/getUsers'), params, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        this.users = response.data.obj.rows;
                        pageVM.pages = Math.ceil(response.data.obj.count / params.pageSize);//要进行取整处理
                        this.beginIndex = (pageIndex - 1) * pageSize;

                        //如果已经是角色权限，全部勾上
                        if (!params.newObj) {
                            setTimeout("$(':checkbox').prop('checked', true)",200)
                        }
                        else {
                            $(":checkbox").prop("checked", false);
                        }

                    }
                    else alert(response.data.msg);
                })
        },
        checkAll: function () {
            var val = $("#all").prop("checked");
            $(":checkbox").prop("checked", val);
        },
        save: function () {
            var isNew = $("input[value='new']").prop("checked");
            var msg;
            var userIds = [];
            var url = "";
            if (isNew) {
                url = getUrl("role/addUserRole");
                msg = "添加成功";
                $("input[type=checkbox]:checked").each(function () {
                    userIds.push($(this).val());
                });
            }
            else {
                url = getUrl("role/deleteUserRole");
                msg = "删除成功";
                $("input[type=checkbox]:not(:checked)").each(function () {
                    userIds.push($(this).val());
                });
            }

            var params = {

                roleId: $("#hidRoleId").val(),
                userIds: userIds.toString()//数组转字符串
            };

            this.$http.post(url, params, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        app.getUsers();
                        alert(msg);
                    }
                    else alert(response.data.msg);
                })
        }
    }
});


$(function () {
        app.getUsers();

    }
);