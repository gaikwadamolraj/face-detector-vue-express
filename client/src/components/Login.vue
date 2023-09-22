<template>
    <div class="inner-block">
        <div class="vue-tempalte">

            <form id="form-login" @submit.prevent="handleSignIn">

                <h3>Sign In</h3>

                <div class="form-group">
                    <label>Email</label>
                    <input v-model="email" type="email" class="form-control form-control-lg" />
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <input v-model="password" type="password" class="form-control form-control-lg" />
                </div>
                <button type="submit" class="btn btn-dark btn-lg btn-block mt-2">Sign In</button>
            </form>
            <p style="color: red;" v-if="errorMessage">{{ errorMessage }}</p>
        </div>
    </div>
</template>
<script>
import { login } from "../services/auth"
export default {
    name: 'Login',
    data: function () {
        return {
            email: '',
            password: '',
            errorMessage: ''
        }
    },
    methods: {
        handleSignIn: async function () {
            try {
                const res = await login({ email: this.email, password: this.password });
                const { token } = res.data
                localStorage.removeItem('token')
                localStorage.setItem('token', token)
                this.$router.replace('/requests');
            } catch (error) {
                this.errorMessage = error.response.data.errors[0].detail || error?.message || 'Failed to login'
            }
        }
    }
}
</script>