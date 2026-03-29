<template>
  <BulmaCardModal v-model="modelValue">
    <template #title>Create New Environment</template>

    <p class="mb-4">This will create a new environment which will spin up a new server on the specified proxy port.</p>

    <BulmaField
      v-bind="envAliasAttrs"
      v-model="envAlias"
      label="Environment Alias"
      placeholder="Enter Alias..."
      :error="errors.envAlias"
      help="Assign an alias to the environment so it's easier to know what it's for."
    />

    <BulmaField
      v-bind="proxyPortAttrs"
      v-model="proxyPort"
      label="Minecraft Proxy Port"
      placeholder="Enter Port..."
      :error="errors.proxyPort"
      :help="`The port the proxy will run on. Must be between ${minProxyPort}–${maxProxyPort} and not already used.`"
    />

    <BulmaField
      v-bind="descriptionAttrs"
      v-model="description"
      type="textarea"
      placeholder="Enter Description..."
      :error="errors.description"
      help="Add a description on what the environment is intended for."
    >
      <template #label>
        Environment Description
        <span class="has-text-weight-normal has-text-grey">(Optional)</span>
      </template>
    </BulmaField>

    <BulmaField label="Server Type" :error="errors.serverType" :help="selectedServerType?.hint">
      <template #default="{ hasError, id }">
        <div class="select is-fullwidth" :class="{ 'is-danger': hasError }">
          <select :id="id" v-bind="serverTypeAttrs" v-model="serverType">
            <option value="" disabled>Select a server type...</option>
            <option v-for="type in serverTypes" :key="type.id" :value="type.id">
              {{ type.name }}
            </option>
          </select>
        </div>
      </template>
    </BulmaField>

    <BulmaField
      v-bind="enableEnvProtectionAttrs"
      v-model:checked="enableEnvProtection"
      type="checkbox"
      label="Enable Env Protection"
      help='"Env Protection" will prevent deleting the environment. To disable protection, manually modify the config flag general.enable_environment_protection = false'
    />

    <template #footer="{ close }">
      <div class="buttons">
        <BulmaButton @click="close">Cancel</BulmaButton>
        <BulmaButton variant="primary" :disabled="isPending" @click="submit">Create New Environment</BulmaButton>
      </div>
    </template>
  </BulmaCardModal>

  <BulmaConfirmModal v-model="confirmOpen" title="Confirm New Environment Creation" @confirm="create">
    <p>
      You are about to create a new environment called <strong>{{ envAlias }}</strong> running on port
      <strong>{{ proxyPort }}</strong
      >.
    </p>
    <br />
    <p>Are you sure?</p>
  </BulmaConfirmModal>
</template>

<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { z } from 'zod'

import BulmaButton from '~/components/bulma/BulmaButton.vue'
import BulmaCardModal from '~/components/bulma/BulmaCardModal.vue'
import BulmaConfirmModal from '~/components/bulma/BulmaConfirmModal.vue'
import BulmaField from '~/components/bulma/BulmaField.vue'
import { useCreateEnvironment } from '~/composables/environments'
import { useNotificationStore } from '~/stores/notifications'

const modelValue = defineModel<boolean>({ required: true })

const config = useRuntimeConfig()
const minProxyPort = config.public.minProxyPort
const maxProxyPort = config.public.maxProxyPort

const MIN_ALIAS_LEN = 3
const MAX_ALIAS_LEN = 32
const MAX_DESCRIPTION_LEN = 2048

const serverTypes = [
  {
    name: 'Paper',
    id: 'PAPER',
    hint: 'Spins up a Paper server with Velocity compatibility settings preconfigured.',
  },
  {
    name: 'Fabric',
    id: 'FABRIC',
    hint: 'Spins up a Fabric server with Velocity compatibility mods automatically installed.',
  },
  {
    name: 'Custom',
    id: 'CUSTOM',
    hint: "Any type supported by itzg/minecraft-server — you'll need to configure it manually.",
  },
]

const zodSchema = z.object({
  envAlias: z
    .string()
    .min(MIN_ALIAS_LEN, `Must be at least ${MIN_ALIAS_LEN} characters.`)
    .max(MAX_ALIAS_LEN, `Must be at most ${MAX_ALIAS_LEN} characters.`),
  proxyPort: z
    .string()
    .regex(/^\d+$/, 'You must enter a numeric value!')
    .refine((v) => parseInt(v) >= minProxyPort, `Must be at least ${minProxyPort}.`)
    .refine((v) => parseInt(v) <= maxProxyPort, `Must be at most ${maxProxyPort}.`),
  description: z.string().max(MAX_DESCRIPTION_LEN, `Must be at most ${MAX_DESCRIPTION_LEN} characters.`).optional(),
  serverType: z.preprocess(
    (v) => (v === '' ? undefined : v),
    z.enum(['PAPER', 'FABRIC', 'CUSTOM'], { error: 'Please choose a server type!' }),
  ),
  enableEnvProtection: z.boolean(),
})
const schema = toTypedSchema(zodSchema)

const { errors, handleSubmit, defineField, resetForm } = useForm({
  validationSchema: schema,
  initialValues: {
    envAlias: '',
    proxyPort: '',
    description: '',
    serverType: '',
    enableEnvProtection: false,
  },
})

const [envAlias, envAliasAttrs] = defineField('envAlias')
const [proxyPort, proxyPortAttrs] = defineField('proxyPort')
const [description, descriptionAttrs] = defineField('description')
const [serverType, serverTypeAttrs] = defineField('serverType')
const [enableEnvProtection, enableEnvProtectionAttrs] = defineField('enableEnvProtection')

const selectedServerType = computed(() => serverTypes.find((t) => t.id === serverType.value))

const { mutate, isPending } = useCreateEnvironment()

const confirmOpen = ref(false)

type ValidatedForm = z.infer<typeof zodSchema>
const pendingValues = shallowRef<ValidatedForm | null>(null)

const submit = handleSubmit((values) => {
  pendingValues.value = values
  confirmOpen.value = true
})

const notifications = useNotificationStore()

function create() {
  const pending = pendingValues.value
  if (!pending) return
  mutate(
    {
      ENV_ALIAS: pending.envAlias,
      PROXY_PORT: parseInt(pending.proxyPort),
      DESCRIPTION: pending.description ?? '',
      SERVER_TYPE: pending.serverType,
      ENABLE_ENV_PROTECTION: pending.enableEnvProtection,
    },
    {
      async onSuccess(res) {
        modelValue.value = false
        notifications.notify(
          `Created new environment '${res.created_env.formatted}' running on port '${res.created_env.port}'`,
        )
        await navigateTo(`/env/${res.created_env.name}`)
      },
      onError: () => notifications.add({ message: 'Failed to create environment.', type: 'danger', duration: 4000 }),
    },
  )
}

watch(
  () => modelValue.value,
  (open) => {
    if (!open) {
      resetForm()
      pendingValues.value = null
    }
  },
)
</script>
