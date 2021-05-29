<template>
  <div>
    <b-button type="submit" block :variant="variant ? variant : 'primary'" :disabled="disabledComponent"
      >{{
        disabledComponent
          ? !loadingText
            ? "Loading..."
            : loadingText
          : !submitText
          ? "Submit"
          : submitText
      }}
      <font-awesome
        :icon="!iconButton ? 'spinner' : iconButton"
        spin
        v-if="disabledComponent"
      ></font-awesome>
    </b-button>
  </div>
</template>
<script>
export default {
  name: "MyInputFormText",
  props: ["disabledComponent", "loadingText", "submitText", "iconButton", "variant"],
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
