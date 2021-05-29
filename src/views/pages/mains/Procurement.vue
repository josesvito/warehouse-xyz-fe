<template>
  <div class="container">
    <h2>Procurement Page</h2>
    <div class="row" v-if="$store.getters.getUserData.role_id == 2">
      <div class="col-md-7 mt-3">
        <form @submit.prevent="submitForm">
          <div class="row">
            <div class="col-md-12 mb-1">
              <select v-model="item_id" class="form-control">
                <option value="0" selected disabled>Select Item</option>
                <option v-for="(item, i) in items" :key="i" :value="item.id">{{item.vendor}} - {{ item.name }}: {{ item.quantity }} left ({{item.category.name}})</option>
              </select>
            </div>
            <div class="col-md-3 mb-1">
              <input type="number" placeholder="Qty" class="form-control" v-model="quantity" min="1">
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
    <div class="row">
      <div class="ml-auto col-auto">
        <div class="input-group">
            <input type="date" v-model="sdate" :max="edate" class="form-control">
            <div class="input-group-text">to</div>
            <input type="date" v-model="edate" :min="sdate" class="form-control">
        </div>
      </div>
    </div>
    <div class="table-responsive">
      <table class="table table-striped table-hover mt-4">
        <thead class="thead-dark">
          <th>ID</th>
          <th>Vendor</th>
          <th>Item Name</th>
          <th>Quantity</th>
          <th>Category</th>
          <th>Proposal Date</th>
          <th>Acceptance Date</th>
          <th>Procured Date</th>
          <th>Expired Date</th>
          <th>Procured By</th>
          <th>Requested By</th>
          <th>Note</th>
          <th></th>
        </thead>
        <tbody>
          <tr v-for="(proc, index) in procurement" :key="index">
            <td>{{proc.id}}</td>
            <td>{{proc.vendor || '-'}}</td>
            <td>{{proc.item_name}}</td>
            <td>{{proc.quantity}}</td>
            <td>{{proc.category}}</td>
            <td>{{formatDate(proc.date_proposal).split('|').join('\n')}}</td>
            <td>{{formatDate(proc.date_accepted).split('|').join('\n')}}</td>
            <td>{{formatDate(proc.date_procured).split('|').join('\n')}}</td>
            <td>{{formatDate(proc.date_exp).split('|').join('\n')}}</td>
            <td>{{proc.procuror_name || '-'}}</td>
            <td>{{proc.requestee || '-'}}</td>
            <td>{{proc.note || '-'}}</td>
            <td>
              <a v-if="$store.getters.getUserData.role_id == 1 && !proc.date_accepted" href="#" @click="acceptProposal(proc.id)">
                <span class="fa fa-check proc-action position-relative">
                  <div class="panel bg-white border border-secondary rounded position-absolute p-1">Accept</div>
                </span>
              </a>
              <a v-if="$store.getters.getUserData.role_id == 3 && proc.date_accepted && !proc.date_procured" href="#" v-b-modal.modal-procured @click="selectedProcId = proc.id">
                <span class="fa fa-check proc-action position-relative">
                  <div class="panel bg-white border border-secondary rounded position-absolute p-1">Done</div>
                </span>
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <b-modal id="modal-procured" size="xs" @ok="procured(selectedProcId)">
      <template #modal-title>
        Please insert expire date
      </template>
      <input type="date" class="form-control" v-model="exp_date" :min="new Date()" required>
    </b-modal>
  </div>
</template>
<script>
import axios from "axios";
import moment from "moment";

export default {
  data() {
    return {
      procurement: [],
      note: null,
      item_id: 0,
      items: [],
      quantity: null,
      exp_date: null,
      sdate: null,
      edate: null,
      selectedProcId: null
    }
  },
  mounted() {
    this.getItems()
    this.getProcurements()
  },
  methods: {
    acceptProposal(id) {
      axios.patch(process.env.VUE_APP_API_URL + 'product/procurement/' + id + '/acc', null, {
        headers: {token: this.$store.getters.getToken}
      })
      .then(() => this.getProcurements())
    },
    procured(id) {
      if(this.exp_date) {
        axios.patch(process.env.VUE_APP_API_URL + 'product/procurement/' + id + '/done', {date_exp: this.exp_date}, {
          headers: {token: this.$store.getters.getToken}
        })
        .then(() => {
          this.getItems()
          this.getProcurements()
        })
      } else this.$bvToast.toast('Please insert expire date', {
        variant: 'danger',
        solid: true,
        noCloseButton: true
      })
    },
    getItems() {  
      axios.get(process.env.VUE_APP_API_URL + 'product/list', {headers: {
        token: this.$store.getters.getToken,
      }})
      .then(res => this.items = res.data.values)
    },
    getProcurements() {
      const query = '?sdate=' + (this.sdate || '1970-01-01') + '&edate=' + (this.edate || '2099-12-31')
      axios.get(process.env.VUE_APP_API_URL + 'product/procurement' + query, { headers: {
        token: this.$store.getters.getToken
      }})
      .then(res => this.procurement = res.data.values)
    },
    submitForm() {
      const data = {
        note: this.note,
        item_id: this.item_id,
        quantity: this.quantity,
        user_id: this.$store.getters.getUserData.id
      }
      axios.post(process.env.VUE_APP_API_URL + 'product/procurement', data, {
        headers: {token: this.$store.getters.getToken}
      })
      .then(() => this.getProcurements())
    },
    formatDate(date) {
      return date ? moment(String(date)).format('DD MMMM YYYY|HH:mm:ss').toString() : '-'
    }
  },
  watch: {
    sdate() {
      this.getProcurements()
    },
    edate() {
      this.getProcurements()
    }
  }
}
</script>