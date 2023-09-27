<template>
  <div class="vue-tempalte">
    <!-- Navigation -->
    <nav class="navbar shadow bg-white rounded justify-content-between flex-nowrap flex-row fixed-top">
      <div class="container">
        <div class="navbar-brand float-left">
          Face Detection App
        </div>

        <ul class="nav navbar-nav flex-row float-right pl-1" v-if="!isLoggedIn">
          <li class="nav-item">
            <router-link class="nav-link ml-1" to="/login">Sign in</router-link>
          </li>

          <li class="nav-item">
            <router-link class="btn btn-outline-primary" to="/signup">Sign up</router-link>
          </li>
        </ul>
        <ul class="nav navbar-nav flex-row float-right" v-else="isLoggedIn">
          <li class="nav-item">
            <router-link class="nav-link ml-2" to="/login">Sign out</router-link>
          </li>
        </ul>
      </div>
    </nav>
    <!-- Main -->
    <div class="App">
      <div class="vertical-center">
        <router-view />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'App',
  data: function () {
    return {
      isLoggedIn: !localStorage.getItem('token') ? false : true
    }
  }
}
</script>