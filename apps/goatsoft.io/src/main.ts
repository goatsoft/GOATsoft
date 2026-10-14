import { createApp } from 'vue'
import { prepareAurora } from '@goatsoft/aurora'
import { firstScreenBackgrounds } from '@/infrastructure/graphics/backgrounds.ts'
import App from './presentation/App.vue'
import './presentation/assets/css/main.css'

// Start Aurora's GPU and compile the first screen's shaders while Vue mounts, so the
// backgrounds draw on their first frame. The inline script in index.html has already set
// the appearance class. @see ADR 0014
const touch = matchMedia('(hover: none), (pointer: coarse)').matches
void prepareAurora(...firstScreenBackgrounds(document.documentElement.classList.contains('dark') ? 'dark' : 'light', touch))

createApp(App).mount('#app')
