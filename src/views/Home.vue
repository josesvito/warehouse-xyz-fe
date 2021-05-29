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
import MainHeader from "@/components/navigations/MainHeader";
import DashboardSidebar from "@/components/navigations/DashboardSidebar"
// import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  components: {
    MainHeader,
    DashboardSidebar,
    // HelloWorld
  }
}
</script>
