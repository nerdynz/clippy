<template>
  <div class="selected-text">
  </div>
</template>

<script>
export default {
  // COMPONENT
  // ______________________________________
  components: {},
  props: {
    current: Object
  },
  computed: {
    formattedText () {
      let text = this.current
      return text
    }
  },
  methods: {
  },
  watch: {},
  data () {
    return {
    }
  },

  // LIFECYCLE METHODS
  // ______________________________________
  beforeCreate () {
  },
  created () {
  },
  beforeMount () {
  },
  mounted () {
  },
  beforeUpdate () {
  },
  updated () {
  },
  beforeDestroy () {
  },
  destroyed () {
  }
}
</script>

<style lang="scss">
  html {
    background-color: rgba($color: #fff, $alpha: 0.8)
  }

  .search {
    margin: 0;
  }
</style>
