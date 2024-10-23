import { Habit } from "@/types";
import { defineStore } from "pinia";
import { ref } from "vue";
import { Storage } from '@ionic/storage';

const HABITS_KEY = 'habits'
const store = new Storage();

export const useHabitsStore = defineStore('habits', () =>{
    const habits = ref<Habit[]>([])
    const isHabitEditModalOpen = ref(false);
    const selectedHabitId = ref<string | null | number>(null)
    const habitsStatistic = ref<any>({})

    const initHabits = async () => {
        await store.create();
        const savedItems = await store.get(HABITS_KEY)

      
        if(savedItems) {
          habits.value = savedItems;
          habits.value.forEach(async (el) => {
            habitsStatistic.value[el.id] = await store.get(el.id as string) ?? []
          })
        }
    }

    const triggerEditModal = (id: string | number) => {
      selectedHabitId.value = id;
      isHabitEditModalOpen.value = true
    }

    const saveHabit = async (data: Habit) => {
        const savedItems = await store.get(HABITS_KEY)
        habits.value.push(data);
      
        if(savedItems) {
          store.set(HABITS_KEY, [...savedItems, data])
        } else{
          store.set(HABITS_KEY, [data])
        }
    }

    const updateHabit = async (data: Habit) => {
      habits.value = habits.value.map(el => {
        if(el.id === data.id) {
          return {
            ...data
          }
        }
        return el
      })
      await store.set(HABITS_KEY, habits.value.map((el) => ({
        ...el
      })));
    }

    const getHabitStatsById = (id: string | number) => habitsStatistic.value?.[id]

    const setHabitStats = async (_date: string, id: any) => {
      let stats  = getHabitStatsById(id)
        const date = new Date(_date)
        date.setHours(0, 0, 0, 0)
        const day = date.toISOString()
      if(!stats) {
        habitsStatistic.value[id] = [day]
        await store.set(id, [day])
      } else {
        const isIncluded = stats.find((el: string) => el === day)
        if(isIncluded) {
          stats = [...stats.filter((el: string) => el !== day)]
          habitsStatistic.value[id] = stats;
          await store.set(id, [...stats])
        } else {
          stats.push(day)
          await store.set(id, [...stats])
        }
      }
    }

    const getHabitById = (id: string | number | null) => habits.value.find(el => el.id === id)

    const clearHabits = async () => {
        await store.clear()
        habits.value = []
    }

    const removeHabitById = async (id: string) => {
      await store.remove(id)
      habits.value = habits.value.filter(el => el.id !== id);
      console.log(habits.value)
      await store.set(HABITS_KEY, habits.value.map((el) => ({
        ...el
      })));
    }

    return {
        habits,
        initHabits,
        saveHabit,
        clearHabits,
        isHabitEditModalOpen,
        selectedHabitId,
        triggerEditModal,
        getHabitById,
        habitsStatistic,
        getHabitStatsById,
        setHabitStats,
        removeHabitById,
        updateHabit
    }
})