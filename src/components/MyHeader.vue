<template>
  <div class="header">
    <notify :text="text" :error="error"></notify>
    <div class="header-title">{{title}}</div>
    <img src="../assets/new-note.png" @click="clickfn" v-if="home">
    <img src="../assets/home-page.png" @click="clickfn" v-if="note">
  </div>
</template>

<script>
    import Notify from "./Notify";
    export default {
        name: "MyHeader",
        components: {
            Notify,
        },
        props: ["title","clickfn","text","error"],
        data() {
          return {
              home: true,
              note: false,
          }
        },
        methods: {
            checkTitle () {
                switch (this.title) {
                    case 'My notes':
                        this.home = true;
                        this.note = false;
                        break;
                    case 'New note':
                    case 'Edit note':
                        this.home = false;
                        this.note = true;
                }
            },
            changePosition () {
                if (window.scrollY > parseInt(getComputedStyle(this.$el).height)) {
                    this.$el.style.top = window.scrollY + 'px';
                } else {
                    this.$el.style.top = 0;
                }
            }
        },
        mounted() {
            this.checkTitle();
        },
        created () {
            window.addEventListener('scroll', this.changePosition);
        },
        watch: {
            title() {
                this.checkTitle();
            }
        }
    }
</script>

<style scoped>
  .header {
    width: 100%;
    display: flex;
    background-color: rgba(0, 0, 0, 0.2);
    padding: 10px 0 10px 0;
    position: relative;
    z-index: 2000;
  }
  .header .header-title {
    width: 100%;
  }
  .header-title {
    text-align: center;
    font-size: 1.5rem;
    white-space: nowrap;
    flex: 3;
  }
  .header img {
    width: 40px;
    height: 40px;
    position: absolute;
    top: calc(50% - 20px);
    right: 25.5%;
    cursor: pointer;
  }
  @media (max-width: 800px) {
    .header img {
      right: 10px;
    }
  }
</style>
