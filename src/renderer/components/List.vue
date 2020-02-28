<template>
  <div class="list">
    <div :class="{'list-item': true, 'is-selected': index===selectedIndex}" v-for="(item, index) in items" :key="item._id">
      {{item.text}}
    </div>
  </div>
</template>

<script>
export default {
  // COMPONENT
  // ______________________________________
  components: {},
  props: {
    items: Array,
    selectedIndex: Number
  },
  computed: {},
  methods: {
    handleKeys (ev) {
      this.$emit('keydown', ev)
    }
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
