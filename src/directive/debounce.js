
export default {
    inserted: function (el, binding) {
        let timer;
        el.addEventListener("input", () => {
            if (timer) {
                clearTimeout(timer)
            }
            timer = setTimeout(() => {
                binding.value()
            }, 1000)
        })
    }
}
