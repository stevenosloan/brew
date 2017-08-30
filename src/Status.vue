<template>
  <div :class="status_class">
    {{ status }}
  </div>
</template>

<script>
import * as OfflinePluginRuntime from "offline-plugin/runtime";

export default {
  name: "status",

  data () {
    return {
      status: "unkown"
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
      this.status = window.navigator.onLine ? "online" : "offline";
    }
  },

  created () {
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
