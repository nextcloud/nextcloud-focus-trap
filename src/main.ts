import { createApp } from 'vue';
import './style.css';
import 'floating-vue/dist/style.css';

import Root from './Root.vue';

const app = createApp(Root);

app.mount('#app');
