<template>
  <div>
    <el-header style="text-align: right; font-size: 18px">
      欢迎 <span style="color: royalblue; margin-right: 10px">{{teacherName}}</span>
      <el-button @click="logout" type="danger" size="small">退出登录</el-button>
    </el-header>
    <el-main>
      <el-row>
        <el-button type="primary"  @click.native.prevent="dialogFormVisible = true"  icon="el-icon-upload">excel题目导入</el-button>
        <el-button type="primary"  @click.native.prevent="wordDialogVisible = true"  icon="el-icon-upload">word题目导入</el-button>
        <el-button type="success" icon="el-icon-download" @click.native.prevent="resultDialogVisible = true">选题结果导出</el-button>
        <el-button type="info" icon="el-icon-download">选题结果统计</el-button>
        <el-button type="warning" @click.native.prevent="stdDialogVisible = true" icon="el-icon-upload">学生名单导入</el-button>
        <el-button type="danger" @click.native.prevent="resetDialogVisible = true" icon="el-icon-refresh">重置学生密码</el-button>
      </el-row>
      <p class="table-title">
        题目列表
      </p>
      <el-table
        :data="topicList"
        stripe
        v-loading="listLoading"
        style="width: 100%;">
        <el-table-column
          label="序号"
          align="center"
          prop="topicId"
          width="80">
        </el-table-column>
        <el-table-column
          align="center"
          prop="topicType"
          label="类型"
          width="180">
        </el-table-column>
        <el-table-column
          header-align="center"
          prop="topicName"
          label="题目"
          width="300">
        </el-table-column>
        <el-table-column
          header-align="center"
          label="要求"
          min-width="300">
          <template slot-scope="scope">
            <a v-if="validateURL(scope.row.topicDescription)" :href="scope.row.topicDescription" :download="scope.row.topicName">下载具体要求</a>
            <span v-if="!validateURL(scope.row.topicDescription)">{{scope.row.topicDescription}}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="topicMaxSelected"
          label="限选人数"
          width="100">
        </el-table-column>
        <el-table-column
          align="center"
          fixed="right"
          label="操作"
          width="200">
          <template slot-scope="scope">
            <el-button  icon="el-icon-edit" @click="handleEdit(scope.row)" type="primary" size="small">编辑</el-button>
            <el-button  icon="el-icon-delete" @click="deleteDialog(scope.row)" type="danger" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="excel题目导入" :visible.sync="dialogFormVisible" width="40%">
        <input type="file" value="" id="topicFile" @change="getTopicFile($event)">

        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="uploadTopicFile">上传</el-button>
        </div>
      </el-dialog>

      <el-dialog title="word 题目导入" :visible.sync="wordDialogVisible" width="40%">
        <div style="color: deepskyblue">文件命名为：题号_类型_名称_限选人数,例：5_设计与配置_路由器设计_10</div>
        <input type="file" value="" id="topicWordFile" @change="getTopicWordFile($event)">

        <div slot="footer" class="dialog-footer">
          <el-button @click="wordDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="uploadTopicWordFile">上传</el-button>
        </div>
      </el-dialog>
      <el-dialog title="学生名单导入" :visible.sync="stdDialogVisible" width="40%">
        <input type="file" value="" id="studentFile" @change="getStdFile($event)">

        <div slot="footer" class="dialog-footer">
          <el-button @click="stdDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="uploadStdFile">上传</el-button>
        </div>
      </el-dialog>
      <el-dialog title="编辑题目" :visible.sync="editDialogVisible">
        <el-form :model="editForm" >
          <el-form-item label="序号" :label-width="formLabelWidth">
            <el-input v-model="editForm.topicId" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="类型" :label-width="formLabelWidth">
            <el-input v-model="editForm.topicType" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="题目" :label-width="formLabelWidth">
            <el-input v-model="editForm.topicName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="要求" :label-width="formLabelWidth" >
            <el-input :disabled="validateURL(editForm.topicDescription)" type="textarea" v-model="editForm.topicDescription" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="限选人数" :label-width="formLabelWidth">
            <el-input v-model="editForm.topicMaxSelected" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handlePostEdit(editForm)">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="选题结果导出" :visible.sync="resultDialogVisible">
        <el-select v-model="resultForm.classId" placeholder="请选择班级">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <div slot="footer" class="dialog-footer">
          <el-button @click="resultDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="exportStatistics(resultForm.classId)">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="重置学生密码" :visible.sync="resetDialogVisible" width="40%">
        <el-form :model="resetPwdForm" :rules="resetPwdRules" ref="resetPwdForm">
          <el-form-item label="学号" :label-width="formLabelWidth" prop="username">
            <el-input v-model="resetPwdForm.username" autocomplete="off" type="text"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="resetDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleResetPwd">确 定</el-button>
        </div>
      </el-dialog>
    </el-main>


  </div>
</template>

<script>
  import * as types from '@/store/types'
  import {changePwd} from '@/api/login'
  import { isvalidUsername } from '@/utils/validate'
  import {fetchList, select, uploadTopic,uploadTopicWord, deleteTopic,uploadStd, getResult, updateTopic} from '@/api/teacherTopic'
  export default {
    name:'teacherHome',
    data() {
      const validateUsername = (rule, value, callback) => {
        if (!isvalidUsername(value)) {
          callback(new Error('请输入正确的学号'))
        } else {
          callback()
        }
      }
      return {
        dialogFormVisible: false,
        stdDialogVisible: false,
        editDialogVisible: false,
        resultDialogVisible: false,
        resetDialogVisible: false,
        wordDialogVisible: false,
        topicList: [],
        yourChoice:[],
        studentName: '',
        topicFile: '',
        stdFile: '',
        listLoading: false,
        classNo:'',
        options: [{
          value: '1',
          label: '一班'
        }, {
          value: '2',
          label: '二班'
        }, {
          value: '3',
          label: '三班'
        }, {
          value: '-1',
          label: '全部班级'
        }],
        editForm : {},
        resultForm: {},
        resetPwdRules: {
          username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        },
        resetPwdForm: {
          username:'',
          newPwd: '666666'

        },
        formLabelWidth: '100px'
      }
    },
    created() {
      this.teacherName = this.$store.state.teacherName
      this.getList()
    },
    methods:{
      refresh(){
        this.getList()
      },
      getList() {
        this.listLoading = true
        fetchList().then(response => {
          this.topicList = response.data.list
        })
        this.listLoading = false
      },
      logout() {
        this.$store.commit(types.LOGOUT)
        let redirect = decodeURIComponent('/teacherLogin');
        this.$router.push({
          path: redirect
        })
      },
      getTopicFile(e) {
        this.topicFile = e.target.files[0];
      },
      uploadTopicFile() {
        uploadTopic(this.topicFile).then(response => {
          if(response.data.code == 200){
            this.$message({
              message: '上传成功',
              type: 'success'

            });
            this.refresh()
          }else if(response.data.code == 402){
            this.$message({
              message: '您没有权限进行该项操作',
              type: 'error'

            });}
            else {
            this.$message({
              message: '上传失败',
              type: 'error'

            });
          }

          this.dialogFormVisible = false
        })
      },
      getTopicWordFile(e) {
        this.topicFile = e.target.files[0];
      },
      uploadTopicWordFile() {
        uploadTopicWord(this.topicFile).then(response => {
          if(response.data.code == 200){
            this.$message({
              message: '上传成功',
              type: 'success'

            });
            this.refresh()
          }else if(response.data.code == 401){
            this.$message({
              message: '文件名不符合规范',
              type: 'error'

            });
          }else if(response.data.code == 402){
            this.$message({
              message: '您没有权限进行该项操作',
              type: 'error'

            });
          }else{
            this.$message({
              message: '上传失败',
              type: 'error'

            });
          }

          this.wordDialogVisible = false
        })
      },
      getStdFile(e) {
        this.stdFile = e.target.files[0];
      },
      uploadStdFile() {
        uploadStd(this.stdFile).then(response => {

          if(response.data.code == 200){
            this.$message({
              message: '上传成功',
              type: 'success'

            });
          }else if(response.data.code == 402){
            this.$message({
              message: '您没有权限进行该项操作',
              type: 'error'

            });
          }else {
            this.$message({
              message: '上传失败',
              type: 'error'

            });
          }
          this.stdDialogVisible = false
        })
      },

      deleteDialog(row) {
        this.$confirm('确定删除题目: '+ row.topicName +'?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteTopic(row.topicId).then(response => {
            if(response.data.code == 200){
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.refresh()
            }else if(code == 400) {
              this.$message({
                message: response.data,
                type: 'success'
              });
            }

          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      handleEdit(row){
        this.editDialogVisible = true
        this.editForm = Object.assign({}, row)

      },
      exportStatistics(classId){
        getResult(classId).then(response => {
          this.download(response.data, classId)
          this.resultDialogVisible = false
        })
      },

      download (data, classId) {
        if (!data) {
          return
        }
        let url = window.URL.createObjectURL(new Blob([data]))
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        if(classId == -1){
          link.setAttribute('download', '全部班级选题结果.xls')
        }else{
          link.setAttribute('download',classId + '班选题结果.xls')
        }
        document.body.appendChild(link)
        link.click()
      },
      handlePostEdit(form){
        updateTopic(form).then(response => {
          if(response.data.code == 200){
            this.$message({
              type: 'success',
              message: '修改成功'
            });
            this.refresh()
          }else {
            this.$message({
              type: 'error',
              message: '修改失败'
            });
          }
          this.editDialogVisible = false
        })
      },
      validateURL(textval) {
        const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
        return urlregex.test(textval)
      },
      handleResetPwd() {
        this.$refs.resetPwdForm.validate(valid => {
          if (valid) {
            changePwd(this.resetPwdForm.username, this.resetPwdForm.newPwd).then(response => {
              if(response.data.code == 200 || response.data.code == 300){
                this.$alert('', '重置密码成功', {
                  confirmButtonText: '确定',
                });
              }else if(response.data.code == 400) {
                this.$alert('请重新操作', '重置密码失败', {
                  confirmButtonText: '确定',
                });
              }

            })
            this.resetDialogVisible = false
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }


    }
  }
</script>
<style>
  .table-title {
    background: rgba(66, 185, 131, .1);
    border-radius: 2px;
    padding: 16px;
    padding: 1rem;
    line-height: 1.6rem;
    word-spacing: .05rem;
    text-align: left;
  }
</style>
