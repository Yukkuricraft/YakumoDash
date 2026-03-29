<template>
  <BulmaCard title="Summary">
    <dl class="env-summary mb-3">
      <dt>Running on Port:</dt>
      <dd>{{ envConfig['cluster-variables'].VELOCITY_PORT }}</dd>

      <dt>Server Version:</dt>
      <dd>{{ envConfig['cluster-variables'].MC_VERSION }}</dd>

      <dt>Server Type:</dt>
      <dd>{{ envConfig['cluster-variables'].MC_TYPE }}</dd>

      <dt>Server Build:</dt>
      <dd>{{ envConfig['cluster-variables'].PAPER_BUILD }}</dd>
    </dl>

    <p class="mb-4" style="white-space: pre-line">{{ envConfig.general.description }}</p>

    <EnvSummaryButtons :env-name="envName" :env="env" />
  </BulmaCard>
</template>

<script setup lang="ts">
import type { components } from '#open-fetch-schemas/yc-api'

import BulmaCard from '~/components/bulma/BulmaCard.vue'
import EnvSummaryButtons from '~/components/env/EnvSummaryButtons.vue'

interface EnvConfig {
  general: {
    description: string
    enable_env_protection: boolean
    enable_backups: boolean
    hostname: string
  }
  'world-groups': {
    enabled_groups: string[]
  }
  'cluster-variables': {
    ENV_ALIAS: string
    VELOCITY_PORT: number
    MC_TYPE: string
    MC_FS_ROOT: string
    MC_VERSION: string
    YC_REPO_ROOT: string
    BACKUPS_ROOT: string
    PAPER_BUILD?: string
  } & Record<string, string>
}

const props = defineProps<{ envName: string; env: components['schemas']['EnvModel'] }>()

const envConfig = computed(() => props.env.config as unknown as EnvConfig)
</script>

<style scoped>
.env-summary {
  display: grid;
  grid-template-columns: max-content 1fr;
  column-gap: 0.75rem;
  row-gap: 0.15rem;
}

.env-summary dt {
  font-weight: 600;
}

.env-summary dd {
  font-style: italic;
}
</style>
