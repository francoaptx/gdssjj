import PrimeVue from 'primevue/config';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Dropdown from 'primevue/dropdown';
import Calendar from 'primevue/calendar';
import Card from 'primevue/card';

// Import PrimeVue base styles

export default {
  install(app) {
    app.use(PrimeVue, { ripple: true });
    
    // Register components globally
    app.component('Button', Button);
    app.component('DataTable', DataTable);
    app.component('Column', Column);
    app.component('Tag', Tag);
    app.component('Dialog', Dialog);
    app.component('InputText', InputText);
    app.component('Textarea', Textarea);
    app.component('Dropdown', Dropdown);
    app.component('Calendar', Calendar);
    app.component('Card', Card);
  }
};