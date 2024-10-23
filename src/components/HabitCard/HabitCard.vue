<template>
  <div class="card">
    <IonRow class="ion-justify-content-between card-wrap">
      <div class="card-head">
        <div class="card-icon">
          <IonIcon :icon="icons[habit.icon]" size="large" />
        </div>
        <div class="card-text">
          <h4 class="card-title">
            {{ habit.title }}
          </h4>
          <p v-if="habit.description" class="card-desc">
            {{ habit.description }}
          </p>
        </div>
      </div>
      <IonButton
        class="card-button"
        :class="isChecked(dayBorder) ? 'card-button-active' : ''"
        @click="toggleCheck"
      >
        <ion-icon
          size="large"
          :style="{
            color: 'white !important',
          }"
          :icon="checkmarkOutline"
        />
      </IonButton>
    </IonRow>
    <div class="grid" ref="grid" @click="habitsStore.triggerEditModal(habit.id)">
      <div
        class="cell"
        v-for="day in dayBorder"
        :class="isChecked(day) ? 'cell-checked' : ''"
        :key="day"
      ></div>
    </div>
    <CalendarModal v-model="isCalendarModalOpen" @toggle-mark="handleToggle" :habit="habit" :highlited-dates="habitsStatistic"/>
  </div>
</template>

<script setup lang="ts">
import { Habit } from "@/types";
import { IonButton, IonIcon, IonRow } from "@ionic/vue";
import { checkmarkOutline } from "ionicons/icons";
import { computed, ref, onMounted } from "vue";
import * as icons from "ionicons/icons";
import { getDayOfYear } from "date-fns";
import CalendarModal from '@/components/CalendarModal'
import { useHabitsStore } from "@/store/habitsStore";

const props = defineProps<{
  habit: Habit;
}>();

const dayBorder = getDayOfYear(new Date());
const isCalendarModalOpen = ref(false);
const grid = ref<HTMLInputElement | null>(null)
const habitsStore = useHabitsStore()

onMounted(() => {
  if(grid.value) {
    grid.value.scrollLeft = grid.value.scrollWidth
  }
})

const toggleCheck = () => {
  const date = new Date();
  habitsStore.setHabitStats(date.toISOString(), props.habit.id as string)
};

const handleToggle = (_date: string) => {
  habitsStore.setHabitStats(_date, props.habit.id as string)
}

const isChecked = (day: number) => {
  let date = new Date(new Date().getFullYear(), 0);
  date = new Date(date.setDate(day));
  return habitsStatistic.value.includes(date.toISOString());
};

const habitsStatistic = computed(() => habitsStore.habitsStatistic?.[props.habit.id] ?? []);

const color = computed(() => props.habit.color);

const opacityColor = computed(() => addAlpha(color.value, 0.6))

function addAlpha(color: string, opacity: number) {
    const _opacity = Math.round(Math.min(Math.max(opacity ?? 1, 0), 1) * 255);
    return color + _opacity.toString(16).toUpperCase();
}

</script>

<style scoped lang="scss">
.card {
  padding: 4px 12px 12px 12px;
  background-color: var(--ion-toolbar-background);
  border-radius: 8px;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 3px 1px -2px,
    rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px;
}

.card-text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-right: 8px;
  overflow: hidden;
}

ion-button {
  --background: v-bind(color);
  --background-hover: v-bind(color);
  --background-activated: v-bind(color);
  --background-focused: v-bind(color);
}

.card-head {
  display: flex;
  overflow: hidden;
  align-items: center;
  white-space: nowrap;
}

.card-wrap {
  flex-wrap: nowrap;
  text-overflow: ellipsis;
}

.card-button {
  width: 40px;
  height: 40px;
  font-size: 10px;
  opacity: 0.5;
}

.card-button-active {
  opacity: 1;
}

.card-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: v-bind(opacityColor);
  padding: 2px;
  border-radius: 4px;
  margin-right: 16px;
}

.card-title {
  margin: 0;
  font-size: 16px;
  margin-bottom: 4px;
  text-overflow: ellipsis;
  overflow: hidden;
}

.card-desc {
  margin: 0;
  font-size: 14px;
  text-overflow: ellipsis;
  overflow: hidden;
}

.cell {
  height: 10px;
  width: 10px;
  background-color: v-bind(color);
  border-radius: 4px;
  opacity: 0.5;
}

.cell-checked {
  opacity: 1;
}

.grid {
  display: grid;

  grid-template-rows: repeat(5, 1fr);
  grid-auto-flow: column;
  gap: 4px;
  overflow: auto;
  margin-top: 8px;
}
</style>
