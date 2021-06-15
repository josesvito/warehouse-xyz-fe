<template>
  <div>
    <section class="content">
      <MainHeader/>
      <div class="row">
        <div class="col-md-3 d-none d-lg-block dashboard-sidebar bg-grey pr-0">
          <DashboardSidebar />
        </div>
        <div class="col-md-9 bg-grey py-5">
          <router-view />
        </div>
      </div>
    </section>  
    <footer class="text-left p-3 bg-dark text-white text-small">
      Copyright &copy; 2021 WarehouseXYZ.com. All rights reserved.
    </footer>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from "axios";
import MainHeader from "@/components/navigations/MainHeader";
import DashboardSidebar from "@/components/navigations/DashboardSidebar"
// import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  components: {
    MainHeader,
    DashboardSidebar,
    // HelloWorld
  },
  data() {
    return {
      expiring: []
    }
  },
  mounted() {
    if(this.$store.getters.getUserData.role_id == 3) {
      const query = '?sdate=1970-01-01&edate=2099-12-31'
        axios.get(process.env.VUE_APP_API_URL + 'product/procurement' + query, { headers: {
          token: this.$store.getters.getToken
        }})
        .then(res => this.expiring = res.data.values.filter(el => {
          const dateExpWarning = new Date(el.date_exp)
          dateExpWarning.setDate(dateExpWarning.getDate() - 12)
          if(el.date_procured && el.is_dismissed == 0 && new Date() >= dateExpWarning) return el
        }))      
    }
  },
  watch: {
    expiring(newValue) {
      this.$bvToast.toast('You have ' + newValue.length + ' expiring item(s)\nPlease check your inventory', {
        noCloseButton: true,
        solid: true,
        variant: 'info',
      })
    }
  }
}
</script>
