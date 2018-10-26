<template>
  <div class="login-container">
    <div class="title">通信网络系统基础选题系统</div>
    <el-row type="flex" class="row-bg">
      <el-col :span="8"></el-col>
      <el-col :span="6">
        <el-form  class="login-form" ref="loginForm" :model="loginForm" label-width="80px" :rules="loginRules" size="medium">
        <!--<el-form-item label="班级" prop="classNo">-->
          <!--<el-select v-model="loginForm.classNo" placeholder="请选择上课班级">-->
            <!--<el-option label="一班" value="1"></el-option>-->
            <!--<el-option label="二班" value="2"></el-option>-->
            <!--<el-option label="三班" value="3"></el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <el-form-item label="学号" prop="username">
          <el-input v-model="loginForm.username"
                    type="text"
                    auto-complete="on"/>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="loginForm.password"
                    :type="passwordType"
                    auto-complete="on"
                    @keyup.enter.native="handleLogin"/>
        </el-form-item>
        <!--<span class="show-pwd" @click="showPwd">-->
          <!--<svg-icon icon-class="eye" />-->
        <!--</span>-->

          <el-col :span="6"/>
            <el-col :span="12">
            <el-button  type="info" style="margin-bottom:30px;" @click.native.prevent="dialogFormVisible = true">修改密码</el-button>
          </el-col>
          <el-col :span="12">
            <el-button :loading="loading" type="primary" style="margin-bottom:30px;" @click.native.prevent="handleLogin">登录</el-button>
          </el-col>
          <el-col :span="6"/>
      </el-form></el-col>
      <el-col :span="4"><div class="grid-content bg-purple"></div></el-col>
    </el-row>

    <el-dialog title="修改密码" :visible.sync="dialogFormVisible" width="40%">
      <el-form :model="changePwdForm" :rules="changePwdRules" ref="changePwdForm">
        <el-form-item label="学号" :label-width="formLabelWidth" prop="username">
          <el-input v-model="changePwdForm.username" autocomplete="off" type="text"></el-input>
        </el-form-item>
        <el-form-item label="原密码" :label-width="formLabelWidth"prop="oldPwd">
          <el-input v-model="changePwdForm.oldPwd" autocomplete="off" :type="passwordType"></el-input>
        </el-form-item>
        <el-form-item label="新密码" :label-width="formLabelWidth" prop="newPwd">
          <el-input v-model="changePwdForm.newPwd" autocomplete="off" :type="passwordType"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" :label-width="formLabelWidth" prop="reNewPwd">
          <el-input v-model="changePwdForm.reNewPwd" autocomplete="off" :type="passwordType"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleChangePwd">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { isvalidUsername } from '@/utils/validate'
  import {loginByUsername, changePwd} from '@/api/login'
  import * as types from '@/store/types'
  export default {
    name: 'Login',
    data() {
      const validateUsername = (rule, value, callback) => {
        if (!isvalidUsername(value)) {
          callback(new Error('请输入正确的学号'))
        } else {
          callback()
        }
      }
      const validateRePwd = (rule, value, callback) => {
        if(value === null || value === undefined){
          callback(new Error('请再次输入密码'))
        }else if (value != this.changePwdForm.newPwd) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      }
      return {
        loginForm: {
          classNo: undefined,
          username: undefined,
          password: undefined
        },
        loginRules: {
          username: [{ required: true, trigger: 'blur', validator: validateUsername }],
          password: [{ required: true, trigger: 'blur', message: '密码不能为空' }],
          // classNo:[{required:true, trigger: 'blur', message: '请选择班级'}]
        },
        changePwdRules: {
          username: [{ required: true, trigger: 'blur', validator: validateUsername }],
          oldPwd: [{ required: true, trigger: 'blur', message: '原密码不能为空' }],
          newPwd:[{required:true, trigger: 'blur', message: '新密码不能为空'}],
          reNewPwd:[{required:true, trigger: 'blur', validator: validateRePwd }]
        },
        passwordType: 'password',
        loading: false,
        dialogFormVisible: false,
        redirect: undefined,
        changePwdForm: {
          username:'',
          oldPwd: '',
          newPwd: '',
          reNewPwd: '',
        },
        formLabelWidth: '100px'
      };
    },

    watch: {
      $route: {
        handler: function(route) {
          this.redirect = route.query && route.query.redirect
        },
        immediate: true
      }

    },
    created() {
      // window.addEventListener('hashchange', this.afterQRScan)
    },
    destroyed() {
      // window.removeEventListener('hashchange', this.afterQRScan)
    },
    methods: {
      showPwd() {
        if (this.passwordType === 'password') {
          this.passwordType = ''
        } else {
          this.passwordType = 'password'
        }
      },
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true
            loginByUsername(this.loginForm.username,this.loginForm.password).then(response => {
              if(response.data.code == 200){
                let data = {
                  username: response.data.studentId,
                  token: response.data.studentId,
                  classNo: response.data.classId,
                  studentName: response.data.studentName
                }
                console.error('data',data)
                this.$store.commit(types.LOGIN, data)
                let redirect = decodeURIComponent(this.$route.query.redirect || '/');
                console.error('stdredirect',redirect)
                this.$router.push({
                  path: redirect
                })
              }else if(response.data.code == 300){
                this.$alert('请修改密码', '登录失败', {
                  confirmButtonText: '确定',
                });
              }else if(response.data.code == 400) {
                this.$alert('学号或密码不正确', '登录失败', {
                  confirmButtonText: '确定',
                });
              }

            })
              this.loading = false
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      handleChangePwd() {
        this.$refs.changePwdForm.validate(valid => {
          if (valid) {
            changePwd(this.changePwdForm.username, this.changePwdForm.newPwd).then(response => {
              if(response.data.code == 200 || response.data.code == 300){
                this.$alert('请使用新密码登录', '密码修改成功', {
                  confirmButtonText: '确定',
                });
              }else if(response.data.code == 400) {
                this.$alert('请重新操作', '密码修改失败', {
                  confirmButtonText: '确定',
                });
              }

            })
            this.dialogFormVisible = false
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
  .title{
    text-align: center;
    font-size: 40px;
    color: grey;
    margin-bottom: 20px;
  }
</style>

