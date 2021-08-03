<template>
  <div class="container">
    <h2>Returned Items</h2>
    <div class="row mb-2">
      <div class="ml-auto col-auto">
        <div class="input-group">
            <input type="date" v-model="sdate" :max="edate" class="form-control">
            <div class="input-group-text">to</div>
            <input type="date" v-model="edate" :min="sdate" class="form-control">
        </div>
      </div>
    </div>
    <div class="table-responsive">
      <table class="table table-striped table-hover">
        <thead class="thead-dark">
          <th>Vendor</th>
          <th>Item Name</th>
          <th>Category</th>
          <th>Return Amount</th>
          <th>Date Returned</th>
          <th>Note</th>
          <th>Handler</th>
        </thead>
        <tbody>
          <tr v-for="(purchase, index) in purchases" :key="index">
            <td>{{purchase.vendor}}</td>
            <td>{{purchase.item_name}}</td>
            <td>{{purchase.category}}</td>
            <td>{{purchase.return_amount}} {{purchase.unit_type}}</td>
            <td>{{formatDate(purchase.date_procured).split('|').join('\n')}}</td>
            <td>{{purchase.return_note}}</td>
            <td>{{purchase.procuror_name}}</td>
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
  name: 'Returned',
  data() {
    return {
      item_id: 0,
      items: [],
      filtered: [],
      note: null,
      purchases: [],
      quantity: null,
      sdate: null,
      edate: null
    }
  },
  mounted() {
    this.getItems()
    this.getPurchase()
  },
  methods: {
    getItems() {
      axios.get(process.env.VUE_APP_API_URL + 'product/list', {headers: {
        token: this.$store.getters.getToken,
      }})
      .then(res => {
        this.items = res.data.values
      })
    },
    getPurchase() {
      const query = '?sdate=' + (this.sdate || '1970-01-01') + '&edate=' + (this.edate || '2099-12-31') 
      axios.get(process.env.VUE_APP_API_URL + 'product/returned' + query, { headers: {
        token: this.$store.getters.getToken
      }})
      .then(res => this.purchases = res.data.values)
    },
    formatDate(date) {
      return date ? moment(String(date)).format("DD MMMM YYYY|HH:mm:ss").toString() : '-'
    }
  },
  watch: {
    sdate() {
      this.getPurchase()
    },
    edate() {
      this.getPurchase()
    }
  }
}
</script>