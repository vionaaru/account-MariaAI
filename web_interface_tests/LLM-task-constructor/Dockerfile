# Используем образ Node.js
FROM node:18-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json для установки зависимостей
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install --prefer-offline --verbose

# Копируем весь код проекта
COPY . .

# Открываем порт для приложения
EXPOSE 5173

# Запускаем проект
CMD ["npm", "run", "dev"]
