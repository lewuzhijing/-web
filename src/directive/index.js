
// import copy from "./copy";
// import longpress from "./longpress"
import debounce from "./debounce";
// import emoji from "./emoji";
// import LazyLoad from "./LazyLoad";
// import permission from "./permission";
// import waterMarker from "./waterMarker";
// import draggable from "./draggable";
// import empty from "./empty";
import Vue from "vue";
const directives = {
    // copy,longpress,
    debounce: debounce,

    // ,emoji,LazyLoad,permission,waterMarker,draggable,empty
};

export default {
    install(Vue) {
        Object.keys(directives).forEach((key) => {
            Vue.directive(key, directives[key]);
        });
    },



};
