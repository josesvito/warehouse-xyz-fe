<template>
  <div class="container">
    <h2>User List</h2>
    <div class="row mb-2">
      <div class="ml-auto col-md-3">
        <div class="input-group">
          <input type="text" v-model="search" class="form-control" placeholder="Search...">
          <div class="input-group-text bg-white">
            <span class="fa fa-search"></span>
          </div>
        </div>
      </div>
    </div>
    <div class="table-responsive">
      <table class="table table-striped table-hover">
        <thead class="thead-dark">
          <tr>
            <th>Username</th>
            <th>Name</th>
            <th>NPWP</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, i) in filtered_users" :key="i">
            <td>{{ user.username }}</td>
            <td>{{ user.name }}</td>
            <td>{{ user.id_npwp || '-' }}</td>
            <td>{{ user.role }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import axios from "axios";

export default {
  data() {
    return {
      users: [],
      filtered_users: [],
      search: null
    }
  },
  mounted() {
    this.getUsers()
  },
  methods: {
    getUsers() {
      axios.get(process.env.VUE_APP_API_URL + 'users/list', {headers: {
        token: this.$store.getters.getToken
      }})
      .then(res => {
        this.users = res.data.values
        this.filtered_users = this.users 
      })
    }
  },
  watch: {
    search(newValue) {
      this.filtered_users = this.users.filter(el => {
        newValue = newValue.toLowerCase()
        const testUsername = new RegExp(newValue).test(el.username.toLowerCase())
        const testName = new RegExp(newValue).test(el.name.toLowerCase())
        if(testUsername || testName) return el
      })
    }
  }
}
</script>