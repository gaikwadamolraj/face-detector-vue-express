<template>
  <div class="row d-flex justify-content-center">
    <!--Grid column-->
    <div class="col-md-6">
      <router-link class="btn btn-outline-primary float-right pl-1" to="/upload">New Request</router-link>
      <table class="table">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Status</th>
            <th scope="col">Faces</th>
            <th scope="col">Source</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="request in requests" :key="request.id">
            <td>{{ request.name }}</td>
            <td>{{ request.status }}</td>
            <td>{{ request.faces }}</td>
            <td>
              <img :src="request.path" height="50" width="50">
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!--Grid column-->
  </div>
</template>

<script>
import { clearAllStoreData, isAdmin } from "@/services/auth"
import { fetchRequests, isReqInProcess } from "../services/requests"
export default {
  name: 'Requests',
  data() {
    return {
      requests: [],
      interval: null
    }
  },
  methods: {
    clearPollingCall() {
      if(this.interval) {
        const isAdminUser = isAdmin();
        // Clear req only for non admin user.
        if(!isAdminUser) {
          clearInterval(this.interval)
        }
      }
    },
    async getRequests() {
      try {
        const allRequests = await fetchRequests();
        const anyInProcess = isReqInProcess(allRequests);
        
        if(!anyInProcess) {
          this.clearPollingCall()
        }
        this.requests = allRequests;
      } catch (error) {
        console.log('err ', error)
        if (error?.response?.status === 401) {
          clearAllStoreData();
          this.$router.replace('/login')
        }
      }
    }
  },
  mounted() {
    const token = localStorage.getItem('token');
    if (token) {
      this.getRequests();
    } else {
      this.$router.replace('/login')
    }
  },
  created() {
    this.interval = setInterval(() => {
      this.getRequests()
    }, 3000)
  },
  destroyed() {
    this.clearPollingCall()
  }
}
</script>