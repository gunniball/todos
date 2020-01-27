<template>
  <router-view/>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style>
body {
  background-color: rgba(0,0,0,0.2);
  width: 100%;
  height: 100%;
  margin: 0;
}
button {
  background-color: rgba(0,0,0,0.2);
  color: #000000;
  border-radius: 10px;
  /*height: 2rem;*/
  margin-right: 20px;
  cursor: pointer;
  white-space: nowrap;
  font-weight: 500;
  font-size: 15px;
}
.content {
  width: 100%;
  text-align: center;
}
.btn-div {
  width: 100%;
  min-height: 40px;
  position: absolute;
  left: 0;
  bottom: -50px;
  display: flex;
  justify-content: center;
}
.btn-div button {
  min-width: 33%;
  max-width: 33%;
  margin-right: 1%;
}
@media (min-width: 850px) {
  .content {
    width: 50%;
    margin-left: 25%;
  }
  .show {
    min-width: 30%;
  }
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
