<template>
  <div class="main">
    <input ref="searcher" class="search" type="search" :value="search" @input="doSearch" @keydown="handleKeys">
    <div class="app">
      <list :selected-index="selectedIndex" :items="items" @keydown="handleKeys" />
      <selected-text :current="current" />
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import List from './List'
import SelectedText from './SelectedText'
export default {
  // COMPONENT
  // ______________________________________
  components: {
    List,
    SelectedText
  },
  props: {},
  computed: {
    max () {
      return this.items.length
    },
    current () {
      if (!this.items) {
        return null
      }
      if (this.items.length === 0) {
        return null
      }
      return this.items[this.selectedIndex]
    }
  },
  methods: {
    handleKeys (ev) {
      console.log(ev)
      if (ev.key === 'Enter') {
        ipcRenderer.send('insert', this.current)
      }
      if (ev.key === 'ArrowUp') {
        ev.preventDefault()
        if (this.selectedIndex === 0) {
          this.selectedIndex = this.max
        }
        if (this.selectedIndex > 0) {
          this.selectedIndex--
        }
      }
      if (ev.key === 'ArrowDown') {
        ev.preventDefault()
        if (this.selectedIndex >= this.max - 1) {
          this.selectedIndex = 0
        } else {
          this.selectedIndex++
        }
      }
    },
    doSearch (ev) {
      this.search = ev.target.value
      ipcRenderer.send('search', this.search)
    }
  },
  watch: {},
  data () {
    return {
      items: [],
      selectedIndex: 0,
      search: ''
    }
  },

  // LIFECYCLE METHODS
  // ______________________________________
  beforeCreate () {
  },
  created () {
    ipcRenderer.on('current-docs', (ev, data) => {
      console.log(data)
      this.items = data
    })
  },
  beforeMount () {
  },
  mounted () {
    this.$refs.searcher.focus()
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
  .main {
    .search {
      width: 100%;
      border: none !important;
      outline: none;
      border-radius: none;
      border-bottom: 1px solid #efefef !important;
    }
    .app {
      display: flex;

      .selected-text {
        padding: 1rem;
      }

      .list {
        width: 30%;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        border-right: 1px solid #efefef;

        .list-item {
          padding: 0.75rem 0.5rem;
          text-overflow: ellipsis;
          overflow: hidden;
          border-bottom: 1px solid #efefef;
          height: 30px;

          &.is-selected {
            background-color: blue;
            color: white;
          }
        }
      }
    }
  }
</style>
