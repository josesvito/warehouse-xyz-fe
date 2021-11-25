<template>
  <div class="container-fluid">
    <h2>Outbond Flow Page</h2>
    <div class="row" v-if="$store.getters.getUserData.role_id == 3">
      <div class="col-md-7 mt-3">
        <form @submit.prevent="submitForm">
          <div class="row">
            <div class="col-md-12 mb-1">
              <select v-model="item_id" class="form-control">
                <option value="0" selected disabled>Select Item</option>
                <option v-for="(item, i) in items" :key="i" :value="item.id">{{item.vendor}} - {{ item.name }}: {{ item.quantity }} {{ item.unit.name }} left ({{item.category.name}})</option>
              </select>
            </div>
            <div class="col-md-3 mb-1">
              <input type="number" placeholder="Qty" class="form-control" v-model="quantity" min="1" :max="item_id > 0 ? items.find(el => el.id == item_id).quantity : 99999">
            </div>
          </div>
          <div class="row">
            <div class="col-md-7 mb-2">
              <textarea rows="2" placeholder="Add note" v-model="note" class="form-control"></textarea>
            </div>
            <div class="col-md-12">
              <button type="submit" class="btn btn-primary">SUBMIT</button>
            </div>
          </div>
        </form>
      </div>
    </div>
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
          <th>Vendor</th>
          <th>Item Name</th>
          <th>Quantity</th>
          <th>Category</th>
          <th>Purchase Date</th>
          <th>Note</th>
          <th>Handler</th>
        </thead>
        <tbody>
          <tr v-for="(purchase, index) in purchases" :key="index">
            <td>{{purchase.vendor}}</td>
            <td>{{purchase.name}}</td>
            <td>{{purchase.quantity}} {{purchase.unit_name}}</td>
            <td>{{purchase.cat_name}}</td>
            <td>{{formatDate(purchase.date_purchase).split('|').join('\n')}}</td>
            <td>{{purchase.note}}</td>
            <td>{{purchase.handler_name}}</td>
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
  components: {
    MyInputFormDate,
  },
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
      axios.get(process.env.VUE_APP_API_URL + 'product/purchase' + query, { headers: {
        token: this.$store.getters.getToken
      }})
      .then(res => this.purchases = res.data.values)
    },
    submitForm() {
      const data = {
        note: this.note,
        item_id: this.item_id,
        quantity: this.quantity,
      }
      axios.post(process.env.VUE_APP_API_URL + 'product/purchase', data, {
        headers: {token: this.$store.getters.getToken}
      })
      .then(() => {
        this.getPurchase()
        this.getItems()  
      })
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