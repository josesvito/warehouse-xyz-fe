<template>
  <b-navbar toggleable="lg" type="dark" variant="dark" class="pl-0 justify-content-start sticky-top">
    <b-navbar-toggle target="dashboard-sidebar" v-b-toggle.dashboard-sidebar></b-navbar-toggle>
    <b-navbar-brand to="/" class="pl-lg-3">
      WarehouseXYZ
    </b-navbar-brand>
    <b-collapse id="nav-collapse" is-nav>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto align-items-center">
        <b-nav-item>{{ $store.getters.getUserData.name}}</b-nav-item>
        <b-nav-item-dropdown right>
          <!-- Using 'button-content' slot -->
          <template #button-content>
            <b-img :src="require('@/assets/img/my_profile.svg')" height="30" class="pr-1 invert"/>
          </template>
          <b-link
            to="/profile"
            router-tag="b-dropdown-item"
            >Profile</b-link
          >
          <b-dropdown-item @click="logout">Sign Out</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
    <b-sidebar id="dashboard-sidebar" title="Menu" backdrop>
      <DashboardSidebar />
    </b-sidebar>
  </b-navbar>
</template>
<script>
import { userService } from "@/_services";
import DashboardSidebar from "@/components/navigations/DashboardSidebar";

export default {
  components: {
    DashboardSidebar
  },
  methods: {
    logout() {
      userService.logout();
      setTimeout(() => this.$router.go(), 1000)
    },
    openModal(modal) {
      this.$bvModal.show(modal);
    },
  },
};
</script>