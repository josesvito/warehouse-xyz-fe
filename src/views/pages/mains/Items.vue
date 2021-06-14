<template>
  <div class="container">
    <h2>Item Page</h2>
    <div class="row" v-if="[1].includes($store.getters.getUserData.role_id)">
      <div class="col-md-7 mt-3">
        <form @submit.prevent="submitForm">
          <div class="row">
            <div class="col-md-7 mb-1">
              <input type="text" v-model="item_name" class="form-control" placeholder="Product Name" required>
            </div>
            <div class="col-md-7 mb-1">
              <select v-model="category_id" class="form-control" required>
                <option value="0" selected disabled>Select Item</option>
                <option v-for="(category, i) in categories" :key="i" :value="category.id">{{ category.name }}</option>
              </select>
            </div>
            <div class="col-md-7 mb-1">
              <input type="text" v-model="vendor" class="form-control" placeholder="Vendor Name">
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <button type="submit" class="btn btn-primary">SUBMIT</button>
            </div>
          </div>
        </form>
      </div>
      <div class="col-md-5 mt-3">
        <b-form @submit.prevent="submitCategory">
          <input type="text" v-model="category_name" class="form-control" placeholder="Category name" required>
          <button type="submit" class="btn btn-primary d-flex ml-auto">Create Category</button>
        </b-form>
      </div>
    </div>
    <div class="row my-2">
      <h2 class="col">Item list</h2>
      <div class="ml-auto col-auto">
        <div class="input-group">
            <input type="date" v-model="date" class="form-control">
        </div>
      </div>
    </div>
    <div class="table-responsive">
      <table class="table table-striped table-hover">
        <thead class="thead-dark">
          <tr>
            <th>Vendor</th>
            <th>Name</th>
            <th>Quantity</th>
            <th>Category</th>
            <th>Entry Date</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in items" :key="index">
            <td>{{ item.vendor }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.quantity }}</td>
            <td>{{ item.category.name }}</td>
            <td>{{ formatDate(item.date_created).split('|').join('\n') }}</td>

          </tr>
        </tbody>
      </table>
    </div>
    <h2>Expiring items</h2>
    <div class="table-responsive">
      <table class="table table-striped table-hover">
        <thead class="thead-dark">
          <tr>
            <th>Name</th>
            <th>Expire On</th>
            <th>Note</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in expiring" :key="index">
            <td>{{ item.item_name }} - 
              <router-link to="/procurement">
                {{ item.id }}
              </router-link>
            </td>
            <td>{{ formatDate(item.date_exp).split('|').join('\n') }}</td>
            <td>{{ item.exp_note }}</td>
            <td class="text-danger">
              <span v-if="item.exp_note.includes('buang')" class="fa fa-times proc-action position-relative" style="cursor: pointer;" @click="dismiss(item)">
                <div class="panel bg-white border border-secondary rounded position-absolute p-1">Dismiss</div>
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import moment from "moment";

export default {
  data() {
    return {
      categories: [],
      category_id: 0,
      category_name: null,
      expiring: [],
      items: [],
      item_name: null,
      vendor: null,
      date: null
    }
  },
  mounted() {
    this.getCategories()
    this.getItems()
    this.getExpiring()
  },
  methods: {
    getCategories() {
      axios.get(process.env.VUE_APP_API_URL + 'master/item_category')
      .then(res => this.categories = res.data.values)
    },
    getItems() {
      const query = "?date=" + (this.date || '2099-12-31')
      axios.get(process.env.VUE_APP_API_URL + 'product/list' + query, {headers: {
        token: this.$store.getters.getToken,
      }})
      .then(res => {
        this.items = res.data.values
      })
    },
    getExpiring() {
      const query = '?sdate=' + (this.date || '1970-01-01') + '&edate=2099-12-31'
      axios.get(process.env.VUE_APP_API_URL + 'product/procurement' + query, { headers: {
        token: this.$store.getters.getToken
      }})
      .then(res => this.expiring = res.data.values.filter(el => {
        const dateExpWarning = new Date(el.date_exp)
        dateExpWarning.setDate(dateExpWarning.getDate() - 12)
        if(new Date(el.date_exp) <= new Date()) el.exp_note = "Mohon segera dibuang"
        else if(dateExpWarning <= new Date()) el.exp_note = "Mohon segera dihabiskan"
        if(el.date_procured && el.is_dismissed == 0 && new Date() >= dateExpWarning) return el
      }))
    },
    dismiss(item) {
      axios.patch(process.env.VUE_APP_API_URL + 'product/procurement/' + item.id + '/dis', null, { headers: {
        token: this.$store.getters.getToken
      }})
      .then(this.getExpiring())
    },
    submitForm() {
      const data = {
        name: this.item_name,
        category_id: this.category_id,
        vendor: this.vendor
      }
      axios.post(process.env.VUE_APP_API_URL + 'product/add', data, {headers: {
        token: this.$store.getters.getToken
      }})
      .then(() => this.getItems())
    },
    submitCategory() {
      axios.post(process.env.VUE_APP_API_URL + 'master/item_category', {name: this.category_name}, {headers: {
        token: this.$store.getters.getToken
      }})
      .then(() => this.getCategories())      
    },
    formatDate(date) {
      return date ? moment(String(date)).format('DD MMMM YYYY|HH:mm:ss').toString() : '-'
    }
  },
  watch: {
    date() {
      this.getItems()
    }
  }
}
</script>
