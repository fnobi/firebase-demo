<template lang="pug">
.wrapper
  h1.cell--ttl firebase-demo
  h2.cell--btn(@click="countUp") counter: {{ counter }}
  .cell--btn(v-if="!userEmail" @click="loginWithGoogle") login
  template(v-else)
    .cell
      span {{ userEmail }}
      a(href="#" @click.prevent="logout") logout
    ul
      li.cell--li(v-for="(item, id) in userItems")
        span {{ item.comment }}
        a(href="#" @click.prevent="removeUserItem(id)") ✗
    .cell--btn(@click="addUserItem") add item
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
  span, a {
    display: inline-block;
    margin-right: 0.5em;
    &:last-child {
      margin-right: 0;
    }
  }
}
.cell--ttl {
  @extend .cell;
  background-color: #888;
  color: #fff;
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
.cell--li {
  @extend .cell;
  border-bottom: solid 1px #eee;
  &:last-child {
    border-bottom: none;
  }
}
</style>

<script>
import firebase from "@/firebase";

const refCounter = firebase.database().ref("/counter");
const refItem = firebase.database().ref("/item");

export default {
  name: "app",
  data: () => ({
    counter: 0,
    userEmail: null,
    userUid: null,
    userItems: null
  }),
  methods: {
    countUp() {
      refCounter.transaction(num => {
        return Number(num) + 1;
      });
    },
    addUserItem() {
      if (!this.userUid) return;
      const comment = prompt();
      if (!comment) return;
      refItem.child(this.userUid).push({
        comment,
      });
    },
    removeUserItem(id) {
      if (!this.userUid) return;
      refItem.child(`${this.userUid}/${id}`).remove();
    },
    setCounterHook() {
      refCounter.on("value", snapshot => {
        this.counter = snapshot.val();
      });
    },
    setAuthHook() {
      firebase.auth().onAuthStateChanged(user => {
        this.updateAuthState(user);
      });
      firebase.auth().getRedirectResult();
    },
    updateAuthState(user) {
      this.userEmail = user ? user.email : null;
      this.userUid = user ? user.uid : null;
    },
    loginWithGoogle() {
      const provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithRedirect(provider);
    },
    logout() {
      firebase.auth().signOut();
    }
  },
  watch: {
    userUid(newUid, oldUid) {
      if (oldUid) {
        refItem.child(oldUid).off();
      }
      if (newUid) {
        refItem.child(newUid).on("value", snapshot => {
          this.userItems = snapshot.val();
        });
      }
    }
  },
  mounted() {
    this.setAuthHook();
    this.setCounterHook();
  }
};
</script>
