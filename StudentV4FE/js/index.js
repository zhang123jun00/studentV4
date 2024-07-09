const app = new Vue({
    el: '#app',
    data() {
        // 校验学号是否存在

        const rulesNo = (rule, value, callback) => {
            if (this.isEdit) {
                callback();
            }
            // /使用axios请求
            axios.post(
                this.baseUrl + 'sno/check/',
                {
                    sno: value
                }
            )
                .then((res) => {
                    // 
                    if (res.data.code === 1) {
                        if (res.data.exsits) {
                            callback(new Error("学号已存在"))
                        } else { callback() };
                    } else {
                        //请求失败
                        callback(new Error('校验学号后端出现异常'))
                    }
                })
                .catch((err) => {
                    //请求失败打印控制台
                    console.log(err)
                })
        }

        return {
            msg: 'hello, vue',
            students: [], //所有的学生信息
            baseUrl: 'http://192.168.64.1:8000/',
            total: 0, //数据总行数
            currentpage: 1, // 当前所在页
            pagesize: 10,//每页显示多少行
            pageStudents: [], //分页后当前学生,
            inputStr: '',
            dialogTitle: "",
            isEdit: false,
            isView: false,
            selectionStudents: [],
            dialogVisible: false, // 弹出框默认false
            // 学生信息
            studentForm: {
                sno: '',
                name: '',
                gender: '',
                birthday: '',
                mobile: '',
                email: '',
                address: '',
                image: '',
                imageUrl: "",
            },
            rules: {
                sno: [
                    { required: true, message: '学号不能为空', trigger: "blur" },
                    { pattern: /^[9][5]\d{3}$/, message: '学号必须是95开头的五位数', trigger: 'blur' },
                    { validator: rulesNo, trigger: 'blur' },//校验学号是否存在

                ],
                name: [
                    { required: true, message: '姓名不能为空', trigger: 'blur' },
                    { pattern: /^[\u4e00-\u9fa5]{2,5}$/, message: '姓名必须是2-5个汉字', trigger: 'blur' }
                ],
                gender: [
                    { required: true, message: '性别不能为空', trigger: 'change' }
                ],
                birthday: [
                    { required: true, message: '性别不能为空', trigger: 'change' }
                ],
                mobile: [
                    { required: true, message: '手机号码不能为空', trigger: 'blur' },
                    { pattern: /^[1][356789]\d{9}$/, message: "手机号必须符合规范", trigger: 'blur' }
                ],
                email: [
                    { required: true, message: '邮箱不能为空', trigger: 'blur' },
                    { pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([*.]\w+)*$/, message: "邮箱必须符合规范", trigger: 'blur' }
                ],
                address: [
                    { required: true, message: '家庭地址不能为空', trigger: 'blur' }
                ]
            }

        }
    },
    mounted() {
        //自动加载数据
        this.getStudents();
    },
    methods: {
        // 获取所有学生的嘻嘻
        getStudents: function () {
            // 记录this地址
            let that = this
            //使用axios实现Ajax请求
            axios
                .get(that.baseUrl + "students/")
                .then(function (res) {
                    //请求成功后执行的函数
                    if (res.data.code === 1) {
                        //把数据给students：
                        that.students = res.data.data;
                        // 获取数据返回记录的总行数
                        that.total = res.data.data.length
                        // 获取当前页的数据
                        that.getPageStudents();
                        // 提示
                        that.$message({
                            message: '数据加载成功！',
                            type: 'success'
                        });
                    } else {
                        //失败提示
                        that.$message.error(res.data.msg);
                    }
                })
                .catch(function (err) {
                    //请求失败后执行的函数
                    console.log(err);
                })
        },
        //获取当前页的学生数据
        getPageStudents: function () {
            //清空pageStudents中的数据
            this.pageStudents = [];
            //获取当前页数据
            for (let i = (this.currentpage - 1) * this.pagesize; i < this.total; i++) {
                //遍历数据添加到PageStudents中
                this.pageStudents.push(this.students[i]);
                // 判断是否达到一页的要求
                if (this.pageStudents.length == this.pagesize) break;
            }
        },
        queryStudent() {
            let that = this
            //开始axios请求
            axios
                .post(
                    that.baseUrl + 'students/query/',
                    {
                        inputstr: that.inputStr
                    }
                )
                .then(function (res) {
                    if (res.data.code === 1) {
                        //把数据给students：
                        that.students = res.data.data;
                        // 获取数据返回记录的总行数
                        that.total = res.data.data.length
                        // 获取当前页的数据
                        that.getPageStudents();

                        // 提示
                        that.$message({
                            message: '查询数据加载成功！',
                            type: 'success'
                        });
                    } else {
                        //失败提示
                        that.$message.error(res.data.msg);
                    };
                })
                .catch(function (err) {
                    console.log(err);
                    that.$message.error("获取后端查询结果出现异常")
                });
        },
        getAllStudent() {
            //清空输入inputStr
            this.inputStr = '',
                //获取学生记录
                this.getStudents();
        },
        //
        addStudent() {
            // 改变tittle
            this.dialogTitle = '添加学生信息';
            ;            // 弹出dialog对话框
            this.dialogVisible = true;
        },
        // 根据sno获取学生图片
        getImageBySno(sno) {
            for (oneStudent of this.students){
            if (oneStudent.sno == sno) {
                console.log('oneStudent.image',oneStudent.image)
                return oneStudent.image;
            }
            }
        },
        //查看学生信息
        viewStudent(row) {
            this.dialogTitle = "查看学生信息";
            this.isView = true;
            this.dialogVisible = true;
            // console.log(row)
            // 深浅拷贝
            this.studentForm = JSON.parse(JSON.stringify(row))
            // 获取照片
            this.studentForm.image = this.getImageBySno(row.sno);
            // 获取照片URL
            this.studentForm.imageUrl = this.baseUrl + 'media/' + this.studentForm.image;
        },

        // 修改学生信息
        updateStudent(row) {
            this.dialogTitle = '修改学生信息';
            this.isEdit = true;
            this.dialogVisible = true;
            //深浅拷贝
            this.studentForm = JSON.parse(JSON.stringify(row))
            // image 赋值
            this.studentForm.image = this.getImageBySno(row.sno);
            // imageUrl赋值
            this.studentForm.imageUrl = this.baseUrl + 'media/' + this.studentForm.image
        },
        //提交校验
        submitStudentForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    //校验通过
                    if (this.isEdit) {
                        //修改
                        this.submitUpadateStudent();
                    } else {
                        // 添加
                        this.submitAddStudent();
                    };
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        // 添加到数据库
        submitAddStudent() {
            let that = this
            axios
                .post(that.baseUrl + 'student/add/', that.studentForm)
                .then(res => {
                    //执行成功
                    if (res.data.code === 1) {
                        //获取所有学生信息
                        that.students = res.data.data;
                        that.total = res.data.data.length;
                        //获取分页信息
                        that.getPageStudents();
                        //提示：
                        that.$message({
                            message: "保存成功！",
                            type: 'sucess'
                        });
                        that.closeDialogForm('studentForm')
                    }
                })
                .catch(err => {
                    //执行失败
                    console.log(err)
                    that.$message.error("获取后端查询结果失败")
                })
        },
        // 修改更新到数据库
        submitUpadateStudent() {
            //     let that = this;
            //     //axios请求
            //     axios
            //     .post(that.baseUrl + 'student/update/', that.studentForm)
            //     .then(res=>{
            //         if(res.data.code === 1){
            //             //获取学生信息
            //             that.students = res.data.data;
            //             //获取数据总数
            //             that.total = res.data.data.length;
            //             //获取当前页数据
            //             that.getPageStudents();
            //             //提示：
            //             that.$message({
            //                 message:'修改成功',
            //                 type:'sucess'
            //             });
            //             that.closeDialogForm('studentFrom')
            //         }
            //     })
            //     .catch(err=>{
            //         console.log(err)
            //         that.$message.error("获取后端查询结果失败")
            //     })
            // },
            let that = this
            axios
                .post(that.baseUrl + 'student/update/', that.studentForm)
                .then(res => {
                    //执行成功
                    if (res.data.code === 1) {
                        //获取所有学生信息
                        that.students = res.data.data;
                        that.total = res.data.data.length;
                        //获取分页信息
                        that.getPageStudents();
                        //提示：
                        that.$message({
                            message: "修改成功！",
                            type: 'sucess'
                        });
                        that.closeDialogForm('studentForm')
                    }
                })
                .catch(err => {
                    //执行失败
                    console.log(err)
                    that.$message.error("获取后端查询结果失败")
                })
        },
        //关闭dialog框，清空数据
        closeDialogForm(formName) {
            //关闭表单校验
            this.$refs[formName].resetFields();
            // 清空数据
            this.studentForm.sno = "";
            this.studentForm.name = "";
            this.studentForm.gender = "";
            this.studentForm.birthday = "";
            this.studentForm.email = "";
            this.studentForm.mobile = "";
            this.studentForm.address = "";
            this.studentForm.image = "";
            this.studentForm.imageUrl = "";
            // this.$refs.studentForm.resetFields();
            // 关闭对话框
            this.dialogVisible = false;
            // 初始化isEidit和isView
            this.isEdit = false;
            this.isView = false;
        },
        // 删除一条学生记录
        deleteStudent(row) {
            //等待确认
            this.$confirm("是否确认删除学生信息【学号:" + row.sno + "\t姓名：" + row.name + "】信息？",
                '提示', {
                confirmButtonText: '确认删除',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // 确认删除响应时间
                let that = this;
                // axios请求
                axios.post(that.baseUrl + 'student/delete/',
                    { sno: row.sno }
                )
                    .then(res => {
                        if (res.data.code === 1) {
                            that.students = res.data.data;
                            that.total = res.data.data.length;
                            that.getPageStudents();
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                        } else {
                            //失败提示
                            that.$message.error(res.data.msg)
                        }
                    })

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        // 批量删除学生记录
        deleteStudents() {
            //等待确认
            this.$confirm("是否确认批量删除" + this.selectionStudents.length + "个学生信息",
                '提示', {
                confirmButtonText: '确认删除',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // 确认删除响应时间
                let that = this;
                // axios请求
                axios.post(that.baseUrl + 'students/delete/',
                    { student: that.selectionStudents }
                )
                    .then(res => {
                        if (res.data.code === 1) {
                            that.students = res.data.data;
                            that.total = res.data.data.length;
                            that.getPageStudents();
                            this.$message({
                                type: 'success',
                                message: '批量删除成功!'
                            });
                        } else {
                            //失败提示
                            that.$message.error(res.data.msg)
                        }
                    })

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        //选择学生头像点击确认触发的事情
        uploadPicturePost(file) {
            let that = this;
            //定义一个FormData类
            let fileReq = new FormData();
            //把照片上传
            fileReq.append('avatar', file.file);
            // axios.post(that.baseUrl +'upload/',fileReq,{
            //     headers:{
            //         'Content-Type':'multipart/form-data'
            //     }
            // }
            // )
            axios(
                {
                    method: 'post',
                    url: that.baseUrl + 'upload/',
                    data: fileReq
                })
                .then(res => {
                    //根据code判断
                    if (res.data.code === 1) {
                        //获取照片的name
                        that.studentForm.image = res.data.name;
                        //拼接imageUrl
                        that.studentForm.imageUrl = that.baseUrl + 'media/' + res.data.name;
                    } else {
                        console.log(res.data.msg)
                    }
                })
                .catch(err => {
                    //失败提示
                    that.$message.error('上传头像异常')
                })
        },
        // 上传excel
        uploadExcelPost(file){
            let that = this;
            //定义一个FormData类
            let fileReq = new FormData();
            // 文件上传
            fileReq.append('file', file.file);

            axios({
                method: 'post',
                url: that.baseUrl + 'import/',
                data: fileReq
            })
            .then(res=>{
                if(res.data.code === 1){
                    //获取所有人员
                    that.students = res.data.data;
                    // 获取总数
                    that.total = res.data.data.length;
                    //分页
                    that.getPageStudents();
                    {
                        this.$alert('本次导入完成!成功:'+res.data.sucess+
                            '失败：'+res.data.error , '导入结果展示', {
                          confirmButtonText: '确定',
                        //   callback: action => {
                        //     this.$message({
                        //       type: 'info',
                        //     //   message: ""
                        //     });
                        //   }
                        });
                      };
                      console.log(res.data.error.sno)   
                }
            })
            .catch(err => {
                //失败提示
                that.$message.error('excel导入异常')
            })
    },
        exportExcel(){
            let that = this;
            axios.get(that.baseUrl + 'export/')
            .then(res=>{
                if(res.data.code===1){
                    let url = that.baseUrl + 'media/' + res.data.name
                    // console.log(url)
                    // 下载
                    window.open(url)
                      
                }else{
                    that.$message('导出文件错误')
                }
            })
            .catch(error=>{
                console.log(error);
            })
        },
        handleSizeChange(size) {
            //修改当前没页数据行数
            this.pagesize = size;
            //数据重新加载
            this.getPageStudents();
        },

        // 
        handleCurrentChange(PageNumber) {
            ////分页时修改每页的行数
            this.currentpage = PageNumber;
            this.getPageStudents();
        },

        // //复选框触发操作
        handleSelectionChange(data) {
            this.selectionStudents = data;
            console.log(data);
        }
    }
})
