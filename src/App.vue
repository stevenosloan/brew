<template>
  <div id="app">
    <nav class="tab-nav ptb3">
      <a href="#input" :class="input_active" v-on:click.prevent="display('input')">Input</a>
      <a href="#output" :class="output_active" v-on:click.prevent="display('output')">Output</a>
    </nav>

    <div :class="input_tabclass" id="input">
      <form class="col span1of1">
        <fieldset class="ptb3 form-fieldset mb3">
          <label class="body mt0 mb1">Original Specific Gravity</label>
          <input class="form-input mb3" type="number" step="0.001" v-model.number="og_specific_gravity" />

          <label class="body mt0 mb1">Original Temperature</label>
          <input class="form-input" pattern="\d*" type="number" v-model.number="og_temperature" />
        </fieldset>

        <fieldset class="ptb3 form-fieldset">
          <label class="body mt0 mb1">Final Specific Gravity</label>
          <input class="form-input mb3" type="number" step="0.001"  v-model.number="fn_specific_gravity" />

          <label class="body mt0 mb1">Final Temperature</label>
          <input class="form-input" pattern="\d*" type="number" v-model.number="fn_temperature" />
        </fieldset>
      </form>
    </div>

    <div :class="output_tabclass" id="output">
      <div class="col span1of1">

        <fieldset class="ptb3 form-fieldset mb3">
          <label class="body mt0 mb1">ABV</label>
          <div class="form-input mb3">{{ abv }}%</div>

          <label class="body mt0 mb1">Estimated Calories <small class="small">/ 12 oz.</small></label>
          <div class="form-input mb3">{{ calories }}</div>

          <label class="body mt0 mb1">Real Attenuation</label>
          <div class="form-input mb3">{{ real_attenuation }}%</div>
        </fieldset>
      </div>
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
      fn_temperature: 78,
      active_tab: "input"
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
    },
    output_tabclass () {
      return this.tabClass('output');
    },
    input_tabclass () {
      return this.tabClass('input');
    },
    input_active () {
      return this.active_tab === "input" ? "active" : "";
    },
    output_active () {
      return this.active_tab === "output" ? "active" : "";
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
    },
    display (name) {
      this.active_tab = name;
    },
    tabClass (name) {
      return `tab ${this.active_tab === name ? 'tab-active' : 'tab-hidden'}`;
    }
  }
}
</script>
