import Vue from "vue";
import PouchDB from "pouchdb";

PouchDB.plugin(require('pouchdb-find'));
PouchDB.plugin(require('pouchdb-live-find'));
PouchDB.debug.disable();

Vue.use(require('vue-pouch'), {
  pouch: PouchDB,
  defaultDB: new PouchDB("brewdb")
});
