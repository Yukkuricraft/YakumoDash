<template>
  <div v-if="env" class="columns">
    <div class="column is-3">
      <h2 class="title is-5">Overview</h2>
      <EnvSummary :env-name="envName" :env="env" />
    </div>

    <div class="column is-9">
      <div class="block">
        <h2 class="title is-5">Aux Containers</h2>
        <div v-if="definedContainersData.isPending.value" class="has-text-grey">Loading containers…</div>
        <EnvContainerList v-else :env-name="envName" :containers="auxContainers" />
      </div>

      <div class="block">
        <h2 class="title is-5">Server Containers <span class="is-size-7">(World Groups)</span></h2>
        <div v-if="definedContainersData.isPending.value" class="has-text-grey">Loading containers…</div>
        <EnvContainerList v-else :env-name="envName" :containers="mcContainers" />
      </div>
    </div>
  </div>
  <div v-else-if="environments.isPending">Loading...</div>
  <BulmaNotification v-else type="warning">
    Environment <strong>{{ envName }}</strong> was not found.
  </BulmaNotification>
</template>

<script setup lang="ts">
import BulmaNotification from '~/components/bulma/BulmaNotification.vue'
import EnvContainerList from '~/components/env/EnvContainerList.vue'
import EnvSummary from '~/components/env/EnvSummary.vue'
import { AuxContainerTypes, ContainerType, getContainerType, useDefinedContainers } from '~/composables/containers'
import { useEnvironments } from '~/composables/environments'

const route = useRoute()
const envName = computed(() => route.params.env as string)

const environments = useEnvironments()
const env = computed(() => environments.data.value?.envs.find((e) => e.name === envName.value))

const definedContainersData = useDefinedContainers(envName)

const auxContainers = computed(() =>
  (definedContainersData.data.value?.defined_containers ?? []).filter((c) =>
    AuxContainerTypes.includes(getContainerType(c.labels)),
  ),
)

const mcContainers = computed(() =>
  (definedContainersData.data.value?.defined_containers ?? []).filter(
    (c) => getContainerType(c.labels) === ContainerType.Minecraft,
  ),
)
</script>
