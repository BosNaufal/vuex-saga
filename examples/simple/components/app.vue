
<template>
  <div>
    <h1>Halo {{ $store.state.count }}</h1>
  </div>
</template>

<script>

  import store from '../vuex/index.js'
  import { mapSagas } from '../../../dist/vuex-saga.js';

  export default {

    store,

    methods: {
      ...mapSagas({
        test: 'test'
      })
    },

    created() {
      this.test({ data: "payload" })
      .then((res) => {
        console.log(res);
      })
    }


  }

</script>
