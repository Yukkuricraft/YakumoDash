<template>
  <Teleport to="body">
    <div class="snackbar-container">
      <TransitionGroup name="snackbar">
        <div
          v-for="notification in notifications.notifications"
          :key="notification.id"
          class="notification snackbar-item"
          :class="`is-${notification.type}`"
        >
          <span>{{ notification.message }}</span>
          <div class="snackbar-actions">
            <BulmaButton
              v-if="notification.action"
              size="small"
              variant="inverted"
              @click="
                () => {
                  notification.action!.fn()
                  notifications.remove(notification.id)
                }
              "
            >
              {{ notification.action.label }}
            </BulmaButton>
            <button class="delete" @click="notifications.remove(notification.id)" />
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import BulmaButton from '~/components/bulma/BulmaButton.vue'
import { useNotificationStore } from '~/stores/notifications'

const notifications = useNotificationStore()
</script>

<style scoped>
.snackbar-container {
  position: fixed;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
  pointer-events: none;
}

.snackbar-item {
  pointer-events: all;
  min-width: 20rem;
  max-width: 40rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding-right: 1rem;
  margin: 0;
}

.snackbar-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.snackbar-enter-active,
.snackbar-leave-active {
  transition: all 0.2s ease;
}

.snackbar-enter-from,
.snackbar-leave-to {
  opacity: 0;
  transform: translateY(1rem);
}
</style>
