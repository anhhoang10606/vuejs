<script setup>
import { ref } from "vue";

const name = ref("Nguyễn Hoàng Anh");
const title = ref("Sinh viên CNTT");
const profile = ref(
  "Sinh viên năm 2 ngành Công nghệ Thông tin, có đam mê về phát triển web, thích tìm hiểu về UI/UX và các công nghệ mới."
);
const email = ref("anhnhpk04199@gmail.com");
const phone = ref("0358221075");
const school = ref("Cao đẳng FPT Polytechnic");
const skills = ref([
  "HTML, CSS, JavaScript",
  "Vue.js, React",
  "Node.js",
  "MySQL",
  "Git/GitHub",
]);

const editingField = ref("");
const tempValue = ref("");

function startEdit(field, currentValue) {
  editingField.value = field;
  tempValue.value = currentValue;
}

function saveEdit(field) {
  if (field === "name") name.value = tempValue.value;
  if (field === "title") title.value = tempValue.value;
  if (field === "profile") profile.value = tempValue.value;
  if (field === "email") email.value = tempValue.value;
  if (field === "phone") phone.value = tempValue.value;

  editingField.value = "";
}

function cancelEdit() {
  editingField.value = "";
}
</script>

<template>
  <div class="container my-4">
    <div class="row">
      <div class="col-md-4 bg-light p-3">
        <div class="text-center">
          <img
            src=""
            alt="avatar"
            class="rounded-circle mb-3"
          />

          <div>
            <input
              v-if="editingField === 'name'"
              v-model="tempValue"
              class="form-control text-center"
              @keyup.enter="saveEdit('name')"
              @keyup.esc="cancelEdit"
              @blur="saveEdit('name')"
              autofocus
            />
            <h3
              v-else
              @click="startEdit('name', name)"
              class="text-primary"
              style="cursor:pointer;"
            >
              {{ name }}
            </h3>
          </div>

          <div>
            <input
              v-if="editingField === 'title'"
              v-model="tempValue"
              class="form-control text-center"
              @keyup.enter="saveEdit('title')"
              @keyup.esc="cancelEdit"
              @blur="saveEdit('title')"
              autofocus
            />
            <p
              v-else
              @click="startEdit('title', title)"
              class="text-muted"
              style="cursor:pointer; font-style:italic"
            >
              {{ title }}
            </p>
          </div>
        </div>

        <hr />
        <h5>Liên hệ</h5>

        <div>
          <input
            v-if="editingField === 'phone'"
            v-model="tempValue"
            class="form-control"
            @keyup.enter="saveEdit('phone')"
            @keyup.esc="cancelEdit"
            @blur="saveEdit('phone')"
            autofocus
          />
          <p v-else @click="startEdit('phone', phone)" style="cursor:pointer;">
            {{ phone }}
          </p>
        </div>

        <div>
          <input
            v-if="editingField === 'email'"
            v-model="tempValue"
            class="form-control"
            @keyup.enter="saveEdit('email')"
            @keyup.esc="cancelEdit"
            @blur="saveEdit('email')"
            autofocus
          />
          <p v-else @click="startEdit('email', email)" style="cursor:pointer;">
            {{ email }}
          </p>
        </div>

        <p>{{ school }}</p>

        <hr />
        <h5>Kỹ năng</h5>
        <ul>
          <li v-for="(s, i) in skills" :key="i">{{ s }}</li>
        </ul>
      </div>
      <div class="col-md-8 p-3">
  <h4>Giới thiệu</h4>
  <div>
    <textarea
      v-if="editingField === 'profile'"
      v-model="tempValue"
      class="form-control"
      rows="3"
      @keyup.enter="saveEdit('profile')"
      @keyup.esc="cancelEdit"
      @blur="saveEdit('profile')"
      autofocus
    ></textarea>
    <p v-else @click="startEdit('profile', profile)" style="cursor:pointer;">
      {{ profile }}
    </p>
  </div>

  <h4>Kinh nghiệm học tập</h4>
  <ul>
    <li><b>2022 - nay:</b> Học tập tại {{ school }}</li>
    <li><b>2020 - 2022:</b> Tham gia CLB Lập trình web</li>
  </ul>

  <h4>Dự án</h4>
  <ul>
    <li>Website quản lý cửa hàng (Vue + Node.js)</li>
    <li>Ứng dụng học tiếng Anh (React Native)</li>
  </ul>

  <h4>Kinh nghiệm làm việc</h4>
  <ul>
    <li><b>2024:</b> Thực tập tại Công ty ABC - Hỗ trợ phát triển website bán hàng</li>
    <li><b>2023:</b> Freelancer - Thiết kế giao diện web bằng Figma và triển khai với Vue.js</li>
  </ul>

  <h4>Chứng chỉ</h4>
  <ul>
    <li>Chứng chỉ Web Developer cơ bản - FPT Polytechnic</li>
    <li>Chứng chỉ tiếng Anh TOEIC 650</li>
  </ul>

  <h4>Sở thích</h4>
  <p>Đọc sách về công nghệ, chơi thể thao, học hỏi framework mới, thiết kế UI/UX.</p>

  <h4>Mục tiêu nghề nghiệp</h4>
  <p>
    Trở thành Frontend Developer chuyên nghiệp, có thể đảm nhận cả Fullstack.  
    Mong muốn phát triển kỹ năng về UI/UX và tham gia các dự án thực tế để nâng cao kinh nghiệm.
  </p>
</div>

    </div>
  </div>
</template>

<style>
body {
  background-color: #f8f9fa;
}
</style>
