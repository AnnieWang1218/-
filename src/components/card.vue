<template>
  <div>
    <p class="card">
      {{text}}
    </p>
  </div>
</template>

<script>
import myMixin from '../mixins/Demo'
export default {
  mixins: [myMixin]
}
</script>

<style>
.card {
  padding: 10px;
}
</style>
