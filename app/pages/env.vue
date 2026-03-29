<template>
  <div>
    <h1 class="title">
      Environment Management
      <BulmaIconButton
        :icon="faSquarePlus"
        tooltip="Create New Environment"
        variant="ghost"
        icon-size="2x"
        class="ml-2"
        @click="modalOpen = true"
      />
    </h1>

    <div v-if="environments" class="tabs is-fullwidth">
      <ul>
        <li v-for="env in environments.envs" :key="env.name" :class="{ 'is-active': env.name === route.params.env }">
          <NuxtLink :to="`/env/${env.name}`">{{ env.alias }}</NuxtLink>
        </li>
      </ul>
    </div>

    <div class="env-page-container">
      <NuxtPage :page-key="route.params.env as string" :transition="pageTransition" />
    </div>

    <EnvNewModal v-if="modalOpen" v-model="modalOpen" />
  </div>
</template>

<script setup lang="ts">
import { faSquarePlus } from '@fortawesome/free-solid-svg-icons'

import BulmaIconButton from '~/components/bulma/BulmaIconButton.vue'
import EnvNewModal from '~/components/env/EnvNewModal.vue'
import { useEnvironments } from '~/composables/environments'

const route = useRoute()
const modalOpen = ref(false)

const { data: environments, suspense: environmentsSuspense } = useEnvironments()

await environmentsSuspense()

const first = environments.value?.envs?.at(0)
if (!route.params.env && first) {
  await navigateTo(`/env/${first.name}`)
}

const slideDirection = ref<'left' | 'right'>('left')

onBeforeRouteUpdate((to, from) => {
  const envs = environments.value?.envs ?? []
  const fromIdx = envs.findIndex((e) => e.name === from.params.env)
  const toIdx = envs.findIndex((e) => e.name === to.params.env)
  slideDirection.value = toIdx > fromIdx ? 'left' : 'right'
})

const pageTransition = computed(() => ({
  name: `slide-${slideDirection.value}`,
}))
</script>
