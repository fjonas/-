import {extract} from "../../libs";
import _ from "lodash";
import Vue from "vue";

const state = {
    storageData: {}
};

const getters = {
    extracts: state => {
        let formated = [];
        for (let [url, content] of Object.entries(state.storageData)) {
            for (let each of content) {
                formated.push({
                    ...each,
                    url
                })
            }
        }
        formated = _.groupBy(formated, `title`);
        return formated;
    }
};

const mutations = {
    [`extract/set`](state, data) {
        Vue.set(state, `storageData`, data);
    }
};

const actions = {
    [`extract/getFromStorage`]({commit}) {
        extract.get()
            .then(res => {
                commit(`extract/set`, res);
            })
    },
    [`extract/clear`]({commit}, {each}) {
        extract.clear(each.url, each.content);
    }
};

export default {
    state,
    getters,
    mutations,
    actions
}