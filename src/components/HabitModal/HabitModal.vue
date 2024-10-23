<template>
  <ion-backdrop
    :visible="isHabitEditModalOpen"
    :tappable="true"
    @ionBackdropTap="isHabitEditModalOpen = false"
  >
  </ion-backdrop>
  <div class="content" v-if="isHabitEditModalOpen">
    <div class="header">
      <div class="header-text">
        <h5 class="title">{{ selectedHabit?.title }}</h5>
        <p class="desc">{{ selectedHabit?.description }}</p>
      </div>
      <ion-button fill="clear" @click="isHabitEditModalOpen = false">
        <ion-icon :icon="closeOutline" />
      </ion-button>
    </div>

    <div class="grid">
      <div
        class="cell"
        v-for="day in dayBorder"
        :class="isChecked(day) ? 'cell-checked' : ''"
        :key="day"
      ></div>
    </div>
    <div class="footer">
      <ion-button @click="toggleCheck">
        <div class="mark" :class="isChecked(dayBorder) ? 'mark-checked' : ''">

        </div>
        Завершить
      </ion-button>
      <ion-button @click="isCalendarModalOpen = true">
        <ion-icon :icon="calendarOutline" slot="icon-only"/>
      </ion-button>
      <ion-button id="open-action-sheet">
        <ion-icon :icon="trashBinOutline" slot="icon-only"/>
      </ion-button>
      <ion-button @click="isModalOpen = true">
        <ion-icon :icon="pencilOutline" slot="icon-only"/>
      </ion-button>
    </div>
    <ion-action-sheet
      trigger="open-action-sheet"
      header="Удалить привычку ?"
      :buttons="actionSheetButtons"
    ></ion-action-sheet>
    <HabitCreateModal :is-edit="true" :habit="selectedHabit" v-model="isModalOpen" @create-habit="handleCreateHabit" />
    <CalendarModal  @toggle-mark="handleToggle" v-model="isCalendarModalOpen" :highlitedDates="habitsStatistic" :habit="selectedHabit!"/>
  </div>
</template>

<script setup lang="ts">
import { useHabitsStore } from "@/store/habitsStore";
import { IonBackdrop, IonButton, IonIcon, IonActionSheet } from "@ionic/vue";
import { getDayOfYear } from "date-fns";
import { closeOutline, calendarOutline, trashBinOutline, pencilOutline } from "ionicons/icons";
import { storeToRefs } from "pinia";
import HabitCreateModal from "../HabitCreateModal/HabitCreateModal.vue";
import { computed, ref } from "vue";
import CalendarModal from "../CalendarModal";
import { Habit } from "@/types";

const dayBorder = getDayOfYear(new Date());

const isModalOpen = ref(false);

const handleCreateHabit = (data: Habit) => {
  habitsStore.updateHabit(data)
  isModalOpen.value = false
}

const habitsStore = useHabitsStore();
const isCalendarModalOpen = ref(false)

const { isHabitEditModalOpen, selectedHabitId } = storeToRefs(habitsStore);

const selectedHabit = habitsStore.getHabitById(selectedHabitId.value);

const handleToggle = (_date: string) => {
  habitsStore.setHabitStats(_date, selectedHabitId.value as string)
}

const actionSheetButtons = [
  {
    text: "Удалить",
    role: "destructive",
    icon: trashBinOutline,
    handler: () => {
      habitsStore.removeHabitById(selectedHabit?.id as string)
      habitsStore.selectedHabitId = null;
      habitsStore.isHabitEditModalOpen = false;
    },
    data: {
      action: "delete",
    },
  },
  {
    text: "Отмена",
    icon: closeOutline,
    role: "cancel",
    data: {
      action: "cancel",
    },
  },
];


const toggleCheck = () => {
  const date = new Date();
  habitsStore.setHabitStats(date.toISOString(), selectedHabit?.id as string)
};

const isChecked = (day: number) => {
  let date = new Date(new Date().getFullYear(), 0);
  date = new Date(date.setDate(day));
  return habitsStatistic.value.includes(date.toISOString());
};
const color = computed(() => selectedHabit?.color);

const habitsStatistic = computed(() => habitsStore.habitsStatistic?.[selectedHabitId.value as string] ?? []);
</script>

<style scoped lang="scss">

ion-button {
  --background: v-bind(selectedHabit?.color);
  margin: 0;
  color: #fff;
}

.cell {
  height: 8px;
  width: 8px;
  background-color: v-bind(color);
  border-radius: 2px;
  opacity: 0.5;
}

.header-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 8px;
  color: #fff;

  & > h5, p {
    text-overflow: ellipsis;
    overflow: hidden;
  }
}

.mark-checked {
  display: flex;
  align-items: center;
  justify-content: center;

  &::before {
    content: '';
    height: 5px;
    width: 5px;
    display: block;
    background-color: #fff;
    border-radius: 50%;
  }
}

ion-action-sheet {
   &:deep(.action-sheet-wrapper) {
    border-radius: 16px;
    overflow: hidden;
   }
 
  
}

.footer {
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #fff;
}

.title {
  margin: 0;
}

.desc {
  margin: 8px 0 0 0;
}

.mark {
  height: 15px;
  width: 15px;
  border: 1px solid #fff;
  border-radius: 50%;
  margin-right: 8px;
}

.header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 16px;
  flex-wrap: nowrap;
  overflow: hidden;
}

.grid {
  display: grid;

  grid-template-rows: repeat(5, 1fr);
  grid-auto-flow: column;
  gap: 4px;
  overflow: auto;
  margin-top: 8px;
}

.cell-checked {
  opacity: 1;
}

.content {
  top: 50%;
  left: 50%;
  transform: translateY(-50%) translateX(-50%);
  z-index: 100;
  /* background: var(--ion-background-color, #fff); */
  width: calc(100% - 20px);
  height: 100px;
  border-radius: 10px;
  position: absolute;
}

ion-backdrop {
  background: #121212;
  opacity: 0.9;
  z-index: 20;
}

.pop-enter-active,
.pop-leave-active {
  transition: transform 0.4s cubic-bezier(0.5, 0, 0.5, 1), opacity 0.4s linear;
}

.pop-enter,
.pop-leave-to {
  opacity: 0;
  transform: scale(0.3) translateY(-50%);
}
</style>
