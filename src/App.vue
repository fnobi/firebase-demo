<template lang="pug">
.wrapper
  h1.cell--ttl firebase-demo
  h2.cell--btn(@click="countUp") counter: {{ counter }}
</template>

<style lang="scss">
.wrapper {
  max-width: 500px;
  margin: auto;
}

.cell {
  margin: 1em;
  padding: 1em;
  text-align: center;
}
.cell--ttl {
  @extend .cell;
  border: solid 1px #eee;
}
.cell--btn {
  @extend .cell;
  background-color: #eee;
  cursor: pointer;
  user-select: none;
  &:hover {
    background-color: #fee;
  }
}
</style>

<script>
import firebase from "@/firebase";

const refCounter = firebase.database().ref("/counter");

export default {
  name: "app",
  data: () => ({
    counter: 0
  }),
  methods: {
    countUp() {
      refCounter.transaction(num => {
        return Number(num) + 1;
      });
    }
  },
  mounted() {
    refCounter.on("value", snapshot => {
      this.counter = snapshot.val();
    });
  }
};
</script>
