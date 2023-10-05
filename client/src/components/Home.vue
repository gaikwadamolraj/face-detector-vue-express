<template>
   
    <div class="inner-block">
        <h2>Home Page</h2>
    </div>
</template>
<script>
export default {
    mounted() {
        const token = localStorage.getItem('token');
        if(token) {
            this.$router.replace('/requests');
        } else {
            this.$router.replace('/login');
        }
    }
}
</script>
