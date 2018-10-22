<template>
  <div>
    <el-header style="text-align: right; font-size: 18px">
      欢迎 <span style="color: royalblue; margin-right: 10px">{{username}}</span>
      <el-button @click="logout" type="danger" size="small">退出登录</el-button>
    </el-header>
    <el-main>
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
          prop="topicRealSelected"
          label="已选人数"
          width="100">
        </el-table-column>
        <el-table-column
          align="center"
          fixed="right"
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button v-if="scope.row.topicType != '习题'" @click="handleSelect(scope.row)" type="primary" size="small">选择</el-button>
          </template>
        </el-table-column>
      </el-table>

      <p class="table-title">
        已选题目
      </p>
      <el-table
        :data="yourChoice"
        stripe
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
  import {fetchList, select, cancel} from '@/api/topic'
  export default {
    name:'Home',
    data() {
      return {
        topicList: [],
        yourChoice:[],
        username: '',
        listLoading: false
      }
    },
    created() {
      this.username = this.$store.state.username
      this.getList()
    },
    methods:{
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
