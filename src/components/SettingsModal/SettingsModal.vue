<template>
  <ion-modal :is-open="isOpen">
    <ion-header>
      <ion-toolbar>
        <ion-title>Настройки</ion-title>
        <ion-buttons slot="start">
          <ion-button @click="isOpen = false">
            <ion-icon :icon="close" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-list lines="none">
        <ion-item>
          <ion-toggle :checked="darkMode" @ion-change="toggleDarkTheme"
            >Темная тема</ion-toggle
          >
        </ion-item>
        <ion-item>
          <ion-toggle :checked="isAutoTheme" @ion-change="toggleAutoTheme"
            >Автоматически определять тему</ion-toggle
          >
        </ion-item>
        <ion-item :button="true" id="open-action-sheet">
          <ion-label> Очистить данные </ion-label>
          <ion-icon :icon="trashBin" />
        </ion-item>
      </ion-list>
    </ion-content>
    <ion-action-sheet
      trigger="open-action-sheet"
      header="Очистить данные ?"
      :buttons="actionSheetButtons"
    ></ion-action-sheet>
  </ion-modal>
</template>

<script lang="ts" setup>
import {
  IonButtons,
  IonButton,
  IonModal,
  IonHeader,
  IonToolbar,
  IonContent,
  IonTitle,
  IonIcon,
  IonList,
  IonToggle,
  IonItem,
  IonLabel,
  IonActionSheet,
} from "@ionic/vue";
import { Storage } from "@ionic/storage";
import { onMounted, ref } from "vue";
import { DARK_MODE_KEY, IS_AUTO_THEME } from "@/constants";
import { close, trashBin } from "ionicons/icons";
import { useHabitsStore } from "@/store/habitsStore";

const isOpen = defineModel();
const store = new Storage();
const darkMode = ref(false);
const isAutoTheme = ref(false);
const habitsStore = useHabitsStore()


const actionSheetButtons = [
  {
    text: "Очистить",
    role: "destructive",
    icon: trashBin,
    handler: habitsStore.clearHabits,
    data: {
      action: "delete",
    },
  },
  {
    text: "Отмена",
    icon: close,
    role: "cancel",
    data: {
      action: "cancel",
    },
  },
];

onMounted(async () => {
  await store.create();
  const _isAutoTheme = await store.get(IS_AUTO_THEME);

  if (_isAutoTheme === null || _isAutoTheme) {
    isAutoTheme.value = true;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
    darkMode.value = prefersDark.matches;
  } else {
    const isDarkMode = await store.get(DARK_MODE_KEY);
    if (isDarkMode) {
      darkMode.value = isDarkMode;
    }
  }
});

const toggleDarkTheme = async (shouldAdd: any) => {
  darkMode.value = shouldAdd.detail.checked;
  document.body.classList.toggle("dark", darkMode.value);

  isAutoTheme.value = false;
  await store.set(IS_AUTO_THEME, isAutoTheme.value);
  await store.set(DARK_MODE_KEY, darkMode.value);
};

const toggleAutoTheme = async (e: any) => {
  isAutoTheme.value = e.detail.checked;
  await store.set(IS_AUTO_THEME, isAutoTheme.value);
  await store.set(DARK_MODE_KEY, darkMode.value);
};
</script>

<style scoped lang="scss">
ion-header {
  border-radius: 16px;
  overflow: hidden;
  left: 10px;
  right: 10px;
  top: 20px;
  width: calc(100% - 20px);
}

ion-content {
  --padding-top: 40px;
}

ion-list {
  border-radius: 8px;
}
ion-action-sheet {
   &:deep(.action-sheet-wrapper) {
    border-radius: 16px;
    overflow: hidden;
   }
 
  
}
</style>
