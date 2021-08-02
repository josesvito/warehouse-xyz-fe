<template>
  <section class="landing-page">
    <div class="container-fluid">
      <div class="row h-100 align-items-center">
        <div class="col-md-7 d-flex align-items-center justify-content-center text-white">
          <div>
            <i><h1>WareHouseXYZ.com</h1></i>
            <h2 class="subtitle">Online Warehouse System</h2>
          </div>
          <!-- <div class="text-left">
            <img src="@/assets/img/logomark_white_background.svg" height="100" class="mb-4"/>
            <i><h1>Whizliz.com</h1></i>
            <h2 class="subtitle pl-4">Indonesia's Biggest Jewellery Online Platform</h2>
          </div> -->
        </div>
        <div id="login-form" class="col-md-5 d-flex justify-content-center align-items-center">
          <div class="w-100">
            <i><h2 class="m-0">Sign in</h2></i>
            <small>Please input your information below to proceed</small>
            <div class="row justify-content-center pt-4">
              <div class="col-md-8">
                <b-form @submit.prevent="onSubmit">
                  <MyInputFormText
                    id="username"
                    v-model="$v.userName.$model"
                    placeholder="Username"
                    :classComponent="{
                      'is-invalid': $v.userName.$error,
                      'is-valid': !$v.userName.$invalid,
                    }"
                    :invalidMessage="[
                      !$v.userName.required ? 'This Field is Required' : '',
                    ]"
                  />
                  <MyInputFormText
                    id="login-password"
                    type="password"
                    v-model="$v.password.$model"
                    placeholder="Password"
                    :classComponent="{
                      'is-invalid': $v.password.$error,
                      'is-valid': !$v.password.$invalid,
                    }"
                    :invalidMessage="[
                      !$v.password.required ? 'This Field is Required' : '',
                    ]"
                  />
                  <div class="alert alert-danger text-center" v-if="errorMessage">
                    {{ errorMessage }}
                  </div>
                  <div class="row px-4">
                    <div class="col offset-6">
                      <MyButtonSubmit submitText="Log In" variant="primary" :disabledComponent="isLoading" />
                    </div>
                  </div>
                </b-form>
              </div>
            </div>
            <!-- //TODO: Go to Register Modal -->
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import {userService} from "@/_services"
import MyInputFormText from "../components/form/MyInputFormText";
import MyButtonSubmit from "../components/form/MyButtonSubmit";
import { required } from "vuelidate/lib/validators";

export default {
  name: "ModalLogin",
  validations: {
    userName: {
      required,
    },
    password: {
      required,
    },
  },
  components: {
    MyInputFormText,
    MyButtonSubmit
  },
  data() {
    return {
      userName: null,
      password: null,
      //! UMUM
      isLoading: false,
      errorMessage: null,
    };
  },
  mounted() {
    setTimeout(() => {
      document.getElementById('login-form').scrollIntoView({behavior: 'smooth'})
    }, 3000)
  },
  methods: {
    async onSubmit() {
      this.isLoading = true;
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.$bvToast.toast("Please Fill the Form Correctly", {
          variant: "danger",
          solid: true,
          noCloseButton: true,
        });
        this.isLoading = false;
        return;
      }
      try {
        const response = await userService.login(this.userName, this.password);
        if(response.data.status == 1) {
          this.$router.go()
        } else {
          this.errorMessage = response.data.values;
        }
        this.isLoading = false;
      } catch (error) {
        console.error(error);
        this.isLoading = false;
      }
    },
  },
};
</script>
<style></style>