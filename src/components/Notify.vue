<template>
  <div class="notify" :class="[{'back-red':error},{'show':text !== ''}]">{{text}}</div>
</template>

<script>
    export default {
        name: "Notify",
        props: ["text","error"],
        // data() {
        //     return {
        //         title: ''
        //     }
        // },
        watch: {
            // text(val) {
            //     if (val !== '') {
            //         setTimeout(function () {
            //             this.title = '';
            //             if (this.error) {
            //                 this.error = false;
            //             }
            //         }.bind(this), 2000);
            //     }
            // }
        }
    }
</script>

<style scoped>
  .notify {
    text-align: center;
    height: 18px;
    padding: 15px 5px 15px;
    max-width: 0;
    min-width: 0;
    background-color: green;
    color: white;
    transition: all .10s;
    /*max-width .10s,*/
    /*opacity .10s;*/
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    overflow: hidden;
    white-space: nowrap;
  }
  .show {
    min-width: 30%;
    max-width: 100%;
    opacity: 1;
  }
  .back-red {
    background-color: red!important;
  }
</style>
