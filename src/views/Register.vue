<template>
  <v-container>
    <v-layout row justify-center>
      <v-snackbar v-model="snackbar" :timeout="6000" top color="success">
        <span>You are registered correctly!</span>
        <v-btn @click="close" color="black">Close</v-btn>
      </v-snackbar>
      <v-snackbar v-model="snackbar2" :timeout="6000" top color="success">
        <span>Wrong e-mail or password!</span>
        <v-btn color="black">Close</v-btn>
      </v-snackbar>
      <v-col cols="12" sm="6" xs="3">
        <v-card class="elevation-12 center" light flat>
          <v-form ref="form" v-model="valid">
            <h1 class="mt-4">Register</h1>
            <v-text-field
              v-model="name"
              :rules="[nameRules.required, nameRules.min]"
              label="Name"
              required
            ></v-text-field>
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

            <v-checkbox
              v-model="checkbox"
              :rules="[v => !!v || 'You must agree to continue!']"
              label="Do you agree?"
              required
            ></v-checkbox>

            <v-btn
              :disabled="!valid"
              color="success"
              class="mb-4 mt-4"
              @click="validate"
              :loading="loading"
            >
              Register
            </v-btn>
          </v-form>
        </v-card>
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
    name: "",
    nameRules: {
      required: value => !!value || "Name required.",
      min: v => v.length >= 3 || "Min 3 characters"
    },
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
    checkbox: false,
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
        this.snackbar = true;
        this.loading = true;
        firebase
          .auth()
          .createUserWithEmailAndPassword(this.email, this.password)
          .then(data => {
            data.user
              .updateProfile({
                displayName: this.name
              })
              .then(() => {
                this.loading = false;
                this.snackbar2 = true;
                this.$router.replace({ name: "home" });
              });
          })
          .catch(err => {
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
