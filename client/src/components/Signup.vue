<template>
    <div class="inner-block">
        <div class="vue-tempalte">
            <form id="form-signup" @submit.prevent="handleSignUp">
                <h3>Sign Up</h3>

                <div class="form-group">
                    <label>Email</label>
                    <input v-model="email" name="email" id="email" type="email" class="form-control form-control-lg" />
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <input v-model="password" name="password" id="password" type="password"
                        class="form-control form-control-lg" />
                </div>
                <div class="form-check">
                    <label class="form-check-label" for="flexCheckDefault">
                        Admin
                    </label>
                    <input v-model="admin" class="form-check-input" type="checkbox" value="" id="admin">
                </div>
                <button type="submit" class="btn btn-dark btn-lg btn-block mt-2">Sign Up</button>
                <p class="forgot-password text-right">
                    Already registered
                    <router-link :to="{ name: 'login' }">sign in?</router-link>
                </p>
            </form>
            <p style="color: red;" v-if="errorMessage">{{ errorMessage }}</p>
        </div>
    </div>
</template>
<script>
import { clearAllStoreData, register } from "../services/auth"
export default {
    name: 'FormSignup',
    data: function () {
        return {
            email: '',
            password: '',
            admin: '',
            errorMessage: '',
        }
    },
    methods: {
        handleSignUp: async function () {
            try {
                await register({ email: this.email, password: this.password, access_level: this.admin ? 1 : 2 });
                this.$router.replace('/login');
            } catch (error) {
                this.errorMessage = error.response.data.errors[0].detail || error?.message || 'Failed to create new user'
            }
        }
    },
    mounted() {
        //localStorage.removeItem('token')
        clearAllStoreData();
    }
}
</script>