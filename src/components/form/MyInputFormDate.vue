<template>
  <b-input-group class="w-auto">
    <b-form-input :value="formatDate(model)" type="text" placeholder="dd/mm/yyyy" class="bg-white" disabled />
    <b-input-group-append>
      <b-form-datepicker ref="input-date" v-model="model" button-only button-variant="white" right @input="input" :min="min" :max="max" :required="required" />
    </b-input-group-append>
  </b-input-group>
</template>
<script>
import moment from "moment";

export default {
  name: "MyInputFormDate",
  props: ["value", "min", "max", "required"],
  data() {
    return {
      model: this.value,
      localModel: null,
    }
  },
  methods: {
    formatDate(value, format="DD/MM/YYYY") {
      return value ? moment(String(value)).format(format).toString() : value;
    },
    input(event) {
      this.$emit("input", event)
    }
  },
  watch: {
    value(newVal) {
      this.model = newVal
      this.localModel = this.formatDate(newVal)
    },
  }
}
</script>
