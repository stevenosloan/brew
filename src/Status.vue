<template>
  <div :class="status_class">
    {{ status }}: <span v-if="!$pouch.loading.brewdb">{{ message.text }}</span>
  </div>
</template>

<script>
import * as OfflinePluginRuntime from "offline-plugin/runtime";

export default {
  name: "status",

  data () {
    return {
      status: "unknown"
    }
  },

  computed: {
    status_class () {
      switch (this.status) {
        case "online":
          return "status status-online";
        case "offline":
          return "status status-offline";
        case "updating":
          return "status status-updating";
        default:
          return "status status-unknown";
      }
    }
  },

  methods: {
    updateStatus () {
      let previous = this.status;
      let new_status = window.navigator.onLine ? "online" : "offline";
      this.status = new_status;

      let message = this.message;
      console.log('message', message);

      if (message !== null) {
        message.text = `status changed from ${previous} to ${new_status}`

        this.$pouch.put("brewdb", message, {})
            .then((data) => { console.log(data) })
            .catch((err) => { console.log(err) });
      }
    }
  },

  pouch: {
    message () {
      return {
        database: "brewdb",
        selector: {_id: "message"},
        first: true
      }
    }
  },

  created () {
    this.$pouch.sync("brewdb", "http://localhost:5984/brewdb");

    console.log(this.$pouch);
    console.log(this);

    OfflinePluginRuntime.install({
      onUpdating: () => {
        this.status = "updating";
        console.log('SW Event:', 'onUpdating');
      },
      onUpdateReady: () => {
        console.log('SW Event:', 'onUpdateReady');
        // Tells to new SW to take control immediately
        OfflinePluginRuntime.applyUpdate();
      },
      onUpdated: () => {
        console.log('SW Event:', 'onUpdated');
        // Reload the webpage to load into the new version
        window.location.reload();
      },

      onUpdateFailed: () => {
        this.updateStatus();
        console.log('SW Event:', 'onUpdateFailed');
      }
    });

    this.updateStatus();
    window.addEventListener('online',  this.updateStatus);
    window.addEventListener('offline', this.updateStatus);
  },
}
</script>
