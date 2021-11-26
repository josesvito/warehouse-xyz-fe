<template>
  <div class="container-fluid" v-if="$store.getters.getUserData.role_id == 1">
    <h2>Dashboard</h2>
    <div class="card shadow p-2 mb-2">
      <b>Inbound/Outbond Flow</b>
      <line-chart v-if="chartData" :chartData="chartData" />
    </div>
    <div class="row">
      <div class="col-md-6">
        <div class="card shadow">
          <pie-chart v-if="pieChartData" :chartData="pieChartData" />
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
      pieChartData: null
    }
  },
  mounted() {
    this.getCharts()
    this.getItems()
  },
  methods: {
    async getCharts() {
      try {
        const res = await axios.get(process.env.VUE_APP_API_URL + "product/dashboard", {
          headers: {token: this.$store.getters.getToken
        }})        
        if (res.status === 200) {
          const { values } = res.data
          this.chartData = {
            labels: values.map((el) => el.event_date),
            datasets: [
              {
                label: "In",
                backgroundColor: "rgba(0, 255, 0, 0.3)",
                borderColor: "rgba(0, 255, 0, 1)",
                borderWidth: 2,
                data: values.map((el) => el.quantity_in)
              },
              {
                label: "Out",
                backgroundColor: "rgba(255, 0, 0, 0.3)",
                borderColor: "rgba(255, 0, 0, 1)",
                borderWidth: 2,
                data: values.map((el) => el.quantity_out)
              },
              {
                label: "Returned",
                backgroundColor: "rgba(255, 255, 0, 0.3)",
                borderColor: "rgba(255, 255, 0, 1)",
                borderWidth: 2,
                data: values.map((el) => el.quantity_returned)
              },
              {
                label: "Expired",
                backgroundColor: "rgba(0, 0, 0, 0.3)",
                borderColor: "rgba(0, 0, 0, 1)",
                borderWidth: 2,
                data: values.map((el) => el.quantity_exp)
              },
            ]
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
    async getItems() {
      const query = "?date=2099-12-31";
      try {
        const res = await axios.get(process.env.VUE_APP_API_URL + 'product/list' + query, {headers: {
          token: this.$store.getters.getToken,
        }})
        if (res.status === 200) {
          const { values } = res.data 
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
  }
}
</script>
