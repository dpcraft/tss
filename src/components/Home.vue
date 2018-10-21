<template>
  <div>
    <el-header style="text-align: right; font-size: 18px">
      欢迎 <span style="color: royalblue; margin-right: 10px">{{username}}</span>
      <el-button @click="logout" type="danger" size="small">退出登录</el-button>
    </el-header>
    <el-main>
      <p class="table-title">
        论文类、配置类、编程类题目列表
      </p>
      <el-table
        :data="tableData"
        stripe
        style="width: 100%; text-align: center">
        <el-table-column
          label="序号"
          align="center"
          width="100">
          <template slot-scope="scope">
            {{scope.$index+1}}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="date"
          label="题目"
          width="180">
        </el-table-column>
        <el-table-column
          align="center"
          prop="name"
          label="要求"
          width="180">
        </el-table-column>
        <el-table-column
          align="center"
          prop="address"
          label="详细">
        </el-table-column>
        <el-table-column
          align="center"
          fixed="right"
          label="操作"
          width="300">
          <template slot-scope="scope">
            <el-button @click="handleSubscribe(scope.row)" type="primary" size="small">选择</el-button>
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
          width="100">
          <template slot-scope="scope">
            {{scope.$index+1}}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="date"
          label="日期"
          width="180">
        </el-table-column>
        <el-table-column
          align="center"
          prop="name"
          label="姓名"
          width="180">
        </el-table-column>
        <el-table-column
          align="center"
          prop="address"
          label="地址">
        </el-table-column>
        <el-table-column
          align="center"
          fixed="right"
          label="操作"
          width="300">
          <template slot-scope="scope">
            <el-button @click="handleCancel(scope.row)" type="danger" size="small">取消</el-button>
          </template>
        </el-table-column>
      </el-table>

      <p class="table-title">
        习题类题目列表（8选4）
      </p>
      <el-table
        :data="tableData"
        stripe
        style="width: 100%; text-align: center">
        <el-table-column
          label="序号"
          align="center"
          width="100">
          <template slot-scope="scope">
            {{scope.$index+1}}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="date"
          label="题目"
          width="180">
        </el-table-column>
        <el-table-column
          align="center"
          prop="name"
          label="要求"
          width="180">
        </el-table-column>
        <el-table-column
          align="center"
          prop="address"
          label="详细">
        </el-table-column>
      </el-table>
    </el-main>

  </div>
</template>

<script>
  import * as types from '@/store/types'
  export default {
    name:'Home',
    data() {
      return {
        tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }],
        yourChoice:[],
        username: ''
      }
    },
    created() {
      this.username = this.$store.state.username
    },
    methods:{
      handleSubscribe(row) {
        row.state = 0
        this.yourChoice.push(row)
      },
      handleCancel(row) {
        row.state = 1
        this.yourChoice.splice(0,1)
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
