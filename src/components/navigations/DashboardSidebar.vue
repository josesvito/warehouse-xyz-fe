<template>
  <section class="sidebar">
    <div class="sidebar-img">
      <b-img
        src="https://startbootstrap.github.io/startbootstrap-creative/assets/img/bg-masthead.jpg"
        class="w-100"
      />
      <select>
        <option value="0" selected disabled>{{ $store.getters.getUserData.name }}</option>
      </select>
      <span></span>
    </div>
    <div class="container text-left">
      <router-link exact-path to="/" v-if="$store.getters.getUserData.role_id == 1"> Report </router-link>
      <router-link exact-path to="/item"> Items </router-link>
      <router-link exact-path to="/procurement"> Procurement </router-link>
      <router-link exact-path to="/purchases" v-if="$store.getters.getUserData.role_id == 3"> Outbond Flow </router-link>
      <router-link exact-path to="/returned" v-if="$store.getters.getUserData.role_id != 2"> Returned Items </router-link>
      <router-link exact-path to="/user" v-if="$store.getters.getUserData.role_id == 1"> User List </router-link>
      <a href="#" class="parent" @click="toggleMenu"> Profile </a>
      <div class="nav-child">
        <router-link exact-path
          :to="menu.to"
          v-for="menu in menuNavigations"
          :key="menu.to"
        >
          {{ menu.text }}
        </router-link>
        <a href="#" @click="logout()"> Logout </a>
      </div>
    </div>
  </section>
</template>
<script>
import { userService } from "@/_services";

export default {
  data() {
    return {
      menuNavigations: [
        { to: "/profile", text: "My Detail" }
      ],
    };
  },
  methods: {
    toggleMenu(event) {
      event.target.classList.toggle("active")
    },
    logout() {
      userService.logout();
      setTimeout(() => this.$router.go(), 1000);
    },
  },
};
</script>
<style></style>