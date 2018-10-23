<template>
  <div>
    <el-header style="text-align: right; font-size: 18px">
      <el-select v-model="classNo" placeholder="请选择班级" @change="changeClassNo">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      欢迎 <span style="color: royalblue; margin-right: 10px">{{username}}</span>
      <el-button @click="logout" type="danger" size="small">退出登录</el-button>
    </el-header>
    <el-main>
      <el-row>
        <el-button type="primary"  @click.native.prevent="dialogFormVisible = true">题目导入</el-button>
        <el-button type="success">选题结果导出</el-button>
        <el-button type="info">选题结果统计</el-button>
        <el-button type="warning">学生名单导入</el-button>
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
            <el-button  @click="handleSelect(scope.row)" type="primary" size="small">编辑</el-button>
            <el-button  @click="deleteDialog(scope.row)" type="danger" size="small">删除</el-button>
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
      <el-dialog title="题目导入" :visible.sync="stdDialogVisible" width="40%">
        <input type="file" value="" id="studentFile" @change="getStdFile($event)">

        <div slot="footer" class="dialog-footer">
          <el-button @click="stdDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="uploadTopicFile">上传</el-button>
        </div>
      </el-dialog>
    </el-main>


  </div>
</template>

<script>
  import * as types from '@/store/types'
  import {fetchList, select, uploadTopic, deleteTopic,uploadStd} from '@/api/teacherTopic'
  export default {
    name:'Home',
    data() {
      return {
        dialogFormVisible: false,
        topicList: [],
        yourChoice:[],
        username: '',
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
        }],
        value: ''
      }
    },
    created() {
      this.username = this.$store.state.username
      this.classNo = this.$store.state.classNo
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
      handleSelect(row) {
        select(this.username,row.topicId).then(response => {
          this.$message({
            message: response.data,
            type: 'success'
          });
          if(response.code == 200){
            this.yourChoice.push(row)
          }
        })

      },
      handleCancel(row) {
        cancel(this.username,row.topicId).then(response => {
          this.$message({
            message: response.data,
            type: 'success'
          });
          if(response.code == 200){
            this.yourChoice.splice(0,1)
          }
        })

      },
      logout() {
        this.$store.commit(types.LOGOUT)
        let redirect = decodeURIComponent('/login');
        this.$router.push({
          path: redirect
        })
      },
      topicRealSelected() {
        return 'topicRealSelected' + this.classNo;
      },
      changeClassNo() {
        let data = {
          username: window.localStorage.getItem('token'),
          token: window.localStorage.getItem('username'),
          classNo: this.classNo
        }
        this.$store.commit(types.LOGIN, data)
      },
      getTopicFile(e) {
        this.topicFile = e.target.files[0];
        console.error(this.topicFile)
      },
      uploadTopicFile() {

        uploadTopic(this.topicFile).then(response => {
          this.$message({
            message: response.data,
            type: 'success'
          });
        })
      },
      getStdFile(e) {
        this.stdFile = e.target.files[0];
        console.error(this.stdFile)
      },
      uploadTopicFile() {

        uploadStd(this.stdFile).then(response => {
          this.$message({
            message: response.data,
            type: 'success'
          });
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
