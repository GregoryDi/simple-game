<template>
    <main>
        <Home />
    </main>
</template>

<script>
import { defineComponent } from 'vue';
import Home from './components/Home.vue';

export default defineComponent({
    components: { Home },
});
</script>

<style scoped>
header {
    display: flex;
    place-items: center;
}

.logo {
    margin: 0 2rem 0 0;
}

header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
}
</style>
