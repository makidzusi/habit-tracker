<template>
  <ion-modal
    @ionModalWillPresent="handleMount"
    v-model:is-open="isOpen"
    @ionModalDidDismiss="isOpen = false"
  >
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ modalTitle }}</ion-title>
        <ion-buttons slot="start">
          <ion-button @click="setOpen(false)">
            <ion-icon :icon="close" />
          </ion-button>
        </ion-buttons>
        <ion-buttons slot="end">
          <ion-button :disabled="isCreatable" @click="createHabit">
            <ion-icon :icon="checkmarkCircle" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-input
        class="ion-margin-bottom"
        label="Название"
        label-placement="stacked"
        v-model="title"
        placeholder="Введите название привычки"
        fill="outline"
      ></ion-input>
      <ion-input
        label="Описание"
        label-placement="stacked"
        v-model="description"
        placeholder="Введите описание привычки"
        fill="outline"
      ></ion-input>
      <div>
        <h6>Цвет</h6>
        <div class="grid">
          <button
            @click="selectedColorIndex = idx"
            class="cell"
            :class="idx === selectedColorIndex ? 'cell-selected' : ''"
            v-for="(color, idx) in colors"
            :key="`color-${idx}`"
            :style="{
              backgroundColor: color,
            }"
          ></button>
          <label
            class="color-picker"
            :style="{
              backgroundColor: customColor,
            }"
          >
            <input :value="customColor" @change="handleColor" type="color" />
          </label>
        </div>
      </div>
      <div>
        <h5>Иконка привычки</h5>
        <h6>Спорт</h6>
        <div class="grid">
          <IonIcon
            @click="selectedIcon = key"
            class="icon"
            :class="key === selectedIcon ? 'icon-selected' : ''"
            v-for="(icon, key) in sportIcons"
            size="large"
            :icon="icon"
            :key="key"
          ></IonIcon>
        </div>
        <h6>Активности</h6>
        <div class="grid">
          <IonIcon
            @click="selectedIcon = key"
            class="icon"
            :class="key === selectedIcon ? 'icon-selected' : ''"
            v-for="(icon, key) in activityIcons"
            size="large"
            :icon="icon"
            :key="key"
          ></IonIcon>
        </div>
        <h6>Исскуство</h6>
        <div class="grid">
          <IonIcon
            @click="selectedIcon = key"
            class="icon"
            :class="key === selectedIcon ? 'icon-selected' : ''"
            v-for="(icon, key) in artIcons"
            size="large"
            :icon="icon"
            :key="key"
          ></IonIcon>
        </div>
      </div>
    </ion-content>
  </ion-modal>
</template>

<script lang="ts" setup>
import { Habit } from "@/types";
import {
  IonButtons,
  IonButton,
  IonModal,
  IonHeader,
  IonToolbar,
  IonContent,
  IonTitle,
  IonIcon,
  IonInput,
} from "@ionic/vue";
import { close, checkmarkCircle } from "ionicons/icons";
import { computed, ref } from "vue";
import { sportIcons, activityIcons, artIcons } from "@/constants";
import { v4 as uuidv4 } from "uuid";

const emit = defineEmits<{
  createHabit: [value: Habit];
}>();

const props = defineProps<{
  isEdit?: boolean;
  habit?: Habit;
}>();

const handleMount = () => {
  if (props.isEdit) {
    const habit = props.habit;
    title.value = habit?.title ?? "";
    description.value = habit?.description ?? "";
    selectedColorIndex.value = null;
    customColor.value = habit?.color ?? "#fff";
    selectedIcon.value = habit?.icon ?? Object.keys(sportIcons)[0];
  }
};

const modalTitle = computed(() =>
  props?.isEdit ? "Редактирование" : "Новая привычка"
);
const isOpen = defineModel();
const selectedColorIndex = ref<number | null>(0);
const title = ref("");
const description = ref("");
const selectedIcon = ref(Object.keys(sportIcons)[0]);
const customColor = ref("#000");

const handleColor = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.value) {
    customColor.value = target.value;
  }
};

const createHabit = () => {
  emit("createHabit", {
    title: title.value,
    description: description.value,
    color: selectedColorIndex.value
      ? colors[selectedColorIndex.value]
      : customColor.value,
    icon: selectedIcon.value,
    id: props.habit?.id ?? uuidv4(),
  });
  title.value = "";
  description.value = "";
  selectedColorIndex.value = 0;
};

const colors = [
  "#45F0DF",
  "#8789C0",
  "#C2CAE8",
  "#8380B6",
  "#111D4A",
  "#B39CD0",
  "#FBEAFF",
  "#00C9A7",
  "#4B4453",
  "#C34A36",
  "#FF8066",
  "#845EC2",
  "#4E8397",
  "#926C00",
  "#008BC9",
  "#4B4453",
  "#009EFA",
  "#00D2FC",
  "#C493FF",
  "#005B44",
];

const isCreatable = computed(() => !title.value.length);

const setOpen = (open: boolean) => (isOpen.value = open);
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
.grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}
.cell {
  width: 30px;
  height: 30px;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cell-selected {
  &::before {
    display: block;
    height: 15px;
    width: 15px;
    background-color: var(--ion-color-dark);
    border-radius: 50%;
    content: "";
  }
}

.icon {
  padding: 4px;
  background-color: var(--ion-toolbar-background);
  border-radius: 4px;
  height: 35px;
  width: 35px;
}

.icon-selected {
  border: 1px solid var(--ion-color-dark, #fff);
  height: 34px;
  width: 34px;
}

.color-picker {
  height: 30px;
  width: 30px;
  border-radius: 50%;
  input {
    display: none;
  }
}
</style>
