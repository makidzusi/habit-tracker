<template>
  <ion-modal
    ref="modal"
    :is-open="isOpen"
    :initial-breakpoint="1"
    :breakpoints="[0, 1]"
    @ionModalDidDismiss="isOpen = false"
  >
    <div class="block">
      <ion-datetime
        presentation="date"
        :highlighted-dates="mixedDates"
        size="cover"
        @ion-change="handleDateChange"
        :value="new Date().toISOString()"
      ></ion-datetime>
    </div>
  </ion-modal>
</template>

<script lang="ts" setup>
import { Habit } from "@/types";
import { IonModal, IonDatetime } from "@ionic/vue";
import { computed } from "vue";

const isOpen = defineModel();
const props = defineProps<{
  highlitedDates: string[];
  habit: Habit;
}>();

const emit = defineEmits<{
  toggleMark: [value: string];
}>();

const formatNum = (num: number) => (num < 9 ? `0${num}` : num);

const getFormatedDate = (_date: string) => {
  const date = new Date(_date);

  return `${date.getFullYear()}-${formatNum(date.getMonth() + 1)}-${formatNum(
    date.getDate()
  )}`;
};

const mixedDates = computed(() => {
  const dates = props.highlitedDates.map((el) => ({
    date: getFormatedDate(el),
    backgroundColor: props.habit.color,
  }));

  return dates;
});

const handleDateChange = (e: any) => {
  emit("toggleMark", e.detail.value);
};
</script>

<style scoped lang="scss">
.block {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

ion-modal {
  --height: auto;

  &:deep(.ion-page) {
    border-radius: 16px 16px 0 0;
    overflow: hidden;
  }
}
</style>
