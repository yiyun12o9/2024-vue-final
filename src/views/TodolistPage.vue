<template>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
  />
  <!-- ToDo List -->
  <div id="todoListPage" class="bg-half">
    <nav>
      <h1><a href="#" @click.prevent="">ONLINE TODO LIST</a></h1>
      <ul>
        <li class="todo_sm">
          <a href="#" @click.prevent="">
            <span>{{ user.nickname }}的代辦</span>
          </a>
        </li>
        <li><RouterLink to="" class="formControls_btnLink" @click="signOut">登出</RouterLink></li>
      </ul>
    </nav>
    <div class="conatiner todoListPage vhContainer">
      <div class="todoList_Content">
        <div class="inputBox">
          <input type="text" placeholder="請輸入待辦事項" v-model="newTodo" />
          <RouterLink to="#" class="formControls_btnLink" @click="addTodo">
            <i class="fa fa-plus"></i>
          </RouterLink>
        </div>
        <div class="todoList_list">
          <ul class="todoList_tab">
            <li>
              <a
                href="#"
                :class="{ active: activeTab === 'all' }"
                @click.prevent="setActiveTab('all')"
                >全部
              </a>
            </li>
            <li>
              <a
                href="#"
                :class="{ active: activeTab === 'notyet' }"
                @click.prevent="setActiveTab('notyet')"
                >待完成
              </a>
            </li>
            <li>
              <a
                href="#"
                :class="{ active: activeTab === 'completed' }"
                @click.prevent="setActiveTab('completed')"
                >已完成
              </a>
            </li>
          </ul>
          <div class="todoList_items">
            <ul class="todoList_item">
              <li v-if="filteredTodos.length" v-for="(todo, index) in filteredTodos" :key="index">
                <label class="todoList_label">
                  <input
                    class="todoList_input"
                    type="checkbox"
                    value="true"
                    :checked="todo.status"
                    @change="toggleStatus(todo.id)"
                  />
                  <span v-if="!isEditing[todo.id]" :class="['todo', { complete: todo.status }]">
                    {{ todo.content }}
                  </span>
                  <input
                    class="editinput"
                    v-if="isEditing[todo.id]"
                    type="text"
                    v-model="todoEdit[todo.id]"
                    placeholder="請輸入待辦事項(勿空白)"
                  />
                </label>
                <a href="#">
                  <i
                    v-if="!isEditing[todo.id]"
                    class="fa fa-pencil-square-o fa-2x"
                    @click.prevent="startEditing(todo.id, todo.content)"
                  ></i>
                  <i
                    v-if="isEditing[todo.id]"
                    class="fa fa-check fa-2x"
                    @click.prevent="confirmEdit(todo.id)"
                  ></i>
                </a>
                <a href="#">
                  <i
                    v-if="!isEditing[todo.id]"
                    class="fa fa-trash fa-2x"
                    @click.prevent="deleteTodo(todo.id)"
                  ></i>
                  <i
                    v-if="isEditing[todo.id]"
                    class="fa fa-times fa-2x"
                    @click.prevent="cancelEdit(todo.id)"
                  ></i>
                </a>
              </li>
              <li v-else class="todoList_label">目前尚無待辦事項</li>
            </ul>
            <div class="todoList_statistics">
              <p>{{ notyetSum }} 個待完成項目</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'
import Swal from 'sweetalert2'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const api = 'https://todolist-api.hexschool.io'

const router = useRouter()
const todos = ref([])
const newTodo = ref('')
const todoEdit = ref({})
const token = ref('')
const user = ref({
  uid: '',
  nickname: ''
})

//讀取token
onMounted(async () => {
  token.value = document.cookie.replace(
    /(?:(?:^|.*;\s*)customTodoToken\s*=\s*([^;]*).*$)|^.*$/,
    '$1'
  )

  // 驗證
  if (!token.value) {
    Swal.fire({
      icon: 'error',
      title: '沒token(´･Д･)」'
    })
    router.push('/')
  }

  try {
    const res = await axios.get(`${api}/users/checkout`, {
      headers: {
        Authorization: token.value
      }
    })
    user.value = res.data
    getTodos()
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: '驗證失效(´･Д･)」'
    })
    router.push('/')
  }
})

// TodoList
const getTodos = async () => {
  try {
    const res = await axios.get(`${api}/todos`, {
      headers: {
        Authorization: token.value
      }
    })
    todos.value = res.data.data
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: '取得TodoList失敗(´･Д･)」'
    })
  }
}

const addTodo = async () => {
  if (!newTodo.value) {
    Swal.fire({
      icon: 'error',
      title: '待辦事項不可空白(´･Д･)」'
    })
    return
  }
  const todo = {
    content: newTodo.value
  }
  await axios.post(`${api}/todos`, todo, {
    headers: {
      Authorization: token.value
    }
  })
  newTodo.value = ''
  getTodos()
}

const deleteTodo = async (id) => {
  await axios.delete(`${api}/todos/${id}`, {
    headers: {
      Authorization: token.value
    }
  })
  getTodos()
}

const isEditing = ref({})
const originalContent = ref({})

const startEditing = (id, content) => {
  isEditing.value = { ...isEditing.value, [id]: true }
  originalContent.value = { ...originalContent.value, [id]: content }
  todoEdit.value = { ...todoEdit.value, [id]: content }
}

const confirmEdit = async (id) => {
  const updatedContent = todoEdit.value[id]
  if (updatedContent !== originalContent.value[id]) {
    await updateTodo(id, updatedContent)
  }
  isEditing.value = { ...isEditing.value, [id]: false }
}

const updateTodo = async (id, content) => {
  const todo = todos.value.find((todo) => todo.id === id)
  todo.content = content
  await axios.put(`${api}/todos/${id}`, todo, {
    headers: {
      Authorization: token.value
    }
  })
  getTodos()
  todoEdit.value = { ...todoEdit.value, [id]: '' }
}

const cancelEdit = (id) => {
  isEditing.value = { ...isEditing.value, [id]: false }
  todoEdit.value = { ...todoEdit.value, [id]: originalContent.value[id] }
}

const toggleStatus = async (id) => {
  await axios.patch(
    `${api}/todos/${id}/toggle`,
    {},
    {
      headers: {
        Authorization: token.value
      }
    }
  )
  getTodos()
}

const setActiveTab = (tab) => {
  activeTab.value = tab
}
const activeTab = ref('all')
const filteredTodos = computed(() => {
  if (activeTab.value === 'all') {
    return todos.value
  } else if (activeTab.value === 'notyet') {
    return todos.value.filter((todo) => !todo.status)
  } else if (activeTab.value === 'completed') {
    return todos.value.filter((todo) => todo.status)
  } else {
    return todos.value
  }
})

// 待完成總數
const notyetSum = computed(() => {
  return todos.value.filter((todo) => !todo.status).length
})

// 登出
const messageSignOut = ref('')
const signOut = async () => {
  try {
    await axios.post(
      `${api}/users/sign_out`,
      {},
      {
        headers: {
          Authorization: token.value
        }
      }
    )
    messageSignOut.value = '登出成功(｡･∀･)ﾉﾞ'
    Swal.fire({
      icon: 'success',
      title: messageSignOut.value,
      showConfirmButton: false,
      timer: 1500
    })
    router.push('/')
  } catch (error) {
    messageSignOut.value = '登出失敗(´･Д･)」'
    Swal.fire({
      icon: 'error',
      title: messageSignOut.value,
      text: error.response.data.message
    })
  }
}
</script>
<style scoped>
.editinput {
  font-size: 16px;
  width: 85%;
  padding: 4px;
}
</style>
