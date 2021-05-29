<template>
  <div>
    <b-form-group
      :id="'input-select-group-' + id"
      :label="label"
      :label-for="'input-select-' + id"
      :description="description"
    >
      <b-form-select
        :id="'input-select-' + id"
        :value="model"
        @input="input"
        :options="localOptions"
        :class="classComponent"
      >
        <!-- This slot appears above the options from 'localOptions' prop -->
        <template #first>
          <b-form-select-option :value="null" disabled>{{
            placeholder != null ? placeholder : "Please Select an Option"
          }}</b-form-select-option>
        </template>

        <!-- These options will appear after the ones from 'localOptions' prop -->
        <b-form-select-option
          :value="option.value"
          :key="option.value"
          v-for="option in localOtherOptions"
          >{{ option.text }}</b-form-select-option
        >
      </b-form-select>

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
  props: [
    "value",
    "id",
    "label",
    "options",
    "classComponent",
    "otherOptions",
    "invalidMessage",
    "description",
    "placeholder",
  ],
  data() {
    return {
      model: this.value,
      localOptions: this.options,
      localOtherOptions: this.otherOptions,
      localSelected: this.selected,
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
