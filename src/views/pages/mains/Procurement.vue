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
          <th>Requested By</th>
          <th>Note</th>
          <th></th>
        </thead>
        <tbody>
          <tr v-for="(proc, index) in procurement" :key="index" @click="selectedProc = proc" :class="{'text-info' : proc.return_amount}" style="cursor: pointer;">
            <td>{{proc.id}}</td>
            <td>{{proc.vendor || '-'}}</td>
            <td>{{proc.item_name}}</td>
            <td>{{proc.quantity}}</td>
            <td>{{proc.category}}</td>
            <td>{{formatDate(proc.date_proposal).split('|').join('\n')}}</td>
            <td :class="{'text-danger proc-action position-relative' : proc.date_rejected}">
              {{ proc.date_accepted ? formatDate(proc.date_accepted).split('|').join('\n') :
              formatDate(proc.date_rejected).split('|').join('\n')}}
              <template v-if="proc.date_rejected">
                <div class="panel bg-white border border-secondary rounded position-absolute p-1">{{proc.reason}}</div>
              </template>
            </td>
            <td>{{proc.requestee || '-'}}</td>
            <td>{{proc.note || '-'}}</td>
            <td class="text-nowrap">
              <a v-if="$store.getters.getUserData.role_id == 1 && !proc.date_accepted && !proc.date_rejected" href="#" @click="selectedProc = proc">
                <span class="fa fa-check proc-action position-relative px-1" v-b-modal="'modal-accept'">
                  <div class="panel bg-white border border-secondary rounded position-absolute p-1">Accept</div>
                </span>
                <span class="fa fa-times proc-action position-relative px-1" v-b-modal="'modal-deny'">
                  <div class="panel bg-white border border-secondary rounded position-absolute p-1">Deny</div>
                </span>
                <span class="fa fa-check proc-action position-relative px-1" v-if="proc.date_accepted" @click="order(proc)">
                  <div class="panel bg-white border border-secondary rounded position-absolute p-1">Order</div>
                </span>
              </a>
              <a v-if="$store.getters.getUserData.role_id == 3 && proc.date_accepted" href="#" @click="selectedProc = proc">
                <template v-if="$store.getters.getUserData.id == proc.procured_by">
                  <span class="fa fa-clipboard-check proc-action position-relative px-1" v-if="proc.date_ordered && !proc.date_procured" v-b-modal="'modal-procured'">
                    <div class="panel bg-white border border-secondary rounded position-absolute p-1">Delivered to warehouse</div>
                  </span>
                  <span class="fa fa-undo proc-action position-relative px-1" v-if="proc.date_procured && !proc.return_amount" v-b-modal="'modal-return'">
                    <div class="panel bg-white border border-secondary rounded position-absolute p-1">Return</div>
                  </span>
                </template>
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="table-responsive">
      <table class="table table-striped table-hover mt-4">
        <thead class="thead-dark">
          <th>ID</th>
          <th>Vendor</th>
          <th>Item Name</th>
          <th>Category</th>
          <th>Order Date</th>
          <th>Procured Date</th>
          <th>Expired Date</th>
          <th>Checked By</th>
          <th>Return Qty.</th>
          <th>Return Note</th>
        </thead>
        <tbody>
          <tr v-if="selectedProc">
            <td>{{selectedProc.id}}</td>
            <td>{{selectedProc.vendor || '-'}}</td>
            <td>{{selectedProc.item_name}}</td>
            <td>{{selectedProc.category}}</td>
            <td>{{formatDate(selectedProc.date_ordered).split('|').join('\n')}}</td>
            <td>{{formatDate(selectedProc.date_procured).split('|').join('\n')}}</td>
            <td>{{formatDate(selectedProc.date_exp).split('|').join('\n')}}</td>
            <td>{{selectedProc.procuror_name || '-'}}</td>
            <td>{{selectedProc.return_amount || '-'}}</td>
            <td>{{selectedProc.return_note || '-'}}</td>
          </tr>
          <tr v-else>
            <td colspan="10">Please select a procurement history to view the detail.</td>
          </tr>
        </tbody>
      </table>
    </div>
    <b-modal id="modal-procured" size="xs" @ok="procured(selectedProc)">
      <template #modal-title>
        Please insert expire date
      </template>
      <input type="date" class="form-control" v-model="exp_date" :min="new Date()" required>
    </b-modal>
    <b-modal id="modal-return" size="xs" @ok="returnItem(selectedProc)">
      <template #modal-title>
        Please write a reason to return this item
      </template>
      <div class="row" v-if="selectedProc">
        <div class="col-auto">
          <input type="number" class="form-control" v-model="quantity" min="1" :max="selectedProc.quantity" required>
        </div>
        <div class="col">
          <input type="text" class="form-control" v-model="reason" placeholder="Reason" required>
        </div>
      </div>
    </b-modal>
    <b-modal id="modal-accept" size="xs" modal-class="text-center" @ok="acceptProposal(selectedProc)">
      Are you sure you want to accept this proposal?
    </b-modal>
    <b-modal id="modal-deny" size="xs" modal-class="text-center" @ok="denyProposal(selectedProc)">
      <template #modal-title>
        Please write a reason to deny this proposal
      </template>
      <input type="text" class="form-control" placeholder="Reason" v-model="reason" required>
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
      reason: null,
      item_id: 0,
      items: [],
      quantity: null,
      exp_date: null,
      sdate: null,
      edate: null,
      selectedProc: null
    }
  },
  mounted() {
    this.getItems()
    this.getProcurements()
  },
  methods: {
    acceptProposal(proc) {
      axios.patch(process.env.VUE_APP_API_URL + 'product/procurement/' + proc.id + '/acc', null, {
        headers: {token: this.$store.getters.getToken}
      })
      .then(() => this.getProcurements())
    },
    denyProposal(proc) {
      if (this.reason) {
        axios.patch(process.env.VUE_APP_API_URL + 'product/procurement/' + proc.id + '/dec', {reason: this.reason}, {
          headers: {token: this.$store.getters.getToken}
        })
        .then(() => this.getProcurements())
      } else this.$bvToast.toast('Please write a reason!', {
        noCloseButton: true,
        solid: true,
        variant: 'danger',
      })
    },
    order(proc) {
      axios.patch(process.env.VUE_APP_API_URL + 'product/procurement/' + proc.id + '/order', null, {
        headers: {token: this.$store.getters.getToken}
      })
      .then(() => {
        this.getItems()
        this.getProcurements()
      })
    },
    procured(proc) {
      if(this.exp_date) {
        axios.patch(process.env.VUE_APP_API_URL + 'product/procurement/' + proc.id + '/done', {date_exp: this.exp_date}, {
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
    returnItem(proc) {
      if(this.quantity && this.reason) {
        axios.post(process.env.VUE_APP_API_URL + 'product/procurement/' + proc.id, {quantity: this.quantity, reason: this.reason}, {
          headers: {token: this.$store.getters.getToken}
        })
        .then(() => {
          this.getItems()
          this.getProcurements()
        })
      } else this.$bvToast.toast('Please fill in all fields', {
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