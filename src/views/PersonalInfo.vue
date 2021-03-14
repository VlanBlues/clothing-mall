<template>
  <div class="personal-info">
    <div class="profile-box-head">
      <span class="dot"></span>
      <span style="vertical-align:middle;">用户信息</span>
      <div class="profile-box-head-btn">
        <div v-if="!isEdit">
          <el-button type="primary" round @click="isEdit = !isEdit">编辑</el-button>
        </div>
        <div v-else>
          <el-button type="primary" round @click="handelConfirm">保存</el-button>
          <el-button round @click="cancelEdit">取消</el-button>
        </div>
      </div>
    </div>
    <el-row>
      <el-col :span="7">
        123132
      </el-col>
      <el-col :span="17" class="user-info" :class="{'input-border':!isEdit}">
        <el-form ref="elForm" size="medium" label-width="70px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="getUser.username" placeholder="请输入用户名"
                      prefix-icon='el-icon-notebook-2' ></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="getUser.nikename" placeholder="姓名"  prefix-icon='el-icon-user'
            ></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="gender">
            <el-radio-group v-model="getUser.gender" size="medium" style="margin-left: 10px">
              <el-radio v-for="(item, index) in genderOptions" :key="index" :label="item.value"
                        :disabled="true">{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="电话" prop="mobile">
            <el-input v-model="getUser.mobile" placeholder="请输入电话"  prefix-icon='el-icon-phone'
            ></el-input>
          </el-form-item>
          <el-form-item label="生日" prop="birth">
            <el-date-picker style="width: 100%;" v-model="getUser.birth" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                            placeholder="请选择生日" ></el-date-picker>
          </el-form-item>
        </el-form>
        <el-button v-show="isEdit" class="chang-pass-btn" type="primary" @click="changePass">修改密码</el-button>
      </el-col>
    </el-row>

    <!--<el-dialog title="修改密码" :visible.sync="changePassVisible" width="30%">
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="密码" prop="originalPass">
          <el-input type="password" v-model="ruleForm.originalPass" placeholder="请输入密码" clearable show-password></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPass">
          <el-input type="password" v-model="ruleForm.confirmPass" placeholder="请输入确认密码" clearable show-password></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPass">
          <el-input v-model="ruleForm.newPass" placeholder="请输入新密码" clearable show-password
                    :style="{width: '100%'}"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>-->

  </div>
</template>
<script>
  import VueCropper from 'vue-cropperjs';
  import { mapGetters } from "vuex";
  export default {
    name: "PersonalInfo",
    data() {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm.confirmPass !== '') {
            this.$refs.ruleForm.validateField('confirmPass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.originalPass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        // defaultSrc: this.$store.state.userInfo.img,
        fileList: [],
        imgSrc: '',
        cropImg: '',
        dialogVisible: false,
        changePassVisible: false,
        isEdit: false,
        getUser: {
          username: '',
          nikename: undefined,
          password: undefined,
          gender: undefined,
          mobile: undefined,
          birthday: undefined,
        },
        genderOptions: [{
          "label": "男",
          "value": "男"
        }, {
          "label": "女",
          "value": "女"
        }],
        ruleForm: {
          originalPass: '',
          confirmPass: '',
          newPass: ''
        },
        rules: {
          originalPass: [
            { validator: validatePass, trigger: 'blur' }
          ],
          confirmPass: [
            { validator: validatePass2, trigger: 'blur' }
          ],
          newPass: [{
            required: true,
            message: '请输入新密码',
            trigger: 'blur'
          }],
        }
      }
    },
    computed:{
      ...mapGetters(["getUser"]),
      readerId(){
        return this.$store.state.userInfo.readerId
      }
    },
    components: {
      VueCropper
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$api.get('/reader/changePass',{
              readerId:this.$store.state.userInfo.readerId,
              oldPass:this.ruleForm.originalPass,
              newPass:this.ruleForm.newPass
            },res =>{
              if(res.data.code === 200){
                this.$message.success(res.data.data);
                this.changePassVisible = false;
                this.resetForm('ruleForm')
              }else {
                this.$message.error(res.data.data)
              }
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      changePass(){
        this.changePassVisible = true
      },
      cancelEdit(){
        this.isEdit = !this.isEdit;
        this.getReaderInfo()
      },
      handelConfirm() {
        console.log(this.getUser);
        this.$confirm(`确定修改个人信息?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$api.post('/reader/updateOrSave',this.getUser,
            res =>{
              if(res.data.code === 200){
                this.$message.success(`修改成功!`);
                this.isEdit = !this.isEdit
              }else {
                this.$message.error(`修改失败${res.data.data}`);
              }
              this.getData();
            });
        }).catch(() => {
        });
      },
      setImage(e) {
        const file = e.target.files[0];
        if (!file.type.includes('image/')) {
          return;
        }
        const reader = new FileReader();
        reader.onload = (event) => {
          this.dialogVisible = true;
          this.imgSrc = event.target.result;
          this.$refs.cropper && this.$refs.cropper.replace(event.target.result);
        };
        reader.readAsDataURL(file);

      },
      cropImage() {
        this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL();
      },
      cancelCrop() {
        this.dialogVisible = false;
        this.cropImg = this.defaultSrc;
      },
      finish() {
        this.dialogVisible = false;
        let canvas = this.$refs.cropper.getCroppedCanvas();
        canvas.toBlob((blob)=>{
          let param = new FormData();  // 创建form对象
          param.append('file', blob,"a.png");  // 通过append向form对象添加数据
          param.append('readerId', this.readerId.toString());
          this.$api.post("/reader/update/img",param, res => {
            if(res.data.code === 200){
              this.$message.success(res.data.data);
              this.getReaderInfo();
            }else {
              this.$message.error(res.data.data);
            }
          })
        });
      },
      // 将base64的图片转换为file文件
      convertBase64UrlToBlob(urlData) {
        let bytes = window.atob(urlData.split(',')[1]);//去掉url的头，并转换为byte
        //处理异常,将ascii码小于0的转换为大于0
        let ab = new ArrayBuffer(bytes.length);
        let ia = new Uint8Array(ab);
        for (var i = 0; i < bytes.length; i++) {
          ia[i] = bytes.charCodeAt(i);
        }
        return new Blob([ab], { type: 'image/jpeg' });
      },
      imageuploaded(res) {
        console.log(res)
      },
      handleError() {
        this.$notify.error({
          title: '上传失败',
          message: '图片上传接口上传失败，可更改为自己的服务器接口'
        });
      },
      getReaderInfo(){
        this.$api.post('/reader/getByReaderId',{
          readerId:this.readerId
        },res =>{
          if(res.data.code === 200){
            this.getUser = []
            this.getUser = res.data.data;
            this.$store.commit('updateUserInfo',res.data.data);
          }
        })
      }
    },
    created() {
      this.cropImg = this.defaultSrc;
    }
  }
</script>

<style>
.personal-info{
  background-color: #fcfcfc;
  width: 90%;
  margin: 20px auto 0;
  padding: 0 40px 20px !important;
}
.profile-box-head {
  height: 50px;
  border-bottom: 1px solid #E1E1E1;
  line-height: 50px;
  font-size: 18px;
  color:#333;
  overflow: hidden;
}
.dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  background-color: #409eff;
  margin-right: 10px;
  vertical-align: middle;
}
.profile-box-head-btn{
  float: right;
  display: flex
}
.el-row{
  margin-top: 40px;
}
.user-info {
  border-left: 1px dashed #E1E1E1;
}
.chang-pass-btn{
  margin-left: 20px;
}
.input-border input{
  border: none;
  pointer-events: none;
}
.crop-demo-btn {
  position: relative;
  width: 100px;
  height: 40px;
  line-height: 40px;
  padding: 0 20px;
  margin-left: 40px;
  margin-top: 10px;
  background-color: #409eff;
  color: #fff;
  font-size: 14px;
  border-radius: 4px;
  box-sizing: border-box;
}

.crop-input {
  position: absolute;
  width: 100px;
  height: 40px;
  left: 0;
  top: 0;
  opacity: 0;
  cursor: pointer;
}
</style>
