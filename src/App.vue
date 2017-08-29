<template>
  <div id="app">
    <form class="col span1of1 pt3">
      <fieldset class="ptb3 form-fieldset mb3">
        <label class="body mt0 mb1">Original Specific Gravity</label>
        <input class="form-input mb3" type="number" step="0.001" v-model.number="og_specific_gravity" />

        <label class="body mt0 mb1">Original Temperature</label>
        <input class="form-input" type="number" v-model.number="og_temperature" />
      </fieldset>

      <fieldset class="ptb3 form-fieldset">
        <label class="body mt0 mb1">Final Specific Gravity</label>
        <input class="form-input mb3" type="number" step="0.001"  v-model.number="fn_specific_gravity" />

        <label class="body mt0 mb1">Final Temperature</label>
        <input class="form-input" type="number" v-model.number="fn_temperature" />
      </fieldset>
    </form>

    <hr class="mtb3" />

    <div class="col span1of1 pb3">
      <h2 class="heading center">Results</h2>

      <dl class="dl">
        <dt class="subheading">ABV</dt>
        <dd class="body mb3">{{ abv }}%</dd>

        <dt class="subheading">Estimated Calories <small class="small">/ 12 oz.</small></dt>
        <dd class="body mb3">{{ calories }}</dd>

        <dt class="subheading">Real Attenuation</dt>
        <dd class="body">{{ real_attenuation }}</dd>
      </dl>
    </div>
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
      return this.round((76.08 * (this.og - this.fg) / (1.775 - this.og)) * (this.fg / 0.794), 2);
    },
    calories () {
      return this.round(3621 * this.fg * (((0.8114 * this.fg) + (0.1886 * this.og) - 1) + (0.53 * ((this.og - this.fg) / (1.775 - this.og)))));
    },
    real_attenuation () {
      return this.round(((this.og - 1) - (this.fg - 1)) / (this.og - 1) * 81.4, 1);
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
