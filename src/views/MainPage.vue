<template>
  <ion-page>
    <ion-header :translucent="false">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="isSettingsModalOpen = true">
            <ion-icon slot="icon-only" :icon="settingsOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Трэкер привычек</ion-title>
        <ion-buttons slot="secondary">
          <ion-button @click="isModalOpen = true">
            <ion-icon slot="icon-only" :icon="addCircleOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">HabitTrack</ion-title>
        </ion-toolbar>
      </ion-header>

      <div id="container" class="ion-padding">
        <HabitCard
          class="ion-margin-bottom"
          v-for="habit in habits"
          :habit="habit"
          :key="habit.title"
        />
      </div>

      <ion-fab slot="fixed" vertical="bottom" horizontal="end">
        <ion-fab-button @click="isModalOpen = true">
          <ion-icon :icon="addOutline"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
    <HabitCreateModal v-model="isModalOpen" @create-habit="handleCreateHabit" />
    <SettingsModal v-model="isSettingsModalOpen" />
    <HabitModal v-if="isHabitEditModalOpen"/>

  </ion-page>
</template>

<script setup lang="ts">
import HabitCard from "@/components/HabitCard";
import HabitCreateModal from "@/components/HabitCreateModal";
import SettingsModal from "@/components/SettingsModal";
import HabitModal from "@/components/HabitModal";
import {
  IonButtons,
  IonContent,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonIcon,
  IonHeader,
  IonFab,
  IonFabButton,
} from "@ionic/vue";
import { addCircleOutline, addOutline, settingsOutline } from "ionicons/icons";
import type { Habit } from "@/types";
import { ref, onMounted } from "vue";

import { useHabitsStore } from "@/store/habitsStore";
import { storeToRefs } from "pinia";

const isModalOpen = ref(false);
const isSettingsModalOpen = ref(false);

const habitsStore = useHabitsStore()

const { habits, isHabitEditModalOpen } = storeToRefs(habitsStore)

onMounted(async () => {
  habitsStore.initHabits()
})


const handleCreateHabit = async (event: Habit) => {
  isModalOpen.value = false;
  habitsStore.saveHabit(event)
};

</script>

<style scoped>
ion-header {
  border-radius: 16px;
  overflow: hidden;
  left: 10px;
  right: 10px;
  top: 20px;
  width: calc(100% - 20px);
}

ion-content {
  --padding-top: 20px;
}


</style>
