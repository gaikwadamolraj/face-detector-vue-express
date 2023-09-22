<template>
  <div class="row d-flex justify-content-center">
    <!--Grid column-->
    <div class="col-md-6">
      
      <table class="table">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Status</th>
            <th scope="col">Source</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="request in requests" :key="request.id">
            <td>{{ request.name }}</td>
            <td>{{ request.status }}</td>
            <td><img height="50" width="50" src="/api/static/resources/static/uploads/amol.jpg"></td>
          </tr>
        </tbody>
      </table>
    </div>
    <!--Grid column-->
  </div>
</template>

<script>
import { requests } from "../services/requests"
export default {
  name: 'Requests',
  data() {
    return {
      requests: [],
      interval: null
    }
  },
  methods: {
    async Requests() {
      try {
        const res  = await requests()
        this.requests = res.data
      } catch (error) {
        if (error.response.status === 401) {
            this.$router.replace('/login')
        }
      }
    }
  },
  mounted() {
    const token = localStorage.getItem('token');
    if(token) {
      this.Requests();
    } else {
      this.$router.replace('/login')
    }
  },
  created(){
    this.interval = setInterval(() =>{
      this.Requests()},3000)
  },
  destroyed(){
    clearInterval(this.interval)
  }
}
</script>