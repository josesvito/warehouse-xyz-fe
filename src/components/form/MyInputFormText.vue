<template>
  <div>
    <b-form-group
      :id="'input-group-' + id"
      :label="label"
      :label-for="'input-' + id"
      :description="description"
    >
      <b-form-input
        :id="'input-' + id"
        :value="model"
        @input="input"
        :type="type != null ? type : 'text'"
        :placeholder="placeholder"
        class=""
        :disabled="disabled"
        :class="classComponent"
      ></b-form-input>

      <div
        class="invalid-feedback text-right"
        v-if="invalidMessage && invalidMessage.length > 0"
      >
        <div
          v-for="(message, index) in invalidMessage"
          :key="id + '-' + message + '-' + index"
        >
          {{ message }}
        </div>
      </div>
    </b-form-group>
  </div>
</template>
<script>
export default {
  name: "MyInputFormText",
  props: [
    "value",
    "id",
    "label",
    "placeholder",
    "description",
    "classComponent",
    "type",
    "invalidMessage",
    "disabled",
  ],
  data() {
    return {
      model: this.value,
    };
  },
  methods: {
    input(val) {
      this.model = val;
      this.$emit("input", val);
    },
  },
};
</script>
