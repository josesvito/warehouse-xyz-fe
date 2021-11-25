<template>
  <div class="container-fluid">
    <h2>Returned Items</h2>
    <div class="row mb-2">
      <div class="ml-auto col-auto">
        <div class="input-group">
          <MyInputFormDate v-model="sdate" :max="edate" />
          <div class="input-group-text">to</div>
          <MyInputFormDate v-model="edate" :max="sdate" />
        </div>
      </div>
    </div>
    <div class="table-responsive">
      <table class="table table-striped table-hover">
        <thead class="thead-dark">
          <th>Proc No.</th>
          <th>Vendor</th>
          <th>Item Name</th>
          <th>Category</th>
          <th>Return Amount</th>
          <th>Date Returned</th>
          <th>Note</th>
          <th>Handler</th>
        </thead>
        <tbody>
          <tr v-for="(returned, index) in returns" :key="index">
            <td>{{returned.generated_id || '-'}}</td>
            <td>{{returned.vendor}}</td>
            <td>{{returned.item_name}}</td>
            <td>{{returned.category}}</td>
            <td>{{returned.return_amount}} {{returned.unit_type}}</td>
            <td>{{formatDate(returned.date_procured).split('|').join('\n')}}</td>
            <td>{{returned.return_note}}</td>
            <td>{{returned.procuror_name}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import moment from "moment";
import MyInputFormDate from "@/components/form/MyInputFormDate";

export default {
  name: 'Returned',
  components: {
    MyInputFormDate,
  },
  data() {
    return {
      item_id: 0,
      items: [],
      filtered: [],
      note: null,
      returns: [],
      quantity: null,
      sdate: null,
      edate: null
    }
  },
  mounted() {
    this.getItems()
    this.getReturns()
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
    getReturns() {
      const query = '?sdate=' + (this.sdate || '1970-01-01') + '&edate=' + (this.edate || '2099-12-31') 
      axios.get(process.env.VUE_APP_API_URL + 'product/returned' + query, { headers: {
        token: this.$store.getters.getToken
      }})
      .then(res => this.returns = res.data.values)
    },
    formatDate(date) {
      return date ? moment(String(date)).format("DD MMMM YYYY|HH:mm:ss").toString() : '-'
    }
  },
  watch: {
    sdate() {
      this.getReturns()
    },
    edate() {
      this.getReturns()
    }
  }
}
</script>