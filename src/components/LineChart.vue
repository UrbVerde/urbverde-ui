<template>
  <table id="line-chart" class="charts-css line multiple show-labels hide-data">
    <tbody>
      <tr>
        <td style="--start: 0.1; --size: 0.5">
          <span class="data"> 50 </span>
        </td>
      </tr>

      <tr>
        <td style="--start: 0.5; --size: 0.8">
          <span class="data"> 80 </span>
        </td>
      </tr>

      <tr>
        <td style="--start: 0.8; --size: 0.4">
          <span class="data"> 40 </span>
        </td>
      </tr>

      <tr>
        <td style="--start: 0.4; --size: 0.6">
          <span class="data"> 60 </span>
        </td>
      </tr>
      <tr>
        <td style="--start: 0.6; --size: 0.7">
          <span class="data"> 70 </span>
        </td>
      </tr>
      <tr>
        <td style="--start: 0.7; --size: 0.9">
          <span class="data"> 90 </span>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {};
</script>

<style scoped lang="scss">
#line-chart {
  height: 200px;
  max-width: 400px;
  margin: 0 auto;
  background-color: #f6f6f6;
}
</style>
