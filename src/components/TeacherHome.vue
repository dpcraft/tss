<template>
  <div>
    <el-header style="text-align: right; font-size: 18px">
      欢迎 <span style="color: royalblue; margin-right: 10px">{{teacherName}}</span>
      <el-button @click="logout" type="danger" size="small">退出登录</el-button>
    </el-header>
    <el-main>
      <el-row>
        <el-button type="primary"  @click.native.prevent="dialogFormVisible = true"  icon="el-icon-upload">题目导入</el-button>
        <el-button type="success" icon="el-icon-download" @click.native.prevent="resultDialogVisible = true">选题结果导出</el-button>
        <el-button type="info" icon="el-icon-download">选题结果统计</el-button>
        <el-button type="warning" @click.native.prevent="stdDialogVisible = true" icon="el-icon-upload">学生名单导入</el-button>
      </el-row>
      <p class="table-title">
        题目列表
      </p>
      <el-table
        :data="topicList"
        stripe
        v-loading="listLoading"
        style="width: 100%; text-align: center">
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
          align="center"
          prop="topicName"
          label="题目"
          width="300">
        </el-table-column>
        <el-table-column
          align="center"
          prop="topicDescription"
          label="要求"
          min-width="300">
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
      <el-dialog title="题目导入" :visible.sync="dialogFormVisible" width="40%">
        <input type="file" value="" id="topicFile" @change="getTopicFile($event)">

        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="uploadTopicFile">上传</el-button>
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
        <el-form :model="editForm">
          <el-form-item label="序号" :label-width="formLabelWidth">
            <el-input v-model="editForm.topicId" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="类型" :label-width="formLabelWidth">
            <el-input v-model="editForm.topicType" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="题目" :label-width="formLabelWidth">
            <el-input v-model="editForm.topicName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="要求" :label-width="formLabelWidth">
            <el-input type="textarea" v-model="editForm.topicDescription" autocomplete="off"></el-input>
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
        <el-form :model="resultForm">
          <el-form-item label="请输入班级编号（数字）" :label-width="formLabelWidth">
            <el-input v-model="resultForm.classId" autocomplete="off"></el-input>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="resultDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="exportStatistics(resultForm.classId)">确 定</el-button>
        </div>
      </el-dialog>
    </el-main>


  </div>
</template>

<script>
  import * as types from '@/store/types'
  import {fetchList, select, uploadTopic, deleteTopic,uploadStd, getResult, updateTopic} from '@/api/teacherTopic'
  export default {
    name:'Home',
    data() {
      return {
        dialogFormVisible: false,
        stdDialogVisible: false,
        editDialogVisible: false,
        resultDialogVisible: false,
        topicList: [],
        yourChoice:[],
        studentName: '',
        topicFile: '',
        stdFile: '',
        listLoading: false,
        classNo:'',
        value: '',
        editForm : {},
        resultForm: {}
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
        console.error(this.topicFile)
      },
      uploadTopicFile() {
        uploadTopic(this.topicFile).then(response => {
          if(response.data.code == 200){
            this.$message({
              message: '上传成功',
              type: 'success'

            });
            this.refresh()
          }else {
            this.$message({
              message: '上传失败',
              type: 'error'

            });
          }

          this.dialogFormVisible = false
        })
      },
      getStdFile(e) {
        this.stdFile = e.target.files[0];
        console.error(this.stdFile)
      },
      uploadStdFile() {
        uploadStd(this.stdFile).then(response => {

          if(response.data.code == 200){
            this.$message({
              message: '上传成功',
              type: 'success'

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
        link.setAttribute('download',classId + '班选题结果.xls')
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
