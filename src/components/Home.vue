<template>
  <div>
    <el-header style="text-align: right; font-size: 18px">
        欢迎:
      <span style="color: deepskyblue; margin-right: 10px">{{classNo + '班 '}}</span>
        <span style="color: royalblue; margin-right: 10px">{{studentName}}</span>
      <el-button @click="logout" type="danger" size="small">退出登录</el-button>
      <!--<br/>-->
      <!--<span style="color: royalblue; margin-right: 10px">{{username}}</span>-->
    </el-header>
    <el-main>
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
          :prop="topicRealSelected()"
          label="已选人数"
          width="100">
        </el-table-column>
        <el-table-column
          align="center"
          fixed="right"
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button :loading="selectLoading" v-if="scope.row.topicType != '习题' " type="primary"
                       @click="handleSelect(scope.row)"  size="small">选择</el-button>
          </template>
        </el-table-column>
      </el-table>

      <p class="table-title">
        已选题目
      </p>
      <el-table
        :data="yourChoice"
        v-loading="listLoading2"
        stripe
        header-align="center"
        style="width: 100%;">
        <el-table-column
          label="序号"
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
          fixed="right"
          label="操作"
          width="300">
          <template slot-scope="scope">
            <el-button  @click="handleCancel(scope.row)" type="danger" size="small">取消</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>

  </div>
</template>

<script>
  import * as types from '@/store/types'
  import {fetchList, select, cancel, fetchList2} from '@/api/topic'
  // import { validateURL } from '@/utils/validate'
  export default {
    name:'Home',
    data() {
      return {
        topicList: [],
        yourChoice:[],
        studentName: '',
        username: '',
        listLoading: false,
        listLoading2: false,
        selectLoading: false,
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
      this.studentName = this.$store.state.studentName
      this.classNo = this.$store.state.classNo
      this.username = this.$store.state.username
      this.getList()
      this.getyourChoiceList()
    },
    methods:{
      myRefresh() {
        this.getList()
        this.getyourChoiceList(this.username)
      },
      getList() {
        this.listLoading = true
        fetchList().then(response => {
          this.topicList = response.data.list
        })
        this.listLoading = false
      },
      getyourChoiceList() {
        this.listLoading2 = true
        fetchList2(this.username).then(response => {
          this.yourChoice = response.data.list
        })
        this.listLoading2 = false
      },
      handleSelect(row) {
        this.selectLoading = true
        select(this.username,row.topicId).then(response => {

          if(response.data.code == 200){
            this.$message({
              message: '选题成功',
              type: 'success'
            });
            this.myRefresh()
          }else if(response.data.code == 401) {
            this.$message({
              message: '不能重复选择',
              type: 'error'
            });
          }else if(response.data.code == 402) {
            this.$message({
              message: '此题已选满',
              type: 'error'
            });
          }
        })
        this.selectLoading = false

      },
      handleCancel(row) {
        cancel(this.username,row.topicId).then(response => {

          if(response.data.code == 200){
            this.$message({
              message: '取消成功',
              type: 'success'
            });
            this.myRefresh()
          }else {
            this.$message({
              message: '取消失败',
              type: 'error'
            });
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

      // changeClassNo() {
      //   let data = {
      //     username: window.localStorage.getItem('token'),
      //     token: window.localStorage.getItem('username'),
      //     classNo: this.classNo
      //   }
      //   this.$store.commit(types.LOGIN, data)
      // },
      getType() {
        if(this.yourChoice.length == 0) {
          return 'primary'
        }else {
          return 'info'
        }
      },
      validateURL(textval) {
        const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
        return urlregex.test(textval)
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
