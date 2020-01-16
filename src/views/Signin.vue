<template>
  <v-container>
    <v-layout row justify-center>
      <v-snackbar v-model="snackbar" :timeout="6000" top color="success">
        <span>You are logged correctly!</span>
        <v-btn @click="close" color="black">Close</v-btn>
      </v-snackbar>
      <v-snackbar v-model="snackbar2" :timeout="6000" top color="success">
        <span>Wrong e-mail or password!</span>
        <v-btn color="black">Close</v-btn>
      </v-snackbar>
      <v-col cols="12" sm="6" xs="3">
        <v-card class="elevation-12 center" light flat>
          <v-form ref="form" v-model="valid">
            <h1 class="mt-4">Sign In</h1>
            <v-text-field
              v-model="email"
              :rules="emailRules"
              label="E-mail"
              required
            ></v-text-field>

            <v-text-field
              v-model="password"
              :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="[rules.required, rules.min]"
              :type="show1 ? 'text' : 'password'"
              name="input-10-1"
              label="Password"
              hint="At least 8 characters"
              required
              counter
              @click:append="show1 = !show1"
            ></v-text-field>

            <v-btn
              :disabled="!valid"
              color="success"
              class="mb-4 mt-4"
              @click="validate"
              :loading="loading"
            >
              Log In
            </v-btn>
          </v-form>
        </v-card>
        <v-layout column class="center">
          <h2 class="error--text">Login: user@user.pl</h2>
          <h2 class="error--text">Password: user1234</h2>
        </v-layout>
      </v-col>
    </v-layout>
  </v-container>
</template>

<script>
import firebase from "../fb";
export default {
  data: () => ({
    valid: true,
    show1: false,
    password: "",
    rules: {
      required: value => !!value || "Password required.",
      min: v => v.length >= 8 || "Min 8 characters"
    },
    email: "",
    emailRules: [
      v => !!v || "E-mail is required",
      v => /.+@.+\..+/.test(v) || "E-mail must be valid"
    ],
    error: "",
    snackbar: false,
    snackbar2: false,
    loading: false
  }),
  methods: {
    close() {
      this.snackbar = false;
    },
    validate() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        this.snackbar = true;
        firebase
          .auth()
          .signInWithEmailAndPassword(this.email, this.password)
          .then(() => {
            this.$router.replace({ name: "home" });
          })
          .catch(err => {
            this.loading = false;
            this.snackbar2 = true;
            this.error = err.message;
          });
      }
    }
  }
};
</script>

<style scoped>
.center {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}
</style>
