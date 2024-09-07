<template>
  <!-- sign up -->
  <div id="signUpPage" class="bg-yellow">
    <div class="conatiner signUpPage vhContainer">
      <div class="side">
        <a href="#"
          ><img
            class="logoImg"
            src="https://raw.githubusercontent.com/hexschool/2022-web-layout-training/main/todolist/logo.png"
            alt=""
        /></a>
        <img
          class="d-m-n"
          src="https://raw.githubusercontent.com/hexschool/2022-web-layout-training/main/todolist/img.png"
          alt="workImg"
        />
      </div>
      <div>
        <form class="formControls" action="index.html">
          <h2 class="formControls_txt">註冊帳號</h2>
          <label class="formControls_label" for="email">Email</label>
          <input
            class="formControls_input"
            type="text"
            id="email"
            name="email"
            placeholder="請輸入 email"
            required
            v-model="signupField.email"
          />
          <label class="formControls_label" for="name">您的暱稱</label>
          <input
            class="formControls_input"
            type="text"
            name="name"
            id="name"
            placeholder="請輸入您的暱稱"
            v-model="signupField.nickname"
          />
          <label class="formControls_label" for="pwd">密碼</label>
          <input
            class="formControls_input"
            type="password"
            name="pwd"
            id="pwd"
            placeholder="請輸入密碼"
            required
            v-model="signupField.password"
          />
          <label class="formControls_label" for="pwd">再次輸入密碼</label>
          <input
            class="formControls_input"
            type="password"
            name="pwd"
            id="pwd"
            placeholder="請再次輸入密碼"
            required
            v-model="signupField.password2"
          />
          <input class="formControls_btnSubmit" type="button" @click="signup" value="註冊帳號" />
          <RouterLink to="/" class="formControls_btnLink">登入</RouterLink>
        </form>
      </div>
    </div>
  </div>
</template>
<script setup>
import axios from 'axios'
import Swal from 'sweetalert2'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
const api = 'https://todolist-api.hexschool.io'

const signupField = ref({
  email: '',
  password: '',
  password2: '',
  nickname: ''
})
const signupRes = ref('')
const router = useRouter()
const messageSignUp = ref('')

const signup = async () => {
  if (
    signupField.value.email != '' &&
    signupField.value.nickname != '' &&
    signupField.value.password != signupField.value.password2
  ) {
    messageSignUp.value = '註冊失敗(´･Д･)」'
    Swal.fire({
      icon: 'error',
      title: messageSignUp.value,
      text: '密碼輸入不一致'
    })
  } else {
    try {
      const res = await axios.post(`${api}/users/sign_up`, signupField.value)
      signupRes.value = res.data.uid
      messageSignUp.value = '註冊成功(｡･∀･)ﾉﾞ'
      if (res.status == 201) {
        Swal.fire({
          icon: 'success',
          title: messageSignUp.value,
          showConfirmButton: false,
          timer: 1500
        })
        router.push('/')
      }
    } catch (error) {
      console.log(error)
      if (error.response.data.message == '用戶已存在') {
        messageSignUp.value = '註冊失敗(´･Д･)」'
        Swal.fire({
          icon: 'error',
          title: messageSignUp.value,
          text: error.response.data.message
        })
      } else {
        messageSignUp.value = '註冊失敗(´･Д･)」'
        Swal.fire({
          icon: 'error',
          title: messageSignUp.value,
          text: error.response.data.message.join(' / ')
        })
      }
    }
  }
}
</script>
