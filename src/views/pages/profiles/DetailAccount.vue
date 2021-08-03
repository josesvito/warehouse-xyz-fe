<template>
  <div class="container">
    <b-form @submit.prevent="onSubmit" v-if="$store.getters.getUserData">
      <div class="row">
        <div class="col-md-6">
          <!-- // TODO: username -->
          <MyInputFormText
            v-if="username"
            id="username"
            label="username*"
            :disabled="true"
            v-model="username"
            placeholder="username"
            classComponent="disabled"
          />
          <!-- // TODO: Full Name -->
          <MyInputFormText
            v-if="fullName.length >= 0"
            id="full-name"
            label="Full Name*"
            v-model="$v.fullName.$model"
            placeholder="Full Name"
            :classComponent="{
              'is-invalid': $v.fullName.$error,
              'is-valid': !$v.fullName.$invalid,
            }"
            :invalidMessage="[
              !$v.fullName.required ? 'This Field is Required' : null,
              !$v.fullName.namePattern ? 'Your Full Name is invalid' : null,
            ]"
          />
          <!-- // TODO: NPWP -->
          <MyInputFormText
            type="text"
            label="NPWP"
            v-model="$v.npwp.$model"
            placeholder="NPWP"
            :classComponent="{
              'is-invalid': $v.npwp.$error,
              'is-valid': !$v.npwp.$invalid,
            }"
            :invalidMessage="[
              !$v.npwp.maxLength ? 'No more than 16 characters' : null,
            ]"
          />
          <!-- // TODO: Password -->
          <MyInputFormText
            id="account-password"
            label="Password:"
            type="password"
            v-model="$v.password.$model"
            placeholder="Password"
            :classComponent="{
              'is-invalid': $v.password.$error,
              'is-valid': !$v.password.$invalid,
            }"
            :invalidMessage="[
              !$v.password.required ? 'This Field is Required' : null,
              !$v.password.passwordPattern
                ? 'Your Password must have at least 1 letter, 1 number and 1 special character'
                : null,
              !$v.password.minLength
                ? 'Password must be ' +
                  $v.password.$params.minLength.min +
                  ' characters! ' +
                  ($v.password.$params.minLength.min - $v.password.$model.length) +
                  ' characters left'
                : null,
            ]"
          />
          <!-- // TODO: Confirm Password -->
          <MyInputFormText
            id="confirm-password"
            label="Confirm Password*"
            type="password"
            v-model="$v.confirmPassword.$model"
            placeholder="Confirm Password"
            :classComponent="{
              'is-invalid': $v.confirmPassword.$error,
              'is-valid': !$v.confirmPassword.$invalid,
            }"
            :invalidMessage="[
              !$v.confirmPassword.required ? 'This Field is Required' : null,
              !$v.confirmPassword.sameAsPassword && $v.confirmPassword.required
                ? 'Passwords must be identical!'
                : null,
            ]"
          />
          <MyButtonSubmit
            submitText="Save Account"
            :disabledComponent="isLoading"
          />
        </div>
      </div>
    </b-form>
  </div>
</template>
<script>
import { userService } from "@/_services";
import MyInputFormText from "../../../components/form/MyInputFormText";
import MyButtonSubmit from "../../../components/form/MyButtonSubmit";
// import MyInputFormSelect from "../../../components/form/MyInputFormSelect";
import {
  required,
  sameAs,
  helpers,
  minLength,
  maxLength
  // requiredIf,
} from "vuelidate/lib/validators";

// Regex for Validation Start
const namePattern = helpers.regex(
  "namePattern",
  /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/
);
const passwordPattern = helpers.regex(
  "passwordPattern",
  /^(?=[\x21-\x7E]*[0-9])(?=[\x21-\x7E]*[a-z])(?=[\x21-\x7E]*[\x21-\x2F|\x3A-\x40|\x5B-\x60|\x7B-\x7E])[\x21-\x7E]{0,}$/
);
// const phonePattern = helpers.regex("phonePattern", /^([+][6][2][8])([0-9])*$/);
// Regex for Validation End

export default {
  props: ["profile"],
  components: {
    MyInputFormText,
    MyButtonSubmit,
    // MyInputFormSelect,
  },
  validations: {
    fullName: {
      required,
      namePattern,
    },
    npwp: {
      maxLength: maxLength(16)
    },
    password: {
      passwordPattern,
      minLength: minLength(6),
      maxLength: maxLength(20)
    },
    confirmPassword: {
      sameAsPassword: sameAs("password")
    }
  },
  data() {
    return {
      username: null,
      fullName: null,
      password: null,
      confirmPassword: null,
      npwp: null,
      isLoading: false,
      errorMessage: null,
    };
  },
  computed: {
    pengguna() {
      return this.$store.getters.getUserData
    }
  },
  mounted() {
    if (!this.pengguna) this.getProfile();
    else this.setProfile();
  },
  methods: {
    // TODO: Update Profile
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
        const response = await userService.updateProfile({
          id: this.$store.getters.getUserData.id,
          name: this.fullName,
          id_npwp: this.npwp,
          password: this.password
        });
        if (response.status === 200) {
          this.$bvToast.toast(response.data.message, {
            variant: "success",
            solid: true,
            noCloseButton: true,
          });
        } else {
          this.errorMessage = response.data.message;
        }
        this.isLoading = false;
      } catch (error) {
        console.error(error);
        this.isLoading = false;
      }
    },
    async getProfile() {
      this.pengguna = this.$store.getters.getUserData;
    },
    setProfile() {
      this.npwp = this.pengguna.id_npwp;
      this.username = this.pengguna.username;
      this.fullName = this.pengguna.name;
    },
  }
};
</script>
