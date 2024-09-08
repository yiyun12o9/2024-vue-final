<template>
  <!-- login_page -->
  <div id="loginPage" class="bg-yellow">
    <div class="conatiner loginPage vhContainer">
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
          <h2 class="formControls_txt">最實用的線上代辦事項服務</h2>
          <label class="formControls_label" for="email">Email</label>
          <input
            class="formControls_input"
            type="text"
            id="email"
            name="email"
            placeholder="請輸入 email"
            required
            v-model="signInField.email"
          />
          <label class="formControls_label" for="pwd">密碼</label>
          <input
            class="formControls_input"
            type="password"
            name="pwd"
            id="pwd"
            placeholder="請輸入密碼"
            required
            v-model="signInField.password"
          />
          <button class="formControls_btnSubmit" @click.prevent="signIn">登入</button>
          <RouterLink to="/SignupPage" class="formControls_btnLink">註冊帳號</RouterLink>
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

const signInField = ref({
  email: '',
  password: ''
})
const signInRes = ref('')
const router = useRouter()
const messageSignIn = ref('')
const nicknameSignIn = ref('')

const signIn = async () => {
  console.log(`${api}/users/sign_in`)
  try {
    const res = await axios.post(`${api}/users/sign_in`, signInField.value)
    signInRes.value = res.data.token
    nicknameSignIn.value = res.data.nickname
    document.cookie = `customTodoToken=${res.data.token};`
    messageSignIn.value = '登入成功(｡･∀･)ﾉﾞ'
    if (res.status == 200) {
      Swal.fire({
        icon: 'success',
        title: messageSignIn.value,
        showConfirmButton: false,
        timer: 1500
      })
      router.push('/TodolistPage')
    }
  } catch (error) {
    if (error.status == 400) {
      messageSignIn.value = '未正確填寫欄位(´･Д･)」'
      Swal.fire({
        icon: 'error',
        title: messageSignIn.value,
        text: error.response.data.message.join(' / ')
      })
    } else if (error.status == 401) {
      messageSignIn.value = '密碼輸入錯誤(´･Д･)」'
      Swal.fire({
        icon: 'error',
        title: messageSignIn.value
      })
    } else if (error.status == 404) {
      messageSignIn.value = '用戶不存在(´･Д･)」'
      Swal.fire({
        icon: 'error',
        title: messageSignIn.value
      })
    } else {
      messageSignIn.value = '登入失敗(´･Д･)」'
      Swal.fire({
        icon: 'error',
        title: messageSignIn.value,
        text: error.response.data.message
      })
    }
  }
}

const TodoToken = document.cookie
  .split('; ')
  .find((row) => row.startsWith('hexschoolTodo='))
  ?.split('=')[1]

onMounted(() => {
  if (TodoToken) {
    signInRes.value = TodoToken
  }
})
</script>
