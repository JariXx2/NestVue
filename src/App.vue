<template>
  <div class="container">
    <div class="dropdown">
      <div class="selected" @click="toggleDropdown">
        <span v-if="isDropdownOpen">
          <span>✔️</span>
          {{ selectedOption }}
        </span>
        <span v-else>Создать: {{ selectedOption }}</span>
        <span class="arrow">{{ isDropdownOpen ? '▲' : '▼' }}</span>
      </div>

      <transition name="slide-fade">
        <div v-if="isDropdownOpen" class="options">
          <div v-for="option in filteredOptions" :key="option" @click="selectOption(option)" class="option">
            <span>&nbsp;&nbsp;</span>
            {{ option }}
          </div>

        </div>
      </transition>
    </div>
    <br /><br />
    <button :disabled="isLoading || isButtonDisabled" @click="sendData"
      :class="['create-button', { 'disabled-style': isButtonDisabled }]"
      :style="{ width: isLoading ? '48px' : '200px' }">
      <div v-if="isLoading" class="loader"></div>
      <span v-else>Создать</span>
    </button>
    <br><br>
    <div class="output">
      <div v-for="object in output" :key="object">
        {{ object.name }} : {{ object.id }}
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      options: ['Сделка', 'Контакт', 'Компания', 'Не выбрано'],
      selectedOption: 'Не выбрано',
      isDropdownOpen: false,
      isLoading: false,
      output: []
    };
  },
  computed: {
    isButtonDisabled() {
      return this.selectedOption === 'Не выбрано';
    },
    filteredOptions() {
      return this.options.filter(option => option !== this.selectedOption);
    },
  },
  methods: {
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    selectOption(option) {
      this.selectedOption = option;
      this.isDropdownOpen = false;
    },
    async sendData() {
      this.isLoading = true;
      try {
        const data = { option: this.selectedOption };
        const response = await axios.post('http://localhost:3000/api/create', data);

        if (response.data.success) {
          this.output.push({ name: this.selectedOption, id: response.data.result.id });
          this.selectedOption = 'Не выбрано';
        } else {
          console.error('Ошибка при создании:', response.data.message);
          alert(`Ошибка: ${response.data.message}`); 
        }
      } catch (error) {
        console.error('Ошибка при отправке данных:', error);
        alert('Произошла ошибка при отправке данных');
      } finally {
        this.isLoading = false;
      }
    },

  },
};
</script>

<style scoped>
/* Стили для контейнера */
.container {
  position: relative;
  width: 250px;
  text-align: center;
}

/* Стили для выпадающего списка */
.dropdown {
  position: relative;
  width: 100%;
}

.selected {
  padding: 10px;
  border: 1px solid #ccc;
  cursor: pointer;
  background-color: #f9f9f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.arrow {
  margin-left: 10px;
}

.options {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  border: 1px solid #ccc;
  background-color: white;
  z-index: 1000;
  width: 100%;
  box-sizing: border-box;
}

.option {
  padding: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.option:hover {
  background-color: #f0f0f0;
}

/* Анимация появления */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

/* Стили для кнопки */
.create-button {
  padding: 12px 24px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
  margin: 0 auto;
  display: block;
  background-color: #007bff !important;
  color: white !important;
  position: relative;
  overflow: hidden;
  min-height: 48px;
}

/* Стили для неактивной кнопки */
.disabled-style {
  background-color: #ddd !important;
  color: black !important;
  cursor: not-allowed;
}

/* Стили для анимации загрузки */
.loader {
  border: 5px solid rgba(255, 255, 255, 0.3);
  border-top: 5px solid #fff;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  display: inline-block;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-sizing: border-box;
}

@keyframes spin {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }

  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

/* Стили для курсора во время загрузки */
.create-button:disabled {
  cursor: not-allowed;
}

</style>
