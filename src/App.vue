<template>
  <div id="app">
    <form>
      <label>Original Specific Gravity</label>
      <input type="number" step="0.001" v-model.number="og_specific_gravity" />

      <label>Original Temperature</label>
      <input type="number" v-model.number="og_temperature" />

      <hr/>

      <label>Final Specific Gravity</label>
      <input type="number" step="0.001"  v-model.number="fn_specific_gravity" />

      <label>Final Temperature</label>
      <input type="number" v-model.number="fn_temperature" />
    </form>

    <hr/>

    <table>
      <tr>
        <th>ABV</th>
        <th>Calories</th>
      </tr>
      <tr>
        <td>{{ abv }}%</td>
        <td>{{ calories }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      og_specific_gravity: 1.05,
      og_temperature: 78,
      fn_specific_gravity: 1.00,
      fn_temperature: 78
    }
  },
  computed: {
    og () {
      return this.correct_gravity(this.og_specific_gravity, this.og_temperature);
    },
    fg () {
      return this.correct_gravity(this.fn_specific_gravity, this.fn_temperature);
    },
    abv () {
      return this.round((76.08 * (this.og-this.fg) / (1.775-this.og)) * (this.fg / 0.794), 2);
    },
    calories () {
      return this.round(3621 * this.fg * (((0.8114 * this.fg) + (0.1886 * this.og) - 1) + (0.53 * ((this.og - this.fg) / (1.775 - this.og)))));
    }
  },
  methods: {
    correct_gravity (observed, temp) {
      let callibration_temp = 68;
      let correction = ((1.00130346 - 0.000134722124 * temp + 0.00000204052596 * Math.pow(temp, 2) - 0.00000000232820948 * Math.pow(temp, 3)) / (1.00130346 - 0.000134722124 * callibration_temp + 0.00000204052596 * Math.pow(callibration_temp, 2) - 0.00000000232820948 * Math.pow(callibration_temp, 3)));

      return observed * correction;
    },
    round (number, places = 0) {
      return Math.round(Math.pow(10, places) * number) / Math.pow(10, places);
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
