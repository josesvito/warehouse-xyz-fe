<template>
  <div class="container-fluid" v-if="$store.getters.getUserData.role_id == 1">
    <div class="card shadow p-2 p-md-3">
      <h2>Report</h2>
      <div class="card p-2 mb-2">
        <strong>Report date: {{ currentDate() }}</strong>
      </div>
      <div class="p-2 mb-2 card">
        <b>Inbound/Outbond Flow</b>
        <line-chart v-if="chartData" :chartData="chartData" />
      </div>
      <div class="row g-less">
        <div class="col-md-4">
          <div class="card px-2">
            <pie-chart v-if="pieChartData" :chartData="pieChartData" />
          </div>
        </div>
        <div class="col-md-4">
          <div class="card d-block">
            <div class="p-2">
              <strong>Items Remaining</strong>
            </div>
            <div class="overflow-auto" style="max-height: 400px;">
              <table class="table table-hover">
                <thead class="thead-dark">
                  <th>Item</th>
                  <th>Quantity</th>
                </thead>
                <tbody>
                  <tr v-for="(obj, i) in itemsData" :key="i">
                    <th>
                      {{ obj.name }} ({{ obj.unit.name }})
                    </th>
                    <td>{{ obj.quantity }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card d-block">
            <div class="p-2">
              <strong>Procurement</strong>
            </div>
            <div class="overflow-auto" style="max-height: 400px;">
              <table class="table table-hover">
                <thead class="thead-dark">
                  <th>Item</th>
                  <th>Quantity</th>
                </thead>
                <tbody>
                  <tr v-if="!procurementsData.length">
                    <td colspan="2" align="center">No procurements on this date</td>
                  </tr>
                  <tr v-else v-for="(obj, i) in procurementsData" :key="i">
                    <th>
                      {{ obj.name }} ({{ obj.unit.name }})
                    </th>
                    <td>{{ obj.quantity }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="card d-block">
            <div class="p-2">
              <strong>Outbond Flow</strong>
            </div>
            <div class="overflow-auto" style="max-height: 400px;">
              <table class="table table-hover">
                <thead class="thead-dark">
                  <th>Item</th>
                  <th>Quantity</th>
                </thead>
                <tbody>
                  <tr v-if="!outflowData.length">
                    <td colspan="2" align="center">No purchases on this date</td>
                  </tr>
                  <tr v-else v-for="(obj, i) in outflowData" :key="i">
                    <th>
                      {{ obj.name }} ({{ obj.unit_name }})
                    </th>
                    <td>{{ obj.quantity }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="card d-block">
            <div class="p-2">
              <strong>Returns</strong>
            </div>
            <div class="overflow-auto" style="max-height: 400px;">
              <table class="table table-hover">
                <thead class="thead-dark">
                  <th>Item</th>
                  <th>Quantity</th>
                </thead>
                <tbody>
                  <tr v-if="!returnsData.length">
                    <td colspan="2" align="center">No returns on this date</td>
                  </tr>
                  <tr v-else v-for="(obj, i) in returnsData" :key="i">
                    <th>
                      {{ obj.name }} ({{ obj.unit.name }})
                    </th>
                    <td>{{ obj.quantity }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>  
  </div>
</template>
<script>
import axios from "axios";

export default {
  name: "Dashboard",
  data() {
    return {
      chartData: null,
      pieChartData: null,
      itemsData: [],
      procurementsData: [],
      outflowData: [],
      returnsData: [],
    }
  },
  computed: {
    userData() {
      return this.$store.getters.getUserData;
    }
  },
  mounted() {
    if (this.userData.role_id != 1)
      return this.$router.replace('/procurement')

    this.getCharts();
    this.getItems();
    this.getProcurements();
    this.getOutbondFlow();
    this.getReturnedItems();
  },
  methods: {
    currentDate() {
      const date = new Date();
      date.setHours(date.getHours() + 7)
      return date.toISOString().split('T')[0].split('-').reverse().join('/')
    },
    async getCharts() {
      try {
        const res = await axios.get(process.env.VUE_APP_API_URL + "product/dashboard", {
          headers: { token: this.$store.getters.getToken }
        })        
        if (res.status === 200) {
          const { values } = res.data
          this.chartData = values.reduce((obj, el) => {
            obj.labels.push(el.event_date)
            obj.datasets[0].data.push(el.quantity_in)
            obj.datasets[1].data.push(el.quantity_out)
            obj.datasets[2].data.push(el.quantity_returned)
            obj.datasets[3].data.push(el.quantity_exp)
            return obj
          }, {
            labels: [],
            datasets: [
              {
                label: "In",
                backgroundColor: "rgba(0, 255, 0, 0.3)",
                borderColor: "rgba(0, 255, 0, 1)",
                borderWidth: 2,
                data: []
              },
              {
                label: "Out",
                backgroundColor: "rgba(255, 0, 0, 0.3)",
                borderColor: "rgba(255, 0, 0, 1)",
                borderWidth: 2,
                data: []
              },
              {
                label: "Returned",
                backgroundColor: "rgba(255, 255, 0, 0.3)",
                borderColor: "rgba(255, 255, 0, 1)",
                borderWidth: 2,
                data: []
              },
              {
                label: "Expired",
                backgroundColor: "rgba(0, 0, 0, 0.3)",
                borderColor: "rgba(0, 0, 0, 1)",
                borderWidth: 2,
                data: []
              },
            ],
          })
        } else this.$bvToast.toast(res.data.message, {
          variant: "danger",
          solid: true,
          noCloseButton: true,
        })
      } catch (e) {
        console.error(e);
      }
    },
    async getItems() {
      const query = "?date=2099-12-31";
      try {
        const res = await axios.get(process.env.VUE_APP_API_URL + 'product/list' + query, {headers: {
          token: this.$store.getters.getToken,
        }})
        if (res.status === 200) {
          const { values } = res.data
          this.itemsData = values
          const category = [...new Set(values.map(el => el.category.id))].map(el => values.find(rel => rel.category.id == el).category)
          const datasetsData = []
          for (const i in category) {
            const data = JSON.parse(JSON.stringify(values.filter(el => el.category.id == category[i].id))).map(el => {delete el.category; return el})
            category[i].data = data
            datasetsData[i] = data.reduce((a, b) => a + b.quantity, 0)
          }
          const randomColor = () => Math.floor(Math.random() * 255)
          this.pieChartData = {
            labels: category.map(el => el.name),
            datasets: [{
              label: 'Data',
              data: datasetsData,
              backgroundColor: category.map(() => `rgb(${randomColor()}, ${randomColor()}, ${randomColor()})`),
              hoverOffset: 4
            }]
          }
        } else this.$bvToast.toast(res.data.message, {
          variant: "danger",
          solid: true,
          noCloseButton: true,
        })
      } catch (e) {
        console.error(e);
      }
    },
    async getProcurements() {
      try {
        const res = await axios.get(process.env.VUE_APP_API_URL + 'product/procurement', { 
          params: {
            sdate: new Date().toISOString().split('T')[0],
            edate: '2099-12-31',
          },
          headers: {
            token: this.$store.getters.getToken
          }
        })
        if (res.status === 200 && typeof res.data.values == 'object') {
          this.procurementsData = res.data.values
        } else this.$bvToast.toast(res.data.message, {
          variant: "danger",
          solid: true,
          noCloseButton: true,
        })
      } catch (e) {
        console.error(e);
      }
    },
    async getOutbondFlow() {
      try {
        const res = await axios.get(process.env.VUE_APP_API_URL + 'product/purchase', { 
          params: {
            sdate: new Date().toISOString().split('T')[0],
            edate: '2099-12-31',
            admin: true,
          },
          headers: {
            token: this.$store.getters.getToken
          }
        })
        if (res.status === 200 && typeof res.data.values == 'object') {
          this.outflowData = res.data.values
        } else this.$bvToast.toast(res.data.message, {
          variant: "danger",
          solid: true,
          noCloseButton: true,
        })
      } catch (e) {
        console.error(e);
      }
    },
    async getReturnedItems() {
      try {
        const res = await axios.get(process.env.VUE_APP_API_URL + 'product/returned', { 
          params: {
            sdate: new Date().toISOString().split('T')[0],
            edate: '2099-12-31',
          },
          headers: {
            token: this.$store.getters.getToken
          }
        })
        if (res.status === 200 && typeof res.data.values == 'object') {
          this.returnsData = res.data.values
        } else this.$bvToast.toast(res.data.message, {
          variant: "danger",
          solid: true,
          noCloseButton: true,
        })
      } catch (e) {
        console.error(e);
      }
    }
  }
}
</script>
<style>
.row.g-less {
  margin-left: -.25rem;
  margin-right: -.25rem;
}
.row.g-less > div {
  padding-left: .25rem;
  padding-right: .25rem;
  margin-bottom: .5rem;
}
</style>
