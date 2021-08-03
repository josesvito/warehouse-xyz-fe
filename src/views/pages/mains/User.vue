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
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, i) in filtered_users" :key="i" :style="{'color' : !user.is_active ? 'red' : ''}">
            <td>{{ user.username }}</td>
            <td>
              <input v-if="$store.getters.getUserData.id != user.id" type="text" class="form-control" v-model="edited_users[edited_users.findIndex(el => el.username == user.username)].name">
              <template v-else>
                {{ user.name }}
              </template>
            </td>
            <td>
              <input v-if="$store.getters.getUserData.id != user.id" type="text" class="form-control" v-model="edited_users[edited_users.findIndex(el => el.username == user.username)].id_npwp">
              <template v-else>
                {{ user.id_npwp || '-' }}
              </template>
            </td>
            <td>{{ user.role }}</td>
            <td class="text-gold">
              <template v-if="$store.getters.getUserData.role_id == 1 && user.id != $store.getters.getUserData.id">
                <span class="fa fa-check proc-action position-relative px-1" @click="applyChange(user)">
                  <div class="panel bg-white border border-secondary rounded position-absolute p-1">Apply Change</div>
                </span>
                <span class="fa fa-undo proc-action position-relative px-1" @click="revertChange(user)">
                  <div class="panel bg-white border border-secondary rounded position-absolute p-1">Revert Change</div>
                </span>
                <span class="fa fa-hammer proc-action position-relative px-1" @click="toggleActivation(user)">
                  <div class="panel bg-white border border-secondary rounded position-absolute p-1">Change Activation</div>
                </span>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import axios from "axios";

export default {
  name: 'UserList',
  data() {
    return {
      users: [],
      filtered_users: [],
      edited_users: [],
      search: null
    }
  },
  mounted() {
    this.getUsers()
  },
  methods: {
    compareObj(obj1, obj2) {
      const keys = Object.keys(obj1)
      for(let i = 0; i < keys.length; i++) {
        if(obj1[keys[i]] != obj2[keys[i]])
          return false
      }
      return true
    },
    applyChange(user) {
      const editedUser = this.edited_users[this.edited_users.findIndex(el => el.username == user.username)]
      if (this.compareObj(editedUser, user))
        this.$bvToast.toast('No value changed', {
          variant: 'danger',
          solid: true,
          noCloseButton: true,
        })
      else
        axios.patch(process.env.VUE_APP_API_URL + 'users/profile/' + user.id, editedUser, {
          headers: {
            token: this.$store.getters.getToken
          }
        })
        .then(res => {
          if(res.data.status == 1) {
            this.$bvToast.toast('User data updated', {
              variant: 'success',
              solid: true,
              noCloseButton: true,
            })
            this.getUsers()
          }
        })
    },
    revertChange(user) {
      Object.assign(this.edited_users[this.edited_users.findIndex(el => el.username == user.username)], JSON.parse(JSON.stringify(user)))
    },
    toggleActivation(user) {
      axios.put(process.env.VUE_APP_API_URL + 'users/profile/' + user.id, null, {
        headers: {
          token: this.$store.getters.getToken
        }
      })
      .then(res => {
        if(res.data.status == 1) {
          this.$bvToast.toast(res.data.values, {
            variant: 'success',
            solid: true,
            noCloseButton: true,
          })
          this.getUsers()
        }
      })
    },
    getUsers() {
      axios.get(process.env.VUE_APP_API_URL + 'users/list', {headers: {
        token: this.$store.getters.getToken
      }})
      .then(res => {
        const d = res.data.values
        this.users = JSON.parse(JSON.stringify(d))
        this.filtered_users = JSON.parse(JSON.stringify(d))
        this.edited_users = JSON.parse(JSON.stringify(d))
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