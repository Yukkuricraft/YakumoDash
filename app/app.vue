<template>
  <div class="site">
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <NotificationSnackbar />
    <LoadingBar />
  </div>
</template>

<script setup lang="ts">
import LoadingBar from '~/components/LoadingBar.vue'
import NotificationSnackbar from '~/components/NotificationSnackbar.vue'
</script>
