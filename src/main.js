import { createApp } from 'vue'

import App from './App.vue'
import Opening from './components/Opening.vue'
import StartPage from './components/StartPage.vue'

const app = createApp(App);

app.component('opening-component', Opening);
app.component('start-page', StartPage)

app.mount('#app');
