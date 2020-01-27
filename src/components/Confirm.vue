<template>
  <div id="conf-body" v-if="show">
    <div id="confirm">
      <p>{{text}}</p>
      <div>
        <img src="../assets/confirm.png" @click="confirmfn">
        <img src="../assets/cancel.png" @click="closefn">
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "Confirm",
        props: ["text","show","confirmfn","closefn"]
    }
</script>

<style scoped>
  #conf-body {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background: transparent;
    z-index: 3000;
  }
  #confirm {
    width: 20%;
    height: 200px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    position: absolute;
    top: calc(50% - 100px);
    left: calc(40% - 10px);
    background-color: #8FBC8F;
    border-radius: 10px;
    border: 2px solid lightgray;
  }
  #confirm p, #confirm div {
    width: 100%;
    text-align: center;
    color: black;
    border: 0;
    font-size: 18px;
  }
  #confirm div {
    display: flex;
    justify-content: space-around;
  }
  #confirm div img {
    width: 40px;
    height: 40px;
    cursor: pointer;
  }
  @media (max-width: 849px) {
    #confirm {
      width: 60%;
      left: calc(20% - 10px);
    }
    #confirm div img {
      width: 40px;
      height: 40px;
    }
  }
</style>
