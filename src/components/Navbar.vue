<template>
  <div>
    <v-snackbar v-model="snackbar" :timeout="6000" top color="success">
      <span>You are loggout correctly!</span>
      <v-btn @click="close" color="black">Close</v-btn>
    </v-snackbar>
    <v-toolbar>
      <v-toolbar-title>
        <router-link class="link" :to="{ name: 'home' }">
          <h1 class="title_todo">
            <span class="grey--text">ToDo</span>
            <span class="green--text">App</span>
          </h1>
        </router-link>
      </v-toolbar-title>

      <v-spacer></v-spacer>
      <template v-if="user.loggedIn">
        <div class="nav-item pr-4">
          <span class="link"> hi, {{ user.data.displayName }}</span>
        </div>
        <li class="nav-item">
          <a class="grey--text text-uppercase" @click.prevent="signOut"
            >Sign out</a
          >
        </li>
      </template>
      <template v-else>
        <v-toolbar-items>
          <router-link class="link" :to="{ name: 'signin' }">
            <v-btn text class="btn" height="100%"
              ><span class="green--text">Sign In</span></v-btn
            >
          </router-link>
          <router-link class="link" :to="{ name: 'register' }">
            <v-btn text height="100%"
              ><span class="red--text">Register</span></v-btn
            >
          </router-link>
        </v-toolbar-items>
      </template>
    </v-toolbar>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import firebase from "firebase";
export default {
  data: () => ({
    snackbar: false
  }),
  computed: {
    // map `this.user` to `this.$store.getters.user`
    ...mapGetters({
      user: "user"
    })
  },
  methods: {
    close() {
      this.snackbar = false;
    },
    signOut() {
      this.snackbar = true;
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.replace({
            name: "signin"
          });
        });
    }
  }
};
</script>
<style scoped>
.link {
  text-decoration: none;
  font-family: "Roboto", sans-serif;
}
.nav-item {
  list-style: none;
  font-family: "Roboto", sans-serif;
}
.title_todo {
  font-size: 24px;
}
</style>
